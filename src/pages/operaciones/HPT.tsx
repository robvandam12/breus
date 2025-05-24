
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus, Calendar, Users, CheckCircle, Clock, LayoutGrid, LayoutList } from "lucide-react";

const HPT = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  // Mock data para HPTs
  const hpts = [
    {
      id: 1,
      codigo: "HPT-2024-001",
      operacion: "Mantenimiento Jaulas Sitio Norte",
      fechaCreacion: "2024-01-14",
      fechaProgramada: "2024-01-15",
      supervisor: "Diego Martínez",
      jefeObra: "Carlos Mendoza",
      estado: "Aprobada",
      firmado: true,
      equipoBuceo: 4,
      riesgos: "Medio"
    },
    {
      id: 2,
      codigo: "HPT-2024-002",
      operacion: "Inspección Redes Centro Los Fiordos",
      fechaCreacion: "2024-01-17",
      fechaProgramada: "2024-01-18",
      supervisor: "Carlos Rojas",
      jefeObra: "Ana Morales",
      estado: "Pendiente",
      firmado: false,
      equipoBuceo: 3,
      riesgos: "Alto"
    },
    {
      id: 3,
      codigo: "HPT-2024-003",
      operacion: "Limpieza Estructuras Piscicultura",
      fechaCreacion: "2024-01-09",
      fechaProgramada: "2024-01-10",
      supervisor: "Ana López",
      jefeObra: "Roberto Silva",
      estado: "Completada",
      firmado: true,
      equipoBuceo: 2,
      riesgos: "Bajo"
    }
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Aprobada":
        return "bg-emerald-100 text-emerald-700";
      case "Pendiente":
        return "bg-amber-100 text-amber-700";
      case "Completada":
        return "bg-blue-100 text-blue-700";
      case "Rechazada":
        return "bg-red-100 text-red-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  const getRiesgosBadge = (riesgos: string) => {
    switch (riesgos) {
      case "Bajo":
        return "bg-green-100 text-green-700";
      case "Medio":
        return "bg-yellow-100 text-yellow-700";
      case "Alto":
        return "bg-red-100 text-red-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  const renderCardsView = () => (
    <div className="grid gap-6">
      {hpts.map((hpt) => (
        <Card key={hpt.id} className="ios-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-zinc-900">{hpt.codigo}</CardTitle>
                  <p className="text-sm text-zinc-500">{hpt.operacion}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {hpt.firmado && (
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Firmada
                  </Badge>
                )}
                <Badge variant="secondary" className={getEstadoBadge(hpt.estado)}>
                  {hpt.estado}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Calendar className="w-4 h-4" />
                <span>Creada: {hpt.fechaCreacion}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Clock className="w-4 h-4" />
                <span>Programada: {hpt.fechaProgramada}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Users className="w-4 h-4" />
                <span>Supervisor: {hpt.supervisor}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Users className="w-4 h-4" />
                <span>Jefe Obra: {hpt.jefeObra}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge variant="outline" className={getRiesgosBadge(hpt.riesgos)}>
                  Riesgo {hpt.riesgos}
                </Badge>
                <Badge variant="outline">
                  {hpt.equipoBuceo} buzos
                </Badge>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm">
                Ver Detalles
              </Button>
              <Button variant="outline" size="sm">
                Editar
              </Button>
              {!hpt.firmado && (
                <Button size="sm">
                  Firmar
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
            <TableHead>Código HPT</TableHead>
            <TableHead>Operación</TableHead>
            <TableHead>Fecha Creación</TableHead>
            <TableHead>Fecha Programada</TableHead>
            <TableHead>Supervisor</TableHead>
            <TableHead>Jefe Obra</TableHead>
            <TableHead>Equipo</TableHead>
            <TableHead>Riesgos</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {hpts.map((hpt) => (
            <TableRow key={hpt.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-4 h-4 text-blue-600" />
                  </div>
                  <div>
                    <div className="font-medium">{hpt.codigo}</div>
                    {hpt.firmado && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        Firmada
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-zinc-600">{hpt.operacion}</TableCell>
              <TableCell className="text-zinc-600">{hpt.fechaCreacion}</TableCell>
              <TableCell className="text-zinc-600">{hpt.fechaProgramada}</TableCell>
              <TableCell className="text-zinc-600">{hpt.supervisor}</TableCell>
              <TableCell className="text-zinc-600">{hpt.jefeObra}</TableCell>
              <TableCell className="text-zinc-600">{hpt.equipoBuceo}</TableCell>
              <TableCell>
                <Badge variant="outline" className={getRiesgosBadge(hpt.riesgos)}>
                  {hpt.riesgos}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={getEstadoBadge(hpt.estado)}>
                  {hpt.estado}
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
                  {!hpt.firmado && (
                    <Button size="sm">
                      Firmar
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
                <FileText className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">HPT</h1>
                  <p className="text-sm text-zinc-500">Hoja de Preparación de Trabajo</p>
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
                  Nueva HPT
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

export default HPT;
