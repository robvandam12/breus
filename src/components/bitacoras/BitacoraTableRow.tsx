
import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, CheckCircle, Eye, Edit, PenTool } from "lucide-react";
import { BitacoraSupervisorItem, BitacoraBuzoItem } from "@/hooks/useBitacoras";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { BitacoraDetailView } from "./BitacoraDetailView";

interface BitacoraTableRowProps {
  bitacora: BitacoraSupervisorItem | BitacoraBuzoItem;
  type: 'supervisor' | 'buzo';
  onSign?: (id: string) => Promise<void>;
}

export const BitacoraTableRow = ({ bitacora, type, onSign }: BitacoraTableRowProps) => {
  const [loading, setLoading] = useState(false);
  const [showDetail, setShowDetail] = useState(false);

  const getEstadoBadge = (firmado: boolean) => {
    return firmado ? "bg-emerald-100 text-emerald-700" : "bg-amber-100 text-amber-700";
  };

  const formatEstado = (firmado: boolean) => {
    return firmado ? 'Firmada' : 'Pendiente';
  };

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

  const iconColor = type === 'supervisor' ? 'text-purple-600' : 'text-teal-600';
  const bgColor = type === 'supervisor' ? 'bg-purple-100' : 'bg-teal-100';

  return (
    <>
      <TableRow>
        <TableCell>
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 ${bgColor} rounded-lg flex items-center justify-center`}>
              <FileText className={`w-4 h-4 ${iconColor}`} />
            </div>
            <div className="font-medium">{bitacora.codigo}</div>
          </div>
        </TableCell>
        <TableCell className="text-zinc-600">{bitacora.inmersion_codigo}</TableCell>
        <TableCell className="text-zinc-600">
          {type === 'supervisor' ? (bitacora as BitacoraSupervisorItem).supervisor : (bitacora as BitacoraBuzoItem).buzo}
        </TableCell>
        <TableCell className="text-zinc-600">{bitacora.fecha}</TableCell>
        {type === 'buzo' && (
          <TableCell className="text-zinc-600">
            {(bitacora as BitacoraBuzoItem).profundidad_maxima}m
          </TableCell>
        )}
        <TableCell>
          <Badge variant="secondary" className={getEstadoBadge(bitacora.firmado)}>
            {formatEstado(bitacora.firmado)}
          </Badge>
        </TableCell>
        <TableCell className="text-right">
          <div className="flex justify-end gap-1">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => setShowDetail(true)}
            >
              <Eye className="w-4 h-4" />
            </Button>
            <Button variant="outline" size="sm">
              <Edit className="w-4 h-4" />
            </Button>
            {!bitacora.firmado && onSign && (
              <Button 
                size="sm"
                onClick={handleSign}
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
              >
                {loading ? (
                  <LoadingSpinner size="sm" />
                ) : (
                  <PenTool className="w-4 h-4" />
                )}
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      <Dialog open={showDetail} onOpenChange={setShowDetail}>
        <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-6">
          <BitacoraDetailView
            bitacora={bitacora}
            type={type}
            onSign={onSign}
            onClose={() => setShowDetail(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};
