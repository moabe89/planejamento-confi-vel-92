/**
 * Utilitário para busca de municípios por UF
 */

import municipiosData from '@/data/municipios.csv?raw';

export interface Municipio {
  uf: string;
  municipio: string;
}

let municipiosCache: Municipio[] | null = null;

/**
 * Divide uma linha CSV respeitando aspas
 */
function splitCsvLine(line: string): string[] {
  const result: string[] = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];

    if (char === '"') {
      // Trata aspas duplas escapadas "" como uma aspas literal
      if (inQuotes && line[i + 1] === '"') {
        current += '"';
        i++; // pular a próxima aspas
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current);
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current);
  return result;
}

/**
 * Carrega e parseia a lista de municípios do CSV
 */
function carregarMunicipios(): Municipio[] {
  if (municipiosCache) return municipiosCache;

  // Remove BOM se existir e normaliza quebras de linha
  const conteudo = municipiosData.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
  const linhas = conteudo.split('\n');

  // Detecta e remove cabeçalho
  const startIndex = linhas[0]?.toLowerCase().startsWith('uf,municipio') ? 1 : 0;

  const itens: Municipio[] = [];
  for (let i = startIndex; i < linhas.length; i++) {
    const linhaBruta = linhas[i];
    if (!linhaBruta || !linhaBruta.trim()) continue;

    const cols = splitCsvLine(linhaBruta.trim());
    if (cols.length < 2) continue;

    const ufRaw = (cols[0] || '').trim();
    let municipioRaw = (cols[1] || '').trim();

    // Remove aspas ao redor se houver
    if (municipioRaw.startsWith('"') && municipioRaw.endsWith('"')) {
      municipioRaw = municipioRaw.slice(1, -1);
    }
    // Converte aspas duplas escapadas
    municipioRaw = municipioRaw.replace(/""/g, '"');

    // Valida UF
    if (!/^[A-Z]{2}$/.test(ufRaw)) continue;

    itens.push({ uf: ufRaw, municipio: municipioRaw });
  }

  // Remover duplicados e ordenar
  const unico = new Map<string, Municipio>();
  for (const m of itens) {
    unico.set(`${m.uf}|${m.municipio}`, m);
  }

  municipiosCache = Array.from(unico.values()).sort((a, b) => {
    if (a.uf !== b.uf) return a.uf.localeCompare(b.uf);
    return a.municipio.localeCompare(b.municipio);
  });

  return municipiosCache;
}

/**
 * Busca municípios por UF
 */
export function buscarMunicipiosPorUF(uf: string): string[] {
  const municipios = carregarMunicipios();
  return municipios
    .filter(m => m.uf === uf)
    .map(m => `${m.municipio} - ${m.uf}`)
    .sort();
}

/**
 * Busca municípios por termo de pesquisa e UF
 */
export function buscarMunicipios(termo: string, uf?: string): Municipio[] {
  const municipios = carregarMunicipios();
  const termoLower = termo.toLowerCase();
  
  return municipios
    .filter(m => {
      const matchTermo = m.municipio.toLowerCase().includes(termoLower);
      const matchUF = !uf || m.uf === uf;
      return matchTermo && matchUF;
    })
    .slice(0, 50); // Limita resultados
}

/**
 * Mapa de UFs para nomes completos dos estados
 */
export const ESTADOS_COMPLETOS: Record<string, string> = {
  'AC': 'Acre',
  'AL': 'Alagoas',
  'AP': 'Amapá',
  'AM': 'Amazonas',
  'BA': 'Bahia',
  'CE': 'Ceará',
  'DF': 'Distrito Federal',
  'ES': 'Espírito Santo',
  'GO': 'Goiás',
  'MA': 'Maranhão',
  'MT': 'Mato Grosso',
  'MS': 'Mato Grosso do Sul',
  'MG': 'Minas Gerais',
  'PA': 'Pará',
  'PB': 'Paraíba',
  'PR': 'Paraná',
  'PE': 'Pernambuco',
  'PI': 'Piauí',
  'RJ': 'Rio de Janeiro',
  'RN': 'Rio Grande do Norte',
  'RS': 'Rio Grande do Sul',
  'RO': 'Rondônia',
  'RR': 'Roraima',
  'SC': 'Santa Catarina',
  'SP': 'São Paulo',
  'SE': 'Sergipe',
  'TO': 'Tocantins'
};

/**
 * Lista de UFs do Brasil
 */
export const UFS = Object.keys(ESTADOS_COMPLETOS);

export type UF = keyof typeof ESTADOS_COMPLETOS;
