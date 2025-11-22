import React from 'react';
import { FormField } from '@/components/FormField';
import { RadioGroup } from '@/components/RadioGroup';
import { SelectField } from '@/components/SelectField';
import { maskCpf, maskData, validarCPF, validarDataBR, validarEmail, validarIdadeMinima } from '@/lib/validations';
import type { DadosPessoais, FormularioErrors } from '@/types/formulario';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { HelpCircle } from 'lucide-react';

interface Etapa1Props {
  data: DadosPessoais;
  errors: FormularioErrors['dadosPessoais'];
  onChange: (field: keyof DadosPessoais, value: any) => void;
  onValidate: (field: keyof DadosPessoais) => void;
}

export const Etapa1DadosPessoais: React.FC<Etapa1Props> = ({
  data,
  errors,
  onChange,
  onValidate,
}) => {
  return (
    <div className="space-y-7 animate-fade-in">
      <div className="pb-4 border-b border-border/50">
        <h2 className="text-3xl font-bold text-foreground mb-2">Dados Pessoais</h2>
        <p className="text-muted-foreground text-base">
          Preencha seus dados pessoais com atenção. Campos marcados com * são obrigatórios.
        </p>
      </div>

      <FormField
        label="Nome Completo"
        name="nomeCompleto"
        value={data.nomeCompleto}
        onChange={(v) => onChange('nomeCompleto', v)}
        onBlur={() => onValidate('nomeCompleto')}
        error={errors.nomeCompleto}
        required
        placeholder="Digite seu nome completo"
        maxLength={200}
      />

      <FormField
        label="E-mail"
        name="emailCliente"
        type="email"
        value={data.emailCliente}
        onChange={(v) => onChange('emailCliente', v)}
        onBlur={() => onValidate('emailCliente')}
        error={errors.emailCliente}
        required
        placeholder="seu@email.com"
        helpText="Receberá o Planejamento Previdenciário neste e-mail"
      />

      <FormField
        label="CPF"
        name="cpf"
        value={data.cpf}
        onChange={(v) => onChange('cpf', maskCpf(v))}
        onBlur={() => onValidate('cpf')}
        error={errors.cpf}
        required
        placeholder="000.000.000-00"
        maxLength={14}
      />

      <RadioGroup
        label="Sexo"
        name="sexo"
        value={data.sexo}
        onChange={(v) => onChange('sexo', v)}
        options={[
          { value: 'Masculino', label: 'Masculino' },
          { value: 'Feminino', label: 'Feminino' },
        ]}
        error={errors.sexo}
        required
      />

      <FormField
        label="Data de Nascimento"
        name="dataNascimento"
        value={data.dataNascimento}
        onChange={(v) => onChange('dataNascimento', maskData(v))}
        onBlur={() => onValidate('dataNascimento')}
        error={errors.dataNascimento}
        required
        placeholder="dd/mm/aaaa"
        helpText="Idade mínima: 16 anos"
        maxLength={10}
      />

      <RadioGroup
        label="Vínculo Empregatício"
        name="vinculo"
        value={data.vinculo}
        onChange={(v) => onChange('vinculo', v)}
        options={[
          { value: 'Servidor Público', label: 'Servidor Público' },
          { value: 'Carteira Assinada (CLT)', label: 'Carteira Assinada (CLT)' },
        ]}
        error={errors.vinculo}
        required
      />

      <RadioGroup
        label="Pessoa com Deficiência (PcD)"
        name="pessoaComDeficiencia"
        value={data.pessoaComDeficiencia === null ? '' : data.pessoaComDeficiencia ? 'sim' : 'nao'}
        onChange={(v) => onChange('pessoaComDeficiencia', v === 'sim')}
        options={[
          { value: 'sim', label: 'Sim' },
          { value: 'nao', label: 'Não' },
        ]}
        error={errors.pessoaComDeficiencia}
        required
      />

      {data.pessoaComDeficiencia && (
        <div>
          <SelectField
            label="Grau de Deficiência"
            name="grauDeficiencia"
            value={data.grauDeficiencia || 'Moderado'}
            onChange={(v) => onChange('grauDeficiencia', v)}
            options={[
              { value: 'Leve', label: 'Leve' },
              { value: 'Moderado', label: 'Moderado' },
              { value: 'Grave', label: 'Grave' },
            ]}
            error={errors.grauDeficiencia}
            required
            placeholder="Selecione o grau"
          />
          <p className="text-sm text-muted-foreground mt-1">Se não souber, deixe moderado.</p>
        </div>
      )}

      <div>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-sm font-semibold text-foreground">
            Trabalhou em atividade insalubre?
          </span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-amber-500/30 dark:border-amber-500/20 text-amber-600 dark:text-amber-500 hover:border-amber-500/50 dark:hover:border-amber-500/40 hover:bg-amber-500/5 transition-all animate-subtle-pulse">
                  <span className="text-xs font-medium">Saiba mais</span>
                  <HelpCircle className="h-3.5 w-3.5" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-sm p-4">
                <p className="font-semibold mb-2">Atividades insalubres ou especiais</p>
                <p className="text-sm mb-2">
                  Atividades insalubres são aquelas em que o trabalhador é exposto a agentes físicos, químicos ou biológicos que prejudicam a saúde, como ruído excessivo, temperaturas extremas, substâncias tóxicas, vírus e bactérias.
                </p>
                <p className="text-sm font-semibold mb-1">Alguns cargos que geralmente têm esse direito:</p>
                <ul className="text-sm list-disc list-inside space-y-0.5">
                  <li>Gari</li>
                  <li>Enfermeiros</li>
                  <li>Médicos</li>
                  <li>Dentistas</li>
                  <li>Operador de máquinas pesadas</li>
                  <li>Motorista de caminhão</li>
                  <li>Motorista de ambulância</li>
                  <li className="italic">Entre outras</li>
                </ul>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <RadioGroup
          label=""
          name="insalubridadeOuEspecial"
          value={data.insalubridadeOuEspecial === null ? '' : data.insalubridadeOuEspecial ? 'sim' : 'nao'}
          onChange={(v) => onChange('insalubridadeOuEspecial', v === 'sim')}
          options={[
            { value: 'sim', label: 'Sim' },
            { value: 'nao', label: 'Não' },
          ]}
          error={errors.insalubridadeOuEspecial}
        />
      </div>

      <RadioGroup
        label="É ou foi professor?"
        name="professor"
        value={data.professor === null ? '' : data.professor ? 'sim' : 'nao'}
        onChange={(v) => {
          onChange('professor', v === 'sim');
          if (v === 'nao') onChange('professorTipo', '');
        }}
        options={[
          { value: 'sim', label: 'Sim' },
          { value: 'nao', label: 'Não' },
        ]}
        error={errors.professor}
        required
      />

      {data.professor && (
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-sm font-semibold text-foreground">
              É professor de ensino fundamental e médio ou superior?
              <span className="text-destructive ml-1" aria-label="obrigatório">*</span>
            </span>
            <TooltipProvider>
              <Tooltip>
              <TooltipTrigger asChild>
                  <button type="button" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md border border-amber-500/30 dark:border-amber-500/20 text-amber-600 dark:text-amber-500 hover:border-amber-500/50 dark:hover:border-amber-500/40 hover:bg-amber-500/5 transition-all animate-subtle-pulse">
                    <span className="text-xs font-medium">Saiba mais</span>
                    <HelpCircle className="h-3.5 w-3.5" />
                  </button>
                </TooltipTrigger>
                <TooltipContent className="max-w-md p-4">
                  <p className="text-sm mb-2">
                    Professor de Instituição de Ensino Superior não tem direito a aposentadoria do magistério, apenas professor de ensino fundamental/médio.
                  </p>
                  <p className="text-sm">
                    Se você exerce os dois cargos ao mesmo tempo, <strong>marque Ensino Fundamental/Médio</strong>, mas considere apenas o tempo de contribuição no cargo de professor de ensino fundamental/médio como sendo do magistério.
                  </p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
            <RadioGroup
              label=""
              name="professorTipo"
              value={data.professorTipo}
              onChange={(v) => onChange('professorTipo', v)}
              options={[
                { value: 'fundamental-medio', label: 'Ensino fundamental/médio' },
                { value: 'ensino-superior', label: 'Professor de instituição de ensino superior' },
              ]}
              error={errors.professorTipo}
            />
        </div>
      )}

      <RadioGroup
        label="É ou foi policial?"
        name="policial"
        value={data.policial === null ? '' : data.policial ? 'sim' : 'nao'}
        onChange={(v) => onChange('policial', v === 'sim')}
        options={[
          { value: 'sim', label: 'Sim' },
          { value: 'nao', label: 'Não' },
        ]}
        error={errors.policial}
        required
      />

      <RadioGroup
        label="É ou foi bombeiro militar?"
        name="bombeiroMilitar"
        value={data.bombeiroMilitar === null ? '' : data.bombeiroMilitar ? 'sim' : 'nao'}
        onChange={(v) => onChange('bombeiroMilitar', v === 'sim')}
        options={[
          { value: 'sim', label: 'Sim' },
          { value: 'nao', label: 'Não' },
        ]}
        error={errors.bombeiroMilitar}
        required
      />
    </div>
  );
};
