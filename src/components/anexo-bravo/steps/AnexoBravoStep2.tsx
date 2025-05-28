
import React, { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { User, Upload, X } from 'lucide-react';
import { useEquiposBuceoEnhanced } from '@/hooks/useEquiposBuceoEnhanced';
import { useOperaciones } from '@/hooks/useOperaciones';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

interface AnexoBravoStep2Props {
  data: any;
  onUpdate: (updates: any) => void;
}

export const AnexoBravoStep2: React.FC<AnexoBravoStep2Props> = ({ data, onUpdate }) => {
  const { equipos } = useEquiposBuceoEnhanced();
  const { operaciones } = useOperaciones();

  // Auto-populate assistant divers from the diving team
  useEffect(() => {
    if (data.operacion_id && equipos.length > 0) {
      const operacion = operaciones.find(op => op.id === data.operacion_id);
      if (operacion?.equipo_buceo_id) {
        const equipoAsignado = equipos.find(eq => eq.id === operacion.equipo_buceo_id);
        if (equipoAsignado?.miembros) {
          const buzoAsistente = equipoAsignado.miembros.find(m => m.rol === 'buzo_asistente');
          if (buzoAsistente && !data.asistente_buzo_nombre) {
            onUpdate({
              asistente_buzo_nombre: buzoAsistente.nombre_completo,
              asistente_buzo_matricula: '' // Matrícula not available, leave for manual entry
            });
          }
        }
      }
    }
  }, [data.operacion_id, equipos, operaciones, data.asistente_buzo_nombre, onUpdate]);

  const handleFileUpload = async (file: File) => {
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `autorizaciones/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('documents')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(filePath);

      onUpdate({ autorizacion_documento_url: publicUrl });
      
      toast({
        title: "Archivo subido",
        description: "El documento ha sido subido exitosamente.",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "No se pudo subir el archivo.",
        variant: "destructive",
      });
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length > 0) {
      handleFileUpload(files[0]);
    }
  };

  const removeDocument = () => {
    onUpdate({ 
      autorizacion_documento_url: '',
      autorizacion_armada: false 
    });
  };

  // Get available assistant divers from the diving team
  const getAsistenteBuzos = () => {
    if (!data.operacion_id) return [];
    
    const operacion = operaciones.find(op => op.id === data.operacion_id);
    if (!operacion?.equipo_buceo_id) return [];
    
    const equipoAsignado = equipos.find(eq => eq.id === operacion.equipo_buceo_id);
    if (!equipoAsignado?.miembros) return [];
    
    return equipoAsignado.miembros.filter(m => 
      m.rol === 'buzo_asistente' || m.rol === 'buzo_principal'
    );
  };

  const asistenteBuzosDisponibles = getAsistenteBuzos();

  return (
    <div className="space-y-6">
      <Card className="ios-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-blue-600" />
            Personal del Trabajo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="supervisor_servicio_nombre">
                Supervisor del Servicio <span className="text-red-500">*</span>
              </Label>
              <Input
                id="supervisor_servicio_nombre"
                value={data.supervisor_servicio_nombre || ''}
                onChange={(e) => onUpdate({ supervisor_servicio_nombre: e.target.value })}
                placeholder="Nombre del supervisor del servicio"
                className="ios-input"
              />
            </div>

            <div>
              <Label htmlFor="supervisor_mandante_nombre">
                Supervisor del Mandante <span className="text-red-500">*</span>
              </Label>
              <Input
                id="supervisor_mandante_nombre"
                value={data.supervisor_mandante_nombre || ''}
                onChange={(e) => onUpdate({ supervisor_mandante_nombre: e.target.value })}
                placeholder="Nombre del supervisor del mandante"
                className="ios-input"
              />
            </div>

            <div>
              <Label htmlFor="buzo_o_empresa_nombre">
                Buzo o Empresa <span className="text-red-500">*</span>
              </Label>
              <Input
                id="buzo_o_empresa_nombre"
                value={data.buzo_o_empresa_nombre || ''}
                onChange={(e) => onUpdate({ buzo_o_empresa_nombre: e.target.value })}
                placeholder="Nombre del buzo o empresa"
                className="ios-input"
                readOnly
              />
              <p className="text-xs text-blue-600 mt-1">Auto-poblado desde datos de operación</p>
            </div>

            <div>
              <Label htmlFor="buzo_matricula">
                Matrícula del Buzo
              </Label>
              <Input
                id="buzo_matricula"
                value={data.buzo_matricula || ''}
                onChange={(e) => onUpdate({ buzo_matricula: e.target.value })}
                placeholder="Matrícula del buzo"
                className="ios-input"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="asistente_buzo_select">
                Asistente de Buzo
              </Label>
              {asistenteBuzosDisponibles.length > 0 ? (
                <Select
                  value={data.asistente_buzo_nombre || ''}
                  onValueChange={(value) => {
                    const selectedBuzo = asistenteBuzosDisponibles.find(b => b.nombre_completo === value);
                    onUpdate({ 
                      asistente_buzo_nombre: value,
                      asistente_buzo_matricula: '' // Reset matricula for manual entry
                    });
                  }}
                >
                  <SelectTrigger className="ios-input">
                    <SelectValue placeholder="Seleccione asistente de buzo" />
                  </SelectTrigger>
                  <SelectContent>
                    {asistenteBuzosDisponibles.map((buzo) => (
                      <SelectItem key={buzo.id} value={buzo.nombre_completo}>
                        {buzo.nombre_completo} ({buzo.rol})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ) : (
                <Input
                  value={data.asistente_buzo_nombre || ''}
                  onChange={(e) => onUpdate({ asistente_buzo_nombre: e.target.value })}
                  placeholder="Nombre del asistente de buzo"
                  className="ios-input"
                />
              )}
            </div>

            <div>
              <Label htmlFor="asistente_buzo_matricula">
                Matrícula del Asistente
              </Label>
              <Input
                id="asistente_buzo_matricula"
                value={data.asistente_buzo_matricula || ''}
                onChange={(e) => onUpdate({ asistente_buzo_matricula: e.target.value })}
                placeholder="Matrícula del asistente"
                className="ios-input"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="ios-card">
        <CardHeader>
          <CardTitle>Autorización Marítima</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="autorizacion_armada"
              checked={data.autorizacion_armada || false}
              onCheckedChange={(checked) => onUpdate({ autorizacion_armada: checked })}
            />
            <Label htmlFor="autorizacion_armada" className="text-sm">
              Autorización de la Autoridad Marítima (adjuntar copia)
            </Label>
          </div>

          {data.autorizacion_armada && (
            <div className="space-y-4">
              {!data.autorizacion_documento_url ? (
                <div
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                  onDragOver={handleDragOver}
                  onDrop={handleDrop}
                  onClick={() => document.getElementById('file-upload')?.click()}
                >
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <p className="mt-2 text-sm text-gray-600">
                    Arrastra y suelta el documento aquí, o haz clic para seleccionar
                  </p>
                  <p className="text-xs text-gray-500">PDF, DOC, DOCX (máx. 10MB)</p>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.doc,.docx"
                    onChange={handleFileInputChange}
                  />
                </div>
              ) : (
                <div className="flex items-center justify-between p-3 bg-green-50 border border-green-200 rounded-lg">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Upload className="w-4 h-4 text-green-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-green-800">Documento subido</p>
                      <p className="text-xs text-green-600">Autorización adjuntada correctamente</p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={removeDocument}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
