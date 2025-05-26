import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { HardHat, Plus, MapPin, Phone, Mail, LayoutGrid, LayoutList, Edit, Trash2 } from "lucide-react";
import { useContratistas, Contratista } from "@/hooks/useContratistas";
import { CreateContratistaForm } from "@/components/contratistas/CreateContratistaForm";
import { ContratistaDetails } from "./ContratistaDetails";

const Contratistas = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingContratista, setEditingContratista] = useState<Contratista | null>(null);
  const [selectedContratista, setSelectedContratista] = useState<Contratista | null>(null);
  
  const { 
    contratistas, 
    isLoading, 
    createContratista, 
    updateContratista, 
    deleteContratista,
    isCreating,
    isUpdating,
    isDeleting
  } = useContratistas();

  const handleCreateContratista = async (data: any) => {
    try {
      await createContratista(data);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating contratista:', error);
    }
  };

  const handleUpdateContratista = async (data: any) => {
    if (!editingContratista) return;
    try {
      await updateContratista({ id: editingContratista.id, data });
      setEditingContratista(null);
    } catch (error) {
      console.error('Error updating contratista:', error);
    }
  };

  const handleDeleteContratista = async (id: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar este contratista?')) {
      try {
        await deleteContratista(id);
      } catch (error) {
        console.error('Error deleting contratista:', error);
      }
    }
  };

  const handleSelectContratista = (contratista: Contratista) => {
    setSelectedContratista(contratista);
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-emerald-100 text-emerald-700";
      case "inactivo":
        return "bg-red-100 text-red-700";
      case "suspendido":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  if (showCreateForm) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <div className="flex-1 overflow-auto">
              <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <CreateContratistaForm
                  onSubmit={handleCreateContratista}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (editingContratista) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <div className="flex-1 overflow-auto">
              <div className="p-4 md:p-8 max-w-7xl mx-auto">
                <CreateContratistaForm
                  onSubmit={handleUpdateContratista}
                  onCancel={() => setEditingContratista(null)}
                  initialData={editingContratista}
                  isEditing={true}
                />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (selectedContratista) {
    return (
      <ContratistaDetails
        contratista={selectedContratista}
        onBack={() => setSelectedContratista(null)}
      />
    );
  }

  const renderCardsView = () => (
    <div className="grid gap-6">
      {contratistas.map((contratista) => (
        <Card key={contratista.id} className="ios-card hover:shadow-lg transition-shadow">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                  <HardHat className="w-6 h-6 text-orange-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-zinc-900">{contratista.nombre}</CardTitle>
                  <p className="text-sm text-zinc-500">RUT: {contratista.rut}</p>
                </div>
              </div>
              <Badge variant="secondary" className={getEstadoBadge(contratista.estado)}>
                {contratista.estado}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-zinc-600">
                <MapPin className="w-4 h-4" />
                <span>{contratista.direccion}</span>
              </div>
              {contratista.telefono && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Phone className="w-4 h-4" />
                  <span>{contratista.telefono}</span>
                </div>
              )}
              {contratista.email && (
                <div className="flex items-center gap-2 text-sm text-zinc-600">
                  <Mail className="w-4 h-4" />
                  <span>{contratista.email}</span>
                </div>
              )}
            </div>
            
            {contratista.especialidades && contratista.especialidades.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-zinc-700">Especialidades:</p>
                <div className="flex flex-wrap gap-2">
                  {contratista.especialidades.map((esp, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {esp}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            {contratista.certificaciones && contratista.certificaciones.length > 0 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-zinc-700">Certificaciones:</p>
                <div className="flex flex-wrap gap-2">
                  {contratista.certificaciones.map((cert, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
            
            <div className="flex justify-end gap-2 pt-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleSelectContratista(contratista)}
              >
                Ver Detalles
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setEditingContratista(contratista)}
              >
                <Edit className="w-4 h-4 mr-2" />
                Editar
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleDeleteContratista(contratista.id)}
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mr-2" />
                Eliminar
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
            <TableHead>Empresa</TableHead>
            <TableHead>RUT</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Contacto</TableHead>
            <TableHead>Especialidades</TableHead>
            <TableHead>Certificaciones</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contratistas.map((contratista) => (
            <TableRow key={contratista.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <HardHat className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">{contratista.nombre}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-zinc-600">{contratista.rut}</TableCell>
              <TableCell className="text-zinc-600">{contratista.direccion}</TableCell>
              <TableCell className="text-zinc-600">
                <div className="space-y-1">
                  {contratista.telefono && <div>{contratista.telefono}</div>}
                  {contratista.email && <div>{contratista.email}</div>}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {contratista.especialidades?.slice(0, 2).map((esp, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {esp}
                    </Badge>
                  ))}
                  {contratista.especialidades && contratista.especialidades.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{contratista.especialidades.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {contratista.certificaciones?.slice(0, 2).map((cert, index) => (
                    <Badge key={index} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                  {contratista.certificaciones && contratista.certificaciones.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{contratista.certificaciones.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={getEstadoBadge(contratista.estado)}>
                  {contratista.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleSelectContratista(contratista)}
                  >
                    Ver Detalles
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => setEditingContratista(contratista)}
                  >
                    <Edit className="w-4 h-4" />
                  </Button>
                  <Button 
                    variant="outline" 
                    size="sm"
                    onClick={() => handleDeleteContratista(contratista.id)}
                    disabled={isDeleting}
                  >
                    <Trash2 className="w-4 h-4" />
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
                <HardHat className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Contratistas</h1>
                  <p className="text-sm text-zinc-500">Empresas de servicios de buceo</p>
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
                <Button 
                  className="ios-button"
                  onClick={() => setShowCreateForm(true)}
                  disabled={isCreating}
                >
                  {isCreating ? (
                    <LoadingSpinner size="sm" className="mr-2" />
                  ) : (
                    <Plus className="w-4 h-4 mr-2" />
                  )}
                  Nueva Empresa
                </Button>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {isLoading ? (
                <div className="flex justify-center items-center h-64">
                  <LoadingSpinner size="lg" />
                </div>
              ) : contratistas.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <HardHat className="w-12 h-12 text-zinc-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      No hay contratistas registrados
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      Comienza agregando tu primera empresa contratista.
                    </p>
                    <Button onClick={() => setShowCreateForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Primer Contratista
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

export default Contratistas;
