import React, { useEffect } from 'react';
import { PeriodoContribuicao } from '@/components/PeriodoContribuicao';
import { RadioGroup } from '@/components/RadioGroup';
import type { TempoContribuicao, FormularioErrors, DadosPessoais } from '@/types/formulario';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, AlertCircle } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface Etapa3Props {
  data: TempoContribuicao;
  dadosPessoais: DadosPessoais;
  errors: FormularioErrors['tempoContribuicao'];
  onChange: (field: keyof TempoContribuicao, value: any) => void;
  onValidate: (field: keyof TempoContribuicao) => void;
}

export const Etapa3TempoContribuicao: React.FC<Etapa3Props> = ({
  data,
  dadosPessoais,
  errors,
  onChange,
  onValidate,
}) => {
  const isProfessor = dadosPessoais.professor === true;
  const isProfessorFundamentalMedio = dadosPessoais.professorTipo === 'fundamental-medio';
  const isInsalubre = dadosPessoais.insalubridadeOuEspecial === true;
  const isPolicial = dadosPessoais.policial === true;
  const isPcD = dadosPessoais.pessoaComDeficiencia === true;

  // Escutar evento de data de ingresso calculada da Etapa 2
  useEffect(() => {
    const handleDataIngresso = (event: CustomEvent) => {
      const { tempo } = event.detail;
      
      // Preencher automaticamente o tempo de contribuição comum
      onChange('comum', tempo);
      
      // Se for professor de fundamental/médio, preencher também o tempo de magistério
      if (isProfessor && isProfessorFundamentalMedio) {
        onChange('magisterio', tempo);
      }
    };

    window.addEventListener('dataIngressoCalculada', handleDataIngresso as EventListener);
    
    return () => {
      window.removeEventListener('dataIngressoCalculada', handleDataIngresso as EventListener);
    };
  }, [isProfessor, isProfessorFundamentalMedio, onChange]);

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Tempo de Contribuição</h2>
        <p className="text-muted-foreground">
          Informe os períodos de contribuição conforme sua situação.
        </p>
      </div>

      <PeriodoContribuicao
        titulo="Tempo de Contribuição Comum"
        valor={data.comum}
        onChange={(v) => onChange('comum', v)}
        required
        helpText={
          <>
            Inclua <strong>APENAS tempos comuns</strong>, inclusive anteriores ao concurso. Outros tempos devem ser colocados abaixo.
            <br />
            Verifique se há tempos para averbar (INSS, RPPS).
          </>
        }
      />

      {isProfessor && isProfessorFundamentalMedio && (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-6 space-y-6">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-foreground">
                Tempo de Contribuição no Magistério
                <span className="text-destructive ml-1">*</span>
              </h3>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-amber-500/30 dark:border-amber-500/20 text-amber-600 dark:text-amber-500 hover:border-amber-500/50 dark:hover:border-amber-500/40 hover:bg-amber-500/5 transition-all whitespace-nowrap">
                      <span className="text-xs font-medium">Saiba mais</span>
                      <HelpCircle className="h-3.5 w-3.5 animate-subtle-pulse" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-md p-4">
                    <p className="font-semibold mb-2">O que conta e o que não conta como magistério?</p>
                    <div className="space-y-2 text-sm">
                      <div>
                        <p className="font-medium">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 mr-1">
                            <span className="text-green-700 dark:text-green-400 font-bold">✓</span>
                          </span>
                          <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 px-1 rounded">Conta como tempo de magistério:</span>
                        </p>
                        <p className="ml-6 mt-1">
                          Cargo de coordenador, diretor, assessor pedagógico, dinamizador de biblioteca, desde que exercido na unidade de ensino e para <strong>ensino fundamental e médio</strong> (<strong>Ensino superior não conta como magistério</strong>).
                        </p>
                      </div>
                      <div>
                        <p className="font-medium">
                          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-red-100 dark:bg-red-900/30 mr-1">
                            <span className="text-red-700 dark:text-red-400 font-bold">✗</span>
                          </span>
                          <span className="bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300 px-1 rounded">Não conta como tempo de magistério:</span>
                        </p>
                        <p className="ml-6 mt-1">
                          Cargos administrativos ou fora da unidade de ensino, exemplo: secretária da escola, cargo comissionado fora da escola, etc.
                        </p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
            
            <p className="text-sm text-muted-foreground">
              Tempo exercido em funções de magistério no ensino fundamental e médio
            </p>

            <PeriodoContribuicao
              titulo=""
              valor={data.magisterio}
              onChange={(v) => onChange('magisterio', v)}
              required={false}
              noCard={true}
            />

            <div className="border-t border-border/50 pt-6 space-y-4">
              <div>
                <h4 className="text-base font-semibold text-foreground mb-1">
                  Tempo Fora do Magistério
                  <span className="text-destructive ml-1">*</span>
                </h4>
                <p className="text-sm text-muted-foreground">
                  Tempo em que estava no cargo de professor, mas exerceu outras funções fora da unidade de ensino
                </p>
              </div>
              
              <PeriodoContribuicao
                titulo=""
                valor={data.remuneradoForaMagisterio}
                onChange={(v) => onChange('remuneradoForaMagisterio', v)}
                required={false}
                noCard={true}
                labelManual={<>Total de fora em <strong>anos, meses e dias</strong></>}
                helpText="Preencha apenas se estava no cargo de professor, mas exerceu funções de coordenador, diretor, assessor pedagógico ou dinamizador de biblioteca fora da unidade de ensino."
              />
            </div>
          </CardContent>
        </Card>
      )}

      {isInsalubre && (
        <PeriodoContribuicao
          titulo="Tempo de Contribuição Especial/Insalubre"
          valor={data.especialInsalubre}
          onChange={(v) => onChange('especialInsalubre', v)}
          required
        />
      )}

      {isPolicial && (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-6 space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-foreground mb-1">
                Tempo de Contribuição Policial
                <span className="text-destructive ml-1">*</span>
              </h3>
            </div>

            <PeriodoContribuicao
              titulo=""
              valor={data.policial}
              onChange={(v) => onChange('policial', v)}
              required={false}
              noCard={true}
            />

            <div className="border-t border-border/50 pt-6">
              <RadioGroup
                label="Tipo de Carreira Policial"
                name="tipoCarreiraPolicial"
                value={
                  data.policialCivilOuFederal === true
                    ? 'civil-federal'
                    : data.policialMilitarOuBombeiro === true
                    ? 'militar-bombeiro'
                    : ''
                }
                onChange={(v) => {
                  if (v === 'civil-federal') {
                    onChange('policialCivilOuFederal', true);
                    onChange('policialMilitarOuBombeiro', false);
                  } else if (v === 'militar-bombeiro') {
                    onChange('policialCivilOuFederal', false);
                    onChange('policialMilitarOuBombeiro', true);
                  }
                }}
                options={[
                  { value: 'civil-federal', label: 'Policial Civil ou Federal' },
                  { value: 'militar-bombeiro', label: 'Policial Militar ou Bombeiro' },
                ]}
                required
              />
            </div>
          </CardContent>
        </Card>
      )}

      {isPcD && (
        <PeriodoContribuicao
          titulo="Tempo de Contribuição Especial – PcD"
          valor={data.pcd}
          onChange={(v) => onChange('pcd', v)}
          required
        />
      )}
    </div>
  );
};