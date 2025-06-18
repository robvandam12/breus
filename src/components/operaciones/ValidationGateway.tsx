
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CheckCircle2, AlertTriangle, FileText, Shield, Users, MapPin, ExternalLink } from "lucide-react";
import { HPTWizard } from "@/components/hpt/HPTWizard";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useHPT } from "@/hooks/useHPT";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { toast } from "@/hooks/use-toast";

interface ValidationGatewayProps {
  operacionId: string;
  onValidationComplete?: () => void;
  onHPTCreated?: () => void;
  onAnexoBravoCreated?: () => void;
}

export const ValidationGateway = ({ 
  operacionId, 
  onValidationComplete,
  onHPTCreated,
  onAnexoBravoCreated 
}: ValidationGatewayProps) => {
  const [showHPTForm, setShowHPTForm] = useState(false);
  const [showAnexoBravoForm, setShowAnexoBravoForm] = useState(false);
  const [validation, setValidation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const { validateOperacionCompleteness } = useOperaciones();
  const { hpts, createHPT } = useHPT();
  const { anexosBravo, createAnexoBravo } = useAnexoBravo();

  useEffect(() => {
    loadValidation();
  }, [operacionId]);

  const loadValidation = async () => {
    try {
      setLoading(true);
      const result = await validateOperacionCompleteness(operacionId);
      setValidation(result);
    } catch (error) {
      console.error('Error validating operation:', error);
      toast({
        title: "Error",
        description: "No se pudo validar la operación",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCreateHPT = async (data: any) => {
    try {
      await createHPT({ ...data, operacion_id: operacionId });
      setShowHPTForm(false);
      await loadValidation();
      if (onHPTCreated) onHPTCreated();
      toast({
        title: "HPT creado",
        description: "El HPT ha sido creado exitosamente",
      });
    } catch (error) {
      console.error('Error creating HPT:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el HPT",
        variant: "destructive",
      });
    }
  };

  const handleCreateAnexoBravo = async (data: any) => {
    try {
      await createAnexoBravo({ ...data, operacion_id: operacionId });
      setShowAnexoBravoForm(false);
      await loadValidation();
      if (onAnexoBravoCreated) onAnexoBravoCreated();
      toast({
        title: "Anexo Bravo creado",
        description: "El Anexo Bravo ha sido creado exitosamente",
      });
    } catch (error) {
      console.error('Error creating Anexo Bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el Anexo Bravo",
        variant: "destructive",
      });
    }
  };

  const handleFinalize = () => {
    if (validation?.canExecute) {
      toast({
        title: "¡Operación Lista!",
        description: "La operación cumple todos los requisitos y está lista para inmersiones",
      });
      if (onValidationComplete) {
        onValidationComplete();
      }
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="p-8">
          <div className="text-center">Validando operación...</div>
        </CardContent>
      </Card>
    );
  }

  const validationItems = [
    {
      id: 'sitio',
      title: 'Sitio Asignado',
      icon: <MapPin className="w-5 h-5" />,
      completed: validation?.sitioAsignado,
      required: true,
      action: null
    },
    {
      id: 'equipo',
      title: 'Equipo de Buceo',
      icon: <Users className="w-5 h-5" />,
      completed: validation?.equipoAsignado,
      required: true,
      action: null
    },
    {
      id: 'supervisor',
      title: 'Supervisor Asignado',
      icon: <Users className="w-5 h-5" />,
      completed: validation?.supervisorAsignado,
      required: true,
      action: null
    },
    {
      id: 'hpt',
      title: 'HPT Firmado',
      icon: <FileText className="w-5 h-5" />,
      completed: validation?.hptReady,
      required: true,
      action: () => setShowHPTForm(true)
    },
    {
      id: 'anexo-bravo',
      title: 'Anexo Bravo Firmado',
      icon: <Shield className="w-5 h-5" />,
      completed: validation?.anexoBravoReady,
      required: true,
      action: () => setShowAnexoBravoForm(true)
    }
  ];

  const completedItems = validationItems.filter(item => item.completed).length;
  const totalItems = validationItems.length;
  const progress = (completedItems / totalItems) * 100;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-blue-600" />
              Validación de Operación
            </CardTitle>
            <Badge variant={validation?.canExecute ? "default" : "secondary"}>
              {completedItems}/{totalItems} Completado
            </Badge>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>

          <div className="space-y-3">
            {validationItems.map((item) => (
              <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-full ${
                    item.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                  }`}>
                    {item.completed ? <CheckCircle2 className="w-4 h-4" /> : item.icon}
                  </div>
                  <div>
                    <h4 className="font-medium">{item.title}</h4>
                    <p className="text-sm text-gray-600">
                      {item.completed ? 'Completado' : 'Pendiente'}
                      {item.required && ' (Requerido)'}
                    </p>
                  </div>
                </div>

                {!item.completed && item.action && (
                  <Button 
                    size="sm" 
                    onClick={item.action}
                    className="flex items-center gap-2"
                  >
                    Crear
                    <ExternalLink className="w-3 h-3" />
                  </Button>
                )}

                {item.completed && (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                )}
              </div>
            ))}
          </div>

          {validation?.canExecute ? (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle2 className="w-5 h-5 text-green-600" />
                <h3 className="font-medium text-green-800">¡Operación Lista!</h3>
              </div>
              <p className="text-sm text-green-700 mb-3">
                Todos los requisitos han sido completados. La operación está lista para crear inmersiones.
              </p>
              <Button onClick={handleFinalize} className="w-full">
                Finalizar Validación
              </Button>
            </div>
          ) : (
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-5 h-5 text-yellow-600" />
                <h3 className="font-medium text-yellow-800">Validación Incompleta</h3>
              </div>
              <p className="text-sm text-yellow-700">
                Complete todos los elementos requeridos para proceder con inmersiones.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* HPT Dialog */}
      <Dialog open={showHPTForm} onOpenChange={setShowHPTForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear HPT</DialogTitle>
          </DialogHeader>
          <HPTWizard
            operacionId={operacionId}
            onComplete={() => {
              setShowHPTForm(false);
              loadValidation();
              if (onHPTCreated) onHPTCreated();
            }}
            onCancel={() => setShowHPTForm(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Anexo Bravo Dialog */}
      <Dialog open={showAnexoBravoForm} onOpenChange={setShowAnexoBravoForm}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Crear Anexo Bravo</DialogTitle>
          </DialogHeader>
          <FullAnexoBravoForm
            operacionId={operacionId}
            onSubmit={handleCreateAnexoBravo}
            onCancel={() => setShowAnexoBravoForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
