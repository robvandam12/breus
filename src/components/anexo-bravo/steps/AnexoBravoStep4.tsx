
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Clock, Users, Plus, Trash2, Calendar } from "lucide-react";

interface AnexoBravoStep4Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const AnexoBravoStep4 = ({ data, onUpdate }: AnexoBravoStep4Props) => {
  const trabajadores = data.anexo_bravo_trabajadores || [];

  const handleInputChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const addTrabajador = () => {
    const newTrabajadores = [
      ...trabajadores,
      { nombre: '', rut: '' }
    ];
    onUpdate({ anexo_bravo_trabajadores: newTrabajadores });
  };

  const removeTrabajador = (index: number) => {
    const newTrabajadores = trabajadores.filter((_: any, i: number) => i !== index);
    onUpdate({ anexo_bravo_trabajadores: newTrabajadores });
  };

  const updateTrabajador = (index: number, field: string, value: string) => {
    const newTrabajadores = [...trabajadores];
    newTrabajadores[index] = {
      ...newTrabajadores[index],
      [field]: value
    };
    onUpdate({ anexo_bravo_trabajadores: newTrabajadores });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Bitácora de Buceo y Participantes</h2>
        <p className="mt-2 text-gray-600">
          Registro horario y listado de trabajadores participantes
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
              <Label htmlFor="bitacora_fecha">Fecha</Label>
              <Input
                id="bitacora_fecha"
                type="date"
                value={data.bitacora_fecha || ''}
                onChange={(e) => handleInputChange('bitacora_fecha', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="bitacora_hora_inicio">Hora de Inicio</Label>
              <Input
                id="bitacora_hora_inicio"
                type="time"
                value={data.bitacora_hora_inicio || ''}
                onChange={(e) => handleInputChange('bitacora_hora_inicio', e.target.value)}
              />
            </div>

            <div>
              <Label htmlFor="bitacora_hora_termino">Hora de Término</Label>
              <Input
                id="bitacora_hora_termino"
                type="time"
                value={data.bitacora_hora_termino || ''}
                onChange={(e) => handleInputChange('bitacora_hora_termino', e.target.value)}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="bitacora_relator">Relator</Label>
            <Input
              id="bitacora_relator"
              value={data.bitacora_relator || ''}
              onChange={(e) => handleInputChange('bitacora_relator', e.target.value)}
              placeholder="Nombre del relator de la bitácora"
            />
          </div>
        </CardContent>
      </Card>

      {/* Trabajadores Participantes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-green-600" />
            Trabajadores Participantes
            <span className="text-sm font-normal text-gray-500">
              (Máximo 6 participantes)
            </span>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {trabajadores.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No hay trabajadores registrados</p>
              <Button onClick={addTrabajador} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Agregar Primer Trabajador
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {trabajadores.map((trabajador: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">
                        Trabajador {index + 1}
                      </h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeTrabajador(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`nombre-${index}`}>Nombre Completo</Label>
                        <Input
                          id={`nombre-${index}`}
                          value={trabajador.nombre || ''}
                          onChange={(e) => updateTrabajador(index, 'nombre', e.target.value)}
                          placeholder="Nombre y apellidos"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`rut-${index}`}>RUT</Label>
                        <Input
                          id={`rut-${index}`}
                          value={trabajador.rut || ''}
                          onChange={(e) => updateTrabajador(index, 'rut', e.target.value)}
                          placeholder="12.345.678-9"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {trabajadores.length < 6 && (
                <Button 
                  onClick={addTrabajador} 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Trabajador ({trabajadores.length}/6)
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Calendar className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <strong>Nota:</strong> La bitácora de buceo debe registrar los horarios exactos de 
            inicio y término de las operaciones. Todos los trabajadores participantes deben 
            estar debidamente identificados con nombre completo y RUT.
          </div>
        </div>
      </div>
    </div>
  );
};
