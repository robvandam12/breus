
import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building, Search, Calendar, Users, MapPin } from "lucide-react";
import { useOperacionesQuery } from "@/hooks/useOperacionesQuery";
import { useCentros } from "@/hooks/useCentros";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageLoadingSkeleton } from "@/components/layout/PageLoadingSkeleton";
import { EmptyState } from "@/components/layout/EmptyState";

const BuzoOperaciones = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterEstado, setFilterEstado] = useState<string>("all");
  const [filterCentro, setFilterCentro] = useState<string>("all");
  
  const { operaciones, isLoading } = useOperacionesQuery();
  const { centros } = useCentros();

  // Solo mostrar operaciones activas y completadas para buzos
  const filteredOperaciones = useMemo(() => {
    return operaciones.filter(operacion => {
      // Solo operaciones activas o completadas
      if (!['activa', 'completada'].includes(operacion.estado)) return false;
      
      // Filtro por búsqueda
      if (searchTerm && !operacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) &&
          !operacion.codigo.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      
      // Filtro por estado
      if (filterEstado !== "all" && operacion.estado !== filterEstado) {
        return false;
      }
      
      // Filtro por centro
      if (filterCentro !== "all" && operacion.centro_id !== filterCentro) {
        return false;
      }
      
      return true;
    });
  }, [operaciones, searchTerm, filterEstado, filterCentro]);

  if (isLoading) {
    return (
      <PageLoadingSkeleton
        title="Operaciones Disponibles"
        subtitle="Consulta las operaciones asignadas"
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
        </SelectContent>
      </Select>

      <Select value={filterCentro} onValueChange={setFilterCentro}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Centro" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Todos los centros</SelectItem>
          {centros.map((centro) => (
            <SelectItem key={centro.id} value={centro.id}>
              {centro.nombre}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <MainLayout
      title="Operaciones Disponibles"
      subtitle="Consulta las operaciones asignadas y su estado"
      icon={Building}
      headerChildren={headerActions}
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {operaciones.filter(op => op.estado === 'activa').length}
            </div>
            <div className="text-sm text-muted-foreground">Operaciones Activas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {operaciones.filter(op => op.estado === 'completada').length}
            </div>
            <div className="text-sm text-muted-foreground">Completadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {operaciones.filter(op => op.estado === 'pausada').length}
            </div>
            <div className="text-sm text-muted-foreground">Pausadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-muted-foreground">
              {filteredOperaciones.length}
            </div>
            <div className="text-sm text-muted-foreground">Disponibles</div>
          </CardContent>
        </Card>
      </div>

      {/* Operaciones List */}
      {filteredOperaciones.length === 0 ? (
        <EmptyState
          icon={Building}
          title="No hay operaciones disponibles"
          description="No se encontraron operaciones que coincidan con los filtros aplicados"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredOperaciones.map((operacion) => {
            const centro = centros.find(c => c.id === operacion.centro_id);
            
            return (
              <Card key={operacion.id} className="hover:shadow-lg transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg mb-1">{operacion.nombre}</CardTitle>
                      <p className="text-sm text-gray-500 font-mono">{operacion.codigo}</p>
                    </div>
                    <Badge 
                      variant={operacion.estado === 'activa' ? 'default' : 'secondary'}
                      className={operacion.estado === 'activa' ? 'bg-green-100 text-green-700' : ''}
                    >
                      {operacion.estado}
                    </Badge>
                  </div>
                </CardHeader>
                
                <CardContent className="space-y-3">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>
                        Inicio: {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}
                      </span>
                    </div>

                    {centro && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-green-500" />
                        <span>{centro.nombre}</span>
                      </div>
                    )}

                    {operacion.contratistas && (
                      <div className="flex items-center gap-2 text-sm">
                        <Users className="w-4 h-4 text-purple-500" />
                        <span>{operacion.contratistas.nombre}</span>
                      </div>
                    )}
                  </div>

                  {operacion.tareas && (
                    <div className="pt-2 border-t">
                      <p className="text-sm text-gray-600 line-clamp-2">
                        {operacion.tareas}
                      </p>
                    </div>
                  )}

                  <div className="pt-2 border-t">
                    <Button 
                      variant="outline" 
                      size="sm" 
                      className="w-full"
                      disabled={operacion.estado !== 'activa'}
                    >
                      Ver Detalles
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </MainLayout>
  );
};

export default BuzoOperaciones;
