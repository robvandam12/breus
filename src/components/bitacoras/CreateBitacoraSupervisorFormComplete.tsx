import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, Building, MapPin, FileText, Save, X, Users, Anchor } from 'lucide-react';
import { BitacoraSupervisorFormData } from '@/hooks/useBitacorasSupervisor';
import { useAuth } from '@/hooks/useAuth';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useInmersionesData } from '@/hooks/useInmersionesData';
import type { Inmersion } from '@/types/inmersion';


interface CreateBitacoraSupervisorFormCompleteProps {
  onSubmit: (data: BitacoraSupervisorFormData) => void;
  onCancel: () => void;
}

export const CreateBitacoraSupervisorFormComplete: React.FC<CreateBitacoraSupervisorFormCompleteProps> = ({
  onSubmit,
  onCancel
}) => {
  const { profile } = useAuth();
  const { inmersiones, loadingInmersiones } = useInmersionesData();
  const { operaciones } = useOperaciones();
  
  const [selectedInmersionId, setSelectedInmersionId] = useState('');
  const [selectedInmersion, setSelectedInmersion] = useState<Inmersion | null>(null);
  const [operacionData, setOperacionData] = useState<any | null>(null);
  const [buzosData, setBuzosData] = useState<Array<{
    nombre: string;
    rol: string;
    profundidad: number;
  }>>([]);
  const [formData, setFormData] = useState({
    desarrollo_inmersion: '',
    incidentes: '',
    evaluacion_general: '',
    trabajo_a_realizar: '',
    descripcion_trabajo: ''
  });

  useEffect(() => {
    if (selectedInmersionId) {
      const inmersion = inmersiones.find(i => i.inmersion_id === selectedInmersionId) as Inmersion;
      setSelectedInmersion(inmersion || null);
    }
  }, [selectedInmersionId, inmersiones]);

  useEffect(() => {
    if (selectedInmersion && selectedInmersion.operacion_id) {
      const operacion = operaciones.find(op => op.id === selectedInmersion.operacion_id);
      setOperacionData(operacion || null);
    } else {
      setOperacionData(null);
    }
  }, [selectedInmersion, operaciones]);

  useEffect(() => {
    if (selectedInmersion) {
      const initialBuzosData = (selectedInmersion.personal_inmersion || []).map(personal => ({
        nombre: personal.nombre,
        rol: personal.rol,
        profundidad: 0
      }));
      setBuzosData(initialBuzosData);
    }
  }, [selectedInmersion]);

  const updateBuzoProfundidad = (index: number, profundidad: number) => {
    setBuzosData(prev => prev.map((buzo, i) => 
      i === index ? { ...buzo, profundidad } : buzo
    ));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInmersion || !formData.desarrollo_inmersion || !formData.evaluacion_general) {
      return;
    }

    const submitData: BitacoraSupervisorFormData = {
      codigo: `BIT-SUP-${Date.now()}`,
      inmersion_id: selectedInmersion.inmersion_id,
      supervisor: `${profile?.nombre || ''} ${profile?.apellido || ''}`.trim(),
      desarrollo_inmersion: formData.desarrollo_inmersion,
      incidentes: formData.incidentes || '',
      evaluacion_general: formData.evaluacion_general,
      fecha: selectedInmersion.fecha_inmersion,
      firmado: false,
      estado_aprobacion: 'pendiente',
      fecha_inicio_faena: selectedInmersion.fecha_inmersion,
      hora_inicio_faena: selectedInmersion.hora_inicio,
      hora_termino_faena: selectedInmersion.hora_fin || '',
      lugar_trabajo: operacionData?.sitio?.nombre || 'N/A',
      supervisor_nombre_matricula: `${profile?.nombre || ''} ${profile?.apellido || ''}`.trim(),
      estado_mar: '',
      visibilidad_fondo: selectedInmersion.visibilidad || 0,
      inmersiones_buzos: buzosData.map(buzo => ({
        nombre: buzo.nombre,
        apellido: '',
        rut: '',
        rol: buzo.rol,
        profundidad_trabajo: buzo.profundidad,
        tiempo_inmersion: 0,
        del_equipo_buceo: true
      })),
      equipos_utilizados: [],
      trabajo_a_realizar: formData.trabajo_a_realizar || '',
      descripcion_trabajo: formData.descripcion_trabajo || '',
      embarcacion_apoyo: '',
      observaciones_generales_texto: '',
      validacion_contratista: false,
      comentarios_validacion: '',
      diving_records: []
    };

    onSubmit(submitData);
  };

  if (loadingInmersiones) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto mb-4"></div>
        <p>Cargando inmersiones...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-purple-600" />
            Nueva Bitácora de Supervisor
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-purple-700 border-b pb-2">
                1. Seleccionar Inmersión
              </h3>
              <div>
                <Label htmlFor="inmersion_id">Inmersión</Label>
                <Select value={selectedInmersionId} onValueChange={setSelectedInmersionId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar inmersión..." />
                  </SelectTrigger>
                  <SelectContent>
                    {inmersiones.map((inmersion) => (
                      <SelectItem key={inmersion.inmersion_id} value={inmersion.inmersion_id}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{inmersion.codigo}</Badge>
                          <span>{inmersion.objetivo}</span>
                          <span className="text-sm text-gray-500">
                            ({new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')})
                          </span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {selectedInmersion && (
              <>
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-700 border-b pb-2">
                    2. Información de la Inmersión
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Empresa:</span>
                        <span>{operacionData?.salmonera?.nombre || operacionData?.contratista?.nombre || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Sitio:</span>
                        <span>{operacionData?.sitio?.nombre || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Fecha:</span>
                        <span>{new Date(selectedInmersion.fecha_inmersion).toLocaleDateString('es-CL')}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Horario:</span>
                        <span>{selectedInmersion.hora_inicio} - {selectedInmersion.hora_fin || 'En curso'}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <User className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Supervisor:</span>
                        <span>{selectedInmersion.supervisor}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <FileText className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Buzo Principal:</span>
                        <span>{selectedInmersion.buzo_principal}</span>
                      </div>
                      <div>
                        <span className="font-medium">Objetivo:</span>
                        <p className="text-sm text-gray-600 mt-1">{selectedInmersion.objetivo}</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Datos de Buzos y Profundidades */}
                {buzosData.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-purple-700 border-b pb-2">
                      3. Datos de Buzos y Profundidades
                    </h3>
                    <div className="space-y-3">
                      {buzosData.map((buzo, index) => (
                        <Card key={index} className="p-4">
                          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                            <div>
                              <Label className="text-sm font-medium">Buzo</Label>
                              <div className="flex items-center gap-2">
                                <Users className="w-4 h-4 text-blue-500" />
                                <span className="font-medium">{buzo.nombre}</span>
                                <Badge variant={buzo.rol === 'Principal' ? 'default' : 'secondary'}>
                                  {buzo.rol}
                                </Badge>
                              </div>
                            </div>
                            <div>
                              <Label htmlFor={`profundidad-${index}`}>Profundidad Alcanzada (m)</Label>
                              <div className="flex items-center gap-2">
                                <Anchor className="w-4 h-4 text-teal-500" />
                                <Input
                                  id={`profundidad-${index}`}
                                  type="number"
                                  min="0"
                                  step="0.1"
                                  value={buzo.profundidad}
                                  onChange={(e) => updateBuzoProfundidad(index, Number(e.target.value))}
                                  className="w-24"
                                />
                                <span className="text-sm text-gray-500">metros</span>
                              </div>
                            </div>
                            <div className="text-sm text-gray-600">
                              <p>Profundidad máxima planificada: {selectedInmersion.profundidad_max}m</p>
                            </div>
                          </div>
                        </Card>
                      ))}
                    </div>
                  </div>
                )}

                <Separator />

                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-purple-700 border-b pb-2">
                    4. Registro del Supervisor
                  </h3>
                  <div>
                    <Label htmlFor="desarrollo_inmersion">Desarrollo de la Inmersión</Label>
                    <Textarea
                      id="desarrollo_inmersion"
                      value={formData.desarrollo_inmersion}
                      onChange={(e) => setFormData({...formData, desarrollo_inmersion: e.target.value})}
                      placeholder="Describa cómo se desarrolló la inmersión..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="incidentes">Incidentes (Opcional)</Label>
                    <Textarea
                      id="incidentes"
                      value={formData.incidentes}
                      onChange={(e) => setFormData({...formData, incidentes: e.target.value})}
                      placeholder="Describa cualquier incidente ocurrido durante la inmersión..."
                      className="min-h-[80px]"
                    />
                  </div>
                  <div>
                    <Label htmlFor="evaluacion_general">Evaluación General</Label>
                    <Textarea
                      id="evaluacion_general"
                      value={formData.evaluacion_general}
                      onChange={(e) => setFormData({...formData, evaluacion_general: e.target.value})}
                      placeholder="Evaluación general de la inmersión..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                  <div>
                    <Label htmlFor="trabajo_a_realizar">Trabajo a Realizar (Opcional)</Label>
                    <Input
                      id="trabajo_a_realizar"
                      value={formData.trabajo_a_realizar}
                      onChange={(e) => setFormData({...formData, trabajo_a_realizar: e.target.value})}
                      placeholder="Trabajo a realizar durante la inmersión..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="descripcion_trabajo">Descripción del Trabajo (Opcional)</Label>
                    <Textarea
                      id="descripcion_trabajo"
                      value={formData.descripcion_trabajo}
                      onChange={(e) => setFormData({...formData, descripcion_trabajo: e.target.value})}
                      placeholder="Descripción detallada del trabajo..."
                      className="min-h-[80px]"
                    />
                  </div>
                </div>

                <div className="flex gap-3 pt-6">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-purple-600 hover:bg-purple-700"
                    disabled={!formData.desarrollo_inmersion || !formData.evaluacion_general}
                  >
                    <Save className="w-4 h-4 mr-2" />
                    Crear Bitácora
                  </Button>
                  <Button type="button" variant="outline" onClick={onCancel}>
                    <X className="w-4 h-4 mr-2" />
                    Cancelar
                  </Button>
                </div>
              </>
            )}
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
