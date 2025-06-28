
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Users, Info } from "lucide-react";
import { useEnterpriseContext, EnterpriseOption } from "@/hooks/useEnterpriseContext";
import { useEnterpriseModuleAccess } from "@/hooks/useEnterpriseModuleAccess";
import { EnterpriseModuleIndicator } from "./EnterpriseModuleIndicator";
import { Skeleton } from "@/components/ui/skeleton";

interface EnterpriseSelectorProps {
  onSelectionChange?: (result: any) => void;
  disabled?: boolean;
  showCard?: boolean;
  title?: string;
  description?: string;
  requiredModule?: string;
  showModuleInfo?: boolean;
  autoSubmit?: boolean; // New prop to control auto-submission
}

export const EnterpriseSelector = ({
  onSelectionChange,
  disabled = false,
  showCard = true,
  title = "Contexto Empresarial",
  description = "Seleccione las empresas involucradas en esta operación",
  requiredModule,
  showModuleInfo = true,
  autoSubmit = true // Default to true for backward compatibility
}: EnterpriseSelectorProps) => {
  const { state, actions } = useEnterpriseContext();
  const { getModulesForCompany, loading: modulesLoading } = useEnterpriseModuleAccess();
  const [selectedCompanyModules, setSelectedCompanyModules] = React.useState<any>(null);

  // Only auto-submit for non-superusers or when explicitly enabled
  React.useEffect(() => {
    if (!autoSubmit) return;
    
    const result = actions.getSelectionResult();
    if (result && onSelectionChange) {
      // For superusers, only auto-submit if both are selected or if mustSelectBoth is false
      if (state.mustSelectBoth) {
        if (state.selectedSalmonera && state.selectedContratista) {
          onSelectionChange(result);
        }
      } else {
        onSelectionChange(result);
      }
    }
  }, [state.selectedSalmonera, state.selectedContratista, onSelectionChange, autoSubmit, state.mustSelectBoth]);

  // Cargar módulos cuando se selecciona una empresa
  React.useEffect(() => {
    const loadModules = async () => {
      if (state.selectedSalmonera && showModuleInfo) {
        const modules = await getModulesForCompany(state.selectedSalmonera.id, 'salmonera');
        setSelectedCompanyModules(modules);
      } else if (state.selectedContratista && showModuleInfo) {
        const modules = await getModulesForCompany(state.selectedContratista.id, 'contratista');
        setSelectedCompanyModules(modules);
      } else {
        setSelectedCompanyModules(null);
      }
    };

    loadModules();
  }, [state.selectedSalmonera, state.selectedContratista, showModuleInfo]);

  const handleSalmoneraChange = (salmoneraId: string) => {
    const salmonera = state.availableSalmoneras.find(s => s.id === salmoneraId);
    actions.setSelectedSalmonera(salmonera || null);
    // Reset contratista when salmonera changes
    actions.setSelectedContratista(null);
  };

  const handleContratistaChange = (contratistaId: string) => {
    const contratista = state.availableContratistas.find(c => c.id === contratistaId);
    actions.setSelectedContratista(contratista || null);
  };

  const handleManualSubmit = () => {
    const result = actions.getSelectionResult();
    if (result && onSelectionChange) {
      onSelectionChange(result);
    }
  };

  const getRoleBadgeText = () => {
    const result = actions.getSelectionResult();
    if (!result) return '';
    
    switch (result.context_metadata.selection_mode) {
      case 'superuser': return 'Modo Superusuario';
      case 'salmonera_admin': return 'Administrador Salmonera';
      case 'contratista_admin': return 'Administrador Contratista';
      case 'inherited': return 'Contexto Heredado';
      default: return '';
    }
  };

  const shouldShowModeAlert = () => {
    const result = actions.getSelectionResult();
    return result?.context_metadata.selection_mode === 'superuser' && (state.mustSelectBoth || !state.canSelectSalmonera || !state.canSelectContratista);
  };

  const canSubmit = () => {
    if (state.mustSelectBoth) {
      return state.selectedSalmonera && state.selectedContratista;
    }
    return state.selectedSalmonera || state.selectedContratista;
  };

  const content = (
    <div className="space-y-4">
      {/* Solo mostrar información del modo para superuser cuando sea relevante */}
      {shouldShowModeAlert() && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="h-4 w-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <strong>{getRoleBadgeText()}</strong>
            {state.mustSelectBoth && " - Seleccione ambas empresas"}
          </AlertDescription>
        </Alert>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Selector de Salmonera */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Building2 className="w-4 h-4 text-blue-600" />
            Salmonera
            {state.mustSelectBoth && <span className="text-red-500">*</span>}
          </Label>
          
          {state.isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              value={state.selectedSalmonera?.id || ""}
              onValueChange={handleSalmoneraChange}
              disabled={disabled || !state.canSelectSalmonera}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar salmonera..." />
              </SelectTrigger>
              <SelectContent>
                {state.availableSalmoneras.map((salmonera) => (
                  <SelectItem key={salmonera.id} value={salmonera.id}>
                    <div className="flex flex-col">
                      <span>{salmonera.nombre}</span>
                      {salmonera.rut && (
                        <span className="text-xs text-gray-500">RUT: {salmonera.rut}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {!state.canSelectSalmonera && state.selectedSalmonera && (
            <p className="text-xs text-blue-600">
              {state.selectedSalmonera.nombre}
            </p>
          )}
        </div>

        {/* Selector de Contratista */}
        <div className="space-y-2">
          <Label className="flex items-center gap-2">
            <Users className="w-4 h-4 text-orange-600" />
            Contratista
            {state.mustSelectBoth && <span className="text-red-500">*</span>}
          </Label>
          
          {state.isLoading ? (
            <Skeleton className="h-10 w-full" />
          ) : (
            <Select
              value={state.selectedContratista?.id || ""}
              onValueChange={handleContratistaChange}
              disabled={disabled || !state.canSelectContratista || !state.selectedSalmonera}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar contratista..." />
              </SelectTrigger>
              <SelectContent>
                {state.availableContratistas.map((contratista) => (
                  <SelectItem key={contratista.id} value={contratista.id}>
                    <div className="flex flex-col">
                      <span>{contratista.nombre}</span>
                      {contratista.rut && (
                        <span className="text-xs text-gray-500">RUT: {contratista.rut}</span>
                      )}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
          
          {!state.canSelectContratista && state.selectedContratista && (
            <p className="text-xs text-orange-600">
              {state.selectedContratista.nombre}
            </p>
          )}
          
          {state.selectedSalmonera && state.availableContratistas.length === 0 && !state.isLoading && (
            <p className="text-xs text-amber-600">
              No hay contratistas asociados
            </p>
          )}
        </div>
      </div>

      {/* Información de módulos - solo si se solicita explícitamente */}
      {showModuleInfo && selectedCompanyModules && !modulesLoading && (
        <div className="mt-4">
          <EnterpriseModuleIndicator
            modules={selectedCompanyModules.modules}
            requiredModule={requiredModule}
            showAll={false}
            compact={true}
          />
        </div>
      )}

      {/* Manual submit button for non-auto-submit scenarios */}
      {!autoSubmit && canSubmit() && (
        <div className="flex justify-end">
          <button
            onClick={handleManualSubmit}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
          >
            Continuar
          </button>
        </div>
      )}

      {/* Resumen de la selección - más discreto */}
      {(state.selectedSalmonera || state.selectedContratista) && (
        <div className="p-3 bg-gray-50 rounded-lg border border-gray-200">
          <div className="space-y-1 text-xs">
            {state.selectedSalmonera && (
              <div className="flex items-center gap-2">
                <Building2 className="w-3 h-3 text-blue-600" />
                <span><strong>Salmonera:</strong> {state.selectedSalmonera.nombre}</span>
              </div>
            )}
            {state.selectedContratista && (
              <div className="flex items-center gap-2">
                <Users className="w-3 h-3 text-orange-600" />
                <span><strong>Contratista:</strong> {state.selectedContratista.nombre}</span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );

  if (!showCard) {
    return content;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="w-5 h-5 text-blue-600" />
          {title}
        </CardTitle>
        {description && (
          <p className="text-sm text-gray-600">{description}</p>
        )}
      </CardHeader>
      <CardContent>
        {content}
      </CardContent>
    </Card>
  );
};
