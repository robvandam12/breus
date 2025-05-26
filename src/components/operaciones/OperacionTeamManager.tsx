
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Users, Plus, X } from "lucide-react";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { useOperaciones } from "@/hooks/useOperaciones";

interface OperacionTeamManagerProps {
  operacionId: string;
  salmoneraId: string;
}

export const OperacionTeamManager = ({ operacionId, salmoneraId }: OperacionTeamManagerProps) => {
  const { equipos } = useEquiposBuceoEnhanced();
  const [selectedEquipoId, setSelectedEquipoId] = useState('');
  const [assignedMembers, setAssignedMembers] = useState<any[]>([]);
  const [isAssignDialogOpen, setIsAssignDialogOpen] = useState(false);

  const availableEquipos = equipos.filter(e => e.salmonera_id === salmoneraId);
  const selectedEquipo = equipos.find(e => e.id === selectedEquipoId);

  const handleAssignTeam = () => {
    if (selectedEquipo && selectedEquipo.miembros) {
      // Assign the entire team to the operation
      setAssignedMembers(selectedEquipo.miembros.map(m => ({
        ...m,
        operacion_id: operacionId,
        asignado_en: new Date().toISOString()
      })));
      setIsAssignDialogOpen(false);
    }
  };

  const handleRemoveMember = (memberId: string) => {
    setAssignedMembers(prev => prev.filter(m => m.id !== memberId));
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
    <Card className="ios-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Equipo Asignado
            <Badge variant="outline">
              {assignedMembers.length} miembros
            </Badge>
          </CardTitle>
          <Dialog open={isAssignDialogOpen} onOpenChange={setIsAssignDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Asignar Equipo
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Asignar Equipo de Buceo</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Equipo de Buceo</Label>
                  <Select value={selectedEquipoId} onValueChange={setSelectedEquipoId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar equipo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {availableEquipos.map((equipo) => (
                        <SelectItem key={equipo.id} value={equipo.id}>
                          {equipo.nombre} ({equipo.miembros?.length || 0} miembros)
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedEquipo && selectedEquipo.miembros && (
                  <div className="space-y-2">
                    <Label>Miembros del Equipo:</Label>
                    <div className="space-y-2 max-h-40 overflow-y-auto">
                      {selectedEquipo.miembros.map((miembro) => (
                        <div key={miembro.id} className="flex items-center justify-between p-2 bg-zinc-50 rounded">
                          <div>
                            <span className="font-medium">{miembro.nombre_completo}</span>
                            <Badge variant="outline" className={`ml-2 ${getRolBadgeColor(miembro.rol)}`}>
                              {miembro.rol.replace('_', ' ')}
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button 
                    onClick={handleAssignTeam}
                    disabled={!selectedEquipoId}
                    className="flex-1"
                  >
                    Asignar Equipo Completo
                  </Button>
                  <Button variant="outline" onClick={() => setIsAssignDialogOpen(false)}>
                    Cancelar
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {assignedMembers.length === 0 ? (
          <div className="text-center py-8 text-zinc-500">
            No hay equipo asignado a esta operación
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Miembro</TableHead>
                <TableHead>Rol</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {assignedMembers.map((miembro) => (
                <TableRow key={miembro.id}>
                  <TableCell>
                    <div className="font-medium">{miembro.nombre_completo}</div>
                    {miembro.matricula && (
                      <div className="text-sm text-zinc-500">Matrícula: {miembro.matricula}</div>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className={getRolBadgeColor(miembro.rol)}>
                      {miembro.rol.replace('_', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <Badge variant="outline" className="bg-green-100 text-green-700">
                      Asignado
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {miembro.email && (
                      <div className="text-sm text-zinc-600">{miembro.email}</div>
                    )}
                    {miembro.telefono && (
                      <div className="text-sm text-zinc-600">{miembro.telefono}</div>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleRemoveMember(miembro.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
