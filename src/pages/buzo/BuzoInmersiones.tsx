import { useState, useEffect, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Users, Filter, Search } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useInmersiones } from '@/hooks/useInmersiones';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PageLoadingSkeleton } from '@/components/layout/PageLoadingSkeleton';
import { EmptyState } from '@/components/layout/EmptyState';
import { BuzoInmersion } from '@/types/inmersion';

export default function BuzoInmersiones() {
  const { profile: user } = useAuth();
  const { inmersiones, isLoading } = useInmersiones();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState<string>('all');

  const inmersionesForBuzo: BuzoInmersion[] = inmersiones
    .filter(inmersion => {
      if (!user) return false;

      const buzoName = `${user.nombre} ${user.apellido}`;
      const isPrincipal = inmersion.buzo_principal === buzoName;
      const isAsistente = inmersion.buzo_asistente === buzoName;

      return isPrincipal || isAsistente;
    })
    .map(inmersion => ({
      ...inmersion,
      operacionNombre: inmersion.operacion?.nombre || 'Operación no encontrada',
      salmoneraNombre: inmersion.operacion?.salmoneras?.nombre || 'No asignada',
      centroNombre: inmersion.operacion?.centros?.nombre || 'No asignado',
      rol: inmersion.buzo_principal_id === user?.id ? 'Principal' : 'Asistente'
    }));

  const filteredInmersiones = useMemo(() => {
    return inmersionesForBuzo.filter(inmersion => {
      const searchStr = `${inmersion.codigo} ${inmersion.objetivo} ${inmersion.supervisor} ${inmersion.operacionNombre}`;
      if (searchTerm && !searchStr.toLowerCase().includes(searchTerm.toLowerCase())) {
        return false;
      }
      if (filterEstado !== 'all' && inmersion.estado !== filterEstado) {
        return false;
      }
      return true;
    });
  }, [inmersionesForBuzo, searchTerm, filterEstado]);

  if (isLoading) {
    return (
      <PageLoadingSkeleton
        title="Mis Inmersiones"
        subtitle="Historial de inmersiones donde has participado"
        icon={Calendar}
      />
    );
  }

  const headerActions = (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar inmersiones..."
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
          <SelectItem value="planificada">Planificada</SelectItem>
          <SelectItem value="en_progreso">En Progreso</SelectItem>
          <SelectItem value="completada">Completada</SelectItem>
          <SelectItem value="cancelada">Cancelada</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <MainLayout
      title="Mis Inmersiones"
      subtitle="Historial de inmersiones donde has participado"
      icon={Calendar}
      headerChildren={headerActions}
    >
      {filteredInmersiones.length === 0 ? (
        <EmptyState
          icon={Calendar}
          title="Sin inmersiones registradas"
          description="Cuando participes en inmersiones, aparecerán aquí."
        />
      ) : (
        <Card>
          <CardContent>
            <div className="overflow-x-auto">
              <table className="table-auto w-full">
                <thead>
                  <tr className="text-left">
                    <th className="pb-4 font-semibold">Código</th>
                    <th className="pb-4 font-semibold">Operación</th>
                    <th className="pb-4 font-semibold">Rol</th>
                    <th className="pb-4 font-semibold">Fecha</th>
                    <th className="pb-4 font-semibold">Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredInmersiones.map((inmersion) => (
                    <tr key={inmersion.inmersion_id} className="border-b last:border-b-0">
                      <TableCell>{inmersion.codigo}</TableCell>
                      <TableCell>
                        <div>
                          <div className="font-medium">{inmersion.operacionNombre}</div>
                          <div className="text-sm text-muted-foreground">
                            Centro: {inmersion.centroNombre}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{inmersion.rol}</TableCell>
                      <TableCell>
                        {new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}
                      </TableCell>
                      <TableCell>
                        <Badge variant={inmersion.estado === 'completada' ? 'default' : 'secondary'}>
                          {inmersion.estado}
                        </Badge>
                      </TableCell>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      )}
    </MainLayout>
  );
}

interface TableCellProps {
  children: React.ReactNode;
}

function TableCell({ children }: TableCellProps) {
  return <td className="py-2">{children}</td>;
}
