
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useOperacionesQuery } from "./useOperacionesQuery";

export const useOperacionValidation = () => {
  const { data: operaciones = [] } = useOperacionesQuery();

  const { data: operacionesConDocumentos = [], isLoading } = useQuery({
    queryKey: ['operaciones-con-documentos', operaciones.length],
    queryFn: async () => {
      if (operaciones.length === 0) return [];

      console.log('Fetching document status for operations...');

      // Para cada operación, verificar si tiene HPT y Anexo Bravo
      const operacionesConEstado = await Promise.all(
        operaciones.map(async (operacion) => {
          // Verificar HPT
          const { data: hpt } = await supabase
            .from('hpt')
            .select('id, estado, firmado')
            .eq('operacion_id', operacion.id)
            .single();

          // Verificar Anexo Bravo
          const { data: anexoBravo } = await supabase
            .from('anexo_bravo')
            .select('id, estado, firmado')
            .eq('operacion_id', operacion.id)
            .single();

          return {
            ...operacion,
            tiene_hpt: !!hpt,
            hpt_firmado: hpt?.firmado || false,
            tiene_anexo_bravo: !!anexoBravo,
            anexo_bravo_firmado: anexoBravo?.firmado || false,
            puede_crear_hpt: !hpt,
            puede_crear_anexo_bravo: !anexoBravo
          };
        })
      );

      return operacionesConEstado;
    },
    enabled: operaciones.length > 0,
  });

  const getOperacionesDisponiblesParaHPT = () => {
    return operacionesConDocumentos.filter(op => op.puede_crear_hpt);
  };

  const getOperacionesDisponiblesParaAnexoBravo = () => {
    return operacionesConDocumentos.filter(op => op.puede_crear_anexo_bravo);
  };

  const validarOperacionParaDocumento = (operacionId: string, tipoDocumento: 'hpt' | 'anexo_bravo') => {
    const operacion = operacionesConDocumentos.find(op => op.id === operacionId);
    if (!operacion) return false;

    if (tipoDocumento === 'hpt') {
      return operacion.puede_crear_hpt;
    } else {
      return operacion.puede_crear_anexo_bravo;
    }
  };

  return {
    operacionesConDocumentos,
    isLoading,
    getOperacionesDisponiblesParaHPT,
    getOperacionesDisponiblesParaAnexoBravo,
    validarOperacionParaDocumento
  };
};
