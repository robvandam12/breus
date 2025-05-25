
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Users, Plus, X } from "lucide-react";

interface AnexoBravoStep4Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const AnexoBravoStep4 = ({ data, onUpdate }: AnexoBravoStep4Props) => {
  const handleInputChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const handleTrabajadorChange = (index: number, field: string, value: string) => {
    const currentTrabajadores = data.anexo_bravo_trabajadores || [];
    const updatedTrabajadores = [...currentTrabajadores];
    
    if (!updatedTrabajadores[index]) {
      updatedTrabajadores[index] = {};
    }
    
    updatedTrabajadores[index] = {
      ...updatedTrabajadores[index],
      [field]: value
    };
    
    onUpdate({
      anexo_bravo_trabajadores: updatedTrabajadores
    });
  };

  const addTrabajador = () => {
    const currentTrabajadores = data.anexo_bravo_trabajadores || [];
    onUpdate({
      anexo_bravo_trabajadores: [
        ...currentTrabajadores,
        { nombre: '', rut: '' }
      ]
    });
  };

  const removeTrabajador = (index: number) => {
    const currentTrabajadores = data.anexo_bravo_trabajadores || [];
    const updatedTrabajadores = currentTrabajadores.filter((_: any, i: number) => i !== index);
    onUpdate({
      anexo_bravo_trabajadores: updatedTrabajadores
    });
  };

  const trabajadores = data.anexo_bravo_trabajadores || [];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Bitácora de Buceo y Trabajadores Participantes</h2>
        <p className="mt-2 text-gray-600">
          Registro de horarios y personal involucrado en la operación
        </p>
      </div>

      {/* Bitácora de Buceo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            Bitácora de Buceo (Referencia Horaria)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="hora_inicio">Hora de Inicio</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={data.bitacora_hora_inicio || ''}
                onChange={(e) => handleInputChange('bitacora_hora_inicio', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="hora_termino">Hora de Término</Label>
              <Input
                id="hora_termino"
                type="time"
                value={data.bitacora_hora_termino || ''}
                onChange={(e) => handleInputChange('bitacora_hora_termino', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="fecha_bitacora">Fecha</Label>
              <Input
                id="fecha_bitacora"
                type="date"
                value={data.bitacora_fecha || ''}
                onChange={(e) => handleInputChange('bitacora_fecha', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="relator">Relator</Label>
            <Input
              id="relator"
              value={data.bitacora_relator || ''}
              onChange={(e) => handleInputChange('bitacora_relator', e.target.value)}
              placeholder="Nombre del relator responsable"
            />
          </div>
        </CardContent>
      </Card>

      {/* Trabajadores Participantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Trabajadores Participantes (Máximo 6)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trabajadores.map((trabajador: any, index: number) => (
            <div key={index} className="border rounded-lg p-4 bg-gray-50">
              <div className="flex justify-between items-center mb-4">
                <h4 className="font-medium">Trabajador #{index + 1}</h4>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => removeTrabajador(index)}
                  className="text-red-600 hover:text-red-800"
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor={`trabajador_nombre_${index}`}>Nombre</Label>
                  <Input
                    id={`trabajador_nombre_${index}`}
                    value={trabajador.nombre || ''}
                    onChange={(e) => handleTrabajadorChange(index, 'nombre', e.target.value)}
                    placeholder="Nombre completo"
                  />
                </div>

                <div>
                  <Label htmlFor={`trabajador_rut_${index}`}>RUT</Label>
                  <Input
                    id={`trabajador_rut_${index}`}
                    value={trabajador.rut || ''}
                    onChange={(e) => handleTrabajadorChange(index, 'rut', e.target.value)}
                    placeholder="12.345.678-9"
                  />
                </div>
              </div>
            </div>
          ))}

          {trabajadores.length < 6 && (
            <Button
              onClick={addTrabajador}
              variant="outline"
              className="w-full border-2 border-dashed"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Trabajador
            </Button>
          )}

          {trabajadores.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay trabajadores registrados</p>
              <p className="text-sm">Agregue al menos un trabajador participante</p>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Clock className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <strong>Importante:</strong> Registre con precisión los horarios de la operación y asegúrese 
            de que todos los trabajadores participantes estén debidamente identificados con nombre completo y RUT.
          </div>
        </div>
      </div>
    </div>
  );
};
