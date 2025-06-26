
import { supabase } from "@/integrations/supabase/client";
import type { OperationData, HPTData, AnexoBravoData, EquipoBuceoData, ValidationStatus } from "@/types/inmersion";

export const getOperationCompleteData = async (operacionId: string) => {
  try {
    const { data: operacionData, error: operacionError } = await supabase
      .from('operacion')
      .select(`
        *,
        salmoneras:salmonera_id(nombre),
        sitios:sitio_id(nombre),
        contratistas:contratista_id(nombre)
      `)
      .eq('id', operacionId)
      .single();

    if (operacionError) throw operacionError;

    const { data: hptData } = await supabase
      .from('hpt')
      .select('id, codigo, supervisor, firmado')
      .eq('operacion_id', operacionId)
      .eq('firmado', true)
      .maybeSingle();

    const { data: anexoBravoData } = await supabase
      .from('anexo_bravo')
      .select('id, codigo, supervisor, firmado')
      .eq('operacion_id', operacionId)
      .eq('firmado', true)
      .maybeSingle();

    // Ya no hay equipos asignados a operaciones
    let equipoBuceoData = null;

    return {
      operacion: operacionData as OperationData,
      hpt: hptData as HPTData | null,
      anexoBravo: anexoBravoData as AnexoBravoData | null,
      equipoBuceo: equipoBuceoData as EquipoBuceoData | null
    };
  } catch (error) {
    console.error('Error getting operation complete data:', error);
    return null;
  }
};

export const validateOperationDocuments = async (operacionId: string): Promise<ValidationStatus> => {
  try {
    const { data: hptData } = await supabase
      .from('hpt')
      .select('codigo, firmado')
      .eq('operacion_id', operacionId)
      .eq('firmado', true)
      .single();

    const { data: anexoData } = await supabase
      .from('anexo_bravo')
      .select('codigo, firmado')
      .eq('operacion_id', operacionId)
      .eq('firmado', true)
      .single();

    const hasValidHPT = !!hptData;
    const hasValidAnexoBravo = !!anexoData;
    // Ya no verificamos equipos a nivel de operación
    const hasTeam = true; // Los equipos se gestionan a nivel de inmersión

    return {
      hasValidHPT,
      hasValidAnexoBravo,
      hasTeam,
      canExecute: hasValidHPT && hasValidAnexoBravo,
      hptCode: hptData?.codigo,
      anexoBravoCode: anexoData?.codigo
    };
  } catch (error) {
    console.error('Error validating documents:', error);
    return {
      hasValidHPT: false,
      hasValidAnexoBravo: false,
      hasTeam: false,
      canExecute: false
    };
  }
};
