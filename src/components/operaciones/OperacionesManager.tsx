
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Plus, Search, Calendar, AlertTriangle } from "lucide-react";
import { OperacionesTable } from "./OperacionesTable";
import { CreateOperacionForm } from "./CreateOperacionForm";
import { useOperaciones } from "@/hooks/useOperaciones";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { toast } from "@/hooks/use-toast";

export const OperacionesManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { operaciones, isLoading, deleteOperacion } = useOperaciones();

  const filteredOperaciones = operaciones.filter(operacion => 
    operacion.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operacion.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operacion.salmoneras?.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    operacion.contratistas?.nombre?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDeleteOperacion = async (operacionId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta operación?')) {
      try {
        await deleteOperacion(operacionId);
        toast({
          title: "Operación eliminada",
          description: "La operación ha sido eliminada exitosamente.",
        });
      } catch (error) {
        console.error('Error deleting operacion:', error);
        toast({
          title: "Error",
          description: "No se pudo eliminar la operación.",
          variant: "destructive",
        });
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <LoadingSpinner text="Cargando operaciones..." />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header y filtros */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Gestión de Operaciones</h2>
          <p className="text-gray-600">Administra las operaciones de buceo y sus documentos</p>
        </div>
        
        <div className="flex items-center gap-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
            <Input
              placeholder="Buscar operaciones..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 w-64"
            />
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogTrigger asChild>
              <Button className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Operación
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <CreateOperacionForm 
                onClose={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {operaciones.length}
          </div>
          <div className="text-sm text-zinc-500">Operaciones Totales</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {operaciones.filter(op => op.estado === 'activa').length}
          </div>
          <div className="text-sm text-zinc-500">Operaciones Activas</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {operaciones.filter(op => op.equipo_buceo_id).length}
          </div>
          <div className="text-sm text-zinc-500">Con Equipo Asignado</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-600">
            {operaciones.filter(op => op.estado === 'completada').length}
          </div>
          <div className="text-sm text-zinc-500">Completadas</div>
        </Card>
      </div>

      {/* Tabla de operaciones */}
      {filteredOperaciones.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Calendar className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">
              {operaciones.length === 0 ? "No hay operaciones registradas" : "No se encontraron operaciones"}
            </h3>
            <p className="text-zinc-500 mb-4">
              {operaciones.length === 0 
                ? "Comience creando la primera operación de buceo"
                : "Intenta ajustar la búsqueda"}
            </p>
            {operaciones.length === 0 && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Operación
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <OperacionesTable 
            operaciones={filteredOperaciones}
            onDelete={handleDeleteOperacion}
          />
        </Card>
      )}
    </div>
  );
};
