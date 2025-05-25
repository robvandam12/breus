
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, AlertTriangle, XCircle, FileText, Settings } from "lucide-react";
import { ValidationResult } from "@/hooks/usePreDiveValidation";

interface ValidationStatusCardProps {
  operationName: string;
  validation: ValidationResult;
  onViewDetails?: () => void;
  onFixIssues?: () => void;
}

export const ValidationStatusCard: React.FC<ValidationStatusCardProps> = ({
  operationName,
  validation,
  onViewDetails,
  onFixIssues
}) => {
  const getStatusBadge = (status: 'missing' | 'pending' | 'signed', type: 'HPT' | 'Anexo Bravo') => {
    switch (status) {
      case 'signed':
        return (
          <Badge className="bg-green-100 text-green-700">
            <CheckCircle className="w-3 h-3 mr-1" />
            {type} Firmado
          </Badge>
        );
      case 'pending':
        return (
          <Badge className="bg-yellow-100 text-yellow-700">
            <AlertTriangle className="w-3 h-3 mr-1" />
            {type} Pendiente
          </Badge>
        );
      case 'missing':
        return (
          <Badge className="bg-red-100 text-red-700">
            <XCircle className="w-3 h-3 mr-1" />
            {type} Faltante
          </Badge>
        );
    }
  };

  const getOverallStatus = () => {
    if (validation.isValid) {
      return {
        icon: CheckCircle,
        color: 'text-green-600',
        bgColor: 'bg-green-50 border-green-200',
        label: 'Validado para Inmersión'
      };
    } else if (validation.errors.length > 0) {
      return {
        icon: XCircle,
        color: 'text-red-600',
        bgColor: 'bg-red-50 border-red-200',
        label: 'Requiere Correcciones'
      };
    } else {
      return {
        icon: AlertTriangle,
        color: 'text-yellow-600',
        bgColor: 'bg-yellow-50 border-yellow-200',
        label: 'Pendiente de Completar'
      };
    }
  };

  const overallStatus = getOverallStatus();
  const StatusIcon = overallStatus.icon;

  return (
    <Card className={`${overallStatus.bgColor}`}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <StatusIcon className={`w-5 h-5 ${overallStatus.color}`} />
            <span className="truncate">{operationName}</span>
          </div>
          <Badge variant={validation.isValid ? "default" : "destructive"}>
            {overallStatus.label}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        {/* Estado de Documentos */}
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">HPT:</span>
            {getStatusBadge(validation.hptStatus, 'HPT')}
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Anexo Bravo:</span>
            {getStatusBadge(validation.anexoBravoStatus, 'Anexo Bravo')}
          </div>
        </div>

        {/* Errores */}
        {validation.errors.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-red-600">Errores:</p>
            {validation.errors.map((error, index) => (
              <p key={index} className="text-xs text-red-600 flex items-center gap-1">
                <XCircle className="w-3 h-3" />
                {error}
              </p>
            ))}
          </div>
        )}

        {/* Advertencias */}
        {validation.warnings.length > 0 && (
          <div className="space-y-1">
            <p className="text-sm font-medium text-yellow-600">Advertencias:</p>
            {validation.warnings.map((warning, index) => (
              <p key={index} className="text-xs text-yellow-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {warning}
              </p>
            ))}
          </div>
        )}

        {/* Acciones */}
        <div className="flex gap-2 pt-2">
          {onViewDetails && (
            <Button variant="outline" size="sm" onClick={onViewDetails}>
              <FileText className="w-4 h-4 mr-1" />
              Ver Detalles
            </Button>
          )}
          {!validation.isValid && onFixIssues && (
            <Button variant="outline" size="sm" onClick={onFixIssues}>
              <Settings className="w-4 h-4 mr-1" />
              Corregir
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
