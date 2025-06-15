
export const cumplimientoData = [
    { mes: "Ene", hpt: 85, anexo: 90, bitacoras: 75 },
    { mes: "Feb", hpt: 92, anexo: 88, bitacoras: 82 },
    { mes: "Mar", hpt: 88, anexo: 95, bitacoras: 90 },
    { mes: "Abr", hpt: 95, anexo: 92, bitacoras: 85 },
    { mes: "May", hpt: 90, anexo: 85, bitacoras: 88 }
];

export const inmersionesData = [
    { fecha: "01/05", inmersiones: 12 },
    { fecha: "02/05", inmersiones: 8 },
    { fecha: "03/05", inmersiones: 15 },
    { fecha: "04/05", inmersiones: 10 },
    { fecha: "05/05", inmersiones: 18 },
    { fecha: "06/05", inmersiones: 14 },
    { fecha: "07/05", inmersiones: 16 }
];

export const estadoFormulariosData = [
    { name: "Completados", value: 65 },
    { name: "Pendientes", value: 25 },
    { name: "Borradores", value: 10 }
];

export const permisosVencimiento = [
    { buzo: "Juan Pérez", matricula: "BUZ-12345", vencimiento: "2024-06-15", dias: 15, estado: "warning" },
    { buzo: "Pedro González", matricula: "BUZ-67890", vencimiento: "2024-07-02", dias: 32, estado: "safe" },
    { buzo: "Carlos López", matricula: "BUZ-54321", vencimiento: "2024-05-28", dias: 2, estado: "danger" },
    { buzo: "Ana Torres", matricula: "BUZ-98765", vencimiento: "2024-06-10", dias: 10, estado: "warning" }
];

export const getEstadoColor = (estado: string) => {
    switch (estado) {
        case "danger": return "bg-red-100 text-red-700 border-red-200";
        case "warning": return "bg-yellow-100 text-yellow-700 border-yellow-200";
        case "safe": return "bg-green-100 text-green-700 border-green-200";
        default: return "bg-gray-100 text-gray-700 border-gray-200";
    }
};

export const COLORS = ['#10B981', '#F59E0B', '#6B7280'];
