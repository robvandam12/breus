
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  FileText, 
  Plus, 
  Users, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  Info
} from "lucide-react";
import { BitacorasBuzoTable } from "./BitacorasBuzoTable";
import { BitacorasBuzoCards } from "./BitacorasBuzoCards";
import { SupervisorBitacoraSelector } from "./SupervisorBitacoraSelector";
import { CreateBitacoraBuzoFormCompleteWithInmersion } from "./CreateBitacoraBuzoFormCompleteWithInmersion";
import { useBitacorasBuzo } from "@/hooks/useBitacorasBuzo";
import { useAuth } from "@/hooks/useAuth";
import { useAuthRoles } from "@/hooks/useAuthRoles";

interface BitacorasBuzoContentProps {
  viewMode: 'cards' | 'table';
  onViewModeChange: (mode: 'cards' | 'table') => void;
}

export const BitacorasBuzoContent = ({ viewMode, onViewModeChange }: BitacorasBuzoContentProps) => {
  const { profile } = useAuth();
  const { permissions } = useAuthRoles();
  const { bitacorasBuzo } = useBitacorasBuzo();
  
  const [showCreateFromSupervisor, setShowCreateFromSupervisor] = useState(false);
  const [showCreateIndependent, setShowCreateIndependent] = useState(false);
  const [activeTab, setActiveTab] = useState('list');

  // Estadísticas para el rol salmonero
  const stats = {
    total: bitacorasBuzo?.length || 0,
    firmadas: bitacorasBuzo?.filter(b => b.firmado).length || 0,
    pendientes: bitacorasBuzo?.filter(b => !b.firmado).length || 0,
    aprobadas: bitacorasBuzo?.filter(b => b.estado_aprobacion === 'aprobada').length || 0,
  };

  const handleCreateFromSupervisor = (bitacoraSupervisorId: string) => {
    // TODO: Implementar creación desde supervisor
    console.log('Creating from supervisor:', bitacoraSupervisorId);
    setShowCreateFromSupervisor(false);
  };

  const handleCreateIndependent = (data: any) => {
    // TODO: Implementar creación independiente
    console.log('Creating independent:', data);
    setShowCreateIndependent(false);
  };

  if (showCreateFromSupervisor) {
    return (
      <SupervisorBitacoraSelector
        onSelect={handleCreateFromSupervisor}
        onCancel={() => setShowCreateFromSupervisor(false)}
      />
    );
  }

  if (showCreateIndependent) {
    return (
      <CreateBitacoraBuzoFormCompleteWithInmersion
        onComplete={handleCreateIndependent}
        onCancel={() => setShowCreateIndependent(false)}
      />
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con estadísticas optimizado para salmoneros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Bitácoras</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Firmadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.firmadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold text-amber-600">{stats.pendientes}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <Users className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Aprobadas</p>
                <p className="text-2xl font-bold text-purple-600">{stats.aprobadas}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información contextual para salmoneros */}
      <Alert>
        <Info className="h-4 w-4" />
        <AlertDescription>
          <strong>Para Salmoneros:</strong> Las bitácoras de buzo se crean principalmente a partir de bitácoras de supervisor firmadas. 
          También puedes crear bitácoras independientes para inmersiones no planificadas.
        </AlertDescription>
      </Alert>

      {/* Tabs para mejor organización */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <div className="flex justify-between items-center">
          <TabsList>
            <TabsTrigger value="list">Lista de Bitácoras</TabsTrigger>
            <TabsTrigger value="create">Crear Nueva</TabsTrigger>
          </TabsList>

          {activeTab === 'list' && (
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewModeChange(viewMode === 'cards' ? 'table' : 'cards')}
              >
                {viewMode === 'cards' ? 'Vista Tabla' : 'Vista Cards'}
              </Button>
            </div>
          )}
        </div>

        <TabsContent value="list" className="space-y-4">
          {bitacorasBuzo?.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No hay bitácoras de buzo
                </h3>
                <p className="text-gray-600 mb-4">
                  Comienza creando tu primera bitácora de buzo desde una supervisión firmada o de forma independiente.
                </p>
                <Button onClick={() => setActiveTab('create')}>
                  Crear Primera Bitácora
                </Button>
              </CardContent>
            </Card>
          ) : (
            <>
              {viewMode === 'cards' ? (
                <BitacorasBuzoCards bitacoras={bitacorasBuzo} />
              ) : (
                <BitacorasBuzoTable bitacoras={bitacorasBuzo} />
              )}
            </>
          )}
        </TabsContent>

        <TabsContent value="create" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Opción recomendada para salmoneros */}
            <Card className="border-2 border-blue-200 bg-blue-50">
              <CardHeader>
                <div className="flex items-center gap-2">
                  <Badge className="bg-blue-100 text-blue-800">Recomendado</Badge>
                </div>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-blue-600" />
                  Desde Bitácora de Supervisor
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Crea una bitácora de buzo basada en una bitácora de supervisor ya firmada. 
                  Los datos se heredan automáticamente.
                </p>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Datos pre-completados</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Validación automática</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-green-600">
                  <CheckCircle className="w-4 h-4" />
                  <span>Trazabilidad completa</span>
                </div>
                <Button 
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  onClick={() => setShowCreateFromSupervisor(true)}
                >
                  Seleccionar Bitácora Supervisor
                </Button>
              </CardContent>
            </Card>

            {/* Opción independiente */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Plus className="w-5 h-5 text-gray-600" />
                  Bitácora Independiente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">
                  Crea una bitácora de buzo desde cero para inmersiones no planificadas 
                  o cuando no existe supervisión previa.
                </p>
                <div className="flex items-center gap-2 text-sm text-amber-600">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Requiere más datos manuales</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-blue-600">
                  <Info className="w-4 h-4" />
                  <span>Para emergencias o casos especiales</span>
                </div>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={() => setShowCreateIndependent(true)}
                >
                  Crear Independiente
                </Button>
              </CardContent>
            </Card>
          </div>

          {/* Guía rápida para salmoneros */}
          <Card>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-gray-700">
                💡 Guía Rápida para Salmoneros
              </CardTitle>
            </CardHeader>
            <CardContent className="text-sm space-y-2">
              <p><strong>1. Flujo Normal:</strong> Inmersión → Bitácora Supervisor → Bitácora Buzo</p>
              <p><strong>2. Caso Especial:</strong> Inmersión Urgente → Bitácora Buzo Independiente</p>
              <p><strong>3. Validación:</strong> Todas las bitácoras requieren firma del buzo y validación</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
