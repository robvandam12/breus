
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Waves, Plus, Calendar, Users, Thermometer, Eye, LayoutGrid, LayoutList, Search, Filter, Download, Play, Pause, CheckCircle } from "lucide-react";
import { InmersionForm } from "@/components/inmersiones/InmersionForm";
import { useInmersiones, type InmersionFormData } from "@/hooks/useInmersiones";

const Inmersiones = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { inmersiones, loading, createInmersion, updateEstadoInmersion } = useInmersiones();

  const handleCreateInmersion = async (data: InmersionFormData) => {
    try {
      await createInmersion(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating Inmersion:', error);
    }
  };

  const handleUpdateEstado = async (id: string, estado: 'en_progreso' | 'completada' | 'cancelada') => {
    await updateEstadoInmersion(id, estado);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "completada":
        return "bg-emerald-100 text-emerald-700";
      case "en_progreso":
        return "bg-blue-100 text-blue-700";
      case "planificada":
        return "bg-amber-100 text-amber-700";
      case "cancelada":
        return "bg-red-100 text-red-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  const formatEstado = (estado: string) => {
    const estados = {
      'completada': 'Completada',
      'en_progreso': 'En Progreso',
      'planificada': 'Planificada',
      'cancelada': 'Cancelada'
    };
    return estados[estado as keyof typeof estados] || estado;
  };

  const renderCardsView = () => (
    <div className="grid gap-6">
      {inmersiones.map((inmersion) => (
        <Card key={inmersion.id} className="ios-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <Waves className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-zinc-900">{inmersion.codigo}</CardTitle>
                  <p className="text-sm text-zinc-500">{inmersion.operacion_nombre}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {inmersion.hpt_validado && inmersion.anexo_bravo_validado && (
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Validada
                  </Badge>
                )}
                <Badge variant="secondary" className={getEstadoBadge(inmersion.estado)}>
                  {formatEstado(inmersion.estado)}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Calendar className="w-4 h-4" />
                <span>{inmersion.fecha_inmersion}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <span>🕐 {inmersion.hora_inicio}</span>
                {inmersion.hora_fin && <span>- {inmersion.hora_fin}</span>}
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Waves className="w-4 h-4" />
                <span>{inmersion.profundidad_max}m profundidad</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Thermometer className="w-4 h-4" />
                <span>{inmersion.temperatura_agua}°C</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Eye className="w-4 h-4" />
                <span>{inmersion.visibilidad}m visibilidad</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Users className="w-4 h-4" />
                <span>{inmersion.buzo_principal}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm">
                Ver Detalles
              </Button>
              {inmersion.estado === 'planificada' && (
                <Button size="sm" onClick={() => handleUpdateEstado(inmersion.id, 'en_progreso')}>
                  <Play className="w-4 h-4 mr-1" />
                  Iniciar
                </Button>
              )}
              {inmersion.estado === 'en_progreso' && (
                <Button size="sm" onClick={() => handleUpdateEstado(inmersion.id, 'completada')}>
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Completar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );

  const renderTableView = () => (
    <Card>
      <div className="p-4 border-b">
        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input
              type="text"
              placeholder="Buscar inmersiones..."
              className="w-full pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <Button variant="outline" size="sm">
            <Filter className="w-4 h-4 mr-1" />
            Filtrar
          </Button>
          <Button variant="outline" size="sm">
            <Download className="w-4 h-4 mr-1" />
            Exportar
          </Button>
        </div>
      </div>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Operación</TableHead>
            <TableHead>Fecha/Hora</TableHead>
            <TableHead>Buzo Principal</TableHead>
            <TableHead>Profundidad</TableHead>
            <TableHead>Condiciones</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Cargando inmersiones...
                </div>
              </TableCell>
            </TableRow>
          ) : inmersiones.length === 0 ? (
            <TableRow>
              <TableCell colSpan={8} className="text-center py-8 text-gray-500">
                No hay inmersiones registradas
              </TableCell>
            </TableRow>
          ) : (
            inmersiones.map((inmersion) => (
              <TableRow key={inmersion.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Waves className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{inmersion.codigo}</div>
                      {inmersion.hpt_validado && inmersion.anexo_bravo_validado && (
                        <div className="flex items-center gap-1 text-xs text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          Validada
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-600 max-w-[200px] truncate">
                  {inmersion.operacion_nombre}
                </TableCell>
                <TableCell className="text-zinc-600">
                  <div>{inmersion.fecha_inmersion}</div>
                  <div className="text-xs text-zinc-400">
                    {inmersion.hora_inicio}{inmersion.hora_fin && ` - ${inmersion.hora_fin}`}
                  </div>
                </TableCell>
                <TableCell className="text-zinc-600">{inmersion.buzo_principal}</TableCell>
                <TableCell className="text-zinc-600">{inmersion.profundidad_max}m</TableCell>
                <TableCell className="text-zinc-600">
                  <div className="text-xs">
                    <div>{inmersion.temperatura_agua}°C</div>
                    <div>{inmersion.visibilidad}m vis.</div>
                  </div>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getEstadoBadge(inmersion.estado)}>
                    {formatEstado(inmersion.estado)}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                    {inmersion.estado === 'planificada' && (
                      <Button size="sm" onClick={() => handleUpdateEstado(inmersion.id, 'en_progreso')}>
                        <Play className="w-3 h-3" />
                      </Button>
                    )}
                    {inmersion.estado === 'en_progreso' && (
                      <Button size="sm" onClick={() => handleUpdateEstado(inmersion.id, 'completada')}>
                        <CheckCircle className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </Card>
  );

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
              <div className="flex items-center gap-3">
                <Waves className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Inmersiones</h1>
                  <p className="text-sm text-zinc-500">Registro de actividades subacuáticas</p>
                </div>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-zinc-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                    className="h-8 px-3"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="h-8 px-3"
                  >
                    <LayoutList className="w-4 h-4" />
                  </Button>
                </div>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <DialogTrigger asChild>
                    <Button className="ios-button">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Inmersión
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
                    <InmersionForm
                      onSubmit={handleCreateInmersion}
                      onCancel={() => setIsCreateDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {viewMode === 'cards' ? renderCardsView() : renderTableView()}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Inmersiones;
