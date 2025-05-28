
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { OperacionFormData, Operacion } from "@/hooks/useOperaciones";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useSitios } from "@/hooks/useSitios";
import { useContratistas } from "@/hooks/useContratistas";
import { toast } from "@/hooks/use-toast";

interface EditOperacionFormProps {
  operacion: Operacion;
  onSubmit: (data: OperacionFormData) => Promise<void>;
  onCancel: () => void;
}

export const EditOperacionForm = ({ operacion, onSubmit, onCancel }: EditOperacionFormProps) => {
  const [formData, setFormData] = useState<OperacionFormData>({
    codigo: operacion.codigo,
    nombre: operacion.nombre,
    descripcion: operacion.descripcion || "",
    fecha_inicio: operacion.fecha_inicio,
    fecha_fin: operacion.fecha_fin || "",
    estado: operacion.estado,
    salmonera_id: operacion.salmonera_id || "",
    sitio_id: operacion.sitio_id || "",
    contratista_id: operacion.contratista_id || "",
    supervisor_asignado_id: operacion.supervisor_asignado_id || "",
    servicio_id: operacion.servicio_id || "",
    tareas: operacion.tareas || "",
    equipo_buceo_id: operacion.equipo_buceo_id || "",
  });

  const { salmoneras, isLoading: loadingSalmoneras } = useSalmoneras();
  const { sitios, isLoading: loadingSitios } = useSitios();
  const { contratistas, isLoading: loadingContratistas } = useContratistas();

  // Filter out any items with empty or invalid IDs
  const validSalmoneras = (salmoneras || []).filter(item => 
    item && typeof item === 'object' && item.id && typeof item.id === 'string' && item.id.trim() !== ""
  );
  
  const validSitios = (sitios || []).filter(item => 
    item && typeof item === 'object' && item.id && typeof item.id === 'string' && item.id.trim() !== ""
  );
  
  const validContratistas = (contratistas || []).filter(item => 
    item && typeof item === 'object' && item.id && typeof item.id === 'string' && item.id.trim() !== ""
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.codigo || !formData.nombre || !formData.fecha_inicio) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      await onSubmit(formData);
      toast({
        title: "Operación actualizada",
        description: "La operación ha sido actualizada exitosamente.",
      });
    } catch (error) {
      console.error("Error updating operation:", error);
      toast({
        title: "Error",
        description: "Error al actualizar la operación",
        variant: "destructive",
      });
    }
  };

  const updateFormData = (field: keyof OperacionFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Editar Operación</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => updateFormData("codigo", e.target.value)}
                placeholder="Ej: OP-001"
                required
              />
            </div>

            <div>
              <Label htmlFor="nombre">Nombre *</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => updateFormData("nombre", e.target.value)}
                placeholder="Nombre de la operación"
                required
              />
            </div>

            <div>
              <Label htmlFor="fecha_inicio">Fecha Inicio *</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => updateFormData("fecha_inicio", e.target.value)}
                required
              />
            </div>

            <div>
              <Label htmlFor="fecha_fin">Fecha Fin</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={formData.fecha_fin || ""}
                onChange={(e) => updateFormData("fecha_fin", e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="estado">Estado</Label>
              <Select 
                value={formData.estado} 
                onValueChange={(value) => updateFormData("estado", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activa">Activa</SelectItem>
                  <SelectItem value="pausada">Pausada</SelectItem>
                  <SelectItem value="completada">Completada</SelectItem>
                  <SelectItem value="cancelada">Cancelada</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="salmonera">Salmonera</Label>
              <Select 
                value={formData.salmonera_id || ""} 
                onValueChange={(value) => updateFormData("salmonera_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar salmonera" />
                </SelectTrigger>
                <SelectContent>
                  {loadingSalmoneras ? (
                    <SelectItem value="loading_placeholder" disabled>Cargando...</SelectItem>
                  ) : validSalmoneras.length === 0 ? (
                    <SelectItem value="no_data_placeholder" disabled>No hay salmoneras disponibles</SelectItem>
                  ) : (
                    validSalmoneras.map((salmonera) => (
                      <SelectItem key={salmonera.id} value={salmonera.id}>
                        {salmonera.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="sitio">Sitio</Label>
              <Select 
                value={formData.sitio_id || ""} 
                onValueChange={(value) => updateFormData("sitio_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sitio" />
                </SelectTrigger>
                <SelectContent>
                  {loadingSitios ? (
                    <SelectItem value="loading_placeholder" disabled>Cargando...</SelectItem>
                  ) : validSitios.length === 0 ? (
                    <SelectItem value="no_data_placeholder" disabled>No hay sitios disponibles</SelectItem>
                  ) : (
                    validSitios.map((sitio) => (
                      <SelectItem key={sitio.id} value={sitio.id}>
                        {sitio.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="contratista">Contratista</Label>
              <Select 
                value={formData.contratista_id || ""} 
                onValueChange={(value) => updateFormData("contratista_id", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar contratista" />
                </SelectTrigger>
                <SelectContent>
                  {loadingContratistas ? (
                    <SelectItem value="loading_placeholder" disabled>Cargando...</SelectItem>
                  ) : validContratistas.length === 0 ? (
                    <SelectItem value="no_data_placeholder" disabled>No hay contratistas disponibles</SelectItem>
                  ) : (
                    validContratistas.map((contratista) => (
                      <SelectItem key={contratista.id} value={contratista.id}>
                        {contratista.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="tareas">Tareas y Descripción</Label>
            <Textarea
              id="tareas"
              value={formData.tareas || ""}
              onChange={(e) => updateFormData("tareas", e.target.value)}
              placeholder="Descripción de las tareas a realizar..."
              rows={4}
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit">
              Actualizar Operación
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
