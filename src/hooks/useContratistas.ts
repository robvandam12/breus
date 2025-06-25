
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
}

export const useContratistas = () => {
  // Mock data - replace with actual Supabase query
  const contratistas: Contratista[] = [];
  const isLoading = false;
  const error = null;

  return {
    contratistas,
    isLoading,
    error
  };
};
