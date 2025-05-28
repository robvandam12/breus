
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface HPTFormData {
  // Información básica
  operacion_id: string;
  folio: string;
  fecha: string;
  hora_inicio: string;
  hora_termino: string;
  
  // Información de empresa y personal
  empresa_servicio_nombre: string;
  supervisor_nombre: string;
  centro_trabajo_nombre: string;
  jefe_mandante_nombre: string;
  
  // Descripción del trabajo
  descripcion_tarea: string;
  lugar_especifico: string;
  estado_puerto: string;
  es_rutinaria: boolean;
  
  // EPP
  hpt_epp: {
    casco: boolean;
    lentes: boolean;
    guantes: boolean;
    botas: boolean;
    chaleco: boolean;
    respirador: boolean;
    arnes: boolean;
    otros: string;
  };
  
  // ERC
  hpt_erc: {
    izaje: boolean;
    buceo: boolean;
    navegacion: boolean;
    trabajo_altura: boolean;
    espacios_confinados: boolean;
    energia_peligrosa: boolean;
    materiales_peligrosos: boolean;
    otros: string;
  };
  
  // Medidas clave
  hpt_medidas: {
    listas_chequeo_erc_disponibles: 'si' | 'no' | 'na';
    personal_competente_disponible: 'si' | 'no' | 'na';
    equipos_proteccion_disponibles: 'si' | 'no' | 'na';
    procedimientos_emergencia_conocidos: 'si' | 'no' | 'na';
    comunicacion_establecida: 'si' | 'no' | 'na';
    autorizaciones_vigentes: 'si' | 'no' | 'na';
  };
  
  // Riesgos complementarios
  hpt_riesgos_comp: {
    [key: string]: {
      valor: 'si' | 'no' | 'na';
      acciones: string;
    };
  };
  
  // Conocimiento y asistentes
  hpt_conocimiento: {
    plan_trabajo_conocido: boolean;
    riesgos_identificados: boolean;
    medidas_control_implementadas: boolean;
    comunicacion_efectiva: boolean;
  };
  
  hpt_conocimiento_asistentes: Array<{
    nombre: string;
    rut: string;
    empresa: string;
    firma_url: string;
  }>;
  
  // Firmas
  hpt_firmas: {
    supervisor_servicio_url: string;
    supervisor_mandante_url: string;
  };
}

export const useHPTFormData = (operacionId?: string) => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState<HPTFormData>({
    operacion_id: operacionId || '',
    folio: '',
    fecha: new Date().toISOString().split('T')[0],
    hora_inicio: '',
    hora_termino: '',
    empresa_servicio_nombre: '',
    supervisor_nombre: '',
    centro_trabajo_nombre: '',
    jefe_mandante_nombre: '',
    descripcion_tarea: '',
    lugar_especifico: '',
    estado_puerto: 'abierto',
    es_rutinaria: false,
    hpt_epp: {
      casco: false,
      lentes: false,
      guantes: false,
      botas: false,
      chaleco: false,
      respirador: false,
      arnes: false,
      otros: ''
    },
    hpt_erc: {
      izaje: false,
      buceo: false,
      navegacion: false,
      trabajo_altura: false,
      espacios_confinados: false,
      energia_peligrosa: false,
      materiales_peligrosos: false,
      otros: ''
    },
    hpt_medidas: {
      listas_chequeo_erc_disponibles: 'na',
      personal_competente_disponible: 'na',
      equipos_proteccion_disponibles: 'na',
      procedimientos_emergencia_conocidos: 'na',
      comunicacion_establecida: 'na',
      autorizaciones_vigentes: 'na'
    },
    hpt_riesgos_comp: {},
    hpt_conocimiento: {
      plan_trabajo_conocido: false,
      riesgos_identificados: false,
      medidas_control_implementadas: false,
      comunicacion_efectiva: false
    },
    hpt_conocimiento_asistentes: [],
    hpt_firmas: {
      supervisor_servicio_url: '',
      supervisor_mandante_url: ''
    }
  });

  // Poblar datos automáticamente cuando se tenga operacionId
  useEffect(() => {
    const populateFormData = async () => {
      if (!operacionId) return;

      try {
        // Obtener datos de la operación
        const { data: operacion } = await supabase
          .from('operacion')
          .select(`
            *,
            sitios:sitio_id (nombre),
            contratistas:contratista_id (nombre),
            salmoneras:salmonera_id (nombre)
          `)
          .eq('id', operacionId)
          .single();

        if (!operacion) return;

        // Obtener equipo de buceo y miembros
        let equipoData = null;
        let miembros = [];
        
        if (operacion.equipo_buceo_id) {
          const { data: equipo } = await supabase
            .from('equipos_buceo')
            .select('*')
            .eq('id', operacion.equipo_buceo_id)
            .single();

          if (equipo) {
            equipoData = equipo;
            
            const { data: miembrosData } = await supabase
              .from('equipo_buceo_miembros')
              .select(`
                *,
                usuario:usuario_id (nombre, apellido, email)
              `)
              .eq('equipo_id', operacion.equipo_buceo_id);

            miembros = miembrosData || [];
          }
        }

        // Generar folio automático
        const folio = `HPT-${operacion.codigo}-${Date.now().toString().slice(-6)}`;

        // Buscar supervisor del equipo
        const supervisor = miembros.find(m => m.rol_equipo === 'supervisor');
        const supervisorNombre = supervisor 
          ? `${supervisor.usuario?.nombre} ${supervisor.usuario?.apellido}`.trim()
          : profile?.nombre + ' ' + profile?.apellido || '';

        // Actualizar form data con información real
        setFormData(prev => ({
          ...prev,
          operacion_id: operacionId,
          folio,
          empresa_servicio_nombre: operacion.contratistas?.nombre || '',
          supervisor_nombre: supervisorNombre,
          centro_trabajo_nombre: operacion.sitios?.nombre || '',
          jefe_mandante_nombre: '', // Esto debería venir de la salmonera
          descripcion_tarea: operacion.tareas || '',
          lugar_especifico: operacion.sitios?.nombre || '',
        }));

      } catch (error) {
        console.error('Error populating HPT form data:', error);
      }
    };

    populateFormData();
  }, [operacionId, profile]);

  const updateFormData = (updates: Partial<HPTFormData>) => {
    setFormData(prev => ({
      ...prev,
      ...updates
    }));
  };

  return {
    formData,
    updateFormData,
    setFormData
  };
};
