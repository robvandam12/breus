
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Trash2, User } from "lucide-react";
import { BitacoraSupervisorData } from "../BitacoraWizard";

interface BitacoraStep2Props {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
}

export const BitacoraStep2 = ({ data, onUpdate }: BitacoraStep2Props) => {
  const registrosInmersion = data.registros_inmersion || [];

  const addRegistroInmersion = () => {
    const newRegistros = [
      ...registrosInmersion,
      {
        buzo_nombre: '',
        profundidad_maxima: 0,
        hora_dejo_superficie: '',
        hora_llego_superficie: '',
        tiempo_descenso: '',
        tiempo_en_fondo: '',
        tiempo_ascenso: '',
        tabulacion_usada: '',
        tiempo_usado: ''
      }
    ];
    onUpdate({ registros_inmersion: newRegistros });
  };

  const removeRegistroInmersion = (index: number) => {
    const newRegistros = registrosInmersion.filter((_, i) => i !== index);
    onUpdate({ registros_inmersion: newRegistros });
  };

  const updateRegistroInmersion = (index: number, field: string, value: any) => {
    const newRegistros = [...registrosInmersion];
    newRegistros[index] = { ...newRegistros[index], [field]: value };
    onUpdate({ registros_inmersion: newRegistros });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Registro de Inmersión</h2>
        <p className="mt-2 text-gray-600">
          Registro detallado por cada buzo del equipo de buceo
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Registros de Inmersión por Buzo
            </CardTitle>
            <Button onClick={addRegistroInmersion} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Agregar Buzo
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {registrosInmersion.length === 0 ? (
            <div className="text-center py-8">
              <User className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No hay registros de inmersión</p>
              <Button onClick={addRegistroInmersion} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Agregar Primer Registro
              </Button>
            </div>
          ) : (
            <Tabs defaultValue="0" className="w-full">
              <TabsList className="grid w-full grid-cols-auto">
                {registrosInmersion.map((_, index) => (
                  <TabsTrigger key={index} value={index.toString()}>
                    Buzo {index + 1}
                  </TabsTrigger>
                ))}
              </TabsList>
              
              {registrosInmersion.map((registro, index) => (
                <TabsContent key={index} value={index.toString()}>
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="text-lg">Registro Buzo {index + 1}</CardTitle>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeRegistroInmersion(index)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <Label htmlFor={`buzo_nombre_${index}`}>Nombre del Buzo</Label>
                        <Input
                          id={`buzo_nombre_${index}`}
                          value={registro.buzo_nombre}
                          onChange={(e) => updateRegistroInmersion(index, 'buzo_nombre', e.target.value)}
                          placeholder="Nombre completo del buzo"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`profundidad_${index}`}>Profundidad Máxima (mts)</Label>
                        <Input
                          id={`profundidad_${index}`}
                          type="number"
                          min="0"
                          step="0.1"
                          value={registro.profundidad_maxima}
                          onChange={(e) => updateRegistroInmersion(index, 'profundidad_maxima', parseFloat(e.target.value) || 0)}
                          placeholder="0.0"
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`hora_dejo_${index}`}>Hora Dejó Superficie</Label>
                          <Input
                            id={`hora_dejo_${index}`}
                            type="time"
                            value={registro.hora_dejo_superficie}
                            onChange={(e) => updateRegistroInmersion(index, 'hora_dejo_superficie', e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`hora_llego_${index}`}>Hora Llegó Superficie</Label>
                          <Input
                            id={`hora_llego_${index}`}
                            type="time"
                            value={registro.hora_llego_superficie}
                            onChange={(e) => updateRegistroInmersion(index, 'hora_llego_superficie', e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <Label htmlFor={`tiempo_descenso_${index}`}>Tiempo de Descenso</Label>
                          <Input
                            id={`tiempo_descenso_${index}`}
                            value={registro.tiempo_descenso}
                            onChange={(e) => updateRegistroInmersion(index, 'tiempo_descenso', e.target.value)}
                            placeholder="ej: 5 min"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`tiempo_fondo_${index}`}>Tiempo en Fondo</Label>
                          <Input
                            id={`tiempo_fondo_${index}`}
                            value={registro.tiempo_en_fondo}
                            onChange={(e) => updateRegistroInmersion(index, 'tiempo_en_fondo', e.target.value)}
                            placeholder="ej: 30 min"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`tiempo_ascenso_${index}`}>Tiempo de Ascenso</Label>
                          <Input
                            id={`tiempo_ascenso_${index}`}
                            value={registro.tiempo_ascenso}
                            onChange={(e) => updateRegistroInmersion(index, 'tiempo_ascenso', e.target.value)}
                            placeholder="ej: 10 min"
                          />
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`tabulacion_${index}`}>Tabulación Usada</Label>
                          <Input
                            id={`tabulacion_${index}`}
                            value={registro.tabulacion_usada}
                            onChange={(e) => updateRegistroInmersion(index, 'tabulacion_usada', e.target.value)}
                            placeholder="ej: PADI RDP"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`tiempo_usado_${index}`}>Tiempo Usado</Label>
                          <Input
                            id={`tiempo_usado_${index}`}
                            value={registro.tiempo_usado}
                            onChange={(e) => updateRegistroInmersion(index, 'tiempo_usado', e.target.value)}
                            placeholder="ej: 45 min total"
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              ))}
            </Tabs>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
