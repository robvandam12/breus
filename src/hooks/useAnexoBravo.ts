
import { useState, useEffect } from 'react';
import { useToast } from '@/components/ui/use-toast';

export interface AnexoBravoItem {
  id: string;
  codigo: string;
  operacion_id: string;
  operacion_nombre: string;
  fecha_creacion: string;
  fecha_verificacion: string;
  jefe_centro: string;
  supervisor: string;
  estado: 'borrador' | 'en_progreso' | 'aprobado' | 'completado' | 'rechazado';
  firmado: boolean;
  checklist_completo: boolean;
  progreso: number;
  checklist_items: Array<{
    id: string;
    item: string;
    verificado: boolean;
    observaciones?: string;
  }>;
  observaciones_generales: string;
  jefe_centro_firma?: string;
  supervisor_firma?: string;
  created_at: string;
  updated_at: string;
}

export interface AnexoBravoFormData {
  operacion_id: string;
  fecha_verificacion: string;
  checklist_items: Array<{
    id: string;
    item: string;
    verificado: boolean;
    observaciones?: string;
  }>;
  observaciones_generales: string;
  jefe_centro_firma?: string;
  supervisor_firma?: string;
}

export const useAnexoBravo = () => {
  const [anexosBravo, setAnexosBravo] = useState<AnexoBravoItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Mock data inicial - posteriormente se conectará con Supabase
  const mockAnexosBravo: AnexoBravoItem[] = [
    {
      id: '1',
      codigo: 'AB-2024-001',
      operacion_id: 'OP-001',
      operacion_nombre: 'Mantenimiento Jaulas Sitio Norte',
      fecha_creacion: '2024-01-14',
      fecha_verificacion: '2024-01-14',
      jefe_centro: 'Carlos Mendoza',
      supervisor: 'Diego Martínez',
      estado: 'aprobado',
      firmado: true,
      checklist_completo: true,
      progreso: 100,
      checklist_items: [],
      observaciones_generales: '',
      created_at: '2024-01-14T08:00:00Z',
      updated_at: '2024-01-14T09:30:00Z'
    },
    {
      id: '2',
      codigo: 'AB-2024-002',
      operacion_id: 'OP-002',
      operacion_nombre: 'Inspección Redes Centro Los Fiordos',
      fecha_creacion: '2024-01-17',
      fecha_verificacion: '2024-01-17',
      jefe_centro: 'Ana Morales',
      supervisor: 'Carlos Rojas',
      estado: 'en_progreso',
      firmado: false,
      checklist_completo: false,
      progreso: 75,
      checklist_items: [],
      observaciones_generales: '',
      created_at: '2024-01-17T10:00:00Z',
      updated_at: '2024-01-17T11:45:00Z'
    },
    {
      id: '3',
      codigo: 'AB-2024-003',
      operacion_id: 'OP-003',
      operacion_nombre: 'Limpieza Estructuras Piscicultura',
      fecha_creacion: '2024-01-09',
      fecha_verificacion: '2024-01-10',
      jefe_centro: 'Roberto Silva',
      supervisor: 'Ana López',
      estado: 'completado',
      firmado: true,
      checklist_completo: true,
      progreso: 100,
      checklist_items: [],
      observaciones_generales: '',
      created_at: '2024-01-09T07:00:00Z',
      updated_at: '2024-01-10T16:30:00Z'
    }
  ];

  useEffect(() => {
    loadAnexosBravo();
  }, []);

  const loadAnexosBravo = async () => {
    setLoading(true);
    try {
      // Simular llamada a API
      await new Promise(resolve => setTimeout(resolve, 500));
      setAnexosBravo(mockAnexosBravo);
      setError(null);
    } catch (err) {
      setError('Error al cargar los Anexos Bravo');
      toast({
        title: "Error",
        description: "No se pudieron cargar los Anexos Bravo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createAnexoBravo = async (data: AnexoBravoFormData) => {
    setLoading(true);
    try {
      // Simular creación en API
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newAnexo: AnexoBravoItem = {
        id: Date.now().toString(),
        codigo: `AB-2024-${String(anexosBravo.length + 1).padStart(3, '0')}`,
        operacion_id: data.operacion_id,
        operacion_nombre: 'Nueva Operación',
        fecha_creacion: new Date().toISOString().split('T')[0],
        fecha_verificacion: data.fecha_verificacion,
        jefe_centro: 'Usuario Actual',
        supervisor: 'Supervisor Asignado',
        estado: data.jefe_centro_firma && data.supervisor_firma ? 'aprobado' : 'borrador',
        firmado: !!(data.jefe_centro_firma && data.supervisor_firma),
        checklist_completo: data.checklist_items.every(item => item.verificado),
        progreso: (data.checklist_items.filter(item => item.verificado).length / data.checklist_items.length) * 100,
        checklist_items: data.checklist_items,
        observaciones_generales: data.observaciones_generales,
        jefe_centro_firma: data.jefe_centro_firma,
        supervisor_firma: data.supervisor_firma,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      setAnexosBravo(prev => [newAnexo, ...prev]);
      
      // Emitir evento para dashboard
      if (newAnexo.firmado) {
        console.log('ANEXO_BRAVO_DONE event triggered:', newAnexo);
        // Aquí se integraría con el sistema de webhooks
      }

      toast({
        title: "Anexo Bravo Creado",
        description: `${newAnexo.codigo} ha sido ${newAnexo.firmado ? 'completado' : 'guardado como borrador'}`,
      });

      return newAnexo;
    } catch (err) {
      setError('Error al crear el Anexo Bravo');
      toast({
        title: "Error",
        description: "No se pudo crear el Anexo Bravo",
        variant: "destructive",
      });
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateAnexoBravo = async (id: string, data: Partial<AnexoBravoFormData>) => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      setAnexosBravo(prev => prev.map(anexo => 
        anexo.id === id 
          ? { 
              ...anexo, 
              ...data,
              updated_at: new Date().toISOString(),
              progreso: data.checklist_items 
                ? (data.checklist_items.filter(item => item.verificado).length / data.checklist_items.length) * 100
                : anexo.progreso
            }
          : anexo
      ));

      toast({
        title: "Anexo Bravo Actualizado",
        description: "Los cambios han sido guardados",
      });
    } catch (err) {
      setError('Error al actualizar el Anexo Bravo');
      toast({
        title: "Error",
        description: "No se pudo actualizar el Anexo Bravo",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const deleteAnexoBravo = async (id: string) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 300));
      setAnexosBravo(prev => prev.filter(anexo => anexo.id !== id));
      
      toast({
        title: "Anexo Bravo Eliminado",
        description: "El documento ha sido eliminado",
      });
    } catch (err) {
      toast({
        title: "Error",
        description: "No se pudo eliminar el Anexo Bravo",
        variant: "destructive",
      });
    }
  };

  return {
    anexosBravo,
    loading,
    error,
    createAnexoBravo,
    updateAnexoBravo,
    deleteAnexoBravo,
    refreshAnexosBravo: loadAnexosBravo
  };
};
