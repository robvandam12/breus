import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Calendar, ListChecks, Users, Edit, MapPin, Building, AlertTriangle } from "lucide-react";
import { OperacionInfo } from "@/components/operaciones/OperacionInfo";
import { OperacionDocuments } from "@/components/operaciones/OperacionDocuments";
import { OperacionInmersiones } from "@/components/operaciones/OperacionInmersiones";
import { OperacionTimeline } from "@/components/operaciones/OperacionTimeline";
import { OperacionTeamManagerEnhanced } from "@/components/operaciones/OperacionTeamManagerEnhanced";
import { EditOperacionForm } from "@/components/operaciones/EditOperacionForm";
import { SidebarProvider } from "@/components/ui/sidebar";
import { ModularSidebar } from "@/components/navigation/ModularSidebar";
import { Header } from "@/components/layout/Header";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useModuleAccess } from "@/hooks/useModuleAccess";
import { LeafletMap } from "@/components/ui/leaflet-map";

interface OperacionDetailEnhancedProps {
  operacion: any;
}

const OperacionDetailEnhanced = ({ operacion }: OperacionDetailEnhancedProps) => {
  const [activeTab, setActiveTab] = useState("general");
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const { updateOperacion } = useOperaciones();
  const moduleAccess = useModuleAccess();

  const handleEditOperacion = async (data: any) => {
    try {
      await updateOperacion({ id: operacion.id, data });
      setIsEditDialogOpen(false);
    } catch (error) {
      console.error('Error updating operacion:', error);
    }
  };

  // Preparar marcadores para el mapa si hay centro asociado
  const mapMarkers = operacion.centro_id && operacion.centros ? [{
    lat: operacion.centros.coordenadas_lat || -41.4693,
    lng: operacion.centros.coordenadas_lng || -72.9424,
    title: operacion.centros.nombre,
    description: `Centro de operación: ${operacion.nombre}`
  }] : [];

  const getAccessLevelBadge = () => {
    if (!moduleAccess) return null;
    
    const access = moduleAccess.getModuleAccess();
    const { planning, maintenance } = access;
    
    if (planning && maintenance) {
      return <Badge variant="default">Acceso Completo</Badge>;
    } else if (planning) {
      return <Badge variant="secondary">Solo Planificación</Badge>;
    } else if (maintenance) {
      return <Badge variant="secondary">Solo Mantenimiento</Badge>;
    } else {
      return <Badge variant="destructive">Acceso Limitado</Badge>;
    }
  };

  const canEditOperacion = moduleAccess?.getModuleAccess().planning || moduleAccess?.canPlanOperations();

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <ModularSidebar />
        <motion.main
          className="flex-1 flex flex-col bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Header
            title={operacion.nombre}
            subtitle={`Detalles de la operación ${operacion.codigo}`}
            icon={Calendar}
          >
            <div className="flex items-center gap-2">
              {getAccessLevelBadge()}
              {canEditOperacion && (
                <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
                  <Button 
                    variant="outline"
                    onClick={() => setIsEditDialogOpen(true)}
                    className="flex items-center gap-2"
                  >
                    <Edit className="w-4 h-4" />
                    Editar Operación
                  </Button>
                  <DialogContent className="max-w-3xl">
                    <EditOperacionForm
                      operacion={operacion}
                      onSubmit={handleEditOperacion}
                      onCancel={() => setIsEditDialogOpen(false)}
                    />
                  </DialogContent>
                </Dialog>
              )}
            </div>
          </Header>

          <div className="flex-1 p-6 space-y-6">
            {/* Advertencia si no tiene acceso completo */}
            {moduleAccess && !moduleAccess.getModuleAccess().planning && (
              <Card className="border-amber-200 bg-amber-50">
                <CardContent className="p-4">
                  <div className="flex items-center gap-2 text-amber-800">
                    <AlertTriangle className="w-4 h-4" />
                    <span className="font-medium">Acceso Limitado</span>
                  </div>
                  <p className="text-sm text-amber-700 mt-1">
                    Su empresa no tiene activado el módulo de planificación completa. 
                    Algunas funciones pueden estar limitadas.
                  </p>
                </CardContent>
              </Card>
            )}

            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="mapa">Mapa</TabsTrigger>
                <TabsTrigger value="equipo">Equipo de Buceo</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
                <TabsTrigger value="inmersiones">Inmersiones</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <OperacionInfo operacion={operacion} />
                {moduleAccess?.getModuleAccess().planning && <OperacionDocuments operacion={operacion} />}
              </TabsContent>

              <TabsContent value="mapa" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <MapPin className="w-5 h-5" />
                      Ubicación de la Operación
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {operacion.centros ? (
                      <div className="space-y-4">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Centro de Trabajo</h4>
                            <div className="flex items-center gap-2">
                              <Building className="w-4 h-4 text-blue-600" />
                              <span>{operacion.centros.nombre}</span>
                            </div>
                            <p className="text-sm text-gray-600 mt-1">{operacion.centros.ubicacion}</p>
                          </div>
                          <div>
                            <h4 className="font-medium text-gray-900 mb-2">Coordenadas</h4>
                            <p className="text-sm text-gray-600">
                              Lat: {operacion.centros.coordenadas_lat?.toFixed(6) || 'No especificada'}
                            </p>
                            <p className="text-sm text-gray-600">
                              Lng: {operacion.centros.coordenadas_lng?.toFixed(6) || 'No especificada'}
                            </p>
                          </div>
                        </div>
                        <div className="h-96 border rounded-lg overflow-hidden">
                          <LeafletMap
                            height="100%"
                            initialLat={operacion.centros.coordenadas_lat || -41.4693}
                            initialLng={operacion.centros.coordenadas_lng || -72.9424}
                            markers={mapMarkers}
                            showLocationSelector={false}
                          />
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <MapPin className="w-12 h-12 mx-auto mb-2 opacity-50" />
                        <p>No hay ubicación específica asignada a esta operación</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="equipo" className="space-y-6">
                {moduleAccess?.getModuleAccess().planning ? (
                  <OperacionTeamManagerEnhanced 
                    operacionId={operacion.id} 
                    salmoneraId={operacion.salmonera_id || undefined}
                    contratistaId={operacion.contratista_id || undefined}
                  />
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Users className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="font-medium text-gray-900 mb-2">Gestión de Equipo Restringida</h3>
                      <p className="text-gray-600">
                        Su empresa necesita el módulo de planificación para gestionar equipos de trabajo.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="documentos" className="space-y-6">
                {moduleAccess?.getModuleAccess().planning ? (
                  <OperacionDocuments operacion={operacion} />
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <ListChecks className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="font-medium text-gray-900 mb-2">Documentos No Disponibles</h3>
                      <p className="text-gray-600">
                        La gestión de documentos requiere el módulo de planificación activo.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="inmersiones" className="space-y-6">
                <OperacionInmersiones operacion={operacion} />
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6">
                {moduleAccess?.getModuleAccess().planning ? (
                  <OperacionTimeline operacionId={operacion.id} />
                ) : (
                  <Card>
                    <CardContent className="p-6 text-center">
                      <Calendar className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                      <h3 className="font-medium text-gray-900 mb-2">Timeline No Disponible</h3>
                      <p className="text-gray-600">
                        El seguimiento de timeline requiere el módulo de planificación.
                      </p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>
            </Tabs>
          </div>
        </motion.main>
      </div>
    </SidebarProvider>
  );
};

export default OperacionDetailEnhanced;