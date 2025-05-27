
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Building } from "lucide-react";
import { Salmonera, SalmoneraFormData } from "@/hooks/useSalmoneras";

interface EditSalmoneraFormProps {
  salmonera: Salmonera;
  onSubmit: (data: SalmoneraFormData) => Promise<void>;
  onCancel: () => void;
}

export const EditSalmoneraForm = ({ salmonera, onSubmit, onCancel }: EditSalmoneraFormProps) => {
  const [formData, setFormData] = useState<SalmoneraFormData>({
    nombre: salmonera.nombre,
    rut: salmonera.rut,
    direccion: salmonera.direccion,
    telefono: salmonera.telefono || '',
    email: salmonera.email || '',
    estado: salmonera.estado as 'activa' | 'inactiva' | 'suspendida'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } catch (error) {
      console.error('Error updating salmonera:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <DialogHeader>
        <DialogTitle className="flex items-center gap-2">
          <Building className="w-5 h-5 text-blue-600" />
          Editar Salmonera
        </DialogTitle>
      </DialogHeader>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <Label htmlFor="nombre">Nombre de la Empresa *</Label>
          <Input
            id="nombre"
            value={formData.nombre}
            onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
            placeholder="Nombre de la salmonera"
            required
          />
        </div>

        <div>
          <Label htmlFor="rut">RUT *</Label>
          <Input
            id="rut"
            value={formData.rut}
            onChange={(e) => setFormData(prev => ({ ...prev, rut: e.target.value }))}
            placeholder="12.345.678-9"
            required
          />
        </div>

        <div>
          <Label htmlFor="direccion">Dirección *</Label>
          <Input
            id="direccion"
            value={formData.direccion}
            onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
            placeholder="Dirección de la empresa"
            required
          />
        </div>

        <div>
          <Label htmlFor="telefono">Teléfono</Label>
          <Input
            id="telefono"
            value={formData.telefono}
            onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
            placeholder="+56 9 1234 5678"
          />
        </div>

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
            placeholder="contacto@salmonera.cl"
          />
        </div>

        <div>
          <Label htmlFor="estado">Estado</Label>
          <Select value={formData.estado} onValueChange={(value: 'activa' | 'inactiva' | 'suspendida') => 
            setFormData(prev => ({ ...prev, estado: value }))
          }>
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="activa">Activa</SelectItem>
              <SelectItem value="inactiva">Inactiva</SelectItem>
              <SelectItem value="suspendida">Suspendida</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex gap-3 pt-4">
          <Button 
            type="submit" 
            disabled={!formData.nombre.trim() || !formData.rut.trim() || isSubmitting}
            className="flex-1"
          >
            {isSubmitting ? 'Guardando...' : 'Guardar Cambios'}
          </Button>
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        </div>
      </form>
    </>
  );
};
