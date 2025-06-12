
import { MainLayout } from '@/components/layout/MainLayout';
import { ImmersionCard } from '@/components/inmersiones/ImmersionCard';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInmersiones } from '@/hooks/useInmersiones';
import { Anchor, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function Inmersiones() {
  const { profile } = useAuth();
  const { inmersiones, loadingInmersiones } = useInmersiones();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Para buzos, filtrar inmersiones donde han participado
  const getFilteredInmersiones = () => {
    if (profile?.role !== 'buzo') return inmersiones;
    
    const buzoName = `${profile?.nombre} ${profile?.apellido}`;
    return inmersiones.filter(inmersion => 
      inmersion.buzo_principal === buzoName || inmersion.buzo_asistente === buzoName
    );
  };

  const filteredInmersiones = getFilteredInmersiones().filter(inmersion => {
    const matchesSearch = inmersion.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         inmersion.objetivo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || inmersion.estado === filterStatus;
    
    return matchesSearch && matchesStatus;
  });

  // Convertir inmersión al formato esperado por ImmersionCard si es necesario
  const convertToImmersionCardFormat = (inmersion: any) => {
    return {
      ...inmersion,
      id: inmersion.inmersion_id,
      operacion: inmersion.operacion_id,
      fecha: inmersion.fecha_inmersion,
      hora: inmersion.hora_inicio,
      buzo: inmersion.buzo_principal,
      profundidad: inmersion.profundidad_max,
      temperatura: inmersion.temperatura_agua,
      estado: inmersion.estado,
      observaciones: inmersion.observaciones || ''
    };
  };

  return (
    <MainLayout
      title="Inmersiones"
      subtitle={
        profile?.role === 'buzo' 
          ? "Historial de tus inmersiones"
          : "Gestión de inmersiones de buceo"
      }
      icon={Anchor}
    >
      <div className="space-y-6">
        {/* Filtros */}
        <div className="flex gap-4 flex-wrap">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Buscar por código u objetivo..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <Select value={filterStatus} onValueChange={setFilterStatus}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Estado" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              <SelectItem value="planificada">Planificada</SelectItem>
              <SelectItem value="en_progreso">En Progreso</SelectItem>
              <SelectItem value="completada">Completada</SelectItem>
              <SelectItem value="cancelada">Cancelada</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Lista de Inmersiones */}
        {loadingInmersiones ? (
          <div className="text-center py-8">Cargando inmersiones...</div>
        ) : filteredInmersiones.length === 0 ? (
          <div className="text-center py-8">
            <Anchor className="w-12 h-12 mx-auto text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {profile?.role === 'buzo' ? 'No tienes inmersiones' : 'No hay inmersiones'}
            </h3>
            <p className="text-gray-500 mb-4">
              {searchTerm || filterStatus !== 'all' 
                ? 'No se encontraron inmersiones con los filtros aplicados.'
                : profile?.role === 'buzo' 
                ? 'Aún no has participado en inmersiones.'
                : 'No hay inmersiones registradas en el sistema.'
              }
            </p>
          </div>
        ) : (
          <div className="grid gap-6">
            {filteredInmersiones.map((inmersion) => (
              <ImmersionCard
                key={inmersion.inmersion_id}
                inmersion={convertToImmersionCardFormat(inmersion)}
                showActions={profile?.role !== 'buzo'}
              />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
