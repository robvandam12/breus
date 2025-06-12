
import { useState, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

interface RutInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value?: string;
  onChange?: (value: string) => void;
  onValidationChange?: (isValid: boolean) => void;
}

const formatRut = (value: string): string => {
  // Remover caracteres no válidos
  const clean = value.replace(/[^0-9kK]/g, '').toUpperCase();
  
  if (clean.length <= 1) return clean;
  
  // Separar dígito verificador
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  
  // Formatear con puntos
  const formatted = body.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  
  return `${formatted}-${dv}`;
};

const validateRut = (rut: string): boolean => {
  const clean = rut.replace(/[^0-9kK]/g, '').toUpperCase();
  
  if (clean.length < 2) return false;
  
  const body = clean.slice(0, -1);
  const dv = clean.slice(-1);
  
  if (!/^\d+$/.test(body)) return false;
  
  let sum = 0;
  let multiplier = 2;
  
  for (let i = body.length - 1; i >= 0; i--) {
    sum += parseInt(body[i]) * multiplier;
    multiplier = multiplier === 7 ? 2 : multiplier + 1;
  }
  
  const calculatedDv = 11 - (sum % 11);
  const expectedDv = calculatedDv === 10 ? 'K' : calculatedDv === 11 ? '0' : calculatedDv.toString();
  
  return dv === expectedDv;
};

export const RutInput = forwardRef<HTMLInputElement, RutInputProps>(
  ({ className, value = '', onChange, onValidationChange, ...props }, ref) => {
    const [isValid, setIsValid] = useState(true);
    const [touched, setTouched] = useState(false);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const inputValue = e.target.value;
      const formatted = formatRut(inputValue);
      const valid = formatted.length < 3 || validateRut(formatted);
      
      setIsValid(valid);
      onChange?.(formatted);
      onValidationChange?.(valid);
    };

    const handleBlur = () => {
      setTouched(true);
    };

    const showError = touched && !isValid && value.length > 0;

    return (
      <div>
        <Input
          ref={ref}
          value={value}
          onChange={handleChange}
          onBlur={handleBlur}
          placeholder="12.345.678-9"
          className={cn(
            className,
            showError && "border-red-500 focus:border-red-500"
          )}
          {...props}
        />
        {showError && (
          <p className="text-sm text-red-500 mt-1">RUT inválido</p>
        )}
      </div>
    );
  }
);

RutInput.displayName = "RutInput";
