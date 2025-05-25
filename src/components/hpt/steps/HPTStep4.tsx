
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Clock, User, Phone } from "lucide-react";

interface HPTStep4Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep4 = ({ data, onUpdate }: HPTStep4Props) => {
  const handleConocimientoChange = (field: string, value: any) => {
    const currentConocimiento = data.hpt_conocimiento || {};
    onUpdate({
      hpt_conocimiento: {
        ...currentConocimiento,
        [field]: value
      }
    });
  };

  const handleAsistenteChange = (index: number, field: string, value: string) => {
    const currentAsistentes = data.hpt_conocimiento_asistentes || [];
    const updatedAsistentes = [...currentAsistentes];
    
    if (!updatedAsistentes[index]) {
      updatedAsistentes[index] = {};
    }
    
    updatedAsistentes[index] = {
      ...updatedAsistentes[index],
      [field]: value
    };
    
    onUpdate({
      hpt_conocimiento_asistentes: updatedAsistentes
    });
  };

  const addAsistente = () => {
    const currentAsistentes = data.hpt_conocimiento_asistentes || [];
    onUpdate({
      hpt_conocimiento_asistentes: [
        ...currentAsistentes,
        { nombre: '', rut: '', empresa: '', firma_url: '' }
      ]
    });
  };

  const removeAsistente = (index: number) => {
    const currentAsistentes = data.hpt_conocimiento_asistentes || [];
    const updatedAsistentes = currentAsistentes.filter((_: any, i: number) => i !== index);
    onUpdate({
      hpt_conocimiento_asistentes: updatedAsistentes
    });
  };

  const asistentes = data.hpt_conocimiento_asistentes || [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Registro de Toma de Conocimiento (Difusión)</h2>
        <p className="mt-2 text-gray-600">
          Documentación de la sesión de difusión y participantes
        </p>
      </div>

      {/* Información de la Difusión */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Información de la Difusión
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="difusion_nombre">Nombre de la Difusión</Label>
              <Input
                id="difusion_nombre"
                value={data.hpt_conocimiento?.difusion_nombre || ''}
                onChange={(e) => handleConocimientoChange('difusion_nombre', e.target.value)}
                placeholder="Ej: Charla de Seguridad Operación Buceo"
              />
            </div>

            <div>
              <Label htmlFor="fecha_difusion">Fecha</Label>
              <Input
                id="fecha_difusion"
                type="date"
                value={data.hpt_conocimiento?.fecha || ''}
                onChange={(e) => handleConocimientoChange('fecha', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="hora_difusion">Hora</Label>
              <Input
                id="hora_difusion"
                type="time"
                value={data.hpt_conocimiento?.hora || ''}
                onChange={(e) => handleConocimientoChange('hora', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="duracion_difusion">Duración (minutos)</Label>
              <Input
                id="duracion_difusion"
                type="number"
                value={data.hpt_conocimiento?.duracion || ''}
                onChange={(e) => handleConocimientoChange('duracion', parseInt(e.target.value))}
                placeholder="Ej: 30"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Información del Relator */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-green-600" />
            Información del Relator
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="relator_nombre">Nombre del Relator</Label>
              <Input
                id="relator_nombre"
                value={data.hpt_conocimiento?.relator_nombre || ''}
                onChange={(e) => handleConocimientoChange('relator_nombre', e.target.value)}
                placeholder="Nombre completo del relator"
              />
            </div>

            <div>
              <Label htmlFor="relator_cargo">Cargo del Relator</Label>
              <Input
                id="relator_cargo"
                value={data.hpt_conocimiento?.relator_cargo || ''}
                onChange={(e) => handleConocimientoChange('relator_cargo', e.target.value)}
                placeholder="Cargo o posición del relator"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de Asistentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-purple-600" />
            Lista de Asistentes
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {asistentes.map((asistente: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Asistente #{index + 1}</h4>
                <button
                  onClick={() => removeAsistente(index)}
                  className="text-red-600 hover:text-red-800 text-sm"
                >
                  Eliminar
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor={`asistente_nombre_${index}`}>Nombre</Label>
                  <Input
                    id={`asistente_nombre_${index}`}
                    value={asistente.nombre || ''}
                    onChange={(e) => handleAsistenteChange(index, 'nombre', e.target.value)}
                    placeholder="Nombre completo"
                  />
                </div>

                <div>
                  <Label htmlFor={`asistente_rut_${index}`}>RUT</Label>
                  <Input
                    id={`asistente_rut_${index}`}
                    value={asistente.rut || ''}
                    onChange={(e) => handleAsistenteChange(index, 'rut', e.target.value)}
                    placeholder="12.345.678-9"
                  />
                </div>

                <div>
                  <Label htmlFor={`asistente_empresa_${index}`}>Empresa</Label>
                  <Input
                    id={`asistente_empresa_${index}`}
                    value={asistente.empresa || ''}
                    onChange={(e) => handleAsistenteChange(index, 'empresa', e.target.value)}
                    placeholder="Nombre de la empresa"
                  />
                </div>
              </div>
            </div>
          ))}

          <button
            onClick={addAsistente}
            className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-blue-400 hover:text-blue-600 transition-colors"
          >
            + Agregar Asistente
          </button>

          {asistentes.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay asistentes registrados</p>
              <p className="text-sm">Agregue al menos un asistente para continuar</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <strong>Importante:</strong> Es obligatorio registrar al menos un asistente en la sesión de difusión. 
            Todos los participantes deben estar informados sobre los riesgos y medidas de control antes de iniciar la tarea.
          </div>
        </div>
      </div>
    </div>
  );
};
