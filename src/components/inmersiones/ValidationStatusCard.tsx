
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Play, CheckSquare, AlertTriangle } from 'lucide-react';
import { useInmersiones, type ValidationStatus } from '@/hooks/useInmersiones';

interface ValidationStatusCardProps {
  operacionId?: string;
  inmersionId: string;
  currentStatus: string;
  onStatusChange?: () => void;
}

export const ValidationStatusCard = ({ 
  operacionId, 
  inmersionId, 
  currentStatus, 
  onStatusChange 
}: ValidationStatusCardProps) => {
  const { validateOperationDocuments, executeInmersion, completeInmersion } = useInmersiones();
  const [validationStatus, setValidationStatus] = useState<ValidationStatus | null>(null);
  const [isValidating, setIsValidating] = useState(false);

  useEffect(() => {
    if (operacionId) {
      handleValidation();
    }
  }, [operacionId]);

  const handleValidation = async () => {
    if (!operacionId) return;
    
    setIsValidating(true);
    try {
      await validateOperationDocuments(operacionId);
    } catch (error) {
      console.error('Error validating documents:', error);
    } finally {
      setIsValidating(false);
    }
  };

  const handleExecute = async () => {
    try {
      await executeInmersion(inmersionId);
      onStatusChange?.();
    } catch (error) {
      console.error('Error executing inmersion:', error);
    }
  };

  const handleComplete = async () => {
    try {
      await completeInmersion(inmersionId);
      onStatusChange?.();
    } catch (error) {
      console.error('Error completing inmersion:', error);
    }
  };

  const canExecute = validationStatus?.canExecute && currentStatus === 'planificada';
  const canComplete = currentStatus === 'en_progreso';

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckSquare className="w-5 h-5" />
          Estado de Validación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {operacionId ? (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">HPT Validado</span>
                <div className="flex items-center gap-2">
                  {validationStatus?.hasValidHPT ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        {validationStatus.hptCode}
                      </Badge>
                    </>
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Anexo Bravo Validado</span>
                <div className="flex items-center gap-2">
                  {validationStatus?.hasValidAnexoBravo ? (
                    <>
                      <CheckCircle className="w-4 h-4 text-green-600" />
                      <Badge variant="outline" className="bg-green-100 text-green-700">
                        {validationStatus.anexoBravoCode}
                      </Badge>
                    </>
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm">Equipo Asignado</span>
                <div className="flex items-center gap-2">
                  {validationStatus?.hasTeam ? (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  ) : (
                    <XCircle className="w-4 h-4 text-red-600" />
                  )}
                </div>
              </div>
            </div>

            {!validationStatus?.canExecute && (
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Para ejecutar esta inmersión se requiere completar la validación de documentos y asignación de equipo.
                </AlertDescription>
              </Alert>
            )}

            <div className="space-y-2">
              <Button
                onClick={handleValidation}
                disabled={isValidating}
                variant="outline"
                className="w-full"
              >
                {isValidating ? 'Validando...' : 'Revalidar Documentos'}
              </Button>

              {canExecute && (
                <Button
                  onClick={handleExecute}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Ejecutar Inmersión
                </Button>
              )}

              {canComplete && (
                <Button
                  onClick={handleComplete}
                  className="w-full bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Completar Inmersión
                </Button>
              )}
            </div>
          </>
        ) : (
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Esta es una inmersión independiente. No requiere validación de documentos.
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
};
