
import { useState } from "react";
import { TableCell, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, PenTool, CheckCircle } from "lucide-react";
import { format } from "date-fns";
import { BitacoraSignatureModal } from "./BitacoraSignatureModal";

interface BitacoraTableRowProps {
  bitacora: any;
  type: 'supervisor' | 'buzo';
  onSign: (id: string, signatureData: string) => void;
  onViewDetails?: (bitacoraId: string) => void;
  currentUserName?: string;
  currentUserRole?: string;
}

export const BitacoraTableRow = ({ 
  bitacora, 
  type, 
  onSign, 
  onViewDetails,
  currentUserName = 'Usuario',
  currentUserRole = 'Usuario'
}: BitacoraTableRowProps) => {
  const [showSignatureModal, setShowSignatureModal] = useState(false);

  const getEstadoBadge = (firmado: boolean) => {
    if (firmado) {
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

  const handleSignClick = () => {
    setShowSignatureModal(true);
  };

  const handleSignature = (signatureData: string) => {
    onSign(bitacora.bitacora_id, signatureData);
    setShowSignatureModal(false);
  };

  const handleViewClick = () => {
    if (onViewDetails) {
      onViewDetails(bitacora.bitacora_id);
    }
  };

  return (
    <>
      <TableRow>
        <TableCell className="font-medium">{bitacora.codigo}</TableCell>
        <TableCell>{bitacora.inmersion_id}</TableCell>
        <TableCell>
          {type === 'supervisor' ? bitacora.supervisor : bitacora.buzo}
        </TableCell>
        <TableCell>
          {format(new Date(bitacora.fecha), 'dd/MM/yyyy')}
        </TableCell>
        {type === 'buzo' && (
          <TableCell>
            {bitacora.profundidad_maxima} mts
          </TableCell>
        )}
        <TableCell>
          {getEstadoBadge(bitacora.firmado)}
        </TableCell>
        <TableCell className="text-right">
          <div className="flex items-center gap-2 justify-end">
            <Button variant="outline" size="sm" onClick={handleViewClick}>
              <Eye className="w-4 h-4" />
            </Button>
            {!bitacora.firmado && (
              <Button 
                size="sm"
                onClick={handleSignClick}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <PenTool className="w-4 h-4 mr-1" />
                Firmar
              </Button>
            )}
          </div>
        </TableCell>
      </TableRow>

      <BitacoraSignatureModal
        isOpen={showSignatureModal}
        onClose={() => setShowSignatureModal(false)}
        onSign={handleSignature}
        title={`Firmar Bitácora ${type === 'supervisor' ? 'de Supervisor' : 'de Buzo'}`}
        userName={currentUserName}
        role={currentUserRole}
      />
    </>
  );
};
