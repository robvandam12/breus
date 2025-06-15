
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, Building } from "lucide-react";
import { SalmoneraTableView } from "@/components/salmoneras/SalmoneraTableView";
import { SalmoneraCardView } from "@/components/salmoneras/SalmoneraCardView";
import { CreateSalmoneraForm } from "@/components/salmoneras/CreateSalmoneraForm";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/layout/MainLayout";

const Salmoneras = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { salmoneras, isLoading, createSalmonera, updateSalmonera, deleteSalmonera } = useSalmoneras();

  const filteredSalmoneras = salmoneras.filter(salmonera => 
    salmonera.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salmonera.rut?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salmonera.direccion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSalmonera = async (data: any) => {
    try {
      await createSalmonera(data);
      setIsCreateDialogOpen(false);
      toast({
        title: "Salmonera creada",
        description: "La salmonera ha sido creada exitosamente.",
      });
    } catch (error) {
      console.error('Error creating salmonera:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la salmonera.",
        variant: "destructive",
      });
    }
  };

  const handleEditSalmonera = async (id: string, data: any) => {
    try {
      await updateSalmonera({ id, data });
      toast({
        title: "Salmonera actualizada",
        description: "La salmonera ha sido actualizada exitosamente.",
      });
    } catch (error) {
      console.error('Error updating salmonera:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la salmonera.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSalmonera = async (id: string) => {
    try {
      await deleteSalmonera(id);
      toast({
        title: "Salmonera eliminada",
        description: "La salmonera ha sido eliminada exitosamente.",
      });
    } catch (error) {
      console.error('Error deleting salmonera:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la salmonera.",
        variant: "destructive",
      });
    }
  };

  const headerActions = (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
        <Input
          placeholder="Buscar salmoneras..."
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
            Nueva Salmonera
          </Button>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <CreateSalmoneraForm
              onSubmit={handleCreateSalmonera}
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
        title="Salmoneras"
        subtitle="Gestión de empresas salmoneras y productores"
        icon={Building}
        headerChildren={headerActions}
      >
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner text="Cargando salmoneras..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Salmoneras"
      subtitle="Gestión de empresas salmoneras y productores"
      icon={Building}
      headerChildren={headerActions}
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {salmoneras.length}
          </div>
          <div className="text-sm text-zinc-500">Salmoneras Totales</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {salmoneras.filter(s => s.estado === 'activa').length}
          </div>
          <div className="text-sm text-zinc-500">Activas</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {salmoneras.filter(s => s.sitios_count && s.sitios_count > 0).length}
          </div>
          <div className="text-sm text-zinc-500">Con Sitios</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {salmoneras.filter(s => s.contratistas_asociados && s.contratistas_asociados.length > 0).length}
          </div>
          <div className="text-sm text-zinc-500">Con Contratistas</div>
        </Card>
      </div>

      {filteredSalmoneras.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Building className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">
              {salmoneras.length === 0 ? "No hay salmoneras registradas" : "No se encontraron salmoneras"}
            </h3>
            <p className="text-zinc-500 mb-4">
              {salmoneras.length === 0 
                ? "Comience registrando la primera empresa salmonera"
                : "Intenta ajustar la búsqueda"}
            </p>
            {salmoneras.length === 0 && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Salmonera
              </Button>
            )}
          </CardContent>
        </Card>
      ) : viewMode === 'table' ? (
        <SalmoneraTableView 
          salmoneras={filteredSalmoneras} 
          onEdit={handleEditSalmonera}
          onDelete={handleDeleteSalmonera}
        />
      ) : (
        <SalmoneraCardView 
          salmoneras={filteredSalmoneras}
          onEdit={handleEditSalmonera}
          onDelete={handleDeleteSalmonera}
        />
      )}
    </MainLayout>
  );
};

export default Salmoneras;
