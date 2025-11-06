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
 * Carrega e parseia a lista de municípios do CSV
 */
function carregarMunicipios(): Municipio[] {
  if (municipiosCache) return municipiosCache;
  
  const linhas = municipiosData.split('\n').slice(1); // Remove header
  municipiosCache = linhas
    .filter(linha => linha.trim())
    .map(linha => {
      const [uf, municipio] = linha.split(',');
      return { uf: uf.trim(), municipio: municipio.trim() };
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
 * Lista de UFs do Brasil
 */
export const UFS = [
  'AC', 'AL', 'AP', 'AM', 'BA', 'CE', 'DF', 'ES', 'GO', 
  'MA', 'MT', 'MS', 'MG', 'PA', 'PB', 'PR', 'PE', 'PI', 
  'RJ', 'RN', 'RS', 'RO', 'RR', 'SC', 'SP', 'SE', 'TO'
] as const;

export type UF = typeof UFS[number];
