/**
 * Validações e máscaras para formulário de Planejamento Previdenciário
 */

/**
 * Valida CPF usando algoritmo oficial
 */
export function validarCPF(cpf: string): boolean {
  // Remove caracteres não numéricos
  const cpfLimpo = cpf.replace(/\D/g, '');
  
  // Verifica se tem 11 dígitos
  if (cpfLimpo.length !== 11) return false;
  
  // Verifica se todos os dígitos são iguais (CPF inválido)
  if (/^(\d)\1{10}$/.test(cpfLimpo)) return false;
  
  // Valida primeiro dígito verificador
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (10 - i);
  }
  let resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(9))) return false;
  
  // Valida segundo dígito verificador
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpfLimpo.charAt(i)) * (11 - i);
  }
  resto = (soma * 10) % 11;
  if (resto === 10 || resto === 11) resto = 0;
  if (resto !== parseInt(cpfLimpo.charAt(10))) return false;
  
  return true;
}

/**
 * Aplica máscara de CPF (999.999.999-99)
 */
export function maskCpf(value: string): string {
  const numeros = value.replace(/\D/g, '');
  return numeros
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d)/, '$1.$2')
    .replace(/(\d{3})(\d{1,2})$/, '$1-$2')
    .substring(0, 14);
}

/**
 * Valida data no formato dd/mm/aaaa
 */
export function validarDataBR(data: string): boolean {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = data.match(regex);
  
  if (!match) return false;
  
  const dia = parseInt(match[1]);
  const mes = parseInt(match[2]);
  const ano = parseInt(match[3]);
  
  // Verifica intervalos básicos
  if (mes < 1 || mes > 12) return false;
  if (dia < 1 || dia > 31) return false;
  if (ano < 1900 || ano > new Date().getFullYear()) return false;
  
  // Valida dias por mês
  const diasPorMes = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  
  // Ajusta fevereiro em anos bissextos
  if ((ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0) {
    diasPorMes[1] = 29;
  }
  
  if (dia > diasPorMes[mes - 1]) return false;
  
  return true;
}

/**
 * Aplica máscara de data (dd/mm/aaaa)
 */
export function maskData(value: string): string {
  const numeros = value.replace(/\D/g, '');
  return numeros
    .replace(/(\d{2})(\d)/, '$1/$2')
    .replace(/(\d{2})(\d)/, '$1/$2')
    .substring(0, 10);
}

/**
 * Calcula idade a partir da data de nascimento
 */
export function calcularIdade(dataNascimento: string): number {
  if (!validarDataBR(dataNascimento)) return 0;
  
  const [dia, mes, ano] = dataNascimento.split('/').map(Number);
  const nascimento = new Date(ano, mes - 1, dia);
  const hoje = new Date();
  
  let idade = hoje.getFullYear() - nascimento.getFullYear();
  const mesAtual = hoje.getMonth();
  const mesNascimento = nascimento.getMonth();
  
  if (mesAtual < mesNascimento || (mesAtual === mesNascimento && hoje.getDate() < nascimento.getDate())) {
    idade--;
  }
  
  return idade;
}

/**
 * Valida idade mínima (≥ 16 anos)
 */
export function validarIdadeMinima(dataNascimento: string): boolean {
  return calcularIdade(dataNascimento) >= 16;
}

/**
 * Normaliza tempo (anos/meses/dias) para evitar valores inconsistentes
 */
export interface TempoNormalizado {
  anos: number;
  meses: number;
  dias: number;
}

export function normalizarTempo(tempo: TempoNormalizado): TempoNormalizado {
  let { anos, meses, dias } = tempo;
  
  // Normaliza dias para meses (assumindo 30 dias por mês para simplicidade)
  if (dias >= 30) {
    meses += Math.floor(dias / 30);
    dias = dias % 30;
  }
  
  // Normaliza meses para anos
  if (meses >= 12) {
    anos += Math.floor(meses / 12);
    meses = meses % 12;
  }
  
  return { anos, meses, dias };
}

/**
 * Valida e-mail
 */
export function validarEmail(email: string): boolean {
  const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return regex.test(email);
}

/**
 * Sanitiza string para prevenir XSS
 */
export function sanitizeString(str: string): string {
  return str
    .replace(/[<>]/g, '')
    .trim();
}

/**
 * Formata tempo para exibição legível
 */
export function formatarTempo(tempo: TempoNormalizado): string {
  const partes: string[] = [];
  
  if (tempo.anos > 0) {
    partes.push(`${tempo.anos} ${tempo.anos === 1 ? 'ano' : 'anos'}`);
  }
  if (tempo.meses > 0) {
    partes.push(`${tempo.meses} ${tempo.meses === 1 ? 'mês' : 'meses'}`);
  }
  if (tempo.dias > 0) {
    partes.push(`${tempo.dias} ${tempo.dias === 1 ? 'dia' : 'dias'}`);
  }
  
  return partes.length > 0 ? partes.join(', ') : '0 dias';
}
