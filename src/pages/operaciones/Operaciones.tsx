
import { MainLayout } from '@/components/layout/MainLayout';
import { OperacionCardView } from '@/components/operaciones/OperacionCardView';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useInmersiones } from '@/hooks/useInmersiones';
import { Calendar } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useState } from 'react';

export default function Operaciones() {
  const { profile } = useAuth();
  const { operaciones, isLoading } = useOperaciones();
  const { inmersiones } = useInmersiones();

  // Para buzos, filtrar operaciones donde han participado
  const getFilteredOperaciones = () => {
    if (profile?.role !== 'buzo') return operaciones;
    
    const buzoName = `${profile?.nombre} ${profile?.apellido}`;
    return operaciones.filter(operacion => {
      // Verificar si el buzo ha participado en alguna inmersión de esta operación
      return inmersiones.some(inmersion => 
        inmersion.operacion_id === operacion.id &&
        (inmersion.buzo_principal === buzoName || inmersion.buzo_asistente === buzoName)
      );
    });
  };

  const filteredOperaciones = getFilteredOperaciones();

  const handleSelect = (operacion: any) => {
    console.log('Operación seleccionada:', operacion);
  };

  const handleEdit = (operacion: any) => {
    console.log('Editar operación:', operacion);
  };

  const handleViewDetail = (operacion: any) => {
    console.log('Ver detalle operación:', operacion);
  };

  const handleDelete = (operacionId: string) => {
    console.log('Eliminar operación:', operacionId);
  };

  if (isLoading) {
    return (
      <MainLayout
        title="Operaciones"
        subtitle={
          profile?.role === 'buzo' 
            ? "Historial de operaciones donde has participado"
            : "Gestión de operaciones de buceo"
        }
        icon={Calendar}
      >
        <div className="text-center py-8">Cargando operaciones...</div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Operaciones"
      subtitle={
        profile?.role === 'buzo' 
          ? "Historial de operaciones donde has participado"
          : "Gestión de operaciones de buceo"
      }
      icon={Calendar}
    >
      <OperacionCardView 
        operaciones={filteredOperaciones}
        onSelect={handleSelect}
        onEdit={handleEdit}
        onViewDetail={handleViewDetail}
        onDelete={handleDelete}
      />
    </MainLayout>
  );
}
