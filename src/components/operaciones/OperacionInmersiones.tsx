
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Anchor, Clock, User, AlertTriangle, CheckCircle } from "lucide-react";
import { useInmersiones } from "@/hooks/useInmersiones";
import { CreateInmersionForm } from "./CreateInmersionForm";
import { useOperacionDetails } from "@/hooks/useOperacionDetails";

interface OperacionInmersionesProps {
  operacionId: string;
}

export const OperacionInmersiones = ({ operacionId }: OperacionInmersionesProps) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { inmersiones, isLoading } = useInmersiones();
  const { compliance } = useOperacionDetails(operacionId);

  // Asegurar que inmersiones sea un array antes de usar some
  const operacionInmersiones = Array.isArray(inmersiones) 
    ? inmersiones.filter(inmersion => inmersion.operacion_id === operacionId)
    : [];

  const handleCreateSuccess = () => {
    setShowCreateForm(false);
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'en_progreso':
        return 'bg-blue-100 text-blue-800';
      case 'planificada':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const canCreateImmersion = compliance?.canExecute === true;

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="w-5 h-5" />
            Inmersiones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            {[1, 2, 3].map((i) => (
              <div key={i} className="p-4 border rounded-lg">
                <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Anchor className="w-5 h-5" />
            Inmersiones ({operacionInmersiones.length})
          </CardTitle>
          <div className="flex items-center gap-2">
            {!canCreateImmersion && (
              <div className="flex items-center gap-1 text-orange-600 text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>Documentos pendientes</span>
              </div>
            )}
            <Button
              onClick={() => setShowCreateForm(true)}
              size="sm"
              disabled={!canCreateImmersion}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Nueva Inmersión
            </Button>
          </div>
        </div>
        {!canCreateImmersion && (
          <div className="text-sm text-orange-600 bg-orange-50 border border-orange-200 rounded-lg p-3 mt-2">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-4 h-4" />
              <span className="font-medium">Requisitos pendientes:</span>
            </div>
            <ul className="mt-2 ml-6 space-y-1 text-xs">
              {!compliance?.hasValidHPT && <li>• HPT firmado requerido</li>}
              {!compliance?.hasValidAnexo && <li>• Anexo Bravo firmado requer

ido</li>}
              {!compliance?.hasTeam && <li>• Equipo de buceo asignado requerido</li>}
            </ul>
          </div>
        )}
      </CardHeader>
      <CardContent>
        {showCreateForm ? (
          <CreateInmersionForm
            operacionId={operacionId}
            onSuccess={handleCreateSuccess}
            onCancel={() => setShowCreateForm(false)}
          />
        ) : (
          <div className="space-y-4">
            {operacionInmersiones.length === 0 ? (
              <div className="text-center py-8">
                <Anchor className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay inmersiones registradas
                </h3>
                <p className="text-gray-500 mb-4">
                  {canCreateImmersion 
                    ? "Comienza creando la primera inmersión para esta operación"
                    : "Completa los documentos requeridos para crear inmersiones"
                  }
                </p>
              </div>
            ) : (
              <div className="grid gap-4">
                {operacionInmersiones.map((inmersion) => (
                  <div key={inmersion.inmersion_id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h4 className="font-medium text-gray-900 mb-1">
                          {inmersion.codigo}
                        </h4>
                        <p className="text-sm text-gray-600">
                          {inmersion.objetivo}
                        </p>
                      </div>
                      <Badge className={getEstadoBadgeColor(inmersion.estado)}>
                        {inmersion.estado}
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          {inmersion.buzo_principal}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Anchor className="w-4 h-4 text-gray-400" />
                        <span className="text-gray-600">
                          Prof. máx: {inmersion.profundidad_max}m
                        </span>
                      </div>
                    </div>

                    {inmersion.observaciones && (
                      <div className="mt-3 p-2 bg-blue-50 rounded text-sm">
                        <strong>Observaciones:</strong> {inmersion.observaciones}
                      </div>
                    )}

                    <div className="mt-3 flex items-center gap-2">
                      {inmersion.hpt_validado && (
                        <div className="flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle className="w-3 h-3" />
                          <span>HPT Validado</span>
                        </div>
                      )}
                      {inmersion.anexo_bravo_validado && (
                        <div className="flex items-center gap-1 text-green-600 text-xs">
                          <CheckCircle className="w-3 h-3" />
                          <span>Anexo Bravo Validado</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
