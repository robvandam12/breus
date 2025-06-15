
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { Plus, Search, UserCheck } from "lucide-react";
import { ContratistaTableView } from "@/components/contratistas/ContratistaTableView";
import { CreateContratistaForm } from "@/components/contratistas/CreateContratistaForm";
import { useContratistas } from "@/hooks/useContratistas";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/layout/MainLayout";

const Contratistas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { contratistas, isLoading, createContratista, updateContratista, deleteContratista } = useContratistas();

  const filteredContratistas = contratistas.filter(contratista => 
    contratista.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contratista.rut?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contratista.direccion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateContratista = async (data: any) => {
    try {
      await createContratista(data);
      setIsCreateDialogOpen(false);
      toast({
        title: "Contratista creado",
        description: "El contratista ha sido creado exitosamente.",
      });
    } catch (error) {
      console.error('Error creating contratista:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el contratista.",
        variant: "destructive",
      });
    }
  };

  const handleEditContratista = async (contratista: any) => {
    // TODO: Implementar edit dialog
    console.log('Edit contratista:', contratista);
  };

  const handleSelectContratista = (contratista: any) => {
    // TODO: Implementar vista de detalles
    console.log('Select contratista:', contratista);
  };

  const handleDeleteContratista = async (id: string) => {
    try {
      await deleteContratista(id);
      toast({
        title: "Contratista eliminado",
        description: "El contratista ha sido eliminado exitosamente.",
      });
    } catch (error) {
      console.error('Error deleting contratista:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el contratista.",
        variant: "destructive",
      });
    }
  };

  const headerActions = (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
        <Input
          placeholder="Buscar contratistas..."
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
            Nuevo Contratista
          </Button>
          <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
            <CreateContratistaForm
              onSubmit={handleCreateContratista}
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
        title="Contratistas"
        subtitle="Gestión de empresas contratistas de buceo"
        icon={UserCheck}
        headerChildren={headerActions}
      >
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner text="Cargando contratistas..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Contratistas"
      subtitle="Gestión de empresas contratistas de buceo"
      icon={UserCheck}
      headerChildren={headerActions}
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {contratistas.length}
          </div>
          <div className="text-sm text-zinc-500">Contratistas Totales</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {contratistas.filter(c => c.estado === 'activo').length}
          </div>
          <div className="text-sm text-zinc-500">Activos</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {contratistas.filter(c => c.especialidades && c.especialidades.length > 0).length}
          </div>
          <div className="text-sm text-zinc-500">Con Especialidades</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {contratistas.filter(c => c.certificaciones && c.certificaciones.length > 0).length}
          </div>
          <div className="text-sm text-zinc-500">Con Certificaciones</div>
        </Card>
      </div>

      {filteredContratistas.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <UserCheck className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">
              {contratistas.length === 0 ? "No hay contratistas registrados" : "No se encontraron contratistas"}
            </h3>
            <p className="text-zinc-500 mb-4">
              {contratistas.length === 0 
                ? "Comience registrando el primer contratista de buceo"
                : "Intenta ajustar la búsqueda"}
            </p>
            {contratistas.length === 0 && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Contratista
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <ContratistaTableView 
          contratistas={filteredContratistas} 
          onEdit={handleEditContratista}
          onDelete={handleDeleteContratista}
          onSelect={handleSelectContratista}
        />
      )}
    </MainLayout>
  );
};

export default Contratistas;
