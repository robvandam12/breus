
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { MoreHorizontal, Edit, Trash2, UserPlus, Eye, Calendar } from "lucide-react";
import { CuadrillaBuceo } from "@/hooks/useCuadrillasBuceo";
import { useCuadrillaAsignaciones } from "@/hooks/useCuadrillaConflictValidation";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CuadrillaBuceoActionsProps {
  cuadrilla: CuadrillaBuceo;
  onEdit: (cuadrilla: CuadrillaBuceo) => void;
  onDelete: (cuadrillaId: string) => void;
  onAddMember: (cuadrillaId: string) => void;
}

export const CuadrillaBuceoActions = ({
  cuadrilla,
  onEdit,
  onDelete,
  onAddMember
}: CuadrillaBuceoActionsProps) => {
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showAsignacionesModal, setShowAsignacionesModal] = useState(false);
  
  const { data: asignaciones = [] } = useCuadrillaAsignaciones(cuadrilla.id);

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Abrir menú</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setShowDetailModal(true)}>
            <Eye className="mr-2 h-4 w-4" />
            Ver detalles
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setShowAsignacionesModal(true)}>
            <Calendar className="mr-2 h-4 w-4" />
            Ver asignaciones
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onAddMember(cuadrilla.id)}>
            <UserPlus className="mr-2 h-4 w-4" />
            Agregar miembro
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => onEdit(cuadrilla)}>
            <Edit className="mr-2 h-4 w-4" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem 
            className="text-red-600"
            onClick={() => onDelete(cuadrilla.id)}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Eliminar
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Modal de detalles */}
      <Dialog open={showDetailModal} onOpenChange={setShowDetailModal}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Detalles de Cuadrilla: {cuadrilla.nombre}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <h4 className="font-semibold mb-2">Información General</h4>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-zinc-500">Descripción:</span>
                  <p>{cuadrilla.descripcion || 'Sin descripción'}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Tipo de empresa:</span>
                  <p className="capitalize">{cuadrilla.tipo_empresa}</p>
                </div>
                <div>
                  <span className="text-zinc-500">Estado:</span>
                  <Badge variant={cuadrilla.activo ? 'default' : 'secondary'}>
                    {cuadrilla.activo ? 'Activa' : 'Inactiva'}
                  </Badge>
                </div>
                <div>
                  <span className="text-zinc-500">Total miembros:</span>
                  <p>{cuadrilla.miembros?.length || 0}</p>
                </div>
              </div>
            </div>

            <div>
              <h4 className="font-semibold mb-2">Miembros de la Cuadrilla</h4>
              {cuadrilla.miembros?.length === 0 ? (
                <p className="text-zinc-500 text-sm">No hay miembros asignados</p>
              ) : (
                <div className="space-y-2">
                  {cuadrilla.miembros?.map((miembro) => (
                    <div key={miembro.id} className="flex items-center justify-between p-2 border rounded">
                      <div>
                        <span className="font-medium">{miembro.nombre_completo}</span>
                        <Badge variant="outline" className="ml-2">
                          {miembro.rol}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-2">
                        {miembro.email && (
                          <span className="text-xs text-zinc-500">{miembro.email}</span>
                        )}
                        <Badge variant={miembro.disponible ? 'default' : 'secondary'}>
                          {miembro.disponible ? 'Disponible' : 'No disponible'}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Modal de asignaciones */}
      <Dialog open={showAsignacionesModal} onOpenChange={setShowAsignacionesModal}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5 text-blue-600" />
              Asignaciones de {cuadrilla.nombre}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {asignaciones.length === 0 ? (
              <Card>
                <CardContent className="py-8 text-center">
                  <Calendar className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-zinc-900 mb-2">Sin asignaciones activas</h3>
                  <p className="text-zinc-500">Esta cuadrilla no tiene inmersiones programadas</p>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-3">
                {asignaciones.map((asignacion) => (
                  <Card key={asignacion.id}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">{asignacion.inmersion?.codigo}</h4>
                          <p className="text-sm text-zinc-600">{asignacion.inmersion?.objetivo}</p>
                          <p className="text-xs text-zinc-500">
                            Fecha: {new Date(asignacion.fecha_asignacion).toLocaleDateString('es-CL')}
                          </p>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">
                            {asignacion.estado}
                          </Badge>
                          <Badge variant={asignacion.inmersion?.estado === 'completada' ? 'default' : 'secondary'}>
                            {asignacion.inmersion?.estado}
                          </Badge>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
