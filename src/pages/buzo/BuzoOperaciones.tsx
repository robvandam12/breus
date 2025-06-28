
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar, MapPin, Users, Search, Building } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOperacionesQuery } from '@/hooks/useOperacionesQuery';
import { PageLoadingSkeleton } from '@/components/layout/PageLoadingSkeleton';
import { EmptyState } from '@/components/layout/EmptyState';

export default function BuzoOperaciones() {
  const { profile: user } = useAuth();
  const { data: operacionesData, isLoading } = useOperacionesQuery();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('all');

  const operaciones = operacionesData || [];

  // Filtrar operaciones relevantes para el buzo
  const operacionesForBuzo = operaciones.filter(operacion => {
    // Mostrar operaciones donde el buzo esté asignado o sea relevante
    // Por ahora mostramos todas las operaciones activas
    return operacion.estado === 'activa';
  });

  const filteredOperaciones = operacionesForBuzo.filter(operacion => {
    const searchStr = `${operacion.codigo} ${operacion.nombre}`;
    if (searchTerm && !searchStr.toLowerCase().includes(searchTerm.toLowerCase())) {
      return false;
    }
    if (filterEstado !== 'all' && operacion.estado !== filterEstado) {
      return false;
    }
    return true;
  });

  if (isLoading) {
    return (
      <PageLoadingSkeleton
        title="Mis Operaciones"
        subtitle="Operaciones de buceo disponibles"
        icon={Building}
      />
    );
  }

  const headerActions = (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar operaciones..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-64"
        />
      </div>

      <Select value={filterEstado} onValueChange={setFilterEstado}>
        <SelectTrigger className="w-40">
          <SelectValue placeholder="Estado" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos</SelectItem>
          <SelectItem value="activa">Activa</SelectItem>
          <SelectItem value="completada">Completada</SelectItem>
          <SelectItem value="pausada">Pausada</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <MainLayout
      title="Mis Operaciones"
      subtitle="Operaciones de buceo disponibles para participar"
      icon={Building}
      headerChildren={headerActions}
    >
      {filteredOperaciones.length === 0 ? (
        <EmptyState
          icon={Building}
          title="Sin operaciones disponibles"
          description="No hay operaciones activas en este momento."
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredOperaciones.map((operacion) => (
            <Card key={operacion.id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-semibold text-lg">{operacion.codigo}</h3>
                    <Badge variant={operacion.estado === 'activa' ? 'default' : 'secondary'}>
                      {operacion.estado}
                    </Badge>
                  </div>
                  
                  <div>
                    <h4 className="font-medium">{operacion.nombre}</h4>
                    <p className="text-sm text-gray-600 mt-1">{operacion.tareas}</p>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      <span>
                        {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}
                        {operacion.fecha_fin && ` - ${new Date(operacion.fecha_fin).toLocaleDateString('es-CL')}`}
                      </span>
                    </div>
                    
                    {operacion.centros && (
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{operacion.centros.nombre}</span>
                      </div>
                    )}
                    
                    {operacion.contratistas && (
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>{operacion.contratistas.nombre}</span>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </MainLayout>
  );
}
