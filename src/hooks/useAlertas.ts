
import { useState, useEffect } from 'react';
import { useBitacoras } from './useBitacoras';
import { useInmersiones } from './useInmersiones';
import { useOperaciones } from './useOperaciones';

export interface Alerta {
  id: string;
  tipo: 'bitacora_pendiente' | 'inmersion_sin_validar' | 'operacion_vencida' | 'hpt_pendiente';
  titulo: string;
  descripcion: string;
  prioridad: 'alta' | 'media' | 'baja';
  fecha_creacion: string;
  entidad_id?: string;
  entidad_codigo?: string;
  leida: boolean;
}

export const useAlertas = () => {
  const { bitacorasSupervisor, bitacorasBuzo } = useBitacoras();
  const { inmersiones } = useInmersiones();
  const { operaciones } = useOperaciones();
  
  const [alertas, setAlertas] = useState<Alerta[]>([]);

  useEffect(() => {
    const nuevasAlertas: Alerta[] = [];
    const now = new Date();
    const hoy = now.toISOString().split('T')[0];

    // Alertas por bitácoras pendientes de firma
    const bitacorasPendientes = [...bitacorasSupervisor, ...bitacorasBuzo].filter(b => !b.firmado);
    bitacorasPendientes.forEach(bitacora => {
      const diasPendiente = Math.floor((now.getTime() - new Date(bitacora.fecha).getTime()) / (1000 * 60 * 60 * 24));
      if (diasPendiente >= 2) {
        nuevasAlertas.push({
          id: `bitacora-${bitacora.codigo}`,
          tipo: 'bitacora_pendiente',
          titulo: 'Bitácora Pendiente de Firma',
          descripcion: `La bitácora ${bitacora.codigo} lleva ${diasPendiente} días sin firmar`,
          prioridad: diasPendiente >= 5 ? 'alta' : 'media',
          fecha_creacion: new Date().toISOString(),
          entidad_id: bitacora.codigo,
          entidad_codigo: bitacora.codigo,
          leida: false
        });
      }
    });

    // Alertas por inmersiones sin validar
    const inmersionesSinValidar = inmersiones.filter(i => 
      i.estado === 'completada' && (!i.hpt_validado || !i.anexo_bravo_validado)
    );
    inmersionesSinValidar.forEach(inmersion => {
      nuevasAlertas.push({
        id: `inmersion-${inmersion.codigo}`,
        tipo: 'inmersion_sin_validar',
        titulo: 'Inmersión Sin Validar',
        descripcion: `La inmersión ${inmersion.codigo} requiere validación de documentos`,
        prioridad: 'alta',
        fecha_creacion: new Date().toISOString(),
        entidad_id: inmersion.id,
        entidad_codigo: inmersion.codigo,
        leida: false
      });
    });

    // Alertas por operaciones que deberían haber terminado
    const operacionesVencidas = operaciones.filter(op => 
      op.estado === 'activa' && op.fecha_fin && op.fecha_fin < hoy
    );
    operacionesVencidas.forEach(operacion => {
      nuevasAlertas.push({
        id: `operacion-${operacion.codigo}`,
        tipo: 'operacion_vencida',
        titulo: 'Operación Vencida',
        descripcion: `La operación ${operacion.codigo} debería haber finalizado el ${operacion.fecha_fin}`,
        prioridad: 'alta',
        fecha_creacion: new Date().toISOString(),
        entidad_id: operacion.id,
        entidad_codigo: operacion.codigo,
        leida: false
      });
    });

    setAlertas(nuevasAlertas);
  }, [bitacorasSupervisor, bitacorasBuzo, inmersiones, operaciones]);

  const marcarComoLeida = (alertaId: string) => {
    setAlertas(prev => prev.map(alerta => 
      alerta.id === alertaId ? { ...alerta, leida: true } : alerta
    ));
  };

  const alertasNoLeidas = alertas.filter(a => !a.leida);
  const alertasPorPrioridad = {
    alta: alertas.filter(a => a.prioridad === 'alta'),
    media: alertas.filter(a => a.prioridad === 'media'),
    baja: alertas.filter(a => a.prioridad === 'baja')
  };

  return {
    alertas,
    alertasNoLeidas,
    alertasPorPrioridad,
    marcarComoLeida
  };
};
