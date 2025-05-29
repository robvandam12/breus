
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Database, TestTube } from "lucide-react";
import { useMockupMode } from "@/hooks/useMockupMode";
import { Badge } from "@/components/ui/badge";

export const MockupToggle = () => {
  const { useMockup, toggleMockup } = useMockupMode();

  return (
    <Card className="border-orange-200 bg-orange-50">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-orange-800">
          <TestTube className="w-5 h-5" />
          Modo de Datos
          <Badge variant="outline" className="bg-orange-100 text-orange-700">
            {useMockup ? 'Mockup' : 'Real'}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Database className="w-4 h-4 text-orange-600" />
            <div>
              <Label htmlFor="mockup-mode" className="text-sm font-medium text-orange-800">
                {useMockup ? 'Usando datos de prueba (mockup)' : 'Usando datos reales (Supabase)'}
              </Label>
              <p className="text-xs text-orange-600 mt-1">
                {useMockup 
                  ? 'Operación completa con todos los documentos y bitácoras de ejemplo'
                  : 'Datos de la base de datos real'
                }
              </p>
            </div>
          </div>
          <Switch
            id="mockup-mode"
            checked={useMockup}
            onCheckedChange={toggleMockup}
          />
        </div>
      </CardContent>
    </Card>
  );
};
