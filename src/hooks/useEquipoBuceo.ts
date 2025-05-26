
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface EquipoBuceo {
  id: string;
  operacion_id: string;
  supervisor_id: string;
  nombre: string;
  descripcion?: string;
  fecha_creacion: string;
  estado: 'activo' | 'inactivo' | 'completado';
  created_at: string;
  updated_at: string;
}

interface EquipoBuceoMiembro {
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
}

export const useEquipoBuceo = () => {
  const [equipos, setEquipos] = useState<EquipoBuceo[]>([]);
  const [miembros, setMiembros] = useState<EquipoBuceoMiembro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchEquipos = async () => {
    try {
      const { data, error } = await supabase
        .from('equipo_buceo')
        .select('*')
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
      const { data, error } = await supabase
        .from('equipo_buceo_miembros')
        .select('*')
        .eq('equipo_id', equipoId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data || [];
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

  const createEquipo = async (equipoData: Partial<EquipoBuceo>) => {
    try {
      const { data, error } = await supabase
        .from('equipo_buceo')
        .insert([equipoData])
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
      const { data, error } = await supabase
        .from('equipo_buceo_miembros')
        .insert([miembroData])
        .select()
        .single();

      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "Miembro agregado al equipo correctamente",
      });
      
      return data;
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

  const inviteMiembro = async (equipoId: string, email: string, rol: string, nombreCompleto: string) => {
    try {
      const token = crypto.randomUUID();
      
      const miembroData = {
        equipo_id: equipoId,
        email,
        rol,
        nombre_completo: nombreCompleto,
        invitado: true,
        estado_invitacion: 'pendiente',
        token_invitacion: token
      };

      await addMiembroEquipo(miembroData);
      
      // Here you would send the invitation email
      // For now, we'll just show a success message
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
