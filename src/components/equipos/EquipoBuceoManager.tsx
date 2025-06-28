
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, UserPlus, Mail } from "lucide-react";
import { useEquiposBuceoEnhanced, EquipoBuceoFormData, CuadrillaBuceo } from "@/hooks/useEquiposBuceoEnhanced";
import { useUsuarios } from "@/hooks/useUsuarios";
import { CreateEquipoForm } from "./CreateEquipoForm";
import { useAuth } from "@/hooks/useAuth";

interface EquipoBuceoManagerProps {
  salmoneraId?: string;
}

export const EquipoBuceoManager = ({ salmoneraId }: EquipoBuceoManagerProps) => {
  const { profile } = useAuth();
  const { equipos, isLoading, createEquipo } = useEquiposBuceoEnhanced();
  const { usuarios } = useUsuarios();
  
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Filtrar equipos según el contexto del usuario
  const filteredEquipos = equipos.filter(equipo => {
    // Superuser ve todos
    if (profile?.role === 'superuser') return true;
    
    // Admin salmonera ve equipos de su salmonera
    if (profile?.role === 'admin_salmonera' && profile.salmonera_id) {
      return equipo.company_id === profile.salmonera_id || equipo.empresa_id === profile.salmonera_id;
    }
    
    // Admin servicio ve equipos de su contratista
    if (profile?.role === 'admin_servicio' && profile.servicio_id) {
      return equipo.empresa_id === profile.servicio_id && equipo.tipo_empresa === 'contratista';
    }
    
    // Si se especifica salmoneraId, filtrar por ella
    if (salmoneraId) {
      return equipo.company_id === salmoneraId || equipo.empresa_id === salmoneraId;
    }
    
    return true;
  });

  const availableUsers = usuarios.filter(u => 
    u.rol === 'supervisor' || u.rol === 'buzo'
  );

  const handleCreateEquipo = async (data: EquipoBuceoFormData & { 
    salmonera_id: string; 
    contratista_id?: string; 
  }) => {
    await createEquipo(data);
    setIsCreateDialogOpen(false);
  };

  const getRoleBadgeColor = (rol: string) => {
    const colorMap: Record<string, string> = {
      supervisor: 'bg-blue-100 text-blue-700',
      buzo_principal: 'bg-green-100 text-green-700',
      buzo_asistente: 'bg-yellow-100 text-yellow-700',
    };
    return colorMap[rol] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return <div>Cargando equipos de buceo...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Users className="w-6 h-6 text-blue-600" />
          <div>
            <h2 className="text-xl font-semibold">Equipos de Buceo</h2>
            <p className="text-zinc-500">
              Gestión contextual de equipos de trabajo
              {profile?.role === 'superuser' && ' (Vista completa)'}
              {profile?.role === 'admin_salmonera' && ' (Vista salmonera)'}
              {profile?.role === 'admin_servicio' && ' (Vista contratista)'}
            </p>
          </div>
        </div>
        <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="bg-blue-600 hover:bg-blue-700">
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Equipo
            </Button>
          </DialogTrigger>
          <DialogContent>
            <CreateEquipoForm 
              onSubmit={handleCreateEquipo}
              onCancel={() => setIsCreateDialogOpen(false)}
              salmoneraId={salmoneraId}
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-6">
        {filteredEquipos.map((equipo: CuadrillaBuceo) => (
          <Card key={equipo.id} className="ios-card">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  {equipo.nombre}
                  <Badge variant="outline">
                    {equipo.miembros?.length || 0} miembros
                  </Badge>
                  <Badge variant="secondary" className="text-xs">
                    {equipo.tipo_empresa === 'salmonera' ? 'Salmonera' : 'Contratista'}
                  </Badge>
                </CardTitle>
              </div>
              {equipo.descripcion && (
                <p className="text-sm text-zinc-600">{equipo.descripcion}</p>
              )}
            </CardHeader>
            <CardContent>
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
                          <div className="font-medium">
                            {miembro.usuario ? 
                              `${miembro.usuario.nombre} ${miembro.usuario.apellido}` : 
                              'Usuario no encontrado'
                            }
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className={getRoleBadgeColor(miembro.rol_equipo)}>
                            {miembro.rol_equipo.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="bg-green-100 text-green-700">
                            Activo
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {miembro.usuario?.email && (
                            <div className="flex items-center gap-1 text-sm text-zinc-600">
                              <Mail className="w-3 h-3" />
                              {miembro.usuario.email}
                            </div>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-8 text-zinc-500">
                  No hay miembros en este equipo
                </div>
              )}
            </CardContent>
          </Card>
        ))}
        
        {filteredEquipos.length === 0 && (
          <Card className="text-center py-12">
            <CardContent>
              <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <h3 className="font-medium text-zinc-900 mb-2">No hay equipos de buceo</h3>
              <p className="text-zinc-500 mb-4">
                Crea el primer equipo de buceo para comenzar a gestionar personal especializado
              </p>
              <Button onClick={() => setIsCreateDialogOpen(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Crear Primer Equipo
              </Button>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
};
