
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, Building, MapPin, Users, FileText, CheckCircle, AlertTriangle } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface CreateOperacionFormEnhancedProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  enterpriseContext?: any;
}

interface Centro {
  id: string;
  nombre: string;
  salmonera_id: string;
  ubicacion: string;
  region?: string;
}

interface Contratista {
  id: string;
  nombre: string;
  rut: string;
  especialidades?: string[];
}

export const CreateOperacionFormEnhanced = ({ 
  onSubmit, 
  onCancel, 
  enterpriseContext 
}: CreateOperacionFormEnhancedProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [centros, setCentros] = useState<Centro[]>([]);
  const [contratistas, setContratistas] = useState<Contratista[]>([]);
  const [loadingCentros, setLoadingCentros] = useState(false);
  const [loadingContratistas, setLoadingContratistas] = useState(false);
  
  const [formData, setFormData] = useState({
    // Información básica
    codigo: '',
    nombre: '',
    descripcion: '',
    
    // Fechas y programación
    fecha_inicio: new Date(),
    fecha_fin: undefined as Date | undefined,
    duracion_estimada: '',
    
    // Ubicación y recursos
    centro_id: '',
    ubicacion_especifica: '',
    contratista_id: '',
    
    // Planificación
    objetivo_general: '',
    tareas: '',
    recursos_necesarios: '',
    equipo_requerido: '',
    
    // Estado y configuración
    estado: 'activa' as 'activa' | 'pausada' | 'completada' | 'cancelada',
    prioridad: 'normal' as 'alta' | 'normal' | 'baja',
    observaciones: ''
  });

  useEffect(() => {
    loadCentros();
    loadContratistas();
    generateOperationCode();
  }, []);

  const generateOperationCode = () => {
    const today = new Date();
    const dateStr = format(today, 'yyyyMMdd');
    const randomStr = Math.random().toString(36).substring(2, 5).toUpperCase();
    setFormData(prev => ({ ...prev, codigo: `OP-${dateStr}-${randomStr}` }));
  };

  const loadCentros = async () => {
    setLoadingCentros(true);
    try {
      let query = supabase
        .from('centros')
        .select('id, nombre, salmonera_id, ubicacion, region')
        .eq('estado', 'activo')
        .order('nombre');

      // Filtrar por empresa si no es superuser
      if (enterpriseContext?.salmonera_id) {
        query = query.eq('salmonera_id', enterpriseContext.salmonera_id);
      }

      const { data, error } = await query;
      if (error) throw error;
      setCentros(data || []);
    } catch (error) {
      console.error('Error loading centros:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los centros",
        variant: "destructive",
      });
    } finally {
      setLoadingCentros(false);
    }
  };

  const loadContratistas = async () => {
    setLoadingContratistas(true);
    try {
      const { data, error } = await supabase
        .from('contratistas')
        .select('id, nombre, rut, especialidades')
        .eq('estado', 'activo')
        .order('nombre');

      if (error) throw error;
      setContratistas(data || []);
    } catch (error) {
      console.error('Error loading contratistas:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los contratistas",
        variant: "destructive",
      });
    } finally {
      setLoadingContratistas(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      // Obtener salmonera_id del centro seleccionado
      const selectedCentro = centros.find(c => c.id === formData.centro_id);
      
      const operacionData = {
        ...formData,
        fecha_inicio: format(formData.fecha_inicio, 'yyyy-MM-dd'),
        fecha_fin: formData.fecha_fin ? format(formData.fecha_fin, 'yyyy-MM-dd') : null,
        salmonera_id: selectedCentro?.salmonera_id || enterpriseContext?.salmonera_id || null,
        contratista_id: formData.contratista_id || null
      };

      await onSubmit(operacionData);
    } catch (error) {
      console.error('Error creating operacion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateFormData = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const nextStep = () => {
    if (currentStep < 4) setCurrentStep(currentStep + 1);
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep(currentStep - 1);
  };

  const canProceedToNext = () => {
    switch (currentStep) {
      case 1:
        return formData.codigo && formData.nombre && formData.descripcion;
      case 2:
        return formData.fecha_inicio && formData.centro_id;
      case 3:
        return formData.objetivo_general && formData.tareas;
      default:
        return true;
    }
  };

  const getStepIcon = (step: number) => {
    if (step < currentStep) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (step === currentStep) return <div className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-sm font-medium">{step}</div>;
    return <div className="w-5 h-5 rounded-full bg-gray-300 text-gray-600 flex items-center justify-center text-sm font-medium">{step}</div>;
  };

  return (
    <Card className="w-full max-w-6xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building className="w-6 h-6" />
          Nueva Operación de Buceo
        </CardTitle>
        
        {/* Progress Steps */}
        <div className="flex items-center justify-between mt-4">
          {[
            { step: 1, title: "Información Básica", icon: FileText },
            { step: 2, title: "Programación", icon: CalendarIcon },
            { step: 3, title: "Planificación", icon: MapPin },
            { step: 4, title: "Revisión", icon: CheckCircle }
          ].map(({ step, title, icon: Icon }) => (
            <div key={step} className="flex items-center">
              <div className="flex flex-col items-center">
                {getStepIcon(step)}
                <span className={`text-sm mt-1 ${step === currentStep ? 'text-blue-600 font-medium' : 'text-gray-500'}`}>
                  {title}
                </span>
              </div>
              {step < 4 && (
                <div className={`w-12 h-0.5 mx-4 ${step < currentStep ? 'bg-green-600' : 'bg-gray-300'}`} />
              )}
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit}>
          <Tabs value={currentStep.toString()} className="w-full">
            {/* Paso 1: Información Básica */}
            <TabsContent value="1" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="codigo">Código de Operación *</Label>
                  <Input
                    id="codigo"
                    value={formData.codigo}
                    onChange={(e) => updateFormData('codigo', e.target.value)}
                    placeholder="Ej: OP-20240101-ABC"
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="prioridad">Prioridad</Label>
                  <Select
                    value={formData.prioridad}
                    onValueChange={(value) => updateFormData('prioridad', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="alta">Alta</SelectItem>
                      <SelectItem value="normal">Normal</SelectItem>
                      <SelectItem value="baja">Baja</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="nombre">Nombre de la Operación *</Label>
                <Input
                  id="nombre"
                  value={formData.nombre}
                  onChange={(e) => updateFormData('nombre', e.target.value)}
                  placeholder="Nombre descriptivo de la operación"
                  required
                />
              </div>

              <div>
                <Label htmlFor="descripcion">Descripción General *</Label>
                <Textarea
                  id="descripcion"
                  value={formData.descripcion}
                  onChange={(e) => updateFormData('descripcion', e.target.value)}
                  placeholder="Descripción detallada de la operación..."
                  rows={4}
                  required
                />
              </div>
            </TabsContent>

            {/* Paso 2: Programación */}
            <TabsContent value="2" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label>Fecha de Inicio *</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.fecha_inicio ? format(formData.fecha_inicio, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.fecha_inicio}
                        onSelect={(date) => date && updateFormData('fecha_inicio', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>

                <div>
                  <Label>Fecha de Fin (Estimada)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left font-normal">
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.fecha_fin ? format(formData.fecha_fin, 'PPP', { locale: es }) : 'Seleccionar fecha'}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.fecha_fin}
                        onSelect={(date) => updateFormData('fecha_fin', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="centro">Centro de Operación *</Label>
                  <Select
                    value={formData.centro_id}
                    onValueChange={(value) => updateFormData('centro_id', value)}
                    required
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingCentros ? "Cargando..." : "Seleccionar centro"} />
                    </SelectTrigger>
                    <SelectContent>
                      {centros.map((centro) => (
                        <SelectItem key={centro.id} value={centro.id}>
                          <div className="flex flex-col">
                            <span>{centro.nombre}</span>
                            <span className="text-xs text-gray-500">{centro.ubicacion}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="contratista">Contratista Asignado</Label>
                  <Select
                    value={formData.contratista_id}
                    onValueChange={(value) => updateFormData('contratista_id', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder={loadingContratistas ? "Cargando..." : "Seleccionar contratista"} />
                    </SelectTrigger>
                    <SelectContent>
                      {contratistas.map((contratista) => (
                        <SelectItem key={contratista.id} value={contratista.id}>
                          <div className="flex flex-col">
                            <span>{contratista.nombre}</span>
                            <span className="text-xs text-gray-500">{contratista.rut}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="ubicacion_especifica">Ubicación Específica</Label>
                <Input
                  id="ubicacion_especifica"
                  value={formData.ubicacion_especifica}
                  onChange={(e) => updateFormData('ubicacion_especifica', e.target.value)}
                  placeholder="Detalles específicos de la ubicación dentro del centro"
                />
              </div>
            </TabsContent>

            {/* Paso 3: Planificación */}
            <TabsContent value="3" className="space-y-6">
              <div>
                <Label htmlFor="objetivo_general">Objetivo General *</Label>
                <Textarea
                  id="objetivo_general"
                  value={formData.objetivo_general}
                  onChange={(e) => updateFormData('objetivo_general', e.target.value)}
                  placeholder="Objetivo principal de la operación de buceo..."
                  rows={3}
                  required
                />
              </div>

              <div>
                <Label htmlFor="tareas">Tareas a Realizar *</Label>
                <Textarea
                  id="tareas"
                  value={formData.tareas}
                  onChange={(e) => updateFormData('tareas', e.target.value)}
                  placeholder="Detalle de las tareas específicas a realizar..."
                  rows={4}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <Label htmlFor="recursos_necesarios">Recursos Necesarios</Label>
                  <Textarea
                    id="recursos_necesarios"
                    value={formData.recursos_necesarios}
                    onChange={(e) => updateFormData('recursos_necesarios', e.target.value)}
                    placeholder="Recursos humanos y materiales necesarios..."
                    rows={3}
                  />
                </div>

                <div>
                  <Label htmlFor="equipo_requerido">Equipo Requerido</Label>
                  <Textarea
                    id="equipo_requerido"
                    value={formData.equipo_requerido}
                    onChange={(e) => updateFormData('equipo_requerido', e.target.value)}
                    placeholder="Equipos de buceo y herramientas específicas..."
                    rows={3}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="observaciones">Observaciones Adicionales</Label>
                <Textarea
                  id="observaciones"
                  value={formData.observaciones}
                  onChange={(e) => updateFormData('observaciones', e.target.value)}
                  placeholder="Observaciones, consideraciones especiales, riesgos identificados..."
                  rows={3}
                />
              </div>
            </TabsContent>

            {/* Paso 4: Revisión */}
            <TabsContent value="4" className="space-y-6">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h3 className="text-lg font-semibold mb-4 text-blue-900">Resumen de la Operación</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Código:</span>
                        <Badge variant="outline" className="ml-2">{formData.codigo}</Badge>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Nombre:</span>
                        <p className="text-sm mt-1">{formData.nombre}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Fecha de Inicio:</span>
                        <p className="text-sm mt-1">{format(formData.fecha_inicio, 'PPP', { locale: es })}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Centro:</span>
                        <p className="text-sm mt-1">{centros.find(c => c.id === formData.centro_id)?.nombre || 'No seleccionado'}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div>
                    <div className="space-y-3">
                      <div>
                        <span className="font-medium text-gray-700">Prioridad:</span>
                        <Badge variant={formData.prioridad === 'alta' ? 'destructive' : formData.prioridad === 'normal' ? 'default' : 'secondary'} className="ml-2">
                          {formData.prioridad.toUpperCase()}
                        </Badge>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Contratista:</span>
                        <p className="text-sm mt-1">{contratistas.find(c => c.id === formData.contratista_id)?.nombre || 'No asignado'}</p>
                      </div>
                      <div>
                        <span className="font-medium text-gray-700">Fecha de Fin:</span>
                        <p className="text-sm mt-1">{formData.fecha_fin ? format(formData.fecha_fin, 'PPP', { locale: es }) : 'No definida'}</p>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4">
                  <span className="font-medium text-gray-700">Objetivo:</span>
                  <p className="text-sm mt-1 text-gray-600">{formData.objetivo_general}</p>
                </div>
              </div>

              {!canProceedToNext() && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                    <span className="text-amber-800 font-medium">Información Incompleta</span>
                  </div>
                  <p className="text-amber-700 text-sm mt-1">
                    Por favor, completa todos los campos requeridos antes de crear la operación.
                  </p>
                </div>
              )}
            </TabsContent>
          </Tabs>

          {/* Navigation Buttons */}
          <div className="flex justify-between mt-8 pt-6 border-t">
            <div>
              {currentStep > 1 ? (
                <Button type="button" variant="outline" onClick={prevStep}>
                  Anterior
                </Button>
              ) : (
                <Button type="button" variant="outline" onClick={onCancel}>
                  Cancelar
                </Button>
              )}
            </div>
            
            <div className="flex gap-3">
              {currentStep < 4 ? (
                <Button 
                  type="button" 
                  onClick={nextStep}
                  disabled={!canProceedToNext()}
                >
                  Siguiente
                </Button>
              ) : (
                <Button 
                  type="submit" 
                  disabled={isSubmitting || !canProceedToNext()}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isSubmitting ? 'Creando...' : 'Crear Operación'}
                </Button>
              )}
            </div>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
