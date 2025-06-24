
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import type { NetworkMaintenanceData } from '@/types/network-maintenance';

export interface NetworkMaintenanceFormData {
  codigo: string;
  operacion_id?: string;
  tipo_formulario: 'mantencion' | 'faena_redes';
  network_maintenance_data: NetworkMaintenanceData;
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
      const estado = formData.network_maintenance_data.firmado ? 'firmado' : 
                   formData.network_maintenance_data.estado === 'completado' ? 'pendiente_firma' : 'borrador';

      const dataToInsert = {
        operacion_id: formData.operacion_id,
        codigo: formData.codigo,
        tipo_formulario: formData.tipo_formulario,
        multix_data: formData.network_maintenance_data as any,
        user_id: user.id,
        fecha: formData.network_maintenance_data.fecha,
        hora_inicio: formData.network_maintenance_data.hora_inicio,
        hora_termino: formData.network_maintenance_data.hora_termino,
        lugar_trabajo: formData.network_maintenance_data.lugar_trabajo,
        nave_maniobras: formData.network_maintenance_data.nave_maniobras,
        matricula_nave: formData.network_maintenance_data.matricula_nave,
        team_s: formData.network_maintenance_data.team_s,
        team_be: formData.network_maintenance_data.team_be,
        team_bi: formData.network_maintenance_data.team_bi,
        estado_puerto: formData.network_maintenance_data.estado_puerto,
        temperatura: formData.network_maintenance_data.temperatura,
        profundidad_max: formData.network_maintenance_data.profundidad_max,
        estado: estado,
        firmado: formData.network_maintenance_data.firmado,
        progreso: formData.network_maintenance_data.progreso
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
      const estado = data.firmado ? 'firmado' : 
                   data.estado === 'completado' ? 'pendiente_firma' : 'borrador';

      const { error } = await supabase
        .from('multix')
        .update({ 
          multix_data: data as any,
          estado: estado,
          firmado: data.firmado,
          progreso: data.progreso,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await fetchNetworkMaintenance();
      
      const message = data.firmado ? 
        "El formulario ha sido firmado exitosamente." :
        "Los cambios han sido guardados exitosamente.";
      
      toast({
        title: data.firmado ? "Formulario firmado" : "Formulario actualizado",
        description: message,
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

  const signNetworkMaintenance = async (id: string) => {
    try {
      const form = networkMaintenanceForms.find(f => f.id === id);
      if (!form) throw new Error('Formulario no encontrado');

      const updatedData = {
        ...form.multix_data,
        firmado: true,
        estado: 'firmado'
      };

      await updateNetworkMaintenance(id, updatedData);
      
      toast({
        title: "Formulario firmado",
        description: "El formulario ha sido firmado digitalmente.",
      });
    } catch (error: any) {
      console.error('Error signing network maintenance:', error);
      toast({
        title: "Error",
        description: error.message || "No se pudo firmar el formulario",
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
    signNetworkMaintenance,
    deleteNetworkMaintenance,
    getNetworkMaintenanceByOperacion,
    getAllNetworkMaintenance,
    refetch: fetchNetworkMaintenance
  };
};
