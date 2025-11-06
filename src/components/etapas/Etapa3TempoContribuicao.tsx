import React from 'react';
import { TempoInput } from '@/components/TempoInput';
import { RadioGroup } from '@/components/RadioGroup';
import type { TempoContribuicao, FormularioErrors, DadosPessoais } from '@/types/formulario';

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

      <TempoInput
        label="Tempo de Contribuição Comum"
        name="comum"
        value={data.comum}
        onChange={(v) => onChange('comum', v)}
        error={errors.comum}
        required
      />

      {isProfessor && (
        <>
          <TempoInput
            label="Tempo de Contribuição no Magistério"
            name="magisterio"
            value={data.magisterio}
            onChange={(v) => onChange('magisterio', v)}
            error={errors.magisterio}
            required
          />
          
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
