import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Anchor } from 'lucide-react';
import { InmersionOperationSelector } from './InmersionOperationSelector';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useEquiposBuceoEnhanced } from '@/hooks/useEquiposBuceoEnhanced';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';
import { InmersionFormWizard } from './InmersionFormWizard';

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
    corriente: 'sin_corriente',
    observaciones: '',
    estado: 'planificada',
    equipo_buceo_id: ''
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

        // Get assigned diving team with members and user details
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
          observaciones: `Sitio: ${operacion.sitios?.nombre || 'No especificado'}`,
          equipo_buceo_id: operacion.equipo_buceo_id || ''
        };

        // If there's an assigned team, get user details for each member
        if (equipoAsignado?.miembros && Array.isArray(equipoAsignado.miembros)) {
          // Find team members by role - using bracket notation for type safety
          const supervisor = equipoAsignado.miembros.find((m: any) => m.rol_equipo === 'supervisor');
          const buzoPrincipal = equipoAsignado.miembros.find((m: any) => m.rol_equipo === 'buzo_principal');
          const buzoAsistente = equipoAsignado.miembros.find((m: any) => m.rol_equipo === 'buzo_asistente');
          
          // Get user details for each role from the usuario table
          if (supervisor?.['usuario_id']) {
            const { data: userData } = await supabase
              .from('usuario')
              .select('nombre, apellido')
              .eq('usuario_id', supervisor['usuario_id'])
              .single();
            
            if (userData) {
              autoUpdates.supervisor = `${userData.nombre} ${userData.apellido}`;
              autoUpdates.supervisor_id = supervisor['usuario_id'];
            }
          }
          
          if (buzoPrincipal?.['usuario_id']) {
            const { data: userData } = await supabase
              .from('usuario')
              .select('nombre, apellido')
              .eq('usuario_id', buzoPrincipal['usuario_id'])
              .single();
            
            if (userData) {
              autoUpdates.buzo_principal = `${userData.nombre} ${userData.apellido}`;
              autoUpdates.buzo_principal_id = buzoPrincipal['usuario_id'];
            }
          }
          
          if (buzoAsistente?.['usuario_id']) {
            const { data: userData } = await supabase
              .from('usuario')
              .select('nombre, apellido')
              .eq('usuario_id', buzoAsistente['usuario_id'])
              .single();
            
            if (userData) {
              autoUpdates.buzo_asistente = `${userData.nombre} ${userData.apellido}`;
              autoUpdates.buzo_asistente_id = buzoAsistente['usuario_id'];
            }
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
        operacion_id: selectedOperacionId,
        supervisor_id: formData.supervisor_id || null,
        buzo_principal_id: formData.buzo_principal_id || null,
        buzo_asistente_id: formData.buzo_asistente_id || null,
        equipo_buceo_id: formData.equipo_buceo_id || null,
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
    
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Detalles de la Inmersión</h2>
          <p className="mt-2 text-gray-600">
            Complete la información específica de la inmersión
          </p>
        </div>

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

        <InmersionFormWizard
          formData={formData}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          handleBack={() => setCurrentStep(1)}
          isLoading={isLoading}
          isFormValid={isFormValid}
          selectedOperacionId={selectedOperacionId}
        />
      </div>
    );
  };

  if (currentStep === 1) {
    return renderOperationSelector();
  }

  return renderInmersionForm();
};
