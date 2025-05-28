
import { useState, useEffect } from "react";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ArrowRight, Save, Anchor, AlertTriangle } from "lucide-react";
import { InmersionOperationSelector } from "./InmersionOperationSelector";
import { useToast } from "@/hooks/use-toast";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { supabase } from "@/integrations/supabase/client";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface InmersionWizardProps {
  inmersionId?: string;
  onComplete?: (inmersionId: string) => void;
  onCancel?: () => void;
}

export const InmersionWizard = ({ inmersionId, onComplete, onCancel }: InmersionWizardProps) => {
  const { toast } = useToast();
  const { operaciones } = useOperaciones();
  const { equipos } = useEquiposBuceoEnhanced();
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedOperacionId, setSelectedOperacionId] = useState('');
  const [showOperacionSelector, setShowOperacionSelector] = useState(!inmersionId);
  const [validationStatus, setValidationStatus] = useState({
    hptValidated: false,
    anexoBravoValidated: false,
    loading: false
  });

  const [formData, setFormData] = useState({
    codigo: '',
    operacion_id: '',
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

  // Validate HPT and Anexo Bravo when operation is selected
  useEffect(() => {
    const validateDocuments = async () => {
      if (!selectedOperacionId) return;
      
      setValidationStatus(prev => ({ ...prev, loading: true }));
      
      try {
        // Check for signed HPT
        const { data: hptData } = await supabase
          .from('hpt')
          .select('id, firmado, estado')
          .eq('operacion_id', selectedOperacionId)
          .eq('firmado', true)
          .eq('estado', 'firmado');

        // Check for signed Anexo Bravo
        const { data: anexoData } = await supabase
          .from('anexo_bravo')
          .select('id, firmado, estado')
          .eq('operacion_id', selectedOperacionId)
          .eq('firmado', true)
          .eq('estado', 'firmado');

        setValidationStatus({
          hptValidated: hptData && hptData.length > 0,
          anexoBravoValidated: anexoData && anexoData.length > 0,
          loading: false
        });
      } catch (error) {
        console.error('Error validating documents:', error);
        setValidationStatus({
          hptValidated: false,
          anexoBravoValidated: false,
          loading: false
        });
      }
    };

    validateDocuments();
  }, [selectedOperacionId]);

  // Auto-populate data when operation is selected
  useEffect(() => {
    const populateOperationData = async () => {
      if (!selectedOperacionId || inmersionId) return;

      try {
        // Get operation with related data
        const { data: opData, error } = await supabase
          .from('operacion')
          .select(`
            *,
            sitios:sitio_id (nombre, ubicacion),
            contratistas:contratista_id (nombre),
            salmoneras:salmonera_id (nombre)
          `)
          .eq('id', selectedOperacionId)
          .single();

        if (error) throw error;

        const operacion = opData;
        
        // Find team members if equipo is assigned
        let teamMembers = [];
        if (operacion.equipo_buceo_id) {
          const equipo = equipos.find(e => e.id === operacion.equipo_buceo_id);
          teamMembers = equipo?.miembros || [];
        }

        // Find specific roles
        const supervisor = teamMembers.find(m => m.rol === 'supervisor');
        const buzoPrincipal = teamMembers.find(m => m.rol === 'buzo_principal');
        const buzoAsistente = teamMembers.find(m => m.rol === 'buzo_asistente');

        // Generate codigo based on operation
        const codigo = `INM-${operacion.codigo}-${Date.now().toString().slice(-4)}`;
        
        updateFormData({
          operacion_id: selectedOperacionId,
          codigo,
          supervisor: supervisor?.nombre_completo || '',
          supervisor_id: supervisor?.usuario_id || '',
          buzo_principal: buzoPrincipal?.nombre_completo || '',
          buzo_principal_id: buzoPrincipal?.usuario_id || '',
          buzo_asistente: buzoAsistente?.nombre_completo || '',
          buzo_asistente_id: buzoAsistente?.usuario_id || '',
          objetivo: operacion.nombre || 'Inmersión de buceo comercial'
        });

        console.log('Operation data populated for immersion:', {
          operacion,
          teamMembers,
          codigo
        });

        toast({
          title: "Datos cargados",
          description: "Los datos de la operación han sido cargados automáticamente.",
        });
      } catch (error) {
        console.error('Error populating operation data:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de la operación",
          variant: "destructive",
        });
      }
    };

    populateOperationData();
  }, [selectedOperacionId, equipos, inmersionId]);

  const handleOperacionSelected = (operacionId: string) => {
    setSelectedOperacionId(operacionId);
    setShowOperacionSelector(false);
  };

  const updateFormData = (updates: any) => {
    setFormData(prev => ({ ...prev, ...updates }));
  };

  // Show operation selector if no operation selected
  if (showOperacionSelector) {
    return (
      <div className="max-w-4xl mx-auto space-y-6">
        <InmersionOperationSelector 
          onOperacionSelected={handleOperacionSelected}
          selectedOperacionId={selectedOperacionId}
        />
        
        {onCancel && (
          <div className="flex justify-end">
            <Button variant="outline" onClick={onCancel} className="ios-button">
              Cancelar
            </Button>
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="h-full max-h-[90vh] flex flex-col">
      {/* Header */}
      <div className="flex-shrink-0 p-4 md:p-6 border-b bg-white">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-teal-500 rounded-xl flex items-center justify-center text-white shadow-lg">
              <Anchor className="w-6 h-6" />
            </div>
            <div>
              <CardTitle className="text-xl md:text-2xl text-gray-900">
                {inmersionId ? 'Editar' : 'Crear'} Inmersión
              </CardTitle>
              <p className="text-sm text-gray-500 mt-1">
                Planificación de inmersión de buceo comercial
              </p>
            </div>
          </div>
        </div>

        {/* Validation Status */}
        {selectedOperacionId && (
          <div className="space-y-2">
            <div className="grid grid-cols-2 gap-4">
              <div className="flex items-center gap-2">
                <Badge variant={validationStatus.hptValidated ? "default" : "destructive"}>
                  HPT {validationStatus.hptValidated ? "Validado" : "Pendiente"}
                </Badge>
                <Badge variant={validationStatus.anexoBravoValidated ? "default" : "destructive"}>
                  Anexo Bravo {validationStatus.anexoBravoValidated ? "Validado" : "Pendiente"}
                </Badge>
              </div>
            </div>
            
            {(!validationStatus.hptValidated || !validationStatus.anexoBravoValidated) && (
              <Alert className="border-amber-200 bg-amber-50">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription className="text-amber-800">
                  Se requiere HPT y Anexo Bravo firmados para crear la inmersión.
                </AlertDescription>
              </Alert>
            )}
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-2xl mx-auto space-y-6">
          <Card>
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">Datos de la Inmersión</h3>
              
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Código</label>
                    <input 
                      className="w-full p-2 border rounded"
                      value={formData.codigo}
                      onChange={(e) => updateFormData({ codigo: e.target.value })}
                      placeholder="Código de inmersión"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Fecha</label>
                    <input 
                      type="date"
                      className="w-full p-2 border rounded"
                      value={formData.fecha_inmersion}
                      onChange={(e) => updateFormData({ fecha_inmersion: e.target.value })}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">Supervisor</label>
                    <input 
                      className="w-full p-2 border rounded"
                      value={formData.supervisor}
                      onChange={(e) => updateFormData({ supervisor: e.target.value })}
                      placeholder="Supervisor asignado"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">Buzo Principal</label>
                    <input 
                      className="w-full p-2 border rounded"
                      value={formData.buzo_principal}
                      onChange={(e) => updateFormData({ buzo_principal: e.target.value })}
                      placeholder="Buzo principal"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1">Objetivo</label>
                  <textarea 
                    className="w-full p-2 border rounded"
                    rows={3}
                    value={formData.objetivo}
                    onChange={(e) => updateFormData({ objetivo: e.target.value })}
                    placeholder="Descripción del objetivo de la inmersión"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Footer */}
      <div className="flex-shrink-0 flex justify-between items-center p-4 md:p-6 gap-4 border-t bg-white">
        <Button variant="outline" onClick={onCancel} className="ios-button">
          Cancelar
        </Button>
        
        <Button 
          className="ios-button bg-blue-600 hover:bg-blue-700"
          disabled={!validationStatus.hptValidated || !validationStatus.anexoBravoValidated}
        >
          <Save className="w-4 h-4 mr-2" />
          Crear Inmersión
        </Button>
      </div>
    </div>
  );
};
