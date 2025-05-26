
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Building, ArrowLeft } from "lucide-react";
import { Salmonera } from "@/hooks/useSalmoneras";

interface EditSalmoneraFormProps {
  salmonera: Salmonera;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const EditSalmoneraForm = ({ salmonera, onSubmit, onCancel }: EditSalmoneraFormProps) => {
  const [formData, setFormData] = useState({
    nombre: salmonera.nombre,
    rut: salmonera.rut,
    direccion: salmonera.direccion,
    email: salmonera.email || '',
    telefono: salmonera.telefono || '',
    estado: salmonera.estado
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.nombre || !formData.rut || !formData.direccion) {
      return;
    }

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
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Button variant="ghost" onClick={onCancel} className="p-2">
          <ArrowLeft className="w-5 h-5" />
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
            <Building className="w-5 h-5 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">Editar Salmonera</h1>
            <p className="text-zinc-500">Modifique la información de la empresa</p>
          </div>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Empresa</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="nombre">Nombre de la Empresa *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="rut">RUT *</Label>
                <Input
                  id="rut"
                  value={formData.rut}
                  onChange={(e) => setFormData(prev => ({ ...prev, rut: e.target.value }))}
                  required
                />
              </div>

              <div className="md:col-span-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  value={formData.direccion}
                  onChange={(e) => setFormData(prev => ({ ...prev, direccion: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="telefono">Teléfono</Label>
                <Input
                  id="telefono"
                  value={formData.telefono}
                  onChange={(e) => setFormData(prev => ({ ...prev, telefono: e.target.value }))}
                />
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Select
                  value={formData.estado}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, estado: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="activa">Activa</SelectItem>
                    <SelectItem value="inactiva">Inactiva</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex gap-3 pt-6">
              <Button 
                type="submit" 
                disabled={!formData.nombre || !formData.rut || !formData.direccion || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'Actualizando...' : 'Actualizar Salmonera'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
