import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Anchor, Calendar, User, Clock, MapPin } from 'lucide-react';
import { InmersionOperationSelector } from './InmersionOperationSelector';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useEquiposBuceoEnhanced } from '@/hooks/useEquiposBuceoEnhanced';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface InmersionWizardProps {
  onComplete: (data: any) => Promise<void>;
  onCancel: () => void;
  operationId?: string;
}

export const InmersionWizard: React.FC<InmersionWizardProps> = ({
  onComplete,
  onCancel,
  operationId: initialOperationId
}) => {
  const [currentStep, setCurrentStep] = useState(initialOperationId ? 2 : 1);
  const [selectedOperacionId, setSelectedOperacionId] = useState(initialOperationId || '');
  const [isLoading, setIsLoading] = useState(false);
  
  const { operaciones } = useOperaciones();
  const { equipos } = useEquiposBuceoEnhanced();

  const [formData, setFormData] = useState({
    codigo: '',
    fecha_inmersion: new Date().toISOString().split('T')[0],
    hora_inicio: '',
    hora_fin: '',
    supervisor: '',
    supervisor_id: '',
    buzo_principal: '',
    buzo_principal_id: '',
    buzo_asistente: '',
    buzo_asistente_id: '',
    objetivo: '',
    profundidad_max: 0,
    temperatura_agua: 0,
    visibilidad: 0,
    corriente: '',
    observaciones: '',
    estado: 'planificada'
  });

  // Auto-populate data when operation is selected
  useEffect(() => {
    const populateOperationData = async () => {
      if (!selectedOperacionId) return;

      try {
        console.log('Populating inmersion data for operation:', selectedOperacionId);
        
        // Get operation data
        const { data: operacion, error: opError } = await supabase
          .from('operacion')
          .select(`
            *,
            salmoneras:salmonera_id (nombre),
            sitios:sitio_id (nombre, ubicacion),
            contratistas:contratista_id (nombre)
          `)
          .eq('id', selectedOperacionId)
          .single();

        if (opError) throw opError;

        // Get assigned diving team
        const equipoAsignado = operacion.equipo_buceo_id 
          ? equipos.find(eq => eq.id === operacion.equipo_buceo_id)
          : null;

        console.log('Operation:', operacion);
        console.log('Assigned team:', equipoAsignado);

        // Generate unique code
        const inmersionCode = `INM-${operacion.codigo}-${Date.now().toString().slice(-4)}`;

        // Auto-populate form data
        const autoUpdates: Partial<typeof formData> = {
          codigo: inmersionCode,
          objetivo: `Inmersión para ${operacion.nombre}`,
          observaciones: `Sitio: ${operacion.sitios?.nombre || 'No especificado'}`
        };

        // If there's an assigned team, populate personnel
        if (equipoAsignado?.miembros) {
          const supervisor = equipoAsignado.miembros.find(m => m.rol === 'supervisor');
          const buzoPrincipal = equipoAsignado.miembros.find(m => m.rol === 'buzo_principal');
          const buzoAsistente = equipoAsignado.miembros.find(m => m.rol === 'buzo_asistente');
          
          if (supervisor) {
            autoUpdates.supervisor = supervisor.nombre_completo;
            // supervisor_id not available in EquipoBuceoMiembro, leave empty
          }
          
          if (buzoPrincipal) {
            autoUpdates.buzo_principal = buzoPrincipal.nombre_completo;
            // buzo_principal_id not available in EquipoBuceoMiembro, leave empty
          }
          
          if (buzoAsistente) {
            autoUpdates.buzo_asistente = buzoAsistente.nombre_completo;
            // buzo_asistente_id not available in EquipoBuceoMiembro, leave empty
          }
        }

        setFormData(prev => ({ ...prev, ...autoUpdates }));
        
        console.log('Inmersion auto-populated data:', autoUpdates);
        
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

    populateOperationData();
  }, [selectedOperacionId, equipos, operaciones]);

  const handleOperacionSelected = (operacionId: string) => {
    setSelectedOperacionId(operacionId);
    setCurrentStep(2);
  };

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async () => {
    if (!isFormValid()) {
      toast({
        title: "Formulario incompleto",
        description: "Complete todos los campos requeridos",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const submitData = {
        ...formData,
        operacion_id: selectedOperacionId
      };

      await onComplete(submitData);
    } catch (error) {
      console.error('Error creating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const isFormValid = () => {
    return !!(
      formData.codigo &&
      formData.fecha_inmersion &&
      formData.hora_inicio &&
      formData.supervisor &&
      formData.buzo_principal &&
      formData.objetivo &&
      selectedOperacionId
    );
  };

  const renderOperationSelector = () => (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Seleccionar Operación</h2>
        <p className="mt-2 text-gray-600">
          Escoja la operación para la cual desea crear la inmersión
        </p>
      </div>

      <InmersionOperationSelector
        onOperacionSelected={handleOperacionSelected}
        selectedOperacionId={selectedOperacionId}
      />

      <div className="flex justify-end">
        <Button variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
      </div>
    </div>
  );

  const renderInmersionForm = () => {
    const selectedOperation = operaciones.find(op => op.id === selectedOperacionId);
    const assignedTeam = selectedOperation?.equipo_buceo_id 
      ? equipos.find(eq => eq.id === selectedOperation.equipo_buceo_id)
      : null;

    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Detalles de la Inmersión</h2>
          <p className="mt-2 text-gray-600">
            Complete la información específica de la inmersión
          </p>
        </div>

        {/* Operation Info */}
        {selectedOperation && (
          <Card className="bg-blue-50 border-blue-200">
            <CardHeader>
              <CardTitle className="text-blue-800 flex items-center gap-2">
                <Anchor className="w-5 h-5" />
                Operación: {selectedOperation.codigo} - {selectedOperation.nombre}
              </CardTitle>
            </CardHeader>
          </Card>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Basic Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Información Básica
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="codigo">Código de Inmersión *</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => handleInputChange('codigo', e.target.value)}
                  placeholder="Código único de la inmersión"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
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
              </div>

              <div>
                <Label htmlFor="objetivo">Objetivo *</Label>
                <Textarea
                  id="objetivo"
                  value={formData.objetivo}
                  onChange={(e) => handleInputChange('objetivo', e.target.value)}
                  placeholder="Objetivo de la inmersión"
                  rows={3}
                />
              </div>
            </CardContent>
          </Card>

          {/* Personnel */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5 text-green-600" />
                Personal
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="supervisor">Supervisor *</Label>
                <Input
                  id="supervisor"
                  value={formData.supervisor}
                  onChange={(e) => handleInputChange('supervisor', e.target.value)}
                  placeholder="Nombre del supervisor"
                  disabled={!!assignedTeam}
                />
                {assignedTeam && (
                  <p className="text-xs text-blue-600 mt-1">
                    Auto-poblado desde el equipo asignado
                  </p>
                )}
              </div>

              <div>
                <Label htmlFor="buzo_principal">Buzo Principal *</Label>
                <Input
                  id="buzo_principal"
                  value={formData.buzo_principal}
                  onChange={(e) => handleInputChange('buzo_principal', e.target.value)}
                  placeholder="Nombre del buzo principal"
                  disabled={!!assignedTeam}
                />
              </div>

              <div>
                <Label htmlFor="buzo_asistente">Buzo Asistente</Label>
                <Input
                  id="buzo_asistente"
                  value={formData.buzo_asistente}
                  onChange={(e) => handleInputChange('buzo_asistente', e.target.value)}
                  placeholder="Nombre del buzo asistente (opcional)"
                  disabled={!!assignedTeam}
                />
              </div>
            </CardContent>
          </Card>

          {/* Conditions */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="w-5 h-5 text-purple-600" />
                Condiciones
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="profundidad_max">Profundidad Máx. (m)</Label>
                  <Input
                    id="profundidad_max"
                    type="number"
                    value={formData.profundidad_max}
                    onChange={(e) => handleInputChange('profundidad_max', Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="temperatura_agua">Temperatura (°C)</Label>
                  <Input
                    id="temperatura_agua"
                    type="number"
                    value={formData.temperatura_agua}
                    onChange={(e) => handleInputChange('temperatura_agua', Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
                <div>
                  <Label htmlFor="visibilidad">Visibilidad (m)</Label>
                  <Input
                    id="visibilidad"
                    type="number"
                    value={formData.visibilidad}
                    onChange={(e) => handleInputChange('visibilidad', Number(e.target.value))}
                    placeholder="0"
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="corriente">Corriente</Label>
                <Select
                  value={formData.corriente}
                  onValueChange={(value) => handleInputChange('corriente', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione condición de corriente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="sin_corriente">Sin corriente</SelectItem>
                    <SelectItem value="corriente_leve">Corriente leve</SelectItem>
                    <SelectItem value="corriente_moderada">Corriente moderada</SelectItem>
                    <SelectItem value="corriente_fuerte">Corriente fuerte</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          {/* Observations */}
          <Card>
            <CardHeader>
              <CardTitle>Observaciones</CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={formData.observaciones}
                onChange={(e) => handleInputChange('observaciones', e.target.value)}
                placeholder="Observaciones adicionales sobre la inmersión"
                rows={4}
              />
            </CardContent>
          </Card>
        </div>

        {/* Actions */}
        <div className="flex justify-between">
          <Button variant="outline" onClick={() => setCurrentStep(1)}>
            Cambiar Operación
          </Button>
          <div className="flex gap-2">
            <Button variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={!isFormValid() || isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Creando...' : 'Crear Inmersión'}
            </Button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="max-w-6xl mx-auto space-y-6 p-6">
      {currentStep === 1 ? renderOperationSelector() : renderInmersionForm()}
    </div>
  );
};
