
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export const useOperacionValidation = () => {
  const { data: operacionesConDocumentos = [], isLoading } = useQuery({
    queryKey: ['operaciones-con-documentos'],
    queryFn: async () => {
      console.log('Fetching operaciones con documentos...');
      
      const { data: operaciones, error: opError } = await supabase
        .from('operacion')
        .select(`
          *,
          sitios:sitio_id (
            id,
            nombre,
            ubicacion
          ),
          contratistas:contratista_id (
            id,
            nombre,
            rut
          ),
          salmoneras:salmonera_id (
            id,
            nombre
          )
        `)
        .order('created_at', { ascending: false });

      if (opError) throw opError;

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
