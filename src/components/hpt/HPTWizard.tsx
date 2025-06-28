
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useSalmoneras } from '@/hooks/useSalmoneras';
import { useContratistas } from '@/hooks/useContratistas';
import { useCentros } from '@/hooks/useCentros';

interface HPTWizardProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  operacionId?: string;
}

export const HPTWizard = ({ onSubmit, onCancel, operacionId }: HPTWizardProps) => {
  const { operaciones } = useOperaciones();
  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  const { centros } = useCentros();

  const [formData, setFormData] = useState({
    operacion_id: operacionId || '',
    codigo: '',
    fecha_programada: new Date().toISOString().split('T')[0],
    hora_inicio: '',
    hora_fin: '',
    supervisor: '',
    lugar_especifico: '',
    descripcion_trabajo: '',
    tipo_trabajo: '',
    plan_trabajo: '',
    riesgos_identificados: [],
    medidas_control: [],
    equipos_requeridos: [],
    personal_asignado: [],
    plan_emergencia: '',
    hospital_cercano: '',
    camara_hiperbarica: '',
    observaciones: ''
  });

  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);

  // Auto-poblar datos cuando se selecciona una operación
  useEffect(() => {
    const loadOperacionData = async () => {
      if (!formData.operacion_id) return;

      try {
        const { data: operacion, error } = await supabase
          .from('operacion')
          .select(`
            *,
            salmoneras:salmonera_id (nombre, rut),
            centros:centro_id (nombre, ubicacion),
            contratistas:contratista_id (nombre, rut)
          `)
          .eq('id', formData.operacion_id)
          .single();

        if (error) throw error;

        setSelectedOperacion(operacion);
        
        // Auto-poblar campos basado en la operación
        const salmonera = salmoneras.find(s => s.id === operacion.salmonera_id);
        const centro = centros.find(s => s.id === operacion.centro_id);
        const contratista = contratistas.find(c => c.id === operacion.contratista_id);
        
        setFormData(prev => ({
          ...prev,
          codigo: `HPT-${operacion.codigo}-${new Date().getFullYear()}`,
          descripcion_trabajo: operacion.tareas || '',
          lugar_especifico: centro?.nombre || '',
        }));

      } catch (error) {
        console.error('Error loading operation data:', error);
      }
    };

    loadOperacionData();
  }, [formData.operacion_id, salmoneras, centros, contratistas]);

  const handleOperacionChange = (value: string) => {
    setFormData(prev => ({ ...prev, operacion_id: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...formData,
      estado: 'borrador',
      firmado: false,
      form_version: 1
    });
  };

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>Crear Nuevo HPT</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selección de Operación */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="operacion">Operación *</Label>
              <Select
                value={formData.operacion_id}
                onValueChange={handleOperacionChange}
                disabled={!!operacionId}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar operación..." />
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

            <div>
              <Label htmlFor="codigo">Código HPT *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
                placeholder="Código automático del HPT"
                required
              />
            </div>
          </div>

          {/* Información auto-poblada de la operación */}
          {selectedOperacion && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-900 mb-2">Información de la Operación</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div>
                  <span className="font-medium">Salmonera:</span>
                  <p>{selectedOperacion.salmoneras?.nombre || 'No asignada'}</p>
                </div>
                <div>
                  <span className="font-medium">Centro:</span>
                  <p>{selectedOperacion.centros?.nombre || 'No asignado'}</p>
                </div>
                <div>
                  <span className="font-medium">Contratista:</span>
                  <p>{selectedOperacion.contratistas?.nombre || 'No asignado'}</p>
                </div>
              </div>
            </div>
          )}

          {/* Fechas y horarios */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fecha_programada">Fecha Programada *</Label>
              <Input
                id="fecha_programada"
                type="date"
                value={formData.fecha_programada}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha_programada: e.target.value }))}
                required
              />
            </div>
            <div>
              <Label htmlFor="hora_inicio">Hora Inicio</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => setFormData(prev => ({ ...prev, hora_inicio: e.target.value }))}
              />
            </div>
            <div>
              <Label htmlFor="hora_fin">Hora Fin</Label>
              <Input
                id="hora_fin"
                type="time"
                value={formData.hora_fin}
                onChange={(e) => setFormData(prev => ({ ...prev, hora_fin: e.target.value }))}
              />
            </div>
          </div>

          {/* Información del trabajo */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="supervisor">Supervisor *</Label>
              <Input
                id="supervisor"
                value={formData.supervisor}
                onChange={(e) => setFormData(prev => ({ ...prev, supervisor: e.target.value }))}
                placeholder="Nombre del supervisor responsable"
                required
              />
            </div>
            
            <div>
              <Label htmlFor="lugar_especifico">Lugar Específico</Label>
              <Input
                id="lugar_especifico"
                value={formData.lugar_especifico}
                onChange={(e) => setFormData(prev => ({ ...prev, lugar_especifico: e.target.value }))}
                placeholder="Ubicación específica del trabajo"
              />
            </div>

            <div>
              <Label htmlFor="descripcion_trabajo">Descripción del Trabajo *</Label>
              <Textarea
                id="descripcion_trabajo"
                value={formData.descripcion_trabajo}
                onChange={(e) => setFormData(prev => ({ ...prev, descripcion_trabajo: e.target.value }))}
                placeholder="Describe detalladamente el trabajo a realizar..."
                rows={3}
                required
              />
            </div>

            <div>
              <Label htmlFor="plan_trabajo">Plan de Trabajo *</Label>
              <Textarea
                id="plan_trabajo"
                value={formData.plan_trabajo}
                onChange={(e) => setFormData(prev => ({ ...prev, plan_trabajo: e.target.value }))}
                placeholder="Detalla el plan paso a paso..."
                rows={3}
                required
              />
            </div>
          </div>

          {/* Seguridad */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="plan_emergencia">Plan de Emergencia</Label>
              <Textarea
                id="plan_emergencia"
                value={formData.plan_emergencia}
                onChange={(e) => setFormData(prev => ({ ...prev, plan_emergencia: e.target.value }))}
                placeholder="Procedimientos en caso de emergencia..."
                rows={2}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hospital_cercano">Hospital Más Cercano</Label>
                <Input
                  id="hospital_cercano"
                  value={formData.hospital_cercano}
                  onChange={(e) => setFormData(prev => ({ ...prev, hospital_cercano: e.target.value }))}
                  placeholder="Nombre y ubicación del hospital"
                />
              </div>
              <div>
                <Label htmlFor="camara_hiperbarica">Cámara Hiperbárica</Label>
                <Input
                  id="camara_hiperbarica"
                  value={formData.camara_hiperbarica}
                  onChange={(e) => setFormData(prev => ({ ...prev, camara_hiperbarica: e.target.value }))}
                  placeholder="Ubicación de cámara hiperbárica"
                />
              </div>
            </div>
          </div>

          {/* Observaciones */}
          <div>
            <Label htmlFor="observaciones">Observaciones Adicionales</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              placeholder="Observaciones adicionales..."
              rows={2}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="submit" className="flex-1">
              Crear HPT
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
