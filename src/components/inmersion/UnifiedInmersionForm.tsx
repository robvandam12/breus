
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Anchor } from 'lucide-react';
import { useInmersionContext, CompanyOption, OperationOption } from '@/hooks/useInmersionContext';
import { toast } from '@/hooks/use-toast';

interface UnifiedInmersionFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const UnifiedInmersionForm: React.FC<UnifiedInmersionFormProps> = ({
  onSubmit,
  onCancel
}) => {
  const { salmoneras, getContratistasForSalmonera, getOperationsForContext, getContextForUser } = useInmersionContext();
  
  const [isPlanned, setIsPlanned] = useState(false);
  const [selectedSalmonera, setSelectedSalmonera] = useState<string>('');
  const [selectedContratista, setSelectedContratista] = useState<string>('');
  const [contratistas, setContratistas] = useState<CompanyOption[]>([]);
  const [operations, setOperations] = useState<OperationOption[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [formData, setFormData] = useState({
    codigo: '',
    fecha_inmersion: '',
    hora_inicio: '',
    objetivo: '',
    profundidad_max: '',
    temperatura_agua: '',
    visibilidad: '',
    corriente: '',
    supervisor: '',
    buzo_principal: '',
    buzo_asistente: '',
    observaciones: '',
    operacion_id: '',
    external_operation_code: ''
  });

  const userContext = getContextForUser();

  // Inicializar contexto del usuario
  useEffect(() => {
    if (userContext) {
      if (userContext.preSelectedSalmonera) {
        setSelectedSalmonera(userContext.preSelectedSalmonera);
      }
      if (userContext.preSelectedContratista) {
        setSelectedContratista(userContext.preSelectedContratista);
      }
    }
  }, [userContext]);

  // Cargar contratistas cuando se selecciona salmonera
  useEffect(() => {
    const loadContratistas = async () => {
      if (selectedSalmonera) {
        try {
          const contratistasList = await getContratistasForSalmonera(selectedSalmonera);
          setContratistas(contratistasList);
          
          // Si el usuario es contratista y pertenece a esta salmonera, pre-seleccionarlo
          if (userContext?.preSelectedContratista) {
            const belongsToSalmonera = contratistasList.find(c => c.id === userContext.preSelectedContratista);
            if (belongsToSalmonera) {
              setSelectedContratista(userContext.preSelectedContratista);
            }
          }
        } catch (error) {
          console.error('Error loading contratistas:', error);
          toast({
            title: "Error",
            description: "No se pudieron cargar los contratistas",
            variant: "destructive",
          });
        }
      }
    };

    loadContratistas();
  }, [selectedSalmonera, userContext]);

  // Cargar operaciones cuando se selecciona contratista (solo para inmersiones planificadas)
  useEffect(() => {
    const loadOperations = async () => {
      if (isPlanned && selectedSalmonera && selectedContratista) {
        try {
          const operationsList = await getOperationsForContext(selectedSalmonera, selectedContratista);
          setOperations(operationsList);
        } catch (error) {
          console.error('Error loading operations:', error);
          toast({
            title: "Error",
            description: "No se pudieron cargar las operaciones",
            variant: "destructive",
          });
        }
      }
    };

    loadOperations();
  }, [isPlanned, selectedSalmonera, selectedContratista]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedSalmonera || !selectedContratista) {
      toast({
        title: "Error",
        description: "Debe seleccionar salmonera y contratista",
        variant: "destructive",
      });
      return;
    }

    if (isPlanned && !formData.operacion_id) {
      toast({
        title: "Error", 
        description: "Debe seleccionar una operación para inmersión planificada",
        variant: "destructive",
      });
      return;
    }

    if (!isPlanned && !formData.external_operation_code) {
      toast({
        title: "Error",
        description: "Debe ingresar código de operación externa para inmersión independiente",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const inmersionData = {
        ...formData,
        profundidad_max: parseFloat(formData.profundidad_max) || 0,
        temperatura_agua: parseFloat(formData.temperatura_agua) || 0,
        visibilidad: parseFloat(formData.visibilidad) || 0,
        is_independent: !isPlanned,
        operacion_id: isPlanned ? formData.operacion_id : null,
        external_operation_code: !isPlanned ? formData.external_operation_code : null,
        company_id: selectedSalmonera,
        company_type: 'salmonera',
        context_type: isPlanned ? 'planned' : 'direct'
      };

      await onSubmit(inmersionData);
      toast({
        title: "Éxito",
        description: `Inmersión ${isPlanned ? 'planificada' : 'independiente'} creada correctamente`,
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al crear la inmersión",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Selector de Tipo de Inmersión */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="w-5 h-5" />
            Tipo de Inmersión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            <Switch
              id="inmersion-type"
              checked={isPlanned}
              onCheckedChange={setIsPlanned}
            />
            <Label htmlFor="inmersion-type">
              {isPlanned ? 'Inmersión Planificada' : 'Inmersión Independiente'}
            </Label>
          </div>
          <p className="text-sm text-gray-500 mt-2">
            {isPlanned 
              ? 'Inmersión asociada a una operación existente del módulo de planificación'
              : 'Inmersión independiente con código de operación externa'
            }
          </p>
        </CardContent>
      </Card>

      {/* Selección de Empresa (solo si es superuser) */}
      {userContext?.canSelectSalmonera && (
        <Card>
          <CardHeader>
            <CardTitle>Selección de Empresa</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="salmonera">Salmonera *</Label>
              <Select value={selectedSalmonera} onValueChange={setSelectedSalmonera}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar salmonera" />
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
          </CardContent>
        </Card>
      )}

      {/* Selección de Contratista */}
      {(userContext?.canSelectContratista || userContext?.isSalmonera) && selectedSalmonera && (
        <Card>
          <CardContent className="pt-6">
            <div>
              <Label htmlFor="contratista">Contratista *</Label>
              <Select value={selectedContratista} onValueChange={setSelectedContratista}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar contratista" />
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
          </CardContent>
        </Card>
      )}

      {/* Operación o Código Externo */}
      <Card>
        <CardHeader>
          <CardTitle>
            {isPlanned ? 'Operación Asociada' : 'Código de Operación Externa'}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isPlanned ? (
            <div>
              <Label htmlFor="operacion">Operación *</Label>
              <Select value={formData.operacion_id} onValueChange={(value) => handleInputChange('operacion_id', value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar operación" />
                </SelectTrigger>
                <SelectContent>
                  {operations.map((operation) => (
                    <SelectItem key={operation.id} value={operation.id}>
                      {operation.codigo} - {operation.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {operations.length === 0 && selectedSalmonera && selectedContratista && (
                <p className="text-sm text-amber-600 mt-2">
                  No hay operaciones disponibles. 
                  <Button variant="link" className="p-0 h-auto text-amber-600">
                    Crear nueva operación
                  </Button>
                </p>
              )}
            </div>
          ) : (
            <div>
              <Label htmlFor="external_code">Código de Operación Externa *</Label>
              <Input
                id="external_code"
                value={formData.external_operation_code}
                onChange={(e) => handleInputChange('external_operation_code', e.target.value)}
                placeholder="Ej: OP-EXT-2024-001"
                required={!isPlanned}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Datos Básicos de la Inmersión */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="w-5 h-5" />
            Datos de la Inmersión
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="codigo">Código *</Label>
              <Input
                id="codigo"
                value={formData.codigo}
                onChange={(e) => handleInputChange('codigo', e.target.value)}
                placeholder="INM-2024-001"
                required
              />
            </div>
            <div>
              <Label htmlFor="fecha">Fecha *</Label>
              <Input
                id="fecha"
                type="date"
                value={formData.fecha_inmersion}
                onChange={(e) => handleInputChange('fecha_inmersion', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="hora_inicio">Hora de Inicio *</Label>
              <Input
                id="hora_inicio"
                type="time"
                value={formData.hora_inicio}
                onChange={(e) => handleInputChange('hora_inicio', e.target.value)}
                required
              />
            </div>
            <div>
              <Label htmlFor="profundidad">Profundidad Máxima (m) *</Label>
              <Input
                id="profundidad"
                type="number"
                value={formData.profundidad_max}
                onChange={(e) => handleInputChange('profundidad_max', e.target.value)}
                placeholder="0"
                min="0"
                step="0.1"
                required
              />
            </div>
          </div>

          <div>
            <Label htmlFor="objetivo">Objetivo *</Label>
            <Textarea
              id="objetivo"
              value={formData.objetivo}
              onChange={(e) => handleInputChange('objetivo', e.target.value)}
              placeholder="Describir el objetivo de la inmersión"
              required
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="temperatura">Temperatura Agua (°C) *</Label>
              <Input
                id="temperatura"
                type="number"
                value={formData.temperatura_agua}
                onChange={(e) => handleInputChange('temperatura_agua', e.target.value)}
                placeholder="0"
                step="0.1"
                required
              />
            </div>
            <div>
              <Label htmlFor="visibilidad">Visibilidad (m) *</Label>
              <Input
                id="visibilidad"
                type="number"
                value={formData.visibilidad}
                onChange={(e) => handleInputChange('visibilidad', e.target.value)}
                placeholder="0"
                step="0.1"
                required
              />
            </div>
            <div>
              <Label htmlFor="corriente">Corriente *</Label>
              <Input
                id="corriente"
                value={formData.corriente}
                onChange={(e) => handleInputChange('corriente', e.target.value)}
                placeholder="Leve, Moderada, Fuerte"
                required
              />
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Personal */}
      <Card>
        <CardHeader>
          <CardTitle>Personal de Buceo</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="supervisor">Supervisor *</Label>
            <Input
              id="supervisor"
              value={formData.supervisor}
              onChange={(e) => handleInputChange('supervisor', e.target.value)}
              placeholder="Nombre del supervisor"
              required
            />
          </div>
          <div>
            <Label htmlFor="buzo_principal">Buzo Principal *</Label>
            <Input
              id="buzo_principal"
              value={formData.buzo_principal}
              onChange={(e) => handleInputChange('buzo_principal', e.target.value)}
              placeholder="Nombre del buzo principal"
              required
            />
          </div>
          <div>
            <Label htmlFor="buzo_asistente">Buzo Asistente</Label>
            <Input
              id="buzo_asistente"
              value={formData.buzo_asistente}
              onChange={(e) => handleInputChange('buzo_asistente', e.target.value)}
              placeholder="Nombre del buzo asistente (opcional)"
            />
          </div>
        </CardContent>
      </Card>

      {/* Observaciones */}
      <Card>
        <CardContent className="pt-6">
          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => handleInputChange('observaciones', e.target.value)}
              placeholder="Observaciones adicionales (opcional)"
              rows={3}
            />
          </div>
        </CardContent>
      </Card>

      {/* Botones */}
      <div className="flex justify-end space-x-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Creando...' : `Crear Inmersión ${isPlanned ? 'Planificada' : 'Independiente'}`}
        </Button>
      </div>
    </form>
  );
};
