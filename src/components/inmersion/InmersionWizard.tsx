
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { Anchor, Calendar, User, Clock, Target } from "lucide-react";

interface InmersionWizardProps {
  operacionId?: string;
  onComplete: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const InmersionWizard: React.FC<InmersionWizardProps> = ({
  operacionId,
  onComplete,
  onCancel
}) => {
  const { operaciones } = useOperaciones();
  const { equipos } = useEquiposBuceoEnhanced();
  
  const [formData, setFormData] = useState({
    operacion_id: operacionId || '',
    codigo: '',
    fecha_inmersion: new Date().toISOString().split('T')[0],
    hora_inicio: '',
    hora_fin: '',
    buzo_principal: '',
    buzo_principal_id: '',
    buzo_asistente: '',
    buzo_asistente_id: '',
    supervisor: '',
    supervisor_id: '',
    objetivo: '',
    profundidad_max: '',
    temperatura_agua: '',
    visibilidad: '',
    corriente: '',
    observaciones: ''
  });

  // Pre-populate data when operation is selected
  useEffect(() => {
    if (operacionId) {
      const operacion = operaciones.find(op => op.id === operacionId);
      if (operacion) {
        // Generate code based on operation
        const codigo = `INM-${operacion.codigo}-${Date.now().toString().slice(-4)}`;
        
        // Find team members if equipo is assigned
        let supervisor = null;
        let buzoPrincipal = null;
        let buzoAsistente = null;
        
        if (operacion.equipo_buceo_id) {
          const equipo = equipos.find(e => e.id === operacion.equipo_buceo_id);
          if (equipo?.miembros) {
            supervisor = equipo.miembros.find(m => m.rol === 'supervisor');
            const buzos = equipo.miembros.filter(m => m.rol === 'buzo_principal' || m.rol === 'buzo_asistente');
            buzoPrincipal = buzos.find(m => m.rol === 'buzo_principal') || buzos[0];
            buzoAsistente = buzos.find(m => m.rol === 'buzo_asistente') || buzos[1];
          }
        }
        
        setFormData(prev => ({
          ...prev,
          operacion_id: operacionId,
          codigo,
          supervisor: supervisor?.nombre_completo || '',
          supervisor_id: supervisor?.id || '',
          buzo_principal: buzoPrincipal?.nombre_completo || '',
          buzo_principal_id: buzoPrincipal?.id || '',
          buzo_asistente: buzoAsistente?.nombre_completo || '',
          buzo_asistente_id: buzoAsistente?.id || ''
        }));
      }
    }
  }, [operacionId, operaciones, equipos]);

  const operacionOptions = operaciones.map(op => ({
    value: op.id,
    label: `${op.codigo} - ${op.nombre}`
  }));

  // Get all members from all teams for selection
  const allMembers = equipos.flatMap(equipo => equipo.miembros || []);
  
  const buzosOptions = allMembers
    .filter(miembro => miembro.rol === 'buzo_principal' || miembro.rol === 'buzo_asistente')
    .map(miembro => ({
      value: miembro.id,
      label: miembro.nombre_completo || 'Sin nombre'
    }));

  const supervisoresOptions = allMembers
    .filter(miembro => miembro.rol === 'supervisor')
    .map(miembro => ({
      value: miembro.id,
      label: miembro.nombre_completo || 'Sin nombre'
    }));

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = async () => {
    try {
      const inmersionData = {
        ...formData,
        profundidad_max: formData.profundidad_max ? parseFloat(formData.profundidad_max) : 0,
        temperatura_agua: formData.temperatura_agua ? parseFloat(formData.temperatura_agua) : 0,
        visibilidad: formData.visibilidad ? parseFloat(formData.visibilidad) : 0,
        estado: 'planificada'
      };
      
      await onComplete(inmersionData);
    } catch (error) {
      console.error('Error creating inmersion:', error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold flex items-center justify-center gap-2">
          <Anchor className="w-6 h-6 text-blue-600" />
          Nueva Inmersión
        </h2>
        <p className="text-gray-600 mt-2">Complete los datos para crear la inmersión</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Información General
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="operacion_id">Operación *</Label>
              <EnhancedSelect
                options={operacionOptions}
                value={formData.operacion_id}
                onValueChange={(value) => handleInputChange('operacion_id', value)}
                placeholder="Seleccione una operación"
                disabled={!!operacionId}
              />
            </div>
            <div>
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
                placeholder="Código de la inmersión"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fecha_inmersion">Fecha *</Label>
              <Input
                id="fecha_inmersion"
                type="date"
                value={formData.fecha_inmersion}
                onChange={(e) => handleInputChange('fecha_inmersion', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hora_inicio">Hora Inicio *</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => handleInputChange('hora_inicio', e.target.value)}
              />
            </div>
            <div>
              <Label htmlFor="hora_fin">Hora Fin</Label>
              <Input
                id="hora_fin"
                type="time"
                value={formData.hora_fin}
                onChange={(e) => handleInputChange('hora_fin', e.target.value)}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5" />
            Personal Asignado
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="supervisor">Supervisor *</Label>
            <EnhancedSelect
              options={supervisoresOptions}
              value={formData.supervisor_id}
              onValueChange={(value) => {
                const supervisor = allMembers.find(m => m.id === value);
                handleInputChange('supervisor_id', value);
                handleInputChange('supervisor', supervisor?.nombre_completo || '');
              }}
              placeholder="Seleccione un supervisor"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buzo_principal">Buzo Principal *</Label>
              <EnhancedSelect
                options={buzosOptions}
                value={formData.buzo_principal_id}
                onValueChange={(value) => {
                  const buzo = allMembers.find(m => m.id === value);
                  handleInputChange('buzo_principal_id', value);
                  handleInputChange('buzo_principal', buzo?.nombre_completo || '');
                }}
                placeholder="Seleccione el buzo principal"
              />
            </div>
            <div>
              <Label htmlFor="buzo_asistente">Buzo Asistente</Label>
              <EnhancedSelect
                options={buzosOptions}
                value={formData.buzo_asistente_id}
                onValueChange={(value) => {
                  const buzo = allMembers.find(m => m.id === value);
                  handleInputChange('buzo_asistente_id', value);
                  handleInputChange('buzo_asistente', buzo?.nombre_completo || '');
                }}
                placeholder="Seleccione el buzo asistente (opcional)"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5" />
            Detalles de la Inmersión
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="objetivo">Objetivo *</Label>
            <Textarea
              id="objetivo"
              value={formData.objetivo}
              onChange={(e) => handleInputChange('objetivo', e.target.value)}
              placeholder="Describa el objetivo de la inmersión"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="profundidad_max">Profundidad Máxima (m)</Label>
              <Input
                id="profundidad_max"
                type="number"
                step="0.1"
                value={formData.profundidad_max}
                onChange={(e) => handleInputChange('profundidad_max', e.target.value)}
                placeholder="0.0"
              />
            </div>
            <div>
              <Label htmlFor="temperatura_agua">Temperatura del Agua (°C)</Label>
              <Input
                id="temperatura_agua"
                type="number"
                step="0.1"
                value={formData.temperatura_agua}
                onChange={(e) => handleInputChange('temperatura_agua', e.target.value)}
                placeholder="0.0"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="visibilidad">Visibilidad (m)</Label>
              <Input
                id="visibilidad"
                type="number"
                step="0.1"
                value={formData.visibilidad}
                onChange={(e) => handleInputChange('visibilidad', e.target.value)}
                placeholder="0.0"
              />
            </div>
            <div>
              <Label htmlFor="corriente">Corriente</Label>
              <Input
                id="corriente"
                value={formData.corriente}
                onChange={(e) => handleInputChange('corriente', e.target.value)}
                placeholder="Ej: Moderada, Fuerte, Débil"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => handleInputChange('observaciones', e.target.value)}
              placeholder="Observaciones adicionales"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button onClick={handleSubmit}>
          Crear Inmersión
        </Button>
      </div>
    </div>
  );
};
