
// Export centralizado de todos los datos mockup
export { operacionCompletaMockup, operacion, equipoBuceo, hpt, anexoBravo, inmersiones, bitacorasSupervisor, bitacorasBuzo } from './operacion-completa';
export { usuariosMockup } from './usuarios-mockup';
export { empresasMockup } from './empresas-mockup';

// Función helper para obtener todos los datos relacionados a una operación
export const getOperacionCompleta = () => {
  return {
    ...operacionCompletaMockup,
    usuarios: usuariosMockup,
    empresas: empresasMockup
  };
};

// Función helper para imprimir resumen de la operación
export const getOperacionSummary = () => {
  const data = getOperacionCompleta();
  
  return {
    operacion: {
      codigo: data.operacion.codigo,
      nombre: data.operacion.nombre,
      estado: data.operacion.estado,
      fechas: `${data.operacion.fecha_inicio} - ${data.operacion.fecha_fin}`
    },
    equipo: {
      supervisor: data.equipoBuceo.miembros.find(m => m.rol_equipo === 'supervisor')?.usuario?.nombre + ' ' + 
                 data.equipoBuceo.miembros.find(m => m.rol_equipo === 'supervisor')?.usuario?.apellido,
      buzos: data.equipoBuceo.miembros.filter(m => m.rol_equipo.includes('buzo')).length,
      miembros_total: data.equipoBuceo.miembros.length
    },
    documentos: {
      hpt: {
        codigo: data.hpt.codigo,
        firmado: data.hpt.firmado,
        estado: data.hpt.estado
      },
      anexo_bravo: {
        codigo: data.anexoBravo.codigo,
        firmado: data.anexoBravo.firmado,
        estado: data.anexoBravo.estado
      }
    },
    inmersiones: {
      total: data.inmersiones.length,
      completadas: data.inmersiones.filter(i => i.estado === 'completada').length,
      fecha_primera: data.inmersiones[0]?.fecha_inmersion,
      fecha_ultima: data.inmersiones[data.inmersiones.length - 1]?.fecha_inmersion
    },
    bitacoras: {
      supervisor: data.bitacorasSupervisor.length,
      buzo: data.bitacorasBuzo.length,
      total_firmadas: [...data.bitacorasSupervisor, ...data.bitacorasBuzo].filter(b => b.firmado).length
    }
  };
};
