
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Waves, Plus, Calendar, Users, Clock, MapPin, LayoutGrid, LayoutList, Thermometer } from "lucide-react";

const Inmersiones = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  // Mock data para Inmersiones
  const inmersiones = [
    {
      id: 1,
      codigo: "IMM-2024-001",
      operacion: "Mantenimiento Jaulas Sitio Norte",
      fecha: "2024-01-15",
      hora: "08:30",
      buzo: "Juan Pérez",
      asistente: "Roberto Silva",
      profundidad: 15.5,
      duracion: 45,
      temperatura: 12.5,
      visibilidad: "Buena",
      estado: "Completada",
      sitio: "Sitio Chiloé Norte",
      tipo: "Mantenimiento"
    },
    {
      id: 2,
      codigo: "IMM-2024-002",
      operacion: "Inspección Redes Centro Los Fiordos",
      fecha: "2024-01-18",
      hora: "09:15",
      buzo: "Carlos Mendoza",
      asistente: "Ana López",
      profundidad: 12.0,
      duracion: 30,
      temperatura: 13.0,
      visibilidad: "Regular",
      estado: "En Progreso",
      sitio: "Centro Los Fiordos",
      tipo: "Inspección"
    },
    {
      id: 3,
      codigo: "IMM-2024-003",
      operacion: "Limpieza Estructuras Piscicultura",
      fecha: "2024-01-18",
      hora: "14:00",
      buzo: "Diego Martínez",
      asistente: "Luis González",
      profundidad: 8.5,
      duracion: 60,
      temperatura: 14.2,
      visibilidad: "Excelente",
      estado: "Programada",
      sitio: "Piscicultura Río Blanco",
      tipo: "Limpieza"
    }
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Completada":
        return "bg-emerald-100 text-emerald-700";
      case "En Progreso":
        return "bg-blue-100 text-blue-700";
      case "Programada":
        return "bg-amber-100 text-amber-700";
      case "Cancelada":
        return "bg-red-100 text-red-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  const getTipoBadge = (tipo: string) => {
    switch (tipo) {
      case "Mantenimiento":
        return "bg-purple-100 text-purple-700";
      case "Inspección":
        return "bg-cyan-100 text-cyan-700";
      case "Limpieza":
        return "bg-green-100 text-green-700";
      case "Emergencia":
        return "bg-red-100 text-red-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  const getVisibilidadBadge = (visibilidad: string) => {
    switch (visibilidad) {
      case "Excelente":
        return "bg-green-100 text-green-700";
      case "Buena":
        return "bg-blue-100 text-blue-700";
      case "Regular":
        return "bg-yellow-100 text-yellow-700";
      case "Mala":
        return "bg-red-100 text-red-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  const renderCardsView = () => (
    <div className="grid gap-6">
      {inmersiones.map((inmersion) => (
        <Card key={inmersion.id} className="ios-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-cyan-100 rounded-xl flex items-center justify-center">
                  <Waves className="w-6 h-6 text-cyan-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-zinc-900">{inmersion.codigo}</CardTitle>
                  <p className="text-sm text-zinc-500">{inmersion.operacion}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className={getTipoBadge(inmersion.tipo)}>
                  {inmersion.tipo}
                </Badge>
                <Badge variant="secondary" className={getEstadoBadge(inmersion.estado)}>
                  {inmersion.estado}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Calendar className="w-4 h-4" />
                <span>{inmersion.fecha} - {inmersion.hora}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <MapPin className="w-4 h-4" />
                <span>{inmersion.sitio}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Users className="w-4 h-4" />
                <span>Buzo: {inmersion.buzo}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Users className="w-4 h-4" />
                <span>Asistente: {inmersion.asistente}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Waves className="w-4 h-4" />
                <span>Profundidad: {inmersion.profundidad}m</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Clock className="w-4 h-4" />
                <span>Duración: {inmersion.duracion} min</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge variant="outline" className={getVisibilidadBadge(inmersion.visibilidad)}>
                  Visibilidad {inmersion.visibilidad}
                </Badge>
                <Badge variant="outline">
                  <Thermometer className="w-3 h-3 mr-1" />
                  {inmersion.temperatura}°C
                </Badge>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm">
                Ver Bitácora
              </Button>
              <Button variant="outline" size="sm">
                Editar
              </Button>
              {inmersion.estado === "Programada" && (
                <Button size="sm">
                  Iniciar
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
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Código</TableHead>
            <TableHead>Operación</TableHead>
            <TableHead>Fecha/Hora</TableHead>
            <TableHead>Sitio</TableHead>
            <TableHead>Buzo</TableHead>
            <TableHead>Asistente</TableHead>
            <TableHead>Profundidad</TableHead>
            <TableHead>Duración</TableHead>
            <TableHead>Condiciones</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {inmersiones.map((inmersion) => (
            <TableRow key={inmersion.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-cyan-100 rounded-lg flex items-center justify-center">
                    <Waves className="w-4 h-4 text-cyan-600" />
                  </div>
                  <div className="font-medium">{inmersion.codigo}</div>
                </div>
              </TableCell>
              <TableCell className="text-zinc-600">{inmersion.operacion}</TableCell>
              <TableCell className="text-zinc-600 text-xs">
                {inmersion.fecha}<br/>
                {inmersion.hora}
              </TableCell>
              <TableCell className="text-zinc-600">{inmersion.sitio}</TableCell>
              <TableCell className="text-zinc-600">{inmersion.buzo}</TableCell>
              <TableCell className="text-zinc-600">{inmersion.asistente}</TableCell>
              <TableCell className="text-zinc-600">{inmersion.profundidad}m</TableCell>
              <TableCell className="text-zinc-600">{inmersion.duracion} min</TableCell>
              <TableCell>
                <div className="space-y-1">
                  <Badge variant="outline" className={getVisibilidadBadge(inmersion.visibilidad)} size="sm">
                    {inmersion.visibilidad}
                  </Badge>
                  <div className="text-xs text-zinc-500">
                    <Thermometer className="w-3 h-3 inline mr-1" />
                    {inmersion.temperatura}°C
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getTipoBadge(inmersion.tipo)}>
                  {inmersion.tipo}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={getEstadoBadge(inmersion.estado)}>
                  {inmersion.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="outline" size="sm">
                    Ver
                  </Button>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                  {inmersion.estado === "Programada" && (
                    <Button size="sm">
                      Iniciar
                    </Button>
                  )}
                </div>
              </TableCell>
            </TableRow>
          ))}
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
                  <p className="text-sm text-zinc-500">Registro de inmersiones de buceo</p>
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
                <Button className="ios-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Inmersión
                </Button>
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
