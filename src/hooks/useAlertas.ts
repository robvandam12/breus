
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface Alerta {
  id: string;
  titulo: string;
  descripcion: string;
  tipo: 'info' | 'warning' | 'error' | 'success';
  leida: boolean;
  created_at: string;
  updated_at: string;
}

export const useAlertas = () => {
  // Fetch alertas
  const { data: alertas = [], isLoading } = useQuery({
    queryKey: ['alertas'],
    queryFn: async () => {
      console.log('Fetching alertas...');
      
      // Por ahora retornamos datos mock ya que no tenemos la tabla en Supabase
      const mockAlertas: Alerta[] = [
        {
          id: '1',
          titulo: 'HPT pendiente de firma',
          descripcion: 'HPT-001 requiere firma del supervisor mandante',
          tipo: 'warning',
          leida: false,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          titulo: 'Inmersión completada',
          descripcion: 'Inmersión INM-002 ha sido completada exitosamente',
          tipo: 'success',
          leida: true,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ];

      return mockAlertas;
    },
  });

  const alertasNoLeidas = alertas.filter(alerta => !alerta.leida);

  return {
    alertas,
    alertasNoLeidas,
    isLoading,
  };
};
