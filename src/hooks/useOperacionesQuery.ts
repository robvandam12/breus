
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";

export interface BasicOperacion {
  id: string;
  codigo: string;
  nombre: string;
  tareas?: string;
  fecha_inicio: string;
  fecha_fin?: string;
  estado: string;
  estado_aprobacion?: string;
  salmonera_id?: string;
  contratista_id?: string;
  centro_id?: string;
  servicio_id?: string;
  supervisor_asignado_id?: string;
  company_id?: string;
  company_type?: string;
  created_at: string;
  updated_at: string;
}

export interface OperacionConRelaciones extends BasicOperacion {
  salmoneras?: { nombre: string };
  contratistas?: { nombre: string };
  centros?: { nombre: string };
  usuario_supervisor?: { nombre: string; apellido: string };
}

export type Operacion = OperacionConRelaciones;

export const useOperacionesQuery = () => {
  const { profile } = useAuth();

  return useQuery<OperacionConRelaciones[]>({
    queryKey: ['operaciones'],
    queryFn: async () => {
      let query = supabase
        .from('operacion')
        .select(`
          *,
          salmoneras:salmonera_id(nombre),
          contratistas:contratista_id(nombre),
          centros:centro_id(nombre),
          usuario_supervisor:supervisor_asignado_id(nombre, apellido)
        `)
        .order('created_at', { ascending: false });

      // Filtrar según el rol del usuario
      if (profile?.role === 'admin_salmonera' && profile?.salmonera_id) {
        query = query.eq('salmonera_id', profile.salmonera_id);
      } else if (profile?.role === 'admin_servicio' && profile?.servicio_id) {
        query = query.eq('contratista_id', profile.servicio_id);
      } else if (profile?.role === 'supervisor') {
        // Los supervisores pueden ver operaciones donde están asignados o de su empresa
        if (profile.salmonera_id) {
          query = query.eq('salmonera_id', profile.salmonera_id);
        } else if (profile.servicio_id) {
          query = query.eq('contratista_id', profile.servicio_id);
        }
      }

      const { data, error } = await query;
      
      if (error) throw error;
      return data || [];
    },
  });
};
