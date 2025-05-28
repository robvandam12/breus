
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { FileText, CheckCircle, AlertCircle, Clock } from "lucide-react";

interface OperacionDocumentsProps {
  operacionId: string;
}

export const OperacionDocuments = ({ operacionId }: OperacionDocumentsProps) => {
  // Mock data - En producción esto vendría de hooks
  const documentos = [
    {
      tipo: 'HPT',
      estado: 'firmado',
      fecha: '2024-01-15',
      url: '#'
    },
    {
      tipo: 'Anexo Bravo',
      estado: 'borrador',
      fecha: '2024-01-16',
      url: '#'
    }
  ];

  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'firmado':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'pendiente':
        return <Clock className="w-4 h-4 text-yellow-600" />;
      default:
        return <AlertCircle className="w-4 h-4 text-red-600" />;
    }
  };

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'firmado':
        return 'bg-green-100 text-green-700';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-red-100 text-red-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Documentos de la Operación
        </CardTitle>
      </CardHeader>
      <CardContent>
        {documentos.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500">No hay documentos asociados</p>
          </div>
        ) : (
          <div className="space-y-3">
            {documentos.map((doc, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  {getStatusIcon(doc.estado)}
                  <div>
                    <p className="font-medium">{doc.tipo}</p>
                    <p className="text-sm text-zinc-500">
                      {new Date(doc.fecha).toLocaleDateString('es-CL')}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(doc.estado)}>
                    {doc.estado}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Ver
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
