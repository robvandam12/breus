
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Calendar, 
  MapPin, 
  Users, 
  FileText, 
  Building, 
  Clock,
  Plus,
  AlertTriangle,
  CheckCircle2,
  Waves,
  Edit,
  Eye
} from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { HPTWizard } from "@/components/hpt/HPTWizard";
import { AnexoBravoWizard } from "@/components/anexo-bravo/AnexoBravoWizard";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { toast } from "@/hooks/use-toast";

interface OperacionDetailsProps {
  operacionId: string;
  onClose: () => void;
}

export const OperacionDetails = ({ operacionId, onClose }: OperacionDetailsProps) => {
  const { operaciones } = useOperaciones();
  const [showHPTWizard, setShowHPTWizard] = useState(false);
  const [showAnexoBravoWizard, setShowAnexoBravoWizard] = useState(false);
  const [activeTab, setActiveTab] = useState("overview");

  const operacion = operaciones.find(op => op.id === operacionId);

  if (!operacion) {
    return (
      <div className="p-6 text-center">
        <p>Operación no encontrada</p>
      </div>
    );
  }

  // Verificar si tiene equipo de buceo asignado
  const hasEquipoBuceo = !!operacion.equipo_buceo_id;

  const handleCreateDocument = (type: 'hpt' | 'anexo_bravo') => {
    if (!hasEquipoBuceo) {
      toast({
        title: "Equipo de buceo requerido",
        description: "Debe asignar un equipo de buceo a la operación antes de crear documentos.",
        variant: "destructive",
      });
      return;
    }

    if (type === 'hpt') {
      setShowHPTWizard(true);
    } else {
      setShowAnexoBravoWizard(true);
    }
  };

  const handleDocumentComplete = (documentId: string) => {
    toast({
      title: "Documento creado",
      description: "El documento ha sido creado exitosamente como borrador.",
    });
    setShowHPTWizard(false);
    setShowAnexoBravoWizard(false);
    // Aquí se actualizarían los documentos de la operación
  };

  const getEstadoBadge = (estado: string) => {
    const colors = {
      'activa': 'bg-green-100 text-green-700',
      'completada': 'bg-blue-100 text-blue-700',
      'pausada': 'bg-yellow-100 text-yellow-700',
      'cancelada': 'bg-red-100 text-red-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Building className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{operacion.codigo}</h2>
            <p className="text-gray-600">{operacion.nombre}</p>
          </div>
        </div>
        <Badge className={getEstadoBadge(operacion.estado)}>
          {operacion.estado}
        </Badge>
      </div>

      {/* Alerta si no tiene equipo de buceo */}
      {!hasEquipoBuceo && (
        <Card className="mb-6 border-orange-200 bg-orange-50">
          <CardContent className="pt-6">
            <div className="flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-orange-900">Equipo de buceo requerido</h4>
                <p className="text-sm text-orange-700 mt-1">
                  Esta operación no tiene un equipo de buceo asignado. Es necesario asignar un equipo 
                  antes de poder crear documentos como HPT o Anexo Bravo.
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Resumen</TabsTrigger>
          <TabsTrigger value="documents">Documentos</TabsTrigger>
          <TabsTrigger value="immersions">Inmersiones</TabsTrigger>
          <TabsTrigger value="team">Equipo</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Información General
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">Inicio: {format(new Date(operacion.fecha_inicio), "dd/MM/yyyy", { locale: es })}</span>
                </div>
                {operacion.fecha_fin && (
                  <div className="flex items-center gap-2">
                    <Clock className="w-4 h-4 text-gray-500" />
                    <span className="text-sm">Fin: {format(new Date(operacion.fecha_fin), "dd/MM/yyyy", { locale: es })}</span>
                  </div>
                )}
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{operacion.sitios?.nombre || "Sin sitio"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{operacion.salmoneras?.nombre || "Sin salmonera"}</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Equipo y Contratista
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">{operacion.contratistas?.nombre || "Sin contratista"}</span>
                </div>
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gray-500" />
                  <span className="text-sm">
                    Equipo de buceo: {hasEquipoBuceo ? "Asignado" : "Sin asignar"}
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {operacion.tareas && (
            <Card>
              <CardHeader>
                <CardTitle>Descripción de Tareas</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700">{operacion.tareas}</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="documents" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Documentos de la Operación</h3>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleCreateDocument('hpt')}
                disabled={!hasEquipoBuceo}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear HPT
              </Button>
              <Button 
                onClick={() => handleCreateDocument('anexo_bravo')}
                disabled={!hasEquipoBuceo}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Crear Anexo Bravo
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Lista de HPTs */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5 text-blue-600" />
                  HPT (Hojas de Planificación)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Aquí se mostrarían los HPTs reales de la operación */}
                  <div className="text-center py-6 text-gray-500">
                    <FileText className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No hay HPTs creados</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Lista de Anexos Bravo */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                  Anexo Bravo (Verificaciones)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {/* Aquí se mostrarían los Anexos Bravo reales de la operación */}
                  <div className="text-center py-6 text-gray-500">
                    <CheckCircle2 className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No hay Anexos Bravo creados</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="immersions" className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold">Inmersiones</h3>
            <Button disabled={!hasEquipoBuceo}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Inmersión
            </Button>
          </div>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center py-6 text-gray-500">
                <Waves className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p className="text-sm">No hay inmersiones registradas</p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="team" className="space-y-6">
          <h3 className="text-lg font-semibold">Equipo de Buceo</h3>
          
          <Card>
            <CardContent className="pt-6">
              {hasEquipoBuceo ? (
                <div className="text-center py-6 text-gray-500">
                  <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">Información del equipo no disponible</p>
                </div>
              ) : (
                <div className="text-center py-6 text-gray-500">
                  <AlertTriangle className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                  <p className="text-sm">No hay equipo de buceo asignado</p>
                  <Button className="mt-3" variant="outline">
                    Asignar Equipo
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* HPT Wizard Dialog */}
      <Dialog open={showHPTWizard} onOpenChange={setShowHPTWizard}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
          <HPTWizard
            operacionId={operacionId}
            onComplete={handleDocumentComplete}
            onCancel={() => setShowHPTWizard(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Anexo Bravo Wizard Dialog */}
      <Dialog open={showAnexoBravoWizard} onOpenChange={setShowAnexoBravoWizard}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden p-0">
          <AnexoBravoWizard
            operacionId={operacionId}
            onComplete={handleDocumentComplete}
            onCancel={() => setShowAnexoBravoWizard(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
