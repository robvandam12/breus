
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Waves, Plus, AlertTriangle, CheckCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { CreateInmersionForm } from "@/components/inmersiones/CreateInmersionForm";

interface OperacionInmersionesProps {
  operacionId: string;
}

interface DocumentStatus {
  hasValidHPT: boolean;
  hasValidAnexoBravo: boolean;
  hasTeam: boolean;
  canCreateInmersiones: boolean;
}

export const OperacionInmersiones = ({ operacionId }: OperacionInmersionesProps) => {
  const [inmersiones, setInmersiones] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateInmersion, setShowCreateInmersion] = useState(false);
  const [documentStatus, setDocumentStatus] = useState<DocumentStatus>({
    hasValidHPT: false,
    hasValidAnexoBravo: false,
    hasTeam: false,
    canCreateInmersiones: false
  });

  useEffect(() => {
    const fetchInmersiones = async () => {
      try {
        setIsLoading(true);
        
        // Fetch inmersiones for this operation
        const { data: inmersionesData, error: inmersionesError } = await supabase
          .from('inmersion')
          .select('*')
          .eq('operacion_id', operacionId)
          .order('created_at', { ascending: false });

        if (inmersionesError) throw inmersionesError;

        // Check document validation status
        const [hptData, anexoData, operacionData] = await Promise.all([
          supabase.from('hpt').select('*').eq('operacion_id', operacionId).eq('firmado', true),
          supabase.from('anexo_bravo').select('*').eq('operacion_id', operacionId).eq('firmado', true),
          supabase.from('operacion').select('equipo_buceo_id').eq('id', operacionId).single()
        ]);

        const hasValidHPT = hptData.data && hptData.data.length > 0;
        const hasValidAnexoBravo = anexoData.data && anexoData.data.length > 0;
        const hasTeam = !!(operacionData.data?.equipo_buceo_id);
        const canCreateInmersiones = hasValidHPT && hasValidAnexoBravo && hasTeam;

        setInmersiones(inmersionesData || []);
        setDocumentStatus({
          hasValidHPT,
          hasValidAnexoBravo,
          hasTeam,
          canCreateInmersiones
        });
      } catch (error) {
        console.error('Error fetching inmersiones:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchInmersiones();
  }, [operacionId]);

  const handleCreateInmersion = async (data: any) => {
    try {
      const inmersionData = {
        ...data,
        operacion_id: operacionId
      };
      
      const { error } = await supabase.from('inmersion').insert([inmersionData]);
      if (error) throw error;
      
      setShowCreateInmersion(false);
      // Refresh inmersiones
      const { data: updatedInmersiones } = await supabase
        .from('inmersion')
        .select('*')
        .eq('operacion_id', operacionId)
        .order('created_at', { ascending: false });
      
      setInmersiones(updatedInmersiones || []);
    } catch (error) {
      console.error('Error creating inmersion:', error);
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'completada':
        return 'bg-green-100 text-green-700';
      case 'en_progreso':
        return 'bg-blue-100 text-blue-700';
      case 'planificada':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-gray-500 mt-4">Cargando inmersiones...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Waves className="w-5 h-5 text-blue-600" />
              Inmersiones de la Operación ({inmersiones.length})
            </CardTitle>
            <Button 
              size="sm"
              onClick={() => setShowCreateInmersion(true)}
              disabled={!documentStatus.canCreateInmersiones}
            >
              <Plus className="w-4 h-4 mr-2" />
              Nueva Inmersión
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {/* Status de validación */}
          {!documentStatus.canCreateInmersiones && (
            <Alert className="mb-4 border-yellow-200 bg-yellow-50">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription className="text-yellow-800">
                <div className="space-y-2">
                  <p className="font-medium">Para crear inmersiones se requiere:</p>
                  <div className="space-y-1 ml-4">
                    <div className="flex items-center gap-2">
                      {documentStatus.hasTeam ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                      <span className={documentStatus.hasTeam ? "text-green-700" : "text-red-700"}>
                        Equipo de buceo asignado
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {documentStatus.hasValidHPT ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                      <span className={documentStatus.hasValidHPT ? "text-green-700" : "text-red-700"}>
                        HPT firmado
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {documentStatus.hasValidAnexoBravo ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <AlertTriangle className="w-4 h-4 text-red-600" />
                      )}
                      <span className={documentStatus.hasValidAnexoBravo ? "text-green-700" : "text-red-700"}>
                        Anexo Bravo firmado
                      </span>
                    </div>
                  </div>
                </div>
              </AlertDescription>
            </Alert>
          )}

          {inmersiones.length === 0 ? (
            <div className="text-center py-8">
              <Waves className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <p className="text-zinc-500 mb-4">No hay inmersiones registradas</p>
              {documentStatus.canCreateInmersiones && (
                <Button onClick={() => setShowCreateInmersion(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Inmersión
                </Button>
              )}
            </div>
          ) : (
            <div className="space-y-3">
              {inmersiones.map((inmersion) => (
                <div key={inmersion.inmersion_id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-4">
                    <Waves className="w-5 h-5 text-blue-600" />
                    <div>
                      <p className="font-medium">{inmersion.codigo}</p>
                      <p className="text-sm text-zinc-500">
                        {new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')} - {inmersion.profundidad_max}m
                      </p>
                      <div className="flex gap-2 mt-1">
                        <span className="text-xs text-zinc-600">Buzo: {inmersion.buzo_principal}</span>
                        <span className="text-xs text-zinc-600">Supervisor: {inmersion.supervisor}</span>
                      </div>
                      <p className="text-xs text-zinc-500 mt-1">{inmersion.objetivo}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(inmersion.estado)}>
                      {inmersion.estado}
                    </Badge>
                    <Button variant="outline" size="sm">
                      Ver Detalles
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Create Inmersion Dialog */}
      <Dialog open={showCreateInmersion} onOpenChange={setShowCreateInmersion}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Nueva Inmersión</DialogTitle>
          </DialogHeader>
          <CreateInmersionForm
            defaultOperacionId={operacionId}
            onSubmit={handleCreateInmersion}
            onCancel={() => setShowCreateInmersion(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
