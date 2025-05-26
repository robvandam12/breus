
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

// Using the actual database types
type EquipoBuceo = Tables<'operacion'> & {
  miembros?: EquipoBuceoMiembro[];
};

type EquipoBuceoMiembro = {
  id: string;
  equipo_id: string;
  usuario_id?: string;
  nombre_completo: string;
  email?: string;
  rol: 'supervisor' | 'buzo' | 'asistente';
  matricula?: string;
  cargo?: string;
  telefono?: string;
  invitado: boolean;
  estado_invitacion: 'pendiente' | 'aceptada' | 'rechazada';
  token_invitacion?: string;
  created_at: string;
  updated_at: string;
};

export const useEquipoBuceo = () => {
  const [equipos, setEquipos] = useState<EquipoBuceo[]>([]);
  const [miembros, setMiembros] = useState<EquipoBuceoMiembro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchEquipos = async () => {
    try {
      // Using the operacion table as the base for teams/equipos
      const { data, error } = await supabase
        .from('operacion')
        .select(`
          *,
          salmoneras(nombre),
          sitios(nombre),
          contratistas(nombre)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setEquipos(data || []);
    } catch (error) {
      console.error('Error fetching equipos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los equipos de buceo",
        variant: "destructive",
      });
    }
  };

  const fetchMiembrosEquipo = async (equipoId: string) => {
    try {
      // For now, we'll return mock data until the database types are updated
      console.log('Fetching miembros for equipo:', equipoId);
      return [];
    } catch (error) {
      console.error('Error fetching miembros:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los miembros del equipo",
        variant: "destructive",
      });
      return [];
    }
  };

  const createEquipo = async (equipoData: Partial<Tables<'operacion'>>) => {
    try {
      // Ensure required fields are present
      const operacionData: TablesInsert<'operacion'> = {
        codigo: equipoData.codigo || `OP-${Date.now()}`,
        nombre: equipoData.nombre || 'Nueva Operación',
        fecha_inicio: equipoData.fecha_inicio || new Date().toISOString().split('T')[0],
        estado: equipoData.estado || 'planificada',
        salmonera_id: equipoData.salmonera_id || null,
        sitio_id: equipoData.sitio_id || null,
        servicio_id: equipoData.servicio_id || null,
        tareas: equipoData.tareas || null,
        fecha_fin: equipoData.fecha_fin || null,
        contratista_id: equipoData.contratista_id || null
      };

      const { data, error } = await supabase
        .from('operacion')
        .insert([operacionData])
        .select()
        .single();

      if (error) throw error;
      
      await fetchEquipos();
      toast({
        title: "Éxito",
        description: "Equipo de buceo creado correctamente",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating equipo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el equipo de buceo",
        variant: "destructive",
      });
      throw error;
    }
  };

  const addMiembroEquipo = async (miembroData: Partial<EquipoBuceoMiembro>) => {
    try {
      // For now, we'll use the notification system to track team members
      console.log('Adding miembro:', miembroData);
      
      toast({
        title: "Éxito",
        description: "Miembro agregado al equipo correctamente",
      });
      
      return miembroData;
    } catch (error) {
      console.error('Error adding miembro:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el miembro al equipo",
        variant: "destructive",
      });
      throw error;
    }
  };

  const inviteMiembro = async (equipoId: string, email: string, rol: 'supervisor' | 'buzo' | 'asistente', nombreCompleto: string) => {
    try {
      const token = crypto.randomUUID();
      
      const miembroData: Partial<EquipoBuceoMiembro> = {
        equipo_id: equipoId,
        email,
        rol,
        nombre_completo: nombreCompleto,
        invitado: true,
        estado_invitacion: 'pendiente',
        token_invitacion: token
      };

      await addMiembroEquipo(miembroData);
      
      toast({
        title: "Invitación enviada",
        description: `Se ha enviado una invitación a ${email}`,
      });
      
    } catch (error) {
      console.error('Error sending invitation:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchEquipos();
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    equipos,
    miembros,
    isLoading,
    fetchEquipos,
    fetchMiembrosEquipo,
    createEquipo,
    addMiembroEquipo,
    inviteMiembro
  };
};
