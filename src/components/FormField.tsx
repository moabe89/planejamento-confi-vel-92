import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  required?: boolean;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  helpText?: string;
  className?: string;
}

export const FormField: React.FC<FormFieldProps> = ({
  label,
  name,
  type = 'text',
  value,
  onChange,
  onBlur,
  error,
  required = false,
  placeholder,
  disabled = false,
  maxLength,
  helpText,
  className,
}) => {
  const inputId = `field-${name}`;

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={inputId} className="text-sm font-medium text-foreground">
        {label}
        {required && <span className="text-destructive ml-1" aria-label="obrigatório">*</span>}
      </Label>
      <Input
        id={inputId}
        name={name}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onBlur={onBlur}
        placeholder={placeholder}
        disabled={disabled}
        maxLength={maxLength}
        aria-invalid={!!error}
        aria-describedby={error ? `${inputId}-error` : helpText ? `${inputId}-help` : undefined}
        className={cn(
          'transition-all',
          error && 'border-destructive focus-visible:ring-destructive'
        )}
      />
      {helpText && !error && (
        <p id={`${inputId}-help`} className="text-xs text-muted-foreground">
          {helpText}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="text-xs text-destructive animate-slide-in" role="alert">
          {error}
        </p>
      )}
    </div>
  );
};
