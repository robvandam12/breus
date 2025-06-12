
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertCircle, CheckCircle } from 'lucide-react';

interface RutInputProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
}

export const RutInput: React.FC<RutInputProps> = ({
  value,
  onChange,
  label = "RUT",
  placeholder = "12.345.678-9",
  required = false,
  disabled = false,
  className = ""
}) => {
  const [isValid, setIsValid] = useState<boolean | null>(null);
  const [formattedValue, setFormattedValue] = useState(value);

  // Función para formatear RUT
  const formatRut = (rut: string): string => {
    const rutClean = rut.replace(/[^0-9kK]/g, '');
    if (rutClean.length <= 1) return rutClean;
    
    const rutNumber = rutClean.slice(0, -1);
    const checkDigit = rutClean.slice(-1).toUpperCase();
    
    let formatted = rutNumber.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    return `${formatted}-${checkDigit}`;
  };

  // Función para validar RUT
  const validateRut = (rut: string): boolean => {
    const rutClean = rut.replace(/[^0-9kK]/g, '').toUpperCase();
    
    if (rutClean.length < 2) return false;
    
    const rutNumber = rutClean.slice(0, -1);
    const checkDigit = rutClean.slice(-1);
    
    if (!/^\d+$/.test(rutNumber)) return false;
    
    let sum = 0;
    let multiplier = 2;
    
    for (let i = rutNumber.length - 1; i >= 0; i--) {
      sum += parseInt(rutNumber[i]) * multiplier;
      multiplier = multiplier === 7 ? 2 : multiplier + 1;
    }
    
    const calculatedDigit = 11 - (sum % 11);
    const expectedDigit = calculatedDigit === 10 ? 'K' : calculatedDigit === 11 ? '0' : calculatedDigit.toString();
    
    return checkDigit === expectedDigit;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const rutClean = inputValue.replace(/[^0-9kK]/g, '');
    
    if (rutClean.length <= 9) {
      const formatted = formatRut(rutClean);
      setFormattedValue(formatted);
      onChange(rutClean);
      
      if (rutClean.length >= 2) {
        setIsValid(validateRut(rutClean));
      } else {
        setIsValid(null);
      }
    }
  };

  useEffect(() => {
    if (value) {
      setFormattedValue(formatRut(value));
      setIsValid(value.length >= 2 ? validateRut(value) : null);
    }
  }, [value]);

  return (
    <div className={className}>
      {label && (
        <Label htmlFor="rut-input">
          {label} {required && <span className="text-red-500">*</span>}
        </Label>
      )}
      <div className="relative">
        <Input
          id="rut-input"
          type="text"
          value={formattedValue}
          onChange={handleChange}
          placeholder={placeholder}
          disabled={disabled}
          className={`pr-10 ${
            isValid === false ? 'border-red-500 focus:border-red-500' : 
            isValid === true ? 'border-green-500 focus:border-green-500' : ''
          }`}
        />
        {isValid !== null && (
          <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
            {isValid ? (
              <CheckCircle className="w-4 h-4 text-green-500" />
            ) : (
              <AlertCircle className="w-4 h-4 text-red-500" />
            )}
          </div>
        )}
      </div>
      {isValid === false && (
        <p className="text-sm text-red-600 mt-1">
          RUT inválido. Verifique el formato.
        </p>
      )}
    </div>
  );
};
