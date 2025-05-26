
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';

export interface EquipoBuceo {
  id: string;
  nombre: string;
  descripcion?: string;
  empresa_id: string;
  tipo_empresa: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  miembros?: Array<{
    id: string;
    nombre_completo: string;
    rol: string;
    disponible: boolean;
  }>;
}

export const useEquiposBuceoEnhanced = () => {
  const [equipos, setEquipos] = useState<EquipoBuceo[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const { toast } = useToast();

  const fetchEquipos = async () => {
    try {
      setIsLoading(true);
      console.log('Fetching equipos de buceo...');
      
      const { data: equiposData, error: equiposError } = await supabase
        .from('equipos_buceo')
        .select('*')
        .eq('activo', true)
        .order('created_at', { ascending: false });

      if (equiposError) {
        console.error('Error fetching equipos:', equiposError);
        throw equiposError;
      }

      // Fetch miembros for each equipo
      const equiposWithMiembros = await Promise.all(
        (equiposData || []).map(async (equipo) => {
          const { data: miembrosData } = await supabase
            .from('equipo_buceo_miembros')
            .select(`
              id,
              disponible,
              rol_equipo,
              usuario:usuario_id (
                nombre,
                apellido,
                rol
              )
            `)
            .eq('equipo_id', equipo.id);

          const miembros = (miembrosData || []).map(miembro => ({
            id: miembro.id,
            nombre_completo: `${miembro.usuario?.nombre || ''} ${miembro.usuario?.apellido || ''}`.trim(),
            rol: miembro.usuario?.rol || miembro.rol_equipo,
            disponible: miembro.disponible
          }));

          return {
            ...equipo,
            miembros
          };
        })
      );

      setEquipos(equiposWithMiembros);
    } catch (error) {
      console.error('Error fetching equipos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los equipos de buceo.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createEquipo = async (equipoData: { nombre: string; descripcion: string; empresa_id: string }) => {
    try {
      setIsCreating(true);
      
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('equipos_buceo')
        .insert([{
          nombre: equipoData.nombre,
          descripcion: equipoData.descripcion,
          empresa_id: equipoData.empresa_id,
          tipo_empresa: 'salmonera', // Default value
          activo: true
        }])
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Equipo creado",
        description: "El equipo de buceo ha sido creado exitosamente.",
      });

      await fetchEquipos();
      return data;
    } catch (error) {
      console.error('Error creating equipo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el equipo de buceo.",
        variant: "destructive",
      });
      throw error;
    } finally {
      setIsCreating(false);
    }
  };

  useEffect(() => {
    fetchEquipos();
  }, []);

  return {
    equipos,
    isLoading,
    isCreating,
    createEquipo,
    refreshEquipos: fetchEquipos
  };
};
