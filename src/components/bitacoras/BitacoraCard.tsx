
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Edit, PenTool, Calendar, User } from "lucide-react";
import { BitacoraSupervisorItem, BitacoraBuzoItem } from "@/hooks/useBitacoras";
import { format } from "date-fns";
import { es } from "date-fns/locale";

interface BitacoraCardProps {
  bitacora: BitacoraSupervisorItem | BitacoraBuzoItem;
  type: 'supervisor' | 'buzo';
  onView: (id: string) => void;
  onEdit: (id: string) => void;
  onSign: (id: string) => void;
}

export const BitacoraCard = ({ bitacora, type, onView, onEdit, onSign }: BitacoraCardProps) => {
  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const getTypeIcon = () => {
    return type === 'supervisor' ? 
      <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
        <FileText className="w-4 h-4 text-purple-600" />
      </div> :
      <div className="w-8 h-8 bg-teal-100 rounded-lg flex items-center justify-center">
        <FileText className="w-4 h-4 text-teal-600" />
      </div>;
  };

  const getStatusBadge = () => {
    if (bitacora.firmado) {
      return (
        <Badge variant="secondary" className="bg-green-100 text-green-700">
          Firmada
        </Badge>
      );
    }
    return (
      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700">
        Pendiente Firma
      </Badge>
    );
  };

  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {getTypeIcon()}
            <div>
              <CardTitle className="text-lg">{bitacora.codigo}</CardTitle>
              <p className="text-sm text-zinc-500">
                Bitácora de {type === 'supervisor' ? 'Supervisor' : 'Buzo'}
              </p>
            </div>
          </div>
          {getStatusBadge()}
        </div>
      </CardHeader>
      
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-600">{formatDate(bitacora.fecha)}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-zinc-400" />
            <span className="text-zinc-600">
              {'supervisor' in bitacora ? bitacora.supervisor : bitacora.buzo}
            </span>
          </div>
        </div>

        <div className="text-sm">
          <p className="text-zinc-500 mb-1">Inmersión:</p>
          <p className="text-zinc-700 font-medium">{bitacora.inmersion_codigo}</p>
        </div>

        <div className="flex justify-between items-center pt-2 border-t">
          <span className="text-xs text-zinc-500">
            Creada: {formatDate(bitacora.created_at)}
          </span>
          <div className="flex gap-1">
            <Button variant="outline" size="sm" onClick={() => onView(bitacora.id)}>
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={() => onEdit(bitacora.id)}>
              <Edit className="w-4 h-4" />
            </Button>
            {!bitacora.firmado && (
              <Button 
                size="sm" 
                onClick={() => onSign(bitacora.id)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <PenTool className="w-4 h-4" />
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
