
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2, FileText, PlusCircle, CheckCircle } from "lucide-react";

interface OperacionCardViewProps {
  operaciones: any[];
  onSelect: (operacion: any) => void;
  onEdit: () => void;
  onCreateHPT: (operacionId: string) => void;
  onCreateAnexoBravo: (operacionId: string) => void;
}

export const OperacionCardView = ({ 
  operaciones, 
  onSelect, 
  onEdit, 
  onCreateHPT, 
  onCreateAnexoBravo 
}: OperacionCardViewProps) => {
  const getEstadoBadge = (estado: string) => {
    const variants = {
      'activa': 'bg-green-100 text-green-700',
      'completada': 'bg-blue-100 text-blue-700',
      'cancelada': 'bg-red-100 text-red-700',
      'planificada': 'bg-yellow-100 text-yellow-700'
    };
    return variants[estado as keyof typeof variants] || 'bg-gray-100 text-gray-700';
  };

  const hasHPT = (operacionId: string) => {
    return Math.random() > 0.5; // Placeholder
  };

  const hasAnexoBravo = (operacionId: string) => {
    return Math.random() > 0.5; // Placeholder
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {operaciones.map((operacion) => (
        <Card key={operacion.id} className="ios-card">
          <CardHeader className="pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-lg">{operacion.nombre}</CardTitle>
              <Badge className={getEstadoBadge(operacion.estado)}>
                {operacion.estado}
              </Badge>
            </div>
            <p className="text-sm text-zinc-500">{operacion.codigo}</p>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-sm">
              <div>Inicio: {new Date(operacion.fecha_inicio).toLocaleDateString()}</div>
              {operacion.fecha_fin && (
                <div className="text-zinc-500">
                  Fin: {new Date(operacion.fecha_fin).toLocaleDateString()}
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {hasHPT(operacion.id) ? (
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  HPT
                </Badge>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCreateHPT(operacion.id)}
                  className="h-6 px-2 text-xs"
                >
                  <PlusCircle className="w-3 h-3 mr-1" />
                  HPT
                </Button>
              )}
              
              {hasAnexoBravo(operacion.id) ? (
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Anexo
                </Badge>
              ) : (
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => onCreateAnexoBravo(operacion.id)}
                  className="h-6 px-2 text-xs"
                >
                  <PlusCircle className="w-3 h-3 mr-1" />
                  Anexo
                </Button>
              )}
            </div>

            <div className="flex gap-2 pt-2">
              <Button variant="outline" size="sm" onClick={() => onSelect(operacion)} className="flex-1">
                <Eye className="w-4 h-4 mr-2" />
                Ver
              </Button>
              <Button variant="outline" size="sm" onClick={onEdit}>
                <Edit className="w-4 h-4" />
              </Button>
              <Button variant="outline" size="sm" className="text-red-600 hover:text-red-700">
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
