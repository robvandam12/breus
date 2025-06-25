
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { OperacionFormData, useOperaciones } from "@/hooks/useOperaciones";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useSitios } from "@/hooks/useSitios";
import { useContratistas } from "@/hooks/useContratistas";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

interface CreateOperacionFormProps {
  onClose?: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export const CreateOperacionForm = ({ 
  onClose,
  initialData,
  isEditing = false
}: CreateOperacionFormProps) => {
  const { createOperacion, isCreating, updateOperacion } = useOperaciones();
  const { salmoneras, isLoading: loadingSalmoneras } = useSalmoneras();
  const { sitios, isLoading: loadingSitios } = useSitios();
  const { contratistas, isLoading: loadingContratistas } = useContratistas();
  const { profile } = useAuth();

  const [formData, setFormData] = useState<OperacionFormData>({
    codigo: initialData?.codigo || "",
    nombre: initialData?.nombre || "",
    fecha_inicio: initialData?.fecha_inicio || "",
    fecha_fin: initialData?.fecha_fin || "",
    estado: initialData?.estado || "activa",
    salmonera_id: initialData?.salmonera_id || (profile?.role === 'admin_salmonera' ? profile.salmonera_id : ""),
    sitio_id: initialData?.sitio_id || "",
    contratista_id: initialData?.contratista_id || "",
    servicio_id: initialData?.servicio_id || (profile?.role === 'admin_servicio' ? profile.servicio_id : ""),
    tareas: initialData?.tareas || "",
  });

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
    
    console.log('Form submission started with data:', formData);
    
    if (!formData.codigo || !formData.nombre || !formData.fecha_inicio) {
      toast({
        title: "Error",
        description: "Por favor complete todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    try {
      // Limpiar campos vacíos para evitar errores de UUID
      const cleanedData: OperacionFormData = {
        codigo: formData.codigo,
        nombre: formData.nombre,
        fecha_inicio: formData.fecha_inicio,
        estado: formData.estado,
        salmonera_id: formData.salmonera_id && formData.salmonera_id.trim() !== "" && formData.salmonera_id !== "none" ? formData.salmonera_id : undefined,
        sitio_id: formData.sitio_id && formData.sitio_id.trim() !== "" && formData.sitio_id !== "none" ? formData.sitio_id : undefined,
        contratista_id: formData.contratista_id && formData.contratista_id.trim() !== "" && formData.contratista_id !== "none" ? formData.contratista_id : undefined,
        servicio_id: formData.servicio_id && formData.servicio_id.trim() !== "" && formData.servicio_id !== "none" ? formData.servicio_id : undefined,
        fecha_fin: formData.fecha_fin && formData.fecha_fin.trim() !== "" ? formData.fecha_fin : undefined,
        tareas: formData.tareas && formData.tareas.trim() !== "" ? formData.tareas : undefined,
      };

      console.log('Cleaned data for submission:', cleanedData);

      if (isEditing && initialData?.id) {
        console.log('Updating operation with ID:', initialData.id);
        await updateOperacion({ id: initialData.id, data: cleanedData });
      } else {
        console.log('Creating new operation');
        await createOperacion(cleanedData);
      }
      
      console.log('Operation completed successfully');
      onClose?.();
    } catch (error) {
      console.error("Error with operation:", error);
      toast({
        title: "Error",
        description: `No se pudo ${isEditing ? 'actualizar' : 'crear'} la operación: ${error instanceof Error ? error.message : 'Error desconocido'}`,
        variant: "destructive",
      });
    }
  };

  const updateFormData = (field: keyof OperacionFormData, value: string) => {
    console.log(`Updating field ${field} with value:`, value);
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Obtener el nombre de la salmonera del usuario para mostrar
  const userSalmonera = validSalmoneras.find(s => s.id === profile?.salmonera_id);

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Operación' : 'Nueva Operación'}</CardTitle>
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
                onValueChange={(value) => updateFormData("estado", value as "activa" | "pausada" | "completada" | "cancelada")}
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
              {profile?.role === 'admin_salmonera' ? (
                <Input
                  value={userSalmonera?.nombre || 'Salmonera asignada'}
                  readOnly
                  className="bg-gray-50"
                />
              ) : (
                <Select 
                  value={formData.salmonera_id || "none"} 
                  onValueChange={(value) => updateFormData("salmonera_id", value === "none" ? "" : value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar salmonera" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Sin seleccionar</SelectItem>
                    {loadingSalmoneras ? (
                      <SelectItem value="loading" disabled>Cargando...</SelectItem>
                    ) : validSalmoneras.length === 0 ? (
                      <SelectItem value="no_data" disabled>No hay salmoneras disponibles</SelectItem>
                    ) : (
                      validSalmoneras.map((salmonera) => (
                        <SelectItem key={salmonera.id} value={String(salmonera.id)}>
                          {salmonera.nombre}
                        </SelectItem>
                      ))
                    )}
                  </SelectContent>
                </Select>
              )}
            </div>

            <div>
              <Label htmlFor="sitio">Sitio</Label>
              <Select 
                value={formData.sitio_id || "none"} 
                onValueChange={(value) => updateFormData("sitio_id", value === "none" ? "" : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar sitio" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin seleccionar</SelectItem>
                  {loadingSitios ? (
                    <SelectItem value="loading" disabled>Cargando...</SelectItem>
                  ) : validSitios.length === 0 ? (
                    <SelectItem value="no_data" disabled>No hay sitios disponibles</SelectItem>
                  ) : (
                    validSitios.map((sitio) => (
                      <SelectItem key={sitio.id} value={String(sitio.id)}>
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
                value={formData.contratista_id || "none"} 
                onValueChange={(value) => updateFormData("contratista_id", value === "none" ? "" : value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar contratista" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">Sin seleccionar</SelectItem>
                  {loadingContratistas ? (
                    <SelectItem value="loading" disabled>Cargando...</SelectItem>
                  ) : validContratistas.length === 0 ? (
                    <SelectItem value="no_data" disabled>No hay contratistas disponibles</SelectItem>
                  ) : (
                    validContratistas.map((contratista) => (
                      <SelectItem key={contratista.id} value={String(contratista.id)}>
                        {contratista.nombre}
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div>
            <Label htmlFor="tareas">Tareas (Opcional)</Label>
            <Input
              id="tareas"
              value={formData.tareas || ""}
              onChange={(e) => updateFormData("tareas", e.target.value)}
              placeholder="Descripción de las tareas"
            />
          </div>

          <div className="flex justify-end gap-2 pt-4">
            {onClose && (
              <Button type="button" variant="outline" onClick={onClose}>
                Cancelar
              </Button>
            )}
            <Button type="submit" disabled={isCreating}>
              {isCreating ? "Procesando..." : (isEditing ? "Actualizar Operación" : "Crear Operación")}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
