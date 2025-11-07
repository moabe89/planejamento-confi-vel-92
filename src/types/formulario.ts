/**
 * Tipos para o formulário de Planejamento Previdenciário
 */

import type { TempoNormalizado } from '@/lib/validations';

export interface DadosPessoais {
  nomeCompleto: string;
  sexo: 'Masculino' | 'Feminino' | 'Outro/Prefiro não informar' | '';
  dataNascimento: string;
  vinculo: 'Servidor Público' | 'Carteira Assinada (CLT)' | '';
  pessoaComDeficiencia: boolean | null;
  grauDeficiencia: 'Leve' | 'Moderado' | 'Grave' | '';
  insalubridadeOuEspecial: boolean | null;
  professor: boolean | null;
  professorTipo: 'fundamental-medio' | 'ensino-superior' | '';
  policial: boolean | null;
  bombeiroMilitar: boolean | null;
  emailCliente: string;
  cpf: string;
}

export interface ServicoPublico {
  origemFuncional: 'Federal' | 'Estadual' | 'Municipal' | '';
  uf: string;
  municipio: string;
  dataIngressoServicoPublico: string;
  tempoCarreira: TempoNormalizado;
  tempoCargo: TempoNormalizado;
  tempoAfastamentoNaoRemunerado: TempoNormalizado;
}

export interface TempoContribuicao {
  comum: TempoNormalizado;
  magisterio: TempoNormalizado;
  remuneradoForaMagisterio: TempoNormalizado;
  especialInsalubre: TempoNormalizado;
  policial: TempoNormalizado;
  policialCivilOuFederal: boolean;
  policialMilitarOuBombeiro: boolean;
  pcd: TempoNormalizado;
}

export interface FormularioData {
  dadosPessoais: DadosPessoais;
  servicoPublico: ServicoPublico;
  tempoContribuicao: TempoContribuicao;
  consentimentoLGPD: boolean;
}

export interface FormularioErrors {
  dadosPessoais: Partial<Record<keyof DadosPessoais, string>>;
  servicoPublico: Partial<Record<keyof ServicoPublico, string>>;
  tempoContribuicao: Partial<Record<keyof TempoContribuicao, string>>;
  geral?: string;
}

// Estado inicial
export const INITIAL_TEMPO: TempoNormalizado = {
  anos: 0,
  meses: 0,
  dias: 0,
};

export const INITIAL_FORM_DATA: FormularioData = {
  dadosPessoais: {
    nomeCompleto: '',
    sexo: '',
    dataNascimento: '',
    vinculo: '',
    pessoaComDeficiencia: null,
    grauDeficiencia: '',
    insalubridadeOuEspecial: null,
    professor: null,
    professorTipo: '',
    policial: null,
    bombeiroMilitar: null,
    emailCliente: '',
    cpf: '',
  },
  servicoPublico: {
    origemFuncional: '',
    uf: '',
    municipio: '',
    dataIngressoServicoPublico: '',
    tempoCarreira: { ...INITIAL_TEMPO },
    tempoCargo: { ...INITIAL_TEMPO },
    tempoAfastamentoNaoRemunerado: { ...INITIAL_TEMPO },
  },
  tempoContribuicao: {
    comum: { ...INITIAL_TEMPO },
    magisterio: { ...INITIAL_TEMPO },
    remuneradoForaMagisterio: { ...INITIAL_TEMPO },
    especialInsalubre: { ...INITIAL_TEMPO },
    policial: { ...INITIAL_TEMPO },
    policialCivilOuFederal: false,
    policialMilitarOuBombeiro: false,
    pcd: { ...INITIAL_TEMPO },
  },
  consentimentoLGPD: false,
};
