
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent } from "@/components/ui/card";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Search, Building } from "lucide-react";
import { SalmoneraTableView } from "@/components/salmoneras/SalmoneraTableView";
import { SalmoneraCardView } from "@/components/salmoneras/SalmoneraCardView";
import { CreateSalmoneraForm } from "@/components/salmoneras/CreateSalmoneraForm";
import { EditSalmoneraForm } from "@/components/salmoneras/EditSalmoneraForm";
import { SalmoneraDetailModal } from "@/components/salmoneras/SalmoneraDetailModal";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { AnimatePresence } from "framer-motion";
import { toast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/layout/MainLayout";

const Salmoneras = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [selectedSalmonera, setSelectedSalmonera] = useState<any>(null);
  
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
    } catch (error) {
      console.error('Error creating salmonera:', error);
    }
  };

  const handleEditSalmonera = async (salmonera: any) => {
    setSelectedSalmonera(salmonera);
    setIsEditDialogOpen(true);
  };

  const handleUpdateSalmonera = async (data: any) => {
    if (!selectedSalmonera) return;
    
    try {
      await updateSalmonera({ id: selectedSalmonera.id, data });
      setIsEditDialogOpen(false);
      setSelectedSalmonera(null);
    } catch (error) {
      console.error('Error updating salmonera:', error);
    }
  };

  const handleSelectSalmonera = (salmonera: any) => {
    setSelectedSalmonera(salmonera);
    setIsDetailModalOpen(true);
  };

  const handleDeleteClick = async (id: string) => {
    const salmonera = salmoneras.find(s => s.id === id);
    if (salmonera) {
      setSelectedSalmonera(salmonera);
      setIsDeleteDialogOpen(true);
    }
  };

  const handleConfirmDelete = async () => {
    if (!selectedSalmonera) return;
    
    try {
      await deleteSalmonera(selectedSalmonera.id);
      setIsDeleteDialogOpen(false);
      setSelectedSalmonera(null);
    } catch (error) {
      console.error('Error deleting salmonera:', error);
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
        <Button 
          onClick={() => setIsCreateDialogOpen(true)}
          className="ios-button bg-blue-600 hover:bg-blue-700 transform transition-transform hover:scale-105"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Salmonera
        </Button>
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
            {salmoneras.filter(s => s.sitios_activos && s.sitios_activos > 0).length}
          </div>
          <div className="text-sm text-zinc-500">Con Sitios</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {salmoneras.length}
          </div>
          <div className="text-sm text-zinc-500">Total Registradas</div>
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
          onDelete={handleDeleteClick}
          onSelect={handleSelectSalmonera}
        />
      ) : (
        <SalmoneraCardView 
          salmoneras={filteredSalmoneras}
          onEdit={handleEditSalmonera}
          onDelete={handleDeleteClick}
          onSelect={handleSelectSalmonera}
        />
      )}

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <CreateSalmoneraForm
            onSubmit={handleCreateSalmonera}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Editar Salmonera</DialogTitle>
          </DialogHeader>
          {selectedSalmonera && (
            <EditSalmoneraForm
              initialData={selectedSalmonera}
              onSubmit={handleUpdateSalmonera}
              onCancel={() => {
                setIsEditDialogOpen(false);
                setSelectedSalmonera(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Detail Modal */}
      <SalmoneraDetailModal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedSalmonera(null);
        }}
        salmonera={selectedSalmonera}
        onEdit={handleEditSalmonera}
      />

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Eliminar Salmonera?</AlertDialogTitle>
            <AlertDialogDescription>
              ¿Estás seguro de que deseas eliminar la salmonera{' '}
              <span className="font-semibold">{selectedSalmonera?.nombre}</span>?
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

export default Salmoneras;
