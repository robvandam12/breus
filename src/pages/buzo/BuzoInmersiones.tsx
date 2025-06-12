
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Anchor, Clock, Thermometer, Eye, Calendar, Search } from 'lucide-react';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useAuth } from '@/hooks/useAuth';
import { useState, useMemo } from 'react';

export default function BuzoInmersiones() {
  const { profile } = useAuth();
  const { inmersiones } = useInmersiones();
  const { operaciones } = useOperaciones();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('todas');
  const [dateFilter, setDateFilter] = useState('todas');

  // Filtrar inmersiones del buzo
  const buzoInmersiones = useMemo(() => {
    let filtered = inmersiones.filter(inm => 
      inm.buzo_principal === `${profile?.nombre} ${profile?.apellido}` ||
      inm.buzo_asistente === `${profile?.nombre} ${profile?.apellido}`
    );

    // Aplicar filtros
    if (searchTerm) {
      filtered = filtered.filter(inm => 
        inm.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inm.objetivo.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    if (statusFilter !== 'todas') {
      filtered = filtered.filter(inm => inm.estado === statusFilter);
    }

    if (dateFilter !== 'todas') {
      const now = new Date();
      const filterDate = new Date();
      
      switch (dateFilter) {
        case 'ultima_semana':
          filterDate.setDate(now.getDate() - 7);
          break;
        case 'ultimo_mes':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'ultimos_3_meses':
          filterDate.setMonth(now.getMonth() - 3);
          break;
      }
      
      filtered = filtered.filter(inm => new Date(inm.fecha_inmersion) >= filterDate);
    }

    return filtered.sort((a, b) => new Date(b.fecha_inmersion).getTime() - new Date(a.fecha_inmersion).getTime());
  }, [inmersiones, profile, searchTerm, statusFilter, dateFilter]);

  const getOperacionName = (operacionId: string) => {
    return operaciones.find(op => op.id === operacionId)?.nombre || 'Operación desconocida';
  };

  const getBuzoRole = (inmersion: any) => {
    if (inmersion.buzo_principal === `${profile?.nombre} ${profile?.apellido}`) {
      return 'Principal';
    }
    return 'Asistente';
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'completada':
        return <Badge variant="default" className="bg-green-600">Completada</Badge>;
      case 'en_progreso':
        return <Badge variant="default" className="bg-blue-600">En Progreso</Badge>;
      case 'planificada':
        return <Badge variant="outline">Planificada</Badge>;
      default:
        return <Badge variant="secondary">{estado}</Badge>;
    }
  };

  // Estadísticas
  const stats = {
    total: buzoInmersiones.length,
    completadas: buzoInmersiones.filter(inm => inm.estado === 'completada').length,
    enProgreso: buzoInmersiones.filter(inm => inm.estado === 'en_progreso').length,
    planificadas: buzoInmersiones.filter(inm => inm.estado === 'planificada').length,
    profundidadMaxima: Math.max(...buzoInmersiones.map(inm => inm.profundidad_max || 0), 0),
    tiempoTotal: buzoInmersiones.reduce((acc, inm) => {
      if (inm.hora_inicio && inm.hora_fin) {
        const inicio = new Date(`2000-01-01T${inm.hora_inicio}`);
        const fin = new Date(`2000-01-01T${inm.hora_fin}`);
        return acc + (fin.getTime() - inicio.getTime()) / (1000 * 60); // minutos
      }
      return acc;
    }, 0)
  };

  return (
    <MainLayout
      title="Mis Inmersiones"
      subtitle="Historial de inmersiones realizadas"
      icon={Anchor}
    >
      <div className="space-y-6">
        {/* Estadísticas */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-blue-600">{stats.total}</div>
              <p className="text-xs text-muted-foreground">Total Inmersiones</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-green-600">{stats.completadas}</div>
              <p className="text-xs text-muted-foreground">Completadas</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-orange-600">{stats.enProgreso}</div>
              <p className="text-xs text-muted-foreground">En Progreso</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-purple-600">{stats.profundidadMaxima}m</div>
              <p className="text-xs text-muted-foreground">Profundidad Máxima</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="pt-6">
              <div className="text-2xl font-bold text-teal-600">{Math.round(stats.tiempoTotal / 60)}h</div>
              <p className="text-xs text-muted-foreground">Tiempo Total</p>
            </CardContent>
          </Card>
        </div>

        {/* Filtros */}
        <Card>
          <CardHeader>
            <CardTitle>Filtros</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por código u objetivo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todos los estados</SelectItem>
                  <SelectItem value="completada">Completadas</SelectItem>
                  <SelectItem value="en_progreso">En Progreso</SelectItem>
                  <SelectItem value="planificada">Planificadas</SelectItem>
                </SelectContent>
              </Select>
              <Select value={dateFilter} onValueChange={setDateFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Período" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas las fechas</SelectItem>
                  <SelectItem value="ultima_semana">Última semana</SelectItem>
                  <SelectItem value="ultimo_mes">Último mes</SelectItem>
                  <SelectItem value="ultimos_3_meses">Últimos 3 meses</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Lista de Inmersiones */}
        <div className="grid gap-4">
          {buzoInmersiones.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <Anchor className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sin inmersiones registradas
                </h3>
                <p className="text-gray-600">
                  No se encontraron inmersiones con los filtros aplicados.
                </p>
              </CardContent>
            </Card>
          ) : (
            buzoInmersiones.map((inmersion) => (
              <Card key={inmersion.inmersion_id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{inmersion.codigo}</CardTitle>
                      <p className="text-sm text-gray-600">{getOperacionName(inmersion.operacion_id)}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2">
                      {getStatusBadge(inmersion.estado)}
                      <Badge variant="outline" className="text-xs">
                        {getBuzoRole(inmersion)}
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span>{new Date(inmersion.fecha_inmersion).toLocaleDateString()}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span>
                          {inmersion.hora_inicio} - {inmersion.hora_fin || 'En curso'}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Anchor className="w-4 h-4 text-gray-500" />
                        <span>Profundidad: {inmersion.profundidad_max}m</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm">
                        <Thermometer className="w-4 h-4 text-gray-500" />
                        <span>Temperatura: {inmersion.temperatura_agua}°C</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm">
                        <Eye className="w-4 h-4 text-gray-500" />
                        <span>Visibilidad: {inmersion.visibilidad}m</span>
                      </div>
                      <div className="text-sm">
                        <span className="font-medium">Supervisor:</span> {inmersion.supervisor}
                      </div>
                    </div>
                  </div>
                  {inmersion.objetivo && (
                    <div className="mt-4 pt-4 border-t">
                      <p className="text-sm">
                        <span className="font-medium">Objetivo:</span> {inmersion.objetivo}
                      </p>
                    </div>
                  )}
                  {inmersion.observaciones && (
                    <div className="mt-2">
                      <p className="text-sm text-gray-600">{inmersion.observaciones}</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </MainLayout>
  );
}
