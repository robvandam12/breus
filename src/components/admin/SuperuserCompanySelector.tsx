
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Crown, Building2, Ship } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

interface CompanyOption {
  id: string;
  nombre: string;
  tipo: 'salmonera' | 'contratista';
  modulos: string[];
  estado: string;
}

interface SuperuserCompanySelectorProps {
  onCompanySelect: (company: CompanyOption | null) => void;
  selectedCompany: CompanyOption | null;
  className?: string;
}

export const SuperuserCompanySelector = ({ 
  onCompanySelect, 
  selectedCompany, 
  className = "" 
}: SuperuserCompanySelectorProps) => {
  const [companies, setCompanies] = useState<CompanyOption[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadCompanies();
  }, []);

  const loadCompanies = async () => {
    setLoading(true);
    try {
      // Cargar salmoneras
      const { data: salmoneras } = await supabase
        .from('salmoneras')
        .select('id, nombre, estado')
        .eq('estado', 'activa');

      // Cargar contratistas
      const { data: contratistas } = await supabase
        .from('contratistas')
        .select('id, nombre, estado')
        .eq('estado', 'activo');

      // Cargar módulos activos para cada empresa
      const allCompanies: CompanyOption[] = [];

      // Procesar salmoneras
      if (salmoneras) {
        for (const salmonera of salmoneras) {
          const { data: modules } = await supabase
            .from('company_modules')
            .select('module_name')
            .eq('company_id', salmonera.id)
            .eq('company_type', 'salmonera')
            .eq('is_active', true);

          allCompanies.push({
            id: salmonera.id,
            nombre: salmonera.nombre,
            tipo: 'salmonera',
            estado: salmonera.estado,
            modulos: modules?.map(m => m.module_name) || ['core_immersions']
          });
        }
      }

      // Procesar contratistas
      if (contratistas) {
        for (const contratista of contratistas) {
          const { data: modules } = await supabase
            .from('company_modules')
            .select('module_name')
            .eq('company_id', contratista.id)
            .eq('company_type', 'contratista')
            .eq('is_active', true);

          allCompanies.push({
            id: contratista.id,
            nombre: contratista.nombre,
            tipo: 'contratista',
            estado: contratista.estado,
            modulos: modules?.map(m => m.module_name) || ['core_immersions']
          });
        }
      }

      setCompanies(allCompanies);
    } catch (error) {
      console.error('Error loading companies:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyChange = (companyId: string) => {
    const company = companies.find(c => c.id === companyId);
    onCompanySelect(company || null);
  };

  const getModuleDisplayName = (moduleName: string) => {
    const moduleMap: Record<string, string> = {
      'core_immersions': 'Inmersiones Core',
      'planning_operations': 'Planificación de Operaciones',
      'maintenance_networks': 'Mantención de Redes',
      'advanced_reporting': 'Reportes Avanzados',
      'external_integrations': 'Integraciones Externas'
    };
    return moduleMap[moduleName] || moduleName;
  };

  return (
    <Card className={`border-yellow-200 bg-yellow-50 ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-yellow-800">
          <Crown className="w-5 h-5" />
          Control de Superuser
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-yellow-800">
            Empresa Destino *
          </Label>
          <Select 
            onValueChange={handleCompanyChange}
            value={selectedCompany?.id || ""}
            disabled={loading}
          >
            <SelectTrigger className="mt-2">
              <SelectValue placeholder={loading ? "Cargando empresas..." : "Selecciona la empresa destino"} />
            </SelectTrigger>
            <SelectContent>
              {companies.map((company) => (
                <SelectItem key={company.id} value={company.id}>
                  <div className="flex items-center gap-3 w-full">
                    {company.tipo === 'salmonera' ? (
                      <Building2 className="w-4 h-4 text-blue-500" />
                    ) : (
                      <Ship className="w-4 h-4 text-green-500" />
                    )}
                    <div className="flex flex-col">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{company.nombre}</span>
                        <Badge 
                          variant={company.tipo === 'salmonera' ? 'default' : 'secondary'}
                          className="text-xs"
                        >
                          {company.tipo}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {selectedCompany && (
          <div className="p-3 bg-white rounded-lg border border-yellow-200">
            <div className="flex items-center gap-2 mb-2">
              {selectedCompany.tipo === 'salmonera' ? (
                <Building2 className="w-4 h-4 text-blue-500" />
              ) : (
                <Ship className="w-4 h-4 text-green-500" />
              )}
              <span className="font-medium text-gray-900">{selectedCompany.nombre}</span>
              <Badge variant={selectedCompany.tipo === 'salmonera' ? 'default' : 'secondary'}>
                {selectedCompany.tipo}
              </Badge>
            </div>
            
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-600">
                Módulos Activos:
              </Label>
              <div className="flex flex-wrap gap-1">
                {selectedCompany.modulos.map((modulo) => (
                  <Badge 
                    key={modulo} 
                    variant="outline" 
                    className="text-xs bg-blue-50 text-blue-700 border-blue-200"
                  >
                    {getModuleDisplayName(modulo)}
                  </Badge>
                ))}
              </div>
              
              <p className="text-xs text-gray-500 mt-2">
                Las inmersiones se crearán con las capacidades disponibles para esta empresa.
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
