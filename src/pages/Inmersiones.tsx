import React, { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Eye, Edit, Trash2, Anchor } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { InmersionWizard } from "@/components/inmersion/InmersionWizard";
import { useInmersiones } from "@/hooks/useInmersiones";
import { toast } from "@/hooks/use-toast";

const Inmersiones = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isViewDialogOpen, setIsViewDialogOpen] = useState(false);
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [selectedInmersion, setSelectedInmersion] = useState<any>(null);
  
  const { inmersiones, isLoading, createInmersion, updateInmersion, deleteInmersion } = useInmersiones();

  const handleCreateInmersion = async (data: any) => {
    try {
      await createInmersion(data);
      setIsCreateDialogOpen(false);
      toast({
        title: "Inmersión creada",
        description: "La inmersión ha sido creada exitosamente.",
      });
    } catch (error) {
      console.error('Error creating inmersion:', error);
    }
  };

  const handleUpdateInmersion = async (data: any) => {
    try {
      await updateInmersion({ id: selectedInmersion.inmersion_id, data });
      setIsEditDialogOpen(false);
      setSelectedInmersion(null);
      toast({
        title: "Inmersión actualizada",
        description: "Los cambios han sido guardados exitosamente.",
      });
    } catch (error) {
      console.error('Error updating inmersion:', error);
    }
  };

  const handleDeleteInmersion = async (inmersionId: string) => {
    if (window.confirm('¿Estás seguro de que quieres eliminar esta inmersión?')) {
      try {
        await deleteInmersion(inmersionId);
        toast({
          title: "Inmersión eliminada",
          description: "La inmersión ha sido eliminada exitosamente.",
        });
      } catch (error) {
        console.error('Error deleting inmersion:', error);
      }
    }
  };

  const getStatusColor = (estado: string) => {
    const colors = {
      'planificada': 'bg-yellow-100 text-yellow-700',
      'en_progreso': 'bg-blue-100 text-blue-700',
      'completada': 'bg-green-100 text-green-700',
      'cancelada': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <MainLayout
      title="Inmersiones"
      subtitle="Gestión de inmersiones y operaciones de buceo"
      icon={Anchor}
      actions={
        <Button onClick={() => setIsCreateDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Inmersión
        </Button>
      }
    >
      <Card>
        <CardHeader>
          <CardTitle>Lista de Inmersiones</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="text-center py-8">Cargando inmersiones...</div>
          ) : inmersiones.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              No hay inmersiones registradas
            </div>
          ) : (
            <div className="space-y-4">
              {inmersiones.map((inmersion) => (
                <div key={inmersion.inmersion_id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="font-semibold">{inmersion.codigo}</h3>
                      <Badge className={getStatusColor(inmersion.estado)}>
                        {inmersion.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Objetivo:</strong> {inmersion.objetivo}
                    </p>
                    <p className="text-sm text-gray-600 mb-1">
                      <strong>Fecha:</strong> {inmersion.fecha_inmersion}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Buzo Principal:</strong> {inmersion.buzo_principal}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedInmersion(inmersion);
                        setIsViewDialogOpen(true);
                      }}
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        setSelectedInmersion(inmersion);
                        setIsEditDialogOpen(true);
                      }}
                    >
                      <Edit className="w-4 h-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeleteInmersion(inmersion.inmersion_id)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Nueva Inmersión</DialogTitle>
          </DialogHeader>
          <InmersionWizard
            onComplete={handleCreateInmersion}
            onCancel={() => setIsCreateDialogOpen(false)}
            showOperationSelector={true}
          />
        </DialogContent>
      </Dialog>

      {/* View Dialog */}
      <Dialog open={isViewDialogOpen} onOpenChange={setIsViewDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Ver Inmersión</DialogTitle>
          </DialogHeader>
          {selectedInmersion && (
            <InmersionWizard
              initialData={selectedInmersion}
              onComplete={() => setIsViewDialogOpen(false)}
              onCancel={() => setIsViewDialogOpen(false)}
              readOnly={true}
              showOperationSelector={false}
            />
          )}
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Editar Inmersión</DialogTitle>
          </DialogHeader>
          {selectedInmersion && (
            <InmersionWizard
              initialData={selectedInmersion}
              onComplete={handleUpdateInmersion}
              onCancel={() => setIsEditDialogOpen(false)}
              showOperationSelector={false}
            />
          )}
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default Inmersiones;
