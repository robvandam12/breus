
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

interface PoolPersonal {
  id: string;
  empresa_id: string;
  tipo_empresa: 'salmonera' | 'servicio';
  usuario_id?: string;
  nombre_completo: string;
  email?: string;
  rol: 'supervisor' | 'buzo' | 'asistente';
  matricula?: string;
  especialidades?: string[];
  certificaciones?: string[];
  experiencia_anos: number;
  disponible: boolean;
  invitado: boolean;
  estado_invitacion: 'pendiente' | 'aceptada' | 'rechazada';
  token_invitacion?: string;
  created_at: string;
  updated_at: string;
}

export const usePoolPersonal = () => {
  const [personal, setPersonal] = useState<PoolPersonal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPersonal = async (empresaId?: string, tipoEmpresa?: 'salmonera' | 'servicio') => {
    try {
      let query = supabase.from('pool_personal').select('*');
      
      if (empresaId) {
        query = query.eq('empresa_id', empresaId);
      }
      
      if (tipoEmpresa) {
        query = query.eq('tipo_empresa', tipoEmpresa);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      setPersonal(data || []);
    } catch (error) {
      console.error('Error fetching personal:', error);
      toast({
        title: "Error",
        description: "No se pudo cargar el pool de personal",
        variant: "destructive",
      });
    }
  };

  const addPersonal = async (personalData: Partial<PoolPersonal>) => {
    try {
      const { data, error } = await supabase
        .from('pool_personal')
        .insert([personalData])
        .select()
        .single();

      if (error) throw error;
      
      await fetchPersonal();
      toast({
        title: "Éxito",
        description: "Personal agregado correctamente",
      });
      
      return data;
    } catch (error) {
      console.error('Error adding personal:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el personal",
        variant: "destructive",
      });
      throw error;
    }
  };

  const invitePersonal = async (personalData: Partial<PoolPersonal>) => {
    try {
      const token = crypto.randomUUID();
      
      const dataWithInvitation = {
        ...personalData,
        invitado: true,
        estado_invitacion: 'pendiente' as const,
        token_invitacion: token
      };

      await addPersonal(dataWithInvitation);
      
      toast({
        title: "Invitación enviada",
        description: `Se ha enviado una invitación a ${personalData.email}`,
      });
      
    } catch (error) {
      console.error('Error sending invitation:', error);
      throw error;
    }
  };

  const updateDisponibilidad = async (personalId: string, disponible: boolean) => {
    try {
      const { error } = await supabase
        .from('pool_personal')
        .update({ disponible })
        .eq('id', personalId);

      if (error) throw error;
      
      await fetchPersonal();
      toast({
        title: "Éxito",
        description: "Disponibilidad actualizada correctamente",
      });
      
    } catch (error) {
      console.error('Error updating disponibilidad:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la disponibilidad",
        variant: "destructive",
      });
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchPersonal();
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    personal,
    isLoading,
    fetchPersonal,
    addPersonal,
    invitePersonal,
    updateDisponibilidad
  };
};
