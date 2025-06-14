
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, User, FileText, CheckCircle, PenTool } from "lucide-react";
import { BitacoraSupervisorCompleta as BitacoraSupervisor, BitacoraBuzoCompleta as BitacoraBuzo } from "@/types/bitacoras";

interface BitacoraCardProps {
  bitacora: BitacoraSupervisor | BitacoraBuzo;
  type: 'supervisor' | 'buzo';
  onView: (id: string) => void;
  onSign: (id: string) => void;
}

export const BitacoraCard = ({ bitacora, type, onView, onSign }: BitacoraCardProps) => {
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
    <Card className="ios-card hover:shadow-md transition-all duration-200">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg font-semibold text-zinc-900">
            {bitacora.codigo}
          </CardTitle>
          {getStatusBadge()}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm">
          <div className="flex items-center gap-2 text-zinc-600">
            <User className="w-4 h-4" />
            <span>{getPersonName()}</span>
          </div>
          
          <div className="flex items-center gap-2 text-zinc-600">
            <Calendar className="w-4 h-4" />
            <span>{new Date(bitacora.fecha).toLocaleDateString('es-CL')}</span>
          </div>

          <div className="flex items-center gap-2 text-zinc-600">
            <FileText className="w-4 h-4" />
            <span>Inmersión: {bitacora.inmersion?.codigo || bitacora.inmersion_id}</span>
          </div>

          {type === 'buzo' && (
            <div className="flex items-center gap-2 text-zinc-600">
              <span>Profundidad: {(bitacora as BitacoraBuzo).profundidad_maxima}m</span>
            </div>
          )}
        </div>

        <div className="flex gap-2 pt-3 border-t">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={() => onView(bitacora.bitacora_id)}
            className="flex-1 ios-button-sm"
          >
            <FileText className="w-4 h-4 mr-1" />
            Ver Detalles
          </Button>

          {!bitacora.firmado && (
            <Button 
              size="sm"
              onClick={() => onSign(bitacora.bitacora_id)}
              className="flex-1 bg-blue-600 hover:bg-blue-700 ios-button-sm"
            >
              <PenTool className="w-4 h-4 mr-1" />
              Firmar
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
