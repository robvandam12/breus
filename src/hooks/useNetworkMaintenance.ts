
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';

export interface NetworkMaintenanceFormData {
  codigo: string;
  fecha: string;
  hora_inicio: string;
  hora_termino: string;
  lugar_trabajo: string;
  tipo_formulario: 'mantencion' | 'faena_redes';
  operacion_id?: string;
  
  // Encabezado General
  nombre_nave: string;
  matricula_nave: string;
  nombre_centro: string;
  codigo_centro: string;
  fecha_operacion: string;
  condiciones_meteorologicas: string;
  
  // Datos específicos
  multix_data: NetworkMaintenanceData;
}

export interface NetworkMaintenanceData {
  [key: string]: any;
  encabezado?: {
    nombre_nave: string;
    matricula_nave: string;
    nombre_centro: string;
    codigo_centro: string;
    fecha_operacion: string;
    condiciones_meteorologicas: string;
  };
  dotacion_buceo?: any[];
  sistemas_equipos?: any[];
  equipos_superficie?: any[];
  faenas_mantencion?: any[];
  firmas?: any[];
}

export const useNetworkMaintenance = (operacionId?: string) => {
  const [networkMaintenanceForms, setNetworkMaintenanceForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  const fetchNetworkMaintenance = async () => {
    if (!user) return;

    try {
      setLoading(true);
      let query = supabase
        .from('multix')
        .select('*')
        .eq('user_id', user.id)
        .in('tipo_formulario', ['mantencion', 'faena_redes'])
        .order('created_at', { ascending: false });

      if (operacionId) {
        query = query.eq('operacion_id', operacionId);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching network maintenance:', error);
        return;
      }

      setNetworkMaintenanceForms(data || []);
    } catch (error) {
      console.error('Error in fetchNetworkMaintenance:', error);
    } finally {
      setLoading(false);
    }
  };

  const createNetworkMaintenance = async (formData: NetworkMaintenanceFormData) => {
    if (!user) throw new Error('Usuario no autenticado');

    try {
      const dataToInsert = {
        operacion_id: formData.operacion_id,
        codigo: formData.codigo,
        tipo_formulario: formData.tipo_formulario,
        multix_data: formData.multix_data as any,
        user_id: user.id,
        fecha: formData.fecha,
        hora_inicio: formData.hora_inicio,
        hora_termino: formData.hora_termino,
        lugar_trabajo: formData.lugar_trabajo,
        nave_maniobras: formData.nombre_nave,
        matricula_nave: formData.matricula_nave,
        estado: 'borrador',
        firmado: false
      };

      const { data, error } = await supabase
        .from('multix')
        .insert([dataToInsert])
        .select()
        .single();

      if (error) throw error;

      await fetchNetworkMaintenance();
      
      toast({
        title: "Formulario creado",
        description: "El formulario de mantención de redes ha sido creado exitosamente.",
      });

      return data;
    } catch (error: any) {
      console.error('Error creating network maintenance:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo crear el formulario",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateNetworkMaintenance = async (id: string, data: NetworkMaintenanceData) => {
    try {
      const { error } = await supabase
        .from('multix')
        .update({ 
          multix_data: data as any,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await fetchNetworkMaintenance();
      
      toast({
        title: "Formulario actualizado",
        description: "Los cambios han sido guardados exitosamente.",
      });
    } catch (error: any) {
      console.error('Error updating network maintenance:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudieron guardar los cambios",
        variant: "destructive",
      });
      throw error;
    }
  };

  const completeNetworkMaintenance = async (id: string) => {
    try {
      const { error } = await supabase
        .from('multix')
        .update({ 
          estado: 'completado',
          firmado: true,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await fetchNetworkMaintenance();
      
      toast({
        title: "Formulario completado",
        description: "El formulario ha sido marcado como completado.",
      });
    } catch (error: any) {
      console.error('Error completing network maintenance:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo completar el formulario",
        variant: "destructive",
      });
      throw error;
    }
  };

  const deleteNetworkMaintenance = async (id: string) => {
    try {
      const { error } = await supabase
        .from('multix')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchNetworkMaintenance();
      
      toast({
        title: "Formulario eliminado",
        description: "El formulario ha sido eliminado exitosamente.",
      });
    } catch (error: any) {
      console.error('Error deleting network maintenance:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar el formulario",
        variant: "destructive",
      });
      throw error;
    }
  };

  const getNetworkMaintenanceByOperacion = (operacionId: string) => {
    return networkMaintenanceForms.filter(form => form.operacion_id === operacionId);
  };

  const getAllNetworkMaintenance = () => {
    return networkMaintenanceForms;
  };

  useEffect(() => {
    fetchNetworkMaintenance();
  }, [user, operacionId]);

  return {
    networkMaintenanceForms,
    loading,
    createNetworkMaintenance,
    updateNetworkMaintenance,
    completeNetworkMaintenance,
    deleteNetworkMaintenance,
    getNetworkMaintenanceByOperacion,
    getAllNetworkMaintenance,
    refetch: fetchNetworkMaintenance
  };
};
