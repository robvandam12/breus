
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { AnexoBravoStep1 } from './steps/AnexoBravoStep1';
import { AnexoBravoStep2 } from './steps/AnexoBravoStep2';
import { AnexoBravoStep3 } from './steps/AnexoBravoStep3';
import { AnexoBravoStep4 } from './steps/AnexoBravoStep4';
import { AnexoBravoStep5 } from './steps/AnexoBravoStep5';
import { AnexoBravoOperationSelector } from './AnexoBravoOperationSelector';
import { CheckCircle, Circle, ChevronLeft, ChevronRight, Save, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEquiposBuceoEnhanced } from '@/hooks/useEquiposBuceoEnhanced';
import { toast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface FullAnexoBravoFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  operacionId?: string;
  anexoId?: string;
}

export const FullAnexoBravoForm: React.FC<FullAnexoBravoFormProps> = ({
  onSubmit,
  onCancel,
  operacionId: initialOperacionId,
  anexoId
}) => {
  const { equipos } = useEquiposBuceoEnhanced();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [currentOperacionId, setCurrentOperacionId] = useState(initialOperacionId || '');
  const [showOperacionSelector, setShowOperacionSelector] = useState(!initialOperacionId && !anexoId);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [operacionData, setOperacionData] = useState<any>(null);
  
  const [formData, setFormData] = useState({
    // Datos generales
    codigo: '',
    fecha: new Date().toISOString().split('T')[0],
    lugar_faena: '',
    empresa_nombre: '',
    supervisor_servicio_nombre: '',
    supervisor_mandante_nombre: '',
    buzo_o_empresa_nombre: '',
    buzo_matricula: '',
    asistente_buzo_nombre: '',
    asistente_buzo_matricula: '',
    asistente_buzo_id: '',
    autorizacion_armada: false,
    autorizacion_documento_url: '',
    
    // Centro de trabajo - del sitio de operación
    centro_trabajo_nombre: '',
    
    // Bitácora
    bitacora_fecha: new Date().toISOString().split('T')[0],
    bitacora_hora_inicio: '',
    bitacora_hora_termino: '',
    bitacora_relator: '',
    
    // Checklist y equipos
    anexo_bravo_checklist: {},
    anexo_bravo_trabajadores: [],
    
    // Firmas
    anexo_bravo_firmas: {
      supervisor_servicio_url: '',
      supervisor_mandante_url: '',
      jefe_centro_url: ''
    },
    
    observaciones_generales: '',
    jefe_centro_nombre: ''
  });

  const steps = [
    { id: 1, title: 'Datos Generales', isValid: !!(formData.codigo && formData.lugar_faena && formData.empresa_nombre) },
    { id: 2, title: 'Personal', isValid: !!(formData.supervisor_servicio_nombre && formData.buzo_o_empresa_nombre) },
    { id: 3, title: 'Checklist', isValid: Object.keys(formData.anexo_bravo_checklist).length > 0 },
    { id: 4, title: 'Trabajadores', isValid: formData.anexo_bravo_trabajadores.length > 0 },
    { id: 5, title: 'Firmas', isValid: !!(formData.anexo_bravo_firmas.supervisor_servicio_url && formData.anexo_bravo_firmas.supervisor_mandante_url) }
  ];

  const handleOperacionSelected = (operacionId: string) => {
    setCurrentOperacionId(operacionId);
    setShowOperacionSelector(false);
  };

  // File upload handler for autorización de autoridad marítima
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxSize: 10 * 1024 * 1024, // 10MB
    onDrop: async (acceptedFiles) => {
      if (acceptedFiles.length > 0) {
        const file = acceptedFiles[0];
        try {
          // Here you would upload to Supabase Storage
          // For now, we'll just store the file name
          updateFormData({
            autorizacion_documento_url: file.name
          });
          
          toast({
            title: "Archivo subido",
            description: `Se ha subido ${file.name} correctamente.`,
          });
        } catch (error) {
          toast({
            title: "Error",
            description: "No se pudo subir el archivo.",
            variant: "destructive",
          });
        }
      }
    }
  });

  // Poblar datos automáticamente cuando se monta el componente
  useEffect(() => {
    const populateOperacionData = async () => {
      if (!currentOperacionId || anexoId) return; // No poblar si es edición

      try {
        // Obtener datos de la operación con relaciones
        const { data: operacion, error: opError } = await supabase
          .from('operacion')
          .select(`
            *,
            salmoneras:salmonera_id (nombre, rut),
            sitios:sitio_id (nombre, ubicacion),
            contratistas:contratista_id (nombre, rut)
          `)
          .eq('id', currentOperacionId)
          .single();

        if (opError) throw opError;

        setOperacionData(operacion);

        // Obtener equipo de buceo asignado con miembros
        let equipoAsignado = null;
        let miembrosEquipo = [];
        
        if (operacion.equipo_buceo_id) {
          equipoAsignado = equipos.find(eq => eq.id === operacion.equipo_buceo_id);
          
          if (equipoAsignado?.miembros) {
            miembrosEquipo = equipoAsignado.miembros;
            setTeamMembers(miembrosEquipo);
          }
        }

        // Crear objeto con todas las propiedades necesarias
        const autoDataUpdates: Partial<typeof formData> = {
          codigo: `AB-${operacion.codigo}-${Date.now().toString().slice(-4)}`,
          fecha: new Date().toISOString().split('T')[0],
          lugar_faena: operacion.sitios?.ubicacion || operacion.sitios?.nombre || '',
          centro_trabajo_nombre: operacion.sitios?.nombre || '',
          empresa_nombre: operacion.contratistas?.nombre || '',
          bitacora_fecha: new Date().toISOString().split('T')[0],
          bitacora_relator: ''
        };

        // Si hay equipo asignado, poblar datos del personal
        if (miembrosEquipo.length > 0) {
          const supervisor = miembrosEquipo.find(m => m.rol === 'supervisor');
          const buzoPrincipal = miembrosEquipo.find(m => m.rol === 'buzo_principal');
          const buzoAsistente = miembrosEquipo.find(m => m.rol === 'buzo_asistente');
          
          if (supervisor) {
            autoDataUpdates.supervisor_servicio_nombre = supervisor.nombre_completo;
            autoDataUpdates.bitacora_relator = supervisor.nombre_completo;
          }
          
          if (buzoPrincipal) {
            autoDataUpdates.buzo_o_empresa_nombre = buzoPrincipal.nombre_completo;
            autoDataUpdates.buzo_matricula = buzoPrincipal.matricula || '';
          }
          
          if (buzoAsistente) {
            autoDataUpdates.asistente_buzo_nombre = buzoAsistente.nombre_completo;
            autoDataUpdates.asistente_buzo_matricula = buzoAsistente.matricula || '';
            autoDataUpdates.asistente_buzo_id = buzoAsistente.usuario_id || '';
          }

          // Poblar trabajadores automáticamente desde el equipo de buceo
          const trabajadores = miembrosEquipo.map((miembro, index) => ({
            id: `auto-${index}`,
            nombre: miembro.nombre_completo,
            rut: miembro.rut || '',
            cargo: miembro.rol === 'supervisor' ? 'Supervisor' : 
                   miembro.rol === 'buzo_principal' ? 'Buzo Principal' : 'Buzo Asistente',
            empresa: operacion.contratistas?.nombre || ''
          }));
          
          autoDataUpdates.anexo_bravo_trabajadores = trabajadores;
        }

        setFormData(prev => ({ ...prev, ...autoDataUpdates }));
        
        console.log('Datos de Anexo Bravo poblados automáticamente:', autoDataUpdates);
        
        toast({
          title: "Datos cargados",
          description: "Los datos de la operación han sido cargados automáticamente.",
        });
      } catch (error) {
        console.error('Error populating operation data:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de la operación.",
          variant: "destructive",
        });
      }
    };

    populateOperacionData();
  }, [currentOperacionId, anexoId, equipos]);

  const updateFormData = (updates: Partial<typeof formData>) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  const nextStep = () => {
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const goToStep = (step: number) => {
    if (step >= 1 && step <= steps.length) {
      setCurrentStep(step);
    }
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast({
        title: "Formulario incompleto",
        description: "Complete todos los pasos antes de enviar",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        operacion_id: currentOperacionId,
        firmado: false, // Primero se crea, luego se firma
        estado: 'borrador'
      };

      await onSubmit(submitData);
      
      toast({
        title: "Anexo Bravo creado",
        description: "El Anexo Bravo ha sido creado como borrador. Ahora puede proceder a firmarlo.",
      });
    } catch (error) {
      console.error('Error submitting Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el Anexo Bravo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return steps.every(step => step.isValid);
  };

  const getProgress = () => {
    return Math.round((currentStep / steps.length) * 100);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <AnexoBravoStep1 data={formData} onUpdate={updateFormData} />
            
            {/* Autorización de Autoridad Marítima con Upload */}
            <Card className="ios-card">
              <CardHeader>
                <CardTitle>Autorización de Autoridad Marítima</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="autorizacion_armada"
                    checked={formData.autorizacion_armada}
                    onChange={(e) => updateFormData({ autorizacion_armada: e.target.checked })}
                    className="rounded"
                  />
                  <Label htmlFor="autorizacion_armada">
                    Autorización de la Autoridad Marítima (adjuntar copia)
                  </Label>
                </div>
                
                {formData.autorizacion_armada && (
                  <div className="space-y-4">
                    <div
                      {...getRootProps()}
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
                        isDragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <input {...getInputProps()} />
                      <Upload className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                      {isDragActive ? (
                        <p className="text-blue-600">Suelta el archivo aquí...</p>
                      ) : (
                        <div>
                          <p className="text-gray-600">
                            Arrastra y suelta el archivo aquí, o{' '}
                            <span className="text-blue-600 underline">selecciona un archivo</span>
                          </p>
                          <p className="text-sm text-gray-500 mt-1">
                            PDF, PNG, JPG hasta 10MB
                          </p>
                        </div>
                      )}
                    </div>
                    
                    {formData.autorizacion_documento_url && (
                      <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          📄 Archivo subido: {formData.autorizacion_documento_url}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        );
      case 2:
        return (
          <div className="space-y-6">
            <AnexoBravoStep2 data={formData} onUpdate={updateFormData} />
            
            {/* Selección de Asistente de Buzo */}
            {teamMembers.length > 0 && (
              <Card className="ios-card">
                <CardHeader>
                  <CardTitle>Asistente de Buzo</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="asistente_buzo_select">Seleccionar Asistente de Buzo del Equipo</Label>
                    <Select
                      value={formData.asistente_buzo_id}
                      onValueChange={(value) => {
                        const selectedMember = teamMembers.find(m => m.usuario_id === value);
                        if (selectedMember) {
                          updateFormData({
                            asistente_buzo_id: value,
                            asistente_buzo_nombre: selectedMember.nombre_completo,
                            asistente_buzo_matricula: selectedMember.matricula || ''
                          });
                        }
                      }}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar asistente..." />
                      </SelectTrigger>
                      <SelectContent>
                        {teamMembers
                          .filter(m => m.rol === 'buzo_asistente' || m.rol === 'buzo_principal')
                          .map((member) => (
                          <SelectItem key={member.usuario_id} value={member.usuario_id}>
                            {member.nombre_completo} - {member.rol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="asistente_buzo_nombre">Nombre del Asistente</Label>
                      <Input
                        id="asistente_buzo_nombre"
                        value={formData.asistente_buzo_nombre}
                        onChange={(e) => updateFormData({ asistente_buzo_nombre: e.target.value })}
                        placeholder="Nombre completo"
                      />
                    </div>
                    <div>
                      <Label htmlFor="asistente_buzo_matricula">Matrícula</Label>
                      <Input
                        id="asistente_buzo_matricula"
                        value={formData.asistente_buzo_matricula}
                        onChange={(e) => updateFormData({ asistente_buzo_matricula: e.target.value })}
                        placeholder="Número de matrícula"
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        );
      case 3:
        return <AnexoBravoStep3 data={formData} onUpdate={updateFormData} />;
      case 4:
        return <AnexoBravoStep4 data={formData} onUpdate={updateFormData} />;
      case 5:
        return <AnexoBravoStep5 data={formData} onUpdate={updateFormData} />;
      default:
        return <div>Paso no encontrado</div>;
    }
  };

  // Show operation selector if no operation selected
  if (showOperacionSelector) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <AnexoBravoOperationSelector 
          onOperacionSelected={handleOperacionSelected}
          selectedOperacionId={currentOperacionId}
        />
        
        <div className="flex justify-end">
          <Button variant="outline" onClick={onCancel} className="ios-button">
            Cancelar
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 p-6">
      {/* Header con progreso */}
      <Card className="ios-card">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>
                {anexoId ? 'Editar' : 'Crear'} Anexo Bravo
              </CardTitle>
              <p className="text-sm text-gray-600 mt-1">
                Paso {currentStep} de {steps.length}: {steps[currentStep - 1]?.title}
              </p>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={currentOperacionId ? "default" : "secondary"}>
                {currentOperacionId ? 'Con Operación' : 'Independiente'}
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowOperacionSelector(true)}
                className="ios-button-sm"
              >
                Cambiar Operación
              </Button>
            </div>
          </div>
          <Progress value={getProgress()} className="mt-4" />
        </CardHeader>
      </Card>

      {/* Navegación de pasos */}
      <Card className="ios-card">
        <CardContent className="p-4">
          <div className="grid grid-cols-5 gap-2">
            {steps.map((step) => (
              <Button
                key={step.id}
                variant={step.id === currentStep ? "default" : "outline"}
                size="sm"
                onClick={() => goToStep(step.id)}
                className="ios-button h-auto p-2 flex flex-col items-center gap-1"
              >
                <div className="flex items-center gap-1">
                  {step.isValid ? (
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  ) : (
                    <Circle className="h-4 w-4" />
                  )}
                  <span className="font-semibold">{step.id}</span>
                </div>
                <span className="text-xs text-center leading-tight">
                  {step.title}
                </span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Contenido del paso actual */}
      {renderStepContent()}

      {/* Navegación inferior */}
      <Card className="ios-card">
        <CardContent className="p-4">
          <div className="flex justify-between items-center">
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={prevStep}
                disabled={currentStep === 1}
                className="ios-button"
              >
                <ChevronLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
            </div>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onCancel} className="ios-button">
                Cancelar
              </Button>
              
              {currentStep < steps.length ? (
                <Button
                  onClick={nextStep}
                  disabled={!steps[currentStep - 1]?.isValid}
                  className="ios-button"
                >
                  Siguiente
                  <ChevronRight className="h-4 w-4 ml-2" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!isFormValid() || isLoading}
                  className="ios-button bg-green-600 hover:bg-green-700"
                >
                  {isLoading ? 'Creando...' : 'Crear Anexo Bravo'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Operation Selector Dialog */}
      {showOperacionSelector && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-4xl w-full mx-4 max-h-[90vh] overflow-y-auto">
            <AnexoBravoOperationSelector 
              onOperacionSelected={handleOperacionSelected}
              selectedOperacionId={currentOperacionId}
            />
            <div className="flex justify-end mt-4">
              <Button 
                variant="outline" 
                onClick={() => setShowOperacionSelector(false)}
                className="ios-button"
              >
                Cancelar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
