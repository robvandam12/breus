
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface EquipoBuceoMiembro {
  id: string;
  usuario_id: string;
  equipo_id: string;
  rol_equipo: string;
  disponible: boolean;
  nombre?: string;
  apellido?: string;
  email?: string;
}

export interface EquipoBuceo {
  id: string;
  nombre: string;
  descripcion?: string;
  empresa_id: string;
  tipo_empresa: string;
  activo: boolean;
  miembros?: EquipoBuceoMiembro[];
}

export const useEquipoBuceo = () => {
  const { data: equipos = [], isLoading: loadingEquipos } = useQuery({
    queryKey: ['equipos-buceo'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipos_buceo')
        .select('*')
        .eq('activo', true)
        .order('nombre');

      if (error) throw error;
      return data as EquipoBuceo[];
    },
  });

  const { data: miembros = [], isLoading: loadingMiembros } = useQuery({
    queryKey: ['equipo-buceo-miembros'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('equipo_buceo_miembros')
        .select(`
          *,
          usuario:usuario_id (
            nombre,
            apellido,
            email
          )
        `)
        .eq('disponible', true);

      if (error) throw error;
      
      return data.map(miembro => ({
        ...miembro,
        nombre: miembro.usuario?.nombre || '',
        apellido: miembro.usuario?.apellido || '',
        email: miembro.usuario?.email || ''
      })) as EquipoBuceoMiembro[];
    },
  });

  return {
    equipos,
    miembros,
    isLoading: loadingEquipos || loadingMiembros,
  };
};
