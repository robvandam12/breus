
import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

export interface AnexoBravoItem {
  id: string;
  codigo: string;
  operacion_id: string;
  operacion_nombre: string;
  fecha_creacion: string;
  fecha_verificacion: string;
  jefe_centro: string;
  supervisor: string;
  estado: 'borrador' | 'en_progreso' | 'aprobado' | 'completado' | 'rechazado';
  firmado: boolean;
  checklist_completo: boolean;
  progreso: number;
  checklist_items: Array<{
    id: string;
    item: string;
    verificado: boolean;
    observaciones?: string;
  }>;
  observaciones_generales: string;
  jefe_centro_firma?: string;
  supervisor_firma?: string;
  created_at: string;
  updated_at: string;
}

export interface AnexoBravoFormData {
  operacion_id: string;
  fecha_verificacion: string;
  checklist_items: Array<{
    id: string;
    item: string;
    verificado: boolean;
    observaciones?: string;
  }>;
  observaciones_generales: string;
  jefe_centro_firma?: string;
  supervisor_firma?: string;
}

// Helper function to safely parse checklist items from Supabase Json
const parseChecklistItems = (items: any): AnexoBravoItem['checklist_items'] => {
  if (Array.isArray(items)) {
    return items.map(item => ({
      id: item.id || '',
      item: item.item || '',
      verificado: Boolean(item.verificado),
      observaciones: item.observaciones || undefined
    }));
  }
  return [];
};

export const useAnexoBravo = () => {
  const [anexosBravo, setAnexosBravo] = useState<AnexoBravoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadAnexosBravo();
  }, []);

  const loadAnexosBravo = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('anexo_bravo')
        .select(`
          anexo_id,
          codigo,
          operacion_id,
          fecha_creacion,
          fecha_verificacion,
          jefe_centro,
          supervisor,
          estado,
          firmado,
          checklist_completo,
          progreso,
          checklist_items,
          observaciones_generales,
          jefe_centro_firma,
          supervisor_firma,
          created_at,
          updated_at,
          operacion:operacion_id (
            nombre
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData: AnexoBravoItem[] = (data || []).map(item => ({
        id: item.anexo_id,
        codigo: item.codigo,
        operacion_id: item.operacion_id,
        operacion_nombre: item.operacion?.nombre || 'Operación no encontrada',
        fecha_creacion: item.fecha_creacion,
        fecha_verificacion: item.fecha_verificacion || '',
        jefe_centro: item.jefe_centro || '',
        supervisor: item.supervisor || '',
        estado: item.estado as AnexoBravoItem['estado'],
        firmado: item.firmado,
        checklist_completo: item.checklist_completo,
        progreso: item.progreso,
        checklist_items: parseChecklistItems(item.checklist_items),
        observaciones_generales: item.observaciones_generales || '',
        jefe_centro_firma: item.jefe_centro_firma,
        supervisor_firma: item.supervisor_firma,
        created_at: item.created_at,
        updated_at: item.updated_at
      }));

      setAnexosBravo(formattedData);
      setError(null);
    } catch (err) {
      console.error('Error loading Anexos Bravo:', err);
      setError('Error al cargar los Anexos Bravo');
      toast({
        title: "Error",
        description: "No se pudieron cargar los Anexos Bravo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAnexoBravo = async (data: AnexoBravoFormData) => {
    setLoading(true);
    try {
      // Generar código único
      const { count } = await supabase
        .from('anexo_bravo')
        .select('*', { count: 'exact', head: true });
      
      const codigo = `AB-2024-${String((count || 0) + 1).padStart(3, '0')}`;

      // Calcular progreso
      const progreso = data.checklist_items.length > 0 
        ? Math.round((data.checklist_items.filter(item => item.verificado).length / data.checklist_items.length) * 100)
        : 0;

      // Determinar estado y si está firmado
      const firmado = !!(data.jefe_centro_firma && data.supervisor_firma);
      const estado = firmado ? 'aprobado' : 'borrador';

      const anexoBravoData = {
        codigo,
        operacion_id: data.operacion_id,
        fecha_verificacion: data.fecha_verificacion,
        jefe_centro: 'Usuario Actual', // TODO: Obtener del contexto de usuario
        supervisor: 'Supervisor Asignado', // TODO: Obtener del contexto de usuario
        estado,
        firmado,
        checklist_completo: progreso === 100,
        progreso,
        checklist_items: data.checklist_items,
        observaciones_generales: data.observaciones_generales,
        jefe_centro_firma: data.jefe_centro_firma,
        supervisor_firma: data.supervisor_firma
      };

      const { data: newAnexo, error } = await supabase
        .from('anexo_bravo')
        .insert([anexoBravoData])
        .select(`
          anexo_id,
          codigo,
          operacion_id,
          fecha_creacion,
          fecha_verificacion,
          jefe_centro,
          supervisor,
          estado,
          firmado,
          checklist_completo,
          progreso,
          checklist_items,
          observaciones_generales,
          jefe_centro_firma,
          supervisor_firma,
          created_at,
          updated_at,
          operacion:operacion_id (
            nombre
          )
        `)
        .single();

      if (error) throw error;

      const formattedNewAnexo: AnexoBravoItem = {
        id: newAnexo.anexo_id,
        codigo: newAnexo.codigo,
        operacion_id: newAnexo.operacion_id,
        operacion_nombre: newAnexo.operacion?.nombre || 'Nueva Operación',
        fecha_creacion: newAnexo.fecha_creacion,
        fecha_verificacion: newAnexo.fecha_verificacion || '',
        jefe_centro: newAnexo.jefe_centro || '',
        supervisor: newAnexo.supervisor || '',
        estado: newAnexo.estado as AnexoBravoItem['estado'],
        firmado: newAnexo.firmado,
        checklist_completo: newAnexo.checklist_completo,
        progreso: newAnexo.progreso,
        checklist_items: parseChecklistItems(newAnexo.checklist_items),
        observaciones_generales: newAnexo.observaciones_generales || '',
        jefe_centro_firma: newAnexo.jefe_centro_firma,
        supervisor_firma: newAnexo.supervisor_firma,
        created_at: newAnexo.created_at,
        updated_at: newAnexo.updated_at
      };

      setAnexosBravo(prev => [formattedNewAnexo, ...prev]);
      
      // Emitir evento para dashboard
      if (formattedNewAnexo.firmado) {
        console.log('ANEXO_BRAVO_DONE event triggered:', formattedNewAnexo);
        // Aquí se integraría con el sistema de webhooks
      }

      toast({
        title: "Anexo Bravo Creado",
        description: `${formattedNewAnexo.codigo} ha sido ${formattedNewAnexo.firmado ? 'completado' : 'guardado como borrador'}`,
      });

      return formattedNewAnexo;
    } catch (err) {
      console.error('Error creating Anexo Bravo:', err);
      setError('Error al crear el Anexo Bravo');
      toast({
        title: "Error",
        description: "No se pudo crear el Anexo Bravo",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAnexoBravo = async (id: string, data: Partial<AnexoBravoFormData>) => {
    setLoading(true);
    try {
      // Calcular nuevo progreso si se actualizan los checklist_items
      let updateData: any = { ...data };
      if (data.checklist_items) {
        updateData.progreso = (data.checklist_items.filter(item => item.verificado).length / data.checklist_items.length) * 100;
        updateData.checklist_completo = updateData.progreso === 100;
      }

      const { error } = await supabase
        .from('anexo_bravo')
        .update(updateData)
        .eq('anexo_id', id);

      if (error) throw error;

      setAnexosBravo(prev => prev.map(anexo => 
        anexo.id === id 
          ? { 
              ...anexo, 
              ...data,
              progreso: updateData.progreso || anexo.progreso,
              checklist_completo: updateData.checklist_completo || anexo.checklist_completo,
              updated_at: new Date().toISOString()
            }
          : anexo
      ));

      toast({
        title: "Anexo Bravo Actualizado",
        description: "Los cambios han sido guardados",
      });
    } catch (err) {
      console.error('Error updating Anexo Bravo:', err);
      setError('Error al actualizar el Anexo Bravo');
      toast({
        title: "Error",
        description: "No se pudo actualizar el Anexo Bravo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAnexoBravo = async (id: string) => {
    try {
      const { error } = await supabase
        .from('anexo_bravo')
        .delete()
        .eq('anexo_id', id);

      if (error) throw error;

      setAnexosBravo(prev => prev.filter(anexo => anexo.id !== id));
      
      toast({
        title: "Anexo Bravo Eliminado",
        description: "El documento ha sido eliminado",
      });
    } catch (err) {
      console.error('Error deleting Anexo Bravo:', err);
      toast({
        title: "Error",
        description: "No se pudo eliminar el Anexo Bravo",
        variant: "destructive",
      });
    }
  };

  return {
    anexosBravo,
    loading,
    error,
    createAnexoBravo,
    updateAnexoBravo,
    deleteAnexoBravo,
    refreshAnexosBravo: loadAnexosBravo
  };
};
