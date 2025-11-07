// Script para processar a planilha de municípios e criar o CSV atualizado
const XLSX = require('xlsx');
const fs = require('fs');
const path = require('path');

// Ler o arquivo XLSX
const arquivoXLSX = path.join(__dirname, '../src/data/municipios-completo-novo.xlsx');
const workbook = XLSX.readFile(arquivoXLSX);
const sheetName = workbook.SheetNames[0];
const worksheet = workbook.Sheets[sheetName];

// Converter para JSON
const dados = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

// Processar os dados
const municipios = [];

for (let i = 1; i < dados.length; i++) { // Pular a primeira linha (cabeçalho)
  const linha = dados[i][0]; // A primeira coluna contém "Município - UF"
  
  if (linha && typeof linha === 'string') {
    const match = linha.match(/^(.+?)\s+-\s+([A-Z]{2})$/);
    if (match) {
      const municipio = match[1].trim();
      const uf = match[2].trim();
      municipios.push({ uf, municipio });
    }
  }
}

// Ordenar por UF e depois por município
municipios.sort((a, b) => {
  if (a.uf !== b.uf) return a.uf.localeCompare(b.uf);
  return a.municipio.localeCompare(b.municipio);
});

// Gerar CSV
let csv = 'uf,municipio\n';
for (const m of municipios) {
  // Escapar vírgulas no nome do município
  const municipioEscapado = m.municipio.includes(',') ? `"${m.municipio}"` : m.municipio;
  csv += `${m.uf},${municipioEscapado}\n`;
}

// Salvar o CSV
const arquivoCSV = path.join(__dirname, '../src/data/municipios.csv');
fs.writeFileSync(arquivoCSV, csv, 'utf-8');

console.log(`✅ Processados ${municipios.length} municípios`);
console.log(`📁 CSV salvo em: ${arquivoCSV}`);

// Verificar se Rio Verde - GO está presente
const rioVerde = municipios.find(m => m.municipio === 'Rio Verde' && m.uf === 'GO');
if (rioVerde) {
  console.log('✅ Rio Verde - GO confirmado na base de dados');
} else {
  console.log('⚠️  Rio Verde - GO não encontrado!');
}
