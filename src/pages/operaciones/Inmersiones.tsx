
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Waves, Plus, LayoutGrid, LayoutList } from "lucide-react";
import { ImmersionCard } from "@/components/inmersiones/ImmersionCard";
import { ImmersionTableRow } from "@/components/inmersiones/ImmersionTableRow";
import { Immersion } from "@/utils/immersionUtils";

const Inmersiones = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

  // Mock data para Inmersiones
  const inmersiones: Immersion[] = [
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

  const renderCardsView = () => (
    <div className="grid gap-6">
      {inmersiones.map((inmersion) => (
        <ImmersionCard key={inmersion.id} inmersion={inmersion} />
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
            <ImmersionTableRow key={inmersion.id} inmersion={inmersion} />
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
