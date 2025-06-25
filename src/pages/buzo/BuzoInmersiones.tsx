
import { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Anchor, Calendar, MapPin, Eye, Search, Filter } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useInmersionesFilters } from '@/hooks/useInmersionesFilters';
import type { BuzoInmersion } from '@/types/inmersion';

export default function BuzoInmersiones() {
  const { profile } = useAuth();
  const { inmersiones: inmersionesCompletas, isLoading: loadingInmersiones } = useInmersiones();

  const buzoInmersiones = useMemo((): BuzoInmersion[] => {
    if (!profile || !inmersionesCompletas) return [];

    const buzoName = `${profile.nombre} ${profile.apellido}`;
    return inmersionesCompletas
      .filter(i => i.buzo_principal === buzoName || i.buzo_asistente === buzoName)
      .map(inmersion => {
        const rol: 'Principal' | 'Asistente' = inmersion.buzo_principal === buzoName ? 'Principal' : 'Asistente';
        return {
          ...inmersion,
          operacionNombre: inmersion.operacion?.nombre || 'N/A',
          salmoneraNombre: inmersion.operacion?.salmoneras?.nombre || 'N/A',
          sitioNombre: inmersion.operacion?.sitios?.nombre || 'N/A',
          rol,
        };
      })
      .sort((a, b) => new Date(b.fecha_inmersion).getTime() - new Date(a.fecha_inmersion).getTime());
  }, [profile, inmersionesCompletas]);

  const {
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    filterMes,
    setFilterMes,
    filteredInmersiones,
  } = useInmersionesFilters(buzoInmersiones);

  const getEstadoColor = (estado: string) => {
    switch (estado) {
      case 'completada': return 'bg-green-100 text-green-800';
      case 'en_curso': return 'bg-blue-100 text-blue-800';
      case 'planificada': return 'bg-yellow-100 text-yellow-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRolColor = (rol: string) => {
    return rol === 'Principal' ? 'bg-blue-100 text-blue-800' : 'bg-purple-100 text-purple-800';
  };

  const meses = [
    { value: '0', label: 'Enero' },
    { value: '1', label: 'Febrero' },
    { value: '2', label: 'Marzo' },
    { value: '3', label: 'Abril' },
    { value: '4', label: 'Mayo' },
    { value: '5', label: 'Junio' },
    { value: '6', label: 'Julio' },
    { value: '7', label: 'Agosto' },
    { value: '8', label: 'Septiembre' },
    { value: '9', label: 'Octubre' },
    { value: '10', label: 'Noviembre' },
    { value: '11', label: 'Diciembre' }
  ];

  if (loadingInmersiones) {
    return (
       <MainLayout
        title="Mis Inmersiones"
        subtitle="Historial de todas tus inmersiones realizadas"
        icon={Anchor}
      >
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Cargando tus inmersiones...</p>
        </div>
      </MainLayout>
    )
  }

  return (
    <MainLayout
      title="Mis Inmersiones"
      subtitle="Historial de todas tus inmersiones realizadas"
      icon={Anchor}
    >
      <div className="space-y-6">
        {/* Filtros mejorados */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros
              <Badge variant="secondary" className="ml-auto">
                {filteredInmersiones.length} de {buzoInmersiones.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por código, objetivo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={filterEstado} onValueChange={setFilterEstado}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los estados</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="en_curso">En curso</SelectItem>
                  <SelectItem value="planificada">Planificada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>

              <Select value={filterMes} onValueChange={setFilterMes}>
                <SelectTrigger>
                  <SelectValue placeholder="Filtrar por mes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los meses</SelectItem>
                  {meses.map(mes => (
                    <SelectItem key={mes.value} value={mes.value}>
                      {mes.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <div className="flex items-center text-sm text-gray-600">
                Total: {filteredInmersiones.length} inmersiones
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lista de inmersiones optimizada */}
        {filteredInmersiones.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <Anchor className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {buzoInmersiones.length === 0 ? 'Sin inmersiones registradas' : 'No se encontraron inmersiones'}
              </h3>
              <p className="text-gray-500">
                {buzoInmersiones.length === 0 
                  ? 'Cuando realices inmersiones, aparecerán aquí.'
                  : 'Intenta ajustar los filtros para ver más resultados.'
                }
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid gap-4">
            {filteredInmersiones.map((inmersion) => (
              <Card key={inmersion.inmersion_id} className="hover:shadow-md transition-shadow">
                <CardContent className="py-4">
                  <div className="flex items-start justify-between">
                    <div className="space-y-2 flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="font-semibold text-lg">{inmersion.codigo}</h3>
                        <Badge className={getEstadoColor(inmersion.estado)}>
                          {inmersion.estado}
                        </Badge>
                        <Badge className={getRolColor(inmersion.rol)}>
                          {inmersion.rol}
                        </Badge>
                      </div>
                      
                      <p className="text-gray-600">{inmersion.objetivo}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <Calendar className="w-4 h-4" />
                          {new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}
                        </div>
                        <div className="flex items-center gap-1">
                          <MapPin className="w-4 h-4" />
                          {inmersion.sitioNombre}
                        </div>
                        <div>
                          Profundidad: {inmersion.profundidad_max}m
                        </div>
                        <div>
                          Temperatura: {inmersion.temperatura_agua}°C
                        </div>
                      </div>
                    </div>
                    
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4 mr-2" />
                          Detalles
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>{inmersion.codigo}</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Estado</label>
                              <Badge className={getEstadoColor(inmersion.estado)}>
                                {inmersion.estado}
                              </Badge>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Mi Rol</label>
                              <Badge className={getRolColor(inmersion.rol)}>
                                {inmersion.rol}
                              </Badge>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Fecha</label>
                              <p className="text-sm text-gray-600">
                                {new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}
                              </p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Horario</label>
                              <p className="text-sm text-gray-600">
                                {inmersion.hora_inicio} - {inmersion.hora_fin || 'En curso'}
                              </p>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium">Objetivo</label>
                            <p className="text-sm text-gray-600 mt-1">{inmersion.objetivo}</p>
                          </div>

                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium">Operación</label>
                              <p className="text-sm text-gray-600">{inmersion.operacionNombre}</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Salmonera</label>
                              <p className="text-sm text-gray-600">{inmersion.salmoneraNombre}</p>
                            </div>
                          </div>

                          <div className="grid grid-cols-3 gap-4">
                            <div>
                              <label className="text-sm font-medium">Profundidad Máxima</label>
                              <p className="text-sm text-gray-600">{inmersion.profundidad_max}m</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Temperatura Agua</label>
                              <p className="text-sm text-gray-600">{inmersion.temperatura_agua}°C</p>
                            </div>
                            <div>
                              <label className="text-sm font-medium">Visibilidad</label>
                              <p className="text-sm text-gray-600">{inmersion.visibilidad}m</p>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium">Supervisor</label>
                            <p className="text-sm text-gray-600">{inmersion.supervisor}</p>
                          </div>

                          {inmersion.buzo_asistente && inmersion.rol === 'Principal' && (
                            <div>
                              <label className="text-sm font-medium">Buzo Asistente</label>
                              <p className="text-sm text-gray-600">{inmersion.buzo_asistente}</p>
                            </div>
                          )}

                          {inmersion.buzo_principal && inmersion.rol === 'Asistente' && (
                            <div>
                              <label className="text-sm font-medium">Buzo Principal</label>
                              <p className="text-sm text-gray-600">{inmersion.buzo_principal}</p>
                            </div>
                          )}

                          {inmersion.observaciones && (
                            <div>
                              <label className="text-sm font-medium">Observaciones</label>
                              <p className="text-sm text-gray-600 mt-1">{inmersion.observaciones}</p>
                            </div>
                          )}
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
