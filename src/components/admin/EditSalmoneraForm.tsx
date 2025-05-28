
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Building, Mail, Phone, MapPin } from "lucide-react";

export interface EditSalmoneraFormProps {
  salmonera: any;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const EditSalmoneraForm = ({ salmonera, onSubmit, onCancel }: EditSalmoneraFormProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    rut: '',
    direccion: '',
    email: '',
    telefono: '',
    estado: 'activa'
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (salmonera) {
      setFormData({
        nombre: salmonera.nombre || '',
        rut: salmonera.rut || '',
        direccion: salmonera.direccion || '',
        email: salmonera.email || '',
        telefono: salmonera.telefono || '',
        estado: salmonera.estado || 'activa'
      });
    }
  }, [salmonera]);

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

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="bg-white shadow-sm rounded-xl border-gray-200">
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="nombre" className="text-sm font-medium text-gray-700">
                Nombre de la Salmonera *
              </Label>
              <div className="relative">
                <Building className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="nombre"
                  placeholder="Ej: Salmonera Austral S.A."
                  value={formData.nombre}
                  onChange={(e) => handleChange('nombre', e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="rut" className="text-sm font-medium text-gray-700">
                RUT *
              </Label>
              <Input
                id="rut"
                placeholder="Ej: 76.123.456-7"
                value={formData.rut}
                onChange={(e) => handleChange('rut', e.target.value)}
                className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email" className="text-sm font-medium text-gray-700">
                Email de Contacto
              </Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="email"
                  type="email"
                  placeholder="contacto@salmonera.cl"
                  value={formData.email}
                  onChange={(e) => handleChange('email', e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="telefono" className="text-sm font-medium text-gray-700">
                Teléfono
              </Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  id="telefono"
                  placeholder="+56 9 1234 5678"
                  value={formData.telefono}
                  onChange={(e) => handleChange('telefono', e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="md:col-span-2 space-y-2">
              <Label htmlFor="direccion" className="text-sm font-medium text-gray-700">
                Dirección *
              </Label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 text-gray-400 w-4 h-4" />
                <Input
                  id="direccion"
                  placeholder="Ej: Av. Pedro Montt 123, Puerto Montt, Chile"
                  value={formData.direccion}
                  onChange={(e) => handleChange('direccion', e.target.value)}
                  className="pl-10 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="estado" className="text-sm font-medium text-gray-700">
                Estado
              </Label>
              <Select value={formData.estado} onValueChange={(value) => handleChange('estado', value)}>
                <SelectTrigger className="bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="activa">Activa</SelectItem>
                  <SelectItem value="inactiva">Inactiva</SelectItem>
                  <SelectItem value="suspendida">Suspendida</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex gap-3 pt-6 border-t border-gray-200">
            <Button
              type="submit"
              disabled={isSubmitting || !formData.nombre || !formData.rut || !formData.direccion}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
            >
              {isSubmitting ? 'Actualizando...' : 'Actualizar Salmonera'}
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              className="flex-1 border-gray-200 hover:bg-gray-50 rounded-xl"
            >
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
