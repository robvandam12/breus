
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { useSitios } from "@/hooks/useSitios";
import { toast } from "@/hooks/use-toast";

interface EditOperacionDialogProps {
  operacion: any;
  isOpen: boolean;
  onClose: () => void;
}

export const EditOperacionDialog = ({ operacion, isOpen, onClose }: EditOperacionDialogProps) => {
  const { updateOperacion } = useOperaciones();
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  const { sitios } = useSitios();
  
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    nombre: operacion?.nombre || '',
    codigo: operacion?.codigo || '',
    tareas: operacion?.tareas || '',
    fecha_inicio: operacion?.fecha_inicio || '',
    fecha_fin: operacion?.fecha_fin || '',
    salmonera_id: operacion?.salmonera_id || '',
    contratista_id: operacion?.contratista_id || '',
    sitio_id: operacion?.sitio_id || '',
    estado: operacion?.estado || 'activa'
  });

  const filteredSitios = sitios.filter(sitio => 
    sitio.salmonera_id === formData.salmonera_id
  );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await updateOperacion({
        id: operacion.id,
        data: formData
      });

      toast({
        title: "Operación actualizada",
        description: "Los datos de la operación han sido actualizados exitosamente.",
      });

      onClose();
    } catch (error) {
      console.error('Error updating operacion:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la operación.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: string) => {
    setFormData(prev => {
      const newData = { ...prev, [field]: value };
      
      // Si cambia la salmonera, resetear el sitio
      if (field === 'salmonera_id') {
        newData.sitio_id = '';
      }
      
      return newData;
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Operación</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="nombre">Nombre de la Operación</Label>
              <Input
                id="nombre"
                value={formData.nombre}
                onChange={(e) => handleChange('nombre', e.target.value)}
                placeholder="Ingrese el nombre de la operación"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="codigo">Código</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleChange('codigo', e.target.value)}
                placeholder="Código único de la operación"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="tareas">Descripción de Tareas</Label>
            <Textarea
              id="tareas"
              value={formData.tareas}
              onChange={(e) => handleChange('tareas', e.target.value)}
              placeholder="Describa las tareas a realizar en esta operación"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha_inicio">Fecha de Inicio</Label>
              <Input
                id="fecha_inicio"
                type="date"
                value={formData.fecha_inicio}
                onChange={(e) => handleChange('fecha_inicio', e.target.value)}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="fecha_fin">Fecha de Fin</Label>
              <Input
                id="fecha_fin"
                type="date"
                value={formData.fecha_fin}
                onChange={(e) => handleChange('fecha_fin', e.target.value)}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Salmonera</Label>
            <Select value={formData.salmonera_id} onValueChange={(value) => handleChange('salmonera_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione una salmonera" />
              </SelectTrigger>
              <SelectContent>
                {salmoneras.map((salmonera) => (
                  <SelectItem key={salmonera.id} value={salmonera.id}>
                    {salmonera.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Contratista</Label>
            <Select value={formData.contratista_id} onValueChange={(value) => handleChange('contratista_id', value)}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un contratista" />
              </SelectTrigger>
              <SelectContent>
                {contratistas.map((contratista) => (
                  <SelectItem key={contratista.id} value={contratista.id}>
                    {contratista.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Sitio</Label>
            <Select 
              value={formData.sitio_id} 
              onValueChange={(value) => handleChange('sitio_id', value)}
              disabled={!formData.salmonera_id}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccione un sitio" />
              </SelectTrigger>
              <SelectContent>
                {filteredSitios.map((sitio) => (
                  <SelectItem key={sitio.id} value={sitio.id}>
                    {sitio.nombre} - {sitio.ubicacion}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label>Estado</Label>
            <Select value={formData.estado} onValueChange={(value) => handleChange('estado', value)}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="activa">Activa</SelectItem>
                <SelectItem value="completada">Completada</SelectItem>
                <SelectItem value="cancelada">Cancelada</SelectItem>
                <SelectItem value="suspendida">Suspendida</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar Cambios'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
