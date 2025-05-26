
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Building2, MapPin, Phone, Mail, Edit, Trash2, Eye } from "lucide-react";
import { Salmonera } from "@/hooks/useSalmoneras";

interface SalmoneraCardViewProps {
  salmoneras: Salmonera[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
  onSelect?: (salmonera: Salmonera) => void;
  isDeleting?: boolean;
  isUpdating?: boolean;
}

export const SalmoneraCardView = ({ 
  salmoneras, 
  onEdit, 
  onDelete, 
  onSelect,
  isDeleting = false, 
  isUpdating = false 
}: SalmoneraCardViewProps) => {
  const getEstadoBadgeColor = (estado: string | undefined | null) => {
    if (!estado) return 'bg-gray-100 text-gray-700 border-gray-200';
    
    switch (estado) {
      case 'activa':
        return 'bg-emerald-100 text-emerald-700 border-emerald-200';
      case 'inactiva':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      case 'suspendida':
        return 'bg-red-100 text-red-700 border-red-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const formatEstado = (estado: string | undefined | null) => {
    if (!estado) return 'Sin estado';
    return estado.charAt(0).toUpperCase() + estado.slice(1);
  };

  return (
    <div className="grid gap-6">
      {salmoneras.map((salmonera) => (
        <Card key={salmonera.id} className="ios-card hover:shadow-lg transition-all duration-200 hover:scale-[1.02]">
          <CardHeader className="pb-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-zinc-600" />
                </div>
                <div>
                  <CardTitle className="text-lg text-zinc-900 dark:text-zinc-100">
                    {salmonera.nombre || 'Sin nombre'}
                  </CardTitle>
                  <p className="text-sm text-zinc-500 font-mono">RUT: {salmonera.rut || 'Sin RUT'}</p>
                </div>
              </div>
              <Badge 
                variant="outline" 
                className={`${getEstadoBadgeColor(salmonera.estado)} font-medium`}
              >
                {formatEstado(salmonera.estado)}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <MapPin className="w-4 h-4" />
                <span className="truncate">{salmonera.direccion || 'Sin dirección'}</span>
              </div>
              {salmonera.telefono && (
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Phone className="w-4 h-4" />
                  <span>{salmonera.telefono}</span>
                </div>
              )}
              {salmonera.email && (
                <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                  <Mail className="w-4 h-4" />
                  <span className="truncate">{salmonera.email}</span>
                </div>
              )}
              <div className="flex items-center gap-2 text-sm text-zinc-600 dark:text-zinc-400">
                <Building2 className="w-4 h-4" />
                <span>{salmonera.sitios_activos || 0} sitios activos</span>
              </div>
            </div>
            <div className="flex justify-end gap-2 pt-2 border-t border-zinc-200 dark:border-zinc-700">
              {onSelect && (
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => onSelect(salmonera)}
                  className="touch-target"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Ver Detalles
                </Button>
              )}
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => onEdit(salmonera.id)}
                disabled={isUpdating}
                className="touch-target"
              >
                <Edit className="w-4 h-4 mr-1" />
                Editar
              </Button>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => onDelete(salmonera.id)}
                disabled={isDeleting}
                className="touch-target text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                <Trash2 className="w-4 h-4 mr-1" />
                Eliminar
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
