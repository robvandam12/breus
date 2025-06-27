
import React, { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Users, Calendar, AlertTriangle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { usePersonalPool } from "@/hooks/usePersonalPool";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { CreatePersonalForm } from "@/components/personal/CreatePersonalForm";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from '@/hooks/use-toast';

const PersonalDeBuceo = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { personalPool, isLoading, createPersonal } = usePersonalPool();

  // Obtener asignaciones actuales del personal
  const { data: assignments = {} } = useQuery({
    queryKey: ['personal-assignments'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('inmersion_team_members')
        .select(`
          user_id,
          inmersion:inmersion_id (
            codigo,
            fecha_inmersion,
            hora_inicio,
            estado,
            inmersion_id
          )
        `)
        .in('inmersion.estado', ['planificada', 'en_progreso']);

      if (error) throw error;

      // Agrupar por usuario
      const assignmentMap: Record<string, any[]> = {};
      data?.forEach(item => {
        if (!assignmentMap[item.user_id]) {
          assignmentMap[item.user_id] = [];
        }
        assignmentMap[item.user_id].push(item.inmersion);
      });

      return assignmentMap;
    },
  });

  const filteredPersonal = personalPool.filter(person => {
    const matchesSearch = `${person.nombre} ${person.apellido}`.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRole = roleFilter === 'all' || person.rol === roleFilter;
    return matchesSearch && matchesRole;
  });

  const getPersonAssignments = (userId: string) => {
    return assignments[userId] || [];
  };

  const getPersonStatus = (userId: string) => {
    const userAssignments = getPersonAssignments(userId);
    const today = new Date().toISOString().split('T')[0];
    
    const todayAssignment = userAssignments.find(a => a.fecha_inmersion === today);
    if (todayAssignment) {
      return { status: 'busy_today', assignment: todayAssignment };
    }
    
    const upcomingAssignments = userAssignments.filter(a => a.fecha_inmersion > today);
    if (upcomingAssignments.length > 0) {
      return { status: 'scheduled', assignments: upcomingAssignments };
    }
    
    return { status: 'available' };
  };

  const getStatusBadge = (status: any) => {
    switch (status.status) {
      case 'busy_today':
        return <Badge className="bg-red-100 text-red-700">En inmersión hoy</Badge>;
      case 'scheduled':
        return <Badge className="bg-blue-100 text-blue-700">{status.assignments.length} programadas</Badge>;
      default:
        return <Badge className="bg-green-100 text-green-700">Disponible</Badge>;
    }
  };

  const handleCreatePersonal = async (data: any) => {
    try {
      await createPersonal(data);
      setIsCreateDialogOpen(false);
      toast({
        title: "Personal creado",
        description: "El nuevo personal de buceo ha sido registrado exitosamente.",
      });
    } catch (error) {
      console.error('Error creating personal:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el personal de buceo.",
        variant: "destructive",
      });
    }
  };

  const handleCancelCreate = () => {
    setIsCreateDialogOpen(false);
  };

  if (isLoading) {
    return (
      <MainLayout
        title="Personal de Buceo"
        subtitle="Gestión del personal de buceo y sus asignaciones"
        icon={Users}
      >
        <div className="text-center py-8">Cargando personal...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Personal de Buceo"
      subtitle="Gestión del personal de buceo y sus asignaciones"
      icon={Users}
    >
      <div className="space-y-6">
        {/* Controles */}
        <div className="flex gap-4 items-center">
          <Input
            placeholder="Buscar personal..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
          
          <Select value={roleFilter} onValueChange={setRoleFilter}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Filtrar por rol" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los roles</SelectItem>
              <SelectItem value="buzo">Buzos</SelectItem>
              <SelectItem value="supervisor">Supervisores</SelectItem>
              <SelectItem value="admin_servicio">Admins de Servicio</SelectItem>
            </SelectContent>
          </Select>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Personal
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nuevo Personal de Buceo</DialogTitle>
              </DialogHeader>
              <CreatePersonalForm 
                onSubmit={handleCreatePersonal}
                onCancel={handleCancelCreate}
              />
            </DialogContent>
          </Dialog>
        </div>

        {/* Lista de Personal */}
        <div className="grid gap-4">
          {filteredPersonal.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No se encontró personal</h3>
                <p className="text-gray-500">No hay personal que coincida con los filtros aplicados</p>
              </CardContent>
            </Card>
          ) : (
            filteredPersonal.map((person) => {
              const status = getPersonStatus(person.usuario_id);
              const userAssignments = getPersonAssignments(person.usuario_id);
              
              return (
                <Card key={person.usuario_id}>
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                          <Users className="w-6 h-6 text-blue-600" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {person.nombre} {person.apellido}
                          </CardTitle>
                          <p className="text-sm text-gray-600">{person.email}</p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline">{person.rol}</Badge>
                            <Badge variant="outline">{person.estado_buzo}</Badge>
                          </div>
                        </div>
                      </div>
                      
                      <div className="text-right">
                        {getStatusBadge(status)}
                      </div>
                    </div>
                  </CardHeader>
                  
                  {userAssignments.length > 0 && (
                    <CardContent>
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          Asignaciones Programadas
                        </h4>
                        <div className="space-y-2">
                          {userAssignments.slice(0, 3).map((assignment, idx) => (
                            <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                              <div>
                                <span className="font-medium">{assignment.codigo}</span>
                                <span className="text-sm text-gray-600 ml-2">
                                  {new Date(assignment.fecha_inmersion).toLocaleDateString('es-CL')}
                                </span>
                              </div>
                              <Badge variant="outline" className={
                                assignment.estado === 'en_progreso' ? 'bg-blue-100 text-blue-700' : ''
                              }>
                                {assignment.estado}
                              </Badge>
                            </div>
                          ))}
                          {userAssignments.length > 3 && (
                            <p className="text-sm text-gray-500">
                              +{userAssignments.length - 3} asignaciones más
                            </p>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              );
            })
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default PersonalDeBuceo;
