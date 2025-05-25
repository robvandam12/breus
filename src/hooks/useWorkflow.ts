
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface WorkflowStatus {
  operacion_id: string;
  operacion_nombre: string;
  hpt_exists: boolean;
  hpt_firmado: boolean;
  hpt_codigo?: string;
  anexo_bravo_exists: boolean;
  anexo_bravo_firmado: boolean;
  anexo_bravo_codigo?: string;
  inmersiones_count: number;
  bitacoras_count: number;
  can_create_inmersion: boolean;
  workflow_step: 'operacion' | 'hpt' | 'anexo_bravo' | 'inmersion' | 'bitacora' | 'completado';
}

export const useWorkflow = (operacionId?: string) => {
  const { data: workflowStatus, isLoading, refetch } = useQuery({
    queryKey: ['workflow-status', operacionId],
    queryFn: async () => {
      if (!operacionId) return null;

      console.log('Fetching workflow status for operation:', operacionId);

      // Get operation details
      const { data: operacion, error: operacionError } = await supabase
        .from('operacion')
        .select('nombre')
        .eq('id', operacionId)
        .single();

      if (operacionError) throw operacionError;

      // Get HPT status
      const { data: hptData } = await supabase
        .from('hpt')
        .select('id, codigo, firmado, estado')
        .eq('operacion_id', operacionId)
        .maybeSingle();

      // Get Anexo Bravo status
      const { data: anexoBravoData } = await supabase
        .from('anexo_bravo')
        .select('id, codigo, firmado, estado')
        .eq('operacion_id', operacionId)
        .maybeSingle();

      // Get inmersiones count
      const { data: inmersiones, error: inmersionesError } = await supabase
        .from('inmersion')
        .select('inmersion_id')
        .eq('operacion_id', operacionId);

      if (inmersionesError) throw inmersionesError;

      // Get bitacoras count
      const { data: bitacoras, error: bitacorasError } = await supabase
        .from('bitacora_supervisor')
        .select('bitacora_id')
        .in('inmersion_id', (inmersiones || []).map(i => i.inmersion_id));

      if (bitacorasError) throw bitacorasError;

      const hpt_exists = !!hptData;
      const hpt_firmado = hptData?.firmado || false;
      const anexo_bravo_exists = !!anexoBravoData;
      const anexo_bravo_firmado = anexoBravoData?.firmado || false;
      const inmersiones_count = inmersiones?.length || 0;
      const bitacoras_count = bitacoras?.length || 0;

      // Determine workflow step
      let workflow_step: WorkflowStatus['workflow_step'] = 'operacion';
      if (!hpt_exists) {
        workflow_step = 'hpt';
      } else if (!hpt_firmado) {
        workflow_step = 'hpt';
      } else if (!anexo_bravo_exists) {
        workflow_step = 'anexo_bravo';
      } else if (!anexo_bravo_firmado) {
        workflow_step = 'anexo_bravo';
      } else if (inmersiones_count === 0) {
        workflow_step = 'inmersion';
      } else if (bitacoras_count < inmersiones_count) {
        workflow_step = 'bitacora';
      } else {
        workflow_step = 'completado';
      }

      const status: WorkflowStatus = {
        operacion_id: operacionId,
        operacion_nombre: operacion.nombre,
        hpt_exists,
        hpt_firmado,
        hpt_codigo: hptData?.codigo,
        anexo_bravo_exists,
        anexo_bravo_firmado,
        anexo_bravo_codigo: anexoBravoData?.codigo,
        inmersiones_count,
        bitacoras_count,
        can_create_inmersion: hpt_firmado && anexo_bravo_firmado,
        workflow_step
      };

      console.log('Workflow status:', status);
      return status;
    },
    enabled: !!operacionId,
  });

  return {
    workflowStatus,
    isLoading,
    refetch
  };
};
