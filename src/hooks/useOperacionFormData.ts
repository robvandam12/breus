
import { useMemo } from 'react';
import { useOperaciones } from './useOperaciones';
import { useSalmoneras } from './useSalmoneras';
import { useContratistas } from './useContratistas';
import { useSitios } from './useSitios';
import { useEquiposBuceo } from './useEquiposBuceo';

export const useOperacionFormData = (operacionId: string) => {
  const { operaciones } = useOperaciones();
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  const { sitios } = useSitios();
  const { equipos } = useEquiposBuceo();

  const operacionData = useMemo(() => {
    if (!operacionId) return null;

    const operacion = operaciones.find(op => op.id === operacionId);
    if (!operacion) return null;

    const salmonera = salmoneras.find(s => s.id === operacion.salmonera_id);
    const contratista = contratistas.find(c => c.id === operacion.contratista_id);
    const sitio = sitios.find(s => s.id === operacion.sitio_id);
    const equipo = equipos.find(e => e.id === operacion.equipo_buceo_id);

    return {
      operacion,
      salmonera,
      contratista,
      sitio,
      equipo,
      // Datos pre-poblados para HPT
      hptDefaults: {
        operacion_id: operacion.id,
        plan_trabajo: operacion.tareas || '',
        fecha: operacion.fecha_inicio,
        empresa_servicio_nombre: contratista?.nombre || '',
        centro_trabajo_nombre: sitio?.nombre || '',
        lugar_especifico: sitio?.ubicacion || '',
        descripcion_tarea: operacion.tareas || '',
        supervisor_nombre: '', // Se debe asignar desde el equipo
        jefe_mandante_nombre: '', // Se debe asignar desde la salmonera
      },
      // Datos pre-poblados para Anexo Bravo
      anexoBravoDefaults: {
        operacion_id: operacion.id,
        fecha: operacion.fecha_inicio,
        lugar_faena: sitio?.nombre || '',
        empresa_nombre: contratista?.nombre || '',
        supervisor_servicio_nombre: '', // Se debe asignar desde el equipo
        supervisor_mandante_nombre: '', // Se debe asignar desde la salmonera
      }
    };
  }, [operacionId, operaciones, salmoneras, contratistas, sitios, equipos]);

  return operacionData;
};
