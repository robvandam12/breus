
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Building, AlertTriangle } from "lucide-react";
import { useOperacionesQuery } from '@/hooks/useOperacionesQuery';
import { useEnterpriseValidation } from '@/hooks/useEnterpriseValidation';
import { EnterpriseSelector } from '@/components/common/EnterpriseSelector';
import { OperacionesDataTable } from './OperacionesDataTable';
import { CreateOperacionDialog } from './CreateOperacionDialog';

export const OperacionesManager = () => {
  const { profile } = useAuth();
  const [selectedEnterprise, setSelectedEnterprise] = useState<any>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  
  const { validation } = useEnterpriseValidation(
    selectedEnterprise?.salmonera_id || selectedEnterprise?.contratista_id,
    selectedEnterprise?.salmonera_id ? 'salmonera' : 'contratista'
  );

  const { data: operaciones = [], isLoading } = useOperacionesQuery();

  // Auto-configurar empresa para usuarios no superuser
  React.useEffect(() => {
    if (profile && profile.role !== 'superuser') {
      const autoEnterprise = {
        salmonera_id: profile.salmonera_id,
        contratista_id: profile.servicio_id,
        context_metadata: {
          selection_mode: profile.salmonera_id ? 'salmonera_admin' : 'contratista_admin',
          empresa_origen_tipo: profile.salmonera_id ? 'salmonera' : 'contratista'
        }
      };
      setSelectedEnterprise(autoEnterprise);
    }
  }, [profile]);

  const handleEnterpriseChange = (result: any) => {
    setSelectedEnterprise(result);
  };

  const handleCreateOperation = () => {
    if (!validation.canAccessPlanning) {
      return;
    }
    setShowCreateDialog(true);
  };

  // Mostrar selector de empresa para superusers
  if (profile?.role === 'superuser' && !selectedEnterprise) {
    return (
      <div className="space-y-4">
        <EnterpriseSelector
          onSelectionChange={handleEnterpriseChange}
          showCard={false}
          title="Seleccionar Empresa para Operaciones"
          description="Seleccione la empresa para gestionar las operaciones"
          autoSubmit={true}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Mostrar empresa seleccionada para superusers */}
      {profile?.role === 'superuser' && selectedEnterprise && (
        <div className="flex items-center justify-between text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
          <span>
            Empresa: {selectedEnterprise.salmonera_id ? 'Salmonera' : 'Contratista'}
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setSelectedEnterprise(null)}
            className="text-blue-600 hover:text-blue-800 h-auto p-1"
          >
            Cambiar
          </Button>
        </div>
      )}

      {/* Mostrar validaciones de módulos */}
      {validation.validationMessage && (
        <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
          <div className="flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
            <div>
              <h4 className="font-medium text-amber-800">Acceso Limitado a Módulos</h4>
              <p className="text-sm text-amber-700 mt-1">{validation.validationMessage}</p>
            </div>
          </div>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Building className="w-6 h-6" />
              <div>
                <CardTitle>Gestión de Operaciones</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Administre las operaciones de buceo y planificación
                </p>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {validation.canAccessPlanning && (
                <Badge variant="outline" className="text-green-600 border-green-200">
                  Planning Activo
                </Badge>
              )}
              
              <Button
                onClick={handleCreateOperation}
                disabled={!validation.canAccessPlanning}
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Nueva Operación
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {!validation.canAccessPlanning ? (
            <div className="text-center py-12 text-gray-500">
              <Building className="w-16 h-16 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium mb-2">Módulo Planning No Disponible</h3>
              <p className="text-sm">
                Esta empresa no tiene el módulo de Planning activo.
                <br />
                Contacte al administrador para habilitar este módulo.
              </p>
            </div>
          ) : (
            <OperacionesDataTable
              operaciones={operaciones}
              isLoading={isLoading}
              enterpriseContext={selectedEnterprise}
            />
          )}
        </CardContent>
      </Card>

      {/* Dialog para crear operación */}
      {showCreateDialog && (
        <CreateOperacionDialog
          isOpen={showCreateDialog}
          onClose={() => setShowCreateDialog(false)}
          enterpriseContext={selectedEnterprise}
        />
      )}
    </div>
  );
};
