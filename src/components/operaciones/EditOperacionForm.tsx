
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, Save, X } from "lucide-react";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { useSitios } from "@/hooks/useSitios";

interface EditOperacionFormProps {
  operacion: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const EditOperacionForm = ({ operacion, onSubmit, onCancel }: EditOperacionFormProps) => {
  const [formData, setFormData] = useState({
    nombre: '',
    codigo: '',
    salmonera_id: '',
    contratista_id: '',
    sitio_id: '',
    fecha_inicio: '',
    fecha_fin: '',
    tareas: '',
    estado: 'activa'
  });

  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  const { sitios } = useSitios();

  useEffect(() => {
    if (operacion) {
      setFormData({
        nombre: operacion.nombre || '',
        codigo: operacion.codigo || '',
        salmonera_id: operacion.salmonera_id || '',
        contratista_id: operacion.contratista_id || '',
        sitio_id: operacion.sitio_id || '',
        fecha_inicio: operacion.fecha_inicio || '',
        fecha_fin: operacion.fecha_fin || '',
        tareas: operacion.tareas || '',
        estado: operacion.estado || 'activa'
      });
    }
  }, [operacion]);

  const sitiosFiltrados = sitios.filter(sitio => 
    sitio.salmonera_id === formData.salmonera_id
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const handleSalmoneraChange = (salmoneraId: string) => {
    setFormData(prev => ({
      ...prev,
      salmonera_id: salmoneraId,
      sitio_id: '' // Reset sitio when salmonera changes
    }));
  };

  return (
    <div className="max-w-4xl mx-auto">
      <DialogHeader className="mb-6">
        <DialogTitle className="flex items-center gap-2">
          <Calendar className="w-5 h-5 text-blue-600" />
          Editar Operación
        </DialogTitle>
      </DialogHeader>

      <Card>
        <CardHeader>
          <CardTitle>Información de la Operación</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre de la Operación *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                  placeholder="Nombre de la operación"
                  required
                />
              </div>

              <div>
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                  placeholder="OP-001"
                  required
                />
              </div>

              <div>
                <Label htmlFor="salmonera">Salmonera *</Label>
                <Select
                  value={formData.salmonera_id}
                  onValueChange={handleSalmoneraChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar salmonera..." />
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

              <div>
                <Label htmlFor="contratista">Contratista *</Label>
                <Select
                  value={formData.contratista_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, contratista_id: value }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar contratista..." />
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

              <div>
                <Label htmlFor="sitio">Sitio/Centro de Cultivo *</Label>
                <Select
                  value={formData.sitio_id}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, sitio_id: value }))}
                  disabled={!formData.salmonera_id}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar sitio..." />
                  </SelectTrigger>
                  <SelectContent>
                    {sitiosFiltrados.map((sitio) => (
                      <SelectItem key={sitio.id} value={sitio.id}>
                        {sitio.nombre} - {sitio.codigo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
                    <SelectItem value="pausada">Pausada</SelectItem>
                    <SelectItem value="completada">Completada</SelectItem>
                    <SelectItem value="cancelada">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="fecha_inicio">Fecha de Inicio *</Label>
                <Input
                  id="fecha_inicio"
                  type="date"
                  value={formData.fecha_inicio}
                  onChange={(e) => setFormData(prev => ({ ...prev, fecha_inicio: e.target.value }))}
                  required
                />
              </div>

              <div>
                <Label htmlFor="fecha_fin">Fecha de Fin</Label>
                <Input
                  id="fecha_fin"
                  type="date"
                  value={formData.fecha_fin}
                  onChange={(e) => setFormData(prev => ({ ...prev, fecha_fin: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="tareas">Descripción de Tareas</Label>
              <Textarea
                id="tareas"
                value={formData.tareas}
                onChange={(e) => setFormData(prev => ({ ...prev, tareas: e.target.value }))}
                placeholder="Descripción detallada de las tareas a realizar..."
                rows={4}
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                <X className="w-4 h-4 mr-2" />
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Save className="w-4 h-4 mr-2" />
                Actualizar Operación
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
