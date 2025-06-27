
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface CuadrillaMiembro {
  id: string;
  nombre_completo: string;
  rol: string;
  disponible: boolean;
  matricula?: string;
  email?: string;
  telefono?: string;
  usuario_id?: string;
}

export interface CuadrillaBuceo {
  id: string;
  nombre: string;
  descripcion?: string;
  empresa_id: string;
  tipo_empresa: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  miembros?: CuadrillaMiembro[];
  asignaciones_activas?: Array<{
    fecha: string;
    inmersion_codigo: string;
    inmersion_id: string;
  }>;
}

export interface CuadrillaFormData {
  nombre: string;
  descripcion: string;
  empresa_id: string;
  tipo_empresa: 'salmonera' | 'contratista';
}

export interface AddMiembroData {
  cuadrilla_id: string;
  usuario_id: string;
  rol_equipo: string;
  nombre_completo: string;
  email?: string;
}

export const useCuadrillasBuceo = () => {
  const queryClient = useQueryClient();

  const { data: cuadrillas = [], isLoading } = useQuery({
    queryKey: ['cuadrillas-buceo'],
    queryFn: async () => {
      console.log('Fetching cuadrillas de buceo...');
      const { data, error } = await supabase
        .from('cuadrillas_buceo')
        .select(`
          *,
          cuadrilla_miembros (
            id,
            usuario_id,
            disponible,
            rol_equipo,
            usuario:usuario_id (
              nombre,
              apellido,
              email
            )
          )
        `)
        .eq('activo', true)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching cuadrillas:', error);
        throw error;
      }

      // Obtener asignaciones activas para cada cuadrilla
      const cuadrillasWithAssignments = await Promise.all(
        (data || []).map(async (cuadrilla) => {
          const { data: asignaciones } = await supabase
            .from('cuadrilla_asignaciones')
            .select(`
              fecha_asignacion,
              inmersion:inmersion_id (
                codigo,
                inmersion_id
              )
            `)
            .eq('cuadrilla_id', cuadrilla.id)
            .eq('estado', 'activa')
            .gte('fecha_asignacion', new Date().toISOString().split('T')[0]);

          return {
            ...cuadrilla,
            miembros: cuadrilla.cuadrilla_miembros?.map(miembro => ({
              id: miembro.id,
              nombre_completo: `${miembro.usuario?.nombre || ''} ${miembro.usuario?.apellido || ''}`.trim(),
              rol: miembro.rol_equipo,
              disponible: miembro.disponible,
              email: miembro.usuario?.email,
              usuario_id: miembro.usuario_id,
            })) || [],
            asignaciones_activas: asignaciones?.map(asignacion => ({
              fecha: asignacion.fecha_asignacion,
              inmersion_codigo: asignacion.inmersion?.codigo || 'N/A',
              inmersion_id: asignacion.inmersion?.inmersion_id || '',
            })) || []
          };
        })
      );

      return cuadrillasWithAssignments as CuadrillaBuceo[];
    },
  });

  const createCuadrillaMutation = useMutation({
    mutationFn: async (data: CuadrillaFormData & { activo?: boolean }) => {
      console.log('Creating cuadrilla de buceo:', data);

      const cuadrillaData = {
        nombre: data.nombre,
        descripcion: data.descripcion,
        empresa_id: data.empresa_id,
        tipo_empresa: data.tipo_empresa,
        activo: data.activo !== undefined ? data.activo : true,
      };

      const { data: result, error } = await supabase
        .from('cuadrillas_buceo')
        .insert([cuadrillaData])
        .select()
        .single();

      if (error) {
        console.error('Error creating cuadrilla:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-buceo'] });
      toast({
        title: "Cuadrilla creada",
        description: "La cuadrilla de buceo ha sido creada exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating cuadrilla:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la cuadrilla de buceo.",
        variant: "destructive",
      });
    },
  });

  const addMiembroMutation = useMutation({
    mutationFn: async (data: AddMiembroData) => {
      console.log('Adding miembro to cuadrilla:', data);
      
      const { data: result, error } = await supabase
        .from('cuadrilla_miembros')
        .insert([{
          cuadrilla_id: data.cuadrilla_id,
          usuario_id: data.usuario_id,
          rol_equipo: data.rol_equipo,
          disponible: true
        }])
        .select()
        .single();

      if (error) {
        console.error('Error adding miembro:', error);
        throw error;
      }

      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-buceo'] });
      toast({
        title: "Miembro agregado",
        description: "El miembro ha sido agregado a la cuadrilla exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error adding miembro:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el miembro a la cuadrilla.",
        variant: "destructive",
      });
    },
  });

  const removeMiembroMutation = useMutation({
    mutationFn: async ({ miembro_id, cuadrilla_id }: { miembro_id: string; cuadrilla_id: string }) => {
      console.log('Removing miembro from cuadrilla:', miembro_id);
      
      const { error } = await supabase
        .from('cuadrilla_miembros')
        .delete()
        .eq('id', miembro_id);

      if (error) {
        console.error('Error removing miembro:', error);
        throw error;
      }

      return true;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-buceo'] });
      toast({
        title: "Miembro removido",
        description: "El miembro ha sido removido de la cuadrilla exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error removing miembro:', error);
      toast({
        title: "Error",
        description: "No se pudo remover el miembro de la cuadrilla.",
        variant: "destructive",
      });
    },
  });

  const updateCuadrillaMutation = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<CuadrillaFormData> }) => {
      console.log('Updating cuadrilla:', id, data);
      
      const { data: result, error } = await supabase
        .from('cuadrillas_buceo')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-buceo'] });
      toast({
        title: "Cuadrilla actualizada",
        description: "La cuadrilla ha sido actualizada exitosamente.",
      });
    },
  });

  const deleteCuadrillaMutation = useMutation({
    mutationFn: async (id: string) => {
      console.log('Deleting cuadrilla:', id);
      
      const { error } = await supabase
        .from('cuadrillas_buceo')
        .update({ activo: false })
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['cuadrillas-buceo'] });
      toast({
        title: "Cuadrilla eliminada",
        description: "La cuadrilla ha sido eliminada exitosamente.",
      });
    },
  });

  return {
    cuadrillas,
    isLoading,
    createCuadrilla: createCuadrillaMutation.mutateAsync,
    addMiembro: addMiembroMutation.mutateAsync,
    removeMiembro: removeMiembroMutation.mutateAsync,
    updateCuadrilla: updateCuadrillaMutation.mutateAsync,
    deleteCuadrilla: deleteCuadrillaMutation.mutateAsync,
    isCreating: createCuadrillaMutation.isPending,
    isUpdating: updateCuadrillaMutation.isPending,
    isDeleting: deleteCuadrillaMutation.isPending,
  };
};
