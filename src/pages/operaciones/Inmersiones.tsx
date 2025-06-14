import React, { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, Anchor, Calendar, User, Clock } from "lucide-react";
import { InmersionWizard } from "@/components/inmersion/InmersionWizard";
import { CreateBitacoraBuzoFormCompleteWithInmersion } from "@/components/bitacoras/CreateBitacoraBuzoFormCompleteWithInmersion";
import { CreateBitacoraSupervisorFormComplete } from "@/components/bitacoras/CreateBitacoraSupervisorFormComplete";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useBitacorasBuzo } from '@/hooks/useBitacorasBuzo';
import { useBitacorasSupervisor } from '@/hooks/useBitacorasSupervisor';
import { useRouter } from "@/hooks/useRouter";
import { useSearchParams } from "react-router-dom";
import { toast } from "@/hooks/use-toast";
import { InmersionesActions } from "./InmersionesActions";
import { useQueryClient } from '@tanstack/react-query';

export default function Inmersiones() {
  const [showWizard, setShowWizard] = useState(false);
  const [showBitacoraBuzoForm, setShowBitacoraBuzoForm] = useState(false);
  const [showBitacoraSupervisorForm, setShowBitacoraSupervisorForm] = useState(false);
  const [selectedInmersionForBitacora, setSelectedInmersionForBitacora] = useState<string>('');
  const [searchParams] = useSearchParams();
  const { navigateTo } = useRouter();
  const { inmersiones, isLoading, createInmersion } = useInmersiones();
  const { operaciones } = useOperaciones();
  const { createBitacoraBuzo } = useBitacorasBuzo();
  const { createBitacoraSupervisor } = useBitacorasSupervisor();
  const queryClient = useQueryClient();
  
  const operacionId = searchParams.get('operacion');

  useEffect(() => {
    if (operacionId) {
      setShowWizard(true);
    }
  }, [operacionId]);

  const handleCreateInmersion = async (data: any) => {
    try {
      await createInmersion(data);
      
      toast({
        title: "Inmersión creada",
        description: "La inmersión ha sido creada exitosamente.",
      });
      queryClient.invalidateQueries({ queryKey: ['inmersiones'] });
      queryClient.invalidateQueries({ queryKey: ['inmersionesCompletas'] });
      setShowWizard(false);
      
      if (operacionId) {
        navigateTo('/operaciones');
      }
    } catch (error: any) {
      console.error('Error creating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión.",
        variant: "destructive",
      });
    }
  };

  const getOperacionData = (operacionId: string) => {
    return operaciones.find(op => op.id === operacionId);
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'planificada':
        return 'bg-blue-100 text-blue-800';
      case 'en_progreso':
        return 'bg-yellow-100 text-yellow-800';
      case 'completada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleViewInmersion = (inmersionId: string) => {
    navigateTo(`/inmersiones/${inmersionId}`);
  };

  const handleCreateBitacoraBuzo = (inmersionId: string) => {
    setSelectedInmersionForBitacora(inmersionId);
    setShowBitacoraBuzoForm(true);
  };

  const handleCreateBitacoraSupervisor = (inmersionId: string) => {
    setSelectedInmersionForBitacora(inmersionId);
    setShowBitacoraSupervisorForm(true);
  };

  const handleBitacoraBuzoSubmit = async (data: any) => {
    try {
      await createBitacoraBuzo.mutateAsync(data);
      toast({
        title: "Bitácora de buzo creada",
        description: "La bitácora ha sido creada exitosamente.",
      });
      setShowBitacoraBuzoForm(false);
      setSelectedInmersionForBitacora('');
    } catch (error) {
      console.error('Error creating bitacora buzo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora.",
        variant: "destructive",
      });
    }
  };

  const handleBitacoraSupervisorSubmit = async (data: any) => {
    try {
      await createBitacoraSupervisor.mutateAsync(data);
      toast({
        title: "Bitácora de supervisor creada",
        description: "La bitácora ha sido creada exitosamente.",
      });
      setShowBitacoraSupervisorForm(false);
      setSelectedInmersionForBitacora('');
    } catch (error) {
      console.error('Error creating bitacora supervisor:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora.",
        variant: "destructive",
      });
    }
  };

  if (showWizard) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-white">
            <Header 
              title="Nueva Inmersión" 
              subtitle="Crear inmersión de buceo" 
              icon={Anchor} 
            />
            
            <div className="flex-1 overflow-auto bg-white">
              <div className="p-6">
                <InmersionWizard
                  operationId={operacionId || undefined}
                  onComplete={handleCreateInmersion}
                  onCancel={() => {
                    setShowWizard(false);
                    if (operacionId) {
                      navigateTo('/operaciones');
                    }
                  }}
                />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-white">
          <Header 
            title="Inmersiones" 
            subtitle="Gestión de inmersiones de buceo" 
            icon={Anchor} 
          >
            <Button onClick={() => setShowWizard(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Inmersión
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando inmersiones...</p>
                </div>
              ) : inmersiones.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Anchor className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay inmersiones</h3>
                    <p className="text-gray-600 mb-6">
                      Comience creando su primera inmersión de buceo.
                    </p>
                    <Button onClick={() => setShowWizard(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva Inmersión
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {inmersiones.map((inmersion) => {
                    const operacion = getOperacionData(inmersion.operacion_id);
                    return (
                      <Card key={inmersion.inmersion_id} className="hover:shadow-lg transition-shadow">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-lg">{inmersion.codigo}</CardTitle>
                            <Badge className={getEstadoBadgeColor(inmersion.estado)}>
                              {inmersion.estado}
                            </Badge>
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          {operacion && (
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                              <Calendar className="w-4 h-4" />
                              <span>{operacion.nombre}</span>
                            </div>
                          )}
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar className="w-4 h-4" />
                            <span>{new Date(inmersion.fecha_inmersion).toLocaleDateString()}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <User className="w-4 h-4" />
                            <span>{inmersion.buzo_principal}</span>
                          </div>
                          
                          <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Clock className="w-4 h-4" />
                            <span>{inmersion.hora_inicio} - {inmersion.hora_fin || 'En curso'}</span>
                          </div>
                          
                          <InmersionesActions
                            inmersionId={inmersion.inmersion_id}
                            onView={handleViewInmersion}
                            onCreateBitacoraBuzo={handleCreateBitacoraBuzo}
                            onCreateBitacoraSupervisor={handleCreateBitacoraSupervisor}
                          />
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Dialogs */}
          <Dialog open={showBitacoraBuzoForm} onOpenChange={setShowBitacoraBuzoForm}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {selectedInmersionForBitacora && 
                <CreateBitacoraBuzoFormCompleteWithInmersion
                  inmersionId={selectedInmersionForBitacora}
                  onSubmit={handleBitacoraBuzoSubmit}
                  onCancel={() => setShowBitacoraBuzoForm(false)}
                />
              }
            </DialogContent>
          </Dialog>

          <Dialog open={showBitacoraSupervisorForm} onOpenChange={setShowBitacoraSupervisorForm}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {selectedInmersionForBitacora && 
                <CreateBitacoraSupervisorFormComplete
                  inmersionId={selectedInmersionForBitacora}
                  onSubmit={handleBitacoraSupervisorSubmit}
                  onCancel={() => setShowBitacoraSupervisorForm(false)}
                />
              }
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
}
