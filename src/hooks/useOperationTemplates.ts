
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

export interface OperationTemplate {
  id: string;
  nombre: string;
  descripcion: string;
  tipo_trabajo: string;
  tareas_predefinidas: string[];
  duracion_estimada: number;
  personal_requerido: {
    supervisor: boolean;
    buzos: number;
    asistentes: number;
  };
  documentos_requeridos: {
    hpt: boolean;
    anexoBravo: boolean;
    multiX: boolean;
  };
  configuracion: any;
  usado_veces: number;
  created_at: string;
  user_id: string;
}

export const useOperationTemplates = () => {
  const queryClient = useQueryClient();

  const { data: templates = [], isLoading, error } = useQuery({
    queryKey: ['operation-templates'],
    queryFn: async () => {
      // Por ahora usamos templates predefinidos, pero esto se puede mover a Supabase
      const mockTemplates: OperationTemplate[] = [
        {
          id: '1',
          nombre: 'Inspección de Redes',
          descripcion: 'Template estándar para inspección y mantenimiento de redes de cultivo',
          tipo_trabajo: 'inspeccion',
          tareas_predefinidas: [
            'Inspección visual de estructura',
            'Verificación de tensiones',
            'Reporte de estado general'
          ],
          duracion_estimada: 4,
          personal_requerido: {
            supervisor: true,
            buzos: 2,
            asistentes: 1
          },
          documentos_requeridos: {
            hpt: true,
            anexoBravo: true,
            multiX: false
          },
          configuracion: {
            profundidad_maxima: 30,
            tipo_equipo: 'hookah',
            herramientas: ['cámara', 'medidor_tension']
          },
          usado_veces: 15,
          created_at: '2024-01-15',
          user_id: 'system'
        },
        {
          id: '2',
          nombre: 'Reparación Estructural',
          descripcion: 'Template para trabajos de reparación y soldadura submarina',
          tipo_trabajo: 'reparacion',
          tareas_predefinidas: [
            'Evaluación de daños',
            'Preparación de superficie',
            'Soldadura submarina',
            'Control de calidad'
          ],
          duracion_estimada: 8,
          personal_requerido: {
            supervisor: true,
            buzos: 3,
            asistentes: 2
          },
          documentos_requeridos: {
            hpt: true,
            anexoBravo: true,
            multiX: true
          },
          configuracion: {
            profundidad_maxima: 25,
            tipo_equipo: 'scuba',
            herramientas: ['soldadora', 'electrodos', 'amoladora']
          },
          usado_veces: 8,
          created_at: '2024-01-10',
          user_id: 'system'
        },
        {
          id: '3',
          nombre: 'Limpieza de Jaulas',
          descripcion: 'Template para operaciones rutinarias de limpieza',
          tipo_trabajo: 'limpieza',
          tareas_predefinidas: [
            'Limpieza de bioincrustaciones',
            'Inspección de mallas',
            'Reporte de estado'
          ],
          duracion_estimada: 6,
          personal_requerido: {
            supervisor: true,
            buzos: 2,
            asistentes: 1
          },
          documentos_requeridos: {
            hpt: true,
            anexoBravo: false,
            multiX: false
          },
          configuracion: {
            profundidad_maxima: 35,
            tipo_equipo: 'hookah',
            herramientas: ['cepillos', 'aspiradora']
          },
          usado_veces: 22,
          created_at: '2024-01-05',
          user_id: 'system'
        }
      ];

      return mockTemplates;
    },
  });

  const createFromTemplateMutation = useMutation({
    mutationFn: async ({ templateId, customData }: { templateId: string; customData?: Partial<any> }) => {
      const template = templates.find(t => t.id === templateId);
      if (!template) throw new Error('Template no encontrado');

      // Crear operación basada en template
      const operacionData = {
        nombre: customData?.nombre || `${template.nombre} - ${new Date().toLocaleDateString()}`,
        codigo: customData?.codigo || `${template.tipo_trabajo.toUpperCase()}-${Date.now().toString().slice(-6)}`,
        tareas: template.tareas_predefinidas.join('\n'),
        fecha_inicio: customData?.fecha_inicio || new Date().toISOString().split('T')[0],
        estado: 'activa' as const,
        ...customData
      };

      const { data, error } = await supabase
        .from('operacion')
        .insert([operacionData])
        .select()
        .single();

      if (error) throw error;

      // Incrementar contador de uso del template
      // En una implementación real, esto se haría en la base de datos
      console.log(`Template ${templateId} usado ${template.usado_veces + 1} veces`);

      return { operacion: data, template };
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['operaciones'] });
      toast({
        title: "Operación creada desde template",
        description: `"${data.operacion.nombre}" ha sido creada exitosamente.`,
      });
    },
    onError: (error) => {
      console.error('Error creating operation from template:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la operación desde el template.",
        variant: "destructive",
      });
    },
  });

  const createTemplateMutation = useMutation({
    mutationFn: async (templateData: Omit<OperationTemplate, 'id' | 'created_at' | 'usado_veces' | 'user_id'>) => {
      // Por ahora solo mostramos el toast, en una implementación real se guardaría en BD
      const newTemplate: OperationTemplate = {
        ...templateData,
        id: `template_${Date.now()}`,
        created_at: new Date().toISOString(),
        usado_veces: 0,
        user_id: 'current_user'
      };

      console.log('Creating new template:', newTemplate);
      return newTemplate;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['operation-templates'] });
      toast({
        title: "Template creado",
        description: "El nuevo template ha sido guardado exitosamente.",
      });
    },
    onError: (error) => {
      console.error('Error creating template:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el template.",
        variant: "destructive",
      });
    },
  });

  return {
    templates,
    isLoading,
    error,
    createFromTemplate: createFromTemplateMutation.mutateAsync,
    isCreatingFromTemplate: createFromTemplateMutation.isPending,
    createTemplate: createTemplateMutation.mutateAsync,
    isCreatingTemplate: createTemplateMutation.isPending,
  };
};
