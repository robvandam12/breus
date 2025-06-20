
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Settings, Clock, AlertTriangle, CheckCircle, Calendar } from "lucide-react";
import { useNetworkMaintenance } from "@/hooks/useNetworkModules";
import type { NetworkMaintenanceTask } from "@/hooks/useNetworkModules";

export const NetworkMaintenanceManager = () => {
  const { maintenanceTasks, isLoading, canAccessMaintenance } = useNetworkMaintenance();
  const [selectedTask, setSelectedTask] = useState<NetworkMaintenanceTask | null>(null);

  if (!canAccessMaintenance) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Módulo de Mantención de Redes
            </h3>
            <p className="text-gray-600">
              Este módulo no está habilitado para tu empresa.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Contacta al administrador para activar este módulo.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'programada':
        return <Badge className="bg-blue-100 text-blue-800"><Calendar className="w-3 h-3 mr-1" />Programada</Badge>;
      case 'en_proceso':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />En Proceso</Badge>;
      case 'completada':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completada</Badge>;
      case 'cancelada':
        return <Badge className="bg-red-100 text-red-800">Cancelada</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  const getPriorityBadge = (prioridad: string) => {
    switch (prioridad) {
      case 'critica':
        return <Badge className="bg-red-100 text-red-800"><AlertTriangle className="w-3 h-3 mr-1" />Crítica</Badge>;
      case 'alta':
        return <Badge className="bg-orange-100 text-orange-800">Alta</Badge>;
      case 'media':
        return <Badge className="bg-yellow-100 text-yellow-800">Media</Badge>;
      case 'baja':
        return <Badge className="bg-green-100 text-green-800">Baja</Badge>;
      default:
        return <Badge>Normal</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-4 bg-gray-200 rounded w-5/6"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Mantención de Redes</h2>
          <p className="text-gray-600">Gestión de tareas de mantenimiento preventivo y correctivo</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Tarea
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Programadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {maintenanceTasks.filter(t => t.estado === 'programada').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-yellow-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">En Proceso</p>
                <p className="text-2xl font-bold text-gray-900">
                  {maintenanceTasks.filter(t => t.estado === 'en_proceso').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <CheckCircle className="h-8 w-8 text-green-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Completadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {maintenanceTasks.filter(t => t.estado === 'completada').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <AlertTriangle className="h-8 w-8 text-red-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Críticas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {maintenanceTasks.filter(t => t.prioridad === 'critica').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Tareas */}
      <Card>
        <CardHeader>
          <CardTitle>Tareas de Mantención</CardTitle>
        </CardHeader>
        <CardContent>
          {maintenanceTasks.length === 0 ? (
            <div className="text-center py-8">
              <Settings className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No hay tareas de mantención programadas</p>
              <p className="text-sm text-gray-400 mt-2">
                Crea una nueva tarea para comenzar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {maintenanceTasks.map((task) => (
                <div
                  key={task.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedTask(task)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{task.descripcion}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Fecha programada: {new Date(task.fecha_programada).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Estimado: {task.estimacion_horas} horas
                      </p>
                      {task.equipos_involucrados.length > 0 && (
                        <p className="text-sm text-gray-600">
                          Equipos: {task.equipos_involucrados.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {getStatusBadge(task.estado)}
                      {getPriorityBadge(task.prioridad)}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
