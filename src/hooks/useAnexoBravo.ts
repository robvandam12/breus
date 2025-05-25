import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface AnexoBravo {
  id: string;
  codigo: string;
  supervisor: string;
  jefe_centro: string;
  operacion_id: string;
  fecha_verificacion: string;
  estado: string;
  firmado: boolean;
  checklist_completo: boolean;
  progreso: number;
  observaciones_generales?: string;
  supervisor_firma?: string;
  jefe_centro_firma?: string;
  user_id: string;
  created_at: string;
  updated_at: string;
  // Campos del wizard completo
  empresa_nombre?: string;
  lugar_faena?: string;
  fecha?: string;
  jefe_centro_nombre?: string;
  buzo_o_empresa_nombre?: string;
  buzo_matricula?: string;
  autorizacion_armada?: boolean;
  asistente_buzo_nombre?: string;
  asistente_buzo_matricula?: string;
  anexo_bravo_checklist?: any;
  bitacora_hora_inicio?: string;
  bitacora_hora_termino?: string;
  bitacora_fecha?: string;
  bitacora_relator?: string;
  anexo_bravo_trabajadores?: any[];
  supervisor_servicio_firma?: string;
  supervisor_mandante_firma?: string;
  supervisor_servicio_nombre?: string;
  supervisor_mandante_nombre?: string;
  supervisor_servicio_timestamp?: string;
  supervisor_mandante_timestamp?: string;
  form_version?: number;
}

export interface AnexoBravoWizardData {
  // Paso 1: Información General
  empresa_nombre: string;
  lugar_faena: string;
  fecha: string;
  jefe_centro_nombre: string;
  
  // Paso 2: Identificación del Buzo
  buzo_o_empresa_nombre: string;
  buzo_matricula: string;
  autorizacion_armada: boolean;
  asistente_buzo_nombre: string;
  asistente_buzo_matricula: string;
  
  // Paso 3: Chequeo de Equipos
  anexo_bravo_checklist: Record<string, any>;
  
  // Paso 4: Bitácora de Buceo
  bitacora_hora_inicio: string;
  bitacora_hora_termino: string;
  bitacora_fecha: string;
  bitacora_relator: string;
  anexo_bravo_trabajadores: Array<{
    nombre: string;
    rut: string;
  }>;
  
  // Paso 5: Firmas
  supervisor_servicio_firma: string | null;
  supervisor_mandante_firma: string | null;
  supervisor_servicio_nombre?: string;
  supervisor_mandante_nombre?: string;
  supervisor_servicio_timestamp?: string;
  supervisor_mandante_timestamp?: string;
  observaciones_generales: string;
  
  // Campos adicionales para el sistema
  operacion_id?: string;
}

export const useAnexoBravo = () => {
  const queryClient = useQueryClient();

  const { data: anexosBravo = [], isLoading, error } = useQuery({
    queryKey: ['anexos-bravo'],
    queryFn: async () => {
      console.log('useAnexoBravo - Fetching Anexos Bravo...');
      const { data, error } = await supabase
        .from('anexo_bravo')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('useAnexoBravo - Error fetching Anexos Bravo:', error);
        throw error;
      }

      console.log('useAnexoBravo - Anexos Bravo data:', data);
      return data as AnexoBravo[];
    },
  });

  const createAnexoBravoMutation = useMutation({
    mutationFn: async (anexoBravoData: AnexoBravoWizardData) => {
      console.log('Creating Anexo Bravo:', anexoBravoData);
      
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      // Calcular progreso basado en datos completados
      const calcularProgreso = (data: AnexoBravoWizardData): number => {
        let completados = 0;
        let total = 0;

        // Paso 1: Información General (4 campos)
        total += 4;
        if (data.empresa_nombre) completados++;
        if (data.lugar_faena) completados++;
        if (data.fecha) completados++;
        if (data.jefe_centro_nombre) completados++;

        // Paso 2: Identificación del Buzo (5 campos)
        total += 5;
        if (data.buzo_o_empresa_nombre) completados++;
        if (data.buzo_matricula) completados++;
        if (data.autorizacion_armada !== undefined) completados++;
        if (data.asistente_buzo_nombre) completados++;
        if (data.asistente_buzo_matricula) completados++;

        // Paso 3: Checklist (1 campo)
        total += 1;
        if (data.anexo_bravo_checklist && Object.keys(data.anexo_bravo_checklist).length > 0) completados++;

        // Paso 4: Bitácora (4 campos)
        total += 4;
        if (data.bitacora_hora_inicio) completados++;
        if (data.bitacora_hora_termino) completados++;
        if (data.bitacora_fecha) completados++;
        if (data.bitacora_relator) completados++;

        // Paso 5: Firmas (2 campos)
        total += 2;
        if (data.supervisor_servicio_firma) completados++;
        if (data.supervisor_mandante_firma) completados++;

        return Math.round((completados / total) * 100);
      };

      const progreso = calcularProgreso(anexoBravoData);
      const firmado = !!(anexoBravoData.supervisor_servicio_firma && anexoBravoData.supervisor_mandante_firma);
      const estado = firmado ? 'firmado' : (progreso > 50 ? 'pendiente' : 'borrador');

      // Generar código único
      const codigo = `AB-${Date.now().toString().slice(-6)}`;

      const { data, error } = await supabase
        .from('anexo_bravo')
        .insert([{
          codigo,
          supervisor: anexoBravoData.supervisor_servicio_nombre || 'Sin asignar',
          jefe_centro: anexoBravoData.jefe_centro_nombre || 'Sin asignar',
          operacion_id: anexoBravoData.operacion_id || crypto.randomUUID(),
          fecha_verificacion: anexoBravoData.fecha || new Date().toISOString().split('T')[0],
          estado,
          firmado,
          checklist_completo: Object.keys(anexoBravoData.anexo_bravo_checklist || {}).length > 0,
          progreso,
          user_id: user.id,
          // Campos específicos del wizard
          empresa_nombre: anexoBravoData.empresa_nombre,
          lugar_faena: anexoBravoData.lugar_faena,
          fecha: anexoBravoData.fecha,
          jefe_centro_nombre: anexoBravoData.jefe_centro_nombre,
          buzo_o_empresa_nombre: anexoBravoData.buzo_o_empresa_nombre,
          buzo_matricula: anexoBravoData.buzo_matricula,
          autorizacion_armada: anexoBravoData.autorizacion_armada,
          asistente_buzo_nombre: anexoBravoData.asistente_buzo_nombre,
          asistente_buzo_matricula: anexoBravoData.asistente_buzo_matricula,
          anexo_bravo_checklist: anexoBravoData.anexo_bravo_checklist,
          bitacora_hora_inicio: anexoBravoData.bitacora_hora_inicio,
          bitacora_hora_termino: anexoBravoData.bitacora_hora_termino,
          bitacora_fecha: anexoBravoData.bitacora_fecha,
          bitacora_relator: anexoBravoData.bitacora_relator,
          anexo_bravo_trabajadores: anexoBravoData.anexo_bravo_trabajadores,
          observaciones_generales: anexoBravoData.observaciones_generales,
          supervisor_firma: anexoBravoData.supervisor_servicio_firma,
          jefe_centro_firma: anexoBravoData.supervisor_mandante_firma,
          form_version: 1
        }])
        .select()
        .single();

      if (error) {
        console.error('Error creating Anexo Bravo:', error);
        throw error;
      }

      console.log('Anexo Bravo created:', data);
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anexos-bravo'] });
      toast({
        title: "Anexo Bravo creado",
        description: "El Anexo Bravo ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el Anexo Bravo. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const updateAnexoBravoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AnexoBravoWizardData> }) => {
      console.log('Updating Anexo Bravo:', id, data);
      const { data: updatedData, error } = await supabase
        .from('anexo_bravo')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error updating Anexo Bravo:', error);
        throw error;
      }

      console.log('Anexo Bravo updated:', updatedData);
      return updatedData;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anexos-bravo'] });
      toast({
        title: "Anexo Bravo actualizado",
        description: "El Anexo Bravo ha sido actualizado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error updating Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el Anexo Bravo. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  const deleteAnexoBravoMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting Anexo Bravo:', id);
      const { error } = await supabase
        .from('anexo_bravo')
        .delete()
        .eq('id', id);

      if (error) {
        console.error('Error deleting Anexo Bravo:', error);
        throw error;
      }

      console.log('Anexo Bravo deleted:', id);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anexos-bravo'] });
      toast({
        title: "Anexo Bravo eliminado",
        description: "El Anexo Bravo ha sido eliminado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error deleting Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el Anexo Bravo. Intente nuevamente.",
        variant: "destructive",
      });
    },
  });

  return {
    anexosBravo,
    isLoading,
    error,
    createAnexoBravo: createAnexoBravoMutation.mutateAsync,
    updateAnexoBravo: updateAnexoBravoMutation.mutateAsync,
    deleteAnexoBravo: deleteAnexoBravoMutation.mutateAsync,
    isCreating: createAnexoBravoMutation.isPending,
    isUpdating: updateAnexoBravoMutation.isPending,
    isDeleting: deleteAnexoBravoMutation.isPending,
  };
};
