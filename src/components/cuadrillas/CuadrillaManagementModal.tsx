
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Users, User, Plus, Trash2, Edit3, AlertTriangle } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CuadrillaManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
  cuadrillaId: string | null;
  onCuadrillaUpdated: (cuadrilla: any) => void;
  fechaInmersion?: string;
}

interface CuadrillaMember {
  id: string;
  usuario_id: string;
  rol_equipo: string;
  disponible: boolean;
  usuario?: {
    nombre: string;
    apellido: string;
    rol: string;
  };
}

interface Usuario {
  usuario_id: string;
  nombre: string;
  apellido: string;
  rol: string;
}

export const CuadrillaManagementModal = ({
  isOpen,
  onClose,
  cuadrillaId,
  onCuadrillaUpdated,
  fechaInmersion
}: CuadrillaManagementModalProps) => {
  const [loading, setLoading] = useState(false);
  const [cuadrilla, setCuadrilla] = useState<any>(null);
  const [members, setMembers] = useState<CuadrillaMember[]>([]);
  const [availableUsers, setAvailableUsers] = useState<Usuario[]>([]);
  const [hasConflict, setHasConflict] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const [cuadrillaData, setCuadrillaData] = useState({
    nombre: '',
    descripcion: ''
  });

  useEffect(() => {
    if (isOpen && cuadrillaId) {
      loadCuadrilla();
      checkAvailability();
    }
  }, [isOpen, cuadrillaId, fechaInmersion]);

  const loadCuadrilla = async () => {
    if (!cuadrillaId) return;

    try {
      // Cargar cuadrilla
      const { data: cuadrillaData, error: cuadrillaError } = await supabase
        .from('cuadrillas_buceo')
        .select('*')
        .eq('id', cuadrillaId)
        .single();

      if (cuadrillaError) throw cuadrillaError;

      setCuadrilla(cuadrillaData);
      setCuadrillaData({
        nombre: cuadrillaData.nombre,
        descripcion: cuadrillaData.descripcion || ''
      });

      // Cargar miembros
      const { data: membersData, error: membersError } = await supabase
        .from('cuadrilla_miembros')
        .select(`
          *,
          usuario:usuario_id(nombre, apellido, rol)
        `)
        .eq('cuadrilla_id', cuadrillaId);

      if (membersError) throw membersError;

      setMembers(membersData || []);

      // Cargar usuarios disponibles (de la misma empresa)
      await loadAvailableUsers(cuadrillaData.empresa_id, cuadrillaData.tipo_empresa);
    } catch (error) {
      console.error('Error loading cuadrilla:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar la información de la cuadrilla",
        variant: "destructive",
      });
    }
  };

  const loadAvailableUsers = async (empresaId: string, tipoEmpresa: string) => {
    try {
      const empresaTipo = tipoEmpresa === 'salmonera' ? 'salmonera_id' : 'servicio_id';

      const { data } = await supabase
        .from('usuario')
        .select('usuario_id, nombre, apellido, rol')
        .eq(empresaTipo, empresaId)
        .in('rol', ['supervisor', 'buzo'])
        .order('nombre');

      setAvailableUsers(data || []);
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const checkAvailability = async () => {
    if (!cuadrillaId || !fechaInmersion) return;

    try {
      const { data } = await supabase
        .rpc('validate_cuadrilla_availability', {
          p_cuadrilla_id: cuadrillaId,
          p_fecha_inmersion: fechaInmersion
        });

      setHasConflict(!(data?.[0]?.is_available || false));
    } catch (error) {
      console.error('Error checking availability:', error);
    }
  };

  const addMember = () => {
    const newMember: CuadrillaMember = {
      id: `temp-${Date.now()}`,
      usuario_id: '',
      rol_equipo: 'buzo',
      disponible: true
    };
    setMembers([...members, newMember]);
  };

  const removeMember = async (memberId: string) => {
    try {
      if (memberId.startsWith('temp-')) {
        // Miembro temporal, solo remover del estado
        setMembers(members.filter(m => m.id !== memberId));
      } else {
        // Miembro existente, eliminar de la base de datos
        const { error } = await supabase
          .from('cuadrilla_miembros')
          .delete()
          .eq('id', memberId);

        if (error) throw error;

        setMembers(members.filter(m => m.id !== memberId));
        
        toast({
          title: "Miembro removido",
          description: "El miembro ha sido removido de la cuadrilla",
        });
      }
    } catch (error) {
      console.error('Error removing member:', error);
      toast({
        title: "Error",
        description: "No se pudo remover el miembro",
        variant: "destructive",
      });
    }
  };

  const updateMember = (id: string, field: string, value: string) => {
    setMembers(members.map(m => {
      if (m.id === id) {
        const updated = { ...m, [field]: value };
        
        if (field === 'usuario_id') {
          const selectedUser = availableUsers.find(u => u.usuario_id === value);
          if (selectedUser) {
            updated.usuario = {
              nombre: selectedUser.nombre,
              apellido: selectedUser.apellido,
              rol: selectedUser.rol
            };
          }
        }
        
        return updated;
      }
      return m;
    }));
  };

  const saveMember = async (member: CuadrillaMember) => {
    if (!member.usuario_id || !member.rol_equipo) {
      toast({
        title: "Error",
        description: "Debe completar todos los campos del miembro",
        variant: "destructive",
      });
      return;
    }

    try {
      if (member.id.startsWith('temp-')) {
        // Nuevo miembro
        const { data, error } = await supabase
          .from('cuadrilla_miembros')
          .insert([{
            cuadrilla_id: cuadrillaId,
            usuario_id: member.usuario_id,
            rol_equipo: member.rol_equipo,
            disponible: true
          }])
          .select()
          .single();

        if (error) throw error;

        // Actualizar el miembro en el estado con el ID real
        setMembers(members.map(m => 
          m.id === member.id ? { ...data, usuario: member.usuario } : m
        ));

        toast({
          title: "Miembro agregado",
          description: "El miembro ha sido agregado a la cuadrilla",
        });
      } else {
        // Actualizar miembro existente
        const { error } = await supabase
          .from('cuadrilla_miembros')
          .update({
            usuario_id: member.usuario_id,
            rol_equipo: member.rol_equipo
          })
          .eq('id', member.id);

        if (error) throw error;

        toast({
          title: "Miembro actualizado",
          description: "Los datos del miembro han sido actualizados",
        });
      }
    } catch (error) {
      console.error('Error saving member:', error);
      toast({
        title: "Error",
        description: "No se pudo guardar el miembro",
        variant: "destructive",
      });
    }
  };

  const updateCuadrilla = async () => {
    if (!cuadrillaData.nombre.trim()) {
      toast({
        title: "Error",
        description: "El nombre de la cuadrilla es obligatorio",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      const { data, error } = await supabase
        .from('cuadrillas_buceo')
        .update({
          nombre: cuadrillaData.nombre,
          descripcion: cuadrillaData.descripcion
        })
        .eq('id', cuadrillaId)
        .select()
        .single();

      if (error) throw error;

      setCuadrilla(data);
      setIsEditing(false);
      onCuadrillaUpdated(data);

      toast({
        title: "Cuadrilla actualizada",
        description: "Los datos de la cuadrilla han sido actualizados",
      });
    } catch (error) {
      console.error('Error updating cuadrilla:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la cuadrilla",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  if (!cuadrilla) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Gestionar Cuadrilla: {cuadrilla.nombre}
            <Badge variant={cuadrilla.estado === 'disponible' ? 'default' : 'secondary'}>
              {cuadrilla.estado}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Alerta de conflicto */}
          {hasConflict && fechaInmersion && (
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-600 mt-0.5" />
                <div>
                  <h4 className="font-medium text-amber-800">Conflicto de Disponibilidad</h4>
                  <p className="text-sm text-amber-700 mt-1">
                    Esta cuadrilla ya tiene una asignación para el {fechaInmersion}. 
                    Si continúa, se podrían generar conflictos de programación.
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* Información básica */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Información Básica</CardTitle>
                <Button
                  onClick={() => setIsEditing(!isEditing)}
                  size="sm"
                  variant="outline"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {isEditing ? 'Cancelar' : 'Editar'}
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {isEditing ? (
                <>
                  <div>
                    <Label htmlFor="nombre">Nombre de la Cuadrilla *</Label>
                    <Input
                      id="nombre"
                      value={cuadrillaData.nombre}
                      onChange={(e) => setCuadrillaData(prev => ({ ...prev, nombre: e.target.value }))}
                    />
                  </div>
                  <div>
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Textarea
                      id="descripcion"
                      value={cuadrillaData.descripcion}
                      onChange={(e) => setCuadrillaData(prev => ({ ...prev, descripcion: e.target.value }))}
                      rows={3}
                    />
                  </div>
                  <Button onClick={updateCuadrilla} disabled={loading}>
                    {loading ? 'Guardando...' : 'Guardar Cambios'}
                  </Button>
                </>
              ) : (
                <>
                  <div>
                    <Label>Nombre</Label>
                    <p className="text-sm text-gray-700">{cuadrilla.nombre}</p>
                  </div>
                  {cuadrilla.descripcion && (
                    <div>
                      <Label>Descripción</Label>
                      <p className="text-sm text-gray-700">{cuadrilla.descripcion}</p>
                    </div>
                  )}
                </>
              )}
            </CardContent>
          </Card>

          {/* Miembros */}
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Miembros de la Cuadrilla ({members.length})</CardTitle>
                <Button onClick={addMember} size="sm">
                  <Plus className="w-4 h-4 mr-2" />
                  Agregar Miembro
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {members.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
                  <p>No hay miembros en esta cuadrilla</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {members.map((member, index) => (
                    <div key={member.id} className="flex gap-3 items-center p-3 border rounded-lg">
                      <Badge variant="outline" className="text-xs">
                        #{index + 1}
                      </Badge>
                      
                      <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                        <Select
                          value={member.usuario_id}
                          onValueChange={(value) => updateMember(member.id, 'usuario_id', value)}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Seleccionar usuario" />
                          </SelectTrigger>
                          <SelectContent>
                            {availableUsers
                              .filter(user => !members.some(m => m.usuario_id === user.usuario_id && m.id !== member.id))
                              .map(user => (
                              <SelectItem key={user.usuario_id} value={user.usuario_id}>
                                {user.nombre} {user.apellido} ({user.rol})
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <Select
                          value={member.rol_equipo}
                          onValueChange={(value) => updateMember(member.id, 'rol_equipo', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="supervisor">Supervisor</SelectItem>
                            <SelectItem value="buzo_principal">Buzo Principal</SelectItem>
                            <SelectItem value="buzo_asistente">Buzo Asistente</SelectItem>
                            <SelectItem value="buzo">Buzo</SelectItem>
                            <SelectItem value="apoyo_superficie">Apoyo Superficie</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex gap-2">
                        {member.id.startsWith('temp-') || member.usuario_id !== (member as any).original_usuario_id ? (
                          <Button
                            onClick={() => saveMember(member)}
                            size="sm"
                            variant="outline"
                            className="text-green-600 hover:text-green-700"
                          >
                            Guardar
                          </Button>
                        ) : null}
                        
                        <Button
                          onClick={() => removeMember(member.id)}
                          size="sm"
                          variant="outline"
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
};
