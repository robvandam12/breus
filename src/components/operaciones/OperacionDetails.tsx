
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { MapPin, Calendar, Users, FileText, Activity, AlertTriangle, CheckCircle, Plus, Edit, Shield } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { HPTWizard } from '@/components/hpt/HPTWizard';
import { AnexoBravoWizard } from '@/components/anexo-bravo/AnexoBravoWizard';
import { CreateInmersionForm } from '@/components/inmersiones/CreateInmersionForm';
import { OperacionTeamManager } from '@/components/operaciones/OperacionTeamManager';
import { useAuth } from '@/hooks/useAuth';

interface OperacionDetailsProps {
  operacionId: string;
  onClose: () => void;
}

interface OperacionFull {
  id: string;
  codigo: string;
  nombre: string;
  estado: string;
  fecha_inicio: string;
  fecha_fin?: string;
  tareas?: string;
  sitio_nombre?: string;
  contratista_nombre?: string;
  equipo_buceo_id?: string;
  created_at: string;
}

interface DocumentStatus {
  hpts: any[];
  anexosBravo: any[];
  inmersiones: any[];
  hasTeam: boolean;
}

export const OperacionDetails: React.FC<OperacionDetailsProps> = ({ operacionId, onClose }) => {
  const [operacion, setOperacion] = useState<OperacionFull | null>(null);
  const [documentStatus, setDocumentStatus] = useState<DocumentStatus | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateHPT, setShowCreateHPT] = useState(false);
  const [showCreateAnexo, setShowCreateAnexo] = useState(false);
  const [showCreateInmersion, setShowCreateInmersion] = useState(false);
  const [showTeamManager, setShowTeamManager] = useState(false);
  const [showEditHPT, setShowEditHPT] = useState(false);
  const [selectedHPTId, setSelectedHPTId] = useState<string>('');
  const [activeTab, setActiveTab] = useState('resumen');
  const { profile } = useAuth();

  useEffect(() => {
    const fetchOperacionDetails = async () => {
      try {
        // Obtener datos de la operación
        const { data: opData, error: opError } = await supabase
          .from('operacion')
          .select(`
            *,
            sitio:sitio_id (nombre),
            contratista:contratista_id (nombre)
          `)
          .eq('id', operacionId)
          .single();

        if (opError) throw opError;

        setOperacion({
          ...opData,
          sitio_nombre: opData.sitio?.nombre,
          contratista_nombre: opData.contratista?.nombre
        });

        // Obtener documentos asociados
        const [hptData, anexoData, inmersionData] = await Promise.all([
          supabase.from('hpt').select('*').eq('operacion_id', operacionId),
          supabase.from('anexo_bravo').select('*').eq('operacion_id', operacionId),
          supabase.from('inmersion').select('*').eq('operacion_id', operacionId)
        ]);

        // Check if operation has team assigned
        const hasTeam = !!opData.equipo_buceo_id;

        setDocumentStatus({
          hpts: hptData.data || [],
          anexosBravo: anexoData.data || [],
          inmersiones: inmersionData.data || [],
          hasTeam
        });

      } catch (error) {
        console.error('Error fetching operation details:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchOperacionDetails();
  }, [operacionId]);

  const handleCreateHPT = async (hptId: string) => {
    console.log('HPT created:', hptId);
    setShowCreateHPT(false);
    // Refresh data
    window.location.reload();
  };

  const handleEditHPT = (hptId: string) => {
    setSelectedHPTId(hptId);
    setShowEditHPT(true);
  };

  const handleCreateAnexo = async (data: any) => {
    try {
      const anexoData = {
        ...data,
        operacion_id: operacionId
      };
      
      const { error } = await supabase.from('anexo_bravo').insert([anexoData]);
      if (error) throw error;
      
      setShowCreateAnexo(false);
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error creating Anexo Bravo:', error);
    }
  };

  const handleCreateInmersion = async (data: any) => {
    try {
      const inmersionData = {
        ...data,
        operacion_id: operacionId
      };
      
      const { error } = await supabase.from('inmersion').insert([inmersionData]);
      if (error) throw error;
      
      setShowCreateInmersion(false);
      // Refresh data
      window.location.reload();
    } catch (error) {
      console.error('Error creating Inmersion:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-gray-500 mt-4">Cargando detalles...</p>
      </div>
    );
  }

  if (!operacion) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">No se encontró la operación</p>
      </div>
    );
  }

  const getStatusColor = (estado: string) => {
    const colors = {
      'activa': 'bg-green-100 text-green-700',
      'pausada': 'bg-yellow-100 text-yellow-700',
      'completada': 'bg-blue-100 text-blue-700',
      'cancelada': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const getComplianceStatus = () => {
    if (!documentStatus) return null;
    
    const hasValidHPT = documentStatus.hpts.some(h => h.firmado);
    const hasValidAnexo = documentStatus.anexosBravo.some(a => a.firmado);
    const canExecute = hasValidHPT && hasValidAnexo && documentStatus.hasTeam;
    
    return { hasValidHPT, hasValidAnexo, canExecute, hasTeam: documentStatus.hasTeam };
  };

  const compliance = getComplianceStatus();

  const canCreateDocuments = documentStatus?.hasTeam;
  const canCreateInmersiones = compliance?.canExecute;

  return (
    <div className="space-y-6 max-w-6xl">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">{operacion.nombre}</h2>
          <p className="text-gray-600">Código: {operacion.codigo}</p>
        </div>
        <Badge className={getStatusColor(operacion.estado)}>
          {operacion.estado}
        </Badge>
      </div>

      {/* Team Warning */}
      {!canCreateDocuments && (
        <Alert className="border-yellow-200 bg-yellow-50">
          <Shield className="h-4 w-4" />
          <AlertDescription className="text-yellow-800">
            <strong>Equipo de buceo requerido:</strong> Debe asignar un equipo de buceo a esta operación antes de crear documentos (HPT, Anexo Bravo) o inmersiones.
          </AlertDescription>
        </Alert>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="equipo">Equipo de Buceo</TabsTrigger>
          <TabsTrigger value="documentos">Documentos</TabsTrigger>
          <TabsTrigger value="inmersiones">Inmersiones</TabsTrigger>
          <TabsTrigger value="historial">Historial</TabsTrigger>
        </TabsList>

        <TabsContent value="resumen" className="space-y-4">
          {/* Información básica */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Información General</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Sitio: {operacion.sitio_nombre || 'No asignado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">Contratista: {operacion.contratista_nombre || 'No asignado'}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-400" />
                  <span className="text-sm">
                    Fecha inicio: {new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}
                  </span>
                </div>
                {operacion.fecha_fin && (
                  <div className="flex items-center gap-2">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm">
                      Fecha fin: {new Date(operacion.fecha_fin).toLocaleDateString('es-CL')}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Estado de Cumplimiento</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm">Equipo Asignado</span>
                  {compliance?.hasTeam ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">HPT Válido</span>
                  {compliance?.hasValidHPT ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm">Anexo Bravo Válido</span>
                  {compliance?.hasValidAnexo ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Puede Ejecutar Inmersiones</span>
                  {compliance?.canExecute ? (
                    <CheckCircle className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-red-600" />
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="equipo" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Equipo de Buceo</CardTitle>
              <Button onClick={() => setShowTeamManager(true)} size="sm">
                <Plus className="w-4 h-4 mr-2" />
                Gestionar Equipo
              </Button>
            </CardHeader>
            <CardContent>
              {operacion.equipo_buceo_id ? (
                <p className="text-green-600">✓ Equipo de buceo asignado</p>
              ) : (
                <p className="text-yellow-600">⚠ Sin equipo de buceo asignado</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="documentos" className="space-y-4">
          {/* HPTs */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">HPTs ({documentStatus?.hpts.length || 0})</CardTitle>
              <Button 
                onClick={() => setShowCreateHPT(true)} 
                size="sm"
                disabled={!canCreateDocuments}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo HPT
              </Button>
            </CardHeader>
            <CardContent>
              {!canCreateDocuments && (
                <Alert className="mb-4 border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-yellow-800">
                    Asigne un equipo de buceo para crear documentos
                  </AlertDescription>
                </Alert>
              )}
              
              {documentStatus?.hpts.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay HPTs creados</p>
              ) : (
                <div className="space-y-2">
                  {documentStatus?.hpts.map((hpt) => (
                    <div key={hpt.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{hpt.codigo}</p>
                        <p className="text-sm text-gray-600">Supervisor: {hpt.supervisor}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={hpt.firmado ? "default" : "secondary"}>
                          {hpt.firmado ? "Firmado" : "Borrador"}
                        </Badge>
                        {!hpt.firmado && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleEditHPT(hpt.id)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Anexos Bravo */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Anexos Bravo ({documentStatus?.anexosBravo.length || 0})</CardTitle>
              <Button 
                onClick={() => setShowCreateAnexo(true)} 
                size="sm"
                disabled={!canCreateDocuments}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Anexo
              </Button>
            </CardHeader>
            <CardContent>
              {!canCreateDocuments && (
                <Alert className="mb-4 border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-yellow-800">
                    Asigne un equipo de buceo para crear documentos
                  </AlertDescription>
                </Alert>
              )}
              
              {documentStatus?.anexosBravo.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay Anexos Bravo creados</p>
              ) : (
                <div className="space-y-2">
                  {documentStatus?.anexosBravo.map((anexo) => (
                    <div key={anexo.id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{anexo.codigo}</p>
                        <p className="text-sm text-gray-600">Progreso: {anexo.progreso || 0}%</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant={anexo.firmado ? "default" : "secondary"}>
                          {anexo.firmado ? "Firmado" : "Borrador"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inmersiones" className="space-y-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-lg">Inmersiones ({documentStatus?.inmersiones.length || 0})</CardTitle>
              <Button 
                onClick={() => setShowCreateInmersion(true)} 
                size="sm"
                disabled={!canCreateInmersiones}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Inmersión
              </Button>
            </CardHeader>
            <CardContent>
              {!canCreateInmersiones && (
                <Alert className="mb-4 border-yellow-200 bg-yellow-50">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription className="text-yellow-800">
                    Para crear inmersiones se requiere tener un equipo asignado, HPT y Anexo Bravo firmados.
                  </AlertDescription>
                </Alert>
              )}
              
              {documentStatus?.inmersiones.length === 0 ? (
                <p className="text-gray-500 text-center py-4">No hay inmersiones registradas</p>
              ) : (
                <div className="space-y-2">
                  {documentStatus?.inmersiones.map((inmersion) => (
                    <div key={inmersion.inmersion_id} className="flex items-center justify-between p-3 border rounded">
                      <div>
                        <p className="font-medium">{inmersion.codigo}</p>
                        <p className="text-sm text-gray-600">
                          Buzo: {inmersion.buzo_principal} • Prof: {inmersion.profundidad_max}m
                        </p>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{inmersion.estado}</Badge>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="historial">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Historial de Actividades</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-gray-500 text-center py-4">Funcionalidad en desarrollo</p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Dialogs para crear documentos */}
      <Dialog open={showCreateHPT} onOpenChange={setShowCreateHPT}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Crear Nuevo HPT</DialogTitle>
          </DialogHeader>
          <HPTWizard
            operacionId={operacionId}
            onComplete={handleCreateHPT}
            onCancel={() => setShowCreateHPT(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showEditHPT} onOpenChange={setShowEditHPT}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Editar HPT</DialogTitle>
          </DialogHeader>
          <HPTWizard
            operacionId={operacionId}
            hptId={selectedHPTId}
            onComplete={() => setShowEditHPT(false)}
            onCancel={() => setShowEditHPT(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateAnexo} onOpenChange={setShowCreateAnexo}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Anexo Bravo</DialogTitle>
          </DialogHeader>
          <AnexoBravoWizard
            onSubmit={handleCreateAnexo}
            onCancel={() => setShowCreateAnexo(false)}
            defaultOperacionId={operacionId}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showCreateInmersion} onOpenChange={setShowCreateInmersion}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nueva Inmersión</DialogTitle>
          </DialogHeader>
          <CreateInmersionForm
            onSubmit={handleCreateInmersion}
            onCancel={() => setShowCreateInmersion(false)}
            defaultOperacionId={operacionId}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showTeamManager} onOpenChange={setShowTeamManager}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle>Gestionar Equipo de Buceo</DialogTitle>
          </DialogHeader>
          <OperacionTeamManager
            operacionId={operacionId}
            salmoneraId={profile?.salmonera_id}
            onClose={() => setShowTeamManager(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
