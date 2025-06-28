
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useSalmoneras } from '@/hooks/useSalmoneras';
import { useCentros } from '@/hooks/useCentros';
import { Building, MapPin, FileText } from 'lucide-react';

interface CreateBitacoraSupervisorFormCompleteProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  inmersionId?: string;
}

export const CreateBitacoraSupervisorFormComplete = ({ 
  onSubmit, 
  onCancel, 
  inmersionId 
}: CreateBitacoraSupervisorFormCompleteProps) => {
  const { inmersiones } = useInmersiones();
  const { operaciones } = useOperaciones();
  const { salmoneras } = useSalmoneras();
  const { centros } = useCentros();
  
  const [formData, setFormData] = useState({
    inmersion_id: inmersionId || '',
    codigo: '',
    fecha: new Date().toISOString().split('T')[0],
    supervisor: '',
    empresa_nombre: '',
    centro_nombre: '',
    lugar_trabajo: '',
    fecha_inicio_faena: new Date().toISOString().split('T')[0],
    hora_inicio_faena: '',
    hora_termino_faena: '',
    trabajo_a_realizar: '',
    descripcion_trabajo: '',
    estado_mar: '',
    visibilidad_fondo: '',
    embarcacion_apoyo: '',
    equipos_utilizados: [],
    inmersiones_buzos: [],
    desarrollo_inmersion: '',
    evaluacion_general: '',
    incidentes: '',
    observaciones_generales_texto: ''
  });

  const selectedInmersion = inmersiones.find(i => i.inmersion_id === formData.inmersion_id);
  const selectedOperacion = selectedInmersion ? operaciones.find(o => o.id === selectedInmersion.operacion_id) : null;
  const selectedSalmonera = selectedOperacion ? salmoneras.find(s => s.id === selectedOperacion.salmonera_id) : null;
  const selectedCentro = selectedOperacion ? centros.find(s => s.id === selectedOperacion.centro_id) : null;

  useEffect(() => {
    if (selectedInmersion && selectedOperacion) {
      setFormData(prev => ({
        ...prev,
        codigo: `BS-${selectedInmersion.codigo}-${new Date().getFullYear()}`,
        supervisor: selectedInmersion.supervisor || '',
        empresa_nombre: selectedSalmonera?.nombre || '',
        centro_nombre: selectedCentro?.nombre || '',
        lugar_trabajo: selectedCentro?.ubicacion || '',
        trabajo_a_realizar: selectedInmersion.objetivo || '',
        descripcion_trabajo: selectedOperacion.tareas || ''
      }));
    }
  }, [selectedInmersion, selectedOperacion, selectedSalmonera, selectedCentro]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.inmersion_id || !formData.supervisor) return;

    await onSubmit({
      ...formData,
      equipos_utilizados: JSON.stringify(formData.equipos_utilizados),
      inmersiones_buzos: JSON.stringify(formData.inmersiones_buzos),
      visibilidad_fondo: formData.visibilidad_fondo ? parseFloat(formData.visibilidad_fondo) : null
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Nueva Bitácora de Supervisor</h2>
        <p className="mt-2 text-gray-600">
          Complete la información de la bitácora de supervisión
        </p>
      </div>

      {/* Selección de Inmersión */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Inmersión Asociada
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="inmersion_id">Inmersión *</Label>
            <Select 
              value={formData.inmersion_id} 
              onValueChange={(value) => setFormData(prev => ({ ...prev, inmersion_id: value }))}
              disabled={!!inmersionId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar inmersión" />
              </SelectTrigger>
              <SelectContent>
                {inmersiones.filter(i => i.estado === 'completada').map((inmersion) => (
                  <SelectItem key={inmersion.inmersion_id} value={inmersion.inmersion_id}>
                    {inmersion.codigo} - {inmersion.objetivo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Información auto-poblada */}
      {selectedInmersion && selectedOperacion && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5 text-green-600" />
              Información de la Inmersión
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo">Código de Bitácora</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                  placeholder="Código automático"
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
                  <strong>Operación:</strong> {selectedOperacion.nombre}
                  {selectedSalmonera && ` - ${selectedSalmonera.nombre}`}
                  {selectedCentro && ` - ${selectedCentro.nombre}`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Información del Supervisor */}
      <Card>
        <CardHeader>
          <CardTitle>Información del Supervisor</CardTitle>
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
              <Label htmlFor="empresa_nombre">Empresa</Label>
              <Input
                id="empresa_nombre"
                value={formData.empresa_nombre}
                readOnly
                className="bg-gray-50"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Desarrollo de la Inmersión */}
      <Card>
        <CardHeader>
          <CardTitle>Desarrollo de la Inmersión</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="desarrollo_inmersion">Desarrollo de la Inmersión *</Label>
            <Textarea
              id="desarrollo_inmersion"
              value={formData.desarrollo_inmersion}
              onChange={(e) => setFormData(prev => ({ ...prev, desarrollo_inmersion: e.target.value }))}
              placeholder="Describa cómo se desarrolló la inmersión..."
              rows={4}
              required
            />
          </div>

          <div>
            <Label htmlFor="evaluacion_general">Evaluación General *</Label>
            <Textarea
              id="evaluacion_general"
              value={formData.evaluacion_general}
              onChange={(e) => setFormData(prev => ({ ...prev, evaluacion_general: e.target.value }))}
              placeholder="Evaluación general del trabajo realizado..."
              rows={3}
              required
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-3 pt-4">
        <Button 
          type="submit" 
          disabled={!formData.inmersion_id || !formData.supervisor || !formData.desarrollo_inmersion || !formData.evaluacion_general}
          className="flex-1"
        >
          Crear Bitácora
        </Button>
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </form>
  );
};
