
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { FileCheck, Plus, Calendar, Users, CheckCircle, Clock, LayoutGrid, LayoutList, Search, Filter, Download } from "lucide-react";
import { AnexoBravoForm } from "@/components/anexo-bravo/AnexoBravoForm";
import { useAnexoBravo, type AnexoBravoFormData } from "@/hooks/useAnexoBravo";
import { useToast } from "@/components/ui/use-toast";

const AnexoBravo = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { anexosBravo, loading, createAnexoBravo, deleteAnexoBravo } = useAnexoBravo();
  const { toast } = useToast();

  const handleCreateAnexoBravo = async (data: AnexoBravoFormData) => {
    try {
      await createAnexoBravo(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating Anexo Bravo:', error);
    }
  };

  const handleDeleteAnexoBravo = async (id: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar este Anexo Bravo?')) {
      await deleteAnexoBravo(id);
    }
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "aprobado":
        return "bg-emerald-100 text-emerald-700";
      case "en_progreso":
        return "bg-amber-100 text-amber-700";
      case "completado":
        return "bg-blue-100 text-blue-700";
      case "rechazado":
        return "bg-red-100 text-red-700";
      case "borrador":
        return "bg-gray-100 text-gray-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  const formatEstado = (estado: string) => {
    const estados = {
      'aprobado': 'Aprobado',
      'en_progreso': 'En Progreso',
      'completado': 'Completado',
      'rechazado': 'Rechazado',
      'borrador': 'Borrador'
    };
    return estados[estado as keyof typeof estados] || estado;
  };

  const renderCardsView = () => (
    <div className="grid gap-6">
      {anexosBravo.map((anexo) => (
        <Card key={anexo.id} className="ios-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                  <FileCheck className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-zinc-900">{anexo.codigo}</CardTitle>
                  <p className="text-sm text-zinc-500">{anexo.operacion_nombre}</p>
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
                <span>Creado: {anexo.fecha_creacion}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Clock className="w-4 h-4" />
                <span>Verificado: {anexo.fecha_verificacion}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Users className="w-4 h-4" />
                <span>Jefe Centro: {anexo.jefe_centro}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <Users className="w-4 h-4" />
                <span>Supervisor: {anexo.supervisor}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <div className="flex gap-2">
                <Badge variant="outline" className={anexo.checklist_completo ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>
                  Checklist {anexo.progreso}%
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
              {!anexo.firmado && (
                <Button size="sm">
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
              placeholder="Buscar anexos..."
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
            <TableHead>Fecha Creación</TableHead>
            <TableHead>Fecha Verificación</TableHead>
            <TableHead>Jefe Centro</TableHead>
            <TableHead>Supervisor</TableHead>
            <TableHead>Progreso</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8">
                <div className="flex items-center justify-center gap-2">
                  <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                  Cargando anexos...
                </div>
              </TableCell>
            </TableRow>
          ) : anexosBravo.length === 0 ? (
            <TableRow>
              <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                No hay anexos Bravo registrados
              </TableCell>
            </TableRow>
          ) : (
            anexosBravo.map((anexo) => (
              <TableRow key={anexo.id}>
                <TableCell>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <FileCheck className="w-4 h-4 text-green-600" />
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
                <TableCell className="text-zinc-600 max-w-[200px] truncate">
                  {anexo.operacion_nombre}
                </TableCell>
                <TableCell className="text-zinc-600">{anexo.fecha_creacion}</TableCell>
                <TableCell className="text-zinc-600">{anexo.fecha_verificacion}</TableCell>
                <TableCell className="text-zinc-600">{anexo.jefe_centro}</TableCell>
                <TableCell className="text-zinc-600">{anexo.supervisor}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={anexo.progreso === 100 ? "bg-green-100 text-green-700" : "bg-amber-100 text-amber-700"}>
                    {anexo.progreso}%
                  </Badge>
                </TableCell>
                <TableCell>
                  <Badge variant="secondary" className={getEstadoBadge(anexo.estado)}>
                    {formatEstado(anexo.estado)}
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
                        Completar
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
                <FileCheck className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Anexo Bravo</h1>
                  <p className="text-sm text-zinc-500">Checklist de Verificación de Seguridad</p>
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
                      Nuevo Anexo Bravo
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
                    <AnexoBravoForm
                      onSubmit={handleCreateAnexoBravo}
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

export default AnexoBravo;
