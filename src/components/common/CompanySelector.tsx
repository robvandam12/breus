
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Building, Users } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';

interface Company {
  id: string;
  nombre: string;
  rut: string;
  tipo: 'salmonera' | 'contratista';
}

interface CompanySelectorProps {
  value?: string;
  onChange?: (value: string) => void;
  includeTypes?: ('salmonera' | 'contratista')[];
  placeholder?: string;
  disabled?: boolean;
  label?: string;
}

export const CompanySelector = ({
  value = '',
  onChange,
  includeTypes = ['salmonera', 'contratista'],
  placeholder = 'Seleccionar empresa...',
  disabled = false,
  label
}: CompanySelectorProps) => {
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadCompanies();
  }, [includeTypes]);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      const companiesData: Company[] = [];

      // Cargar salmoneras si está incluido
      if (includeTypes.includes('salmonera')) {
        const { data: salmoneras } = await supabase
          .from('salmoneras')
          .select('id, nombre, rut')
          .eq('estado', 'activa')
          .order('nombre');

        if (salmoneras) {
          companiesData.push(...salmoneras.map(s => ({
            ...s,
            tipo: 'salmonera' as const
          })));
        }
      }

      // Cargar contratistas si está incluido
      if (includeTypes.includes('contratista')) {
        const { data: contratistas } = await supabase
          .from('contratistas')
          .select('id, nombre, rut')
          .eq('estado', 'activo')
          .order('nombre');

        if (contratistas) {
          companiesData.push(...contratistas.map(c => ({
            ...c,
            tipo: 'contratista' as const
          })));
        }
      }

      setCompanies(companiesData);
    } catch (error) {
      console.error('Error loading companies:', error);
      setCompanies([]);
    } finally {
      setLoading(false);
    }
  };

  const formatCompanyValue = (company: Company) => {
    return `${company.tipo}_${company.id}`;
  };

  const getCompanyIcon = (tipo: string) => {
    return tipo === 'salmonera' ? <Building className="w-4 h-4" /> : <Users className="w-4 h-4" />;
  };

  const getCompanyBadge = (tipo: string) => {
    return tipo === 'salmonera' 
      ? <Badge variant="outline" className="text-xs">Salmonera</Badge>
      : <Badge variant="secondary" className="text-xs">Contratista</Badge>;
  };

  return (
    <div className="space-y-2">
      {label && <Label>{label}</Label>}
      <Select 
        value={value} 
        onValueChange={onChange}
        disabled={disabled || loading}
      >
        <SelectTrigger>
          <SelectValue placeholder={loading ? 'Cargando empresas...' : placeholder} />
        </SelectTrigger>
        <SelectContent>
          {companies.map((company) => (
            <SelectItem 
              key={formatCompanyValue(company)} 
              value={formatCompanyValue(company)}
            >
              <div className="flex items-center justify-between w-full">
                <div className="flex items-center gap-2">
                  {getCompanyIcon(company.tipo)}
                  <div>
                    <div className="font-medium">{company.nombre}</div>
                    <div className="text-xs text-gray-500">{company.rut}</div>
                  </div>
                </div>
                {getCompanyBadge(company.tipo)}
              </div>
            </SelectItem>
          ))}
          {companies.length === 0 && !loading && (
            <SelectItem value="" disabled>
              No hay empresas disponibles
            </SelectItem>
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

// Función helper para parsear la selección
export const parseCompanySelection = (selection: string) => {
  if (!selection) return null;
  
  const [tipo, id] = selection.split('_');
  if (!tipo || !id) return null;
  
  return {
    tipo: tipo as 'salmonera' | 'contratista',
    id
  };
};
