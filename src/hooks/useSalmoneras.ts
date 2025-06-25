
export interface Salmonera {
  id: string;
  nombre: string;
  rut: string;
  direccion?: string;
  telefono?: string;
  email?: string;
  contacto_principal?: string;
  sitios_activos?: number;
  estado: string;
  created_at: string;
  updated_at: string;
}

export interface SalmoneraFormData {
  nombre: string;
  rut: string;
  direccion: string;
  telefono?: string;
  email?: string;
  estado?: "activa" | "inactiva" | "suspendida";
}

export const useSalmoneras = () => {
  // Mock data - replace with actual Supabase query
  const salmoneras: Salmonera[] = [];
  const isLoading = false;
  const error = null;

  return {
    salmoneras,
    isLoading,
    error
  };
};
