
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, UserCheck } from "lucide-react";
import { ContratistaTableView } from "@/components/contratistas/ContratistaTableView";
import { CreateContratistaForm } from "@/components/contratistas/CreateContratistaForm";
import { EditContratistaForm } from "@/components/contratistas/EditContratistaForm";
import { ContratistaDetailModal } from "@/components/contratistas/ContratistaDetailModal";
import { useContratistas } from "@/hooks/useContratistas";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/layout/MainLayout";

const Contratistas = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedContratista, setSelectedContratista] = useState<any>(null);
  
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
    } catch (error) {
      console.error('Error creating contratista:', error);
    }
  };

  const handleEditContratista = async (contratista: any) => {
    setSelectedContratista(contratista);
    setIsEditDialogOpen(true);
  };

  const handleUpdateContratista = async (data: any) => {
    if (!selectedContratista) return;
    
    try {
      await updateContratista({ id: selectedContratista.id, data });
      setIsEditDialogOpen(false);
      setSelectedContratista(null);
    } catch (error) {
      console.error('Error updating contratista:', error);
    }
  };

  const handleSelectContratista = (contratista: any) => {
    setSelectedContratista(contratista);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = (contratista: any) => {
    setSelectedContratista(contratista);
    setIsDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!selectedContratista) return;
    
    try {
      await deleteContratista(selectedContratista.id);
      setIsDeleteDialogOpen(false);
      setSelectedContratista(null);
    } catch (error) {
      console.error('Error deleting contratista:', error);
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
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="ios-button bg-blue-600 hover:bg-blue-700 transform transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nuevo Contratista
        </Button>
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
          onDelete={handleDeleteClick}
          onSelect={handleSelectContratista}
        />
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <CreateContratistaForm
            onSubmit={handleCreateContratista}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Contratista</DialogTitle>
          </DialogHeader>
          {selectedContratista && (
            <EditContratistaForm
              initialData={selectedContratista}
              onSubmit={handleUpdateContratista}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedContratista(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <ContratistaDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedContratista(null);
        }}
        contratista={selectedContratista}
        onEdit={handleEditContratista}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Contratista?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar el contratista{' '}
              <span className="font-semibold">{selectedContratista?.nombre}</span>?
              Esta acción no se puede deshacer.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmDelete}
              className="bg-red-600 hover:bg-red-700"
            >
              Eliminar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </MainLayout>
  );
};

export default Contratistas;
