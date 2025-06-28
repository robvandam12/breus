
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Building2, Users, Info } from "lucide-react";
import { useEnterpriseContext, EnterpriseOption } from "@/hooks/useEnterpriseContext";
import { Skeleton } from "@/components/ui/skeleton";

interface EnterpriseSelectorProps {
  onSelectionChange?: (result: any) => void;
  disabled?: boolean;
  showCard?: boolean;
  title?: string;
  description?: string;
}

export const EnterpriseSelector = ({
  onSelectionChange,
  disabled = false,
  showCard = true,
  title = "Contexto Empresarial",
  description = "Seleccione las empresas involucradas en esta operación"
}: EnterpriseSelectorProps) => {
  const { state, actions } = useEnterpriseContext();

  React.useEffect(() => {
    const result = actions.getSelectionResult();
    if (result && onSelectionChange) {
      onSelectionChange(result);
    }
  }, [state.selectedSalmonera, state.selectedContratista, onSelectionChange]);

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

  const content = (
    <div className="space-y-4">
      {/* Información del modo de selección */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>{getRoleBadgeText()}</strong>
          {state.mustSelectBoth && " - Debe seleccionar ambas empresas"}
          {!state.canSelectSalmonera && " - Salmonera asignada automáticamente"}
          {!state.canSelectContratista && " - Contratista asignado automáticamente"}
        </AlertDescription>
      </Alert>

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
              Asignada: {state.selectedSalmonera.nombre}
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
              Asignado: {state.selectedContratista.nombre}
            </p>
          )}
          
          {state.selectedSalmonera && state.availableContratistas.length === 0 && !state.isLoading && (
            <p className="text-xs text-amber-600">
              No hay contratistas asociados a esta salmonera
            </p>
          )}
        </div>
      </div>

      {/* Resumen de la selección */}
      {(state.selectedSalmonera || state.selectedContratista) && (
        <div className="p-3 bg-gray-50 rounded-lg">
          <h4 className="text-sm font-medium mb-2">Contexto Seleccionado:</h4>
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
