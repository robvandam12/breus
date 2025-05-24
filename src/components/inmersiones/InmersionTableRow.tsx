
import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Waves, CheckCircle, XCircle, Play, Eye, Edit, CheckSquare } from "lucide-react";
import { Inmersion, useInmersiones } from "@/hooks/useInmersiones";
import { useNavigate } from "react-router-dom";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

interface InmersionTableRowProps {
  inmersion: Inmersion;
  onRefresh: () => void;
}

export const InmersionTableRow = ({ inmersion, onRefresh }: InmersionTableRowProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { executeInmersion, completeInmersion } = useInmersiones();

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "planificada":
        return "bg-blue-100 text-blue-700";
      case "en_ejecucion":
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
      'en_ejecucion': 'En Ejecución',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return estados[estado as keyof typeof estados] || estado;
  };

  const handleExecute = async () => {
    setLoading(true);
    try {
      await executeInmersion(inmersion.id);
      onRefresh();
    } catch (error) {
      console.error('Error executing inmersion:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleComplete = async () => {
    setLoading(true);
    try {
      await completeInmersion(inmersion.id);
      onRefresh();
    } catch (error) {
      console.error('Error completing inmersion:', error);
    } finally {
      setLoading(false);
    }
  };

  const canExecute = inmersion.estado === 'planificada' && inmersion.hpt_validado && inmersion.anexo_bravo_validado;
  const canComplete = inmersion.estado === 'en_ejecucion';

  return (
    <TableRow>
      <TableCell>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
            <Waves className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <div className="font-medium">{inmersion.codigo}</div>
            <div className="text-xs text-zinc-500">{inmersion.fecha_inmersion}</div>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-zinc-600 max-w-[200px] truncate">
        {inmersion.operacion_nombre}
      </TableCell>
      <TableCell className="text-zinc-600">
        {inmersion.hora_inicio} {inmersion.hora_fin && `- ${inmersion.hora_fin}`}
      </TableCell>
      <TableCell className="text-zinc-600">{inmersion.buzo_principal}</TableCell>
      <TableCell className="text-zinc-600">{inmersion.supervisor}</TableCell>
      <TableCell>
        <Badge variant="secondary" className={getEstadoBadge(inmersion.estado)}>
          {formatEstado(inmersion.estado)}
        </Badge>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1">
            {inmersion.hpt_validado ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <span className="text-xs">HPT</span>
          </div>
          <div className="flex items-center gap-1">
            {inmersion.anexo_bravo_validado ? (
              <CheckCircle className="w-4 h-4 text-green-600" />
            ) : (
              <XCircle className="w-4 h-4 text-red-600" />
            )}
            <span className="text-xs">AB</span>
          </div>
        </div>
      </TableCell>
      <TableCell className="text-right">
        <div className="flex justify-end gap-1">
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigate(`/operaciones/inmersiones/${inmersion.id}`)}
          >
            <Eye className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="sm">
            <Edit className="w-4 h-4" />
          </Button>
          {canExecute && (
            <Button 
              size="sm"
              onClick={handleExecute}
              disabled={loading}
              className="bg-green-600 hover:bg-green-700"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <Play className="w-4 h-4" />
              )}
            </Button>
          )}
          {canComplete && (
            <Button 
              size="sm"
              onClick={handleComplete}
              disabled={loading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                <CheckSquare className="w-4 h-4" />
              )}
            </Button>
          )}
        </div>
      </TableCell>
    </TableRow>
  );
};
