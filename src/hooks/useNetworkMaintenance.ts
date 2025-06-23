
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import type { NetworkMaintenanceFormData, NetworkMaintenanceData } from '@/types/network-maintenance';

export const useNetworkMaintenance = () => {
  const [networkMaintenanceForms, setNetworkMaintenanceForms] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchNetworkMaintenanceForms = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('multix')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setNetworkMaintenanceForms(data || []);
    } catch (error) {
      console.error('Error fetching network maintenance forms:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los formularios de mantención",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createNetworkMaintenance = async (formData: NetworkMaintenanceFormData) => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('multix')
        .insert([{
          operacion_id: formData.operacion_id,
          codigo: formData.codigo,
          tipo_formulario: formData.tipo_formulario,
          multix_data: formData.network_maintenance_data,
          user_id: (await supabase.auth.getUser()).data.user?.id,
          fecha: formData.network_maintenance_data.fecha,
          hora_inicio: formData.network_maintenance_data.hora_inicio,
          hora_termino: formData.network_maintenance_data.hora_termino,
          lugar_trabajo: formData.network_maintenance_data.lugar_trabajo,
          temperatura: formData.network_maintenance_data.temperatura,
          profundidad_max: formData.network_maintenance_data.profundidad_max,
          nave_maniobras: formData.network_maintenance_data.nave_maniobras,
          team_s: formData.network_maintenance_data.team_s,
          team_be: formData.network_maintenance_data.team_be,
          team_bi: formData.network_maintenance_data.team_bi,
          matricula_nave: formData.network_maintenance_data.matricula_nave,
          estado_puerto: formData.network_maintenance_data.estado_puerto,
          progreso: formData.network_maintenance_data.progreso,
          estado: formData.network_maintenance_data.estado,
          firmado: formData.network_maintenance_data.firmado
        }])
        .select()
        .single();

      if (error) throw error;

      await fetchNetworkMaintenanceForms();
      
      toast({
        title: "Formulario creado",
        description: "El formulario de mantención ha sido creado exitosamente",
      });

      return data;
    } catch (error) {
      console.error('Error creating network maintenance form:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el formulario",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const updateNetworkMaintenance = async (id: string, data: NetworkMaintenanceData) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('multix')
        .update({
          multix_data: data,
          fecha: data.fecha,
          hora_inicio: data.hora_inicio,
          hora_termino: data.hora_termino,
          lugar_trabajo: data.lugar_trabajo,
          temperatura: data.temperatura,
          profundidad_max: data.profundidad_max,
          nave_maniobras: data.nave_maniobras,
          team_s: data.team_s,
          team_be: data.team_be,
          team_bi: data.team_bi,
          matricula_nave: data.matricula_nave,
          estado_puerto: data.estado_puerto,
          progreso: data.progreso,
          estado: data.estado,
          firmado: data.firmado,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await fetchNetworkMaintenanceForms();
      
      toast({
        title: "Formulario actualizado",
        description: "El formulario ha sido actualizado exitosamente",
      });
    } catch (error) {
      console.error('Error updating network maintenance form:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el formulario",
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const completeNetworkMaintenance = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('multix')
        .update({
          estado: 'completado',
          firmado: true,
          progreso: 100,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);

      if (error) throw error;

      await fetchNetworkMaintenanceForms();
    } catch (error) {
      console.error('Error completing network maintenance form:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const deleteNetworkMaintenance = async (id: string) => {
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('multix')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await fetchNetworkMaintenanceForms();
    } catch (error) {
      console.error('Error deleting network maintenance form:', error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchNetworkMaintenanceForms();
  }, []);

  return {
    networkMaintenanceForms,
    loading,
    createNetworkMaintenance,
    updateNetworkMaintenance,
    completeNetworkMaintenance,
    deleteNetworkMaintenance,
    refreshForms: fetchNetworkMaintenanceForms,
  };
};
