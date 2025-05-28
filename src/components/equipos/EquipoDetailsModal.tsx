
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Users, User, Mail, Phone, Edit, UserPlus } from "lucide-react";

interface EquipoDetailsModalProps {
  equipo: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
  onAddMember: () => void;
}

export const EquipoDetailsModal = ({ 
  equipo, 
  isOpen, 
  onClose, 
  onEdit, 
  onAddMember 
}: EquipoDetailsModalProps) => {
  const getRolBadgeColor = (rol: string) => {
    const colorMap: Record<string, string> = {
      supervisor: 'bg-blue-100 text-blue-700 border-blue-300',
      buzo_principal: 'bg-green-100 text-green-700 border-green-300',
      buzo_asistente: 'bg-yellow-100 text-yellow-700 border-yellow-300',
    };
    return colorMap[rol] || 'bg-gray-100 text-gray-700 border-gray-300';
  };

  const getRolLabel = (rol: string) => {
    const labelMap: Record<string, string> = {
      supervisor: 'Supervisor',
      buzo_principal: 'Buzo Principal',
      buzo_asistente: 'Buzo Asistente',
    };
    return labelMap[rol] || rol;
  };

  if (!equipo) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              {equipo.nombre}
            </DialogTitle>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={onAddMember}>
                <UserPlus className="w-4 h-4 mr-2" />
                Agregar Miembro
              </Button>
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Información del Equipo */}
          <Card className="p-4 bg-blue-50">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="font-semibold text-blue-900">{equipo.nombre}</h3>
                {equipo.descripcion && (
                  <p className="text-sm text-blue-700 mt-1">{equipo.descripcion}</p>
                )}
              </div>
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                  {equipo.miembros?.length || 0} miembros
                </Badge>
                <Badge variant="outline" className="border-blue-300 text-blue-700">
                  {equipo.tipo_empresa === 'salmonera' ? 'Salmonera' : 'Contratista'}
                </Badge>
                <Badge variant={equipo.activo ? 'default' : 'secondary'}>
                  {equipo.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </Card>

          {/* Miembros del Equipo */}
          <div>
            <h4 className="font-medium mb-4 flex items-center gap-2">
              <User className="w-4 h-4" />
              Miembros del Equipo
            </h4>
            
            {equipo.miembros && equipo.miembros.length > 0 ? (
              <div className="space-y-3">
                {equipo.miembros.map((miembro: any) => (
                  <Card key={miembro.id} className="p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-gray-600" />
                        </div>
                        <div>
                          <p className="font-medium">{miembro.nombre_completo}</p>
                          <div className="flex items-center gap-4 text-sm text-gray-500">
                            {miembro.email && (
                              <div className="flex items-center gap-1">
                                <Mail className="w-3 h-3" />
                                {miembro.email}
                              </div>
                            )}
                            {miembro.telefono && (
                              <div className="flex items-center gap-1">
                                <Phone className="w-3 h-3" />
                                {miembro.telefono}
                              </div>
                            )}
                            {miembro.matricula && (
                              <span>Mat: {miembro.matricula}</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge 
                          variant="outline"
                          className={getRolBadgeColor(miembro.rol_equipo)}
                        >
                          {getRolLabel(miembro.rol_equipo)}
                        </Badge>
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          {miembro.disponible ? 'Disponible' : 'No disponible'}
                        </Badge>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            ) : (
              <Card className="text-center py-8">
                <CardContent>
                  <User className="w-8 h-8 text-gray-300 mx-auto mb-2" />
                  <p className="text-gray-500">No hay miembros asignados a este equipo</p>
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={onAddMember}
                    className="mt-3"
                  >
                    <UserPlus className="w-4 h-4 mr-2" />
                    Agregar Primer Miembro
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
