
import React from 'react';
import { DialogHeader, DialogTitle, DialogContent } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, MapPin, User, Building, FileText } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface OperacionDetailsDialogProps {
  operacion: any;
  onClose: () => void;
}

export const OperacionDetailsDialog: React.FC<OperacionDetailsDialogProps> = ({
  operacion,
  onClose
}) => {
  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  const getStatusBadge = (estado: string) => {
    if (estado === 'activa') {
      return { className: "bg-green-100 text-green-700", label: "Activa" };
    } else if (estado === 'completada') {
      return { className: "bg-blue-100 text-blue-700", label: "Completada" };
    } else if (estado === 'cancelada') {
      return { className: "bg-red-100 text-red-700", label: "Cancelada" };
    }
    return { className: "bg-gray-100 text-gray-700", label: estado || "Desconocido" };
  };

  const statusBadge = getStatusBadge(operacion.estado);

  return (
    <>
      <DialogHeader className="p-6 pb-0">
        <DialogTitle className="text-xl flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          {operacion.nombre}
        </DialogTitle>
      </DialogHeader>
      
      <DialogContent className="p-6 space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Código:</span>
              <span className="text-sm">{operacion.codigo}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Fecha Inicio:</span>
              <span className="text-sm">{formatDate(operacion.fecha_inicio)}</span>
            </div>
            
            <div className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-gray-500" />
              <span className="text-sm font-medium">Fecha Fin:</span>
              <span className="text-sm">{formatDate(operacion.fecha_fin) || "N/A"}</span>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-sm font-medium">Estado:</span>
              <Badge className={statusBadge.className}>
                {statusBadge.label}
              </Badge>
            </div>
            
            {operacion.sitios && (
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Sitio:</span>
                <span className="text-sm">{operacion.sitios.nombre}</span>
              </div>
            )}
            
            {operacion.contratistas && (
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-gray-500" />
                <span className="text-sm font-medium">Contratista:</span>
                <span className="text-sm">{operacion.contratistas.nombre}</span>
              </div>
            )}
          </div>
        </div>
        
        {operacion.tareas && (
          <div className="space-y-2">
            <span className="text-sm font-medium">Tareas:</span>
            <p className="text-sm text-gray-600">{operacion.tareas}</p>
          </div>
        )}
        
        <div className="flex justify-end pt-4">
          <Button onClick={onClose}>Cerrar</Button>
        </div>
      </DialogContent>
    </>
  );
};
