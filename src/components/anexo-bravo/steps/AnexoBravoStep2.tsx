
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, CreditCard, Shield, Upload, File, X } from "lucide-react";
import { useDropzone } from "react-dropzone";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { useOperaciones } from "@/hooks/useOperaciones";

interface AnexoBravoStep2Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const AnexoBravoStep2 = ({ data, onUpdate }: AnexoBravoStep2Props) => {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const { equipos } = useEquiposBuceoEnhanced();
  const { operaciones } = useOperaciones();

  // Get current operation
  const currentOperation = operaciones.find(op => op.id === data.operacion_id);

  // Get available divers from teams (since teams are no longer directly assigned to operations)
  const availableDivers = equipos.reduce((divers: any[], equipo) => {
    const teamDivers = equipo.miembros?.filter(m => 
      m.rol_equipo === 'buzo_principal' || m.rol_equipo === 'buzo_asistente'
    ) || [];
    return [...divers, ...teamDivers];
  }, []);

  const handleInputChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const onDrop = (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (file) {
      setUploadedFile(file);
      // Here you would typically upload to storage and get URL
      // For now, we'll just store the file name
      handleInputChange('autorizacion_documento_url', file.name);
    }
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'image/*': ['.png', '.jpg', '.jpeg']
    },
    maxFiles: 1
  });

  const removeFile = () => {
    setUploadedFile(null);
    handleInputChange('autorizacion_documento_url', '');
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Identificación del Buzo o Empresa de Buceo</h2>
        <p className="mt-2 text-gray-600">
          Información de certificación y identificación del personal de buceo
        </p>
      </div>

      {/* Buzo Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Buzo Principal o Empresa de Buceo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buzo_empresa">Nombre del Buzo o Empresa</Label>
              <Input
                id="buzo_empresa"
                value={data.buzo_o_empresa_nombre || ''}
                onChange={(e) => handleInputChange('buzo_o_empresa_nombre', e.target.value)}
                placeholder="Nombre completo o razón social"
              />
            </div>

            <div>
              <Label htmlFor="buzo_matricula">Matrícula</Label>
              <Input
                id="buzo_matricula"
                value={data.buzo_matricula || ''}
                onChange={(e) => handleInputChange('buzo_matricula', e.target.value)}
                placeholder="Número de matrícula"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-3 border rounded-lg bg-blue-50">
              <Checkbox
                id="autorizacion_armada"
                checked={data.autorizacion_armada || false}
                onCheckedChange={(checked) => handleInputChange('autorizacion_armada', checked)}
              />
              <Label htmlFor="autorizacion_armada" className="text-sm font-medium cursor-pointer flex-1">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-blue-600" />
                  Autorización de la Autoridad Marítima (Adjuntar copia)
                </div>
              </Label>
            </div>

            {/* File Upload Area */}
            {data.autorizacion_armada && (
              <div className="space-y-3">
                <Label>Documento de Autorización</Label>
                {!uploadedFile && !data.autorizacion_documento_url ? (
                  <div
                    {...getRootProps()}
                    className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors
                      ${isDragActive 
                        ? 'border-blue-400 bg-blue-50' 
                        : 'border-gray-300 hover:border-gray-400'
                      }`}
                  >
                    <input {...getInputProps()} />
                    <Upload className="mx-auto h-8 w-8 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {isDragActive
                        ? 'Suelta el archivo aquí...'
                        : 'Arrastra el archivo aquí o haz clic para seleccionar'
                      }
                    </p>
                    <p className="text-xs text-gray-500 mt-1">
                      PDF, PNG, JPG hasta 10MB
                    </p>
                  </div>
                ) : (
                  <div className="flex items-center gap-3 p-3 border rounded-lg bg-green-50">
                    <File className="w-5 h-5 text-green-600" />
                    <span className="flex-1 text-sm text-green-800">
                      {uploadedFile?.name || data.autorizacion_documento_url}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={removeFile}
                      className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Asistente de Buzo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Asistente de Buzo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {availableDivers.length > 0 ? (
            <div>
              <Label htmlFor="asistente_select">Seleccionar Asistente de Equipos Disponibles</Label>
              <Select
                value={data.asistente_buzo_nombre || ''}
                onValueChange={(value) => {
                  const selectedDiver = availableDivers.find(d => 
                    (d.usuario?.nombre + ' ' + d.usuario?.apellido) === value
                  );
                  if (selectedDiver) {
                    handleInputChange('asistente_buzo_nombre', value);
                    handleInputChange('asistente_buzo_matricula', selectedDiver.matricula || '');
                  }
                }}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Seleccione un buzo de los equipos disponibles" />
                </SelectTrigger>
                <SelectContent>
                  {availableDivers.map((diver, index) => {
                    const nombre = diver.usuario ? 
                      `${diver.usuario.nombre} ${diver.usuario.apellido}` : 
                      `Miembro ${index + 1}`;
                    
                    return (
                      <SelectItem key={diver.id} value={nombre}>
                        <div className="flex flex-col">
                          <span>{nombre}</span>
                          <span className="text-xs text-gray-500">
                            {diver.rol_equipo === 'buzo_principal' ? 'Buzo Principal' : 'Buzo Asistente'}
                            {diver.matricula && ` - Mat: ${diver.matricula}`}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          ) : null}

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="asistente_nombre">Nombre del Asistente</Label>
              <Input
                id="asistente_nombre"
                value={data.asistente_buzo_nombre || ''}
                onChange={(e) => handleInputChange('asistente_buzo_nombre', e.target.value)}
                placeholder="Nombre completo del asistente"
              />
            </div>

            <div>
              <Label htmlFor="asistente_matricula">Matrícula del Asistente</Label>
              <Input
                id="asistente_matricula"
                value={data.asistente_buzo_matricula || ''}
                onChange={(e) => handleInputChange('asistente_buzo_matricula', e.target.value)}
                placeholder="Número de matrícula del asistente"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <CreditCard className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-sm text-amber-800">
            <strong>Importante:</strong> Verifique que todas las matrículas estén vigentes y que se cuente 
            con la autorización correspondiente de la Autoridad Marítima. Es obligatorio adjuntar copia 
            de las certificaciones.
          </div>
        </div>
      </div>
    </div>
  );
};
