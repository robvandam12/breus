
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { TestTube, Database, Eye } from "lucide-react";
import { useMockupMode } from "@/hooks/useMockupMode";
import { useNavigate } from "react-router-dom";

export const MockupDataCard = () => {
  const { useMockup } = useMockupMode();
  const navigate = useNavigate();

  return (
    <Card className="border-orange-200 bg-gradient-to-br from-orange-50 to-orange-100">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          {useMockup ? (
            <TestTube className="w-5 h-5 text-orange-600" />
          ) : (
            <Database className="w-5 h-5 text-blue-600" />
          )}
          Datos de la Aplicación
          <Badge variant="outline" className={useMockup ? "bg-orange-100 text-orange-700" : "bg-blue-100 text-blue-700"}>
            {useMockup ? 'Mockup Activo' : 'Datos Reales'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-700">
          {useMockup 
            ? 'Se están mostrando datos de prueba que incluyen una operación completa con equipo, documentos firmados, inmersiones y bitácoras.'
            : 'Se están mostrando datos reales de la base de datos.'
          }
        </p>
        
        {useMockup && (
          <div className="text-xs text-orange-700 bg-orange-50 p-2 rounded border">
            <strong>Operación incluida:</strong> OP-SER-001-2024<br />
            <strong>Equipo:</strong> 1 supervisor + 4 buzos<br />
            <strong>Documentos:</strong> HPT y Anexo B firmados<br />
            <strong>Inmersiones:</strong> 4 completadas<br />
            <strong>Bitácoras:</strong> 4 supervisor + 8 buzo
          </div>
        )}
        
        <Button 
          onClick={() => navigate('/mockup-data')} 
          variant="outline" 
          className="w-full"
        >
          <Eye className="w-4 h-4 mr-2" />
          Ver Datos Completos
        </Button>
      </CardContent>
    </Card>
  );
};
