import React, { useState, useEffect } from 'react';
import { FormField } from '@/components/FormField';
import { SelectField } from '@/components/SelectField';
import { TempoInput } from '@/components/TempoInput';
import { maskData } from '@/lib/validations';
import { UFS, buscarMunicipiosPorUF } from '@/lib/municipios';
import type { ServicoPublico, FormularioErrors } from '@/types/formulario';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { Check, ChevronsUpDown } from 'lucide-react';
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

  useEffect(() => {
    if (data.uf) {
      setMunicipios(buscarMunicipiosPorUF(data.uf));
      // Limpa município se UF mudar
      if (data.municipio && !buscarMunicipiosPorUF(data.uf).includes(data.municipio)) {
        onChange('municipio', '');
      }
    }
  }, [data.uf]);

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
          options={UFS.map(uf => ({ value: uf, label: uf }))}
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

      <FormField
        label="Data de Ingresso no Serviço Público"
        name="dataIngressoServicoPublico"
        value={data.dataIngressoServicoPublico}
        onChange={(v) => onChange('dataIngressoServicoPublico', maskData(v))}
        onBlur={() => onValidate('dataIngressoServicoPublico')}
        error={errors.dataIngressoServicoPublico}
        required
        placeholder="dd/mm/aaaa"
        maxLength={10}
      />

      <TempoInput
        label="Tempo de Carreira"
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

      <TempoInput
        label="Tempo de Afastamento Não Remunerado (opcional)"
        name="tempoAfastamentoNaoRemunerado"
        value={data.tempoAfastamentoNaoRemunerado}
        onChange={(v) => onChange('tempoAfastamentoNaoRemunerado', v)}
      />
    </div>
  );
};
