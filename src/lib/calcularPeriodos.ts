import type { Periodo, ResultadoCalculo, TempoCalculado } from '@/types/periodo';

// Converter data DD/MM/AAAA para objeto Date
export const parseDateBR = (dataBR: string): Date | null => {
  const [dia, mes, ano] = dataBR.split('/').map(Number);
  if (!dia || !mes || !ano) return null;
  return new Date(ano, mes - 1, dia);
};

// Calcular diferença em dias entre duas datas
const diferencaDias = (inicio: Date, fim: Date): number => {
  const diffTime = fim.getTime() - inicio.getTime();
  return Math.floor(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 para incluir o dia inicial
};

// Detectar sobreposição entre dois períodos
const detectarSobreposicao = (p1: Periodo, p2: Periodo): number => {
  const inicio1 = parseDateBR(p1.dataInicio);
  const fim1 = parseDateBR(p1.dataFim);
  const inicio2 = parseDateBR(p2.dataInicio);
  const fim2 = parseDateBR(p2.dataFim);

  if (!inicio1 || !fim1 || !inicio2 || !fim2) return 0;

  // Não há sobreposição
  if (fim1 < inicio2 || fim2 < inicio1) return 0;

  // Calcular período de sobreposição
  const inicioSobreposicao = inicio1 > inicio2 ? inicio1 : inicio2;
  const fimSobreposicao = fim1 < fim2 ? fim1 : fim2;

  return diferencaDias(inicioSobreposicao, fimSobreposicao);
};

// Converter dias totais em anos, meses e dias
export const diasParaTempo = (totalDias: number): TempoCalculado => {
  // Calcular usando aproximação mais precisa
  let diasRestantes = totalDias;
  
  // 1 ano = 365 dias
  const anos = Math.floor(diasRestantes / 365);
  diasRestantes = diasRestantes - (anos * 365);
  
  // 1 mês = 30 dias
  const meses = Math.floor(diasRestantes / 30);
  diasRestantes = diasRestantes - (meses * 30);
  
  const dias = diasRestantes;

  return { anos, meses, dias };
};

// Calcular tempo total considerando períodos simultâneos
export const calcularPeriodos = (periodos: Periodo[]): ResultadoCalculo => {
  if (periodos.length === 0) {
    return {
      total: { anos: 0, meses: 0, dias: 0 },
      periodosValidos: [],
      periodosSimultaneos: [],
      diasNaoConcomitantes: 0,
    };
  }

  // Ordenar períodos por data de início
  const periodosOrdenados = [...periodos].sort((a, b) => {
    const dataA = parseDateBR(a.dataInicio);
    const dataB = parseDateBR(b.dataInicio);
    return (dataA?.getTime() || 0) - (dataB?.getTime() || 0);
  });

  // Calcular total de dias sem considerar sobreposição
  let totalDiasBruto = 0;
  for (const periodo of periodosOrdenados) {
    const inicio = parseDateBR(periodo.dataInicio);
    const fim = parseDateBR(periodo.dataFim);
    if (inicio && fim) {
      totalDiasBruto += diferencaDias(inicio, fim);
    }
  }

  // Detectar sobreposições
  const sobreposicoes: ResultadoCalculo['periodosSimultaneos'] = [];
  let totalDiasSobrepostos = 0;

  for (let i = 0; i < periodosOrdenados.length; i++) {
    for (let j = i + 1; j < periodosOrdenados.length; j++) {
      const diasSobrepostos = detectarSobreposicao(
        periodosOrdenados[i],
        periodosOrdenados[j]
      );
      if (diasSobrepostos > 0) {
        sobreposicoes.push({
          periodo1: periodosOrdenados[i],
          periodo2: periodosOrdenados[j],
          diasSimultaneos: diasSobrepostos,
        });
        totalDiasSobrepostos += diasSobrepostos;
      }
    }
  }

  // Calcular dias não concomitantes
  const diasNaoConcomitantes = totalDiasBruto - totalDiasSobrepostos;

  return {
    total: diasParaTempo(diasNaoConcomitantes),
    periodosValidos: periodosOrdenados,
    periodosSimultaneos: sobreposicoes,
    diasNaoConcomitantes,
  };
};
