
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Waves, Plus, Calendar, Users, CheckCircle, Clock, LayoutGrid, LayoutList, Search, AlertTriangle } from "lucide-react";
import { CreateInmersionForm } from "@/components/inmersiones/CreateInmersionForm";
import { useInmersiones } from "@/hooks/useInmersiones";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Input } from "@/components/ui/input";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const Inmersiones = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { inmersiones, loading, createInmersion } = useInmersiones();

  const handleCreateInmersion = async (data: any) => {
    try {
      await createInmersion(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating inmersion:', error);
    }
  };

  const filteredInmersiones = inmersiones.filter(inmersion =>
    inmersion.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inmersion.operacion_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inmersion.buzo_principal.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inmersion.objetivo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getEstadoBadge = (estado: string) => {
    const estadoMap: Record<string, { className: string; label: string }> = {
      planificada: { className: "bg-blue-100 text-blue-700", label: "Planificada" },
      en_progreso: { className: "bg-yellow-100 text-yellow-700", label: "En Progreso" },
      completada: { className: "bg-green-100 text-green-700", label: "Completada" },
      cancelada: { className: "bg-red-100 text-red-700", label: "Cancelada" }
    };
    return estadoMap[estado] || estadoMap.planificada;
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const formatTime = (timeString: string) => {
    if (!timeString) return '';
    return timeString.slice(0, 5); // HH:MM format
  };

  const renderCardsView = () => (
    <div className="grid gap-6">
      {filteredInmersiones.map((inmersion) => {
        const estadoInfo = getEstadoBadge(inmersion.estado);
        return (
          <Card key={inmersion.id} className="ios-card hover:shadow-lg transition-shadow">
            <CardContent className="p-6">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                    <Waves className="w-6 h-6 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-lg">{inmersion.codigo}</h3>
                    <p className="text-sm text-zinc-500">{inmersion.operacion_nombre}</p>
                  </div>
                </div>
                <div className="flex gap-2 items-center">
                  {!inmersion.hpt_validado && (
                    <Badge variant="outline" className="bg-red-100 text-red-700">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Sin HPT
                    </Badge>
                  )}
                  {!inmersion.anexo_bravo_validado && (
                    <Badge variant="outline" className="bg-orange-100 text-orange-700">
                      <AlertTriangle className="w-3 h-3 mr-1" />
                      Sin Anexo B
                    </Badge>
                  )}
                  <Badge variant="secondary" className={estadoInfo.className}>
                    {estadoInfo.label}
                  </Badge>
                </div>
              </div>

              <div className="grid md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Calendar className="w-4 h-4" />
                  <span>{formatDate(inmersion.fecha_inmersion)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Clock className="w-4 h-4" />
                  <span>{formatTime(inmersion.hora_inicio)} - {formatTime(inmersion.hora_fin || '')}</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Users className="w-4 h-4" />
                  <span>{inmersion.buzo_principal}</span>
                </div>
              </div>

              <div className="bg-zinc-50 rounded-lg p-3 mb-4">
                <p className="text-sm text-zinc-700 mb-2">
                  <strong>Objetivo:</strong> {inmersion.objetivo}
                </p>
                <div className="grid grid-cols-3 gap-2 text-xs text-zinc-600">
                  <span>Prof. Max: {inmersion.profundidad_max}m</span>
                  <span>Temp: {inmersion.temperatura_agua}°C</span>
                  <span>Visib: {inmersion.visibilidad}m</span>
                </div>
              </div>

              <div className="flex justify-end gap-2">
                <Button variant="outline" size="sm">
                  Ver Detalles
                </Button>
                <Button variant="outline" size="sm">
                  Editar
                </Button>
                {inmersion.estado === 'planificada' && (
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Iniciar
                  </Button>
                )}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );

  const renderTableView = () => (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Operación</TableHead>
            <TableHead>Fecha</TableHead>
            <TableHead>Buzo Principal</TableHead>
            <TableHead>Profundidad</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead>Validaciones</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredInmersiones.map((inmersion) => {
            const estadoInfo = getEstadoBadge(inmersion.estado);
            return (
              <TableRow key={inmersion.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Waves className="w-4 h-4 text-blue-600" />
                    </div>
                    <div>
                      <div className="font-medium">{inmersion.codigo}</div>
                      <div className="text-xs text-zinc-500">{formatTime(inmersion.hora_inicio)}</div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-zinc-600">{inmersion.operacion_nombre}</TableCell>
                <TableCell className="text-zinc-600">{formatDate(inmersion.fecha_inmersion)}</TableCell>
                <TableCell className="text-zinc-600">{inmersion.buzo_principal}</TableCell>
                <TableCell className="text-zinc-600">{inmersion.profundidad_max}m</TableCell>
                <TableCell>
                  <Badge variant="secondary" className={estadoInfo.className}>
                    {estadoInfo.label}
                  </Badge>
                </TableCell>
                <TableCell>
                  <div className="flex gap-1">
                    <Badge 
                      variant="outline" 
                      className={inmersion.hpt_validado ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700"}
                    >
                      {inmersion.hpt_validado ? "HPT ✓" : "HPT ✗"}
                    </Badge>
                    <Badge 
                      variant="outline" 
                      className={inmersion.anexo_bravo_validado ? "bg-green-100 text-green-700" : "bg-orange-100 text-orange-700"}
                    >
                      {inmersion.anexo_bravo_validado ? "Anexo ✓" : "Anexo ✗"}
                    </Badge>
                  </div>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-1">
                    <Button variant="outline" size="sm">
                      Ver
                    </Button>
                    <Button variant="outline" size="sm">
                      Editar
                    </Button>
                    {inmersion.estado === 'planificada' && (
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                        Iniciar
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </Card>
  );

  if (loading) {
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
                    <p className="text-sm text-zinc-500">Gestión de inmersiones</p>
                  </div>
                </div>
              </div>
            </header>
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner text="Cargando inmersiones..." />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

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
                  <p className="text-sm text-zinc-500">Gestión de inmersiones</p>
                </div>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar inmersiones..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10 w-64"
                  />
                </div>
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
                    <Button className="ios-button bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Inmersión
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
                    <CreateInmersionForm
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
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {inmersiones.filter(i => i.estado === 'planificada').length}
                  </div>
                  <div className="text-sm text-zinc-500">Planificadas</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {inmersiones.filter(i => i.estado === 'en_progreso').length}
                  </div>
                  <div className="text-sm text-zinc-500">En Progreso</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {inmersiones.filter(i => i.estado === 'completada').length}
                  </div>
                  <div className="text-sm text-zinc-500">Completadas</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-zinc-600">
                    {inmersiones.length}
                  </div>
                  <div className="text-sm text-zinc-500">Total</div>
                </Card>
              </div>

              {filteredInmersiones.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Waves className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay inmersiones registradas</h3>
                    <p className="text-zinc-500 mb-4">Comience registrando la primera inmersión</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Inmersión
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                viewMode === 'cards' ? renderCardsView() : renderTableView()
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Inmersiones;
