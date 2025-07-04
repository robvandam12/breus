
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { FileText, Plus, CheckCircle, AlertCircle, Clock } from "lucide-react";
import { useRouter } from "@/hooks/useRouter";

interface DocumentStatusCardProps {
  operacionId: string;
  operacionCodigo: string;
  documents: {
    hpt?: { exists: boolean; firmado?: boolean; id?: string };
    anexoBravo?: { exists: boolean; firmado?: boolean; id?: string };
    inmersiones?: { count: number };
  };
}

export const DocumentStatusCard = ({ operacionId, operacionCodigo, documents }: DocumentStatusCardProps) => {
  const { navigateTo } = useRouter();

  const getDocumentStatus = (doc?: { exists: boolean; firmado?: boolean }) => {
    if (!doc?.exists) return { icon: AlertCircle, color: 'text-red-500', bg: 'bg-red-50', text: 'Pendiente' };
    if (!doc.firmado) return { icon: Clock, color: 'text-yellow-500', bg: 'bg-yellow-50', text: 'En progreso' };
    return { icon: CheckCircle, color: 'text-green-500', bg: 'bg-green-50', text: 'Completado' };
  };

  const hptStatus = getDocumentStatus(documents.hpt);
  const anexoStatus = getDocumentStatus(documents.anexoBravo);

  const handleCreateHPT = () => {
    navigateTo(`/formularios/hpt?operacion=${operacionId}`);
  };

  const handleCreateAnexoBravo = () => {
    navigateTo(`/formularios/anexo-bravo?operacion=${operacionId}`);
  };

  const handleViewDocument = (type: 'hpt' | 'anexo-bravo', id: string) => {
    navigateTo(`/formularios/${type}/${id}`);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 text-lg">
          <FileText className="w-5 h-5 text-blue-600" />
          Estado de Documentos - {operacionCodigo}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* HPT Status */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${hptStatus.bg}`}>
              <hptStatus.icon className={`w-4 h-4 ${hptStatus.color}`} />
            </div>
            <div>
              <p className="font-medium">Hoja de Planificación de Trabajo (HPT)</p>
              <Badge variant="outline" className={hptStatus.color}>
                {hptStatus.text}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            {documents.hpt?.exists && documents.hpt.id ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewDocument('hpt', documents.hpt!.id!)}
              >
                Ver HPT
              </Button>
            ) : (
              <Button 
                size="sm"
                onClick={handleCreateHPT}
              >
                <Plus className="w-4 h-4 mr-1" />
                Crear HPT
              </Button>
            )}
          </div>
        </div>

        {/* Anexo Bravo Status */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <div className={`p-2 rounded-full ${anexoStatus.bg}`}>
              <anexoStatus.icon className={`w-4 h-4 ${anexoStatus.color}`} />
            </div>
            <div>
              <p className="font-medium">Anexo Bravo</p>
              <Badge variant="outline" className={anexoStatus.color}>
                {anexoStatus.text}
              </Badge>
            </div>
          </div>
          <div className="flex gap-2">
            {documents.anexoBravo?.exists && documents.anexoBravo.id ? (
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => handleViewDocument('anexo-bravo', documents.anexoBravo!.id!)}
              >
                Ver Anexo
              </Button>
            ) : (
              <Button 
                size="sm"
                onClick={handleCreateAnexoBravo}
              >
                <Plus className="w-4 h-4 mr-1" />
                Crear Anexo
              </Button>
            )}
          </div>
        </div>

        {/* Inmersiones Status */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-50">
              <FileText className="w-4 h-4 text-blue-500" />
            </div>
            <div>
              <p className="font-medium">Inmersiones Registradas</p>
              <Badge variant="outline">
                {documents.inmersiones?.count || 0} inmersiones
              </Badge>
            </div>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => navigateTo('/inmersiones')}
          >
            Ver Inmersiones
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
