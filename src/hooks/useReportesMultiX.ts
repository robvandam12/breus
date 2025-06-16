
import { useState, useCallback } from 'react';
import { useToast } from '@/hooks/use-toast';

interface MultiXReportFilters {
  dateRange: {
    from: string;
    to: string;
  };
  tipoFormulario?: 'mantencion' | 'faena';
  contratistaId?: string;
  sitioId?: string;
}

interface ContratistaPerformance {
  contratista_id: string;
  contratista_nombre: string;
  total_multix: number;
  formularios_completados: number;
  formularios_pendientes: number;
  tiempo_promedio_completion: number;
  eficiencia_porcentaje: number;
  dotacion_promedio: number;
  inmersiones_realizadas: number;
  tiempo_total_inmersiones: number;
  sitios_trabajados: string[];
}

interface BuzoPerformance {
  buzo_nombre: string;
  buzo_apellido: string;
  total_participaciones: number;
  roles_desempeniados: string[];
  inmersiones_totales: number;
  tiempo_total_buceo: number;
  profundidad_promedio: number;
  sitios_trabajados: number;
  contratistas_colaborados: string[];
  calificacion_promedio: number;
}

interface MultiXReportData {
  contratistas_performance: ContratistaPerformance[];
  buzos_performance: BuzoPerformance[];
  estadisticas_generales: {
    total_multix_periodo: number;
    formularios_mantencion: number;
    formularios_faena: number;
    contratistas_activos: number;
    buzos_activos: number;
    sitios_operativos: number;
    tiempo_promedio_formulario: number;
    eficiencia_general: number;
  };
  comparativas_mensuales: {
    mes: string;
    multix_completados: number;
    contratistas_activos: number;
    buzos_participantes: number;
    eficiencia: number;
  }[];
  top_contratistas: {
    nombre: string;
    formularios_completados: number;
    eficiencia: number;
    tiempo_promedio: number;
  }[];
  top_buzos: {
    nombre: string;
    participaciones: number;
    tiempo_total: number;
    calificacion: number;
  }[];
  alertas_operativas: {
    tipo: string;
    descripcion: string;
    contratista?: string;
    sitio?: string;
    prioridad: 'alta' | 'media' | 'baja';
  }[];
}

// Datos mock mejorados y más realistas
const getMockReportData = (): MultiXReportData => ({
  contratistas_performance: [
    {
      contratista_id: '1',
      contratista_nombre: 'AquaTech Diving',
      total_multix: 45,
      formularios_completados: 42,
      formularios_pendientes: 3,
      tiempo_promedio_completion: 2.5,
      eficiencia_porcentaje: 93.3,
      dotacion_promedio: 6.2,
      inmersiones_realizadas: 128,
      tiempo_total_inmersiones: 5760,
      sitios_trabajados: ['Sitio Alpha', 'Sitio Beta', 'Sitio Gamma']
    },
    {
      contratista_id: '2',
      contratista_nombre: 'Marine Services Ltd',
      total_multix: 38,
      formularios_completados: 35,
      formularios_pendientes: 3,
      tiempo_promedio_completion: 3.1,
      eficiencia_porcentaje: 92.1,
      dotacion_promedio: 5.8,
      inmersiones_realizadas: 102,
      tiempo_total_inmersiones: 4680,
      sitios_trabajados: ['Sitio Beta', 'Sitio Delta']
    },
    {
      contratista_id: '3',
      contratista_nombre: 'Deep Sea Solutions',
      total_multix: 32,
      formularios_completados: 28,
      formularios_pendientes: 4,
      tiempo_promedio_completion: 3.8,
      eficiencia_porcentaje: 87.5,
      dotacion_promedio: 7.1,
      inmersiones_realizadas: 89,
      tiempo_total_inmersiones: 4020,
      sitios_trabajados: ['Sitio Alpha', 'Sitio Gamma']
    },
    {
      contratista_id: '4',
      contratista_nombre: 'Oceanic Contractors',
      total_multix: 29,
      formularios_completados: 26,
      formularios_pendientes: 3,
      tiempo_promedio_completion: 2.8,
      eficiencia_porcentaje: 89.7,
      dotacion_promedio: 5.5,
      inmersiones_realizadas: 76,
      tiempo_total_inmersiones: 3420,
      sitios_trabajados: ['Sitio Delta', 'Sitio Echo']
    }
  ],
  buzos_performance: [
    {
      buzo_nombre: 'Carlos',
      buzo_apellido: 'Mendoza',
      total_participaciones: 28,
      roles_desempeniados: ['Supervisor', 'Buzo N°1'],
      inmersiones_totales: 45,
      tiempo_total_buceo: 2040,
      profundidad_promedio: 25.3,
      sitios_trabajados: 4,
      contratistas_colaborados: ['AquaTech Diving', 'Marine Services Ltd'],
      calificacion_promedio: 4.8
    },
    {
      buzo_nombre: 'Ana',
      buzo_apellido: 'Torres',
      total_participaciones: 25,
      roles_desempeniados: ['Buzo N°1', 'Buzo N°2'],
      inmersiones_totales: 38,
      tiempo_total_buceo: 1710,
      profundidad_promedio: 22.7,
      sitios_trabajados: 3,
      contratistas_colaborados: ['AquaTech Diving', 'Deep Sea Solutions'],
      calificacion_promedio: 4.6
    },
    {
      buzo_nombre: 'Miguel',
      buzo_apellido: 'Ramirez',
      total_participaciones: 22,
      roles_desempeniados: ['Buzo Emergencia 1', 'Supervisor'],
      inmersiones_totales: 33,
      tiempo_total_buceo: 1485,
      profundidad_promedio: 28.1,
      sitios_trabajados: 3,
      contratistas_colaborados: ['Marine Services Ltd', 'Deep Sea Solutions'],
      calificacion_promedio: 4.9
    },
    {
      buzo_nombre: 'Paula',
      buzo_apellido: 'Silva',
      total_participaciones: 20,
      roles_desempeniados: ['Buzo N°2', 'Comunicador'],
      inmersiones_totales: 30,
      tiempo_total_buceo: 1350,
      profundidad_promedio: 24.5,
      sitios_trabajados: 2,
      contratistas_colaborados: ['Oceanic Contractors'],
      calificacion_promedio: 4.7
    }
  ],
  estadisticas_generales: {
    total_multix_periodo: 144,
    formularios_mantencion: 85,
    formularios_faena: 59,
    contratistas_activos: 12,
    buzos_activos: 32,
    sitios_operativos: 8,
    tiempo_promedio_formulario: 2.9,
    eficiencia_general: 91.8
  },
  comparativas_mensuales: [
    { mes: 'Enero', multix_completados: 18, contratistas_activos: 6, buzos_participantes: 18, eficiencia: 89.5 },
    { mes: 'Febrero', multix_completados: 22, contratistas_activos: 7, buzos_participantes: 21, eficiencia: 91.2 },
    { mes: 'Marzo', multix_completados: 25, contratistas_activos: 8, buzos_participantes: 24, eficiencia: 93.1 },
    { mes: 'Abril', multix_completados: 28, contratistas_activos: 9, buzos_participantes: 26, eficiencia: 92.8 },
    { mes: 'Mayo', multix_completados: 31, contratistas_activos: 10, buzos_participantes: 28, eficiencia: 91.5 },
    { mes: 'Junio', multix_completados: 20, contratistas_activos: 8, buzos_participantes: 22, eficiencia: 90.2 }
  ],
  top_contratistas: [
    { nombre: 'AquaTech Diving', formularios_completados: 42, eficiencia: 93.3, tiempo_promedio: 2.5 },
    { nombre: 'Marine Services Ltd', formularios_completados: 35, eficiencia: 92.1, tiempo_promedio: 3.1 },
    { nombre: 'Oceanic Contractors', formularios_completados: 26, eficiencia: 89.7, tiempo_promedio: 2.8 },
    { nombre: 'Deep Sea Solutions', formularios_completados: 28, eficiencia: 87.5, tiempo_promedio: 3.8 }
  ],
  top_buzos: [
    { nombre: 'Carlos Mendoza', participaciones: 28, tiempo_total: 2040, calificacion: 4.8 },
    { nombre: 'Ana Torres', participaciones: 25, tiempo_total: 1710, calificacion: 4.6 },
    { nombre: 'Miguel Ramirez', participaciones: 22, tiempo_total: 1485, calificacion: 4.9 },
    { nombre: 'Paula Silva', participaciones: 20, tiempo_total: 1350, calificacion: 4.7 }
  ],
  alertas_operativas: [
    {
      tipo: 'Eficiencia Baja',
      descripcion: 'Contratista Deep Sea Solutions por debajo del 90% de eficiencia',
      contratista: 'Deep Sea Solutions',
      prioridad: 'media'
    },
    {
      tipo: 'Dotación Reducida',
      descripcion: 'Sitio Delta con dotación por debajo del promedio',
      sitio: 'Sitio Delta',
      prioridad: 'alta'
    },
    {
      tipo: 'Tiempo Excesivo',
      descripcion: 'Formularios de mantención tardando más de 4 horas promedio',
      prioridad: 'baja'
    },
    {
      tipo: 'Capacitación Pendiente',
      descripcion: 'Varios buzos con certificaciones próximas a vencer',
      prioridad: 'media'
    }
  ]
});

export const useReportesMultiX = (filters: MultiXReportFilters) => {
  const [reportData, setReportData] = useState<MultiXReportData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const generateMultiXReport = useCallback(async () => {
    if (isLoading) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      const mockData = getMockReportData();
      setReportData(mockData);
      setError(null);
      console.log('MultiX Report generated successfully with mock data');
    } catch (err) {
      console.error('Error generating MultiX report:', err);
      setError('Error al generar el reporte MultiX');
      setReportData(null);
      toast({
        title: "Error",
        description: "No se pudo generar el reporte MultiX",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  }, [isLoading, toast]);

  const exportReport = async (format: 'pdf' | 'excel') => {
    try {
      toast({
        title: "Exportando Reporte MultiX",
        description: `Generando archivo ${format.toUpperCase()}...`,
      });
      
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Reporte Exportado",
        description: `El archivo ${format.toUpperCase()} se ha descargado exitosamente`,
      });
    } catch (err) {
      console.error('Error exporting report:', err);
      toast({
        title: "Error",
        description: "No se pudo exportar el reporte",
        variant: "destructive",
      });
    }
  };

  return {
    reportData,
    isLoading,
    error,
    generateMultiXReport,
    exportReport
  };
};
