
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Plus, FileText, Edit, Trash2, Eye } from "lucide-react";
import { InmersionWizard } from "@/components/inmersion/InmersionWizard";
import { useInmersiones } from "@/hooks/useInmersiones";
import { toast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";

const InmersionesPage = () => {
  const [showWizard, setShowWizard] = useState(false);
  const [editingInmersion, setEditingInmersion] = useState<any>(null);
  const [viewingInmersion, setViewingInmersion] = useState<any>(null);
  
  const { inmersiones, isLoading, createInmersion, updateInmersion, deleteInmersion } = useInmersiones();

  const handleCreateInmersion = async (data: any) => {
    try {
      await createInmersion(data);
      setShowWizard(false);
      toast({
        title: "Inmersión creada",
        description: "La inmersión ha sido creada exitosamente.",
      });
    } catch (error) {
      console.error('Error creating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión.",
        variant: "destructive",
      });
    }
  };

  const handleUpdateInmersion = async (data: any) => {
    try {
      await updateInmersion({ id: editingInmersion.inmersion_id, data });
      setEditingInmersion(null);
      toast({
        title: "Inmersión actualizada",
        description: "La inmersión ha sido actualizada exitosamente.",
      });
    } catch (error) {
      console.error('Error updating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la inmersión.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteInmersion = async (id: string) => {
    try {
      await deleteInmersion(id);
      toast({
        title: "Inmersión eliminada",
        description: "La inmersión ha sido eliminada exitosamente.",
      });
    } catch (error) {
      console.error('Error deleting inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar la inmersión.",
        variant: "destructive",
      });
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

  if (showWizard) {
    return (
      <InmersionWizard
        onComplete={handleCreateInmersion}
        onCancel={() => setShowWizard(false)}
      />
    );
  }

  if (editingInmersion) {
    return (
      <InmersionWizard
        initialData={editingInmersion}
        onComplete={handleUpdateInmersion}
        onCancel={() => setEditingInmersion(null)}
      />
    );
  }

  if (viewingInmersion) {
    return (
      <InmersionWizard
        initialData={viewingInmersion}
        onComplete={() => setViewingInmersion(null)}
        onCancel={() => setViewingInmersion(null)}
        readOnly={true}
      />
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Inmersiones</h1>
          <p className="text-gray-600">Gestiona las inmersiones y sus registros</p>
        </div>
        <Button onClick={() => setShowWizard(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Inmersión
        </Button>
      </div>

      {isLoading ? (
        <div className="text-center py-8">Cargando inmersiones...</div>
      ) : (
        <div className="grid gap-4">
          {inmersiones.map((inmersion) => (
            <Card key={inmersion.inmersion_id}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">{inmersion.codigo}</CardTitle>
                    <p className="text-sm text-gray-600">{inmersion.objetivo}</p>
                  </div>
                  <Badge className={getStatusColor(inmersion.estado)}>
                    {inmersion.estado}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                  <div>
                    <span className="font-medium">Fecha:</span> {inmersion.fecha_inmersion}
                  </div>
                  <div>
                    <span className="font-medium">Supervisor:</span> {inmersion.supervisor}
                  </div>
                  <div>
                    <span className="font-medium">Buzo Principal:</span> {inmersion.buzo_principal}
                  </div>
                  <div>
                    <span className="font-medium">Profundidad:</span> {inmersion.profundidad_max}m
                  </div>
                </div>
                
                <div className="flex gap-2 mt-4">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setViewingInmersion(inmersion)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    Ver
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setEditingInmersion(inmersion)}
                  >
                    <Edit className="w-4 h-4 mr-2" />
                    Editar
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteInmersion(inmersion.inmersion_id)}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Eliminar
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          
          {inmersiones.length === 0 && (
            <Card>
              <CardContent className="py-8">
                <div className="text-center text-gray-500">
                  <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
                  <p className="text-lg font-medium">No hay inmersiones registradas</p>
                  <p className="text-sm">Crea tu primera inmersión haciendo clic en "Nueva Inmersión"</p>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      )}
    </div>
  );
};

export default InmersionesPage;
