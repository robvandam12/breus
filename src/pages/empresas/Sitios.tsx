import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, MapPin } from "lucide-react";
import { SitioTableView } from "@/components/sitios/SitioTableView";
import { SitioCardView } from "@/components/sitios/SitioCardView";
import { CreateSitioFormAnimated } from "@/components/sitios/CreateSitioFormAnimated";
import { useSitios } from "@/hooks/useSitios";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";

const Sitios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { sitios, isLoading, createSitio, updateSitio, deleteSitio } = useSitios();

  const filteredSitios = sitios.filter(sitio => 
    sitio.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sitio.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sitio.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSitio = async (data: any) => {
    try {
      await createSitio(data);
      setIsCreateDialogOpen(false);
      toast({
        title: "Sitio creado",
        description: "El sitio ha sido creado exitosamente.",
      });
    } catch (error) {
      console.error('Error creating sitio:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el sitio.",
        variant: "destructive",
      });
    }
  };

  const handleEditSitio = async (id: string, data: any) => {
    try {
      await updateSitio({ id, data });
      toast({
        title: "Sitio actualizado",
        description: "El sitio ha sido actualizado exitosamente.",
      });
    } catch (error) {
      console.error('Error updating sitio:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el sitio.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSitio = async (id: string) => {
    try {
      await deleteSitio(id);
      toast({
        title: "Sitio eliminado",
        description: "El sitio ha sido eliminado exitosamente.",
      });
    } catch (error) {
      console.error('Error deleting sitio:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el sitio.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-white">
            <Header 
              title="Sitios de Acuicultura" 
              subtitle="Gestión de sitios y ubicaciones de cultivo" 
              icon={MapPin} 
            />
            <div className="flex-1 flex items-center justify-center bg-white">
              <LoadingSpinner text="Cargando sitios..." />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-white">
          <Header 
            title="Sitios de Acuicultura" 
            subtitle="Gestión de sitios y ubicaciones de cultivo" 
            icon={MapPin} 
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  placeholder="Buscar sitios..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <AnimatePresence>
                <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                  <Button 
                    onClick={() => setIsCreateDialogOpen(true)}
                    className="ios-button bg-blue-600 hover:bg-blue-700 transform transition-transform hover:scale-105"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Sitio
                  </Button>
                  <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <CreateSitioFormAnimated
                      onSubmit={handleCreateSitio}
                      onCancel={() => setIsCreateDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              </AnimatePresence>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {sitios.length}
                  </div>
                  <div className="text-sm text-zinc-500">Sitios Totales</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {sitios.filter(s => s.estado === 'activo').length}
                  </div>
                  <div className="text-sm text-zinc-500">Sitios Activos</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {sitios.filter(s => s.capacidad_jaulas && s.capacidad_jaulas > 0).length}
                  </div>
                  <div className="text-sm text-zinc-500">Con Jaulas</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-gray-600">
                    {sitios.filter(s => s.coordenadas_lat && s.coordenadas_lng).length}
                  </div>
                  <div className="text-sm text-zinc-500">Georeferenciados</div>
                </Card>
              </div>

              {filteredSitios.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <MapPin className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      {sitios.length === 0 ? "No hay sitios registrados" : "No se encontraron sitios"}
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      {sitios.length === 0 
                        ? "Comience creando el primer sitio de acuicultura"
                        : "Intenta ajustar la búsqueda"}
                    </p>
                    {sitios.length === 0 && (
                      <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Sitio
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : viewMode === 'table' ? (
                <SitioTableView 
                  sitios={filteredSitios} 
                  onEdit={handleEditSitio}
                  onDelete={handleDeleteSitio}
                />
              ) : (
                <SitioCardView 
                  sitios={filteredSitios}
                  onEdit={handleEditSitio}
                  onDelete={handleDeleteSitio}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Sitios;
