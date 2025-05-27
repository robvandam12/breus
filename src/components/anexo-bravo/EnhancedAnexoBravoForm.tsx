
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useSalmoneras } from '@/hooks/useSalmoneras';
import { useSitios } from '@/hooks/useSitios';
import { FileText, MapPin, Building } from 'lucide-react';

interface EnhancedAnexoBravoFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const EnhancedAnexoBravoForm = ({ onSubmit, onCancel }: EnhancedAnexoBravoFormProps) => {
  const { operaciones } = useOperaciones();
  const { salmoneras } = useSalmoneras();
  const { sitios } = useSitios();
  
  const [formData, setFormData] = useState({
    operacion_id: '',
    codigo: '',
    fecha: new Date().toISOString().split('T')[0],
    lugar_faena: '',
    empresa_nombre: '',
    supervisor: '',
    jefe_centro: '',
    observaciones_generales: ''
  });

  const selectedOperacion = operaciones.find(op => op.id === formData.operacion_id);
  const selectedSalmonera = salmoneras.find(s => s.id === selectedOperacion?.salmonera_id);
  const selectedSitio = sitios.find(s => s.id === selectedOperacion?.sitio_id);

  useEffect(() => {
    if (selectedOperacion && selectedSalmonera && selectedSitio) {
      setFormData(prev => ({
        ...prev,
        empresa_nombre: selectedSalmonera.nombre,
        lugar_faena: `${selectedSitio.nombre} - ${selectedSitio.ubicacion}`,
        codigo: `AB-${selectedOperacion.codigo}-${new Date().getFullYear()}`
      }));
    }
  }, [selectedOperacion, selectedSalmonera, selectedSitio]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.operacion_id || !formData.supervisor || !formData.jefe_centro) return;

    await onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Nuevo Anexo Bravo</h2>
        <p className="mt-2 text-gray-600">
          Complete la información para crear el anexo bravo
        </p>
      </div>

      {/* Selección de Operación */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Operación Asociada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="operacion_id">Operación *</Label>
            <Select 
              value={formData.operacion_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, operacion_id: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar operación" />
              </SelectTrigger>
              <SelectContent>
                {operaciones.filter(op => op.estado === 'activa').map((operacion) => (
                  <SelectItem key={operacion.id} value={operacion.id}>
                    {operacion.codigo} - {operacion.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Información Auto-poblada */}
      {selectedOperacion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-green-600" />
              Información de la Operación
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="empresa_nombre">Empresa</Label>
                <Input
                  id="empresa_nombre"
                  value={formData.empresa_nombre}
                  onChange={(e) => setFormData(prev => ({ ...prev, empresa_nombre: e.target.value }))}
                  placeholder="Nombre de la empresa"
                />
              </div>

              <div>
                <Label htmlFor="lugar_faena">Lugar de Faena</Label>
                <Input
                  id="lugar_faena"
                  value={formData.lugar_faena}
                  onChange={(e) => setFormData(prev => ({ ...prev, lugar_faena: e.target.value }))}
                  placeholder="Lugar donde se realizará la faena"
                />
              </div>

              <div>
                <Label htmlFor="codigo">Código del Anexo</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                  placeholder="Código del anexo bravo"
                />
              </div>

              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => setFormData(prev => ({ ...prev, fecha: e.target.value }))}
                />
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-3">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-green-600" />
                <p className="text-sm text-green-800">
                  <strong>Operación seleccionada:</strong> {selectedOperacion.nombre}
                  {selectedSalmonera && ` - ${selectedSalmonera.nombre}`}
                  {selectedSitio && ` - ${selectedSitio.nombre}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Responsables */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-orange-600" />
            Responsables
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supervisor">Supervisor *</Label>
              <Input
                id="supervisor"
                value={formData.supervisor}
                onChange={(e) => setFormData(prev => ({ ...prev, supervisor: e.target.value }))}
                placeholder="Nombre del supervisor"
                required
              />
            </div>

            <div>
              <Label htmlFor="jefe_centro">Jefe de Centro *</Label>
              <Input
                id="jefe_centro"
                value={formData.jefe_centro}
                onChange={(e) => setFormData(prev => ({ ...prev, jefe_centro: e.target.value }))}
                placeholder="Nombre del jefe de centro"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Observaciones */}
      <Card>
        <CardHeader>
          <CardTitle>Observaciones Generales</CardTitle>
        </CardHeader>
        <CardContent>
          <Textarea
            value={formData.observaciones_generales}
            onChange={(e) => setFormData(prev => ({ ...prev, observaciones_generales: e.target.value }))}
            placeholder="Observaciones generales del anexo bravo..."
            rows={3}
          />
        </CardContent>
      </Card>

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={!formData.operacion_id || !formData.supervisor || !formData.jefe_centro}
          className="flex-1"
        >
          Crear Anexo Bravo
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
