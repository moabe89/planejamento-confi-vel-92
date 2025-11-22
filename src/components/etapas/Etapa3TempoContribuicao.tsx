import React, { useEffect } from 'react';
import { TempoInput } from '@/components/TempoInput';
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

      <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
        <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500 animate-subtle-pulse" />
        <AlertDescription className="text-amber-900 dark:text-amber-100">
          Não inclua <strong>tempos concomitantes</strong> (tempos de trabalho no mesmo período). <em>Por exemplo: entre 2000 e 2004 você tinha 2 trabalhos e contribuiu para o INSS e o Município/Estado, nesse caso, considere o tempo de apenas 1 dos trabalhos para fins de planejamento (o outro tempo você poderá considerar para outra aposentadoria)</em>.
        </AlertDescription>
      </Alert>

      <Card className="border-border/50 shadow-sm">
        <CardContent className="pt-6 space-y-2">
          <TempoInput
            label="Tempo de Contribuição Comum"
            name="comum"
            value={data.comum}
            onChange={(v) => onChange('comum', v)}
            error={errors.comum}
            required
            className="text-base"
          />
          <div className="space-y-1 text-sm text-muted-foreground mt-2">
            <p>• Se não tiver, pode deixar em branco.</p>
            <p>• Inclua apenas tempo comuns.</p>
            <p>• Some todos os seus tempos comuns, inclusive os <strong>anteriores ao concurso</strong>.</p>
            <p>• Veja se tem <strong>tempos para averbar</strong> (INSS, RPPS) inclusive os <em>anteriores ao concurso</em>.</p>
          </div>
        </CardContent>
      </Card>

      {isProfessor && isProfessorFundamentalMedio && (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <label className="text-base font-medium text-foreground">
                  Tempo de Contribuição no Magistério <span className="text-destructive">*</span>
                </label>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <button type="button" className="inline-flex items-center gap-1 text-amber-600 dark:text-amber-500 hover:text-amber-700 dark:hover:text-amber-400 transition-colors">
                        <span className="text-xs font-medium animate-subtle-pulse">Saiba mais</span>
                        <HelpCircle className="h-4 w-4 animate-subtle-pulse" />
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
              <TempoInput
                label=""
                name="magisterio"
                value={data.magisterio}
                onChange={(v) => onChange('magisterio', v)}
                error={errors.magisterio}
                required
                className="text-base"
              />
            </div>
            
            <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 shadow-sm">
              <CardContent className="pt-6 space-y-2">
                <TempoInput
                  label="Tempo Fora do Magistério"
                  name="remuneradoForaMagisterio"
                  value={data.remuneradoForaMagisterio}
                  onChange={(v) => onChange('remuneradoForaMagisterio', v)}
                  error={errors.remuneradoForaMagisterio}
                  required={isProfessor && isProfessorFundamentalMedio}
                  className="text-base"
                />
                <div className="flex items-start gap-2 text-sm text-amber-900 dark:text-amber-100">
                  <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-500 animate-subtle-pulse" />
                  <p>
                    Preencha o campo apenas se <strong>estava no cargo de professor, mas ficou fora do magistério</strong>.
                  </p>
                </div>
              </CardContent>
            </Card>
          </CardContent>
        </Card>
      )}

      {isInsalubre && (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-6">
            <TempoInput
              label="Tempo de Contribuição Especial/Insalubre"
              name="especialInsalubre"
              value={data.especialInsalubre}
              onChange={(v) => onChange('especialInsalubre', v)}
              error={errors.especialInsalubre}
              required
              className="text-base"
            />
          </CardContent>
        </Card>
      )}

      {isPolicial && (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-6 space-y-4">
            <TempoInput
              label="Tempo de contribuição Policial"
              name="policial"
              value={data.policial}
              onChange={(v) => onChange('policial', v)}
              error={errors.policial}
              required
              className="text-base"
            />

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
          </CardContent>
        </Card>
      )}

      {isPcD && (
        <Card className="border-border/50 shadow-sm">
          <CardContent className="pt-6">
            <TempoInput
              label="Tempo de contribuição especial – PcD"
              name="pcd"
              value={data.pcd}
              onChange={(v) => onChange('pcd', v)}
              error={errors.pcd}
              required
              className="text-base"
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};