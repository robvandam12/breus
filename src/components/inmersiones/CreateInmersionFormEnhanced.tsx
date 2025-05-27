
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { Anchor, X, Users } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useEquiposBuceo } from "@/hooks/useEquiposBuceo";

interface CreateInmersionFormEnhancedProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  defaultOperacionId?: string;
}

export const CreateInmersionFormEnhanced = ({ 
  onSubmit, 
  onCancel, 
  defaultOperacionId 
}: CreateInmersionFormEnhancedProps) => {
  const { operaciones } = useOperaciones();
  const { equipos } = useEquiposBuceo();
  
  const [formData, setFormData] = useState({
    operacion_id: defaultOperacionId || '',
    fecha_inmersion: new Date().toISOString().split('T')[0],
    hora_inicio: '',
    hora_fin: '',
    profundidad_maxima: '',
    buzo_principal: '',
    buzo_asistente: '',
    supervisor: '',
    objetivo: '',
    temperatura_agua: '15',
    visibilidad: '10',
    corriente: 'moderada',
    observaciones: ''
  });

  // Pre-populate data from operation
  const operacion = operaciones.find(op => op.id === formData.operacion_id);
  const equipoBuceo = equipos.find(eq => eq.id === operacion?.equipo_buceo_id);

  useEffect(() => {
    if (operacion && equipoBuceo) {
      const supervisor = equipoBuceo.miembros?.find(m => m.rol_equipo === 'supervisor');
      const buzoPrincipal = equipoBuceo.miembros?.find(m => m.rol_equipo === 'buzo_principal');
      const buzoAsistente = equipoBuceo.miembros?.find(m => m.rol_equipo === 'buzo_asistente');

      setFormData(prev => ({
        ...prev,
        supervisor: supervisor ? `${supervisor.usuario?.nombre} ${supervisor.usuario?.apellido}` : '',
        buzo_principal: buzoPrincipal ? `${buzoPrincipal.usuario?.nombre} ${buzoPrincipal.usuario?.apellido}` : '',
        buzo_asistente: buzoAsistente ? `${buzoAsistente.usuario?.nombre} ${buzoAsistente.usuario?.apellido}` : '',
      }));
    }
  }, [operacion, equipoBuceo]);

  const operacionOptions = operaciones.map(op => ({
    value: op.id,
    label: `${op.codigo} - ${op.nombre}`
  }));

  const corrienteOptions = [
    { value: 'leve', label: 'Leve' },
    { value: 'moderada', label: 'Moderada' },
    { value: 'fuerte', label: 'Fuerte' }
  ];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!operacion?.equipo_buceo_id) {
      alert('La operación seleccionada debe tener un equipo de buceo asignado.');
      return;
    }
    
    const codigo = `INM-${Date.now().toString().slice(-6)}`;
    
    await onSubmit({
      ...formData,
      codigo,
      profundidad_maxima: parseFloat(formData.profundidad_maxima) || 0,
      temperatura_agua: parseFloat(formData.temperatura_agua) || 15,
      visibilidad: parseFloat(formData.visibilidad) || 10,
      estado: 'planificada'
    });
  };

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Anchor className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">Nueva Inmersión</CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  Planifique una nueva inmersión de buceo
                </p>
              </div>
            </div>
            <Button variant="outline" size="sm" onClick={onCancel}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="operacion_id">Operación *</Label>
                <EnhancedSelect
                  options={operacionOptions}
                  value={formData.operacion_id}
                  onValueChange={(value) => handleInputChange('operacion_id', value)}
                  placeholder="Seleccione una operación"
                />
              </div>
              
              <div>
                <Label htmlFor="fecha_inmersion">Fecha de Inmersión *</Label>
                <Input
                  type="date"
                  value={formData.fecha_inmersion}
                  onChange={(e) => handleInputChange('fecha_inmersion', e.target.value)}
                  required
                />
              </div>
            </div>

            {/* Time and Depth */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="hora_inicio">Hora de Inicio *</Label>
                <Input
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) => handleInputChange('hora_inicio', e.target.value)}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="hora_fin">Hora de Fin</Label>
                <Input
                  type="time"
                  value={formData.hora_fin}
                  onChange={(e) => handleInputChange('hora_fin', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
                <Input
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.profundidad_maxima}
                  onChange={(e) => handleInputChange('profundidad_maxima', e.target.value)}
                  placeholder="0.0"
                />
              </div>
            </div>

            {/* Team Information - Pre-populated */}
            <div className="space-y-4">
              <div className="flex items-center gap-2 mb-3">
                <Users className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold">Equipo de Buceo</h3>
                {equipoBuceo && (
                  <span className="text-sm text-gray-500">
                    (Equipo: {equipoBuceo.nombre})
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="supervisor">Supervisor *</Label>
                  <Input
                    value={formData.supervisor}
                    onChange={(e) => handleInputChange('supervisor', e.target.value)}
                    placeholder="Supervisor asignado"
                    required
                    className={equipoBuceo ? "bg-blue-50" : ""}
                    readOnly={!!equipoBuceo}
                  />
                </div>

                <div>
                  <Label htmlFor="buzo_principal">Buzo Principal *</Label>
                  <Input
                    value={formData.buzo_principal}
                    onChange={(e) => handleInputChange('buzo_principal', e.target.value)}
                    placeholder="Buzo principal"
                    required
                    className={equipoBuceo ? "bg-blue-50" : ""}
                    readOnly={!!equipoBuceo}
                  />
                </div>

                <div>
                  <Label htmlFor="buzo_asistente">Buzo Asistente</Label>
                  <Input
                    value={formData.buzo_asistente}
                    onChange={(e) => handleInputChange('buzo_asistente', e.target.value)}
                    placeholder="Buzo asistente"
                    className={equipoBuceo ? "bg-blue-50" : ""}
                    readOnly={!!equipoBuceo}
                  />
                </div>
              </div>
            </div>

            {/* Environmental Conditions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="temperatura_agua">Temperatura del Agua (°C)</Label>
                <Input
                  type="number"
                  min="0"
                  max="40"
                  value={formData.temperatura_agua}
                  onChange={(e) => handleInputChange('temperatura_agua', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="visibilidad">Visibilidad (m)</Label>
                <Input
                  type="number"
                  min="0"
                  value={formData.visibilidad}
                  onChange={(e) => handleInputChange('visibilidad', e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="corriente">Corriente</Label>
                <EnhancedSelect
                  options={corrienteOptions}
                  value={formData.corriente}
                  onValueChange={(value) => handleInputChange('corriente', value)}
                />
              </div>
            </div>

            {/* Objective */}
            <div>
              <Label htmlFor="objetivo">Objetivo de la Inmersión *</Label>
              <Textarea
                value={formData.objetivo}
                onChange={(e) => handleInputChange('objetivo', e.target.value)}
                placeholder="Describa el objetivo de la inmersión..."
                rows={3}
                required
              />
            </div>

            {/* Observations */}
            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                placeholder="Observaciones adicionales..."
                rows={3}
              />
            </div>

            {/* Warning if no dive team */}
            {operacion && !operacion.equipo_buceo_id && (
              <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                <p className="text-amber-800 text-sm">
                  <strong>Advertencia:</strong> La operación seleccionada no tiene un equipo de buceo asignado. 
                  Se recomienda asignar un equipo antes de crear la inmersión.
                </p>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" className="bg-blue-600 hover:bg-blue-700">
                <Anchor className="w-4 h-4 mr-2" />
                Crear Inmersión
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
