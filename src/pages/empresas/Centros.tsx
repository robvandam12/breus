
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, MapPin } from "lucide-react";
import { CentroTableView } from "@/components/centros/CentroTableView";
import { CentroCardView } from "@/components/centros/CentroCardView";
import { CreateCentroFormAnimated } from "@/components/centros/CreateCentroFormAnimated";
import { useCentros } from "@/hooks/useCentros";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/layout/MainLayout";

const Centros = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { centros, isLoading, createCentro, updateCentro, deleteCentro } = useCentros();

  const filteredCentros = centros.filter(centro => 
    centro.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    centro.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    centro.ubicacion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCentro = async (data: any) => {
    try {
      await createCentro(data);
      setIsCreateDialogOpen(false);
      toast({
        title: "Centro creado",
        description: "El centro ha sido creado exitosamente.",
      });
    } catch (error) {
      console.error('Error creating centro:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el centro.",
        variant: "destructive",
      });
    }
  };

  const handleEditCentro = async (id: string, data: any) => {
    try {
      await updateCentro({ id, data });
      toast({
        title: "Centro actualizado",
        description: "El centro ha sido actualizado exitosamente.",
      });
    } catch (error) {
      console.error('Error updating centro:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el centro.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteCentro = async (id: string) => {
    try {
      await deleteCentro(id);
      toast({
        title: "Centro eliminado",
        description: "El centro ha sido eliminado exitosamente.",
      });
    } catch (error) {
      console.error('Error deleting centro:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el centro.",
        variant: "destructive",
      });
    }
  };

  const headerActions = (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
        <Input
          placeholder="Buscar centros..."
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
            Nuevo Centro
          </Button>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <CreateCentroFormAnimated
              onSubmit={handleCreateCentro}
              onCancel={() => setIsCreateDialogOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </AnimatePresence>
    </div>
  );

  if (isLoading) {
    return (
      <MainLayout
        title="Centros de Acuicultura"
        subtitle="Gestión de centros y ubicaciones de cultivo"
        icon={MapPin}
        headerChildren={headerActions}
      >
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner text="Cargando centros..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Centros de Acuicultura"
      subtitle="Gestión de centros y ubicaciones de cultivo"
      icon={MapPin}
      headerChildren={headerActions}
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {centros.length}
          </div>
          <div className="text-sm text-zinc-500">Centros Totales</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {centros.filter(c => c.estado === 'activo').length}
          </div>
          <div className="text-sm text-zinc-500">Centros Activos</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {centros.filter(c => c.capacidad_jaulas && c.capacidad_jaulas > 0).length}
          </div>
          <div className="text-sm text-zinc-500">Con Jaulas</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-600">
            {centros.filter(c => c.coordenadas_lat && c.coordenadas_lng).length}
          </div>
          <div className="text-sm text-zinc-500">Georeferenciados</div>
        </Card>
      </div>

      {filteredCentros.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <MapPin className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">
              {centros.length === 0 ? "No hay centros registrados" : "No se encontraron centros"}
            </h3>
            <p className="text-zinc-500 mb-4">
              {centros.length === 0 
                ? "Comience creando el primer centro de acuicultura"
                : "Intenta ajustar la búsqueda"}
            </p>
            {centros.length === 0 && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Centro
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'table' ? (
        <CentroTableView 
          centros={filteredCentros} 
          onEdit={handleEditCentro}
          onDelete={handleDeleteCentro}
        />
      ) : (
        <CentroCardView 
          centros={filteredCentros}
          onEdit={handleEditCentro}
          onDelete={handleDeleteCentro}
        />
      )}
    </MainLayout>
  );
};

export default Centros;
