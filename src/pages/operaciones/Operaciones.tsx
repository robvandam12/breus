
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Plus, Building2, MapPin, Users, LayoutGrid, LayoutList } from "lucide-react";

const Operaciones = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  // Mock data para operaciones
  const operaciones = [
    {
      id: 1,
      nombre: "Mantenimiento Jaulas Sitio Norte",
      salmonera: "AquaChile S.A.",
      sitio: "Sitio Chiloé Norte",
      contratista: "Servicios Subacuáticos del Sur Ltda.",
      fechaInicio: "2024-01-15",
      fechaTermino: "2024-01-20",
      supervisor: "Diego Martínez",
      buzos: 4,
      estado: "En Progreso",
      tipo: "Mantenimiento"
    },
    {
      id: 2,
      nombre: "Inspección Redes Centro Los Fiordos",
      salmonera: "Salmones Camanchaca S.A.",
      sitio: "Centro Los Fiordos",
      contratista: "Buzos Profesionales Patagonia S.A.",
      fechaInicio: "2024-01-18",
      fechaTermino: "2024-01-22",
      supervisor: "Carlos Rojas",
      buzos: 3,
      estado: "Planificada",
      tipo: "Inspección"
    },
    {
      id: 3,
      nombre: "Limpieza Estructuras Piscicultura",
      salmonera: "Multiexport Foods S.A.",
      sitio: "Piscicultura Río Blanco",
      contratista: "Servicios Marinos Chiloé Ltda.",
      fechaInicio: "2024-01-10",
      fechaTermino: "2024-01-14",
      supervisor: "Ana López",
      buzos: 2,
      estado: "Completada",
      tipo: "Limpieza"
    }
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "En Progreso":
        return "bg-blue-100 text-blue-700";
      case "Planificada":
        return "bg-amber-100 text-amber-700";
      case "Completada":
        return "bg-emerald-100 text-emerald-700";
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
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  const renderCardsView = () => (
    <div className="grid gap-6">
      {operaciones.map((operacion) => (
        <Card key={operacion.id} className="ios-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-indigo-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-zinc-900">{operacion.nombre}</CardTitle>
                  <p className="text-sm text-zinc-500">{operacion.salmonera}</p>
                </div>
              </div>
              <div className="flex gap-2">
                <Badge variant="outline" className={getTipoBadge(operacion.tipo)}>
                  {operacion.tipo}
                </Badge>
                <Badge variant="secondary" className={getEstadoBadge(operacion.estado)}>
                  {operacion.estado}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <MapPin className="w-4 h-4" />
                <span>{operacion.sitio}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Building2 className="w-4 h-4" />
                <span>{operacion.contratista}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Calendar className="w-4 h-4" />
                <span>{operacion.fechaInicio} - {operacion.fechaTermino}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Users className="w-4 h-4" />
                <span>{operacion.buzos} buzos • {operacion.supervisor}</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm">
                Ver HPT
              </Button>
              <Button variant="outline" size="sm">
                Ver Inmersiones
              </Button>
              <Button variant="outline" size="sm">
                Editar
              </Button>
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
            <TableHead>Operación</TableHead>
            <TableHead>Salmonera</TableHead>
            <TableHead>Sitio</TableHead>
            <TableHead>Contratista</TableHead>
            <TableHead>Fechas</TableHead>
            <TableHead>Supervisor</TableHead>
            <TableHead>Buzos</TableHead>
            <TableHead>Tipo</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {operaciones.map((operacion) => (
            <TableRow key={operacion.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-indigo-600" />
                  </div>
                  <div>
                    <div className="font-medium">{operacion.nombre}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-zinc-600">{operacion.salmonera}</TableCell>
              <TableCell className="text-zinc-600">{operacion.sitio}</TableCell>
              <TableCell className="text-zinc-600">{operacion.contratista}</TableCell>
              <TableCell className="text-zinc-600 text-xs">
                {operacion.fechaInicio}<br/>
                {operacion.fechaTermino}
              </TableCell>
              <TableCell className="text-zinc-600">{operacion.supervisor}</TableCell>
              <TableCell className="text-zinc-600">{operacion.buzos}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getTipoBadge(operacion.tipo)}>
                  {operacion.tipo}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={getEstadoBadge(operacion.estado)}>
                  {operacion.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-1">
                  <Button variant="outline" size="sm">
                    HPT
                  </Button>
                  <Button variant="outline" size="sm">
                    Inmersiones
                  </Button>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
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
                <Calendar className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Operaciones</h1>
                  <p className="text-sm text-zinc-500">Gestión de operaciones de buceo</p>
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
                  Nueva Operación
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

export default Operaciones;
