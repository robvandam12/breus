
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, FileText, Shield, Clock, Plus } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ValidationGatewayProps {
  operacionId: string;
  onValidationComplete: () => void;
}

export const ValidationGateway = ({ operacionId, onValidationComplete }: ValidationGatewayProps) => {
  const [isValidating, setIsValidating] = useState(false);

  // MEJORA: Verificar documentos existentes con manejo robusto de errores
  const { data: documentStatus, refetch, isLoading } = useQuery({
    queryKey: ['validation-documents', operacionId],
    queryFn: async () => {
      console.log('Checking validation documents for operation:', operacionId);
      
      try {
        const [hptResult, anexoResult] = await Promise.all([
          supabase
            .from('hpt')
            .select('id, firmado, estado, codigo')
            .eq('operacion_id', operacionId)
            .maybeSingle(),
          
          supabase
            .from('anexo_bravo')
            .select('id, firmado, estado, codigo')
            .eq('operacion_id', operacionId)
            .maybeSingle()
        ]);

        // Verificar errores reales
        if (hptResult.error && hptResult.error.code !== 'PGRST116') {
          console.error('Error checking HPT:', hptResult.error);
          throw hptResult.error;
        }

        if (anexoResult.error && anexoResult.error.code !== 'PGRST116') {
          console.error('Error checking Anexo Bravo:', anexoResult.error);
          throw anexoResult.error;
        }

        const hptExists = !!hptResult.data;
        const hptCompleted = hptResult.data?.firmado && hptResult.data?.estado === 'firmado';
        
        const anexoExists = !!anexoResult.data;
        const anexoCompleted = anexoResult.data?.firmado && anexoResult.data?.estado === 'firmado';

        console.log('Document validation status:', {
          hptExists,
          hptCompleted,
          anexoExists,
          anexoCompleted
        });

        return {
          hptExists,
          hptCompleted,
          anexoExists,
          anexoCompleted,
          hptData: hptResult.data,
          anexoData: anexoResult.data
        };
      } catch (error) {
        console.error('Error checking validation documents:', error);
        throw error;
      }
    },
    refetchInterval: 3000 // Refrescar cada 3 segundos para detectar cambios
  });

  const handleValidateAndContinue = async () => {
    setIsValidating(true);
    try {
      // Refrescar estado de documentos
      await refetch();
      
      if (!documentStatus?.hptCompleted || !documentStatus?.anexoCompleted) {
        toast({
          title: "Validación incompleta",
          description: "Debe completar y firmar todos los documentos requeridos antes de continuar.",
          variant: "destructive"
        });
        return;
      }

      // Marcar operación como validada
      const { error } = await supabase
        .from('operacion')
        .update({ estado_aprobacion: 'aprobada' })
        .eq('id', operacionId);

      if (error) {
        console.error('Error updating operation approval:', error);
        throw error;
      }

      toast({
        title: "¡Validación completada!",
        description: "La operación está completamente validada y lista para inmersiones."
      });

      onValidationComplete();
    } catch (error) {
      console.error('Error validating operation:', error);
      toast({
        title: "Error en validación",
        description: "No se pudo completar la validación.",
        variant: "destructive"
      });
    } finally {
      setIsValidating(false);
    }
  };

  const handleCreateDocument = (type: 'hpt' | 'anexo-bravo') => {
    const urls = {
      'hpt': `/hpt?operacion=${operacionId}`,
      'anexo-bravo': `/anexo-bravo?operacion=${operacionId}`
    };
    
    window.open(urls[type], '_blank');
  };

  const getStatusIcon = (exists: boolean, completed: boolean) => {
    if (completed) {
      return <CheckCircle className="w-5 h-5 text-green-600" />;
    } else if (exists) {
      return <Clock className="w-5 h-5 text-yellow-600" />;
    } else {
      return <AlertTriangle className="w-5 h-5 text-red-600" />;
    }
  };

  const getStatusText = (exists: boolean, completed: boolean) => {
    if (completed) {
      return "Completado y firmado";
    } else if (exists) {
      return "Creado pero no firmado";
    } else {
      return "No creado";
    }
  };

  const getStatusColor = (exists: boolean, completed: boolean) => {
    if (completed) {
      return "text-green-700 bg-green-50 border-green-200";
    } else if (exists) {
      return "text-yellow-700 bg-yellow-50 border-yellow-200";
    } else {
      return "text-red-700 bg-red-50 border-red-200";
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">Verificando documentos...</div>
        </CardContent>
      </Card>
    );
  }

  const allDocumentsReady = documentStatus?.hptCompleted && documentStatus?.anexoCompleted;

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Validación de Operación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            {/* HPT Status */}
            <div className={`flex items-center justify-between p-4 border rounded-lg ${getStatusColor(documentStatus?.hptExists || false, documentStatus?.hptCompleted || false)}`}>
              <div className="flex items-center gap-3">
                <FileText className="w-5 h-5 text-blue-600" />
                <div>
                  <p className="font-medium">HPT (Herramientas y Procedimientos)</p>
                  <p className="text-sm">
                    {getStatusText(documentStatus?.hptExists || false, documentStatus?.hptCompleted || false)}
                    {documentStatus?.hptData?.codigo && (
                      <span className="ml-2 font-mono text-xs">({documentStatus.hptData.codigo})</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(documentStatus?.hptExists || false, documentStatus?.hptCompleted || false)}
                {!documentStatus?.hptExists && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCreateDocument('hpt')}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Crear HPT
                  </Button>
                )}
              </div>
            </div>

            {/* Anexo Bravo Status */}
            <div className={`flex items-center justify-between p-4 border rounded-lg ${getStatusColor(documentStatus?.anexoExists || false, documentStatus?.anexoCompleted || false)}`}>
              <div className="flex items-center gap-3">
                <Shield className="w-5 h-5 text-green-600" />
                <div>
                  <p className="font-medium">Anexo Bravo</p>
                  <p className="text-sm">
                    {getStatusText(documentStatus?.anexoExists || false, documentStatus?.anexoCompleted || false)}
                    {documentStatus?.anexoData?.codigo && (
                      <span className="ml-2 font-mono text-xs">({documentStatus.anexoData.codigo})</span>
                    )}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {getStatusIcon(documentStatus?.anexoExists || false, documentStatus?.anexoCompleted || false)}
                {!documentStatus?.anexoExists && (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => handleCreateDocument('anexo-bravo')}
                    className="flex items-center gap-1"
                  >
                    <Plus className="w-3 h-3" />
                    Crear Anexo Bravo
                  </Button>
                )}
              </div>
            </div>
          </div>

          {/* Status Alert */}
          {!allDocumentsReady && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-yellow-800">
                <strong>Documentos pendientes:</strong> Complete y firme todos los documentos requeridos antes de continuar.
                Los documentos se actualizan automáticamente cada 3 segundos.
              </AlertDescription>
            </Alert>
          )}

          {allDocumentsReady && (
            <Alert className="border-green-200 bg-green-50">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription className="text-green-800">
                <strong>¡Listo para continuar!</strong> Todos los documentos están completos y firmados.
              </AlertDescription>
            </Alert>
          )}

          {/* Action Button */}
          <Button 
            onClick={handleValidateAndContinue}
            disabled={!allDocumentsReady || isValidating}
            className="w-full"
            size="lg"
          >
            {isValidating ? 'Validando...' : 'Aprobar y Continuar'}
          </Button>

          {/* Refresh Button */}
          <Button 
            variant="outline"
            onClick={() => refetch()}
            className="w-full"
            size="sm"
          >
            Actualizar Estado de Documentos
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
