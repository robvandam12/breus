
import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { MultiXFormData, MultiXRecord, DotacionMember, EquipoSuperficie } from "@/types/multix";

export const useMultiX = () => {
  const queryClient = useQueryClient();

  const { data: multiXRecords = [], isLoading } = useQuery({
    queryKey: ['multix'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('multix')
        .select(`
          *,
          dotacion:multix_dotacion(*),
          equipos_superficie:multix_equipos_superficie(*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data as MultiXRecord[];
    }
  });

  const createMultiX = useMutation({
    mutationFn: async (formData: { 
      codigo: string; 
      tipo_formulario: 'mantencion' | 'faena'; 
      operacion_id?: string; 
      fecha: string; 
    }) => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Usuario no autenticado');

      const { data, error } = await supabase
        .from('multix')
        .insert({
          codigo: formData.codigo,
          tipo_formulario: formData.tipo_formulario,
          operacion_id: formData.operacion_id,
          fecha: formData.fecha,
          user_id: user.id,
          progreso: 0
        })
        .select()
        .single();

      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multix'] });
      toast({
        title: "MultiX creado",
        description: "El formulario MultiX ha sido creado exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `No se pudo crear el formulario MultiX: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  const updateMultiX = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<MultiXRecord> }) => {
      const { data: result, error } = await supabase
        .from('multix')
        .update(data)
        .eq('id', id)
        .select()
        .single();

      if (error) throw error;
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multix'] });
    }
  });

  const deleteMultiX = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('multix')
        .delete()
        .eq('id', id);

      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multix'] });
      toast({
        title: "MultiX eliminado",
        description: "El formulario ha sido eliminado exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: `No se pudo eliminar el formulario: ${error.message}`,
        variant: "destructive",
      });
    }
  });

  return {
    multiXRecords,
    isLoading,
    createMultiX,
    updateMultiX,
    deleteMultiX
  };
};

export const useMultiXWizard = (multiXId?: string, tipo: 'mantencion' | 'faena' = 'mantencion') => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<MultiXFormData>({
    lugar_trabajo: '',
    fecha: new Date().toISOString().split('T')[0],
    dotacion: [],
    equipos_superficie: []
  });
  
  const queryClient = useQueryClient();

  // Cargar datos existentes si hay un ID
  const { data: multiXRecord, isLoading } = useQuery({
    queryKey: ['multix', multiXId],
    queryFn: async () => {
      if (!multiXId) return null;
      
      const { data, error } = await supabase
        .from('multix')
        .select(`
          *,
          dotacion:multix_dotacion(*),
          equipos_superficie:multix_equipos_superficie(*)
        `)
        .eq('id', multiXId)
        .single();

      if (error) throw error;
      return data as MultiXRecord;
    },
    enabled: !!multiXId
  });

  // Cargar datos del formulario cuando se obtiene el registro
  useEffect(() => {
    if (multiXRecord) {
      setFormData({
        lugar_trabajo: multiXRecord.lugar_trabajo || '',
        fecha: multiXRecord.fecha,
        temperatura: multiXRecord.temperatura,
        hora_inicio: multiXRecord.hora_inicio || '',
        hora_termino: multiXRecord.hora_termino || '',
        profundidad_max: multiXRecord.profundidad_max,
        nave_maniobras: multiXRecord.nave_maniobras || '',
        team_s: multiXRecord.team_s || '',
        team_be: multiXRecord.team_be || '',
        team_bi: multiXRecord.team_bi || '',
        matricula_nave: multiXRecord.matricula_nave || '',
        estado_puerto: multiXRecord.estado_puerto || '',
        dotacion: multiXRecord.dotacion || [],
        equipos_superficie: multiXRecord.equipos_superficie || [],
        multix_data: multiXRecord.multix_data || {}
      });
    }
  }, [multiXRecord]);

  const updateFormData = (updates: Partial<MultiXFormData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Auto-guardar los datos
  const saveMultiX = useMutation({
    mutationFn: async () => {
      if (!multiXId) throw new Error('No hay ID de MultiX para guardar');

      // Actualizar registro principal
      const { error: mainError } = await supabase
        .from('multix')
        .update({
          lugar_trabajo: formData.lugar_trabajo,
          fecha: formData.fecha,
          temperatura: formData.temperatura,
          hora_inicio: formData.hora_inicio || null,
          hora_termino: formData.hora_termino || null,
          profundidad_max: formData.profundidad_max,
          nave_maniobras: formData.nave_maniobras,
          team_s: formData.team_s,
          team_be: formData.team_be,
          team_bi: formData.team_bi,
          matricula_nave: formData.matricula_nave,
          estado_puerto: formData.estado_puerto,
          multix_data: formData.multix_data || {},
          progreso: Math.round((currentStep / getTotalSteps()) * 100)
        })
        .eq('id', multiXId);

      if (mainError) throw mainError;

      // Actualizar dotación
      if (formData.dotacion.length > 0) {
        // Primero eliminar registros existentes
        await supabase
          .from('multix_dotacion')
          .delete()
          .eq('multix_id', multiXId);

        // Insertar nuevos registros
        const dotacionData = formData.dotacion.map((member, index) => ({
          multix_id: multiXId,
          rol: member.rol,
          nombre: member.nombre,
          apellido: member.apellido,
          matricula: member.matricula,
          contratista: member.contratista || false,
          equipo: member.equipo,
          hora_inicio_buzo: member.hora_inicio_buzo || null,
          hora_fin_buzo: member.hora_fin_buzo || null,
          profundidad: member.profundidad,
          orden: index
        }));

        const { error: dotacionError } = await supabase
          .from('multix_dotacion')
          .insert(dotacionData);

        if (dotacionError) throw dotacionError;
      }

      // Actualizar equipos de superficie
      if (formData.equipos_superficie.length > 0) {
        // Primero eliminar registros existentes
        await supabase
          .from('multix_equipos_superficie')
          .delete()
          .eq('multix_id', multiXId);

        // Insertar nuevos registros
        const equiposData = formData.equipos_superficie.map((equipo, index) => ({
          multix_id: multiXId,
          equipo_sup: equipo.equipo_sup,
          matricula_eq: equipo.matricula_eq,
          horometro_ini: equipo.horometro_ini,
          horometro_fin: equipo.horometro_fin,
          orden: index
        }));

        const { error: equiposError } = await supabase
          .from('multix_equipos_superficie')
          .insert(equiposData);

        if (equiposError) throw equiposError;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['multix', multiXId] });
    }
  });

  const getTotalSteps = () => {
    return tipo === 'mantencion' ? 8 : 9; // Más pasos para faena
  };

  const nextStep = () => {
    if (currentStep < getTotalSteps()) {
      setCurrentStep(prev => prev + 1);
      if (multiXId) {
        saveMultiX.mutate();
      }
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= getTotalSteps()) {
      setCurrentStep(step);
    }
  };

  return {
    formData,
    updateFormData,
    currentStep,
    setCurrentStep,
    nextStep,
    prevStep,
    goToStep,
    getTotalSteps,
    saveMultiX,
    multiXRecord,
    isLoading,
    tipo
  };
};
