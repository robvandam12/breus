
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CheckCircle, Clock, AlertTriangle, FileText, Waves, BookOpen } from "lucide-react";
import { WorkflowStatus } from "@/hooks/useWorkflow";
import { useNavigate } from "react-router-dom";

interface WorkflowCardProps {
  status: WorkflowStatus;
  onRefresh?: () => void;
}

export const WorkflowCard = ({ status, onRefresh }: WorkflowCardProps) => {
  const navigate = useNavigate();

  const getStepStatus = (step: string) => {
    const currentStepIndex = getStepIndex(status.workflow_step);
    const stepIndex = getStepIndex(step);

    if (stepIndex < currentStepIndex) return 'completed';
    if (stepIndex === currentStepIndex) return 'current';
    return 'pending';
  };

  const getStepIndex = (step: string): number => {
    const steps = ['operacion', 'hpt', 'anexo_bravo', 'inmersion', 'bitacora', 'completado'];
    return steps.indexOf(step);
  };

  const getStatusIcon = (stepStatus: string) => {
    switch (stepStatus) {
      case 'completed':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'current':
        return <Clock className="w-4 h-4 text-blue-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-400" />;
    }
  };

  const getStatusBadge = (stepStatus: string) => {
    switch (stepStatus) {
      case 'completed':
        return <Badge variant="secondary" className="bg-green-100 text-green-700">Completado</Badge>;
      case 'current':
        return <Badge variant="secondary" className="bg-blue-100 text-blue-700">En Proceso</Badge>;
      default:
        return <Badge variant="secondary" className="bg-gray-100 text-gray-500">Pendiente</Badge>;
    }
  };

  const handleCreateHPT = () => {
    navigate(`/operaciones/hpt?operacion_id=${status.operacion_id}`);
  };

  const handleCreateAnexoBravo = () => {
    navigate(`/operaciones/anexo-bravo?operacion_id=${status.operacion_id}`);
  };

  const handleCreateInmersion = () => {
    navigate(`/operaciones/inmersiones?operacion_id=${status.operacion_id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-blue-600" />
            Flujo de Trabajo
          </span>
          {onRefresh && (
            <Button variant="outline" size="sm" onClick={onRefresh}>
              Actualizar
            </Button>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="text-sm text-gray-600 mb-4">
          Operación: <span className="font-medium">{status.operacion_nombre}</span>
        </div>

        <div className="space-y-3">
          {/* HPT Step */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(getStepStatus('hpt'))}
              <div>
                <div className="font-medium">HPT (Hoja de Planificación)</div>
                <div className="text-sm text-gray-500">
                  {status.hpt_exists 
                    ? `Código: ${status.hpt_codigo} ${status.hpt_firmado ? '(Firmado)' : '(Pendiente firma)'}`
                    : 'No creado'
                  }
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(getStepStatus('hpt'))}
              {!status.hpt_exists && (
                <Button size="sm" onClick={handleCreateHPT}>
                  Crear HPT
                </Button>
              )}
            </div>
          </div>

          {/* Anexo Bravo Step */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(getStepStatus('anexo_bravo'))}
              <div>
                <div className="font-medium">Anexo Bravo</div>
                <div className="text-sm text-gray-500">
                  {status.anexo_bravo_exists 
                    ? `Código: ${status.anexo_bravo_codigo} ${status.anexo_bravo_firmado ? '(Firmado)' : '(Pendiente firma)'}`
                    : 'No creado'
                  }
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(getStepStatus('anexo_bravo'))}
              {!status.anexo_bravo_exists && status.hpt_firmado && (
                <Button size="sm" onClick={handleCreateAnexoBravo}>
                  Crear Anexo Bravo
                </Button>
              )}
            </div>
          </div>

          {/* Inmersión Step */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(getStepStatus('inmersion'))}
              <div>
                <div className="font-medium">Inmersiones</div>
                <div className="text-sm text-gray-500">
                  {status.inmersiones_count} inmersiones registradas
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(getStepStatus('inmersion'))}
              {status.can_create_inmersion && (
                <Button size="sm" onClick={handleCreateInmersion}>
                  <Waves className="w-4 h-4 mr-1" />
                  Nueva Inmersión
                </Button>
              )}
            </div>
          </div>

          {/* Bitácora Step */}
          <div className="flex items-center justify-between p-3 border rounded-lg">
            <div className="flex items-center gap-3">
              {getStatusIcon(getStepStatus('bitacora'))}
              <div>
                <div className="font-medium">Bitácoras</div>
                <div className="text-sm text-gray-500">
                  {status.bitacoras_count} de {status.inmersiones_count} bitácoras completadas
                </div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge(getStepStatus('bitacora'))}
              {status.inmersiones_count > 0 && status.bitacoras_count < status.inmersiones_count && (
                <Button size="sm" onClick={() => navigate('/operaciones/bitacoras')}>
                  <BookOpen className="w-4 h-4 mr-1" />
                  Completar Bitácoras
                </Button>
              )}
            </div>
          </div>
        </div>

        {status.workflow_step === 'completado' && (
          <div className="p-3 bg-green-50 border border-green-200 rounded-lg">
            <div className="flex items-center gap-2 text-green-700">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Flujo de trabajo completado</span>
            </div>
            <p className="text-sm text-green-600 mt-1">
              Todos los documentos han sido generados y firmados correctamente.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
