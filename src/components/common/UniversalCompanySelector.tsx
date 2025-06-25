
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Crown, Building2, Ship, AlertCircle } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useCompanyContext, CompanyContext } from "@/hooks/useCompanyContext";

interface UniversalCompanySelectorProps {
  title?: string;
  description?: string;
  required?: boolean;
  className?: string;
  onChange?: (company: CompanyContext | null) => void;
}

export const UniversalCompanySelector = ({ 
  title = "Contexto Empresarial",
  description = "Selecciona la empresa para la cual realizar esta acción",
  required = true,
  className = "",
  onChange
}: UniversalCompanySelectorProps) => {
  const { context, selectCompany } = useCompanyContext();

  const handleCompanyChange = (companyId: string) => {
    const company = context.availableCompanies.find(c => c.id === companyId) || null;
    const success = selectCompany(company);
    
    if (success && onChange) {
      onChange(company);
    }
  };

  // Si no es superuser, mostrar empresa actual
  if (!context.isSuperuser) {
    if (!context.selectedCompany) {
      return (
        <Alert className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            No se pudo determinar tu empresa. Contacta al administrador.
          </AlertDescription>
        </Alert>
      );
    }

    return (
      <Card className={`border-gray-200 bg-white ${className}`}>
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-gray-800 text-sm">
            {context.selectedCompany.tipo === 'salmonera' ? (
              <Building2 className="w-4 h-4" />
            ) : (
              <Ship className="w-4 h-4" />
            )}
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-2">
            <span className="font-medium">{context.selectedCompany.nombre}</span>
            <Badge variant={context.selectedCompany.tipo === 'salmonera' ? 'default' : 'secondary'}>
              {context.selectedCompany.tipo}
            </Badge>
          </div>
          {context.selectedCompany.modulos.length > 0 && (
            <div className="mt-2">
              <Label className="text-xs text-gray-600">Módulos activos:</Label>
              <div className="flex flex-wrap gap-1 mt-1">
                {context.selectedCompany.modulos.map((modulo) => (
                  <Badge 
                    key={modulo} 
                    variant="outline" 
                    className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                  >
                    {getModuleDisplayName(modulo)}
                  </Badge>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  // Selector para superuser
  return (
    <Card className={`border-gray-200 bg-white ${className}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-gray-800">
          <Crown className="w-5 h-5" />
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label className="text-sm font-medium text-gray-800">
            Empresa Destino {required && '*'}
          </Label>
          <Select 
            onValueChange={handleCompanyChange}
            value={context.selectedCompany?.id || ""}
          >
            <SelectTrigger className="mt-2 border-gray-300">
              <SelectValue placeholder="Selecciona la empresa destino" />
            </SelectTrigger>
            <SelectContent>
              {context.availableCompanies.map((company) => (
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

        {context.selectedCompany && (
          <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
            <div className="flex items-center gap-2 mb-2">
              {context.selectedCompany.tipo === 'salmonera' ? (
                <Building2 className="w-4 h-4 text-blue-500" />
              ) : (
                <Ship className="w-4 h-4 text-green-500" />
              )}
              <span className="font-medium text-gray-900">{context.selectedCompany.nombre}</span>
              <Badge variant={context.selectedCompany.tipo === 'salmonera' ? 'default' : 'secondary'}>
                {context.selectedCompany.tipo}
              </Badge>
            </div>
            
            {context.selectedCompany.modulos.length > 0 && (
              <div className="space-y-2">
                <Label className="text-xs font-medium text-gray-600">
                  Módulos Activos:
                </Label>
                <div className="flex flex-wrap gap-1">
                  {context.selectedCompany.modulos.map((modulo) => (
                    <Badge 
                      key={modulo} 
                      variant="outline" 
                      className="text-xs bg-gray-50 text-gray-600 border-gray-200"
                    >
                      {getModuleDisplayName(modulo)}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {required && !context.selectedCompany && (
          <Alert className="border-gray-300 bg-gray-50">
            <AlertCircle className="h-4 w-4 text-gray-600" />
            <AlertDescription className="text-gray-700">
              Debes seleccionar una empresa antes de continuar.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
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
