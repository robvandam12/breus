
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Eye, Edit, Trash2, UserPlus, Mail } from "lucide-react";
import { EquipoBuceo } from "@/hooks/useEquipoBuceo";

interface EquipoBuceoActionsProps {
  equipo: EquipoBuceo;
  onEdit?: (equipo: EquipoBuceo) => void;
  onDelete?: (equipoId: string) => void;
  onAddMember?: (equipoId: string) => void;
}

export const EquipoBuceoActions = ({ equipo, onEdit, onDelete, onAddMember }: EquipoBuceoActionsProps) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState({
    nombre: equipo.nombre,
    descripcion: equipo.descripcion || ''
  });

  const handleEdit = () => {
    if (onEdit) {
      onEdit({ ...equipo, ...editData });
    }
    setIsEditOpen(false);
  };

  const getRolBadgeColor = (rol: string) => {
    const colorMap: Record<string, string> = {
      supervisor: 'bg-blue-100 text-blue-700',
      buzo_principal: 'bg-green-100 text-green-700',
      buzo_asistente: 'bg-yellow-100 text-yellow-700',
    };
    return colorMap[rol] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="flex justify-end gap-1">
      {/* Ver Detalles */}
      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" title="Ver detalles">
            <Eye className="w-4 h-4" />
          </Button>
        </DialogTrigger>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              Detalles del Equipo: {equipo.nombre}
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                {equipo.tipo_empresa === 'salmonera' ? 'Salmonera' : 'Servicio'}
              </Badge>
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {equipo.descripcion && (
              <div>
                <Label>Descripción</Label>
                <p className="text-sm text-gray-600">{equipo.descripcion}</p>
              </div>
            )}

            <div>
              <Label>Miembros del Equipo ({equipo.miembros?.length || 0})</Label>
              {equipo.miembros && equipo.miembros.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Miembro</TableHead>
                      <TableHead>Rol</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Contacto</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {equipo.miembros.map((miembro) => (
                      <TableRow key={miembro.id}>
                        <TableCell>
                          <div className="font-medium">{miembro.nombre_completo}</div>
                          {miembro.matricula && (
                            <div className="text-sm text-gray-500">Matrícula: {miembro.matricula}</div>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRolBadgeColor(miembro.rol_equipo)}>
                            {miembro.rol_equipo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-700">
                            {miembro.disponible ? 'Disponible' : 'No Disponible'}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {miembro.email && (
                            <div className="flex items-center gap-1 text-sm text-gray-600">
                              <Mail className="w-3 h-3" />
                              {miembro.email}
                            </div>
                          )}
                          {miembro.telefono && (
                            <div className="text-sm text-gray-600">{miembro.telefono}</div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-gray-500">
                  No hay miembros en este equipo
                </div>
              )}
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Agregar Miembro */}
      {onAddMember && (
        <Button 
          variant="outline" 
          size="sm" 
          title="Agregar miembro"
          onClick={() => onAddMember(equipo.id)}
        >
          <UserPlus className="w-4 h-4" />
        </Button>
      )}

      {/* Editar */}
      {onEdit && (
        <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
          <DialogTrigger asChild>
            <Button variant="outline" size="sm" title="Editar">
              <Edit className="w-4 h-4" />
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Editar Equipo</DialogTitle>
            </DialogHeader>
            
            <div className="space-y-4">
              <div>
                <Label htmlFor="edit-nombre">Nombre del Equipo</Label>
                <Input
                  id="edit-nombre"
                  value={editData.nombre}
                  onChange={(e) => setEditData(prev => ({ ...prev, nombre: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="edit-descripcion">Descripción</Label>
                <Textarea
                  id="edit-descripcion"
                  value={editData.descripcion}
                  onChange={(e) => setEditData(prev => ({ ...prev, descripcion: e.target.value }))}
                  rows={3}
                />
              </div>

              <div className="flex gap-3 pt-4">
                <Button onClick={handleEdit} className="flex-1">
                  Guardar Cambios
                </Button>
                <Button variant="outline" onClick={() => setIsEditOpen(false)}>
                  Cancelar
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* Eliminar */}
      {onDelete && (
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="outline" size="sm" title="Eliminar">
              <Trash2 className="w-4 h-4" />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>¿Eliminar equipo?</AlertDialogTitle>
              <AlertDialogDescription>
                Esta acción eliminará permanentemente el equipo "{equipo.nombre}" y todos sus miembros asociados.
                Esta acción no se puede deshacer.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancelar</AlertDialogCancel>
              <AlertDialogAction 
                onClick={() => onDelete(equipo.id)}
                className="bg-red-600 hover:bg-red-700"
              >
                Eliminar
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};
