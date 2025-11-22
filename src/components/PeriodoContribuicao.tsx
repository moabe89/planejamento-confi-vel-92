import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Plus, Trash2, Calendar as CalendarIcon } from 'lucide-react';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import type { Periodo, TempoCalculado } from '@/types/periodo';
import { calcularPeriodos } from '@/lib/calcularPeriodos';
import { maskData, validarDataBR } from '@/lib/validations';
import { TempoInput } from '@/components/TempoInput';
import { cn } from '@/lib/utils';

interface PeriodoContribuicaoProps {
  titulo: string;
  descricao?: string;
  valor: TempoCalculado;
  onChange: (valor: TempoCalculado) => void;
  required?: boolean;
  helpText?: string;
  noCard?: boolean; // Se true, não renderiza o Card wrapper
  labelManual?: React.ReactNode; // Label customizado para o método manual
}

export const PeriodoContribuicao: React.FC<PeriodoContribuicaoProps> = ({
  titulo,
  descricao,
  valor,
  onChange,
  required = false,
  helpText,
  noCard = false,
  labelManual,
}) => {
  const [metodoEntrada, setMetodoEntrada] = useState<'manual' | 'periodos' | ''>('');
  const [periodos, setPeriodos] = useState<Periodo[]>([
    { id: '1', dataInicio: '', dataFim: '' },
  ]);
  const [errosPeriodos, setErrosPeriodos] = useState<Record<string, string>>({});
  const [resultado, setResultado] = useState<ReturnType<typeof calcularPeriodos> | null>(null);

  // Calcular automaticamente quando os períodos mudarem
  useEffect(() => {
    if (metodoEntrada === 'periodos') {
      // Verificar se todos os períodos estão preenchidos e válidos
      const todosPreenchidos = periodos.every(p => 
        p.dataInicio && p.dataFim && 
        validarDataBR(p.dataInicio) && validarDataBR(p.dataFim)
      );

      if (todosPreenchidos && validarPeriodos()) {
        const calc = calcularPeriodos(periodos);
        setResultado(calc);
        onChange(calc.total);
      } else {
        setResultado(null);
      }
    }
  }, [periodos, metodoEntrada]);

  const adicionarPeriodo = () => {
    setPeriodos([
      ...periodos,
      { id: Date.now().toString(), dataInicio: '', dataFim: '' },
    ]);
  };

  const removerPeriodo = (id: string) => {
    if (periodos.length > 1) {
      setPeriodos(periodos.filter((p) => p.id !== id));
      const novosErros = { ...errosPeriodos };
      delete novosErros[`${id}-inicio`];
      delete novosErros[`${id}-fim`];
      setErrosPeriodos(novosErros);
    }
  };

  const atualizarPeriodo = (id: string, campo: 'dataInicio' | 'dataFim', valor: string) => {
    const valorMascarado = maskData(valor);
    setPeriodos(
      periodos.map((p) => (p.id === id ? { ...p, [campo]: valorMascarado } : p))
    );
    
    // Limpar erro ao digitar
    const novosErros = { ...errosPeriodos };
    delete novosErros[`${id}-${campo === 'dataInicio' ? 'inicio' : 'fim'}`];
    setErrosPeriodos(novosErros);
  };

  const validarPeriodos = (): boolean => {
    const novosErros: Record<string, string> = {};
    let valido = true;

    periodos.forEach((periodo) => {
      if (!periodo.dataInicio) {
        novosErros[`${periodo.id}-inicio`] = 'Data de início é obrigatória';
        valido = false;
      } else if (!validarDataBR(periodo.dataInicio)) {
        novosErros[`${periodo.id}-inicio`] = 'Data inválida';
        valido = false;
      }

      if (!periodo.dataFim) {
        novosErros[`${periodo.id}-fim`] = 'Data de fim é obrigatória';
        valido = false;
      } else if (!validarDataBR(periodo.dataFim)) {
        novosErros[`${periodo.id}-fim`] = 'Data inválida';
        valido = false;
      }

      // Validar se data de fim é posterior à data de início
      if (periodo.dataInicio && periodo.dataFim && validarDataBR(periodo.dataInicio) && validarDataBR(periodo.dataFim)) {
        const [diaI, mesI, anoI] = periodo.dataInicio.split('/').map(Number);
        const [diaF, mesF, anoF] = periodo.dataFim.split('/').map(Number);
        const dataInicio = new Date(anoI, mesI - 1, diaI);
        const dataFim = new Date(anoF, mesF - 1, diaF);
        
        if (dataFim < dataInicio) {
          novosErros[`${periodo.id}-fim`] = 'Data de fim deve ser posterior à data de início';
          valido = false;
        }
      }
    });

    setErrosPeriodos(novosErros);
    return valido;
  };


  if (metodoEntrada === '') {
    const content = (
      <>
        {titulo && (
          <div>
            <h3 className="text-lg font-semibold text-foreground mb-1">
              {titulo}
              {required && <span className="text-destructive ml-1">*</span>}
            </h3>
            {descricao && <p className="text-sm text-muted-foreground">{descricao}</p>}
          </div>
        )}

        <div className="space-y-3">
          <Label className="text-base font-medium">Como deseja informar seu tempo?</Label>
          <RadioGroup
            value={metodoEntrada}
            onValueChange={(v) => setMetodoEntrada(v as 'manual' | 'periodos')}
          >
            <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
              <RadioGroupItem value="periodos" id={`${titulo}-periodos`} />
              <Label htmlFor={`${titulo}-periodos`} className="cursor-pointer flex-1 font-normal">
                <strong>Data de início e de fim</strong> de cada período
              </Label>
            </div>
            <div className="flex items-center space-x-2 p-3 rounded-lg border border-border hover:bg-accent/50 transition-colors cursor-pointer">
              <RadioGroupItem value="manual" id={`${titulo}-manual`} />
              <Label htmlFor={`${titulo}-manual`} className="cursor-pointer flex-1 font-normal">
                {labelManual || (
                  <>Total de contribuição em <strong>anos, meses e dias</strong></>
                )}
              </Label>
            </div>
          </RadioGroup>
        </div>
      </>
    );

    if (noCard) {
      return <div className="space-y-4">{content}</div>;
    }

    return (
      <Card className="border-border/50 shadow-sm">
        <CardContent className="pt-6 space-y-4">
          {content}
        </CardContent>
      </Card>
    );
  }

  if (metodoEntrada === 'manual') {
    const content = (
      <>
        {titulo && (
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">
              {titulo}
              {required && <span className="text-destructive ml-1">*</span>}
            </h3>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => setMetodoEntrada('')}
            >
              Alterar método
            </Button>
          </div>
        )}
        
        <TempoInput
          label="Total de contribuição"
          name={`tempo-${titulo}`}
          value={valor}
          onChange={onChange}
          required={required}
        />
        
        {helpText && (
          <p className="text-sm text-muted-foreground">{helpText}</p>
        )}
      </>
    );

    if (noCard) {
      return <div className="space-y-4">{content}</div>;
    }

    return (
      <Card className="border-border/50 shadow-sm">
        <CardContent className="pt-6 space-y-4">
          {content}
        </CardContent>
      </Card>
    );
  }

  const content = (
    <>
      {titulo && (
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-foreground">
            {titulo}
            {required && <span className="text-destructive ml-1">*</span>}
          </h3>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => {
              setMetodoEntrada('');
              setResultado(null);
            }}
          >
            Alterar método
          </Button>
        </div>
      )}

      <div className="space-y-3">
        {periodos.map((periodo, index) => (
          <Card key={periodo.id} className="border-border/30">
            <CardContent className="pt-4 space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-sm font-medium">Período {index + 1}</Label>
                {periodos.length > 1 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removerPeriodo(periodo.id)}
                    className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-2">
                  <Label htmlFor={`inicio-${periodo.id}`} className="text-xs text-muted-foreground">
                    Data de Início
                  </Label>
                  <div className="relative">
                    <Input
                      id={`inicio-${periodo.id}`}
                      type="text"
                      placeholder="DD/MM/AAAA"
                      value={periodo.dataInicio}
                      onChange={(e) => atualizarPeriodo(periodo.id, 'dataInicio', e.target.value)}
                      maxLength={10}
                      className={cn(errosPeriodos[`${periodo.id}-inicio`] && 'border-destructive')}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {errosPeriodos[`${periodo.id}-inicio`] && (
                    <p className="text-xs text-destructive">{errosPeriodos[`${periodo.id}-inicio`]}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor={`fim-${periodo.id}`} className="text-xs text-muted-foreground">
                    Data de Fim
                  </Label>
                  <div className="relative">
                    <Input
                      id={`fim-${periodo.id}`}
                      type="text"
                      placeholder="DD/MM/AAAA"
                      value={periodo.dataFim}
                      onChange={(e) => atualizarPeriodo(periodo.id, 'dataFim', e.target.value)}
                      maxLength={10}
                      className={cn(errosPeriodos[`${periodo.id}-fim`] && 'border-destructive')}
                    />
                    <CalendarIcon className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                  </div>
                  {errosPeriodos[`${periodo.id}-fim`] && (
                    <p className="text-xs text-destructive">{errosPeriodos[`${periodo.id}-fim`]}</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}

        <Button
          type="button"
          variant="outline"
          onClick={adicionarPeriodo}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Adicionar outro período
        </Button>
      </div>

      {resultado && resultado.periodosSimultaneos.length > 0 && (
        <Alert className="bg-amber-50 dark:bg-amber-950/20 border-amber-200 dark:border-amber-800">
          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-500" />
          <AlertDescription className="text-amber-900 dark:text-amber-100">
            <div>
              <strong>Períodos simultâneos:</strong>
            </div>
            <div className="mt-2 space-y-1 text-sm">
              {resultado.periodosSimultaneos.map((sobreposicao, index) => (
                <div key={index}>
                  • {sobreposicao.diasSimultaneos} {sobreposicao.diasSimultaneos === 1 ? 'dia' : 'dias'} de {sobreposicao.periodo1.dataInicio} a {sobreposicao.periodo1.dataFim}
                </div>
              ))}
              <div className="text-amber-700 dark:text-amber-300 mt-2">
                Desconsiderados por concomitância
              </div>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {resultado && (
        <Card className="border-primary/50 bg-primary/5">
          <CardContent className="pt-4 space-y-2">
            <Label className="text-sm font-medium">Tempo calculado:</Label>
            <div className="text-2xl font-bold text-primary">
              {resultado.total.anos} {resultado.total.anos === 1 ? 'ano' : 'anos'}, {resultado.total.meses} {resultado.total.meses === 1 ? 'mês' : 'meses'}, {resultado.total.dias} {resultado.total.dias === 1 ? 'dia' : 'dias'}
            </div>
            <p className="text-xs text-muted-foreground">
              Total de dias não concomitantes: {resultado.diasNaoConcomitantes}
            </p>
          </CardContent>
        </Card>
      )}

      {helpText && (
        <p className="text-sm text-muted-foreground">{helpText}</p>
      )}
    </>
  );

  if (noCard) {
    return <div className="space-y-4">{content}</div>;
  }

  return (
    <Card className="border-border/50 shadow-sm">
      <CardContent className="pt-6 space-y-4">
        {content}
      </CardContent>
    </Card>
  );
};
