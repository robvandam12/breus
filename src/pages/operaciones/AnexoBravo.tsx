
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileCheck, Plus, Calendar, Users, CheckCircle, Clock, LayoutGrid, LayoutList, AlertTriangle } from "lucide-react";

const AnexoBravo = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  // Mock data para Anexos Bravo
  const anexosBravo = [
    {
      id: 1,
      codigo: "AB-2024-001",
      operacion: "Mantenimiento Jaulas Sitio Norte",
      hpt: "HPT-2024-001",
      fechaCreacion: "2024-01-14",
      fechaVencimiento: "2024-01-21",
      jefeCentro: "Carlos Mendoza",
      supervisorServicio: "Diego Martínez",
      estado: "Vigente",
      firmado: true,
      checklistCompleto: true,
      riesgos: "Medio"
    },
    {
      id: 2,
      codigo: "AB-2024-002",
      operacion: "Inspección Redes Centro Los Fiordos",
      hpt: "HPT-2024-002",
      fechaCreacion: "2024-01-17",
      fechaVencimiento: "2024-01-24",
      jefeCentro: "Ana Morales",
      supervisorServicio: "Carlos Rojas",
      estado: "Pendiente",
      firmado: false,
      checklistCompleto: false,
      riesgos: "Alto"
    },
    {
      id: 3,
      codigo: "AB-2024-003",
      operacion: "Limpieza Estructuras Piscicultura",
      hpt: "HPT-2024-003",
      fechaCreacion: "2024-01-09",
      fechaVencimiento: "2024-01-16",
      jefeCentro: "Roberto Silva",
      supervisorServicio: "Ana López",
      estado: "Vencido",
      firmado: true,
      checklistCompleto: true,
      riesgos: "Bajo"
    }
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Vigente":
        return "bg-emerald-100 text-emerald-700";
      case "Pendiente":
        return "bg-amber-100 text-amber-700";
      case "Vencido":
        return "bg-red-100 text-red-700";
      case "Anulado":
        return "bg-gray-100 text-gray-700";
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
      {anexosBravo.map((anexo) => (
        <Card key={anexo.id} className="ios-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-zinc-900">{anexo.codigo}</CardTitle>
                  <p className="text-sm text-zinc-500">{anexo.operacion}</p>
                </div>
              </div>
              <div className="flex gap-2">
                {anexo.firmado && (
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Firmado
                  </Badge>
                )}
                <Badge variant="secondary" className={getEstadoBadge(anexo.estado)}>
                  {anexo.estado}
                </Badge>
              </div>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Calendar className="w-4 h-4" />
                <span>Creado: {anexo.fechaCreacion}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Clock className="w-4 h-4" />
                <span>Vence: {anexo.fechaVencimiento}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Users className="w-4 h-4" />
                <span>Jefe Centro: {anexo.jefeCentro}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Users className="w-4 h-4" />
                <span>Supervisor: {anexo.supervisorServicio}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge variant="outline" className={getRiesgosBadge(anexo.riesgos)}>
                  Riesgo {anexo.riesgos}
                </Badge>
                <Badge variant="outline">
                  HPT: {anexo.hpt}
                </Badge>
                {anexo.checklistCompleto ? (
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    Checklist OK
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-100 text-red-700">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Checklist Pendiente
                  </Badge>
                )}
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2">
              <Button variant="outline" size="sm">
                Ver Checklist
              </Button>
              <Button variant="outline" size="sm">
                Editar
              </Button>
              {!anexo.firmado && (
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
            <TableHead>Código</TableHead>
            <TableHead>Operación</TableHead>
            <TableHead>HPT</TableHead>
            <TableHead>Fecha Creación</TableHead>
            <TableHead>Vencimiento</TableHead>
            <TableHead>Jefe Centro</TableHead>
            <TableHead>Supervisor</TableHead>
            <TableHead>Checklist</TableHead>
            <TableHead>Riesgos</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {anexosBravo.map((anexo) => (
            <TableRow key={anexo.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <FileCheck className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">{anexo.codigo}</div>
                    {anexo.firmado && (
                      <div className="flex items-center gap-1 text-xs text-green-600">
                        <CheckCircle className="w-3 h-3" />
                        Firmado
                      </div>
                    )}
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-zinc-600">{anexo.operacion}</TableCell>
              <TableCell className="text-zinc-600">{anexo.hpt}</TableCell>
              <TableCell className="text-zinc-600">{anexo.fechaCreacion}</TableCell>
              <TableCell className="text-zinc-600">{anexo.fechaVencimiento}</TableCell>
              <TableCell className="text-zinc-600">{anexo.jefeCentro}</TableCell>
              <TableCell className="text-zinc-600">{anexo.supervisorServicio}</TableCell>
              <TableCell>
                {anexo.checklistCompleto ? (
                  <Badge variant="outline" className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Completo
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-red-100 text-red-700">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Pendiente
                  </Badge>
                )}
              </TableCell>
              <TableCell>
                <Badge variant="outline" className={getRiesgosBadge(anexo.riesgos)}>
                  {anexo.riesgos}
                </Badge>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={getEstadoBadge(anexo.estado)}>
                  {anexo.estado}
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
                  {!anexo.firmado && (
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
                <FileCheck className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Anexo Bravo</h1>
                  <p className="text-sm text-zinc-500">Autorización de Trabajo en Alturas</p>
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
                  Nuevo Anexo Bravo
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

export default AnexoBravo;
