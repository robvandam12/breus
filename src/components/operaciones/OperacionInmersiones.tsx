
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Waves, Plus, AlertTriangle, CheckCircle, Eye, FileText } from "lucide-react";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useHPT } from "@/hooks/useHPT";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { useRouter } from "@/hooks/useRouter";

interface OperacionInmersionesProps {
  operacionId: string;
}

export const OperacionInmersiones = ({ operacionId }: OperacionInmersionesProps) => {
  const { navigateTo } = useRouter();
  const { inmersiones, isLoading } = useInmersiones();
  const { hpts } = useHPT();
  const { anexosBravo } = useAnexoBravo();

  // Filtrar inmersiones de esta operación
  const operacionInmersiones = inmersiones.filter(
    inmersion => inmersion.operacion_id === operacionId
  );

  // Verificar si existen documentos firmados
  const hasValidHPT = hpts.some(
    hpt => hpt.operacion_id === operacionId && hpt.firmado && hpt.estado === 'firmado'
  );
  
  const hasValidAnexoBravo = anexosBravo.some(
    anexo => anexo.operacion_id === operacionId && anexo.firmado && anexo.estado === 'firmado'
  );

  const canCreateInmersion = hasValidHPT && hasValidAnexoBravo;

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'completada':
        return 'bg-green-100 text-green-700';
      case 'en_progreso':
        return 'bg-blue-100 text-blue-700';
      case 'planificada':
        return 'bg-yellow-100 text-yellow-700';
      case 'cancelada':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const handleCreateInmersion = () => {
    navigateTo(`/inmersiones?operacion=${operacionId}`);
  };

  const handleViewInmersion = (inmersionId: string) => {
    navigateTo(`/inmersiones/${inmersionId}`);
  };

  const handleCreateBitacora = (inmersionId: string, tipo: 'supervisor' | 'buzo') => {
    navigateTo(`/bitacoras/${tipo}/new?inmersion=${inmersionId}`);
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando inmersiones...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-blue-600" />
            Inmersiones de la Operación
          </CardTitle>
          {canCreateInmersion ? (
            <Button size="sm" onClick={handleCreateInmersion}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Inmersión
            </Button>
          ) : (
            <Button size="sm" disabled>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Inmersión
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Validación de documentos */}
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            {hasValidHPT ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            )}
            <span className={`text-sm ${hasValidHPT ? 'text-green-700' : 'text-red-700'}`}>
              HPT {hasValidHPT ? 'Firmado' : 'Pendiente'}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            {hasValidAnexoBravo ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            )}
            <span className={`text-sm ${hasValidAnexoBravo ? 'text-green-700' : 'text-red-700'}`}>
              Anexo Bravo {hasValidAnexoBravo ? 'Firmado' : 'Pendiente'}
            </span>
          </div>
        </div>

        {!canCreateInmersion && (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Para crear inmersiones se requiere que el HPT y Anexo Bravo estén firmados.
              Complete estos documentos primero en la pestaña "Documentos".
            </AlertDescription>
          </Alert>
        )}

        {/* Lista de inmersiones */}
        {operacionInmersiones.length === 0 ? (
          <div className="text-center py-8">
            <Waves className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500 mb-4">No hay inmersiones registradas</p>
            {canCreateInmersion && (
              <Button onClick={handleCreateInmersion}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Inmersión
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-3">
            {operacionInmersiones.map((inmersion) => (
              <div key={inmersion.inmersion_id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-4">
                  <Waves className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{inmersion.codigo}</p>
                    <p className="text-sm text-zinc-500">
                      {new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')} - 
                      {inmersion.hora_inicio} - {inmersion.profundidad_max}m
                    </p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs text-zinc-600">
                        Buzo: {inmersion.buzo_principal}
                      </span>
                      <span className="text-xs text-zinc-600">
                        Supervisor: {inmersion.supervisor}
                      </span>
                    </div>
                    {inmersion.objetivo && (
                      <p className="text-xs text-zinc-600 mt-1">
                        Objetivo: {inmersion.objetivo}
                      </p>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(inmersion.estado)}>
                    {inmersion.estado}
                  </Badge>
                  <div className="flex gap-1">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleViewInmersion(inmersion.inmersion_id)}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleCreateBitacora(inmersion.inmersion_id, 'supervisor')}
                    >
                      <FileText className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
