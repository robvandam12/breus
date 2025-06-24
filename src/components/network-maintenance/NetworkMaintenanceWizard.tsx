
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X, Save, ArrowLeft, ArrowRight } from "lucide-react";
import { useMaintenanceNetworks } from '@/hooks/useMaintenanceNetworks';
import { EncabezadoGeneral } from './forms/EncabezadoGeneral';
import { DotacionBuceo } from './forms/DotacionBuceo';
import { EquiposSuperficie } from './forms/EquiposSuperficie';
import { FaenasMantencion } from './forms/FaenasMantencion';

interface NetworkMaintenanceWizardProps {
  operacionId: string;
  tipoFormulario: 'mantencion' | 'faena_redes';
  onComplete: () => void;
  onCancel: () => void;
  editingFormId?: string | null;
  readOnly?: boolean;
}

export const NetworkMaintenanceWizard = ({
  operacionId,
  tipoFormulario,
  onComplete,
  onCancel,
  editingFormId,
  readOnly = false
}: NetworkMaintenanceWizardProps) => {
  const { createMaintenanceForm, isCreating } = useMaintenanceNetworks();
  const [currentStep, setCurrentStep] = useState(1);
  
  const [formData, setFormData] = useState({
    codigo: `${tipoFormulario === 'mantencion' ? 'MAN' : 'FAE'}-${Date.now().toString().slice(-6)}`,
    tipo_formulario: tipoFormulario,
    operacion_id: operacionId,
    
    // Encabezado General
    lugar_trabajo: '',
    fecha: new Date().toISOString().split('T')[0],
    temperatura: 0,
    hora_inicio: '',
    hora_termino: '',
    profundidad_max: 0,
    nave_maniobras: '',
    team_s: '',
    team_be: '',
    team_bi: '',
    matricula_nave: '',
    estado_puerto: 'calmo',
    
    // Datos específicos por tipo
    supervisor_faena: '',
    obs_generales: '',
  });

  const [dotacion, setDotacion] = useState([{
    id: 'member-1',
    rol: '',
    nombre: '',
    apellido: '',
    matricula: '',
    contratista: false,
    equipo: '',
    hora_inicio_buzo: '',
    hora_fin_buzo: '',
    profundidad: 0
  }]);

  const [equiposSuperficie, setEquiposSuperficie] = useState([{
    id: 'equipo-1',
    equipo_sup: '',
    matricula_eq: '',
    horometro_ini: 0,
    horometro_fin: 0
  }]);

  const [faenasMantencion, setFaenasMantencion] = useState([{
    id: 'faena-1',
    jaulas: '',
    cantidad: 0,
    ubicacion: '',
    tipo_rotura: '',
    retensado: false,
    descostura: false,
    objetos: false,
    otros: '',
    obs_faena: ''
  }]);

  const steps = [
    { number: 1, title: "Información General" },
    { number: 2, title: "Dotación de Buceo" },
    { number: 3, title: "Equipos de Superficie" },
    { number: 4, title: "Faenas de Mantención" },
    { number: 5, title: "Sistemas y Equipos" },
    { number: 6, title: "Resumen y Firmas" }
  ];

  const handleFormDataChange = (field: string, value: any) => {
    if (readOnly) return;
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmit = async () => {
    if (readOnly) return;
    
    try {
      await createMaintenanceForm({
        ...formData,
        multix_data: {
          encabezado: formData,
          dotacion,
          equipos_superficie: equiposSuperficie,
          faenas_mantencion: faenasMantencion,
          tipo_formulario: tipoFormulario
        }
      });
      onComplete();
    } catch (error) {
      console.error('Error creating form:', error);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <EncabezadoGeneral 
              data={formData}
              onChange={handleFormDataChange}
              readOnly={readOnly}
            />
            
            {tipoFormulario === 'faena_redes' && (
              <Card>
                <CardHeader>
                  <CardTitle>Información Específica de Faena</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="supervisor_faena">Supervisor (nombre)</Label>
                    <Input
                      id="supervisor_faena"
                      value={formData.supervisor_faena}
                      onChange={(e) => handleFormDataChange('supervisor_faena', e.target.value)}
                      disabled={readOnly}
                    />
                  </div>
                  <div>
                    <Label htmlFor="obs_generales">Observaciones generales</Label>
                    <Textarea
                      id="obs_generales"
                      value={formData.obs_generales}
                      onChange={(e) => handleFormDataChange('obs_generales', e.target.value)}
                      disabled={readOnly}
                      rows={4}
                    />
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );

      case 2:
        return (
          <DotacionBuceo 
            data={dotacion}
            onChange={setDotacion}
            readOnly={readOnly}
          />
        );

      case 3:
        return (
          <EquiposSuperficie 
            data={equiposSuperficie}
            onChange={setEquiposSuperficie}
            readOnly={readOnly}
          />
        );

      case 4:
        return (
          <FaenasMantencion 
            data={faenasMantencion}
            onChange={setFaenasMantencion}
            readOnly={readOnly}
          />
        );

      case 5:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Sistemas y Equipos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8 text-gray-500">
                <p>Sección en desarrollo</p>
                <p className="text-sm">Los campos de sistemas y equipos se implementarán en la siguiente iteración</p>
              </div>
            </CardContent>
          </Card>
        );

      case 6:
        return (
          <Card>
            <CardHeader>
              <CardTitle>Resumen y Firmas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="supervisor_nombre">Supervisor de Buceo - nombre</Label>
                    <Input
                      id="supervisor_nombre"
                      placeholder="Nombre del supervisor"
                      disabled={readOnly}
                    />
                  </div>
                  <div>
                    <Label htmlFor="jefe_centro_nombre">Jefe de Centro - nombre</Label>
                    <Input
                      id="jefe_centro_nombre"
                      placeholder="Nombre del jefe de centro"
                      disabled={readOnly}
                    />
                  </div>
                </div>
                
                <div className="text-center py-8 text-gray-500">
                  <p>Sistema de firmas digitales</p>
                  <p className="text-sm">La funcionalidad de firmas se implementará en la siguiente iteración</p>
                </div>
              </div>
            </CardContent>
          </Card>
        );

      default:
        return <div>Paso no encontrado</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">
            {readOnly ? 'Ver ' : ''}
            {tipoFormulario === 'mantencion' ? 'Boleta de Mantención de Redes' : 'Boleta de Faena de Redes'}
          </h2>
          <p className="text-gray-600">
            {readOnly ? 'Visualizar datos del formulario operativo' : 'Complete los datos del formulario operativo'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onCancel}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            {readOnly ? 'Cerrar' : 'Cancelar'}
          </Button>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="flex justify-between mb-8 overflow-x-auto">
        {steps.map((step, index) => (
          <div key={step.number} className="flex items-center min-w-0">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              currentStep >= step.number
                ? "bg-blue-600 text-white"
                : "bg-gray-200 text-gray-600"
            }`}>
              {step.number}
            </div>
            <div className="ml-2 min-w-0">
              <div className="text-sm font-medium truncate">{step.title}</div>
            </div>
            {index < steps.length - 1 && (
              <div className="hidden md:block w-16 h-px bg-gray-300 mx-4 flex-shrink-0"></div>
            )}
          </div>
        ))}
      </div>

      {/* Current Step Content */}
      <div className="min-h-[400px]">
        {renderStep()}
      </div>

      {/* Navigation Buttons */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentStep === 1 || readOnly}
        >
          <ArrowLeft className="w-4 h-4 mr-2" />
          Anterior
        </Button>

        <div className="flex gap-2">
          {currentStep < steps.length ? (
            <Button onClick={handleNext} disabled={readOnly}>
              Siguiente
              <ArrowRight className="w-4 h-4 ml-2" />
            </Button>
          ) : (
            !readOnly && (
              <Button onClick={handleSubmit} disabled={isCreating} className="bg-green-600 hover:bg-green-700">
                <Save className="w-4 h-4 mr-2" />
                {isCreating ? 'Guardando...' : 'Guardar Formulario'}
              </Button>
            )
          )}
        </div>
      </div>
    </div>
  );
};
