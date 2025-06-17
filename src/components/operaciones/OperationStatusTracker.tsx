
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Activity, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  Users, 
  FileText,
  Shield,
  Settings,
  Play,
  Loader2,
  Plus
} from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useRouter } from "@/hooks/useRouter";
import { toast } from "@/hooks/use-toast";

interface OperationStatus {
  id: string;
  nombre: string;
  codigo: string;
  estado: 'planificacion' | 'preparacion' | 'ejecucion' | 'finalizacion' | 'completada';
  progreso: number;
  fechaInicio: string;
  fechaFin?: string;
  documentos: {
    hpt: boolean;
    anexoBravo: boolean;
    bitacorasSupervisor: number;
    bitacorasBuzo: number;
  };
  equipo: {
    supervisor: boolean;
    buzos: number;
    equipoCompleto: boolean;
  };
  alertas: number;
  canExecute: boolean;
  sitioAsignado: boolean;
}

interface OperationStatusTrackerProps {
  operaciones: any[];
}

export const OperationStatusTracker = ({ operaciones }: OperationStatusTrackerProps) => {
  const [operationStatuses, setOperationStatuses] = useState<OperationStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { validateOperacionCompleteness } = useOperaciones();
  const { navigateTo } = useRouter();

  useEffect(() => {
    calculateStatuses();
  }, [operaciones]);

  const calculateStatuses = async () => {
    setIsLoading(true);
    try {
      const statuses = await Promise.all(
        operaciones.map(async (op) => {
          try {
            const validation = await validateOperacionCompleteness(op.id);
            
            // Calcular progreso basado en validaciones reales con pesos específicos
            let progreso = 0;
            const steps = [
              { completed: true, weight: 15, name: 'Operación creada' },
              { completed: !!op.sitio_id, weight: 15, name: 'Sitio definido' },
              { completed: validation.supervisorAsignado, weight: 15, name: 'Supervisor asignado' },
              { completed: validation.equipoAsignado, weight: 15, name: 'Equipo asignado' },
              { completed: validation.hptReady, weight: 20, name: 'HPT completado' },
              { completed: validation.anexoBravoReady, weight: 20, name: 'Anexo Bravo completado' }
            ];
            
            progreso = steps.reduce((acc, step) => acc + (step.completed ? step.weight : 0), 0);
            
            // Determinar estado basado en progreso y validaciones
            let estado: OperationStatus['estado'] = 'planificacion';
            
            if (progreso >= 100 && validation.canExecute) {
              estado = 'preparacion'; // Lista para inmersiones
            } else if (progreso >= 80) {
              estado = 'preparacion';
            } else if (progreso >= 40) {
              estado = 'planificacion';
            }

            // Contar alertas basado en elementos faltantes críticos
            let alertas = 0;
            if (!validation.hptReady) alertas++;
            if (!validation.anexoBravoReady) alertas++;
            if (!validation.supervisorAsignado) alertas++;
            if (!validation.equipoAsignado) alertas++;

            return {
              id: op.id,
              nombre: op.nombre,
              codigo: op.codigo,
              estado,
              progreso,
              fechaInicio: op.fecha_inicio,
              fechaFin: op.fecha_fin,
              documentos: {
                hpt: validation.hptReady,
                anexoBravo: validation.anexoBravoReady,
                bitacorasSupervisor: 0, // Se calcularía desde inmersiones reales
                bitacorasBuzo: 0
              },
              equipo: {
                supervisor: validation.supervisorAsignado,
                buzos: validation.equipoAsignado ? 2 : 0, // Mock basado en equipo
                equipoCompleto: validation.equipoAsignado
              },
              alertas,
              canExecute: validation.canExecute,
              sitioAsignado: !!op.sitio_id
            } as OperationStatus;
          } catch (error) {
            console.error(`Error validating operation ${op.id}:`, error);
            return {
              id: op.id,
              nombre: op.nombre,
              codigo: op.codigo,
              estado: 'planificacion' as const,
              progreso: 15, // Solo operación creada
              fechaInicio: op.fecha_inicio,
              fechaFin: op.fecha_fin,
              documentos: { hpt: false, anexoBravo: false, bitacorasSupervisor: 0, bitacorasBuzo: 0 },
              equipo: { supervisor: false, buzos: 0, equipoCompleto: false },
              alertas: 4, // Máximo de alertas
              canExecute: false,
              sitioAsignado: !!op.sitio_id
            } as OperationStatus;
          }
        })
      );
      
      setOperationStatuses(statuses);
    } catch (error) {
      console.error('Error calculating operation statuses:', error);
      toast({
        title: "Error",
        description: "No se pudo calcular el estado de las operaciones",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getEstadoBadge = (estado: OperationStatus['estado']) => {
    switch (estado) {
      case 'planificacion':
        return <Badge className="bg-gray-100 text-gray-800">Planificación</Badge>;
      case 'preparacion':
        return <Badge className="bg-blue-100 text-blue-800">Preparación</Badge>;
      case 'ejecucion':
        return <Badge className="bg-green-100 text-green-800">Ejecución</Badge>;
      case 'finalizacion':
        return <Badge className="bg-yellow-100 text-yellow-800">Finalización</Badge>;
      case 'completada':
        return <Badge className="bg-emerald-100 text-emerald-800">Completada</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>;
    }
  };

  const getEstadoIcon = (estado: OperationStatus['estado']) => {
    switch (estado) {
      case 'planificacion':
        return <Clock className="w-4 h-4 text-gray-600" />;
      case 'preparacion':
        return <Settings className="w-4 h-4 text-blue-600" />;
      case 'ejecucion':
        return <Activity className="w-4 h-4 text-green-600" />;
      case 'finalizacion':
        return <FileText className="w-4 h-4 text-yellow-600" />;
      case 'completada':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getProgressColor = (progreso: number) => {
    if (progreso >= 80) return 'bg-green-500';
    if (progreso >= 60) return 'bg-blue-500';
    if (progreso >= 40) return 'bg-yellow-500';
    return 'bg-gray-500';
  };

  const handleExecuteOperation = (operacionId: string) => {
    navigateTo(`/inmersiones?operacion=${operacionId}`);
  };

  const handleConfigureOperation = (operacionId: string) => {
    navigateTo(`/operaciones?wizard=${operacionId}`);
  };

  const getMissingItems = (operacion: OperationStatus) => {
    const missing: string[] = [];
    if (!operacion.documentos.hpt) missing.push('HPT');
    if (!operacion.documentos.anexoBravo) missing.push('Anexo Bravo');
    if (!operacion.equipo.supervisor) missing.push('Supervisor');
    if (!operacion.equipo.equipoCompleto) missing.push('Equipo');
    if (!operacion.sitioAsignado) missing.push('Sitio');
    return missing;
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Estado de Operaciones
          </CardTitle>
        </CardHeader>
        <CardContent className="flex items-center justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin" />
          <span className="ml-2">Calculando estados...</span>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Activity className="w-5 h-5 text-blue-600" />
            Estado de Operaciones
          </div>
          <Button variant="outline" size="sm" onClick={calculateStatuses}>
            <Shield className="w-4 h-4 mr-2" />
            Recalcular
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {operationStatuses.length === 0 ? (
          <div className="text-center py-8">
            <Activity className="w-12 h-12 mx-auto text-gray-300 mb-4" />
            <p className="text-gray-500 mb-4">No hay operaciones activas</p>
            <Button onClick={() => navigateTo('/operaciones?wizard=new')}>
              <Plus className="w-4 h-4 mr-2" />
              Crear Nueva Operación
            </Button>
          </div>
        ) : (
          operationStatuses.map((operacion) => (
            <div key={operacion.id} className="p-4 border rounded-lg space-y-3">
              {/* Header */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  {getEstadoIcon(operacion.estado)}
                  <div>
                    <h4 className="font-medium">{operacion.nombre}</h4>
                    <p className="text-sm text-gray-600">
                      {operacion.codigo} • Inicio: {new Date(operacion.fechaInicio).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {operacion.alertas > 0 && (
                    <Badge variant="destructive" className="flex items-center gap-1">
                      <AlertTriangle className="w-3 h-3" />
                      {operacion.alertas}
                    </Badge>
                  )}
                  {getEstadoBadge(operacion.estado)}
                  
                  {operacion.canExecute ? (
                    <Button 
                      size="sm" 
                      className="flex items-center gap-1"
                      onClick={() => handleExecuteOperation(operacion.id)}
                    >
                      <Play className="w-3 h-3" />
                      Ejecutar
                    </Button>
                  ) : (
                    <Button 
                      size="sm" 
                      variant="outline"
                      className="flex items-center gap-1"
                      onClick={() => handleConfigureOperation(operacion.id)}
                    >
                      <Settings className="w-3 h-3" />
                      Configurar
                    </Button>
                  )}
                </div>
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progreso General</span>
                  <span className="font-medium">{operacion.progreso}%</span>
                </div>
                <div className="relative">
                  <Progress value={operacion.progreso} className="h-2" />
                  <div 
                    className={`absolute top-0 left-0 h-2 rounded-full transition-all ${getProgressColor(operacion.progreso)}`}
                    style={{ width: `${operacion.progreso}%` }}
                  />
                </div>
              </div>

              {/* Checklist detallado */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-sm">
                <div className="space-y-2">
                  <h5 className="font-medium flex items-center gap-1">
                    <FileText className="w-3 h-3" />
                    Documentos
                  </h5>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span>HPT</span>
                      {operacion.documentos.hpt ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Anexo Bravo</span>
                      {operacion.documentos.anexoBravo ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <Clock className="w-4 h-4 text-gray-400" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium flex items-center gap-1">
                    <Users className="w-3 h-3" />
                    Equipo y Sitio
                  </h5>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Supervisor</span>
                      {operacion.equipo.supervisor ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Sitio</span>
                      {operacion.sitioAsignado ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Equipo</span>
                      {operacion.equipo.equipoCompleto ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h5 className="font-medium flex items-center gap-1">
                    <Shield className="w-3 h-3" />
                    Estado
                  </h5>
                  <div className="space-y-1">
                    <div className="flex items-center justify-between">
                      <span>Validación</span>
                      {operacion.canExecute ? (
                        <CheckCircle2 className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-amber-500" />
                      )}
                    </div>
                    <div className="flex items-center justify-between">
                      <span>Completitud</span>
                      <span className="text-xs font-medium">{operacion.progreso}%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Elementos pendientes */}
              {!operacion.canExecute && (
                <div className="pt-2 border-t">
                  <p className="text-xs text-amber-600">
                    <strong>Pendientes:</strong> {getMissingItems(operacion).join(', ')}
                  </p>
                </div>
              )}
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};
