
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Users, UserPlus, Edit, Building, MapPin, Shield, CheckCircle, AlertTriangle } from "lucide-react";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { OperacionTeamManagerEnhanced } from "@/components/operaciones/OperacionTeamManagerEnhanced";

interface OperacionTeamTabProps {
  operacionId: string;
  operacion?: any;
}

export const OperacionTeamTab = ({ operacionId, operacion }: OperacionTeamTabProps) => {
  const [showTeamManager, setShowTeamManager] = useState(false);
  const { equipos } = useEquiposBuceoEnhanced();

  // Obtener equipo asignado
  const equipoAsignado = operacion?.equipo_buceo_id 
    ? equipos.find(eq => eq.id === operacion.equipo_buceo_id)
    : null;

  return (
    <div className="space-y-6">
      {/* Información de la Operación */}
      {operacion && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Building className="w-5 h-5" />
              Operación Asignada
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm font-medium text-blue-700">Código</p>
                <p className="text-blue-900">{operacion.codigo}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Nombre</p>
                <p className="text-blue-900">{operacion.nombre}</p>
              </div>
              <div>
                <p className="text-sm font-medium text-blue-700">Estado</p>
                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                  {operacion.estado}
                </Badge>
              </div>
              {operacion.salmoneras && (
                <div>
                  <p className="text-sm font-medium text-blue-700">Salmonera</p>
                  <p className="text-blue-900">{operacion.salmoneras.nombre}</p>
                </div>
              )}
              {operacion.sitios && (
                <div>
                  <p className="text-sm font-medium text-blue-700">Sitio</p>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-blue-600" />
                    <p className="text-blue-900">{operacion.sitios.nombre}</p>
                  </div>
                </div>
              )}
              {operacion.contratistas && (
                <div>
                  <p className="text-sm font-medium text-blue-700">Contratista</p>
                  <p className="text-blue-900">{operacion.contratistas.nombre}</p>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Equipo de Buceo Asignado */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Equipo de Buceo Asignado
            </CardTitle>
            <Button
              onClick={() => setShowTeamManager(true)}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Edit className="w-4 h-4" />
              {equipoAsignado ? 'Cambiar Equipo' : 'Asignar Equipo'}
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {equipoAsignado ? (
            <div className="space-y-4">
              <div className="p-4 border rounded-lg bg-green-50 border-green-200">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-medium text-green-800">{equipoAsignado.nombre}</h3>
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Equipo Asignado
                  </Badge>
                </div>
                {equipoAsignado.descripcion && (
                  <p className="text-sm text-green-700 mb-3">{equipoAsignado.descripcion}</p>
                )}
                
                {/* Miembros del equipo */}
                {equipoAsignado.miembros && equipoAsignado.miembros.length > 0 ? (
                  <div>
                    <h4 className="font-medium text-green-800 mb-2">Miembros del Equipo ({equipoAsignado.miembros.length})</h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                      {equipoAsignado.miembros.map((miembro, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-white rounded border border-green-200">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                              <span className="text-green-600 font-medium text-sm">
                                {miembro.nombre_completo.charAt(0).toUpperCase()}
                              </span>
                            </div>
                            <div>
                              <p className="font-medium text-green-800">{miembro.nombre_completo}</p>
                              <p className="text-xs text-green-600">{miembro.rol}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            {miembro.disponible ? (
                              <CheckCircle className="w-4 h-4 text-green-600" />
                            ) : (
                              <AlertTriangle className="w-4 h-4 text-yellow-600" />
                            )}
                            <span className="text-xs text-green-600">
                              {miembro.disponible ? 'Disponible' : 'No Disponible'}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ) : (
                  <Alert className="border-yellow-200 bg-yellow-50">
                    <AlertTriangle className="h-4 w-4" />
                    <AlertDescription className="text-yellow-800">
                      Este equipo no tiene miembros asignados. Agregue miembros para poder crear documentos de operación.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            </div>
          ) : (
            <div className="text-center py-8">
              <Alert className="border-red-200 bg-red-50 mb-4">
                <Shield className="h-4 w-4" />
                <AlertDescription className="text-red-800">
                  <strong>Sin equipo asignado:</strong> Debe asignar un equipo de buceo a esta operación antes de crear documentos (HPT, Anexo Bravo) o inmersiones.
                </AlertDescription>
              </Alert>
              <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <p className="text-zinc-500 mb-2">No hay equipo de buceo asignado</p>
              <p className="text-sm text-zinc-400">Asigne un equipo de buceo para esta operación</p>
              <Button 
                onClick={() => setShowTeamManager(true)}
                className="mt-4 bg-blue-600 hover:bg-blue-700"
              >
                <UserPlus className="w-4 h-4 mr-2" />
                Asignar Equipo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog para gestión de equipo */}
      <Dialog open={showTeamManager} onOpenChange={setShowTeamManager}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Gestionar Equipo de Buceo</DialogTitle>
          </DialogHeader>
          <OperacionTeamManagerEnhanced
            operacionId={operacionId}
            salmoneraId={operacion?.salmonera_id}
            contratistaId={operacion?.contratista_id}
            onClose={() => setShowTeamManager(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
