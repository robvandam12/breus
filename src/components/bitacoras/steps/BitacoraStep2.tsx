
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Users, Plus, Trash2 } from "lucide-react";
import { BitacoraSupervisorData } from "../BitacoraWizard";

interface BuzoInmersion {
  id: string;
  nombre: string;
  profundidad_maxima: number;
  hora_dejo_superficie: string;
  hora_llego_superficie: string;
  tiempo_descenso: number;
  tiempo_fondo: number;
  tiempo_ascenso: number;
  tabulacion_usada: string;
  tiempo_usado: number;
}

interface BitacoraStep2Props {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
}

export const BitacoraStep2 = ({ data, onUpdate }: BitacoraStep2Props) => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [inmersionesBuzos, setInmersionesBuzos] = useState<BuzoInmersion[]>(() => {
    // Inicializar con los buzos del equipo si existen
    return data.bs_personal?.map((buzo, index) => ({
      id: `buzo-${index}`,
      nombre: buzo.nombre,
      profundidad_maxima: 0,
      hora_dejo_superficie: '',
      hora_llego_superficie: '',
      tiempo_descenso: 0,
      tiempo_fondo: 0,
      tiempo_ascenso: 0,
      tabulacion_usada: '',
      tiempo_usado: 0
    })) || [];
  });

  const agregarBuzo = () => {
    const nuevoBuzo: BuzoInmersion = {
      id: `buzo-${Date.now()}`,
      nombre: '',
      profundidad_maxima: 0,
      hora_dejo_superficie: '',
      hora_llego_superficie: '',
      tiempo_descenso: 0,
      tiempo_fondo: 0,
      tiempo_ascenso: 0,
      tabulacion_usada: '',
      tiempo_usado: 0
    };
    
    const nuevasInmersiones = [...inmersionesBuzos, nuevoBuzo];
    setInmersionesBuzos(nuevasInmersiones);
    setActiveTab(nuevoBuzo.id);
    
    // Actualizar el estado principal
    onUpdate({ inmersiones_buzos: nuevasInmersiones });
  };

  const eliminarBuzo = (buzoId: string) => {
    const nuevasInmersiones = inmersionesBuzos.filter(buzo => buzo.id !== buzoId);
    setInmersionesBuzos(nuevasInmersiones);
    
    // Si eliminamos el tab activo, cambiar a otro
    if (activeTab === buzoId && nuevasInmersiones.length > 0) {
      setActiveTab(nuevasInmersiones[0].id);
    }
    
    onUpdate({ inmersiones_buzos: nuevasInmersiones });
  };

  const actualizarBuzo = (buzoId: string, campo: keyof BuzoInmersion, valor: any) => {
    const nuevasInmersiones = inmersionesBuzos.map(buzo => 
      buzo.id === buzoId ? { ...buzo, [campo]: valor } : buzo
    );
    setInmersionesBuzos(nuevasInmersiones);
    onUpdate({ inmersiones_buzos: nuevasInmersiones });
  };

  // Si no hay ningún buzo y no hay tab activo, crear el primer buzo
  if (inmersionesBuzos.length === 0) {
    agregarBuzo();
  }

  // Si hay buzos pero no hay tab activo, seleccionar el primero
  if (inmersionesBuzos.length > 0 && !activeTab) {
    setActiveTab(inmersionesBuzos[0].id);
  }

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Registro de Inmersión</h2>
        <p className="mt-2 text-gray-600">
          Registro individual por cada buzo del equipo
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Inmersiones por Buzo
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="secondary">
                {inmersionesBuzos.length} {inmersionesBuzos.length === 1 ? 'Buzo' : 'Buzos'}
              </Badge>
              <Button
                onClick={agregarBuzo}
                size="sm"
                className="flex items-center gap-2"
              >
                <Plus className="w-4 h-4" />
                Agregar Buzo
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {inmersionesBuzos.length > 0 ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-auto">
                {inmersionesBuzos.map((buzo, index) => (
                  <TabsTrigger key={buzo.id} value={buzo.id} className="relative">
                    <div className="flex items-center gap-2">
                      <span>{buzo.nombre || `Buzo ${index + 1}`}</span>
                      {inmersionesBuzos.length > 1 && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            eliminarBuzo(buzo.id);
                          }}
                          className="h-4 w-4 p-0 text-red-500 hover:text-red-700"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              {inmersionesBuzos.map((buzo) => (
                <TabsContent key={buzo.id} value={buzo.id} className="mt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`nombre-${buzo.id}`}>Nombre del Buzo</Label>
                      <Input
                        id={`nombre-${buzo.id}`}
                        value={buzo.nombre}
                        onChange={(e) => actualizarBuzo(buzo.id, 'nombre', e.target.value)}
                        placeholder="Nombre completo del buzo"
                      />
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`profundidad-${buzo.id}`}>Profundidad Máxima (metros)</Label>
                        <Input
                          id={`profundidad-${buzo.id}`}
                          type="number"
                          value={buzo.profundidad_maxima}
                          onChange={(e) => actualizarBuzo(buzo.id, 'profundidad_maxima', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`hora-salida-${buzo.id}`}>Hora Dejó Superficie</Label>
                        <Input
                          id={`hora-salida-${buzo.id}`}
                          type="time"
                          value={buzo.hora_dejo_superficie}
                          onChange={(e) => actualizarBuzo(buzo.id, 'hora_dejo_superficie', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`hora-llegada-${buzo.id}`}>Hora Llegó Superficie</Label>
                        <Input
                          id={`hora-llegada-${buzo.id}`}
                          type="time"
                          value={buzo.hora_llego_superficie}
                          onChange={(e) => actualizarBuzo(buzo.id, 'hora_llego_superficie', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`tiempo-descenso-${buzo.id}`}>Tiempo de Descenso (min)</Label>
                        <Input
                          id={`tiempo-descenso-${buzo.id}`}
                          type="number"
                          value={buzo.tiempo_descenso}
                          onChange={(e) => actualizarBuzo(buzo.id, 'tiempo_descenso', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`tiempo-fondo-${buzo.id}`}>Tiempo en Fondo (min)</Label>
                        <Input
                          id={`tiempo-fondo-${buzo.id}`}
                          type="number"
                          value={buzo.tiempo_fondo}
                          onChange={(e) => actualizarBuzo(buzo.id, 'tiempo_fondo', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`tiempo-ascenso-${buzo.id}`}>Tiempo de Ascenso (min)</Label>
                        <Input
                          id={`tiempo-ascenso-${buzo.id}`}
                          type="number"
                          value={buzo.tiempo_ascenso}
                          onChange={(e) => actualizarBuzo(buzo.id, 'tiempo_ascenso', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`tabulacion-${buzo.id}`}>Tabulación Usada</Label>
                        <Input
                          id={`tabulacion-${buzo.id}`}
                          value={buzo.tabulacion_usada}
                          onChange={(e) => actualizarBuzo(buzo.id, 'tabulacion_usada', e.target.value)}
                          placeholder="Tipo de tabla de descompresión"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`tiempo-usado-${buzo.id}`}>Tiempo Usado Total (min)</Label>
                        <Input
                          id={`tiempo-usado-${buzo.id}`}
                          type="number"
                          value={buzo.tiempo_usado}
                          onChange={(e) => actualizarBuzo(buzo.id, 'tiempo_usado', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                          className="bg-gray-50"
                          readOnly
                        />
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Resumen:</strong> {buzo.nombre || 'Este buzo'} realizó una inmersión a {buzo.profundidad_maxima} metros
                        {buzo.hora_dejo_superficie && buzo.hora_llego_superficie && 
                          ` desde las ${buzo.hora_dejo_superficie} hasta las ${buzo.hora_llego_superficie}`}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No hay buzos registrados</p>
              <Button onClick={agregarBuzo}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primer Buzo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Users className="w-4 h-4 text-green-600" />
          </div>
          <div className="text-sm text-green-800">
            <strong>Información:</strong> Los buzos provienen del equipo de buceo asignado a la operación. 
            Puede agregar buzos adicionales si es necesario.
          </div>
        </div>
      </div>
    </div>
  );
};
