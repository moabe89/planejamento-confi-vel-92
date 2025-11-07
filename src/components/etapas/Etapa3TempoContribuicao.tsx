import React from 'react';
import { TempoInput } from '@/components/TempoInput';
import { RadioGroup } from '@/components/RadioGroup';
import type { TempoContribuicao, FormularioErrors, DadosPessoais } from '@/types/formulario';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle, AlertCircle } from 'lucide-react';

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
  const isInsalubre = dadosPessoais.insalubridadeOuEspecial === true;
  const isPolicial = dadosPessoais.policial === true;
  const isPcD = dadosPessoais.pessoaComDeficiencia === true;

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Tempo de Contribuição</h2>
        <p className="text-muted-foreground">
          Informe os períodos de contribuição conforme sua situação.
        </p>
      </div>

      <Alert>
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          Não inclua <strong>tempos concomitantes</strong> (tempos de trabalho no mesmo período). <em>Por exemplo: entre 2000 e 2004 você tinha 2 trabalhos e contribuiu para o INSS e o Município/Estado, nesse caso, considere o tempo de apenas 1 dos trabalhos para fins de planejamento (o outro tempo você poderá considerar para outra aposentadoria)</em>.
        </AlertDescription>
      </Alert>

      <div className="space-y-2">
        <TempoInput
          label="Tempo de Contribuição Comum"
          name="comum"
          value={data.comum}
          onChange={(v) => onChange('comum', v)}
          error={errors.comum}
          required
        />
        <div className="space-y-1 text-sm text-muted-foreground">
          <p>• Se não tiver, pode deixar em branco.</p>
          <p>• Inclua apenas tempo comuns.</p>
          <p>• Some todos os seus tempos comuns que tiver para incluir.</p>
          <p>• Veja se tem <strong>tempos a averbar</strong> e inclua (INSS, RPPS).</p>
        </div>
      </div>

      {isProfessor && (
        <>
          <div className="space-y-2">
            <TempoInput
              label="Tempo de Contribuição no Magistério"
              name="magisterio"
              value={data.magisterio}
              onChange={(v) => onChange('magisterio', v)}
              error={errors.magisterio}
              required
            />
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">
                O que conta e o que não conta como magistério?
              </span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <button type="button" className="text-muted-foreground hover:text-foreground transition-colors">
                      <HelpCircle className="h-4 w-4" />
                    </button>
                  </TooltipTrigger>
                  <TooltipContent className="max-w-md p-4">
                    <div className="space-y-3">
                      <div>
                        <p className="font-semibold mb-1">✓ Conta como tempo de magistério:</p>
                        <p className="text-sm">
                          Cargo de coordenador, diretor, assessor pedagógico, dinamizador de biblioteca, desde que exercido na unidade de ensino e para <strong>ensino fundamental e médio</strong> (<strong>Ensino superior não conta como magistério</strong>).
                        </p>
                      </div>
                      <div>
                        <p className="font-semibold mb-1">✗ Não conta como tempo de magistério:</p>
                        <p className="text-sm">
                          Cargos administrativos ou fora da unidade de ensino, exemplo: secretária da escola, cargo comissionado fora da escola, etc.
                        </p>
                      </div>
                    </div>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          
          <TempoInput
            label="Tempo Remunerado Fora do Magistério"
            name="remuneradoForaMagisterio"
            value={data.remuneradoForaMagisterio}
            onChange={(v) => onChange('remuneradoForaMagisterio', v)}
            error={errors.remuneradoForaMagisterio}
          />
        </>
      )}

      {isInsalubre && (
        <TempoInput
          label="Tempo de Contribuição Especial/Insalubre"
          name="especialInsalubre"
          value={data.especialInsalubre}
          onChange={(v) => onChange('especialInsalubre', v)}
          error={errors.especialInsalubre}
          required
        />
      )}

      {isPolicial && (
        <>
          <TempoInput
            label="Tempo de Contribuição como Policial"
            name="policial"
            value={data.policial}
            onChange={(v) => onChange('policial', v)}
            error={errors.policial}
            required
          />

          <RadioGroup
            label="Tipo de Carreira Policial"
            name="tipoPolicial"
            value={
              data.policialCivilOuFederal
                ? 'civil-federal'
                : data.policialMilitarOuBombeiro
                ? 'militar-bombeiro'
                : ''
            }
            onChange={(v) => {
              onChange('policialCivilOuFederal', v === 'civil-federal');
              onChange('policialMilitarOuBombeiro', v === 'militar-bombeiro');
            }}
            options={[
              { value: 'civil-federal', label: 'Policial Civil ou Federal' },
              { value: 'militar-bombeiro', label: 'Policial Militar ou Bombeiro' },
            ]}
            required
          />
        </>
      )}

      {isPcD && (
        <TempoInput
          label="Tempo de Contribuição como Pessoa com Deficiência (PcD)"
          name="pcd"
          value={data.pcd}
          onChange={(v) => onChange('pcd', v)}
          error={errors.pcd}
          required
        />
      )}
    </div>
  );
};
