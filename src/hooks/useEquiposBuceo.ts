
export interface EquipoBuceo {
  id: string;
  nombre: string;
  descripcion?: string;
  estado: string;
  empresa_id: string;
  tipo_empresa: string;
  activo: boolean;
  created_at: string;
  updated_at: string;
  miembros?: EquipoBuceoMiembro[];
}

export interface EquipoBuceoMiembro {
  id: string;
  equipo_id: string;
  usuario_id?: string;
  rol_equipo: string;
  disponible: boolean;
  created_at: string;
  rol?: string;
  nombre_completo?: string;
  matricula?: string;
  invitado?: boolean;
  estado_invitacion?: string;
  email?: string;
  telefono?: string;
  usuario?: {
    nombre: string;
    apellido: string;
    email: string;
  };
}

export interface EquipoBuceoFormData {
  nombre: string;
  descripcion: string;
  empresa_id: string;
  tipo_empresa: string;
}

export const useEquiposBuceo = () => {
  // Mock data - replace with actual Supabase query
  const equipos: EquipoBuceo[] = [];
  const isLoading = false;
  const error = null;

  const createEquipo = async (data: EquipoBuceoFormData) => {
    console.log('Creating equipo:', data);
  };

  const updateEquipo = async (id: string, data: Partial<EquipoBuceoFormData>) => {
    console.log('Updating equipo:', id, data);
  };

  const deleteEquipo = async (id: string) => {
    console.log('Deleting equipo:', id);
  };

  const addMiembro = async (miembroData: Partial<EquipoBuceoMiembro>) => {
    console.log('Adding member to equipo:', miembroData);
  };

  const removeMiembro = async (data: { miembro_id: string; equipo_id: string }) => {
    console.log('Removing member from equipo:', data);
  };

  const updateMiembroRole = async (data: { miembro_id: string; nuevo_rol: string; equipo_id: string }) => {
    console.log('Updating member role:', data);
  };

  const inviteMember = async (data: { equipo_id: string; email: string; nombre_completo: string; rol_equipo: string }) => {
    console.log('Inviting member to equipo:', data);
  };

  return {
    equipos,
    isLoading,
    error,
    createEquipo,
    updateEquipo,
    deleteEquipo,
    addMiembro,
    removeMiembro,
    updateMiembroRole,
    inviteMember,
    isCreating: false
  };
};
