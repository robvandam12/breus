
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

    let equipoBuceoData = null;
    if (operacionData.equipo_buceo_id) {
      const { data: equipoData } = await supabase
        .from('equipos_buceo')
        .select(`
          id,
          nombre,
          equipo_buceo_miembros (
            usuario_id,
            rol_equipo,
            usuario:usuario_id (
              nombre,
              apellido
            )
          )
        `)
        .eq('id', operacionData.equipo_buceo_id)
        .single();

      if (equipoData) {
        equipoBuceoData = {
          ...equipoData,
          miembros: equipoData.equipo_buceo_miembros?.map((miembro: any) => ({
            usuario_id: miembro.usuario_id,
            rol_equipo: miembro.rol_equipo,
            nombre: miembro.usuario ? `${miembro.usuario.nombre} ${miembro.usuario.apellido}` : ''
          })) || []
        };
      }
    }

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

    const { data: operacionData } = await supabase
      .from('operacion')
      .select('equipo_buceo_id')
      .eq('id', operacionId)
      .single();

    const hasValidHPT = !!hptData;
    const hasValidAnexoBravo = !!anexoData;
    const hasTeam = !!(operacionData?.equipo_buceo_id);

    return {
      hasValidHPT,
      hasValidAnexoBravo,
      hasTeam,
      canExecute: hasValidHPT && hasValidAnexoBravo && hasTeam,
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
