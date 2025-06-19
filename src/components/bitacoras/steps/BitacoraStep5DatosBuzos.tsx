import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, Trash2, FileText, UserCheck, Crown } from "lucide-react";

interface BitacoraStep5DatosBuzosProps {
  data: any;
  onDataChange: (data: any) => void;
  onNext: () => void;
  onPrevious: () => void;
}

interface DivingRecord {
  id: string;
  nombre: string;
  rol: string;
  matricula: string;
  tiempo_fondo: string;
  profundidad_max: string;
  objetivo_trabajo: string;
  observaciones: string;
  estado_fisico_pre: string;
  estado_fisico_post: string;
  equipo_utilizado: string;
  hora_entrada: string;
  hora_salida: string;
  temperatura_agua: string;
  visibilidad: string;
  corriente: string;
}

export const BitacoraStep5DatosBuzos = ({
  data,
  onDataChange,
  onNext,
  onPrevious,
}: BitacoraStep5DatosBuzosProps) => {
  const [divingRecords, setDivingRecords] = useState<DivingRecord[]>([]);

  useEffect(() => {
    if (data.diving_records && data.diving_records.length > 0) {
      setDivingRecords(data.diving_records);
    } else {
      generateRecordsFromBuzos();
    }
  }, [data.inmersiones_buzos]);

  const generateRecordsFromBuzos = () => {
    const records: DivingRecord[] = [];
    
    // Generar registros para buzos
    if (data.inmersiones_buzos && data.inmersiones_buzos.length > 0) {
      const buzoRecords = data.inmersiones_buzos.map((buzo: any, index: number) => ({
        id: `record_${index}`,
        nombre: buzo.nombre || '',
        rol: buzo.rol || 'buzo',
        matricula: buzo.matricula || '',
        tiempo_fondo: buzo.tiempo_fondo || '',
        profundidad_max: buzo.profundidad_max || '',
        objetivo_trabajo: buzo.objetivo_trabajo || '',
        observaciones: buzo.observaciones || '',
        estado_fisico_pre: 'normal',
        estado_fisico_post: 'normal',
        equipo_utilizado: '',
        hora_entrada: '',
        hora_salida: '',
        temperatura_agua: data.temperatura_agua || '',
        visibilidad: data.visibilidad_fondo?.toString() || '',
        corriente: data.estado_mar || ''
      }));
      
      records.push(...buzoRecords);
    }

    // Generar registro para el supervisor
    if (data.supervisor && data.supervisor.trim() !== '') {
      records.push({
        id: `supervisor_record`,
        nombre: data.supervisor,
        rol: 'supervisor',
        matricula: data.supervisor_nombre_matricula || '',
        tiempo_fondo: '',
        profundidad_max: '',
        objetivo_trabajo: 'Supervisión de operaciones de buceo',
        observaciones: 'Supervisión y control de la operación',
        estado_fisico_pre: 'normal',
        estado_fisico_post: 'normal',
        equipo_utilizado: 'Equipo de superficie',
        hora_entrada: data.hora_inicio_faena || '',
        hora_salida: data.hora_termino_faena || '',
        temperatura_agua: data.temperatura_agua || '',
        visibilidad: data.visibilidad_fondo?.toString() || '',
        corriente: data.estado_mar || ''
      });
    }

    setDivingRecords(records);
    onDataChange({
      ...data,
      diving_records: records
    });
  };

  const handleRecordChange = (recordId: string, field: keyof DivingRecord, value: string) => {
    const updatedRecords = divingRecords.map(record =>
      record.id === recordId ? { ...record, [field]: value } : record
    );
    setDivingRecords(updatedRecords);
    onDataChange({
      ...data,
      diving_records: updatedRecords
    });
  };

  const addManualRecord = () => {
    const newRecord: DivingRecord = {
      id: `manual_record_${Date.now()}`,
      nombre: '',
      rol: 'buzo',
      matricula: '',
      tiempo_fondo: '',
      profundidad_max: '',
      objetivo_trabajo: '',
      observaciones: '',
      estado_fisico_pre: 'normal',
      estado_fisico_post: 'normal',
      equipo_utilizado: '',
      hora_entrada: '',
      hora_salida: '',
      temperatura_agua: data.temperatura_agua || '',
      visibilidad: data.visibilidad_fondo?.toString() || '',
      corriente: data.estado_mar || ''
    };

    const updatedRecords = [...divingRecords, newRecord];
    setDivingRecords(updatedRecords);
    onDataChange({
      ...data,
      diving_records: updatedRecords
    });
  };

  const removeRecord = (recordId: string) => {
    const updatedRecords = divingRecords.filter(record => record.id !== recordId);
    setDivingRecords(updatedRecords);
    onDataChange({
      ...data,
      diving_records: updatedRecords
    });
  };

  const getRoleIcon = (rol: string) => {
    switch (rol) {
      case 'supervisor':
        return <Crown className="w-4 h-4 text-yellow-600" />;
      case 'buzo_principal':
        return <UserCheck className="w-4 h-4 text-blue-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadgeColor = (rol: string) => {
    switch (rol) {
      case 'supervisor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'buzo_principal':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'buzo_asistente':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const isValid = () => {
    return divingRecords.length > 0 && divingRecords.every(record => 
      record.nombre.trim() !== '' && 
      record.rol.trim() !== ''
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Registros de Inmersión</h2>
        <p className="text-gray-600">Completa los registros detallados para cada participante</p>
      </div>

      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          <span className="font-medium">Registros Generados: {divingRecords.length}</span>
        </div>
        <div className="flex gap-2">
          <Button onClick={generateRecordsFromBuzos} variant="outline" size="sm">
            Regenerar desde Buzos
          </Button>
          <Button onClick={addManualRecord} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Manual
          </Button>
        </div>
      </div>

      {divingRecords.length === 0 ? (
        <Card>
          <CardContent className="p-8 text-center">
            <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No hay registros de inmersión
            </h3>
            <p className="text-gray-500 mb-4">
              Los registros se generarán automáticamente basados en los buzos configurados
            </p>
            <Button onClick={generateRecordsFromBuzos} variant="outline">
              Generar Registros
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {divingRecords.map((record, index) => (
            <Card key={record.id} className="relative">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    {getRoleIcon(record.rol)}
                    <div>
                      <CardTitle className="text-lg">
                        {record.nombre || `Registro ${index + 1}`}
                      </CardTitle>
                      <Badge className={getRoleBadgeColor(record.rol)} variant="outline">
                        {record.rol.replace('_', ' ').toUpperCase()}
                      </Badge>
                    </div>
                  </div>
                  <Button
                    onClick={() => removeRecord(record.id)}
                    size="sm"
                    variant="ghost"
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {/* Información Personal */}
                  <div>
                    <Label htmlFor={`nombre_${record.id}`}>Nombre Completo *</Label>
                    <Input
                      id={`nombre_${record.id}`}
                      value={record.nombre}
                      onChange={(e) => handleRecordChange(record.id, 'nombre', e.target.value)}
                      placeholder="Nombre y apellido"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`rol_${record.id}`}>Rol *</Label>
                    <Select
                      value={record.rol}
                      onValueChange={(value) => handleRecordChange(record.id, 'rol', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="buzo_principal">Buzo Principal</SelectItem>
                        <SelectItem value="buzo_asistente">Buzo Asistente</SelectItem>
                        <SelectItem value="buzo">Buzo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`matricula_${record.id}`}>Matrícula</Label>
                    <Input
                      id={`matricula_${record.id}`}
                      value={record.matricula}
                      onChange={(e) => handleRecordChange(record.id, 'matricula', e.target.value)}
                      placeholder="Número de matrícula"
                    />
                  </div>

                  {/* Datos de Inmersión */}
                  <div>
                    <Label htmlFor={`tiempo_fondo_${record.id}`}>Tiempo de Fondo (min)</Label>
                    <Input
                      id={`tiempo_fondo_${record.id}`}
                      value={record.tiempo_fondo}
                      onChange={(e) => handleRecordChange(record.id, 'tiempo_fondo', e.target.value)}
                      placeholder="Ej: 45"
                      type="number"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`profundidad_max_${record.id}`}>Profundidad Máxima (m)</Label>
                    <Input
                      id={`profundidad_max_${record.id}`}
                      value={record.profundidad_max}
                      onChange={(e) => handleRecordChange(record.id, 'profundidad_max', e.target.value)}
                      placeholder="Ej: 25"
                      type="number"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`equipo_utilizado_${record.id}`}>Equipo Utilizado</Label>
                    <Input
                      id={`equipo_utilizado_${record.id}`}
                      value={record.equipo_utilizado}
                      onChange={(e) => handleRecordChange(record.id, 'equipo_utilizado', e.target.value)}
                      placeholder="Descripción del equipo"
                    />
                  </div>

                  {/* Horarios */}
                  <div>
                    <Label htmlFor={`hora_entrada_${record.id}`}>Hora de Entrada</Label>
                    <Input
                      id={`hora_entrada_${record.id}`}
                      type="time"
                      value={record.hora_entrada}
                      onChange={(e) => handleRecordChange(record.id, 'hora_entrada', e.target.value)}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`hora_salida_${record.id}`}>Hora de Salida</Label>
                    <Input
                      id={`hora_salida_${record.id}`}
                      type="time"
                      value={record.hora_salida}
                      onChange={(e) => handleRecordChange(record.id, 'hora_salida', e.target.value)}
                    />
                  </div>

                  {/* Estados Físicos */}
                  <div>
                    <Label htmlFor={`estado_fisico_pre_${record.id}`}>Estado Físico Pre-Inmersión</Label>
                    <Select
                      value={record.estado_fisico_pre}
                      onValueChange={(value) => handleRecordChange(record.id, 'estado_fisico_pre', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Estado físico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excelente">Excelente</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="malo">Malo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor={`estado_fisico_post_${record.id}`}>Estado Físico Post-Inmersión</Label>
                    <Select
                      value={record.estado_fisico_post}
                      onValueChange={(value) => handleRecordChange(record.id, 'estado_fisico_post', value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Estado físico" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="excelente">Excelente</SelectItem>
                        <SelectItem value="normal">Normal</SelectItem>
                        <SelectItem value="regular">Regular</SelectItem>
                        <SelectItem value="malo">Malo</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  {/* Condiciones Ambientales */}
                  <div>
                    <Label htmlFor={`temperatura_agua_${record.id}`}>Temperatura del Agua (°C)</Label>
                    <Input
                      id={`temperatura_agua_${record.id}`}
                      value={record.temperatura_agua}
                      onChange={(e) => handleRecordChange(record.id, 'temperatura_agua', e.target.value)}
                      placeholder="Ej: 18"
                      type="number"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`visibilidad_${record.id}`}>Visibilidad (m)</Label>
                    <Input
                      id={`visibilidad_${record.id}`}
                      value={record.visibilidad}
                      onChange={(e) => handleRecordChange(record.id, 'visibilidad', e.target.value)}
                      placeholder="Ej: 15"
                      type="number"
                    />
                  </div>

                  <div>
                    <Label htmlFor={`corriente_${record.id}`}>Estado del Mar / Corriente</Label>
                    <Input
                      id={`corriente_${record.id}`}
                      value={record.corriente}
                      onChange={(e) => handleRecordChange(record.id, 'corriente', e.target.value)}
                      placeholder="Ej: Calmo, ligero oleaje"
                    />
                  </div>
                </div>

                {/* Objetivo y Observaciones */}
                <div className="mt-4 space-y-4">
                  <div>
                    <Label htmlFor={`objetivo_trabajo_${record.id}`}>Objetivo del Trabajo</Label>
                    <Textarea
                      id={`objetivo_trabajo_${record.id}`}
                      value={record.objetivo_trabajo}
                      onChange={(e) => handleRecordChange(record.id, 'objetivo_trabajo', e.target.value)}
                      placeholder="Descripción del trabajo realizado"
                      rows={2}
                    />
                  </div>

                  <div>
                    <Label htmlFor={`observaciones_${record.id}`}>Observaciones</Label>
                    <Textarea
                      id={`observaciones_${record.id}`}
                      value={record.observaciones}
                      onChange={(e) => handleRecordChange(record.id, 'observaciones', e.target.value)}
                      placeholder="Observaciones adicionales sobre la inmersión"
                      rows={3}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
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
