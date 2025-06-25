
export interface Contratista {
  id: string;
  nombre: string;
  rut: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  contacto_principal?: string;
  estado: string;
  created_at: string;
  updated_at: string;
  certificaciones?: string[];
  especialidades?: string[];
}

export interface ContratistaFormData {
  nombre: string;
  rut: string;
  direccion: string;
  telefono?: string;
  email?: string;
  contacto_principal?: string;
  certificaciones?: string[];
  especialidades?: string[];
}

export const useContratistas = () => {
  // Mock data - replace with actual Supabase query
  const contratistas: Contratista[] = [];
  const isLoading = false;
  const error = null;

  const createContratista = async (data: ContratistaFormData) => {
    console.log('Creating contratista:', data);
  };

  const updateContratista = async (id: string, data: Partial<ContratistaFormData>) => {
    console.log('Updating contratista:', id, data);
  };

  const deleteContratista = async (id: string) => {
    console.log('Deleting contratista:', id);
  };

  return {
    contratistas,
    isLoading,
    error,
    createContratista,
    updateContratista,
    deleteContratista,
    isCreating: false
  };
};
