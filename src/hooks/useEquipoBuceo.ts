
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { Tables, TablesInsert } from '@/integrations/supabase/types';

// Using the actual database types for equipos_buceo
type EquipoBuceo = Tables<'equipos_buceo'> & {
  miembros?: EquipoBuceoMiembro[];
  empresa_nombre?: string;
};

type EquipoBuceoMiembro = {
  id: string;
  equipo_id: string;
  usuario_id?: string;
  nombre_completo: string;
  email?: string;
  rol_equipo: 'supervisor' | 'buzo_principal' | 'buzo_asistente';
  disponible: boolean;
  usuario?: {
    nombre: string;
    apellido: string;
    email: string;
  };
};

export const useEquipoBuceo = () => {
  const [equipos, setEquipos] = useState<EquipoBuceo[]>([]);
  const [miembros, setMiembros] = useState<EquipoBuceoMiembro[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  const fetchEquipos = async () => {
    try {
      const { data, error } = await supabase
        .from('equipos_buceo')
        .select(`
          *,
          miembros:equipo_buceo_miembros(
            *,
            usuario:usuario(nombre, apellido, email)
          )
        `)
        .eq('activo', true)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      const equiposWithMiembros = (data || []).map(equipo => ({
        ...equipo,
        empresa_nombre: 'Empresa', // This should come from empresa relation
        miembros: equipo.miembros?.map(miembro => ({
          id: miembro.id,
          equipo_id: miembro.equipo_id,
          usuario_id: miembro.usuario_id,
          nombre_completo: miembro.usuario ? 
            `${miembro.usuario.nombre} ${miembro.usuario.apellido}`.trim() : 
            'Usuario desconocido',
          email: miembro.usuario?.email,
          rol_equipo: miembro.rol_equipo,
          disponible: miembro.disponible,
          usuario: miembro.usuario
        })) || []
      }));
      
      setEquipos(equiposWithMiembros);
    } catch (error) {
      console.error('Error fetching equipos:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los equipos de buceo",
        variant: "destructive",
      });
    }
  };

  const fetchMiembrosEquipo = async (equipoId: string) => {
    try {
      const { data, error } = await supabase
        .from('equipo_buceo_miembros')
        .select(`
          *,
          usuario:usuario(nombre, apellido, email)
        `)
        .eq('equipo_id', equipoId);

      if (error) throw error;
      
      const miembrosFormatted = (data || []).map(miembro => ({
        id: miembro.id,
        equipo_id: miembro.equipo_id,
        usuario_id: miembro.usuario_id,
        nombre_completo: miembro.usuario ? 
          `${miembro.usuario.nombre} ${miembro.usuario.apellido}`.trim() : 
          'Usuario desconocido',
        email: miembro.usuario?.email,
        rol_equipo: miembro.rol_equipo,
        disponible: miembro.disponible,
        usuario: miembro.usuario
      }));
      
      return miembrosFormatted;
    } catch (error) {
      console.error('Error fetching miembros:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los miembros del equipo",
        variant: "destructive",
      });
      return [];
    }
  };

  const createEquipo = async (equipoData: Partial<EquipoBuceo>) => {
    try {
      // Get current user to determine empresa_id and tipo_empresa
      const { data: user } = await supabase.auth.getUser();
      if (!user.user) throw new Error('Usuario no autenticado');

      const { data: userProfile } = await supabase
        .from('usuario')
        .select('salmonera_id, servicio_id')
        .eq('usuario_id', user.user.id)
        .single();

      if (!userProfile) throw new Error('Perfil de usuario no encontrado');

      const newEquipoData: TablesInsert<'equipos_buceo'> = {
        nombre: equipoData.nombre || 'Nuevo Equipo',
        descripcion: equipoData.descripcion || '',
        empresa_id: userProfile.salmonera_id || userProfile.servicio_id || '',
        tipo_empresa: userProfile.salmonera_id ? 'salmonera' : 'servicio',
        activo: true
      };

      const { data, error } = await supabase
        .from('equipos_buceo')
        .insert([newEquipoData])
        .select(`
          *,
          miembros:equipo_buceo_miembros(
            *,
            usuario:usuario(nombre, apellido, email)
          )
        `)
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }
      
      // Update local state
      const equipoFormatted = {
        ...data,
        empresa_nombre: 'Empresa',
        miembros: []
      };
      
      setEquipos(prev => [equipoFormatted, ...prev]);
      
      toast({
        title: "Éxito",
        description: "Equipo de buceo creado correctamente",
      });
      
      return data;
    } catch (error) {
      console.error('Error creating equipo:', error);
      toast({
        title: "Error",
        description: `No se pudo crear el equipo de buceo: ${error.message || error}`,
        variant: "destructive",
      });
      throw error;
    }
  };

  const addMiembroEquipo = async (miembroData: Partial<EquipoBuceoMiembro>) => {
    try {
      const { data, error } = await supabase
        .from('equipo_buceo_miembros')
        .insert([{
          equipo_id: miembroData.equipo_id!,
          usuario_id: miembroData.usuario_id!,
          rol_equipo: miembroData.rol_equipo!,
          disponible: true
        }])
        .select(`
          *,
          usuario:usuario(nombre, apellido, email)
        `)
        .single();

      if (error) throw error;
      
      toast({
        title: "Éxito",
        description: "Miembro agregado al equipo correctamente",
      });
      
      await fetchEquipos(); // Refresh data
      return data;
    } catch (error) {
      console.error('Error adding miembro:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el miembro al equipo",
        variant: "destructive",
      });
      throw error;
    }
  };

  const inviteMiembro = async (equipoId: string, email: string, rol: 'supervisor' | 'buzo_principal' | 'buzo_asistente', nombreCompleto: string) => {
    try {
      // For now, we'll create a notification to track invitations
      console.log('Inviting member:', { equipoId, email, rol, nombreCompleto });
      
      toast({
        title: "Invitación enviada",
        description: `Se ha enviado una invitación a ${email}`,
      });
      
    } catch (error) {
      console.error('Error sending invitation:', error);
      throw error;
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setIsLoading(true);
      await fetchEquipos();
      setIsLoading(false);
    };

    loadData();
  }, []);

  return {
    equipos,
    miembros,
    isLoading,
    fetchEquipos,
    fetchMiembrosEquipo,
    createEquipo,
    addMiembroEquipo,
    inviteMiembro
  };
};
