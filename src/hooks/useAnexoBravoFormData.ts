
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

export interface AnexoBravoFormData {
  operacion_id: string;
  codigo: string;
  fecha: string;
  empresa_nombre: string;
  supervisor: string;
  jefe_centro: string;
  lugar_faena: string;
  
  // Datos específicos del anexo bravo
  buzo_o_empresa_nombre: string;
  buzo_matricula: string;
  asistente_buzo_nombre: string;
  asistente_buzo_matricula: string;
  supervisor_servicio_nombre: string;
  supervisor_mandante_nombre: string;
  jefe_centro_nombre: string;
  
  // Bitácora
  bitacora_fecha: string;
  bitacora_hora_inicio: string;
  bitacora_hora_termino: string;
  bitacora_relator: string;
  
  // Estado y validaciones
  autorizacion_armada: boolean;
  anexo_bravo_checklist: any;
  anexo_bravo_trabajadores: any[];
  anexo_bravo_firmas: any;
  
  observaciones_generales: string;
}

export const useAnexoBravoFormData = (operacionId?: string) => {
  const { profile } = useAuth();
  const [formData, setFormData] = useState<AnexoBravoFormData>({
    operacion_id: operacionId || '',
    codigo: '',
    fecha: new Date().toISOString().split('T')[0],
    empresa_nombre: '',
    supervisor: '',
    jefe_centro: '',
    lugar_faena: '',
    buzo_o_empresa_nombre: '',
    buzo_matricula: '',
    asistente_buzo_nombre: '',
    asistente_buzo_matricula: '',
    supervisor_servicio_nombre: '',
    supervisor_mandante_nombre: '',
    jefe_centro_nombre: '',
    bitacora_fecha: new Date().toISOString().split('T')[0],
    bitacora_hora_inicio: '',
    bitacora_hora_termino: '',
    bitacora_relator: '',
    autorizacion_armada: false,
    anexo_bravo_checklist: {},
    anexo_bravo_trabajadores: [],
    anexo_bravo_firmas: {},
    observaciones_generales: ''
  });

  useEffect(() => {
    const populateFormData = async () => {
      if (!operacionId) return;

      try {
        // Obtener datos de la operación
        const { data: operacion } = await supabase
          .from('operacion')
          .select(`
            *,
            sitios:sitio_id (nombre, ubicacion),
            contratistas:contratista_id (nombre),
            salmoneras:salmonera_id (nombre)
          `)
          .eq('id', operacionId)
          .single();

        if (!operacion) return;

        // Obtener equipo de buceo y miembros
        let miembros = [];
        
        if (operacion.equipo_buceo_id) {
          const { data: miembrosData } = await supabase
            .from('equipo_buceo_miembros')
            .select(`
              *,
              usuario:usuario_id (nombre, apellido, email, perfil_buzo)
            `)
            .eq('equipo_id', operacion.equipo_buceo_id);

          miembros = miembrosData || [];
        }

        // Generar código automático
        const codigo = `AB-${operacion.codigo}-${Date.now().toString().slice(-6)}`;

        // Buscar roles específicos
        const supervisor = miembros.find(m => m.rol_equipo === 'supervisor');
        const buzoPrincipal = miembros.find(m => m.rol_equipo === 'buzo_principal');
        const buzoAsistente = miembros.find(m => m.rol_equipo === 'buzo_asistente');

        const supervisorNombre = supervisor 
          ? `${supervisor.usuario?.nombre} ${supervisor.usuario?.apellido}`.trim()
          : profile?.nombre + ' ' + profile?.apellido || '';

        const buzoPrincipalNombre = buzoPrincipal
          ? `${buzoPrincipal.usuario?.nombre} ${buzoPrincipal.usuario?.apellido}`.trim()
          : '';

        const buzoAsistenteNombre = buzoAsistente
          ? `${buzoAsistente.usuario?.nombre} ${buzoAsistente.usuario?.apellido}`.trim()
          : '';

        // Crear lista de trabajadores basada en los miembros del equipo
        const trabajadores = miembros.map(miembro => ({
          nombre: `${miembro.usuario?.nombre} ${miembro.usuario?.apellido}`.trim(),
          rut: miembro.usuario?.perfil_buzo?.rut || '',
          rol: miembro.rol_equipo,
          empresa: operacion.contratistas?.nombre || ''
        }));

        setFormData(prev => ({
          ...prev,
          operacion_id: operacionId,
          codigo,
          empresa_nombre: operacion.contratistas?.nombre || '',
          supervisor: supervisorNombre,
          jefe_centro: '', // Esto vendría de la salmonera
          lugar_faena: operacion.sitios?.ubicacion || operacion.sitios?.nombre || '',
          buzo_o_empresa_nombre: buzoPrincipalNombre,
          buzo_matricula: buzoPrincipal?.usuario?.perfil_buzo?.numero_matricula || '',
          asistente_buzo_nombre: buzoAsistenteNombre,
          asistente_buzo_matricula: buzoAsistente?.usuario?.perfil_buzo?.numero_matricula || '',
          supervisor_servicio_nombre: supervisorNombre,
          supervisor_mandante_nombre: '',
          jefe_centro_nombre: '',
          bitacora_relator: supervisorNombre,
          anexo_bravo_trabajadores: trabajadores
        }));

      } catch (error) {
        console.error('Error populating Anexo Bravo form data:', error);
      }
    };

    populateFormData();
  }, [operacionId, profile]);

  const updateFormData = (updates: Partial<AnexoBravoFormData>) => {
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
