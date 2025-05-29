
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Progress } from '@/components/ui/progress';
import { EnhancedDigitalSignature } from '@/components/signatures/EnhancedDigitalSignature';
import { FileText, Building, MapPin, Users, Shield, Signature as SignatureIcon } from 'lucide-react';
import { useAnexoBravo } from '@/hooks/useAnexoBravo';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useSalmoneras } from '@/hooks/useSalmoneras';
import { useSitios } from '@/hooks/useSitios';
import { useContratistas } from '@/hooks/useContratistas';
import { useEquipoBuceo } from '@/hooks/useEquipoBuceo';
import { toast } from '@/hooks/use-toast';

interface FullAnexoBravoFormProps {
  operacionId?: string;
  onSubmit?: () => void;
  onCancel?: () => void;
}

export const FullAnexoBravoForm: React.FC<FullAnexoBravoFormProps> = ({
  operacionId,
  onSubmit,
  onCancel
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    operacion_id: operacionId || '',
    codigo: '',
    fecha: new Date().toISOString().split('T')[0],
    lugar_faena: '',
    empresa_nombre: '',
    buzo_o_empresa_nombre: '',
    supervisor_servicio_nombre: '',
    supervisor_mandante_nombre: '',
    observaciones_generales: '',
    anexo_bravo_checklist: {},
    anexo_bravo_trabajadores: [],
    anexo_bravo_firmas: {
      supervisor_servicio_url: '',
      supervisor_mandante_url: ''
    }
  });

  const { operaciones } = useOperaciones();
  const { salmoneras } = useSalmoneras();
  const { sitios } = useSitios();
  const { contratistas } = useContratistas();
  const { equipos } = useEquipoBuceo();
  const { createAnexoBravo, isCreating } = useAnexoBravo();

  // Auto-populate fields when operacion_id changes
  useEffect(() => {
    if (formData.operacion_id) {
      const operacion = operaciones.find(op => op.id === formData.operacion_id);
      if (operacion) {
        const salmonera = salmoneras.find(s => s.id === operacion.salmonera_id);
        const sitio = sitios.find(s => s.id === operacion.sitio_id);
        const contratista = contratistas.find(c => c.id === operacion.contratista_id);
        const equipoAsignado = equipos.find(e => e.id === operacion.equipo_buceo_id);
        const supervisor = equipoAsignado?.miembros?.find(m => m.rol_equipo === 'supervisor');

        setFormData(prev => ({
          ...prev,
          codigo: `AB-${Date.now().toString().slice(-6)}`,
          empresa_nombre: salmonera?.nombre || '',
          lugar_faena: sitio?.nombre || '',
          buzo_o_empresa_nombre: contratista?.nombre || '',
          supervisor_servicio_nombre: supervisor?.nombre_completo || ''
        }));
      }
    }
  }, [formData.operacion_id, operaciones, salmoneras, sitios, contratistas, equipos]);

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const steps = [
    { id: 1, title: 'Información General', icon: FileText },
    { id: 2, title: 'Personal y Equipos', icon: Users },
    { id: 3, title: 'Verificaciones', icon: Shield },
    { id: 4, title: 'Firmas', icon: SignatureIcon }
  ];

  const progress = (currentStep / steps.length) * 100;

  const handleSubmit = async () => {
    try {
      await createAnexoBravo(formData);
      toast({
        title: "Anexo Bravo creado",
        description: "El Anexo Bravo ha sido creado exitosamente. Ahora debe ser firmado.",
      });
      onSubmit?.();
    } catch (error) {
      console.error('Error creating Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el Anexo Bravo.",
        variant: "destructive",
      });
    }
  };

  const handleSignature = (signatureData: { signature: string; signerName: string; timestamp: string }) => {
    updateFormData({
      anexo_bravo_firmas: {
        ...formData.anexo_bravo_firmas,
        supervisor_servicio_url: signatureData.signature
      }
    });
  };

  const selectedOperacion = operaciones.find(op => op.id === formData.operacion_id);

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold text-gray-900">Nuevo Anexo Bravo</h1>
        <p className="mt-2 text-gray-600">
          Formulario de seguridad para operaciones de buceo
        </p>
      </div>

      {/* Progress */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm font-medium">
          <span>Paso {currentStep} de {steps.length}</span>
          <span>{Math.round(progress)}% completado</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>

      {/* Step Navigation */}
      <div className="flex justify-center">
        <div className="flex space-x-4">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <button
                key={step.id}
                onClick={() => setCurrentStep(step.id)}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentStep === step.id
                    ? 'bg-blue-100 text-blue-700'
                    : currentStep > step.id
                    ? 'bg-green-100 text-green-700'
                    : 'bg-gray-100 text-gray-500'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span className="hidden sm:inline">{step.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Step Content */}
      <div className="space-y-6">
        {currentStep === 1 && (
          <div className="space-y-6">
            {/* Operación Seleccionada */}
            {selectedOperacion && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <Building className="w-5 h-5" />
                    Operación Asignada
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-blue-700">Código</p>
                      <p className="text-blue-900">{selectedOperacion.codigo}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-blue-700">Nombre</p>
                      <p className="text-blue-900">{selectedOperacion.nombre}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="codigo">Código</Label>
                    <Input
                      id="codigo"
                      value={formData.codigo}
                      onChange={(e) => updateFormData({ codigo: e.target.value })}
                      placeholder="AB-001"
                    />
                  </div>
                  <div>
                    <Label htmlFor="fecha">Fecha</Label>
                    <Input
                      id="fecha"
                      type="date"
                      value={formData.fecha}
                      onChange={(e) => updateFormData({ fecha: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="empresa_nombre">Empresa (Salmonera)</Label>
                    <Input
                      id="empresa_nombre"
                      value={formData.empresa_nombre}
                      onChange={(e) => updateFormData({ empresa_nombre: e.target.value })}
                      placeholder="Nombre de la salmonera"
                      className="bg-green-50"
                      readOnly
                    />
                  </div>
                  <div>
                    <Label htmlFor="lugar_faena">Lugar Faena / Centro (Sitio)</Label>
                    <Input
                      id="lugar_faena"
                      value={formData.lugar_faena}
                      onChange={(e) => updateFormData({ lugar_faena: e.target.value })}
                      placeholder="Sitio de operación"
                      className="bg-green-50"
                      readOnly
                    />
                  </div>
                </div>

                <div>
                  <Label htmlFor="buzo_o_empresa_nombre">Buzo Principal o Empresa (Contratista)</Label>
                  <Input
                    id="buzo_o_empresa_nombre"
                    value={formData.buzo_o_empresa_nombre}
                    onChange={(e) => updateFormData({ buzo_o_empresa_nombre: e.target.value })}
                    placeholder="Empresa contratista"
                    className="bg-green-50"
                    readOnly
                  />
                </div>

                <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                  <p className="text-sm text-green-800">
                    <strong>Nota:</strong> Los campos se poblan automáticamente desde la operación seleccionada.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {currentStep === 2 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5 text-green-600" />
                Personal y Supervisores
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="supervisor_servicio_nombre">Supervisor del Servicio</Label>
                  <Input
                    id="supervisor_servicio_nombre"
                    value={formData.supervisor_servicio_nombre}
                    onChange={(e) => updateFormData({ supervisor_servicio_nombre: e.target.value })}
                    placeholder="Nombre del supervisor"
                    className="bg-green-50"
                    readOnly
                  />
                </div>
                <div>
                  <Label htmlFor="supervisor_mandante_nombre">Supervisor Mandante</Label>
                  <Input
                    id="supervisor_mandante_nombre"
                    value={formData.supervisor_mandante_nombre}
                    onChange={(e) => updateFormData({ supervisor_mandante_nombre: e.target.value })}
                    placeholder="Nombre del supervisor mandante"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 3 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-orange-600" />
                Verificaciones de Seguridad
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="observaciones_generales">Observaciones Generales</Label>
                <Textarea
                  id="observaciones_generales"
                  value={formData.observaciones_generales}
                  onChange={(e) => updateFormData({ observaciones_generales: e.target.value })}
                  placeholder="Observaciones sobre la operación..."
                  rows={4}
                />
              </div>
            </CardContent>
          </Card>
        )}

        {currentStep === 4 && (
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <SignatureIcon className="w-5 h-5 text-purple-600" />
                  Firmas Finales
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  Las firmas se realizan después de crear el Anexo Bravo y se asocian al usuario administrador de la salmonera.
                </p>
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Nota:</strong> Una vez creado el Anexo Bravo, podrá firmarlo desde la lista de Anexos Bravo creados.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="flex justify-between">
        <div>
          {currentStep > 1 && (
            <Button
              variant="outline"
              onClick={() => setCurrentStep(currentStep - 1)}
            >
              Anterior
            </Button>
          )}
        </div>
        <div className="flex gap-2">
          {onCancel && (
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          )}
          {currentStep < steps.length ? (
            <Button onClick={() => setCurrentStep(currentStep + 1)}>
              Siguiente
            </Button>
          ) : (
            <Button 
              onClick={handleSubmit}
              disabled={isCreating}
              className="bg-green-600 hover:bg-green-700"
            >
              {isCreating ? 'Creando...' : 'Crear Anexo Bravo'}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
