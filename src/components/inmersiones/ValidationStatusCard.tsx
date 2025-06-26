
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, XCircle, FileCheck, AlertTriangle, Play, CheckSquare } from "lucide-react";
import { ValidationStatus, useInmersiones } from "@/hooks/useInmersiones";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface ValidationStatusCardProps {
  operacionId: string;
  inmersionId: string;
  currentStatus: string;
  onStatusChange: () => void;
}

export const ValidationStatusCard = ({ 
  operacionId, 
  inmersionId, 
  currentStatus, 
  onStatusChange 
}: ValidationStatusCardProps) => {
  const [validation, setValidation] = useState<ValidationStatus | null>(null);
  const [loading, setLoading] = useState(false);
  const { validateOperationDocuments, executeInmersion, completeInmersion } = useInmersiones();

  useEffect(() => {
    loadValidationStatus();
  }, [operacionId]);

  const loadValidationStatus = async () => {
    setLoading(true);
    try {
      const status = await validateOperationDocuments(operacionId);
      setValidation(status);
    } catch (error) {
      console.error('Error loading validation status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleExecuteInmersion = async () => {
    setLoading(true);
    try {
      await executeInmersion(inmersionId);
      onStatusChange();
      await loadValidationStatus();
    } catch (error) {
      console.error('Error executing inmersion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteInmersion = async () => {
    setLoading(true);
    try {
      await completeInmersion(inmersionId);
      onStatusChange();
    } catch (error) {
      console.error('Error completing inmersion:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading && !validation) {
    return (
      <Card>
        <CardContent className="p-6">
          <LoadingSpinner text="Verificando documentos..." />
        </CardContent>
      </Card>
    );
  }

  const getStatusColor = (hasValid: boolean) => 
    hasValid ? "bg-green-100 text-green-700" : "bg-red-100 text-red-700";

  const getStatusIcon = (hasValid: boolean) => 
    hasValid ? <CheckCircle className="w-4 h-4" /> : <XCircle className="w-4 h-4" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileCheck className="w-5 h-5 text-blue-600" />
          Estado de Validación
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-3">
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              {getStatusIcon(validation?.hasValidHPT || false)}
              <span className="font-medium">HPT</span>
            </div>
            <Badge variant="outline" className={getStatusColor(validation?.hasValidHPT || false)}>
              {validation?.hasValidHPT ? `Firmado (${validation.hptCode})` : 'Pendiente'}
            </Badge>
          </div>

          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              {getStatusIcon(validation?.hasValidAnexoBravo || false)}
              <span className="font-medium">Anexo Bravo</span>
            </div>
            <Badge variant="outline" className={getStatusColor(validation?.hasValidAnexoBravo || false)}>
              {validation?.hasValidAnexoBravo ? `Firmado (${validation.anexoBravoCode})` : 'Pendiente'}
            </Badge>
          </div>
        </div>

        {!validation?.canExecute && currentStatus === 'planificada' && (
          <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-center gap-2 text-amber-700">
              <AlertTriangle className="w-4 h-4" />
              <span className="text-sm font-medium">Documentos Pendientes</span>
            </div>
            <p className="text-sm text-amber-600 mt-1">
              Se requieren HPT y Anexo Bravo firmados para ejecutar la inmersión.
            </p>
          </div>
        )}

        <div className="pt-3 border-t">
          {currentStatus === 'planificada' && validation?.canExecute && (
            <Button 
              onClick={handleExecuteInmersion}
              disabled={loading}
              className="w-full bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              Ejecutar Inmersión
            </Button>
          )}

          {currentStatus === 'en_curso' && (
            <Button 
              onClick={handleCompleteInmersion}
              disabled={loading}
              className="w-full bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <LoadingSpinner size="sm" className="mr-2" />
              ) : (
                <CheckSquare className="w-4 h-4 mr-2" />
              )}
              Completar Inmersión
            </Button>
          )}

          {(currentStatus === 'completada' || currentStatus === 'cancelada') && (
            <Badge variant="outline" className="w-full justify-center py-2">
              {currentStatus === 'completada' ? 'Inmersión Completada' : 'Inmersión Cancelada'}
            </Badge>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
