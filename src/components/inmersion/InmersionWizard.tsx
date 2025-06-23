
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, ArrowRight, ArrowLeft, X } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { cn } from "@/lib/utils";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useUserProfile } from "@/hooks/useUserProfile";
import { toast } from "@/hooks/use-toast";

interface InmersionWizardProps {
  operationId?: string;
  onComplete: (data: any) => void;
  onCancel: () => void;
  initialData?: any;
  readOnly?: boolean;
}

export const InmersionWizard = ({ 
  operationId, 
  onComplete, 
  onCancel, 
  initialData,
  readOnly = false 
}: InmersionWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    codigo: initialData?.codigo || '',
    operacion_id: operationId || initialData?.operacion_id || '',
    fecha_inmersion: initialData?.fecha_inmersion ? new Date(initialData.fecha_inmersion) : new Date(),
    hora_inicio: initialData?.hora_inicio || '',
    hora_fin: initialData?.hora_fin || '',
    objetivo: initialData?.objetivo || '',
    profundidad_max: initialData?.profundidad_max?.toString() || '',
    temperatura_agua: initialData?.temperatura_agua?.toString() || '',
    visibilidad: initialData?.visibilidad?.toString() || '',
    corriente: initialData?.corriente || '',
    supervisor_nombre: initialData?.supervisor_nombre || '',
    supervisor_apellido: initialData?.supervisor_apellido || '',
    buzo_principal_nombre: initialData?.buzo_principal_nombre || '',
    buzo_principal_apellido: initialData?.buzo_principal_apellido || '',
    buzo_asistente_nombre: initialData?.buzo_asistente_nombre || '',
    buzo_asistente_apellido: initialData?.buzo_asistente_apellido || '',
    observaciones: initialData?.observaciones || '',
    estado: initialData?.estado || 'planificada',
    planned_bottom_time: initialData?.planned_bottom_time?.toString() || ''
  });

  const { operaciones } = useOperaciones();
  const { profile, getFormDefaults } = useUserProfile();
  const selectedOperation = operaciones.find(op => op.id === operationId);

  useEffect(() => {
    if (profile && !initialData) {
      const defaults = getFormDefaults();
      setFormData(prev => ({
        ...prev,
        supervisor_nombre: defaults.nombre,
        supervisor_apellido: defaults.apellido,
        buzo_principal_nombre: defaults.nombre,
        buzo_principal_apellido: defaults.apellido,
      }));
    }
  }, [profile, initialData]);

  useEffect(() => {
    if (operationId && !formData.codigo && !initialData) {
      const timestamp = Date.now().toString().slice(-6);
      const operationCode = selectedOperation?.codigo || 'OP';
      setFormData(prev => ({
        ...prev,
        codigo: `INM-${operationCode}-${timestamp}`
      }));
    }
  }, [operationId, selectedOperation, initialData]);

  const handleInputChange = (field: string, value: any) => {
    if (readOnly) return;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateStep = (step: number) => {
    switch (step) {
      case 1:
        return formData.codigo && formData.operacion_id && formData.objetivo;
      case 2:
        return formData.fecha_inmersion && formData.hora_inicio && formData.profundidad_max;
      case 3:
        return formData.supervisor_nombre && formData.supervisor_apellido && 
               formData.buzo_principal_nombre && formData.buzo_principal_apellido;
      case 4:
        return formData.temperatura_agua && formData.visibilidad && formData.corriente;
      default:
        return true;
    }
  };

  const handleNext = () => {
    if (readOnly || validateStep(currentStep)) {
      setCurrentStep(prev => prev + 1);
    } else {
      toast({
        title: "Campos requeridos",
        description: "Por favor complete todos los campos obligatorios",
        variant: "destructive"
      });
    }
  };

  const handlePrevious = () => {
    setCurrentStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    if (readOnly) {
      onCancel();
      return;
    }
    
    if (validateStep(currentStep)) {
      const submissionData = {
        ...formData,
        supervisor: `${formData.supervisor_nombre} ${formData.supervisor_apellido}`.trim(),
        buzo_principal: `${formData.buzo_principal_nombre} ${formData.buzo_principal_apellido}`.trim(),
        buzo_asistente: formData.buzo_asistente_nombre && formData.buzo_asistente_apellido 
          ? `${formData.buzo_asistente_nombre} ${formData.buzo_asistente_apellido}`.trim()
          : null,
        profundidad_max: parseFloat(formData.profundidad_max),
        temperatura_agua: parseFloat(formData.temperatura_agua),
        visibilidad: parseFloat(formData.visibilidad),
        planned_bottom_time: formData.planned_bottom_time ? parseInt(formData.planned_bottom_time) : null
      };
      onComplete(submissionData);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo">Código de Inmersión *</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => handleInputChange('codigo', e.target.value)}
                  placeholder="INM-001"
                  disabled={readOnly}
                />
              </div>
              
              <div>
                <Label htmlFor="operacion">Operación *</Label>
                <Select 
                  value={formData.operacion_id} 
                  onValueChange={(value) => handleInputChange('operacion_id', value)}
                  disabled={readOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar operación" />
                  </SelectTrigger>
                  <SelectContent>
                    {operaciones.map((op) => (
                      <SelectItem key={op.id} value={op.id}>
                        {op.codigo} - {op.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="objetivo">Objetivo de la Inmersión *</Label>
              <Textarea
                id="objetivo"
                value={formData.objetivo}
                onChange={(e) => handleInputChange('objetivo', e.target.value)}
                placeholder="Descripción del objetivo de la inmersión"
                rows={3}
                disabled={readOnly}
              />
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label>Fecha de Inmersión *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button 
                      variant="outline" 
                      className={cn("w-full justify-start text-left font-normal", !formData.fecha_inmersion && "text-muted-foreground")}
                      disabled={readOnly}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.fecha_inmersion ? format(formData.fecha_inmersion, "PPP", { locale: es }) : <span>Seleccionar fecha</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.fecha_inmersion}
                      onSelect={(date) => handleInputChange('fecha_inmersion', date)}
                      initialFocus
                      disabled={readOnly}
                    />
                  </PopoverContent>
                </Popover>
              </div>

              <div>
                <Label htmlFor="hora_inicio">Hora de Inicio *</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) => handleInputChange('hora_inicio', e.target.value)}
                  disabled={readOnly}
                />
              </div>

              <div>
                <Label htmlFor="hora_fin">Hora de Fin</Label>
                <Input
                  id="hora_fin"
                  type="time"
                  value={formData.hora_fin}
                  onChange={(e) => handleInputChange('hora_fin', e.target.value)}
                  disabled={readOnly}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="profundidad_max">Profundidad Máxima (m) *</Label>
                <Input
                  id="profundidad_max"
                  type="number"
                  value={formData.profundidad_max}
                  onChange={(e) => handleInputChange('profundidad_max', e.target.value)}
                  placeholder="30"
                  disabled={readOnly}
                />
              </div>

              <div>
                <Label htmlFor="planned_bottom_time">Tiempo Planeado en Fondo (min)</Label>
                <Input
                  id="planned_bottom_time"
                  type="number"
                  value={formData.planned_bottom_time}
                  onChange={(e) => handleInputChange('planned_bottom_time', e.target.value)}
                  placeholder="45"
                  disabled={readOnly}
                />
              </div>
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Personal de Buceo</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supervisor_nombre">Nombre del Supervisor *</Label>
                <Input
                  id="supervisor_nombre"
                  value={formData.supervisor_nombre}
                  onChange={(e) => handleInputChange('supervisor_nombre', e.target.value)}
                  placeholder="Juan"
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="supervisor_apellido">Apellido del Supervisor *</Label>
                <Input
                  id="supervisor_apellido"
                  value={formData.supervisor_apellido}
                  onChange={(e) => handleInputChange('supervisor_apellido', e.target.value)}
                  placeholder="Pérez"
                  disabled={readOnly}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buzo_principal_nombre">Nombre del Buzo Principal *</Label>
                <Input
                  id="buzo_principal_nombre"
                  value={formData.buzo_principal_nombre}
                  onChange={(e) => handleInputChange('buzo_principal_nombre', e.target.value)}
                  placeholder="María"
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="buzo_principal_apellido">Apellido del Buzo Principal *</Label>
                <Input
                  id="buzo_principal_apellido"
                  value={formData.buzo_principal_apellido}
                  onChange={(e) => handleInputChange('buzo_principal_apellido', e.target.value)}
                  placeholder="González"
                  disabled={readOnly}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buzo_asistente_nombre">Nombre del Buzo Asistente</Label>
                <Input
                  id="buzo_asistente_nombre"
                  value={formData.buzo_asistente_nombre}
                  onChange={(e) => handleInputChange('buzo_asistente_nombre', e.target.value)}
                  placeholder="Carlos"
                  disabled={readOnly}
                />
              </div>
              <div>
                <Label htmlFor="buzo_asistente_apellido">Apellido del Buzo Asistente</Label>
                <Input
                  id="buzo_asistente_apellido"
                  value={formData.buzo_asistente_apellido}
                  onChange={(e) => handleInputChange('buzo_asistente_apellido', e.target.value)}
                  placeholder="López"
                  disabled={readOnly}
                />
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Condiciones del Ambiente</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="temperatura_agua">Temperatura del Agua (°C) *</Label>
                <Input
                  id="temperatura_agua"
                  type="number"
                  value={formData.temperatura_agua}
                  onChange={(e) => handleInputChange('temperatura_agua', e.target.value)}
                  placeholder="15"
                  disabled={readOnly}
                />
              </div>

              <div>
                <Label htmlFor="visibilidad">Visibilidad (m) *</Label>
                <Input
                  id="visibilidad"
                  type="number"
                  value={formData.visibilidad}
                  onChange={(e) => handleInputChange('visibilidad', e.target.value)}
                  placeholder="10"
                  disabled={readOnly}
                />
              </div>

              <div>
                <Label htmlFor="corriente">Corriente *</Label>
                <Select 
                  value={formData.corriente} 
                  onValueChange={(value) => handleInputChange('corriente', value)}
                  disabled={readOnly}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nula">Nula</SelectItem>
                    <SelectItem value="ligera">Ligera</SelectItem>
                    <SelectItem value="moderada">Moderada</SelectItem>
                    <SelectItem value="fuerte">Fuerte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                placeholder="Observaciones adicionales sobre la inmersión"
                rows={3}
                disabled={readOnly}
              />
            </div>
          </div>
        );

      default:
        return <div>Paso no encontrado</div>;
    }
  };

  const steps = [
    { number: 1, title: "Información General" },
    { number: 2, title: "Fecha y Horarios" },
    { number: 3, title: "Personal de Buceo" },
    { number: 4, title: "Condiciones" }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">
          {readOnly ? 'Ver Inmersión' : initialData ? 'Editar Inmersión' : 'Nueva Inmersión'}
        </h1>
        <Button variant="outline" onClick={onCancel}>
          <X className="w-4 h-4 mr-2" />
          {readOnly ? 'Cerrar' : 'Cancelar'}
        </Button>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center">
            <div className={cn(
              "flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium",
              currentStep >= step.number
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600"
            )}>
              {step.number}
            </div>
            <div className="ml-2">
              <div className="text-sm font-medium">{step.title}</div>
            </div>
            {index < steps.length - 1 && (
              <div className="hidden md:block w-16 h-px bg-gray-300 mx-4"></div>
            )}
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Paso {currentStep}: {steps[currentStep - 1]?.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {renderStep()}
          </motion.div>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      {!readOnly && (
        <div className="flex justify-between">
          <Button
            variant="outline"
            onClick={handlePrevious}
            disabled={currentStep === 1}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Anterior
          </Button>

          {currentStep < steps.length ? (
            <Button onClick={handleNext}>
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
              {initialData ? 'Actualizar Inmersión' : 'Crear Inmersión'}
            </Button>
          )}
        </div>
      )}

      {readOnly && (
        <div className="flex justify-center">
          <Button onClick={onCancel} variant="outline">
            Cerrar
          </Button>
        </div>
      )}
    </div>
  );
};
