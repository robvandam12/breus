
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { User, Users, Trash2, Plus } from "lucide-react";
import { BitacoraSupervisorData } from "../BitacoraWizardFromInmersion";

interface BitacoraStep2BuzosProps {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
  equipoBuceo?: any;
}

export const BitacoraStep2Buzos = ({ data, onUpdate, equipoBuceo }: BitacoraStep2BuzosProps) => {
  const [buzosRegistrados, setBuzosRegistrados] = useState<any[]>([]);

  useEffect(() => {
    if (equipoBuceo?.miembros && Array.isArray(equipoBuceo.miembros)) {
      // Filtrar SOLO buzos, excluir completamente supervisores y otros roles
      const soloMiembrosBuzos = equipoBuceo.miembros.filter((miembro: any) => {
        const rol = (miembro.rol_equipo || miembro.rol || 'buzo').toLowerCase();
        return rol === 'buzo' || rol === 'buzo_principal' || rol === 'buzo_asistente';
      });
      
      const buzosFormateados = soloMiembrosBuzos.map((miembro: any) => {
        const nombre = miembro.nombre_completo || 
                     (miembro.nombre && miembro.apellido ? `${miembro.nombre} ${miembro.apellido}` : '') ||
                     'Buzo sin asignar';
        
        const rut = miembro.rut || '';
        const matricula = miembro.matricula || '';
        
        return {
          id: miembro.usuario_id || miembro.id || `temp_${Date.now()}_${Math.random()}`,
          nombre,
          apellido: '',
          rut,
          rol: 'buzo',
          profundidad_trabajo: 0,
          tiempo_inmersion: 0,
          del_equipo_buceo: true,
          profundidad_maxima: 0,
          tiempo_fondo: 0,
          tiempo_descompresion: 0,
          hora_entrada_agua: '',
          hora_salida_agua: '',
          observaciones: ''
        };
      });
      
      console.log('Buzos procesados del equipo (solo buzos):', buzosFormateados);
      setBuzosRegistrados(buzosFormateados);
      onUpdate({ inmersiones_buzos: buzosFormateados });
    } else if (!equipoBuceo && (!data.inmersiones_buzos || data.inmersiones_buzos.length === 0)) {
      setBuzosRegistrados([]);
      onUpdate({ inmersiones_buzos: [] });
    }
  }, [equipoBuceo]);

  const handleBuzoChange = (index: number, field: string, value: any) => {
    const updatedBuzos = [...buzosRegistrados];
    updatedBuzos[index][field] = value;
    setBuzosRegistrados(updatedBuzos);
    onUpdate({ inmersiones_buzos: updatedBuzos });
  };

  const handleAddBuzo = () => {
    const newBuzo = {
      id: `temp_${Date.now()}_${Math.random()}`,
      nombre: '',
      apellido: '',
      rut: '',
      rol: 'buzo',
      profundidad_trabajo: 0,
      tiempo_inmersion: 0,
      del_equipo_buceo: false,
      profundidad_maxima: 0,
      tiempo_fondo: 0,
      tiempo_descompresion: 0,
      hora_entrada_agua: '',
      hora_salida_agua: '',
      observaciones: ''
    };
    const updatedBuzos = [...buzosRegistrados, newBuzo];
    setBuzosRegistrados(updatedBuzos);
    onUpdate({ inmersiones_buzos: updatedBuzos });
  };

  const handleDeleteBuzo = (id: string) => {
    const updatedBuzos = buzosRegistrados.filter(buzo => buzo.id !== id);
    setBuzosRegistrados(updatedBuzos);
    onUpdate({ inmersiones_buzos: updatedBuzos });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Registro de Buzos</h2>
        <p className="mt-2 text-gray-600">
          Personal buzo que participó en las inmersiones y sus datos de buceo
        </p>
      </div>

      {/* Información del Equipo Asignado */}
      {equipoBuceo && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Users className="w-5 h-5" />
              Equipo de Buceo Asignado: {equipoBuceo.nombre}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-blue-700">Tipo de Empresa:</Label>
                <p className="font-medium">{equipoBuceo.tipo_empresa || 'No especificada'}</p>
              </div>
              <div>
                <Label className="text-blue-700">Estado:</Label>
                <Badge variant={equipoBuceo.activo ? 'default' : 'secondary'}>
                  {equipoBuceo.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
            <p className="text-blue-600 text-sm mt-2">
              Los buzos del equipo han sido cargados automáticamente. Puede editarlos o agregar buzos adicionales.
            </p>
          </CardContent>
        </Card>
      )}

      {/* Lista de Buzos con Datos de Buceo */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-teal-600" />
            Buzos Participantes y Datos de Inmersión ({buzosRegistrados.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {buzosRegistrados.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay buzos registrados</p>
              <p className="text-sm">Agregue buzos para completar la bitácora de supervisión</p>
            </div>
          ) : (
            <div className="space-y-6">
              {buzosRegistrados.map((buzo, index) => (
                <Card key={buzo.id} className="border-l-4 border-l-teal-500">
                  <CardHeader className="pb-2">
                    <div className="flex justify-between items-center">
                      <h4 className="font-semibold text-teal-700">Buzo #{index + 1}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteBuzo(buzo.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Información Personal del Buzo */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <Label>Nombre Completo</Label>
                        <Input
                          type="text"
                          value={buzo.nombre}
                          onChange={(e) => handleBuzoChange(index, 'nombre', e.target.value)}
                          placeholder="Nombre del buzo"
                        />
                      </div>
                      <div>
                        <Label>RUT</Label>
                        <Input
                          type="text"
                          value={buzo.rut}
                          onChange={(e) => handleBuzoChange(index, 'rut', e.target.value)}
                          placeholder="12.345.678-9"
                        />
                      </div>
                    </div>

                    {/* Datos de Inmersión */}
                    <div className="border-t pt-4">
                      <h5 className="font-semibold text-gray-700 mb-3">Datos de Inmersión</h5>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        <div>
                          <Label>Profundidad Máxima (m)</Label>
                          <Input
                            type="number"
                            value={buzo.profundidad_maxima}
                            onChange={(e) => handleBuzoChange(index, 'profundidad_maxima', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            min="0"
                            step="0.1"
                          />
                        </div>
                        <div>
                          <Label>Tiempo Fondo (min)</Label>
                          <Input
                            type="number"
                            value={buzo.tiempo_fondo}
                            onChange={(e) => handleBuzoChange(index, 'tiempo_fondo', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <div>
                          <Label>Tiempo Descompresión (min)</Label>
                          <Input
                            type="number"
                            value={buzo.tiempo_descompresion}
                            onChange={(e) => handleBuzoChange(index, 'tiempo_descompresion', parseFloat(e.target.value) || 0)}
                            placeholder="0"
                            min="0"
                          />
                        </div>
                        <div>
                          <Label>Hora Entrada Agua</Label>
                          <Input
                            type="time"
                            value={buzo.hora_entrada_agua}
                            onChange={(e) => handleBuzoChange(index, 'hora_entrada_agua', e.target.value)}
                          />
                        </div>
                        <div>
                          <Label>Hora Salida Agua</Label>
                          <Input
                            type="time"
                            value={buzo.hora_salida_agua}
                            onChange={(e) => handleBuzoChange(index, 'hora_salida_agua', e.target.value)}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Observaciones del Buzo */}
                    <div>
                      <Label>Observaciones del Buzo</Label>
                      <Textarea
                        value={buzo.observaciones}
                        onChange={(e) => handleBuzoChange(index, 'observaciones', e.target.value)}
                        placeholder="Observaciones específicas sobre este buzo durante la inmersión..."
                        rows={2}
                      />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Button 
            onClick={handleAddBuzo} 
            className="w-full mt-4"
            variant="outline"
          >
            <Plus className="w-4 h-4 mr-2" />
            Agregar Buzo
          </Button>
        </CardContent>
      </Card>

      <div className="bg-teal-50 border border-teal-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-teal-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <User className="w-4 h-4 text-teal-600" />
          </div>
          <div className="text-sm text-teal-800">
            <strong>Nota:</strong> Este paso registra a los buzos que participaron en las inmersiones con sus datos de buceo.
            Esta información será utilizada para generar el resumen final de supervisión.
          </div>
        </div>
      </div>
    </div>
  );
};
