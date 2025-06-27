
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useCompanyContext } from '@/hooks/useCompanyContext';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertCircle, Building2, Users, FileText } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';

interface UnifiedInmersionFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  isLoading?: boolean;
}

interface Salmonera {
  id: string;
  nombre: string;
}

interface Contratista {
  id: string;
  nombre: string;
}

interface Operacion {
  id: string;
  codigo: string;
  nombre: string;
}

export const UnifiedInmersionForm: React.FC<UnifiedInmersionFormProps> = ({
  onSubmit,
  onCancel,
  isLoading = false
}) => {
  const { profile } = useAuth();
  const { context } = useCompanyContext();
  const { operaciones } = useOperaciones();

  // Estados del formulario
  const [immersionType, setImmersionType] = useState<'planificada' | 'independiente'>('planificada');
  const [selectedSalmonera, setSelectedSalmonera] = useState<string>('');
  const [selectedContratista, setSelectedContratista] = useState<string>('');
  const [selectedOperacion, setSelectedOperacion] = useState<string>('');
  
  // Datos disponibles
  const [salmoneras, setSalmoneras] = useState<Salmonera[]>([]);
  const [contratistas, setContratistas] = useState<Contratista[]>([]);
  const [availableOperaciones, setAvailableOperaciones] = useState<Operacion[]>([]);

  // Datos del formulario
  const [formData, setFormData] = useState({
    codigo: '',
    fecha_inmersion: '',
    hora_inicio: '',
    hora_fin: '',
    objetivo: '',
    profundidad_max: '',
    temperatura_agua: '',
    visibilidad: '',
    corriente: '',
    supervisor: '',
    buzo_principal: '',
    buzo_asistente: '',
    observaciones: '',
    external_operation_code: ''
  });

  // Cargar salmoneras al inicio (solo para superuser)
  useEffect(() => {
    if (profile?.role === 'superuser') {
      loadSalmoneras();
    } else if (profile?.salmonera_id) {
      // Usuario salmonera: preseleccionar su empresa
      setSelectedSalmonera(profile.salmonera_id);
      loadContratistasForSalmonera(profile.salmonera_id);
    } else if (profile?.servicio_id) {
      // Usuario contratista: buscar sus asociaciones
      loadContratistaAssociations();
    }
  }, [profile]);

  // Cargar operaciones cuando se selecciona contratista
  useEffect(() => {
    if (selectedSalmonera && selectedContratista) {
      loadOperaciones();
    }
  }, [selectedSalmonera, selectedContratista]);

  const loadSalmoneras = async () => {
    try {
      const { data, error } = await supabase
        .from('salmoneras')
        .select('id, nombre')
        .eq('estado', 'activa')
        .order('nombre');

      if (error) throw error;
      setSalmoneras(data || []);
    } catch (error) {
      console.error('Error loading salmoneras:', error);
    }
  };

  const loadContratistasForSalmonera = async (salmoneraId: string) => {
    try {
      const { data, error } = await supabase
        .from('salmonera_contratista')
        .select(`
          contratista:contratistas(id, nombre)
        `)
        .eq('salmonera_id', salmoneraId)
        .eq('estado', 'activa');

      if (error) throw error;
      
      const contratistasData = data?.map(item => item.contratista).filter(Boolean) || [];
      setContratistas(contratistasData as Contratista[]);
    } catch (error) {
      console.error('Error loading contratistas:', error);
    }
  };

  const loadContratistaAssociations = async () => {
    if (!profile?.servicio_id) return;

    try {
      const { data, error } = await supabase
        .from('salmonera_contratista')
        .select(`
          salmonera:salmoneras(id, nombre),
          contratista:contratistas(id, nombre)
        `)
        .eq('contratista_id', profile.servicio_id)
        .eq('estado', 'activa');

      if (error) throw error;

      if (data && data.length > 0) {
        // Si solo hay una asociación, preseleccionar
        if (data.length === 1) {
          setSelectedSalmonera(data[0].salmonera.id);
          setSelectedContratista(data[0].contratista.id);
        }
        
        const salmonerasData = data.map(item => item.salmonera);
        setSalmoneras(salmonerasData as Salmonera[]);
        setContratistas([data[0].contratista] as Contratista[]);
      }
    } catch (error) {
      console.error('Error loading associations:', error);
    }
  };

  const loadOperaciones = async () => {
    const filteredOperaciones = operaciones.filter(op => 
      op.salmonera_id === selectedSalmonera && 
      op.contratista_id === selectedContratista &&
      op.estado === 'activa'
    );
    
    setAvailableOperaciones(filteredOperaciones);
  };

  const handleSalmoneraChange = (salmoneraId: string) => {
    setSelectedSalmonera(salmoneraId);
    setSelectedContratista('');
    setSelectedOperacion('');
    loadContratistasForSalmonera(salmoneraId);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      immersion_type: immersionType,
      salmonera_id: selectedSalmonera,
      contratista_id: selectedContratista,
      operacion_id: immersionType === 'planificada' ? selectedOperacion : null,
      is_independent: immersionType === 'independiente',
      company_id: selectedSalmonera,
      company_type: 'salmonera'
    };

    onSubmit(submitData);
  };

  const canShowOperations = immersionType === 'planificada' && selectedSalmonera && selectedContratista;
  const showExternalCode = immersionType === 'independiente';

  return (
    <div className="max-w-4xl mx-auto">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Nueva Inmersión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Tipo de Inmersión */}
            <div className="space-y-3">
              <Label className="text-base font-medium">Tipo de Inmersión</Label>
              <RadioGroup
                value={immersionType}
                onValueChange={(value: 'planificada' | 'independiente') => setImmersionType(value)}
                className="flex gap-6"
              >
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="planificada" id="planificada" />
                  <Label htmlFor="planificada">Inmersión Planificada</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <RadioGroupItem value="independiente" id="independiente" />
                  <Label htmlFor="independiente">Inmersión Independiente</Label>
                </div>
              </RadioGroup>
            </div>

            {/* Selección de Empresa (para superuser) */}
            {profile?.role === 'superuser' && (
              <div className="space-y-4">
                <div>
                  <Label htmlFor="salmonera">Salmonera *</Label>
                  <Select value={selectedSalmonera} onValueChange={handleSalmoneraChange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar salmonera..." />
                    </SelectTrigger>
                    <SelectContent>
                      {salmoneras.map((salmonera) => (
                        <SelectItem key={salmonera.id} value={salmonera.id}>
                          {salmonera.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedSalmonera && (
                  <div>
                    <Label htmlFor="contratista">Contratista *</Label>
                    <Select value={selectedContratista} onValueChange={setSelectedContratista}>
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar contratista..." />
                      </SelectTrigger>
                      <SelectContent>
                        {contratistas.map((contratista) => (
                          <SelectItem key={contratista.id} value={contratista.id}>
                            {contratista.nombre}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                )}
              </div>
            )}

            {/* Selección de Contratista (para admin_salmonera) */}
            {profile?.role === 'admin_salmonera' && (
              <div>
                <Label htmlFor="contratista">Contratista *</Label>
                <Select value={selectedContratista} onValueChange={setSelectedContratista}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar contratista..." />
                  </SelectTrigger>
                  <SelectContent>
                    {contratistas.map((contratista) => (
                      <SelectItem key={contratista.id} value={contratista.id}>
                        {contratista.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Información de contexto para contratistas */}
            {profile?.role === 'admin_servicio' && selectedSalmonera && (
              <Alert>
                <Building2 className="h-4 w-4" />
                <AlertDescription>
                  Trabajando para: <Badge variant="outline">{salmoneras.find(s => s.id === selectedSalmonera)?.nombre}</Badge>
                </AlertDescription>
              </Alert>
            )}

            {/* Selección de Operación o Código Externo */}
            {canShowOperations && (
              <div>
                <Label htmlFor="operacion">Operación *</Label>
                <Select value={selectedOperacion} onValueChange={setSelectedOperacion}>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar operación..." />
                  </SelectTrigger>
                  <SelectContent>
                    {availableOperaciones.map((operacion) => (
                      <SelectItem key={operacion.id} value={operacion.id}>
                        <div className="flex items-center gap-2">
                          <Badge variant="outline">{operacion.codigo}</Badge>
                          <span>{operacion.nombre}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {availableOperaciones.length === 0 && (
                  <Alert>
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      No hay operaciones disponibles. Puedes crear una nueva operación o usar una inmersión independiente.
                    </AlertDescription>
                  </Alert>
                )}
              </div>
            )}

            {showExternalCode && (
              <div>
                <Label htmlFor="external_code">Código de Operación Externa *</Label>
                <Input
                  id="external_code"
                  value={formData.external_operation_code}
                  onChange={(e) => setFormData({...formData, external_operation_code: e.target.value})}
                  placeholder="Código de la operación externa"
                  required
                />
              </div>
            )}

            {/* Datos básicos de la inmersión */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo">Código *</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => setFormData({...formData, codigo: e.target.value})}
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="fecha_inmersion">Fecha de Inmersión *</Label>
                <Input
                  id="fecha_inmersion"
                  type="date"
                  value={formData.fecha_inmersion}
                  onChange={(e) => setFormData({...formData, fecha_inmersion: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="hora_inicio">Hora de Inicio *</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) => setFormData({...formData, hora_inicio: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="hora_fin">Hora de Fin</Label>
                <Input
                  id="hora_fin"
                  type="time"
                  value={formData.hora_fin}
                  onChange={(e) => setFormData({...formData, hora_fin: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="objetivo">Objetivo *</Label>
              <Textarea
                id="objetivo"
                value={formData.objetivo}
                onChange={(e) => setFormData({...formData, objetivo: e.target.value})}
                placeholder="Descripción del objetivo de la inmersión"
                required
              />
            </div>

            {/* Condiciones ambientales */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="profundidad_max">Profundidad Máxima (m) *</Label>
                <Input
                  id="profundidad_max"
                  type="number"
                  step="0.1"
                  value={formData.profundidad_max}
                  onChange={(e) => setFormData({...formData, profundidad_max: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="temperatura_agua">Temperatura del Agua (°C) *</Label>
                <Input
                  id="temperatura_agua"
                  type="number"
                  step="0.1"
                  value={formData.temperatura_agua}
                  onChange={(e) => setFormData({...formData, temperatura_agua: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="visibilidad">Visibilidad (m) *</Label>
                <Input
                  id="visibilidad"
                  type="number"
                  step="0.1"
                  value={formData.visibilidad}
                  onChange={(e) => setFormData({...formData, visibilidad: e.target.value})}
                  required
                />
              </div>
            </div>

            <div>
              <Label htmlFor="corriente">Corriente *</Label>
              <Input
                id="corriente"
                value={formData.corriente}
                onChange={(e) => setFormData({...formData, corriente: e.target.value})}
                placeholder="Descripción de las condiciones de corriente"
                required
              />
            </div>

            {/* Personal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="supervisor">Supervisor *</Label>
                <Input
                  id="supervisor"
                  value={formData.supervisor}
                  onChange={(e) => setFormData({...formData, supervisor: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="buzo_principal">Buzo Principal *</Label>
                <Input
                  id="buzo_principal"
                  value={formData.buzo_principal}
                  onChange={(e) => setFormData({...formData, buzo_principal: e.target.value})}
                  required
                />
              </div>

              <div>
                <Label htmlFor="buzo_asistente">Buzo Asistente</Label>
                <Input
                  id="buzo_asistente"
                  value={formData.buzo_asistente}
                  onChange={(e) => setFormData({...formData, buzo_asistente: e.target.value})}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
                placeholder="Observaciones adicionales"
              />
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-6">
              <Button 
                type="submit" 
                className="flex-1" 
                disabled={isLoading}
              >
                {isLoading ? 'Creando...' : 'Crear Inmersión'}
              </Button>
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
