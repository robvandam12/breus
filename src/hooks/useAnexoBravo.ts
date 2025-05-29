
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface AnexoBravo {
  id: string;
  codigo: string;
  operacion_id: string;
  fecha: string;
  lugar_faena?: string;
  empresa_nombre?: string;
  supervisor_servicio_nombre?: string;
  supervisor_mandante_nombre?: string;
  buzo_o_empresa_nombre?: string;
  supervisor: string;
  estado: string;
  firmado: boolean;
  progreso: number;
  created_at: string;
  updated_at: string;
  user_id: string;
  fecha_verificacion: string;
  jefe_centro: string;
}

export interface AnexoBravoFormData {
  codigo: string;
  operacion_id: string;
  fecha: string;
  lugar_faena?: string;
  empresa_nombre?: string;
  supervisor_servicio_nombre?: string;
  supervisor_mandante_nombre?: string;
  buzo_o_empresa_nombre?: string;
  buzo_matricula?: string;
  asistente_buzo_nombre?: string;
  asistente_buzo_matricula?: string;
  autorizacion_armada?: boolean;
  bitacora_fecha?: string;
  bitacora_hora_inicio?: string;
  bitacora_hora_termino?: string;
  bitacora_relator?: string;
  anexo_bravo_checklist?: any;
  anexo_bravo_trabajadores?: any[];
  anexo_bravo_firmas?: any;
  observaciones_generales?: string;
  jefe_centro_nombre?: string;
  supervisor: string;
  estado?: string;
  firmado?: boolean;
}

export const useAnexoBravo = () => {
  const queryClient = useQueryClient();

  // Fetch anexos bravo
  const { data: anexosBravo = [], isLoading } = useQuery({
    queryKey: ['anexos-bravo'],
    queryFn: async () => {
      console.log('Fetching anexos bravo...');
      const { data, error } = await supabase
        .from('anexo_bravo')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching anexos bravo:', error);
        throw error;
      }

      return (data || []) as AnexoBravo[];
    },
  });

  // Create anexo bravo
  const createAnexoBravoMutation = useMutation({
    mutationFn: async (data: AnexoBravoFormData) => {
      console.log('Creating anexo bravo:', data);
      
      const currentUser = await supabase.auth.getUser();
      
      const insertData = {
        codigo: data.codigo,
        operacion_id: data.operacion_id,
        fecha: data.fecha,
        lugar_faena: data.lugar_faena,
        empresa_nombre: data.empresa_nombre,
        supervisor_servicio_nombre: data.supervisor_servicio_nombre,
        supervisor_mandante_nombre: data.supervisor_mandante_nombre,
        buzo_o_empresa_nombre: data.buzo_o_empresa_nombre,
        buzo_matricula: data.buzo_matricula,
        asistente_buzo_nombre: data.asistente_buzo_nombre,
        asistente_buzo_matricula: data.asistente_buzo_matricula,
        autorizacion_armada: data.autorizacion_armada,
        bitacora_fecha: data.bitacora_fecha,
        bitacora_hora_inicio: data.bitacora_hora_inicio,
        bitacora_hora_termino: data.bitacora_hora_termino,
        bitacora_relator: data.bitacora_relator,
        anexo_bravo_checklist: data.anexo_bravo_checklist,
        anexo_bravo_trabajadores: data.anexo_bravo_trabajadores,
        anexo_bravo_firmas: data.anexo_bravo_firmas,
        observaciones_generales: data.observaciones_generales,
        jefe_centro_nombre: data.jefe_centro_nombre,
        supervisor: data.supervisor,
        estado: 'borrador',
        firmado: false,
        user_id: currentUser.data.user?.id,
        fecha_verificacion: new Date().toISOString().split('T')[0],
        jefe_centro: data.jefe_centro_nombre || 'No especificado'
      };

      const { data: result, error } = await supabase
        .from('anexo_bravo')
        .insert([insertData])
        .select()
        .single();

      if (error) {
        console.error('Error creating anexo bravo:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anexos-bravo'] });
      toast({
        title: "Anexo Bravo creado",
        description: "El Anexo Bravo ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating anexo bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el Anexo Bravo.",
        variant: "destructive",
      });
    },
  });

  // Update anexo bravo
  const updateAnexoBravoMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<AnexoBravoFormData> }) => {
      console.log('Updating anexo bravo:', id, data);
      
      const { data: result, error } = await supabase
        .from('anexo_bravo')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anexos-bravo'] });
      toast({
        title: "Anexo Bravo actualizado",
        description: "El Anexo Bravo ha sido actualizado exitosamente.",
      });
    },
  });

  // Sign anexo bravo - corregido para usar el estado correcto
  const signAnexoBravoMutation = useMutation({
    mutationFn: async ({ id, signatures }: { id: string; signatures: any }) => {
      console.log('Signing anexo bravo:', id, signatures);
      
      // Primero verificamos si el anexo existe y obtenemos sus datos actuales
      const { data: currentAnexo, error: fetchError } = await supabase
        .from('anexo_bravo')
        .select('*')
        .eq('id', id)
        .single();

      if (fetchError) {
        console.error('Error fetching anexo bravo:', fetchError);
        throw fetchError;
      }

      // Ahora actualizamos con el estado correcto
      const { data: result, error } = await supabase
        .from('anexo_bravo')
        .update({
          anexo_bravo_firmas: signatures,
          firmado: true,
          estado: 'firmado' // Usamos 'firmado' que debe ser un estado válido
        })
        .eq('id', id)
        .select()
        .single();

      if (error) {
        console.error('Error signing anexo bravo:', error);
        throw error;
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anexos-bravo'] });
      toast({
        title: "Anexo Bravo firmado",
        description: "El Anexo Bravo ha sido firmado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error signing anexo bravo:', error);
      toast({
        title: "Error al firmar",
        description: "No se pudo firmar el Anexo Bravo.",
        variant: "destructive",
      });
    },
  });

  // Delete anexo bravo
  const deleteAnexoBravoMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting anexo bravo:', id);
      
      const { error } = await supabase
        .from('anexo_bravo')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['anexos-bravo'] });
      toast({
        title: "Anexo Bravo eliminado",
        description: "El Anexo Bravo ha sido eliminado exitosamente.",
      });
    },
  });

  return {
    anexosBravo,
    isLoading,
    createAnexoBravo: createAnexoBravoMutation.mutateAsync,
    isCreating: createAnexoBravoMutation.isPending,
    updateAnexoBravo: updateAnexoBravoMutation.mutateAsync,
    signAnexoBravo: signAnexoBravoMutation.mutateAsync,
    deleteAnexoBravo: deleteAnexoBravoMutation.mutateAsync,
    isUpdating: updateAnexoBravoMutation.isPending,
    isSigning: signAnexoBravoMutation.isPending,
  };
};
