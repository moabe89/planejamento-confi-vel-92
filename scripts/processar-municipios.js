// Script para processar a planilha de municípios e criar/atualizar o CSV com todos os registros
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Caminhos dos arquivos
const arquivoXLSXPreferido = path.join(__dirname, '../src/data/municipios-completo-novo.xlsx');
const arquivoXLSXAlternativo = path.join(__dirname, '../src/data/Municípios-3.xlsx');
const arquivoCSV = path.join(__dirname, '../src/data/municipios.csv');

// Escolhe o XLSX disponível
const caminhoXLSX = fs.existsSync(arquivoXLSXPreferido)
  ? arquivoXLSXPreferido
  : (fs.existsSync(arquivoXLSXAlternativo) ? arquivoXLSXAlternativo : null);

if (!caminhoXLSX) {
  console.error('❌ Nenhum arquivo XLSX encontrado em src/data/.');
  console.error('   Coloque "municipios-completo-novo.xlsx" ou "Municípios-3.xlsx" em src/data/.');
  process.exit(1);
}

// Ler o XLSX (primeira planilha)
const workbook = XLSX.readFile(caminhoXLSX);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Converte para matriz para lidar com diferentes formatos de planilha
const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1, blankrows: false, defval: '' });

// Detecta cabeçalho e colunas (suporta "Município - UF" em uma coluna ou colunas separadas)
let headerRowIndex = 0;
let colCombined = -1;
let colMunicipio = -1;
let colUF = -1;

const MAX_HEADER_SCAN = Math.min(5, dados.length);
for (let r = 0; r < MAX_HEADER_SCAN; r++) {
  const row = dados[r] || [];
  // Cabeçalho combinado
  for (let c = 0; c < row.length; c++) {
    const cell = String(row[c] || '').trim();
    if (/munic[ií]pio\s*-\s*uf/i.test(cell)) {
      headerRowIndex = r;
      colCombined = c;
      break;
    }
  }
  if (colCombined !== -1) break;

  // Cabeçalhos separados
  const idxMun = row.findIndex((v) => /munic[ií]pio/i.test(String(v)));
  const idxUF = row.findIndex((v) => /^\s*uf\s*$/i.test(String(v)));
  if (idxMun !== -1 && idxUF !== -1) {
    headerRowIndex = r;
    colMunicipio = idxMun;
    colUF = idxUF;
    break;
  }
}

// Extrair registros
const registros = [];
for (let i = headerRowIndex + 1; i < dados.length; i++) {
  const row = dados[i] || [];
  let municipio = '';
  let uf = '';

  if (colCombined !== -1) {
    const linha = String(row[colCombined] || '').trim();
    if (!linha) continue;
    const m = linha.match(/^(.+?)\s*-\s*([A-Z]{2})$/i);
    if (m) {
      municipio = m[1].trim();
      uf = m[2].toUpperCase();
    }
  } else if (colMunicipio !== -1 && colUF !== -1) {
    municipio = String(row[colMunicipio] || '').trim();
    uf = String(row[colUF] || '').trim().toUpperCase();
  }

  if (!municipio || !/^[A-Z]{2}$/.test(uf)) continue;
  registros.push({ uf, municipio });
}

// Deduplicar e ordenar
registros.sort((a, b) => (a.uf === b.uf ? a.municipio.localeCompare(b.municipio) : a.uf.localeCompare(b.uf)));
const unico = new Map();
for (const r of registros) unico.set(`${r.uf}|${r.municipio}`, r);
const municipiosXlsx = Array.from(unico.values());

// Carregar CSV atual (se existir) para apontar faltantes
let municipiosCsv = [];
if (fs.existsSync(arquivoCSV)) {
  const raw = fs.readFileSync(arquivoCSV, 'utf-8').replace(/^\uFEFF/, '').split(/\r?\n/);
  for (let i = 1; i < raw.length; i++) { // pular cabeçalho
    const line = raw[i].trim();
    if (!line) continue;
    // Parse CSV simples com aspas
    let inQuotes = false, cur = '', parts = [];
    for (const ch of line) {
      if (ch === '"') { inQuotes = !inQuotes; cur += ch; }
      else if (ch === ',' && !inQuotes) { parts.push(cur); cur = ''; }
      else { cur += ch; }
    }
    parts.push(cur);
    const ufField = (parts[0] || '').replace(/"/g, '').trim();
    let municipioField = (parts[1] || '').trim();
    if (municipioField.startsWith('"') && municipioField.endsWith('"')) {
      municipioField = municipioField.slice(1, -1).replace(/""/g, '"');
    }
    if (ufField && municipioField) municipiosCsv.push({ uf: ufField, municipio: municipioField });
  }
}

const setCsv = new Set(municipiosCsv.map((m) => `${m.uf}|${m.municipio}`));
const setXlsx = new Set(municipiosXlsx.map((m) => `${m.uf}|${m.municipio}`));
const faltantes = [];
for (const key of setXlsx) if (!setCsv.has(key)) faltantes.push(key);

// Lista final (XLSX é fonte autorizada)
let csv = 'uf,municipio\n';
for (const m of municipiosXlsx) {
  const municipioEscapado = /[",]/.test(m.municipio)
    ? `"${m.municipio.replace(/"/g, '""')}"`
    : m.municipio;
  csv += `${m.uf},${municipioEscapado}\n`;
}
fs.writeFileSync(arquivoCSV, csv, 'utf-8');

console.log(`✅ Processados ${municipiosXlsx.length} municípios a partir de: ${path.basename(caminhoXLSX)}`);
console.log(`➕ Adicionados em relação ao CSV anterior: ${faltantes.length}`);
if (faltantes.length) {
  const show = faltantes.slice(0, 20).map((k) => k.replace('|', ' - ')).join('\n');
  console.log('Exemplos de faltantes adicionados:\n' + show + (faltantes.length > 20 ? '\n...' : ''));
}
const confirmado = municipiosXlsx.find((m) => m.uf === 'GO' && m.municipio === 'Rio Verde');
console.log(confirmado ? '✅ Rio Verde - GO confirmado na base de dados' : '⚠️  Rio Verde - GO não encontrado!');

