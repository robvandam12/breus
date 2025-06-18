import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Users, Plus, Trash2, UserPlus, AlertCircle } from "lucide-react";
import { BitacoraSupervisorData } from "../BitacoraWizard";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useEquiposBuceo } from "@/hooks/useEquiposBuceo";
import { useOperaciones } from "@/hooks/useOperaciones";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface BuzoInmersion {
  buzo_id: string;
  buzo_nombre: string;
  profundidad_maxima: number;
  hora_dejo_superficie: string;
  hora_llego_superficie: string;
  tiempo_descenso: number;
  tiempo_fondo: number;
  tiempo_ascenso: number;
  tabulacion_usada: string;
  tiempo_usado: number;
  es_emergencia?: boolean;
}

interface BitacoraStep2Props {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
}

export const BitacoraStep2 = ({ data, onUpdate }: BitacoraStep2Props) => {
  const [activeTab, setActiveTab] = useState<string>('');
  const [inmersionesBuzos, setInmersionesBuzos] = useState<BuzoInmersion[]>([]);
  const { inmersiones } = useInmersiones();
  const { equipos } = useEquiposBuceo();
  const { operaciones } = useOperaciones();

  // Obtener la inmersión actual y su equipo de buceo
  const inmersionActual = inmersiones.find(i => i.inmersion_id === data.inmersion_id);
  const operacionActual = operaciones.find(op => op.id === inmersionActual?.operacion_id);
  const equipoActual = equipos.find(e => e.id === operacionActual?.equipo_buceo_id);

  useEffect(() => {
    // Inicializar con buzos del equipo si no hay datos previos
    if (inmersionesBuzos.length === 0 && equipoActual?.miembros) {
      const buzosIniciales: BuzoInmersion[] = equipoActual.miembros.map((miembro, index) => ({
        buzo_id: miembro.usuario_id || `buzo-${index}`,
        buzo_nombre: miembro.usuario?.nombre ? `${miembro.usuario.nombre} ${miembro.usuario.apellido || ''}` : `Buzo ${index + 1}`,
        profundidad_maxima: 0,
        hora_dejo_superficie: '',
        hora_llego_superficie: '',
        tiempo_descenso: 0,
        tiempo_fondo: 0,
        tiempo_ascenso: 0,
        tabulacion_usada: '',
        tiempo_usado: 0,
        es_emergencia: false
      }));
      setInmersionesBuzos(buzosIniciales);
      if (buzosIniciales.length > 0) {
        setActiveTab(buzosIniciales[0].buzo_id);
      }
      onUpdate({ inmersiones_buzos: buzosIniciales });
    } else if (data.inmersiones_buzos && data.inmersiones_buzos.length > 0) {
      const buzosExistentes = data.inmersiones_buzos.map((buzo, index) => ({
        buzo_id: buzo.buzo_id || `buzo-${index}`,
        buzo_nombre: buzo.buzo_nombre || '',
        profundidad_maxima: buzo.profundidad_maxima || 0,
        hora_dejo_superficie: buzo.hora_dejo_superficie || '',
        hora_llego_superficie: buzo.hora_llego_superficie || '',
        tiempo_descenso: buzo.tiempo_descenso || 0,
        tiempo_fondo: buzo.tiempo_fondo || 0,
        tiempo_ascenso: buzo.tiempo_ascenso || 0,
        tabulacion_usada: buzo.tabulacion_usada || '',
        tiempo_usado: buzo.tiempo_usado || 0,
        es_emergencia: buzo.es_emergencia || false
      }));
      setInmersionesBuzos(buzosExistentes);
      if (!activeTab && buzosExistentes.length > 0) {
        setActiveTab(buzosExistentes[0].buzo_id);
      }
    }
  }, [equipoActual, data.inmersion_id, data.inmersiones_buzos, activeTab]);

  const agregarBuzoEmergencia = () => {
    const nuevoBuzo: BuzoInmersion = {
      buzo_id: `buzo-emergencia-${Date.now()}`,
      buzo_nombre: '',
      profundidad_maxima: 0,
      hora_dejo_superficie: '',
      hora_llego_superficie: '',
      tiempo_descenso: 0,
      tiempo_fondo: 0,
      tiempo_ascenso: 0,
      tabulacion_usada: '',
      tiempo_usado: 0,
      es_emergencia: true
    };
    
    const nuevasInmersiones = [...inmersionesBuzos, nuevoBuzo];
    setInmersionesBuzos(nuevasInmersiones);
    setActiveTab(nuevoBuzo.buzo_id);
    
    onUpdate({ inmersiones_buzos: nuevasInmersiones });
  };

  const eliminarBuzo = (buzoId: string) => {
    const nuevasInmersiones = inmersionesBuzos.filter(buzo => buzo.buzo_id !== buzoId);
    setInmersionesBuzos(nuevasInmersiones);
    
    if (activeTab === buzoId && nuevasInmersiones.length > 0) {
      setActiveTab(nuevasInmersiones[0].buzo_id);
    }
    
    onUpdate({ inmersiones_buzos: nuevasInmersiones });
  };

  const actualizarBuzo = (buzoId: string, campo: keyof BuzoInmersion, valor: any) => {
    const nuevasInmersiones = inmersionesBuzos.map(buzo => 
      buzo.buzo_id === buzoId ? { ...buzo, [campo]: valor } : buzo
    );
    setInmersionesBuzos(nuevasInmersiones);
    onUpdate({ inmersiones_buzos: nuevasInmersiones });
  };

  const calcularTiempoTotal = (buzo: BuzoInmersion) => {
    return buzo.tiempo_descenso + buzo.tiempo_fondo + buzo.tiempo_ascenso;
  };

  useEffect(() => {
    // Auto-calcular tiempo total para cada buzo
    const nuevasInmersiones = inmersionesBuzos.map(buzo => ({
      ...buzo,
      tiempo_usado: calcularTiempoTotal(buzo)
    }));
    if (JSON.stringify(nuevasInmersiones) !== JSON.stringify(inmersionesBuzos)) {
      setInmersionesBuzos(nuevasInmersiones);
      onUpdate({ inmersiones_buzos: nuevasInmersiones });
    }
  }, [inmersionesBuzos.map(b => `${b.tiempo_descenso}-${b.tiempo_fondo}-${b.tiempo_ascenso}`).join(',')]);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Registro de Inmersión</h2>
        <p className="mt-2 text-gray-600">
          Registro individual por cada buzo del equipo
        </p>
      </div>

      <Alert className="border-amber-200 bg-amber-50">
        <AlertCircle className="h-4 w-4" />
        <AlertDescription className="text-amber-800">
          <strong>Nota:</strong> Esta información se basa en los datos de la inmersión y el equipo asignado. 
          Los campos marcados no pueden editarse ya que provienen de registros previos.
        </AlertDescription>
      </Alert>

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
                onClick={agregarBuzoEmergencia}
                size="sm"
                className="flex items-center gap-2"
                variant="outline"
              >
                <UserPlus className="w-4 h-4" />
                Buzo Emergencia
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {inmersionesBuzos.length > 0 ? (
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full" style={{ gridTemplateColumns: `repeat(${inmersionesBuzos.length}, 1fr)` }}>
                {inmersionesBuzos.map((buzo, index) => (
                  <TabsTrigger key={buzo.buzo_id} value={buzo.buzo_id} className="relative">
                    <div className="flex items-center gap-2">
                      <span className="truncate max-w-[120px]">
                        {buzo.buzo_nombre || `Buzo ${index + 1}`}
                        {buzo.es_emergencia && <Badge variant="destructive" className="ml-1 text-xs">EMG</Badge>}
                      </span>
                      {buzo.es_emergencia && (
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            eliminarBuzo(buzo.buzo_id);
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
                <TabsContent key={buzo.buzo_id} value={buzo.buzo_id} className="mt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor={`nombre-${buzo.buzo_id}`}>
                        Nombre del Buzo {buzo.es_emergencia && <Badge variant="destructive" className="ml-2">Emergencia</Badge>}
                      </Label>
                      <Input
                        id={`nombre-${buzo.buzo_id}`}
                        value={buzo.buzo_nombre}
                        onChange={(e) => actualizarBuzo(buzo.buzo_id, 'buzo_nombre', e.target.value)}
                        placeholder="Nombre completo del buzo"
                        disabled={!buzo.es_emergencia}
                        className={!buzo.es_emergencia ? "bg-gray-50" : ""}
                      />
                      {!buzo.es_emergencia && (
                        <p className="text-xs text-gray-500 mt-1">Este nombre proviene del equipo asignado</p>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                      <div>
                        <Label htmlFor={`profundidad-${buzo.buzo_id}`}>Profundidad Máxima (metros)</Label>
                        <Input
                          id={`profundidad-${buzo.buzo_id}`}
                          type="number"
                          value={buzo.profundidad_maxima}
                          onChange={(e) => actualizarBuzo(buzo.buzo_id, 'profundidad_maxima', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`hora-salida-${buzo.buzo_id}`}>Hora Dejó Superficie</Label>
                        <Input
                          id={`hora-salida-${buzo.buzo_id}`}
                          type="time"
                          value={buzo.hora_dejo_superficie}
                          onChange={(e) => actualizarBuzo(buzo.buzo_id, 'hora_dejo_superficie', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`hora-llegada-${buzo.buzo_id}`}>Hora Llegó Superficie</Label>
                        <Input
                          id={`hora-llegada-${buzo.buzo_id}`}
                          type="time"
                          value={buzo.hora_llego_superficie}
                          onChange={(e) => actualizarBuzo(buzo.buzo_id, 'hora_llego_superficie', e.target.value)}
                        />
                      </div>

                      <div>
                        <Label htmlFor={`tiempo-descenso-${buzo.buzo_id}`}>Tiempo de Descenso (min)</Label>
                        <Input
                          id={`tiempo-descenso-${buzo.buzo_id}`}
                          type="number"
                          value={buzo.tiempo_descenso}
                          onChange={(e) => actualizarBuzo(buzo.buzo_id, 'tiempo_descenso', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`tiempo-fondo-${buzo.buzo_id}`}>Tiempo en Fondo (min)</Label>
                        <Input
                          id={`tiempo-fondo-${buzo.buzo_id}`}
                          type="number"
                          value={buzo.tiempo_fondo}
                          onChange={(e) => actualizarBuzo(buzo.buzo_id, 'tiempo_fondo', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`tiempo-ascenso-${buzo.buzo_id}`}>Tiempo de Ascenso (min)</Label>
                        <Input
                          id={`tiempo-ascenso-${buzo.buzo_id}`}
                          type="number"
                          value={buzo.tiempo_ascenso}
                          onChange={(e) => actualizarBuzo(buzo.buzo_id, 'tiempo_ascenso', parseFloat(e.target.value) || 0)}
                          placeholder="0"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`tabulacion-${buzo.buzo_id}`}>Tabulación Usada</Label>
                        <Input
                          id={`tabulacion-${buzo.buzo_id}`}
                          value={buzo.tabulacion_usada}
                          onChange={(e) => actualizarBuzo(buzo.buzo_id, 'tabulacion_usada', e.target.value)}
                          placeholder="Tipo de tabla de descompresión"
                        />
                      </div>

                      <div>
                        <Label htmlFor={`tiempo-usado-${buzo.buzo_id}`}>Tiempo Usado Total (min)</Label>
                        <Input
                          id={`tiempo-usado-${buzo.buzo_id}`}
                          type="number"
                          value={buzo.tiempo_usado}
                          className="bg-gray-50"
                          readOnly
                        />
                        <p className="text-xs text-gray-500 mt-1">Calculado automáticamente</p>
                      </div>
                    </div>

                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                      <p className="text-sm text-blue-800">
                        <strong>Resumen:</strong> {buzo.buzo_nombre || 'Este buzo'} realizó una inmersión a {buzo.profundidad_maxima} metros
                        {buzo.hora_dejo_superficie && buzo.hora_llego_superficie && 
                          ` desde las ${buzo.hora_dejo_superficie} hasta las ${buzo.hora_llego_superficie}`}
                        {buzo.es_emergencia && ' (Buzo de Emergencia)'}
                      </p>
                    </div>
                  </div>
                </TabsContent>
              ))}
            </Tabs>
          ) : (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No hay buzos en el equipo</p>
              <Button onClick={agregarBuzoEmergencia}>
                <UserPlus className="w-4 h-4 mr-2" />
                Agregar Buzo de Emergencia
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
            Los buzos del equipo no se pueden eliminar, pero puede agregar buzos de emergencia si es necesario.
            Esta información se complementará con los datos de perfil de cada usuario.
          </div>
        </div>
      </div>
    </div>
  );
};
