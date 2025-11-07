// Script para processar a planilha de municípios e criar o CSV
// Este arquivo será executado uma vez para gerar o CSV atualizado

const fs = require('fs');
const path = require('path');

// Ler o arquivo de documento parseado
const docContent = `// Colar todo o conteúdo do documento parseado aqui
// Linhas 6 a 5574 com formato: Município - UF
`;

// Processar linhas
const linhas = docContent.split('\n');
const municipios = [];

for (const linha of linhas) {
  const match = linha.match(/^(\d+):\s*(.+)\s+-\s+([A-Z]{2})$/);
  if (match) {
    const municipio = match[2].trim();
    const uf = match[3].trim();
    municipios.push({ uf, municipio });
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
  csv += `${m.uf},${m.municipio}\n`;
}

// Salvar
fs.writeFileSync(path.join(__dirname, '../src/data/municipios.csv'), csv, 'utf-8');
console.log(`Processados ${municipios.length} municípios`);
