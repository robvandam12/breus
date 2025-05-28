
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Shield, Upload, File, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";

interface FullAnexoBravoFormProps {
  operacionId: string;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const FullAnexoBravoForm = ({ operacionId, onSubmit, onCancel }: FullAnexoBravoFormProps) => {
  const { toast } = useToast();
  const { operaciones } = useOperaciones();
  const { equipos } = useEquiposBuceoEnhanced();
  const [isLoading, setIsLoading] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string>('');
  
  const [formData, setFormData] = useState({
    codigo: '',
    operacion_id: operacionId,
    fecha: new Date().toISOString().split('T')[0],
    lugar_faena: '',
    empresa_nombre: '',
    supervisor_servicio_nombre: '',
    supervisor_mandante_nombre: '',
    buzo_o_empresa_nombre: '',
    buzo_matricula: '',
    asistente_buzo_nombre: '',
    asistente_buzo_matricula: '',
    autorizacion_armada: false,
    bitacora_fecha: new Date().toISOString().split('T')[0],
    bitacora_hora_inicio: '',
    bitacora_hora_termino: '',
    bitacora_relator: '',
    anexo_bravo_checklist: {},
    anexo_bravo_trabajadores: [] as any[],
    anexo_bravo_firmas: {},
    observaciones_generales: '',
    jefe_centro_nombre: '',
    supervisor: '',
    estado: 'borrador',
    firmado: false,
  });

  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  const [selectedAsistente, setSelectedAsistente] = useState('');

  // Cargar datos de la operación y poblar campos
  useEffect(() => {
    const loadOperationData = async () => {
      if (!operacionId) return;

      try {
        // Obtener datos completos de la operación
        const { data: operationData, error } = await supabase
          .from('operacion')
          .select(`
            *,
            sitios:sitio_id (nombre, ubicacion),
            contratistas:contratista_id (nombre),
            salmoneras:salmonera_id (nombre)
          `)
          .eq('id', operacionId)
          .single();

        if (error) throw error;

        const operacion = operationData;
        
        // Encontrar equipo de buceo y sus miembros
        let equipo = null;
        let miembros: any[] = [];
        let supervisor = null;
        let buzoPrincipal = null;

        if (operacion.equipo_buceo_id) {
          equipo = equipos.find(e => e.id === operacion.equipo_buceo_id);
          if (equipo) {
            miembros = equipo.miembros || [];
            supervisor = miembros.find(m => m.rol === 'supervisor');
            buzoPrincipal = miembros.find(m => m.rol === 'buzo_principal');
          }
        }

        setTeamMembers(miembros);

        // Generar código
        const codigo = `AB-${operacion.codigo}-${Date.now().toString().slice(-4)}`;
        
        // Poblar todos los campos con datos de la operación
        setFormData(prev => ({
          ...prev,
          codigo,
          lugar_faena: operacion.sitios?.nombre || '',
          empresa_nombre: operacion.contratistas?.nombre || '',
          supervisor_servicio_nombre: supervisor?.nombre_completo || '',
          buzo_o_empresa_nombre: operacion.contratistas?.nombre || '',
          buzo_matricula: buzoPrincipal?.matricula || '',
          supervisor: supervisor?.nombre_completo || '',
          jefe_centro_nombre: operacion.sitios?.nombre || '',
          bitacora_relator: supervisor?.nombre_completo || '',
          anexo_bravo_trabajadores: miembros.map((miembro, index) => ({
            id: miembro.id,
            orden: index + 1,
            nombre: miembro.nombre_completo,
            rut: miembro.rut || '',
            cargo: miembro.rol,
            empresa: operacion.contratistas?.nombre || '',
          }))
        }));

        console.log('Operation data loaded:', {
          operacion,
          equipo,
          miembros,
          supervisor,
          buzoPrincipal
        });

      } catch (error) {
        console.error('Error loading operation data:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de la operación",
          variant: "destructive",
        });
      }
    };

    loadOperationData();
  }, [operacionId, equipos, toast]);

  const handleFileUpload = async (file: File) => {
    try {
      setIsLoading(true);
      
      // Crear nombre único para el archivo
      const fileName = `anexo-bravo/${operacionId}/${Date.now()}-${file.name}`;
      
      // Subir archivo a Supabase Storage (necesitaríamos crear el bucket primero)
      const { data, error } = await supabase.storage
        .from('documents')
        .upload(fileName, file);

      if (error) throw error;

      // Obtener URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('documents')
        .getPublicUrl(fileName);

      setUploadedFile(file);
      setUploadedFileUrl(publicUrl);
      
      toast({
        title: "Archivo subido",
        description: "El documento se ha subido correctamente",
      });
    } catch (error) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: "No se pudo subir el archivo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileUpload(file);
    }
  };

  const removeFile = () => {
    setUploadedFile(null);
    setUploadedFileUrl('');
  };

  const handleAsistenteChange = (value: string) => {
    setSelectedAsistente(value);
    const miembro = teamMembers.find(m => m.id === value);
    if (miembro) {
      setFormData(prev => ({
        ...prev,
        asistente_buzo_nombre: miembro.nombre_completo,
        asistente_buzo_matricula: miembro.matricula || ''
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const submitData = {
        ...formData,
        autorizacion_armada_documento: uploadedFileUrl,
      };

      await onSubmit(submitData);
      
      toast({
        title: "Anexo Bravo creado",
        description: "El Anexo Bravo ha sido creado como borrador exitosamente",
      });
    } catch (error) {
      console.error('Error creating anexo bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el Anexo Bravo",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="ios-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Crear Anexo Bravo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Información General */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => handleChange('codigo', e.target.value)}
                  className="ios-input"
                  readOnly
                />
              </div>
              
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => handleChange('fecha', e.target.value)}
                  className="ios-input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="lugar_faena">Centro de Trabajo</Label>
                <Input
                  id="lugar_faena"
                  value={formData.lugar_faena}
                  onChange={(e) => handleChange('lugar_faena', e.target.value)}
                  className="ios-input"
                  readOnly
                />
              </div>
              
              <div>
                <Label htmlFor="empresa_nombre">Empresa Contratista</Label>
                <Input
                  id="empresa_nombre"
                  value={formData.empresa_nombre}
                  onChange={(e) => handleChange('empresa_nombre', e.target.value)}
                  className="ios-input"
                  readOnly
                />
              </div>
            </div>

            {/* Supervisores */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supervisor_servicio_nombre">Supervisor de Servicio</Label>
                <Input
                  id="supervisor_servicio_nombre"
                  value={formData.supervisor_servicio_nombre}
                  onChange={(e) => handleChange('supervisor_servicio_nombre', e.target.value)}
                  className="ios-input"
                />
              </div>
              
              <div>
                <Label htmlFor="supervisor_mandante_nombre">Supervisor Mandante</Label>
                <Input
                  id="supervisor_mandante_nombre"
                  value={formData.supervisor_mandante_nombre}
                  onChange={(e) => handleChange('supervisor_mandante_nombre', e.target.value)}
                  className="ios-input"
                />
              </div>
            </div>

            {/* Información del Buzo */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buzo_matricula">Matrícula del Buzo</Label>
                <Input
                  id="buzo_matricula"
                  value={formData.buzo_matricula}
                  onChange={(e) => handleChange('buzo_matricula', e.target.value)}
                  className="ios-input"
                />
              </div>
              
              <div>
                <Label htmlFor="asistente_buzo">Asistente de Buzo</Label>
                <Select value={selectedAsistente} onValueChange={handleAsistenteChange}>
                  <SelectTrigger className="ios-input">
                    <SelectValue placeholder="Seleccionar asistente" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.filter(m => m.rol !== 'supervisor').map((miembro) => (
                      <SelectItem key={miembro.id} value={miembro.id}>
                        {miembro.nombre_completo} - {miembro.rol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Autorización Marítima */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="autorizacion_armada"
                  checked={formData.autorizacion_armada}
                  onCheckedChange={(checked) => handleChange('autorizacion_armada', checked)}
                />
                <Label htmlFor="autorizacion_armada">
                  Autorización de la Autoridad Marítima (adjuntar copia)
                </Label>
              </div>

              {formData.autorizacion_armada && (
                <div className="space-y-2">
                  <Label>Documento de Autorización</Label>
                  <div
                    className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer hover:border-blue-400 transition-colors"
                    onDrop={handleFileDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => document.getElementById('file-upload')?.click()}
                  >
                    {uploadedFile ? (
                      <div className="flex items-center justify-center gap-2">
                        <File className="w-8 h-8 text-blue-600" />
                        <div>
                          <p className="font-medium">{uploadedFile.name}</p>
                          <p className="text-sm text-gray-500">
                            {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            removeFile();
                          }}
                        >
                          <X className="w-4 h-4" />
                        </Button>
                      </div>
                    ) : (
                      <div>
                        <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                        <p className="text-lg font-medium text-gray-900">
                          Arrastra el archivo aquí
                        </p>
                        <p className="text-sm text-gray-500">
                          o haz clic para seleccionar
                        </p>
                      </div>
                    )}
                  </div>
                  <input
                    id="file-upload"
                    type="file"
                    className="hidden"
                    accept=".pdf,.jpg,.jpeg,.png"
                    onChange={handleFileSelect}
                  />
                </div>
              )}
            </div>

            {/* Trabajadores */}
            <div className="space-y-4">
              <Label>Trabajadores del Equipo de Buceo</Label>
              <div className="bg-gray-50 rounded-lg p-4">
                {formData.anexo_bravo_trabajadores.map((trabajador, index) => (
                  <div key={index} className="flex items-center justify-between py-2 border-b border-gray-200 last:border-b-0">
                    <div>
                      <p className="font-medium">{trabajador.nombre}</p>
                      <p className="text-sm text-gray-600">{trabajador.cargo} - {trabajador.empresa}</p>
                    </div>
                    <div className="text-sm text-gray-500">
                      RUT: {trabajador.rut}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Observaciones */}
            <div>
              <Label htmlFor="observaciones_generales">Observaciones Generales</Label>
              <Textarea
                id="observaciones_generales"
                value={formData.observaciones_generales}
                onChange={(e) => handleChange('observaciones_generales', e.target.value)}
                className="ios-input min-h-[100px]"
                placeholder="Ingrese observaciones generales..."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="ios-button"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading}
                className="ios-button bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Creando...' : 'Crear Borrador'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
