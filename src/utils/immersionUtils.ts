
export const getEstadoBadge = (estado: string) => {
  switch (estado) {
    case "Completada":
      return "bg-emerald-100 text-emerald-700";
    case "En Progreso":
      return "bg-blue-100 text-blue-700";
    case "Programada":
      return "bg-amber-100 text-amber-700";
    case "Cancelada":
      return "bg-red-100 text-red-700";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
};

export const getTipoBadge = (tipo: string) => {
  switch (tipo) {
    case "Mantenimiento":
      return "bg-purple-100 text-purple-700";
    case "Inspección":
      return "bg-cyan-100 text-cyan-700";
    case "Limpieza":
      return "bg-green-100 text-green-700";
    case "Emergencia":
      return "bg-red-100 text-red-700";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
};

export const getVisibilidadBadge = (visibilidad: string) => {
  switch (visibilidad) {
    case "Excelente":
      return "bg-green-100 text-green-700";
    case "Buena":
      return "bg-blue-100 text-blue-700";
    case "Regular":
      return "bg-yellow-100 text-yellow-700";
    case "Mala":
      return "bg-red-100 text-red-700";
    default:
      return "bg-zinc-100 text-zinc-700";
  }
};

export interface Immersion {
  id: number;
  codigo: string;
  operacion: string;
  fecha: string;
  hora: string;
  buzo: string;
  asistente: string;
  profundidad: number;
  duracion: number;
  temperatura: number;
  visibilidad: string;
  estado: string;
  sitio: string;
  tipo: string;
}
