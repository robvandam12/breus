
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, FileText, Shield, Clock, ExternalLink } from "lucide-react";
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

  // Verificar documentos existentes
  const { data: documentStatus, refetch, isLoading } = useQuery({
    queryKey: ['validation-documents', operacionId],
    queryFn: async () => {
      console.log('Checking document status for validation:', operacionId);
      
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

      console.log('Document validation results:', { hptResult, anexoResult });

      const hptCompleted = hptResult.data?.firmado && hptResult.data?.estado === 'firmado';
      const anexoCompleted = anexoResult.data?.firmado && anexoResult.data?.estado === 'firmado';

      return {
        hptCompleted: !!hptCompleted,
        anexoCompleted: !!anexoCompleted,
        hptCount: hptResult.data ? 1 : 0,
        anexoCount: anexoResult.data ? 1 : 0,
        hptData: hptResult.data,
        anexoData: anexoResult.data
      };
    },
    refetchInterval: 3000
  });

  const handleValidateAndContinue = async () => {
    setIsValidating(true);
    try {
      console.log('Starting validation process for operation:', operacionId);
      
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
        console.error('Error updating operation approval status:', error);
        throw error;
      }

      console.log('Operation validation completed successfully');

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

  const handleCreateDocument = (type: 'hpt' | 'anexo') => {
    const url = type === 'hpt' 
      ? `/hpt?operacion=${operacionId}` 
      : `/anexo-bravo?operacion=${operacionId}`;
    window.open(url, '_blank');
  };

  const getStatusIcon = (completed: boolean) => {
    return completed ? (
      <CheckCircle className="w-5 h-5 text-green-600" />
    ) : (
      <Clock className="w-5 h-5 text-yellow-600" />
    );
  };

  const allDocumentsReady = documentStatus?.hptCompleted && documentStatus?.anexoCompleted;

  if (isLoading) {
    return (
      <div className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Cargando estado de documentos...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

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
            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <FileText className="w-4 h-4 text-blue-600" />
                <div className="flex-1">
                  <p className="font-medium">HPT (Herramientas y Procedimientos)</p>
                  <p className="text-sm text-gray-600">
                    {documentStatus?.hptCount || 0} documento(s) creado(s)
                    {documentStatus?.hptData && ` - ${documentStatus.hptData.codigo}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!documentStatus?.hptData && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCreateDocument('hpt')}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Crear HPT
                  </Button>
                )}
                {getStatusIcon(documentStatus?.hptCompleted || false)}
              </div>
            </div>

            <div className="flex items-center justify-between p-3 border rounded-lg">
              <div className="flex items-center gap-3">
                <Shield className="w-4 h-4 text-green-600" />
                <div className="flex-1">
                  <p className="font-medium">Anexo Bravo</p>
                  <p className="text-sm text-gray-600">
                    {documentStatus?.anexoCount || 0} documento(s) creado(s)
                    {documentStatus?.anexoData && ` - ${documentStatus.anexoData.codigo}`}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {!documentStatus?.anexoData && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleCreateDocument('anexo')}
                    className="flex items-center gap-1"
                  >
                    <ExternalLink className="w-3 h-3" />
                    Crear Anexo
                  </Button>
                )}
                {getStatusIcon(documentStatus?.anexoCompleted || false)}
              </div>
            </div>
          </div>

          {!allDocumentsReady && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-yellow-800">
                <strong>Documentos pendientes:</strong> Complete y firme todos los documentos requeridos antes de continuar.
                Los documentos se abren en nueva pestaña para facilitar el proceso.
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

          <Button 
            onClick={handleValidateAndContinue}
            disabled={!allDocumentsReady || isValidating}
            className="w-full"
          >
            {isValidating ? 'Validando...' : 'Aprobar y Continuar'}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
