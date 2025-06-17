
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface OperationTemplate {
  id: string;
  nombre: string;
  descripcion: string;
  tipo: string;
  duracion_estimada: number;
  personal_requerido: {
    supervisor: boolean;
    buzos: number;
    apoyo_superficie: number;
  };
  documentos_requeridos: {
    hpt: boolean;
    anexo_bravo: boolean;
    multix: boolean;
  };
  equipos_requeridos: string[];
  tareas_predefinidas: string[];
  created_at?: string;
  updated_at?: string;
}

export const useOperationTemplates = () => {
  const [templates, setTemplates] = useState<OperationTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Templates predefinidos por ahora
  const defaultTemplates: OperationTemplate[] = [
    {
      id: 'template-1',
      nombre: 'Inspección Rutinaria de Redes',
      descripcion: 'Inspección visual y técnica de sistemas de contención',
      tipo: 'inspeccion',
      duracion_estimada: 4,
      personal_requerido: {
        supervisor: true,
        buzos: 2,
        apoyo_superficie: 1
      },
      documentos_requeridos: {
        hpt: true,
        anexo_bravo: true,
        multix: false
      },
      equipos_requeridos: ['Equipo Buceo Básico', 'Cámara Submarina', 'Embarcación'],
      tareas_predefinidas: [
        'Inspección visual de redes',
        'Verificación de anclajes',
        'Documentación fotográfica',
        'Reporte de estado'
      ]
    },
    {
      id: 'template-2',
      nombre: 'Reparación de Estructuras',
      descripcion: 'Reparación y mantenimiento de estructuras sumergidas',
      tipo: 'reparacion',
      duracion_estimada: 8,
      personal_requerido: {
        supervisor: true,
        buzos: 3,
        apoyo_superficie: 2
      },
      documentos_requeridos: {
        hpt: true,
        anexo_bravo: true,
        multix: true
      },
      equipos_requeridos: ['Equipo Buceo Avanzado', 'Herramientas Submarinas', 'Soldadura Submarina'],
      tareas_predefinidas: [
        'Evaluación de daños',
        'Reparación estructural',
        'Soldadura submarina',
        'Pruebas de integridad'
      ]
    },
    {
      id: 'template-3',
      nombre: 'Limpieza de Biofouling',
      descripcion: 'Limpieza y mantenimiento preventivo de estructuras',
      tipo: 'limpieza',
      duracion_estimada: 6,
      personal_requerido: {
        supervisor: true,
        buzos: 2,
        apoyo_superficie: 1
      },
      documentos_requeridos: {
        hpt: true,
        anexo_bravo: true,
        multix: false
      },
      equipos_requeridos: ['Equipo Buceo Básico', 'Herramientas de Limpieza', 'Sistema de Aspiración'],
      tareas_predefinidas: [
        'Evaluación de incrustaciones',
        'Limpieza mecánica',
        'Aplicación de tratamientos',
        'Verificación final'
      ]
    }
  ];

  useEffect(() => {
    loadTemplates();
  }, []);

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      // Por ahora usamos templates locales, pero esto podría conectarse a la base de datos
      setTemplates(defaultTemplates);
    } catch (error) {
      console.error('Error loading templates:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los templates",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const createTemplate = async (templateData: Omit<OperationTemplate, 'id'>) => {
    try {
      const newTemplate: OperationTemplate = {
        ...templateData,
        id: `template-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setTemplates(prev => [...prev, newTemplate]);
      return newTemplate;
    } catch (error) {
      console.error('Error creating template:', error);
      throw error;
    }
  };

  const updateTemplate = async (templateId: string, templateData: Partial<OperationTemplate>) => {
    try {
      setTemplates(prev => 
        prev.map(template => 
          template.id === templateId 
            ? { ...template, ...templateData, updated_at: new Date().toISOString() }
            : template
        )
      );
    } catch (error) {
      console.error('Error updating template:', error);
      throw error;
    }
  };

  const deleteTemplate = async (templateId: string) => {
    try {
      setTemplates(prev => prev.filter(template => template.id !== templateId));
    } catch (error) {
      console.error('Error deleting template:', error);
      throw error;
    }
  };

  const createOperationFromTemplate = async (template: OperationTemplate, operacionData: any) => {
    try {
      const enrichedData = {
        ...operacionData,
        tareas: template.tareas_predefinidas.join('\n'),
        // Auto-asignar campos basados en el template
        duracion_estimada: template.duracion_estimada,
        tipo_operacion: template.tipo
      };

      // Aquí se llamaría al hook de operaciones para crear la operación real
      return enrichedData;
    } catch (error) {
      console.error('Error creating operation from template:', error);
      throw error;
    }
  };

  return {
    templates,
    isLoading,
    createTemplate,
    updateTemplate,
    deleteTemplate,
    createOperationFromTemplate,
    loadTemplates
  };
};
