
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface EquipoBuceoMiembro {
  id: string;
  usuario_id: string;
  equipo_id: string;
  rol_equipo: string;
  disponible: boolean;
  nombre?: string;
  apellido?: string;
  email?: string;
  nombre_completo?: string;
}

export interface EquipoBuceo {
  id: string;
  nombre: string;
  descripcion?: string;
  empresa_id: string;
  tipo_empresa: string;
  activo: boolean;
  created_at?: string;
  miembros?: EquipoBuceoMiembro[];
}

export const useEquipoBuceo = () => {
  const queryClient = useQueryClient();

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
        email: miembro.usuario?.email || '',
        nombre_completo: `${miembro.usuario?.nombre || ''} ${miembro.usuario?.apellido || ''}`.trim()
      })) as EquipoBuceoMiembro[];
    },
  });

  const createEquipoMutation = useMutation({
    mutationFn: async (equipoData: Omit<EquipoBuceo, 'id' | 'created_at'>) => {
      const { data, error } = await supabase
        .from('equipos_buceo')
        .insert(equipoData)
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['equipos-buceo'] });
      toast({
        title: "Equipo creado",
        description: "El equipo de buceo ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating equipo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el equipo de buceo.",
        variant: "destructive",
      });
    },
  });

  return {
    equipos,
    miembros,
    isLoading: loadingEquipos || loadingMiembros,
    createEquipo: createEquipoMutation.mutateAsync,
  };
};
