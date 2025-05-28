
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, CreditCard, Shield, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCallback } from "react";
import { toast } from "@/hooks/use-toast";

interface AnexoBravoStep2Props {
  data: any;
  onUpdate: (data: any) => void;
  equipoData?: any;
}

export const AnexoBravoStep2 = ({ data, onUpdate, equipoData }: AnexoBravoStep2Props) => {
  const handleInputChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const handleFileUpload = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validar tipo de archivo
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Tipo de archivo no válido",
          description: "Solo se permiten archivos PDF, JPG, JPEG y PNG",
          variant: "destructive",
        });
        return;
      }

      // Validar tamaño (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Archivo muy grande",
          description: "El archivo no debe exceder 5MB",
          variant: "destructive",
        });
        return;
      }

      onUpdate({ autorizacion_armada_documento: file });
      toast({
        title: "Archivo cargado",
        description: `${file.name} ha sido cargado exitosamente`,
      });
    }
  }, [onUpdate]);

  const removeFile = () => {
    onUpdate({ autorizacion_armada_documento: null });
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      const file = files[0];
      const allowedTypes = ['application/pdf', 'image/jpeg', 'image/png', 'image/jpg'];
      
      if (!allowedTypes.includes(file.type)) {
        toast({
          title: "Tipo de archivo no válido",
          description: "Solo se permiten archivos PDF, JPG, JPEG y PNG",
          variant: "destructive",
        });
        return;
      }

      if (file.size > 5 * 1024 * 1024) {
        toast({
          title: "Archivo muy grande",
          description: "El archivo no debe exceder 5MB",
          variant: "destructive",
        });
        return;
      }

      onUpdate({ autorizacion_armada_documento: file });
      toast({
        title: "Archivo cargado",
        description: `${file.name} ha sido cargado exitosamente`,
      });
    }
  }, [onUpdate]);

  // Obtener miembros del equipo para selección de asistente
  const teamMembers = equipoData?.miembros || [];
  const buzos = teamMembers.filter((m: any) => m.rol === 'buzo_principal' || m.rol === 'buzo_asistente');

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Personal y Autorizaciones</h2>
        <p className="mt-2 text-gray-600">
          Información del personal involucrado y documentación requerida
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Supervisores */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Supervisores
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="supervisor_servicio">Supervisor del Servicio</Label>
              <Input
                id="supervisor_servicio"
                value={data.supervisor_servicio_nombre || ''}
                onChange={(e) => handleInputChange('supervisor_servicio_nombre', e.target.value)}
                placeholder="Nombre del supervisor del servicio"
              />
            </div>
            
            <div>
              <Label htmlFor="supervisor_mandante">Supervisor Mandante/Blumar</Label>
              <Input
                id="supervisor_mandante"
                value={data.supervisor_mandante_nombre || ''}
                onChange={(e) => handleInputChange('supervisor_mandante_nombre', e.target.value)}
                placeholder="Nombre del supervisor mandante"
              />
            </div>
          </CardContent>
        </Card>

        {/* Buzos */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-sm font-medium flex items-center gap-2">
              <Users className="w-4 h-4" />
              Buzos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="buzo_principal">Buzo Principal / Empresa</Label>
              <Input
                id="buzo_principal"
                value={data.buzo_o_empresa_nombre || ''}
                onChange={(e) => handleInputChange('buzo_o_empresa_nombre', e.target.value)}
                placeholder="Nombre del buzo o empresa"
              />
            </div>
            
            <div>
              <Label htmlFor="buzo_matricula">Matrícula del Buzo</Label>
              <Input
                id="buzo_matricula"
                value={data.buzo_matricula || ''}
                onChange={(e) => handleInputChange('buzo_matricula', e.target.value)}
                placeholder="Número de matrícula"
              />
            </div>

            <div>
              <Label htmlFor="asistente_buzo">Asistente de Buzo</Label>
              <Select 
                value={data.asistente_buzo_id || ''} 
                onValueChange={(value) => {
                  const selectedBuzo = buzos.find((b: any) => b.usuario_id === value);
                  if (selectedBuzo) {
                    handleInputChange('asistente_buzo_id', value);
                    handleInputChange('asistente_buzo_nombre', selectedBuzo.nombre_completo);
                    handleInputChange('asistente_buzo_matricula', selectedBuzo.matricula || '');
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar asistente de buzo" />
                </SelectTrigger>
                <SelectContent>
                  {buzos.map((buzo: any) => (
                    <SelectItem key={buzo.usuario_id} value={buzo.usuario_id}>
                      {buzo.nombre_completo} {buzo.matricula && `(${buzo.matricula})`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {data.asistente_buzo_nombre && (
              <div>
                <Label htmlFor="asistente_matricula">Matrícula del Asistente</Label>
                <Input
                  id="asistente_matricula"
                  value={data.asistente_buzo_matricula || ''}
                  onChange={(e) => handleInputChange('asistente_buzo_matricula', e.target.value)}
                  placeholder="Número de matrícula del asistente"
                />
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Autorización de la Autoridad Marítima */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-medium flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Autorización de la Autoridad Marítima
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="autorizacion_armada"
              checked={data.autorizacion_armada || false}
              onCheckedChange={(checked) => handleInputChange('autorizacion_armada', Boolean(checked))}
            />
            <Label htmlFor="autorizacion_armada" className="text-sm font-medium">
              Autorización de la Autoridad Marítima (adjuntar copia)
            </Label>
          </div>

          {data.autorizacion_armada && (
            <div className="mt-4">
              {!data.autorizacion_armada_documento ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors cursor-pointer"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-600 mb-1">
                    Arrastra y suelta el archivo aquí, o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-gray-500">
                    Formatos: PDF, JPG, PNG (máx. 5MB)
                  </p>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileUpload}
                  />
                </div>
              ) : (
                <div className="border border-gray-300 rounded-lg p-4 bg-gray-50">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded flex items-center justify-center">
                        <Upload className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <p className="text-sm font-medium text-gray-900">
                          {data.autorizacion_armada_documento.name}
                        </p>
                        <p className="text-xs text-gray-500">
                          {(data.autorizacion_armada_documento.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Shield className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <strong>Nota:</strong> Asegúrese de que toda la información del personal sea correcta y esté actualizada. 
            Si se requiere autorización de la Autoridad Marítima, el documento debe adjuntarse obligatoriamente.
          </div>
        </div>
      </div>
    </div>
  );
};
