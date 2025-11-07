import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import type { TempoNormalizado } from '@/lib/validations';

interface TempoInputProps {
  label: string;
  name: string;
  value: TempoNormalizado;
  onChange: (value: TempoNormalizado) => void;
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const TempoInput: React.FC<TempoInputProps> = ({
  label,
  name,
  value,
  onChange,
  error,
  required = false,
  disabled = false,
  className,
}) => {
  const handleChange = (field: keyof TempoNormalizado, val: string) => {
    let numValue = Math.max(0, parseInt(val) || 0);
    
    // Limitar meses a 12 e dias a 31
    if (field === 'meses' && numValue > 12) numValue = 12;
    if (field === 'dias' && numValue > 31) numValue = 31;
    
    onChange({ ...value, [field]: numValue });
  };

  return (
    <div className={cn('space-y-2', className)}>
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1" aria-label="obrigatório">*</span>}
      </Label>
      <div className="grid grid-cols-3 gap-3">
        <div>
          <Label htmlFor={`${name}-anos`} className="text-xs text-muted-foreground">
            Anos
          </Label>
          <Input
            id={`${name}-anos`}
            type="number"
            min="0"
            value={value.anos}
            onChange={(e) => handleChange('anos', e.target.value)}
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(error && 'border-destructive')}
          />
        </div>
        <div>
          <Label htmlFor={`${name}-meses`} className="text-xs text-muted-foreground">
            Meses
          </Label>
          <Input
            id={`${name}-meses`}
            type="number"
            min="0"
            max="12"
            value={value.meses}
            onChange={(e) => handleChange('meses', e.target.value)}
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(error && 'border-destructive')}
          />
        </div>
        <div>
          <Label htmlFor={`${name}-dias`} className="text-xs text-muted-foreground">
            Dias
          </Label>
          <Input
            id={`${name}-dias`}
            type="number"
            min="0"
            max="31"
            value={value.dias}
            onChange={(e) => handleChange('dias', e.target.value)}
            disabled={disabled}
            aria-invalid={!!error}
            className={cn(error && 'border-destructive')}
          />
        </div>
      </div>
      {error && (
        <p className="text-xs text-destructive animate-slide-in" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
