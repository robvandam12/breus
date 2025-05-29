
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, Building, MapPin, Anchor, Save, X } from 'lucide-react';
import { useBitacoraEnhanced, BitacoraBuzoFormData, InmersionCompleta } from '@/hooks/useBitacoraEnhanced';
import { useAuth } from '@/hooks/useAuth';

interface CreateBitacoraBuzoFormEnhancedProps {
  onSubmit: (data: BitacoraBuzoFormData) => void;
  onCancel: () => void;
}

export const CreateBitacoraBuzoFormEnhanced: React.FC<CreateBitacoraBuzoFormEnhancedProps> = ({
  onSubmit,
  onCancel
}) => {
  const { profile } = useAuth();
  const { inmersiones, loadingInmersiones } = useBitacoraEnhanced();
  
  const [selectedInmersionId, setSelectedInmersionId] = useState('');
  const [selectedInmersion, setSelectedInmersion] = useState<InmersionCompleta | null>(null);
  const [formData, setFormData] = useState<Partial<BitacoraBuzoFormData>>({
    inmersion_id: '',
    fecha: new Date().toISOString().split('T')[0],
    buzo_id: profile?.id || '',
    profundidad_maxima: 0,
    trabajos_realizados: '',
    estado_fisico_post: '',
    observaciones_tecnicas: ''
  });

  useEffect(() => {
    if (selectedInmersionId) {
      const inmersion = inmersiones.find(i => i.inmersion_id === selectedInmersionId);
      setSelectedInmersion(inmersion || null);
      if (inmersion) {
        setFormData(prev => ({
          ...prev,
          inmersion_id: selectedInmersionId,
          fecha: inmersion.fecha_inmersion,
          profundidad_maxima: inmersion.profundidad_max
        }));
      }
    }
  }, [selectedInmersionId, inmersiones]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedInmersion || !formData.trabajos_realizados || !formData.estado_fisico_post) {
      return;
    }

    onSubmit(formData as BitacoraBuzoFormData);
  };

  if (loadingInmersiones) {
    return (
      <div className="p-6 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p>Cargando inmersiones...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="w-5 h-5 text-teal-600" />
            Nueva Bitácora de Buzo
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selección de Inmersión */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-teal-700 border-b pb-2">
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
                {/* Información de la Inmersión */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-teal-700 border-b pb-2">
                    2. Información de la Inmersión
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Empresa:</span>
                        <span>{selectedInmersion.operacion.salmoneras?.nombre || selectedInmersion.operacion.contratistas?.nombre || 'N/A'}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="font-medium">Sitio:</span>
                        <span>{selectedInmersion.operacion.sitios?.nombre || 'N/A'}</span>
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
                        <Anchor className="w-4 h-4 text-gray-500" />
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

                {/* Condiciones de Buceo */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-teal-700 border-b pb-2">
                    3. Condiciones de Buceo (Prellenadas por Supervisor)
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-4 bg-blue-50 rounded-lg">
                    <div>
                      <Label className="text-sm font-medium">Profundidad Máxima</Label>
                      <div className="text-lg font-bold text-blue-600">{selectedInmersion.profundidad_max}m</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Temperatura Agua</Label>
                      <div className="text-lg font-bold text-blue-600">{selectedInmersion.temperatura_agua}°C</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Visibilidad</Label>
                      <div className="text-lg font-bold text-blue-600">{selectedInmersion.visibilidad}m</div>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Corriente</Label>
                      <div className="text-lg font-bold text-blue-600">{selectedInmersion.corriente}</div>
                    </div>
                  </div>
                </div>

                <Separator />

                {/* Datos del Buzo */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-teal-700 border-b pb-2">
                    4. Registro del Buzo
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fecha">Fecha del Registro</Label>
                      <Input
                        id="fecha"
                        type="date"
                        value={formData.fecha}
                        onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="profundidad_maxima">Profundidad Máxima Alcanzada (m)</Label>
                      <Input
                        id="profundidad_maxima"
                        type="number"
                        step="0.1"
                        value={formData.profundidad_maxima}
                        onChange={(e) => setFormData({...formData, profundidad_maxima: parseFloat(e.target.value) || 0})}
                        max={selectedInmersion.profundidad_max}
                        required
                      />
                      <p className="text-sm text-gray-500 mt-1">
                        Máximo permitido: {selectedInmersion.profundidad_max}m
                      </p>
                    </div>
                  </div>
                </div>

                {/* Trabajos Realizados */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-teal-700 border-b pb-2">
                    5. Trabajos Realizados
                  </h3>
                  <div>
                    <Label htmlFor="trabajos_realizados">Descripción Detallada de Trabajos</Label>
                    <Textarea
                      id="trabajos_realizados"
                      value={formData.trabajos_realizados}
                      onChange={(e) => setFormData({...formData, trabajos_realizados: e.target.value})}
                      placeholder="Describe detalladamente los trabajos realizados durante la inmersión..."
                      className="min-h-[120px]"
                      required
                    />
                  </div>
                </div>

                {/* Estado Físico Post-Inmersión */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold text-teal-700 border-b pb-2">
                    6. Estado Físico Post-Inmersión
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="estado_fisico_post">Estado Físico</Label>
                      <Select 
                        value={formData.estado_fisico_post} 
                        onValueChange={(value) => setFormData({...formData, estado_fisico_post: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar estado..." />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="bueno">Bueno</SelectItem>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="malo">Malo</SelectItem>
                          <SelectItem value="requiere_atencion">Requiere Atención Médica</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="observaciones_tecnicas">Observaciones Técnicas</Label>
                      <Textarea
                        id="observaciones_tecnicas"
                        value={formData.observaciones_tecnicas}
                        onChange={(e) => setFormData({...formData, observaciones_tecnicas: e.target.value})}
                        placeholder="Observaciones técnicas, incidentes, recomendaciones..."
                        className="min-h-[100px]"
                      />
                    </div>
                  </div>
                </div>

                {/* Acciones */}
                <div className="flex gap-3 pt-6">
                  <Button 
                    type="submit" 
                    className="flex-1 bg-teal-600 hover:bg-teal-700"
                    disabled={!formData.trabajos_realizados || !formData.estado_fisico_post}
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
