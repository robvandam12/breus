
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Diving, Target, Plus, Trash2 } from "lucide-react";
import { BitacoraSupervisorData } from '../BitacoraWizardFromInmersion';

interface BitacoraStep5DatosBuzosProps {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
}

export const BitacoraStep5DatosBuzos = ({ data, onUpdate }: BitacoraStep5DatosBuzosProps) => {
  const generarRegistrosDiving = () => {
    const registros = (data.inmersiones_buzos || []).map(buzo => ({
      buzo_nombre: `${buzo.nombre} ${buzo.apellido}`.trim(),
      profundidad_maxima: buzo.profundidad_trabajo || 0,
      tiempo_fondo: buzo.tiempo_inmersion || 0,
      tiempo_descompresion: 0,
      equipos_usados: [],
      observaciones: ''
    }));
    
    onUpdate({ diving_records: registros });
  };

  const actualizarRegistro = (index: number, campo: string, valor: any) => {
    const registrosActualizados = [...(data.diving_records || [])];
    registrosActualizados[index] = {
      ...registrosActualizados[index],
      [campo]: valor
    };
    onUpdate({ diving_records: registrosActualizados });
  };

  const agregarEquipoUsado = (index: number, equipo: string) => {
    if (!equipo.trim()) return;
    
    const registrosActualizados = [...(data.diving_records || [])];
    const equiposActuales = registrosActualizados[index].equipos_usados || [];
    registrosActualizados[index] = {
      ...registrosActualizados[index],
      equipos_usados: [...equiposActuales, equipo]
    };
    onUpdate({ diving_records: registrosActualizados });
  };

  const eliminarEquipoUsado = (registroIndex: number, equipoIndex: number) => {
    const registrosActualizados = [...(data.diving_records || [])];
    const equiposActualizados = registrosActualizados[registroIndex].equipos_usados.filter((_, i) => i !== equipoIndex);
    registrosActualizados[registroIndex] = {
      ...registrosActualizados[registroIndex],
      equipos_usados: equiposActualizados
    };
    onUpdate({ diving_records: registrosActualizados });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Datos Detallados del Buceo</h2>
        <p className="mt-2 text-gray-600">
          Información específica de cada buzo participante
        </p>
      </div>

      {(data.inmersiones_buzos || []).length === 0 ? (
        <Card>
          <CardContent className="p-6 text-center">
            <Target className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">
              No hay buzos registrados. Regrese al paso 2 para agregar buzos.
            </p>
          </CardContent>
        </Card>
      ) : (
        <>
          {/* Botón para generar registros automáticamente */}
          {(!data.diving_records || data.diving_records.length === 0) && (
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">Auto-generar registros de buceo</p>
                    <p className="text-sm text-gray-600">
                      Crear registros automáticamente basados en los buzos del paso 2
                    </p>
                  </div>
                  <Button onClick={generarRegistrosDiving}>
                    <Plus className="w-4 h-4 mr-2" />
                    Generar Registros
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Registros de Diving */}
          {(data.diving_records || []).map((registro, index) => (
            <Card key={index}>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Diving className="w-5 h-5 text-blue-600" />
                  Registro de Buceo - {registro.buzo_nombre}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label>Profundidad Máxima (m)</Label>
                    <Input
                      type="number"
                      value={registro.profundidad_maxima}
                      onChange={(e) => actualizarRegistro(index, 'profundidad_maxima', Number(e.target.value))}
                      placeholder="Profundidad en metros"
                    />
                  </div>
                  <div>
                    <Label>Tiempo de Fondo (min)</Label>
                    <Input
                      type="number"
                      value={registro.tiempo_fondo}
                      onChange={(e) => actualizarRegistro(index, 'tiempo_fondo', Number(e.target.value))}
                      placeholder="Tiempo en minutos"
                    />
                  </div>
                  <div>
                    <Label>Tiempo de Descompresión (min)</Label>
                    <Input
                      type="number"
                      value={registro.tiempo_descompresion}
                      onChange={(e) => actualizarRegistro(index, 'tiempo_descompresion', Number(e.target.value))}
                      placeholder="Tiempo en minutos"
                    />
                  </div>
                </div>

                {/* Equipos Usados */}
                <div>
                  <Label>Equipos Utilizados</Label>
                  <div className="flex flex-wrap gap-2 mb-2">
                    {registro.equipos_usados.map((equipo, equipoIndex) => (
                      <Badge key={equipoIndex} variant="secondary" className="flex items-center gap-1">
                        {equipo}
                        <Button
                          variant="ghost"
                          size="sm"
                          className="h-4 w-4 p-0 hover:bg-red-100"
                          onClick={() => eliminarEquipoUsado(index, equipoIndex)}
                        >
                          <Trash2 className="w-3 h-3" />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2">
                    <Input
                      placeholder="Agregar equipo utilizado"
                      onKeyPress={(e) => {
                        if (e.key === 'Enter') {
                          const target = e.target as HTMLInputElement;
                          agregarEquipoUsado(index, target.value);
                          target.value = '';
                        }
                      }}
                    />
                    <Button
                      variant="outline"
                      onClick={(e) => {
                        const input = e.currentTarget.previousElementSibling as HTMLInputElement;
                        if (input) {
                          agregarEquipoUsado(index, input.value);
                          input.value = '';
                        }
                      }}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div>
                  <Label>Observaciones del Buceo</Label>
                  <Textarea
                    value={registro.observaciones || ''}
                    onChange={(e) => actualizarRegistro(index, 'observaciones', e.target.value)}
                    placeholder="Observaciones específicas de este buzo..."
                    className="min-h-[80px]"
                  />
                </div>
              </CardContent>
            </Card>
          ))}
        </>
      )}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Target className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-sm text-green-800">
            <strong>Información:</strong> Esta sección unifica los datos del paso 2 con información 
            detallada del buceo. Los datos se auto-pueblan desde el paso 2 y puede completar los 
            detalles específicos de cada inmersión.
          </div>
        </div>
      </div>
    </div>
  );
};
