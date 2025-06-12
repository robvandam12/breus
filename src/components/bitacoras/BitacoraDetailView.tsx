
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, User, Calendar, CheckCircle, X } from "lucide-react";
import { BitacoraSupervisor, BitacoraBuzo } from "@/hooks/useBitacoras";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';

interface BitacoraDetailViewProps {
  bitacora: BitacoraSupervisor | BitacoraBuzo;
  type: 'supervisor' | 'buzo';
  isOpen: boolean;
  onClose: () => void;
  onSign?: (id: string) => void;
}

export const BitacoraDetailView = ({ bitacora, type, isOpen, onClose, onSign }: BitacoraDetailViewProps) => {
  const getStatusBadge = () => {
    if (bitacora.firmado) {
      return (
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Firmado
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
        Pendiente Firma
      </Badge>
    );
  };

  const getPersonName = () => {
    if (type === 'supervisor') {
      return (bitacora as BitacoraSupervisor).supervisor;
    } else {
      return (bitacora as BitacoraBuzo).buzo;
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto z-[70]">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-xl">{bitacora.codigo}</CardTitle>
                <p className="text-sm text-zinc-500">
                  Bitácora de {type === 'supervisor' ? 'Supervisor' : 'Buzo'}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {getStatusBadge()}
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-semibold text-zinc-900">Información General</h3>
              
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm text-zinc-600">
                    {type === 'supervisor' ? 'Supervisor:' : 'Buzo:'} {getPersonName()}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm text-zinc-600">
                    Fecha: {new Date(bitacora.fecha).toLocaleDateString('es-CL')}
                  </span>
                </div>
                
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-zinc-500" />
                  <span className="text-sm text-zinc-600">
                    Inmersión: {bitacora.inmersion_id}
                  </span>
                </div>

                {type === 'buzo' && (
                  <div className="text-sm text-zinc-600">
                    <strong>Profundidad máxima:</strong> {(bitacora as BitacoraBuzo).profundidad_maxima}m
                  </div>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-semibold text-zinc-900">Detalles de la Bitácora</h3>
              
              {type === 'supervisor' ? (
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Desarrollo de la inmersión:</strong>
                    <p className="mt-1 text-zinc-600">{(bitacora as BitacoraSupervisor).desarrollo_inmersion}</p>
                  </div>
                  
                  {(bitacora as BitacoraSupervisor).incidentes && (
                    <div>
                      <strong>Incidentes:</strong>
                      <p className="mt-1 text-zinc-600">{(bitacora as BitacoraSupervisor).incidentes}</p>
                    </div>
                  )}
                  
                  <div>
                    <strong>Evaluación general:</strong>
                    <p className="mt-1 text-zinc-600">{(bitacora as BitacoraSupervisor).evaluacion_general}</p>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-sm">
                  <div>
                    <strong>Trabajos realizados:</strong>
                    <p className="mt-1 text-zinc-600">{(bitacora as BitacoraBuzo).trabajos_realizados}</p>
                  </div>
                  
                  {(bitacora as BitacoraBuzo).observaciones_tecnicas && (
                    <div>
                      <strong>Observaciones técnicas:</strong>
                      <p className="mt-1 text-zinc-600">{(bitacora as BitacoraBuzo).observaciones_tecnicas}</p>
                    </div>
                  )}
                  
                  <div>
                    <strong>Estado físico post-inmersión:</strong>
                    <p className="mt-1 text-zinc-600">{(bitacora as BitacoraBuzo).estado_fisico_post}</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {!bitacora.firmado && onSign && (
            <div className="flex justify-end pt-4 border-t">
              <Button 
                onClick={() => onSign(bitacora.bitacora_id)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Firmar Bitácora
              </Button>
            </div>
          )}
        </CardContent>
      </DialogContent>
    </Dialog>
  );
};
