import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { ChevronLeft, ChevronRight, Save } from 'lucide-react';
import { useAnexoBravoWizard } from '@/hooks/useAnexoBravoWizard';
import { useAnexoBravo } from '@/hooks/useAnexoBravo';
import { useOperaciones } from '@/hooks/useOperaciones';

interface FullAnexoBravoFormProps {
  operacionId?: string;
  anexoId?: string;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const FullAnexoBravoForm = ({ 
  operacionId, 
  anexoId,
  onSubmit, 
  onCancel 
}: FullAnexoBravoFormProps) => {
  const { createAnexoBravo } = useAnexoBravo();
  const { operaciones } = useOperaciones();
  
  // Find the operation if operacionId is provided
  const operacion = operacionId ? operaciones.find(op => op.id === operacionId) : null;

  const {
    currentStep,
    data,
    updateData,
    nextStep,
    prevStep,
    isLastStep,
    canProceed
  } = useAnexoBravoWizard(operacionId);

  const [isSubmitting, setIsSubmitting] = useState(false);

  // Auto-populate data if operation is available
  useEffect(() => {
    if (operacion && operacionId) {
      updateData({
        operacion_id: operacionId,
        empresa_nombre: operacion.salmoneras?.nombre || operacion.contratistas?.nombre || '',
        lugar_faena: operacion.centros?.nombre || '',
      });
    }
  }, [operacion, operacionId, updateData]);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const anexoData = {
        ...data,
        operacion_id: operacionId || null, // Allow null for independent anexos
        estado: 'completado',
        progreso: 100
      };

      console.log('Submitting Anexo Bravo:', anexoData);
      
      await createAnexoBravo(anexoData);
      onSubmit(anexoData);
    } catch (error) {
      console.error('Error creating Anexo Bravo:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo">Código del Anexo</Label>
                <Input
                  id="codigo"
                  value={data.codigo || ''}
                  onChange={(e) => updateData({ codigo: e.target.value })}
                />
              </div>
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  type="date"
                  id="fecha"
                  value={data.fecha || ''}
                  onChange={(e) => updateData({ fecha: e.target.value })}
                />
              </div>
            </div>
            <div className="mt-4">
              <Label htmlFor="empresa_nombre">Empresa</Label>
              <Input
                id="empresa_nombre"
                value={data.empresa_nombre || ''}
                onChange={(e) => updateData({ empresa_nombre: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="lugar_faena">Lugar de la Faena</Label>
              <Input
                id="lugar_faena"
                value={data.lugar_faena || ''}
                onChange={(e) => updateData({ lugar_faena: e.target.value })}
              />
            </div>
          </div>
        );
      case 2:
        return (
          <div>
            <div className="mt-4">
              <Label htmlFor="supervisor">Supervisor</Label>
              <Input
                id="supervisor"
                value={data.supervisor || ''}
                onChange={(e) => updateData({ supervisor: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="jefe_centro">Jefe de Centro</Label>
              <Input
                id="jefe_centro"
                value={data.jefe_centro || ''}
                onChange={(e) => updateData({ jefe_centro: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="actividad">Actividad</Label>
              <Textarea
                id="actividad"
                value={data.actividad || ''}
                onChange={(e) => updateData({ actividad: e.target.value })}
              />
            </div>
          </div>
        );
      case 3:
        return (
          <div>
            <div className="mt-4">
              <Label htmlFor="equipo_emergencia">Equipo de Emergencia</Label>
              <Textarea
                id="equipo_emergencia"
                value={data.equipo_emergencia || ''}
                onChange={(e) => updateData({ equipo_emergencia: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="procedimiento_emergencia">Procedimiento de Emergencia</Label>
              <Textarea
                id="procedimiento_emergencia"
                value={data.procedimiento_emergencia || ''}
                onChange={(e) => updateData({ procedimiento_emergencia: e.target.value })}
              />
            </div>
          </div>
        );
      case 4:
        return (
          <div>
            <div className="mt-4">
              <Label htmlFor="riesgos_tarea">Riesgos de la Tarea</Label>
              <Textarea
                id="riesgos_tarea"
                value={data.riesgos_tarea || ''}
                onChange={(e) => updateData({ riesgos_tarea: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="medidas_preventivas">Medidas Preventivas</Label>
              <Textarea
                id="medidas_preventivas"
                value={data.medidas_preventivas || ''}
                onChange={(e) => updateData({ medidas_preventivas: e.target.value })}
              />
            </div>
          </div>
        );
      case 5:
        return (
          <div>
            <div className="mt-4">
              <Label htmlFor="lista_verificacion">Lista de Verificación</Label>
              <Textarea
                id="lista_verificacion"
                value={data.lista_verificacion || ''}
                onChange={(e) => updateData({ lista_verificacion: e.target.value })}
              />
            </div>
            <div className="mt-4">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={data.observaciones || ''}
                onChange={(e) => updateData({ observaciones: e.target.value })}
              />
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="border-b pb-4">
        <h2 className="text-2xl font-bold text-gray-900">
          {anexoId ? 'Editar Anexo Bravo' : operacionId ? 'Crear Anexo Bravo - Operación' : 'Crear Anexo Bravo Independiente'}
        </h2>
        {operacion && (
          <p className="text-gray-600 mt-1">
            Operación: {operacion.codigo} - {operacion.nombre}
          </p>
        )}
        {!operacionId && !anexoId && (
          <p className="text-gray-600 mt-1">
            Anexo Bravo independiente (sin operación asociada)
          </p>
        )}
      </div>

      {/* Progress Indicator */}
      <div className="flex items-center space-x-4">
        {[1, 2, 3, 4, 5].map((step) => (
          <div key={step} className="flex items-center">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                currentStep >= step
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-600'
              }`}
            >
              {step}
            </div>
            {step < 5 && (
              <div
                className={`w-16 h-1 ${
                  currentStep > step ? 'bg-green-600' : 'bg-gray-200'
                }`}
              />
            )}
          </div>
        ))}
      </div>

      {/* Step Content */}
      <Card>
        <CardContent className="p-6">
          {renderStepContent()}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <div>
          {currentStep > 1 && (
            <Button variant="outline" onClick={prevStep}>
              <ChevronLeft className="w-4 h-4 mr-2" />
              Anterior
            </Button>
          )}
        </div>

        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          
          {isLastStep ? (
            <Button 
              onClick={handleSubmit}
              disabled={!canProceed || isSubmitting}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  {anexoId ? 'Actualizando...' : 'Creando...'}
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  {anexoId ? 'Actualizar Anexo Bravo' : 'Crear Anexo Bravo'}
                </>
              )}
            </Button>
          ) : (
            <Button 
              onClick={nextStep}
              disabled={!canProceed}
            >
              Siguiente
              <ChevronRight className="w-4 h-4 ml-2" />
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
