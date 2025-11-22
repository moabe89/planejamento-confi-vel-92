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
import { Card, CardContent } from '@/components/ui/card';
import { Check, ChevronsUpDown, HelpCircle, AlertTriangle, AlertCircle } from 'lucide-react';
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
        onChange('tempoCarreira', tempo);
        onChange('tempoCargo', tempo);
        setShowTempoFields(true);
        
        // Disparar evento para atualizar tempo de contribuição comum na etapa 3
        const event = new CustomEvent('dataIngressoCalculada', { 
          detail: { tempo, dataIngresso: data.dataIngressoServicoPublico } 
        });
        window.dispatchEvent(event);
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
        placeholder="Identifique sua origem funcional ..."
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
        <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
          <span>Teve mais de um concurso? Saiba ao lado</span>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <button type="button" className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-amber-100 dark:bg-amber-900/30 text-amber-600 dark:text-amber-500 hover:bg-amber-200 dark:hover:bg-amber-900/50 hover:text-amber-700 dark:hover:text-amber-400 transition-all shadow-sm">
                  <span className="text-xs font-medium animate-subtle-pulse">Saiba mais</span>
                  <HelpCircle className="h-3.5 w-3.5 animate-subtle-pulse" />
                </button>
              </TooltipTrigger>
              <TooltipContent className="max-w-xs">
                <p>Se teve mais de um concurso e <strong>não houve interrupção</strong> de trabalho superior a 2 meses de um concurso para o outro, coloque a <strong>data do primeiro concurso</strong>. Se houve interrupção, coloque a data do segundo concurso.</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </div>

      {showTempoFields && (
        <div className="space-y-4 p-4 bg-muted/30 rounded-lg border border-border/50">
          <div className="flex items-start gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 dark:text-amber-500 flex-shrink-0 mt-0.5 animate-subtle-pulse" />
            <p className="text-sm text-amber-900 dark:text-amber-100">
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

      <Card className="border-amber-200 dark:border-amber-800 bg-amber-50 dark:bg-amber-950/20 shadow-sm">
        <CardContent className="pt-6 space-y-2">
          <TempoInput
            label="Tempo de Afastamento Não Remunerado (opcional)"
            name="tempoAfastamentoNaoRemunerado"
            value={data.tempoAfastamentoNaoRemunerado}
            onChange={(v) => onChange('tempoAfastamentoNaoRemunerado', v)}
          />
          <div className="flex items-start gap-2 text-sm">
            <AlertCircle className="h-4 w-4 mt-0.5 flex-shrink-0 text-amber-600 dark:text-amber-500 animate-subtle-pulse" />
            <p className="text-amber-900 dark:text-amber-100">
              Exemplo: licença por interesse particular e licença não remunerada. OBS: <strong>Licença médica e auxílio-doença é considerado remunerado</strong>, se esse for o caso, <strong>não preencha</strong>.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
