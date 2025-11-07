import React, { useState, useEffect } from 'react';
import { FormField } from '@/components/FormField';
import { SelectField } from '@/components/SelectField';
import { TempoInput } from '@/components/TempoInput';
import { maskData } from '@/lib/validations';
import { UFS, buscarMunicipiosPorUF, ESTADOS_COMPLETOS } from '@/lib/municipios';
import type { ServicoPublico, FormularioErrors } from '@/types/formulario';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown, HelpCircle, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';

interface Etapa2Props {
  data: ServicoPublico;
  errors: FormularioErrors['servicoPublico'];
  onChange: (field: keyof ServicoPublico, value: any) => void;
  onValidate: (field: keyof ServicoPublico) => void;
}

export const Etapa2ServicoPublico: React.FC<Etapa2Props> = ({
  data,
  errors,
  onChange,
  onValidate,
}) => {
  const [municipios, setMunicipios] = useState<string[]>([]);
  const [openMunicipio, setOpenMunicipio] = useState(false);
  const [showTempoFields, setShowTempoFields] = useState(false);

  // Calcular tempo desde a data de ingresso até hoje
  const calcularTempo = (dataIngresso: string) => {
    if (!dataIngresso || dataIngresso.length !== 10) return null;
    
    const [dia, mes, ano] = dataIngresso.split('/').map(Number);
    const dataInicio = new Date(ano, mes - 1, dia);
    const hoje = new Date();
    
    let anos = hoje.getFullYear() - dataInicio.getFullYear();
    let meses = hoje.getMonth() - dataInicio.getMonth();
    let dias = hoje.getDate() - dataInicio.getDate();
    
    if (dias < 0) {
      meses--;
      const ultimoDiaMesAnterior = new Date(hoje.getFullYear(), hoje.getMonth(), 0).getDate();
      dias += ultimoDiaMesAnterior;
    }
    
    if (meses < 0) {
      anos--;
      meses += 12;
    }
    
    return { anos, meses, dias };
  };

  useEffect(() => {
    if (data.uf) {
      const listaMunicipios = buscarMunicipiosPorUF(data.uf);
      setMunicipios(listaMunicipios);
      // Limpa município se UF mudar e o município não existir mais na lista
      if (data.municipio && !listaMunicipios.includes(data.municipio)) {
        onChange('municipio', '');
      }
    }
  }, [data.uf]);

  // Calcular automaticamente quando a data de ingresso for preenchida
  useEffect(() => {
    if (data.dataIngressoServicoPublico && data.dataIngressoServicoPublico.length === 10) {
      const tempo = calcularTempo(data.dataIngressoServicoPublico);
      if (tempo) {
        // Atualizar ambos os campos com o mesmo valor calculado
        const novoTempo = { anos: tempo.anos, meses: tempo.meses, dias: tempo.dias };
        onChange('tempoCarreira', novoTempo);
        setTimeout(() => {
          onChange('tempoCargo', { ...novoTempo });
        }, 0);
        setShowTempoFields(true);
      }
    }
  }, [data.dataIngressoServicoPublico]);

  const needsUF = data.origemFuncional === 'Estadual' || data.origemFuncional === 'Municipal';
  const needsMunicipio = data.origemFuncional === 'Municipal';

  return (
    <div className="space-y-6 animate-fade-in">
      <div>
        <h2 className="text-2xl font-bold text-foreground mb-2">Dados do Serviço Público</h2>
        <p className="text-muted-foreground">
          Informações específicas sobre seu vínculo com o serviço público.
        </p>
      </div>

      <SelectField
        label="Origem Funcional"
        name="origemFuncional"
        value={data.origemFuncional}
        onChange={(v) => onChange('origemFuncional', v)}
        options={[
          { value: 'Federal', label: 'Federal' },
          { value: 'Estadual', label: 'Estadual' },
          { value: 'Municipal', label: 'Municipal' },
        ]}
        error={errors.origemFuncional}
        required
        placeholder="Selecione a origem"
      />

      {needsUF && (
        <SelectField
          label="UF (Estado)"
          name="uf"
          value={data.uf}
          onChange={(v) => onChange('uf', v)}
          options={UFS.map(uf => ({ value: uf, label: ESTADOS_COMPLETOS[uf] }))}
          error={errors.uf}
          required
          placeholder="Selecione o estado"
        />
      )}

      {needsMunicipio && data.uf && (
        <div className="space-y-2">
          <Label className="text-sm font-medium text-foreground">
            Município
            <span className="text-destructive ml-1" aria-label="obrigatório">*</span>
          </Label>
          <Popover open={openMunicipio} onOpenChange={setOpenMunicipio}>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                role="combobox"
                aria-expanded={openMunicipio}
                className="w-full justify-between"
              >
                {data.municipio || "Selecione o município..."}
                <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-full p-0">
              <Command>
                <CommandInput placeholder="Buscar município..." />
                <CommandList>
                  <CommandEmpty>Nenhum município encontrado.</CommandEmpty>
                  <CommandGroup>
                    {municipios.map((municipio) => (
                      <CommandItem
                        key={municipio}
                        value={municipio}
                        onSelect={(currentValue) => {
                          onChange('municipio', currentValue === data.municipio ? '' : municipio);
                          setOpenMunicipio(false);
                        }}
                      >
                        <Check
                          className={cn(
                            "mr-2 h-4 w-4",
                            data.municipio === municipio ? "opacity-100" : "opacity-0"
                          )}
                        />
                        {municipio}
                      </CommandItem>
                    ))}
                  </CommandGroup>
                </CommandList>
              </Command>
            </PopoverContent>
          </Popover>
          {errors.municipio && (
            <p className="text-xs text-destructive animate-slide-in" role="alert">
              {errors.municipio}
            </p>
          )}
        </div>
      )}

      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <Label htmlFor="field-dataIngressoServicoPublico" className="text-sm font-semibold text-foreground">
            Data de Ingresso no Concurso
            <span className="text-destructive ml-1" aria-label="obrigatório">*</span>
          </Label>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <HelpCircle className="w-4 h-4 text-muted-foreground cursor-help" />
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Se teve mais de um concurso, coloque a <strong>data do primeiro concurso</strong> se <strong>não houve interrupção de trabalho</strong> superior a 02 meses de um concurso para o outro. Se houve interrupção, coloque a data do segundo concurso.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
        <input
          id="field-dataIngressoServicoPublico"
          name="dataIngressoServicoPublico"
          type="text"
          value={data.dataIngressoServicoPublico}
          onChange={(e) => onChange('dataIngressoServicoPublico', maskData(e.target.value))}
          onBlur={() => onValidate('dataIngressoServicoPublico')}
          placeholder="dd/mm/aaaa"
          maxLength={10}
          className={cn(
            'flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 transition-all',
            errors.dataIngressoServicoPublico && 'border-destructive focus-visible:ring-destructive'
          )}
        />
        {errors.dataIngressoServicoPublico && (
          <p className="text-sm text-destructive animate-slide-in font-medium" role="alert">
            {errors.dataIngressoServicoPublico}
          </p>
        )}
      </div>

      {showTempoFields && (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-muted-foreground">
              O Tempo na Carreira e no Cargo foram presumidos a partir da sua data de ingresso no concurso. Se você mudou carreira ou cargo após o concurso, altere os dados abaixo:
            </p>
          </div>
          
          <TempoInput
            label="Tempo na Carreira Atual"
            name="tempoCarreira"
            value={data.tempoCarreira}
            onChange={(v) => onChange('tempoCarreira', v)}
            error={errors.tempoCarreira}
            required
          />

          <TempoInput
            label="Tempo no Cargo Atual"
            name="tempoCargo"
            value={data.tempoCargo}
            onChange={(v) => onChange('tempoCargo', v)}
            error={errors.tempoCargo}
            required
          />
        </div>
      )}

      <TempoInput
        label="Tempo de Afastamento Não Remunerado (opcional)"
        name="tempoAfastamentoNaoRemunerado"
        value={data.tempoAfastamentoNaoRemunerado}
        onChange={(v) => onChange('tempoAfastamentoNaoRemunerado', v)}
      />
    </div>
  );
};
