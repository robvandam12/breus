
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { Skeleton } from "@/components/ui/skeleton";

interface Company {
  id: string;
  nombre: string;
  tipo: 'salmonera' | 'contratista';
}

interface CompanySelectorProps {
  value?: string;
  onValueChange: (value: string) => void;
  placeholder?: string;
  label?: string;
  required?: boolean;
  disabled?: boolean;
  includeTypes?: ('salmonera' | 'contratista')[];
}

export const CompanySelector = ({
  value,
  onValueChange,
  placeholder = "Seleccionar empresa",
  label = "Empresa",
  required = false,
  disabled = false,
  includeTypes = ['salmonera', 'contratista']
}: CompanySelectorProps) => {
  const { data: companies = [], isLoading } = useQuery({
    queryKey: ['companies-for-selector', includeTypes],
    queryFn: async () => {
      const companies: Company[] = [];
      
      // Obtener salmoneras si están incluidas
      if (includeTypes.includes('salmonera')) {
        const { data: salmoneras, error: salmonerasError } = await supabase
          .from('salmoneras')
          .select('id, nombre')
          .eq('estado', 'activa')
          .order('nombre');

        if (!salmonerasError && salmoneras) {
          companies.push(...salmoneras.map(s => ({
            id: `salmonera_${s.id}`,
            nombre: s.nombre,
            tipo: 'salmonera' as const
          })));
        }
      }

      // Obtener contratistas si están incluidos
      if (includeTypes.includes('contratista')) {
        const { data: contratistas, error: contratistasError } = await supabase
          .from('contratistas')
          .select('id, nombre')
          .eq('estado', 'activo')
          .order('nombre');

        if (!contratistasError && contratistas) {
          companies.push(...contratistas.map(c => ({
            id: `contratista_${c.id}`,
            nombre: c.nombre,
            tipo: 'contratista' as const
          })));
        }
      }

      // Ordenar por nombre
      return companies.sort((a, b) => a.nombre.localeCompare(b.nombre));
    },
  });

  if (isLoading) {
    return (
      <div className="space-y-2">
        {label && <Label>{label}</Label>}
        <Skeleton className="h-10 w-full" />
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {label && (
        <Label>
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </Label>
      )}
      <Select value={value} onValueChange={onValueChange} disabled={disabled}>
        <SelectTrigger>
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {companies.map((company) => (
            <SelectItem key={company.id} value={company.id}>
              {company.nombre} ({company.tipo === 'salmonera' ? 'Salmonera' : 'Contratista'})
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

// Utilidad para extraer información de la empresa seleccionada
export const parseCompanySelection = (value: string) => {
  if (!value) return null;
  
  const [tipo, id] = value.split('_');
  return {
    tipo: tipo as 'salmonera' | 'contratista',
    id: id
  };
};
