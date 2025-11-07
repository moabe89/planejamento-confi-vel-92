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
