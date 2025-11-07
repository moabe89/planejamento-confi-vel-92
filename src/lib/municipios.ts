/**
 * Utilitário para busca de municípios por UF
 */

import Cidades from '@/data/Cidades.json';
import Estados from '@/data/Estados.json';

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

  // Mapear ID de estado -> Sigla (UF)
  const ufByEstadoId = new Map<string, string>();
  (Estados as Array<{ ID: string; Sigla: string; Nome: string }>).forEach((e) => {
    ufByEstadoId.set(String(e.ID), e.Sigla);
  });

  const itens: Municipio[] = [];
  (Cidades as Array<{ ID: string; Nome: string; Estado: string }>).forEach((c) => {
    const uf = ufByEstadoId.get(String(c.Estado));
    const nome = String(c.Nome || '').trim();
    if (!uf || !nome) return;
    // Valida UF em formato de 2 letras
    if (!/^[A-Z]{2}$/.test(uf)) return;
    itens.push({ uf, municipio: nome });
  });

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
    .map(m => m.municipio)
    .sort((a, b) => a.localeCompare(b));
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
