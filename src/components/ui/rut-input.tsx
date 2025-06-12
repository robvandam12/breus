
import { useState, useEffect } from 'react';
import { Input } from './input';
import { Label } from './label';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface RutInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  className?: string;
}

export const RutInput = ({ 
  value, 
  onChange, 
  label = "RUT", 
  placeholder = "12.345.678-9",
  required = false,
  className 
}: RutInputProps) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [displayValue, setDisplayValue] = useState(value);

  const formatRut = (rut: string) => {
    // Limpiar el RUT de caracteres no válidos
    const cleaned = rut.replace(/[^0-9Kk]/g, '').toUpperCase();
    
    if (cleaned.length <= 1) return cleaned;
    
    // Separar número del dígito verificador
    const number = cleaned.slice(0, -1);
    const digit = cleaned.slice(-1);
    
    // Formatear con puntos
    let formatted = number.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    
    // Agregar guión antes del dígito verificador
    if (digit) {
      formatted += `-${digit}`;
    }
    
    return formatted;
  };

  const validateRut = async (rut: string) => {
    if (!rut) {
      setIsValid(null);
      return;
    }

    try {
      // Aquí podrías llamar a tu función de validación de Supabase
      // Por simplicidad, implemento la validación en frontend
      const cleaned = rut.replace(/[^0-9Kk]/g, '').toUpperCase();
      
      if (cleaned.length < 2) {
        setIsValid(false);
        return;
      }
      
      const number = cleaned.slice(0, -1);
      const digit = cleaned.slice(-1);
      
      // Validar que el número sea numérico
      if (!/^[0-9]+$/.test(number)) {
        setIsValid(false);
        return;
      }
      
      // Calcular dígito verificador
      let sum = 0;
      let multiplier = 2;
      
      for (let i = number.length - 1; i >= 0; i--) {
        sum += parseInt(number[i]) * multiplier;
        multiplier = multiplier === 7 ? 2 : multiplier + 1;
      }
      
      const remainder = sum % 11;
      const calculatedDigit = remainder < 2 ? remainder.toString() : remainder === 10 ? 'K' : (11 - remainder).toString();
      
      setIsValid(digit === calculatedDigit);
    } catch (error) {
      console.error('Error validating RUT:', error);
      setIsValid(false);
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => {
      validateRut(value);
    }, 500);
    
    return () => clearTimeout(timer);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const formatted = formatRut(inputValue);
    const cleaned = inputValue.replace(/[^0-9Kk]/g, '').toUpperCase();
    
    setDisplayValue(formatted);
    onChange(cleaned);
  };

  useEffect(() => {
    setDisplayValue(formatRut(value));
  }, [value]);

  return (
    <div className={className}>
      {label && (
        <Label htmlFor="rut">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          id="rut"
          type="text"
          value={displayValue}
          onChange={handleChange}
          placeholder={placeholder}
          className={`pr-10 ${
            isValid === false 
              ? 'border-red-500 focus:border-red-500' 
              : isValid === true 
              ? 'border-green-500 focus:border-green-500' 
              : ''
          }`}
        />
        <div className="absolute inset-y-0 right-0 flex items-center pr-3">
          {isValid === true && (
            <CheckCircle className="w-4 h-4 text-green-500" />
          )}
          {isValid === false && (
            <AlertCircle className="w-4 h-4 text-red-500" />
          )}
        </div>
      </div>
      {isValid === false && (
        <p className="text-sm text-red-500 mt-1">RUT inválido</p>
      )}
    </div>
  );
};
