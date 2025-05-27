
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from './use-toast';
import { useNavigate } from 'react-router-dom';

export interface HPTFormData {
  operacion_id: string;
  codigo: string;
  supervisor: string;
  plan_trabajo: string;
  user_id?: string;
  // Se añaden otros campos según la estructura de la tabla hpt
  fecha?: string;
  hora_inicio?: string;
  hora_termino?: string;
  empresa_servicio_nombre?: string;
  supervisor_nombre?: string;
  centro_trabajo_nombre?: string;
  jefe_mandante_nombre?: string;
  descripcion_tarea?: string;
  es_rutinaria?: boolean;
  lugar_especifico?: string;
  estado_puerto?: 'abierto' | 'cerrado';
  hpt_epp?: any;
  hpt_erc?: any;
  hpt_medidas?: any;
  hpt_riesgos_comp?: any;
  hpt_conocimiento?: any;
  hpt_conocimiento_asistentes?: any[];
  hpt_firmas?: any;
}

export const useHPT = () => {
  const [hpts, setHpts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreating, setIsCreating] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);
  const [isSigning, setIsSigning] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const navigate = useNavigate();

  // Fetch HPTs on component mount
  useEffect(() => {
    fetchHPTs();
  }, []);

  const fetchHPTs = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('hpt')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setHpts(data || []);
    } catch (error) {
      console.error('Error fetching HPTs:', error);
      toast({
        title: 'Error',
        description: 'No se pudieron cargar las HPTs',
        variant: 'destructive',
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createHPT = async (data: HPTFormData) => {
    setIsCreating(true);
    try {
      // Add user_id from auth
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const hptData = {
        ...data,
        user_id: user.id
      };

      const { data: createdHPT, error } = await supabase
        .from('hpt')
        .insert([hptData])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: 'HPT creado',
        description: 'La HPT ha sido creada correctamente',
      });
      
      // Refresh the list
      fetchHPTs();
      
      return createdHPT;
    } catch (error: any) {
      console.error('Error creating HPT:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo crear la HPT',
        variant: 'destructive',
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  const updateHPT = async ({ id, data }: { id: string; data: Partial<HPTFormData> }) => {
    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('hpt')
        .update(data)
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'HPT actualizada',
        description: 'La HPT ha sido actualizada correctamente',
      });
      
      // Refresh the list
      fetchHPTs();
      
      return true;
    } catch (error: any) {
      console.error('Error updating HPT:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo actualizar la HPT',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsUpdating(false);
    }
  };

  const signHPT = async ({ id, signatures }: { id: string; signatures: any }) => {
    setIsSigning(true);
    try {
      const { error } = await supabase
        .from('hpt')
        .update({
          hpt_firmas: signatures,
          firmado: true,
          estado: 'firmado',
        })
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'HPT firmada',
        description: 'La HPT ha sido firmada correctamente',
      });
      
      // Refresh the list
      fetchHPTs();
      
      return true;
    } catch (error: any) {
      console.error('Error signing HPT:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo firmar la HPT',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsSigning(false);
    }
  };

  const deleteHPT = async (id: string) => {
    setIsDeleting(true);
    try {
      const { error } = await supabase
        .from('hpt')
        .delete()
        .eq('id', id);

      if (error) throw error;

      toast({
        title: 'HPT eliminada',
        description: 'La HPT ha sido eliminada correctamente',
      });
      
      // Refresh the list
      fetchHPTs();
      
      return true;
    } catch (error: any) {
      console.error('Error deleting HPT:', error);
      toast({
        title: 'Error',
        description: error.message || 'No se pudo eliminar la HPT',
        variant: 'destructive',
      });
      return false;
    } finally {
      setIsDeleting(false);
    }
  };

  const getHPT = async (id: string) => {
    try {
      const { data, error } = await supabase
        .from('hpt')
        .select('*')
        .eq('id', id)
        .single();

      if (error) throw error;
      
      return data;
    } catch (error) {
      console.error('Error getting HPT:', error);
      return null;
    }
  };

  return {
    hpts,
    isLoading,
    createHPT,
    updateHPT,
    signHPT,
    deleteHPT,
    getHPT,
    fetchHPTs,
    isCreating,
    isUpdating,
    isSigning,
    isDeleting
  };
};
