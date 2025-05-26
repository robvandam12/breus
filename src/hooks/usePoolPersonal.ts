
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

// Define proper types for perfil_buzo
interface PerfilBuzo {
  matricula?: string;
  especialidades?: string[];
  certificaciones?: string[];
  experiencia_anos?: number;
  disponible?: boolean;
}

// Using the usuario table as the base for personal pool
type PoolPersonal = Tables<'usuario'> & {
  empresa_id?: string;
  tipo_empresa?: 'salmonera' | 'servicio';
  matricula?: string;
  especialidades?: string[];
  certificaciones?: string[];
  experiencia_anos?: number;
  disponible?: boolean;
  invitado?: boolean;
  estado_invitacion?: 'pendiente' | 'aceptada' | 'rechazada';
  token_invitacion?: string;
};

export const usePoolPersonal = () => {
  const [personal, setPersonal] = useState<PoolPersonal[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchPersonal = async (empresaId?: string, tipoEmpresa?: 'salmonera' | 'servicio') => {
    try {
      let query = supabase.from('usuario').select('*');
      
      if (empresaId && tipoEmpresa === 'salmonera') {
        query = query.eq('salmonera_id', empresaId);
      } else if (empresaId && tipoEmpresa === 'servicio') {
        query = query.eq('servicio_id', empresaId);
      }
      
      const { data, error } = await query.order('created_at', { ascending: false });

      if (error) throw error;
      
      // Map the usuario data to our PoolPersonal structure
      const mappedData = data?.map(user => {
        // Safely parse perfil_buzo JSON
        const perfilBuzo = user.perfil_buzo as PerfilBuzo | null;
        
        return {
          ...user,
          empresa_id: tipoEmpresa === 'salmonera' ? user.salmonera_id : user.servicio_id,
          tipo_empresa: tipoEmpresa,
          matricula: perfilBuzo?.matricula,
          especialidades: perfilBuzo?.especialidades || [],
          certificaciones: perfilBuzo?.certificaciones || [],
          experiencia_anos: perfilBuzo?.experiencia_anos || 0,
          disponible: perfilBuzo?.disponible || true,
          invitado: false,
          estado_invitacion: 'aceptada' as const
        };
      }) || [];
      
      setPersonal(mappedData);
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
      // Generate a unique user ID for new personal
      const userId = crypto.randomUUID();
      
      // Convert to usuario format
      const usuarioData: TablesInsert<'usuario'> = {
        usuario_id: userId,
        nombre: personalData.nombre || '',
        apellido: personalData.apellido || '',
        email: personalData.email || '',
        rol: personalData.rol || 'buzo',
        salmonera_id: personalData.tipo_empresa === 'salmonera' ? personalData.empresa_id || null : null,
        servicio_id: personalData.tipo_empresa === 'servicio' ? personalData.empresa_id || null : null,
        perfil_buzo: {
          matricula: personalData.matricula,
          especialidades: personalData.especialidades || [],
          certificaciones: personalData.certificaciones || [],
          experiencia_anos: personalData.experiencia_anos || 0,
          disponible: personalData.disponible !== false
        },
        perfil_completado: true
      };

      const { data, error } = await supabase
        .from('usuario')
        .insert([usuarioData])
        .select()
        .single();

      if (error) throw error;
      
      await fetchPersonal(personalData.empresa_id, personalData.tipo_empresa);
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
      // Get current user data
      const { data: usuario, error: fetchError } = await supabase
        .from('usuario')
        .select('perfil_buzo')
        .eq('usuario_id', personalId)
        .single();

      if (fetchError) throw fetchError;

      // Safely parse and update perfil_buzo
      const currentPerfil = (usuario?.perfil_buzo as PerfilBuzo) || {};
      const updatedPerfil = {
        ...currentPerfil,
        disponible
      };

      const { error } = await supabase
        .from('usuario')
        .update({ perfil_buzo: updatedPerfil })
        .eq('usuario_id', personalId);

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
