
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { MoreHorizontal, Play, CheckCircle, Eye } from "lucide-react";
import { useInmersiones, type Inmersion } from "@/hooks/useInmersiones";
import { useNavigate } from "react-router-dom";

interface InmersionTableRowProps {
  inmersion: Inmersion;
}

export const InmersionTableRow = ({ inmersion }: InmersionTableRowProps) => {
  const navigate = useNavigate();
  const { executeInmersion, completeInmersion } = useInmersiones();

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "planificada":
        return "bg-blue-100 text-blue-700";
      case "en_progreso":
        return "bg-amber-100 text-amber-700";
      case "completada":
        return "bg-emerald-100 text-emerald-700";
      case "cancelada":
        return "bg-red-100 text-red-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  const formatEstado = (estado: string) => {
    const estados = {
      'planificada': 'Planificada',
      'en_progreso': 'En Ejecución',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return estados[estado as keyof typeof estados] || estado;
  };

  const handleExecute = async () => {
    try {
      await executeInmersion(inmersion.inmersion_id);
    } catch (error) {
      console.error('Error executing inmersion:', error);
    }
  };

  const handleComplete = async () => {
    try {
      await completeInmersion(inmersion.inmersion_id);
    } catch (error) {
      console.error('Error completing inmersion:', error);
    }
  };

  const handleViewDetails = () => {
    navigate(`/inmersiones/${inmersion.inmersion_id}`);
  };

  const canExecute = inmersion.hpt_validado && inmersion.anexo_bravo_validado && 
                    inmersion.estado === 'planificada';
  const canComplete = inmersion.estado === 'en_progreso';

  return (
    <TableRow className="hover:bg-zinc-50 dark:hover:bg-zinc-800/50">
      <TableCell className="font-medium">{inmersion.codigo}</TableCell>
      <TableCell>{inmersion.operacion_nombre}</TableCell>
      <TableCell>{inmersion.fecha_inmersion}</TableCell>
      <TableCell>
        {inmersion.hora_inicio} {inmersion.hora_fin && `- ${inmersion.hora_fin}`}
      </TableCell>
      <TableCell>{inmersion.buzo_principal}</TableCell>
      <TableCell>{inmersion.profundidad_max || '-'} m</TableCell>
      <TableCell>
        <Badge variant="outline" className={getEstadoBadge(inmersion.estado)}>
          {formatEstado(inmersion.estado)}
        </Badge>
      </TableCell>
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleViewDetails}>
              <Eye className="mr-2 h-4 w-4" />
              Ver detalles
            </DropdownMenuItem>
            {canExecute && (
              <DropdownMenuItem onClick={handleExecute}>
                <Play className="mr-2 h-4 w-4" />
                Ejecutar
              </DropdownMenuItem>
            )}
            {canComplete && (
              <DropdownMenuItem onClick={handleComplete}>
                <CheckCircle className="mr-2 h-4 w-4" />
                Completar
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  );
};
