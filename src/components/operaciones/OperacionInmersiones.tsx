import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Plus, Anchor, FileText, Calendar, Eye, Users, AlertTriangle } from "lucide-react";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useBitacorasSupervisor } from "@/hooks/useBitacorasSupervisor";
import { useBitacorasBuzo } from "@/hooks/useBitacorasBuzo";
import { useOperaciones } from "@/hooks/useOperaciones";
import { InmersionWizard } from "@/components/inmersion/InmersionWizard";
import { BitacoraWizardFromInmersion } from "@/components/bitacoras/BitacoraWizardFromInmersion";
import { CreateBitacoraBuzoFormCompleteWithInmersion } from "@/components/bitacoras/CreateBitacoraBuzoFormCompleteWithInmersion";
import { InmersionDetailModal } from "@/components/inmersiones/InmersionDetailModal";
import { toast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface OperacionInmersionesProps {
  operacionId: string;
}

export const OperacionInmersiones = ({ operacionId }: OperacionInmersionesProps) => {
  const [showNewInmersionDialog, setShowNewInmersionDialog] = useState(false);
  const [showBitacoraSupervisorDialog, setShowBitacoraSupervisorDialog] = useState(false);
  const [showBitacoraBuzoDialog, setShowBitacoraBuzoDialog] = useState(false);
  const [selectedInmersionId, setSelectedInmersionId] = useState<string>('');
  const [selectedInmersionForDetail, setSelectedInmersionForDetail] = useState<any>(null);
  const [showDetailModal, setShowDetailModal] = useState(false);

  const { inmersiones, createInmersion, isLoading: inmersionesLoading } = useInmersiones();
  const { bitacorasSupervisor, createBitacoraSupervisor } = useBitacorasSupervisor();
  const { bitacorasBuzo, createBitacoraBuzo } = useBitacorasBuzo();
  const { operaciones } = useOperaciones();

  const operacion = operaciones.find(op => op.id === operacionId);
  const inmersionesOperacion = inmersiones.filter(i => i.operacion_id === operacionId);
  const hasTeamAssigned = !!operacion?.equipo_buceo_id;

  const handleCreateInmersion = async (data: any) => {
    try {
      await createInmersion(data);
      toast({
        title: "Inmersión creada",
        description: "La inmersión ha sido creada exitosamente.",
      });
      setShowNewInmersionDialog(false);
    } catch (error) {
      console.error('Error creating inmersion:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la inmersión.",
        variant: "destructive",
      });
    }
  };

  const handleCreateBitacoraSupervisor = async (data: any) => {
    try {
      await createBitacoraSupervisor(data);
      toast({
        title: "Bitácora de supervisor creada",
        description: "La bitácora de supervisor ha sido creada exitosamente.",
      });
      setShowBitacoraSupervisorDialog(false);
      setSelectedInmersionId('');
    } catch (error) {
      console.error('Error creating bitacora supervisor:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora de supervisor.",
        variant: "destructive",
      });
    }
  };

  const handleCreateBitacoraBuzo = async (data: any) => {
    try {
      await createBitacoraBuzo.mutateAsync(data);
      toast({
        title: "Bitácora de buzo creada",
        description: "La bitácora de buzo ha sido creada exitosamente.",
      });
      setShowBitacoraBuzoDialog(false);
      setSelectedInmersionId('');
    } catch (error) {
      console.error('Error creating bitacora buzo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la bitácora de buzo.",
        variant: "destructive",
      });
    }
  };

  const handleViewInmersion = (inmersion: any) => {
    setSelectedInmersionForDetail(inmersion);
    setShowDetailModal(true);
  };

  const getEstadoBadgeColor = (estado: string) => {
    switch (estado) {
      case 'planificada': return 'bg-blue-100 text-blue-800';
      case 'en_progreso': return 'bg-yellow-100 text-yellow-800';
      case 'completada': return 'bg-green-100 text-green-800';
      case 'cancelada': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getBitacoraStatus = (inmersionId: string) => {
    const supervisorBitacoras = bitacorasSupervisor.filter(b => b.inmersion_id === inmersionId);
    const buzoBitacoras = bitacorasBuzo.filter(b => b.inmersion_id === inmersionId);
    
    return {
      supervisor: supervisorBitacoras.length,
      buzo: buzoBitacoras.length,
      hasSupervisor: supervisorBitacoras.length > 0,
      hasBuzo: buzoBitacoras.length > 0
    };
  };

  if (inmersionesLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="w-5 h-5" />
            Inmersiones de la Operación
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-4 bg-gray-200 rounded w-1/4"></div>
            <div className="h-20 bg-gray-200 rounded"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header con botón para crear nueva inmersión */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Anchor className="w-5 h-5 text-blue-600" />
              Inmersiones de la Operación
            </CardTitle>
            <Button
              onClick={() => setShowNewInmersionDialog(true)}
              disabled={!hasTeamAssigned}
              className="bg-blue-600 hover:bg-blue-700"
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Inmersión
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {!hasTeamAssigned && (
            <Alert className="border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-yellow-800">
                <strong>Personal de buceo requerido:</strong> Asigne personal de buceo a esta operación para crear inmersiones.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>

      {/* Lista de inmersiones */}
      {inmersionesOperacion.length === 0 ? (
        <Card>
          <CardContent className="text-center py-8">
            <Anchor className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600 mb-4">No hay inmersiones creadas para esta operación</p>
            {hasTeamAssigned && (
              <Button
                onClick={() => setShowNewInmersionDialog(true)}
                variant="outline"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Primera Inmersión
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {inmersionesOperacion.map((inmersion) => {
            const bitacoraStatus = getBitacoraStatus(inmersion.inmersion_id);
            
            return (
              <Card key={inmersion.inmersion_id} className="border-l-4 border-l-blue-500">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-semibold text-lg">{inmersion.codigo}</h3>
                        <Badge className={getEstadoBadgeColor(inmersion.estado)}>
                          {inmersion.estado}
                        </Badge>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm text-gray-600 mb-4">
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4" />
                          <span>{inmersion.fecha_inmersion}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Users className="w-4 h-4" />
                          <span>{inmersion.buzo_principal}</span>
                        </div>
                        <div>
                          <span className="font-medium">Objetivo:</span> {inmersion.objetivo}
                        </div>
                      </div>

                      {/* Estado de bitácoras */}
                      <div className="flex items-center gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-purple-600" />
                          <span className="text-sm">
                            Bitácora Supervisor: 
                            <Badge 
                              variant={bitacoraStatus.hasSupervisor ? "default" : "outline"}
                              className="ml-2"
                            >
                              {bitacoraStatus.supervisor > 0 ? `${bitacoraStatus.supervisor} creada(s)` : 'Pendiente'}
                            </Badge>
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-teal-600" />
                          <span className="text-sm">
                            Bitácora Buzo: 
                            <Badge 
                              variant={bitacoraStatus.hasBuzo ? "default" : "outline"}
                              className="ml-2"
                            >
                              {bitacoraStatus.buzo > 0 ? `${bitacoraStatus.buzo} creada(s)` : 'Pendiente'}
                            </Badge>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Acciones */}
                    <div className="flex flex-col gap-2 ml-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleViewInmersion(inmersion)}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Ver Detalle
                      </Button>
                      
                      {!bitacoraStatus.hasSupervisor && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            setSelectedInmersionId(inmersion.inmersion_id);
                            setShowBitacoraSupervisorDialog(true);
                          }}
                          className="text-purple-600 hover:text-purple-700"
                        >
                          <FileText className="w-4 h-4 mr-2" />
                          Crear Bitácora Supervisor
                        </Button>
                      )}
                      
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedInmersionId(inmersion.inmersion_id);
                          setShowBitacoraBuzoDialog(true);
                        }}
                        className="text-teal-600 hover:text-teal-700"
                      >
                        <FileText className="w-4 h-4 mr-2" />
                        Crear Bitácora Buzo
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Dialogs */}
      <Dialog open={showNewInmersionDialog} onOpenChange={setShowNewInmersionDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Inmersión</DialogTitle>
          </DialogHeader>
          <InmersionWizard
            operationId={operacionId}
            onComplete={handleCreateInmersion}
            onCancel={() => setShowNewInmersionDialog(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showBitacoraSupervisorDialog} onOpenChange={setShowBitacoraSupervisorDialog}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Bitácora de Supervisor</DialogTitle>
          </DialogHeader>
          {selectedInmersionId && (
            <BitacoraWizardFromInmersion
              inmersionId={selectedInmersionId}
              onComplete={handleCreateBitacoraSupervisor}
              onCancel={() => {
                setShowBitacoraSupervisorDialog(false);
                setSelectedInmersionId('');
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showBitacoraBuzoDialog} onOpenChange={setShowBitacoraBuzoDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nueva Bitácora de Buzo</DialogTitle>
          </DialogHeader>
          {selectedInmersionId && (
            <CreateBitacoraBuzoFormCompleteWithInmersion
              onSubmit={handleCreateBitacoraBuzo}
              onCancel={() => {
                setShowBitacoraBuzoDialog(false);
                setSelectedInmersionId('');
              }}
            />
          )}
        </DialogContent>
      </Dialog>

      <InmersionDetailModal
        isOpen={showDetailModal}
        onClose={() => setShowDetailModal(false)}
        inmersion={selectedInmersionForDetail}
        operacion={operacion}
        getEstadoBadgeColor={getEstadoBadgeColor}
      />
    </div>
  );
};
