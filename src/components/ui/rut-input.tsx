
import { useState, forwardRef } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CheckCircle2, XCircle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface RutInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const RutInput = forwardRef<HTMLInputElement, RutInputProps>(({
  value,
  onChange,
  label = "RUT",
  placeholder = "12.345.678-9",
  required = false,
  className = ""
}, ref) => {
  const [isValidating, setIsValidating] = useState(false);
  const [isValid, setIsValid] = useState<boolean | null>(null);

  const formatRut = (rut: string) => {
    // Limpiar el RUT
    const cleaned = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    
    if (cleaned.length <= 1) return cleaned;
    
    // Separar número y dígito verificador
    const number = cleaned.slice(0, -1);
    const checkDigit = cleaned.slice(-1);
    
    // Formatear con puntos
    let formatted = '';
    for (let i = number.length - 1; i >= 0; i--) {
      formatted = number[i] + formatted;
      if ((number.length - i) % 3 === 0 && i > 0) {
        formatted = '.' + formatted;
      }
    }
    
    return formatted + (checkDigit ? '-' + checkDigit : '');
  };

  const validateRut = async (rut: string) => {
    if (!rut || rut.length < 3) {
      setIsValid(null);
      return;
    }

    setIsValidating(true);
    
    try {
      const { data, error } = await supabase.rpc('validate_rut', { 
        rut_input: rut 
      });
      
      if (error) {
        console.error('Error validating RUT:', error);
        setIsValid(false);
      } else {
        setIsValid(data);
      }
    } catch (error) {
      console.error('Error validating RUT:', error);
      setIsValid(false);
    } finally {
      setIsValidating(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formattedValue = formatRut(inputValue);
    
    onChange(formattedValue);
    
    // Validar después de un pequeño delay
    setTimeout(() => {
      validateRut(formattedValue);
    }, 500);
  };

  const getValidationIcon = () => {
    if (isValidating) {
      return <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>;
    }
    
    if (isValid === true) {
      return <CheckCircle2 className="w-4 h-4 text-green-600" />;
    }
    
    if (isValid === false) {
      return <XCircle className="w-4 h-4 text-red-600" />;
    }
    
    return null;
  };

  return (
    <div className={className}>
      {label && (
        <Label htmlFor="rut">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          ref={ref}
          id="rut"
          type="text"
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          maxLength={12}
          className={`pr-10 ${
            isValid === true ? 'border-green-500' : 
            isValid === false ? 'border-red-500' : ''
          }`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {getValidationIcon()}
        </div>
      </div>
      {isValid === false && (
        <p className="text-sm text-red-600 mt-1">RUT inválido</p>
      )}
    </div>
  );
});

RutInput.displayName = "RutInput";
