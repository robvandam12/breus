
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Calendar, MapPin, User, Building } from "lucide-react";

interface AnexoBravoStep1Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const AnexoBravoStep1 = ({ data, onUpdate }: AnexoBravoStep1Props) => {
  const handleInputChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Información General</h2>
        <p className="mt-2 text-gray-600">
          Datos básicos del Anexo Bravo para autorización de buceo
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Empresa */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Building className="w-4 h-4" />
              Empresa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={data.empresa_nombre || ''}
              onChange={(e) => handleInputChange('empresa_nombre', e.target.value)}
              placeholder="Nombre de la empresa"
            />
          </CardContent>
        </Card>

        {/* Lugar de Faena */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Lugar de Faena / Centro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={data.lugar_faena || ''}
              onChange={(e) => handleInputChange('lugar_faena', e.target.value)}
              placeholder="Ubicación del centro de trabajo"
            />
          </CardContent>
        </Card>

        {/* Fecha */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Fecha
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="date"
              value={data.fecha || ''}
              onChange={(e) => handleInputChange('fecha', e.target.value)}
            />
          </CardContent>
        </Card>

        {/* Jefe de Centro */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <User className="w-4 h-4" />
              Jefe de Centro
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              value={data.jefe_centro_nombre || ''}
              onChange={(e) => handleInputChange('jefe_centro_nombre', e.target.value)}
              placeholder="Nombre del jefe de centro"
            />
          </CardContent>
        </Card>
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Building className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <strong>Información:</strong> El Anexo Bravo es un documento obligatorio que debe ser completado 
            antes de cualquier operación de buceo. Asegúrese de que toda la información sea correcta y esté actualizada.
          </div>
        </div>
      </div>
    </div>
  );
};
