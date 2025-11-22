export interface Periodo {
  id: string;
  dataInicio: string; // formato DD/MM/AAAA
  dataFim: string; // formato DD/MM/AAAA
}

export interface TempoCalculado {
  anos: number;
  meses: number;
  dias: number;
}

export interface ResultadoCalculo {
  total: TempoCalculado;
  periodosValidos: Periodo[];
  periodosSimultaneos: {
    periodo1: Periodo;
    periodo2: Periodo;
    diasSimultaneos: number;
  }[];
  diasNaoConcomitantes: number;
}
