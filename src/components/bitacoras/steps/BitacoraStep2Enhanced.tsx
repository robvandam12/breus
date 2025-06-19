import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { User, Clock, MapPin, AlertCircle, Users, CheckCircle } from "lucide-react";
import { BitacoraSupervisorData } from "../BitacoraWizard";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";

interface BitacoraStep2EnhancedProps {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
}

export const BitacoraStep2Enhanced = ({ data, onUpdate }: BitacoraStep2EnhancedProps) => {
  const [manualBuzos, setManualBuzos] = useState<any[]>([]);
  const { equipos } = useEquiposBuceoEnhanced();

  // CORRECCIÓN: Buscar el equipo por el ID que esté disponible en los datos
  // Como no tenemos acceso directo al equipo_buceo_id desde data, usaremos los equipos disponibles
  const currentTeam = equipos.find(eq => eq.activo === true) || null;

  useEffect(() => {
    if (currentTeam?.miembros && Array.isArray(currentTeam.miembros)) {
      // Filtrar solo buzos, excluir supervisores
      const soloMiembrosBuzos = currentTeam.miembros.filter((miembro: any) => {
        const rol = miembro.rol_equipo || 'buzo';
        return rol !== 'supervisor' && rol !== 'jefe_operaciones' && rol !== 'coordinador';
      });
      
      const buzos = soloMiembrosBuzos.map((miembro: any) => {
        const nombre = miembro.nombre_completo || 
                     (miembro.nombre && miembro.apellido ? `${miembro.nombre} ${miembro.apellido}` : '') ||
                     'Miembro sin asignar';
        
        const rut = miembro.rut || 'Por asignar';
        const matricula = miembro.matricula || 'Por asignar';
        
        return {
          id: miembro.usuario_id || miembro.id || `temp_${Date.now()}_${Math.random()}`,
          nombre,
          rut,
          matricula,
          rol: miembro.rol_equipo || 'buzo',
          profundidad_max: 0,
          tiempo_total_fondo: '',
          tiempo_total_descompresion: '',
          hora_entrada_agua: '',
          hora_salida_agua: '',
          observaciones: ''
        };
      });
      
      console.log('Buzos procesados del equipo (sin supervisores):', buzos);
      setManualBuzos(buzos);
      onUpdate({ inmersiones_buzos: buzos });
    } else if (!currentTeam && (!data.inmersiones_buzos || data.inmersiones_buzos.length === 0)) {
      setManualBuzos([]);
      onUpdate({ inmersiones_buzos: [] });
    }
  }, [currentTeam]);

  const handleBuzoChange = (index: number, field: string, value: any) => {
    const updatedBuzos = [...manualBuzos];
    updatedBuzos[index][field] = value;
    setManualBuzos(updatedBuzos);
    onUpdate({ inmersiones_buzos: updatedBuzos });
  };

  const handleAddManualBuzo = () => {
    const newBuzo = {
      id: `temp_${Date.now()}_${Math.random()}`,
      nombre: 'Nuevo Buzo',
      rut: 'Por asignar',
      matricula: 'Por asignar',
      rol: 'buzo',
      profundidad_max: 0,
      tiempo_total_fondo: '',
      tiempo_total_descompresion: '',
      hora_entrada_agua: '',
      hora_salida_agua: '',
      observaciones: ''
    };
    const updatedBuzos = [...manualBuzos, newBuzo];
    setManualBuzos(updatedBuzos);
    onUpdate({ inmersiones_buzos: updatedBuzos });
  };

  const handleDeleteBuzo = (id: string) => {
    const updatedBuzos = manualBuzos.filter(buzo => buzo.id !== id);
    setManualBuzos(updatedBuzos);
    onUpdate({ inmersiones_buzos: updatedBuzos });
  };

  const handleObservacionesChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({ observaciones_generales_texto: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Registro de Buzos</h2>
        <p className="mt-2 text-gray-600">
          Personal buzo que participó en las inmersiones
        </p>
      </div>

      {/* Información del Equipo Asignado */}
      {currentTeam && (
        <Card className="bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-blue-800">
              <Users className="w-5 h-5" />
              Equipo de Buceo Asignado: {currentTeam.nombre}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-blue-700">Tipo de Empresa:</Label>
                <p className="font-medium">{currentTeam.tipo_empresa || 'No especificada'}</p>
              </div>
              <div>
                <Label className="text-blue-700">Estado:</Label>
                <Badge variant={currentTeam.activo ? 'default' : 'secondary'}>
                  {currentTeam.activo ? 'Activo' : 'Inactivo'}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Lista de Buzos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="w-5 h-5 text-teal-600" />
            Buzos Participantes ({manualBuzos.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {manualBuzos.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No hay buzos registrados</p>
              <p className="text-sm">Selecciona un equipo de buceo o agrega buzos manualmente</p>
            </div>
          ) : (
            <div className="space-y-4">
              {manualBuzos.map((buzo, index) => (
                <Card key={buzo.id} className="border-l-4 border-l-teal-500">
                  <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label>Nombre</Label>
                      <Input
                        type="text"
                        value={buzo.nombre}
                        onChange={(e) => handleBuzoChange(index, 'nombre', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>RUT</Label>
                      <Input
                        type="text"
                        value={buzo.rut}
                        onChange={(e) => handleBuzoChange(index, 'rut', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Matrícula</Label>
                      <Input
                        type="text"
                        value={buzo.matricula}
                        onChange={(e) => handleBuzoChange(index, 'matricula', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Rol</Label>
                      <Input
                        type="text"
                        value={buzo.rol}
                        onChange={(e) => handleBuzoChange(index, 'rol', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Profundidad Máx.</Label>
                      <Input
                        type="number"
                        value={buzo.profundidad_max}
                        onChange={(e) => handleBuzoChange(index, 'profundidad_max', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Tiempo Total Fondo</Label>
                      <Input
                        type="text"
                        value={buzo.tiempo_total_fondo}
                        onChange={(e) => handleBuzoChange(index, 'tiempo_total_fondo', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Tiempo Descompresión</Label>
                      <Input
                        type="text"
                        value={buzo.tiempo_total_descompresion}
                        onChange={(e) => handleBuzoChange(index, 'tiempo_total_descompresion', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Hora Entrada Agua</Label>
                      <Input
                        type="text"
                        value={buzo.hora_entrada_agua}
                        onChange={(e) => handleBuzoChange(index, 'hora_entrada_agua', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Hora Salida Agua</Label>
                      <Input
                        type="text"
                        value={buzo.hora_salida_agua}
                        onChange={(e) => handleBuzoChange(index, 'hora_salida_agua', e.target.value)}
                      />
                    </div>
                    <div>
                      <Label>Observaciones</Label>
                      <Input
                        type="text"
                        value={buzo.observaciones}
                        onChange={(e) => handleBuzoChange(index, 'observaciones', e.target.value)}
                      />
                    </div>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => handleDeleteBuzo(buzo.id)}
                    >
                      Eliminar
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          <Button onClick={handleAddManualBuzo} className="w-full">
            Agregar Buzo Manualmente
          </Button>
        </CardContent>
      </Card>

      {/* Observaciones Generales */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-orange-600" />
            Observaciones Generales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="observaciones_generales">
              Comentarios Adicionales sobre el Personal
            </Label>
            <Textarea
              id="observaciones_generales"
              placeholder="Espacio para detalles adicionales sobre el equipo, roles, etc."
              rows={4}
              className="mt-2"
              onChange={handleObservacionesChange}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
