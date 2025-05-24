
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Building, Plus, LayoutGrid, LayoutList, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { CreateOperacionForm } from "@/components/operaciones/CreateOperacionForm";
import { OperacionCard } from "@/components/operaciones/OperacionCard";
import { ActiveOperationsTable } from "@/components/dashboard/ActiveOperationsTable";

const Operaciones = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

  // Mock data para Operaciones
  const operaciones = [
    {
      id: 1,
      codigo: "OP-2024-001",
      nombre: "Mantenimiento Jaulas Sitio Norte",
      salmonera: "AquaChile S.A.",
      sitio: "Sitio Chiloé Norte",
      fechaInicio: "15/01/2024",
      fechaFin: "25/01/2024",
      supervisor: "Diego Martínez",
      buzos: 4,
      estado: "Activa",
      prioridad: "Alta" as const,
      tipo: "Mantenimiento"
    },
    {
      id: 2,
      codigo: "OP-2024-002",
      nombre: "Inspección Redes Centro Los Fiordos",
      salmonera: "Salmones Camanchaca",
      sitio: "Centro Los Fiordos",
      fechaInicio: "18/01/2024",
      fechaFin: "28/01/2024",
      supervisor: "Carlos Mendoza",
      buzos: 3,
      estado: "En Preparación",
      prioridad: "Media" as const,
      tipo: "Inspección"
    },
    {
      id: 3,
      codigo: "OP-2024-003",
      nombre: "Limpieza Estructuras Piscicultura",
      salmonera: "Cermaq Chile",
      sitio: "Piscicultura Río Blanco",
      fechaInicio: "20/01/2024",
      fechaFin: "30/01/2024",
      supervisor: "Ana López",
      buzos: 2,
      estado: "Activa",
      prioridad: "Baja" as const,
      tipo: "Limpieza"
    },
    {
      id: 4,
      codigo: "OP-2024-004",
      nombre: "Emergencia Escape Salmones",
      salmonera: "Multiexport Foods",
      sitio: "Centro Puerto Montt",
      fechaInicio: "22/01/2024",
      fechaFin: "25/01/2024",
      supervisor: "Roberto Silva",
      buzos: 5,
      estado: "Completada",
      prioridad: "Alta" as const,
      tipo: "Emergencia"
    }
  ];

  const filteredOperaciones = operaciones.filter(op =>
    op.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    op.salmonera.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateOperacion = (data: any) => {
    console.log("Nueva operación:", data);
    setIsCreateDialogOpen(false);
    // Aquí integrarías con la API
  };

  const renderCardsView = () => (
    <div className="grid gap-6">
      {filteredOperaciones.map((operacion) => (
        <OperacionCard key={operacion.id} operacion={operacion} />
      ))}
    </div>
  );

  const renderTableView = () => (
    <ActiveOperationsTable operations={filteredOperaciones} />
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
                <Building className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Operaciones</h1>
                  <p className="text-sm text-zinc-500">Gestión de operaciones de buceo</p>
                </div>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-3">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                  <Input
                    placeholder="Buscar operaciones..."
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
                    <Button className="ios-button">
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Operación
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <CreateOperacionForm
                      onSubmit={handleCreateOperacion}
                      onCancel={() => setIsCreateDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              <div className="mb-6">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <Card className="p-4">
                    <div className="text-2xl font-bold text-emerald-600">
                      {operaciones.filter(op => op.estado === "Activa").length}
                    </div>
                    <div className="text-sm text-zinc-500">Activas</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-2xl font-bold text-amber-600">
                      {operaciones.filter(op => op.estado === "En Preparación").length}
                    </div>
                    <div className="text-sm text-zinc-500">En Preparación</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {operaciones.filter(op => op.estado === "Completada").length}
                    </div>
                    <div className="text-sm text-zinc-500">Completadas</div>
                  </Card>
                  <Card className="p-4">
                    <div className="text-2xl font-bold text-zinc-600">
                      {operaciones.length}
                    </div>
                    <div className="text-sm text-zinc-500">Total</div>
                  </Card>
                </div>
              </div>

              {viewMode === 'cards' ? renderCardsView() : renderTableView()}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Operaciones;
