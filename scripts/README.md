# Script de Processamento de Municípios

Este script processa a planilha XLSX de municípios e gera o arquivo CSV atualizado.

## Como Executar

1. Certifique-se de que o arquivo `municipios-completo-novo.xlsx` está em `src/data/`
2. Execute o script:

```bash
node scripts/processar-municipios.js
```

## O que o script faz

1. Lê o arquivo XLSX de municípios completo
2. Extrai todos os municípios no formato "Município - UF"
3. Ordena por UF e depois por ordem alfabética do município
4. Gera o arquivo CSV em `src/data/municipios.csv`
5. Verifica se municípios específicos (como Rio Verde - GO) estão presentes

## Resultado Esperado

O script processará aproximadamente 5.570 municípios e atualizará o CSV com todos os dados.
