
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { FileText, User, Calendar, MapPin, PenTool, CheckCircle, X } from "lucide-react";
import { BitacoraSupervisor, BitacoraBuzo } from "@/hooks/useBitacoras";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface BitacoraDetailViewProps {
  bitacora: BitacoraSupervisor | BitacoraBuzo;
  type: 'supervisor' | 'buzo';
  onSign?: (id: string) => Promise<void>;
  onClose: () => void;
}

export const BitacoraDetailView = ({ bitacora, type, onSign, onClose }: BitacoraDetailViewProps) => {
  const [loading, setLoading] = useState(false);

  const handleSign = async () => {
    if (!onSign) return;
    setLoading(true);
    try {
      await onSign(bitacora.id);
    } catch (error) {
      console.error('Error signing bitácora:', error);
    } finally {
      setLoading(false);
    }
  };

  const isSupervisor = type === 'supervisor';
  const supervisorBitacora = bitacora as BitacoraSupervisor;
  const buzoBitacora = bitacora as BitacoraBuzo;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`w-12 h-12 ${isSupervisor ? 'bg-purple-100' : 'bg-teal-100'} rounded-xl flex items-center justify-center`}>
                <FileText className={`w-6 h-6 ${isSupervisor ? 'text-purple-600' : 'text-teal-600'}`} />
              </div>
              <div>
                <CardTitle className="text-xl">{bitacora.codigo}</CardTitle>
                <p className="text-sm text-zinc-500">
                  Bitácora de {isSupervisor ? 'Supervisor' : 'Buzo'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge variant={bitacora.firmado ? "default" : "secondary"} 
                     className={bitacora.firmado ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                {bitacora.firmado ? (
                  <>
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Firmada
                  </>
                ) : (
                  "Pendiente"
                )}
              </Badge>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              Información General
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-600">ID de Inmersión</label>
              <p className="text-zinc-900">{bitacora.inmersion_id}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-600">
                {isSupervisor ? 'Supervisor' : 'Buzo'}
              </label>
              <p className="text-zinc-900">
                {isSupervisor ? supervisorBitacora.supervisor : buzoBitacora.buzo}
              </p>
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-600">Fecha</label>
              <p className="text-zinc-900">{bitacora.fecha}</p>
            </div>
            {!isSupervisor && (
              <div>
                <label className="text-sm font-medium text-zinc-600">Profundidad Máxima</label>
                <p className="text-zinc-900">{buzoBitacora.profundidad_maxima} metros</p>
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Estado y Firmas
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-zinc-600">Estado</label>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={bitacora.firmado ? "default" : "secondary"} 
                       className={bitacora.firmado ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700"}>
                  {bitacora.firmado ? "Firmada y Aprobada" : "Pendiente de Firma"}
                </Badge>
              </div>
            </div>
            
            {bitacora.firmado && (
              <div>
                <label className="text-sm font-medium text-zinc-600">Firma Digital</label>
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg mt-1">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-4 h-4" />
                    <span className="text-sm font-medium">Documento Firmado</span>
                  </div>
                  <p className="text-xs text-green-600 mt-1">
                    {isSupervisor ? supervisorBitacora.supervisor_firma || 'Firmado digitalmente' : buzoBitacora.buzo_firma || 'Firmado digitalmente'}
                  </p>
                </div>
              </div>
            )}

            {!bitacora.firmado && onSign && (
              <Button 
                onClick={handleSign}
                disabled={loading}
                className={`w-full ${isSupervisor ? 'bg-purple-600 hover:bg-purple-700' : 'bg-teal-600 hover:bg-teal-700'}`}
              >
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Firmando...
                  </>
                ) : (
                  <>
                    <PenTool className="w-4 h-4 mr-2" />
                    Firmar Bitácora
                  </>
                )}
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Contenido de la Bitácora</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {isSupervisor ? (
            <>
              <div>
                <label className="text-sm font-medium text-zinc-600">Desarrollo de la Inmersión</label>
                <p className="text-zinc-900 mt-1 whitespace-pre-wrap">{supervisorBitacora.desarrollo_inmersion}</p>
              </div>
              
              {supervisorBitacora.incidentes && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-zinc-600">Incidentes</label>
                    <p className="text-zinc-900 mt-1 whitespace-pre-wrap">{supervisorBitacora.incidentes}</p>
                  </div>
                </>
              )}
              
              <Separator />
              <div>
                <label className="text-sm font-medium text-zinc-600">Evaluación General</label>
                <p className="text-zinc-900 mt-1 whitespace-pre-wrap">{supervisorBitacora.evaluacion_general}</p>
              </div>
            </>
          ) : (
            <>
              <div>
                <label className="text-sm font-medium text-zinc-600">Trabajos Realizados</label>
                <p className="text-zinc-900 mt-1 whitespace-pre-wrap">{buzoBitacora.trabajos_realizados}</p>
              </div>
              
              {buzoBitacora.observaciones_tecnicas && (
                <>
                  <Separator />
                  <div>
                    <label className="text-sm font-medium text-zinc-600">Observaciones Técnicas</label>
                    <p className="text-zinc-900 mt-1 whitespace-pre-wrap">{buzoBitacora.observaciones_tecnicas}</p>
                  </div>
                </>
              )}
              
              <Separator />
              <div>
                <label className="text-sm font-medium text-zinc-600">Estado Físico Post-Inmersión</label>
                <p className="text-zinc-900 mt-1">{buzoBitacora.estado_fisico_post}</p>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
