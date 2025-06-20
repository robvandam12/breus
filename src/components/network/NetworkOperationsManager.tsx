
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Network, Users, Calendar, CheckCircle, Clock, Pause } from "lucide-react";
import { useNetworkOperations } from "@/hooks/useNetworkModules";
import type { NetworkOperation } from "@/hooks/useNetworkModules";

export const NetworkOperationsManager = () => {
  const { networkOperations, isLoading, canAccessOperations } = useNetworkOperations();
  const [selectedOperation, setSelectedOperation] = useState<NetworkOperation | null>(null);

  if (!canAccessOperations) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <Network className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Módulo de Faenas de Redes
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
      case 'planificada':
        return <Badge className="bg-blue-100 text-blue-800"><Calendar className="w-3 h-3 mr-1" />Planificada</Badge>;
      case 'ejecutando':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Ejecutando</Badge>;
      case 'completada':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completada</Badge>;
      case 'suspendida':
        return <Badge className="bg-red-100 text-red-800"><Pause className="w-3 h-3 mr-1" />Suspendida</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  const getTipoFaenaBadge = (tipo: string) => {
    switch (tipo) {
      case 'instalacion':
        return <Badge className="bg-green-100 text-green-800">Instalación</Badge>;
      case 'cambio_red':
        return <Badge className="bg-blue-100 text-blue-800">Cambio Red</Badge>;
      case 'reparacion':
        return <Badge className="bg-orange-100 text-orange-800">Reparación</Badge>;
      case 'inspeccion':
        return <Badge className="bg-purple-100 text-purple-800">Inspección</Badge>;
      default:
        return <Badge>General</Badge>;
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
          <h2 className="text-2xl font-bold text-gray-900">Faenas de Redes</h2>
          <p className="text-gray-600">Gestión de operaciones y faenas en sistemas de redes</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Faena
        </Button>
      </div>

      {/* Estadísticas */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Planificadas</p>
                <p className="text-2xl font-bold text-gray-900">
                  {networkOperations.filter(op => op.estado === 'planificada').length}
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
                <p className="text-sm font-medium text-gray-600">Ejecutando</p>
                <p className="text-2xl font-bold text-gray-900">
                  {networkOperations.filter(op => op.estado === 'ejecutando').length}
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
                  {networkOperations.filter(op => op.estado === 'completada').length}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-purple-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Equipos Activos</p>
                <p className="text-2xl font-bold text-gray-900">
                  {new Set(networkOperations.flatMap(op => op.equipo_asignado)).size}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Faenas */}
      <Card>
        <CardHeader>
          <CardTitle>Faenas Activas</CardTitle>
        </CardHeader>
        <CardContent>
          {networkOperations.length === 0 ? (
            <div className="text-center py-8">
              <Network className="mx-auto h-12 w-12 text-gray-400 mb-4" />
              <p className="text-gray-500">No hay faenas de redes programadas</p>
              <p className="text-sm text-gray-400 mt-2">
                Crea una nueva faena para comenzar
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {networkOperations.map((operation) => (
                <div
                  key={operation.id}
                  className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => setSelectedOperation(operation)}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{operation.descripcion}</h3>
                      <p className="text-sm text-gray-600 mt-1">
                        Fecha ejecución: {new Date(operation.fecha_ejecucion).toLocaleDateString()}
                      </p>
                      <p className="text-sm text-gray-600">
                        Supervisor: {operation.supervisor_id}
                      </p>
                      {operation.equipo_asignado.length > 0 && (
                        <p className="text-sm text-gray-600">
                          Equipo: {operation.equipo_asignado.join(', ')}
                        </p>
                      )}
                    </div>
                    <div className="flex flex-col gap-2 items-end">
                      {getStatusBadge(operation.estado)}
                      {getTipoFaenaBadge(operation.tipo_faena)}
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
