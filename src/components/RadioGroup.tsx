import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup as RadixRadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { cn } from '@/lib/utils';

interface RadioOption {
  value: string;
  label: string;
}

interface RadioGroupProps {
  label: string;
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: RadioOption[];
  error?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const RadioGroup: React.FC<RadioGroupProps> = ({
  label,
  name,
  value,
  onChange,
  options,
  error,
  required = false,
  disabled = false,
  className,
}) => {
  return (
    <div className={cn('space-y-3', className)}>
      <Label className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1" aria-label="obrigatório">*</span>}
      </Label>
      <RadixRadioGroup
        value={value}
        onValueChange={onChange}
        disabled={disabled}
        aria-invalid={!!error}
        className="space-y-2"
      >
        {options.map((option) => (
          <div key={option.value} className="flex items-center space-x-2">
            <RadioGroupItem value={option.value} id={`${name}-${option.value}`} />
            <Label
              htmlFor={`${name}-${option.value}`}
              className="text-sm font-normal cursor-pointer"
            >
              {option.label}
            </Label>
          </div>
        ))}
      </RadixRadioGroup>
      {error && (
        <p className="text-xs text-destructive animate-slide-in" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
