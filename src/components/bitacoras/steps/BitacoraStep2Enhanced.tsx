
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, X, UserCheck } from "lucide-react";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";

interface BitacoraStep2EnhancedProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
  inmersionId?: string;
}

interface BuzoData {
  nombre: string;
  rol: string;
  matricula: string;
  tiempo_fondo: string;
  profundidad_max: string;
  objetivo_trabajo: string;
  observaciones: string;
}

export const BitacoraStep2Enhanced = ({
  data,
  onDataChange,
  onNext,
  onPrevious,
  inmersionId
}: BitacoraStep2EnhancedProps) => {
  const { equipos } = useEquiposBuceoEnhanced();
  const [equipoSeleccionado, setEquipoSeleccionado] = useState<string>("");
  const [miembrosEquipo, setMiembrosEquipo] = useState<any[]>([]);
  const [buzosData, setBuzosData] = useState<BuzoData[]>([]);

  // Función para obtener miembros del equipo
  const getEquipoMembers = async (equipoId: string) => {
    try {
      const equipo = equipos.find(e => e.id === equipoId);
      if (equipo && equipo.miembros) {
        return equipo.miembros;
      }
      return [];
    } catch (error) {
      console.error('Error getting team members:', error);
      return [];
    }
  };

  // Inicializar datos del equipo si ya existe
  useEffect(() => {
    if (data.equipo_buceo_id && equipos.length > 0) {
      setEquipoSeleccionado(data.equipo_buceo_id);
      loadEquipoMembers(data.equipo_buceo_id);
    }
  }, [data.equipo_buceo_id, equipos]);

  const loadEquipoMembers = async (equipoId: string) => {
    try {
      const members = await getEquipoMembers(equipoId);
      console.log('Loaded team members:', members);
      setMiembrosEquipo(members || []);
      
      // Inicializar datos de buzos si no existen
      if (!data.inmersiones_buzos || data.inmersiones_buzos.length === 0) {
        const initialBuzosData = (members || []).map((member: any) => ({
          nombre: member.nombre_completo || `${member.usuario?.nombre || ''} ${member.usuario?.apellido || ''}`.trim(),
          rol: member.rol_equipo || 'buzo',
          matricula: member.usuario?.perfil_buzo?.matricula || '',
          tiempo_fondo: '',
          profundidad_max: '',
          objetivo_trabajo: '',
          observaciones: ''
        }));
        setBuzosData(initialBuzosData);
        onDataChange({
          ...data,
          inmersiones_buzos: initialBuzosData
        });
      } else {
        setBuzosData(data.inmersiones_buzos);
      }
    } catch (error) {
      console.error('Error loading team members:', error);
    }
  };

  const handleEquipoChange = (equipoId: string) => {
    setEquipoSeleccionado(equipoId);
    const equipo = equipos.find(e => e.id === equipoId);
    onDataChange({
      ...data,
      equipo_buceo_id: equipoId,
      equipo_buceo_nombre: equipo?.nombre || ''
    });
    loadEquipoMembers(equipoId);
  };

  const handleBuzoDataChange = (index: number, field: keyof BuzoData, value: string) => {
    const newBuzosData = [...buzosData];
    newBuzosData[index] = {
      ...newBuzosData[index],
      [field]: value
    };
    setBuzosData(newBuzosData);
    onDataChange({
      ...data,
      inmersiones_buzos: newBuzosData
    });
  };

  const addBuzoManual = () => {
    const newBuzo: BuzoData = {
      nombre: '',
      rol: 'buzo',
      matricula: '',
      tiempo_fondo: '',
      profundidad_max: '',
      objetivo_trabajo: '',
      observaciones: ''
    };
    const newBuzosData = [...buzosData, newBuzo];
    setBuzosData(newBuzosData);
    onDataChange({
      ...data,
      inmersiones_buzos: newBuzosData
    });
  };

  const removeBuzo = (index: number) => {
    const newBuzosData = buzosData.filter((_, i) => i !== index);
    setBuzosData(newBuzosData);
    onDataChange({
      ...data,
      inmersiones_buzos: newBuzosData
    });
  };

  const isValid = () => {
    return buzosData.length > 0 && buzosData.every(buzo => 
      buzo.nombre.trim() !== '' && 
      buzo.rol.trim() !== ''
    );
  };

  const equipoSeleccionadoData = equipos.find(e => e.id === equipoSeleccionado);

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Equipo de Buceo</h2>
        <p className="text-gray-600">Selecciona el equipo y configura los datos de cada buzo</p>
      </div>

      {/* Selección de Equipo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Seleccionar Equipo de Buceo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <Label htmlFor="equipo_buceo">Equipo de Buceo</Label>
              <Select value={equipoSeleccionado} onValueChange={handleEquipoChange}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar equipo de buceo" />
                </SelectTrigger>
                <SelectContent>
                  {equipos.map((equipo) => (
                    <SelectItem key={equipo.id} value={equipo.id}>
                      {equipo.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {equipoSeleccionadoData && (
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">
                  Equipo de Buceo: {equipoSeleccionadoData.nombre}
                </h4>
                <div className="flex flex-wrap gap-2">
                  {miembrosEquipo.map((member, index) => (
                    <Badge key={index} variant="secondary" className="flex items-center gap-1">
                      <UserCheck className="w-3 h-3" />
                      {member.nombre_completo || `${member.usuario?.nombre || ''} ${member.usuario?.apellido || ''}`.trim()} ({member.rol_equipo})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Configuración de Buzos */}
      {buzosData.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Configuración de Buzos ({buzosData.length})
              </span>
              <Button onClick={addBuzoManual} size="sm" variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Buzo Manual
              </Button>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {buzosData.map((buzo, index) => (
                <div key={index} className="p-4 border rounded-lg relative">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="font-medium text-gray-900">
                      Buzo {index + 1}
                    </h4>
                    {buzosData.length > 1 && (
                      <Button
                        onClick={() => removeBuzo(index)}
                        size="sm"
                        variant="ghost"
                        className="text-red-600 hover:text-red-700"
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    )}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`buzo_nombre_${index}`}>Nombre Completo *</Label>
                      <Input
                        id={`buzo_nombre_${index}`}
                        value={buzo.nombre}
                        onChange={(e) => handleBuzoDataChange(index, 'nombre', e.target.value)}
                        placeholder="Nombre y apellido del buzo"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`buzo_rol_${index}`}>Rol en el Equipo *</Label>
                      <Select
                        value={buzo.rol}
                        onValueChange={(value) => handleBuzoDataChange(index, 'rol', value)}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="buzo_principal">Buzo Principal</SelectItem>
                          <SelectItem value="buzo_asistente">Buzo Asistente</SelectItem>
                          <SelectItem value="buzo">Buzo</SelectItem>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor={`buzo_matricula_${index}`}>Matrícula</Label>
                      <Input
                        id={`buzo_matricula_${index}`}
                        value={buzo.matricula}
                        onChange={(e) => handleBuzoDataChange(index, 'matricula', e.target.value)}
                        placeholder="Número de matrícula"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`tiempo_fondo_${index}`}>Tiempo de Fondo (min)</Label>
                      <Input
                        id={`tiempo_fondo_${index}`}
                        value={buzo.tiempo_fondo}
                        onChange={(e) => handleBuzoDataChange(index, 'tiempo_fondo', e.target.value)}
                        placeholder="Ej: 45"
                        type="number"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`profundidad_max_${index}`}>Profundidad Máxima (m)</Label>
                      <Input
                        id={`profundidad_max_${index}`}
                        value={buzo.profundidad_max}
                        onChange={(e) => handleBuzoDataChange(index, 'profundidad_max', e.target.value)}
                        placeholder="Ej: 25"
                        type="number"
                      />
                    </div>

                    <div>
                      <Label htmlFor={`objetivo_trabajo_${index}`}>Objetivo del Trabajo</Label>
                      <Input
                        id={`objetivo_trabajo_${index}`}
                        value={buzo.objetivo_trabajo}
                        onChange={(e) => handleBuzoDataChange(index, 'objetivo_trabajo', e.target.value)}
                        placeholder="Descripción del trabajo realizado"
                      />
                    </div>
                  </div>

                  <div className="mt-4">
                    <Label htmlFor={`observaciones_${index}`}>Observaciones</Label>
                    <Textarea
                      id={`observaciones_${index}`}
                      value={buzo.observaciones}
                      onChange={(e) => handleBuzoDataChange(index, 'observaciones', e.target.value)}
                      placeholder="Observaciones adicionales sobre el desempeño del buzo"
                      rows={3}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Botones de Navegación */}
      <div className="flex justify-between pt-6">
        <Button onClick={onPrevious} variant="outline">
          Anterior
        </Button>
        <Button 
          onClick={onNext} 
          disabled={!isValid()}
          className="bg-blue-600 hover:bg-blue-700 text-white"
        >
          Siguiente
        </Button>
      </div>
    </div>
  );
};
