
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Anchor, Calendar } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { useInmersiones, ValidationStatus } from "@/hooks/useInmersiones";

interface InmersionWizardProps {
  operacionId?: string;
  onComplete: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const InmersionWizard = ({ operacionId: initialOperacionId, onComplete, onCancel }: InmersionWizardProps) => {
  const { toast } = useToast();
  const { operaciones } = useOperaciones();
  const { equipos } = useEquiposBuceoEnhanced();
  const { validateOperationDocuments } = useInmersiones();
  
  const [selectedOperacionId, setSelectedOperacionId] = useState(initialOperacionId || '');
  const [validationStatus, setValidationStatus] = useState<ValidationStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [teamMembers, setTeamMembers] = useState<any[]>([]);
  
  const [formData, setFormData] = useState({
    codigo: '',
    fecha_inmersion: new Date().toISOString().split('T')[0],
    hora_inicio: '',
    hora_fin: '',
    operacion_id: initialOperacionId || '',
    buzo_principal: '',
    buzo_principal_id: '',
    buzo_asistente: '',
    buzo_asistente_id: '',
    supervisor: '',
    supervisor_id: '',
    objetivo: '',
    estado: 'planificada',
    profundidad_max: 0,
    temperatura_agua: 15,
    visibilidad: 5,
    corriente: 'baja',
    observaciones: '',
    hpt_validado: false,
    anexo_bravo_validado: false,
  });

  // Cargar y poblar datos cuando se selecciona una operación
  useEffect(() => {
    const loadOperationData = async () => {
      if (!selectedOperacionId) return;

      try {
        setIsLoading(true);
        
        // Validar documentos de la operación
        const validation = await validateOperationDocuments(selectedOperacionId);
        setValidationStatus(validation);

        // Obtener datos de la operación
        const operacion = operaciones.find(op => op.id === selectedOperacionId);
        if (!operacion) return;

        // Encontrar equipo de buceo y sus miembros
        let equipo = null;
        let miembros: any[] = [];
        let supervisor = null;
        let buzoPrincipal = null;
        let buzoAsistente = null;

        if (operacion.equipo_buceo_id) {
          equipo = equipos.find(e => e.id === operacion.equipo_buceo_id);
          if (equipo) {
            miembros = equipo.miembros || [];
            supervisor = miembros.find(m => m.rol === 'supervisor');
            buzoPrincipal = miembros.find(m => m.rol === 'buzo_principal');
            buzoAsistente = miembros.find(m => m.rol === 'buzo_asistente' || (m.rol === 'buzo' && m.id !== buzoPrincipal?.id));
          }
        }

        setTeamMembers(miembros);

        // Generar código único
        const codigo = `INM-${operacion.codigo}-${Date.now().toString().slice(-4)}`;

        // Poblar formulario con datos de la operación
        setFormData(prev => ({
          ...prev,
          codigo,
          operacion_id: selectedOperacionId,
          buzo_principal: buzoPrincipal?.nombre_completo || '',
          buzo_principal_id: buzoPrincipal?.id || '',
          buzo_asistente: buzoAsistente?.nombre_completo || '',
          buzo_asistente_id: buzoAsistente?.id || '',
          supervisor: supervisor?.nombre_completo || '',
          supervisor_id: supervisor?.id || '',
          objetivo: operacion.tareas || 'Operación de buceo comercial',
          hpt_validado: validation.hasValidHPT,
          anexo_bravo_validado: validation.hasValidAnexoBravo,
        }));

        console.log('Operation data loaded for inmersion:', {
          operacion,
          equipo,
          miembros,
          validation
        });

      } catch (error) {
        console.error('Error loading operation data:', error);
        toast({
          title: "Error",
          description: "No se pudieron cargar los datos de la operación",
          variant: "destructive",
        });
      } finally {
        setIsLoading(false);
      }
    };

    loadOperationData();
  }, [selectedOperacionId, operaciones, equipos, validateOperationDocuments, toast]);

  const handleOperacionChange = (operacionId: string) => {
    setSelectedOperacionId(operacionId);
    setFormData(prev => ({ ...prev, operacion_id: operacionId }));
  };

  const handleBuzoPrincipalChange = (value: string) => {
    const miembro = teamMembers.find(m => m.id === value);
    if (miembro) {
      setFormData(prev => ({
        ...prev,
        buzo_principal: miembro.nombre_completo,
        buzo_principal_id: miembro.id
      }));
    }
  };

  const handleBuzoAsistenteChange = (value: string) => {
    const miembro = teamMembers.find(m => m.id === value);
    if (miembro) {
      setFormData(prev => ({
        ...prev,
        buzo_asistente: miembro.nombre_completo,
        buzo_asistente_id: miembro.id
      }));
    }
  };

  const handleSupervisorChange = (value: string) => {
    const miembro = teamMembers.find(m => m.id === value);
    if (miembro) {
      setFormData(prev => ({
        ...prev,
        supervisor: miembro.nombre_completo,
        supervisor_id: miembro.id
      }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validationStatus?.canExecute) {
      toast({
        title: "Documentos incompletos",
        description: "La operación debe tener HPT y Anexo Bravo firmados para crear inmersiones",
        variant: "destructive",
      });
      return;
    }

    try {
      setIsLoading(true);
      await onComplete(formData);
    } catch (error) {
      console.error('Error creating inmersion:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Filtrar operaciones que no tienen inmersiones planificadas
  const availableOperaciones = operaciones.filter(op => op.estado === 'activa');

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card className="ios-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Anchor className="w-5 h-5 text-blue-600" />
            Nueva Inmersión
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Selección de Operación */}
            <div>
              <Label htmlFor="operacion">Operación *</Label>
              <Select 
                value={selectedOperacionId} 
                onValueChange={handleOperacionChange}
                disabled={!!initialOperacionId}
              >
                <SelectTrigger className="ios-input">
                  <SelectValue placeholder="Seleccione una operación" />
                </SelectTrigger>
                <SelectContent>
                  {availableOperaciones.map((operacion) => (
                    <SelectItem key={operacion.id} value={operacion.id}>
                      {operacion.codigo} - {operacion.nombre}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Estado de Validación */}
            {validationStatus && (
              <div className={`p-4 rounded-lg border ${
                validationStatus.canExecute 
                  ? 'bg-green-50 border-green-200' 
                  : 'bg-yellow-50 border-yellow-200'
              }`}>
                <h4 className="font-medium mb-2">Estado de Documentos</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div className="flex items-center gap-2">
                    <span className={validationStatus.hasValidHPT ? 'text-green-600' : 'text-red-600'}>
                      {validationStatus.hasValidHPT ? '✓' : '✗'}
                    </span>
                    <span>HPT: {validationStatus.hptCode || 'No disponible'}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={validationStatus.hasValidAnexoBravo ? 'text-green-600' : 'text-red-600'}>
                      {validationStatus.hasValidAnexoBravo ? '✓' : '✗'}
                    </span>
                    <span>Anexo Bravo: {validationStatus.anexoBravoCode || 'No disponible'}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Información Básica */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="codigo">Código</Label>
                <Input
                  id="codigo"
                  value={formData.codigo}
                  onChange={(e) => handleChange('codigo', e.target.value)}
                  className="ios-input"
                  readOnly
                />
              </div>
              
              <div>
                <Label htmlFor="fecha_inmersion">Fecha de Inmersión *</Label>
                <Input
                  id="fecha_inmersion"
                  type="date"
                  value={formData.fecha_inmersion}
                  onChange={(e) => handleChange('fecha_inmersion', e.target.value)}
                  className="ios-input"
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hora_inicio">Hora de Inicio *</Label>
                <Input
                  id="hora_inicio"
                  type="time"
                  value={formData.hora_inicio}
                  onChange={(e) => handleChange('hora_inicio', e.target.value)}
                  className="ios-input"
                  required
                />
              </div>
              
              <div>
                <Label htmlFor="hora_fin">Hora de Fin (Estimada)</Label>
                <Input
                  id="hora_fin"
                  type="time"
                  value={formData.hora_fin}
                  onChange={(e) => handleChange('hora_fin', e.target.value)}
                  className="ios-input"
                />
              </div>
            </div>

            {/* Personal */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="supervisor">Supervisor *</Label>
                <Select 
                  value={formData.supervisor_id} 
                  onValueChange={handleSupervisorChange}
                >
                  <SelectTrigger className="ios-input">
                    <SelectValue placeholder="Seleccionar supervisor" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.filter(m => m.rol === 'supervisor').map((miembro) => (
                      <SelectItem key={miembro.id} value={miembro.id}>
                        {miembro.nombre_completo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="buzo_principal">Buzo Principal *</Label>
                <Select 
                  value={formData.buzo_principal_id} 
                  onValueChange={handleBuzoPrincipalChange}
                >
                  <SelectTrigger className="ios-input">
                    <SelectValue placeholder="Seleccionar buzo principal" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.filter(m => m.rol.includes('buzo')).map((miembro) => (
                      <SelectItem key={miembro.id} value={miembro.id}>
                        {miembro.nombre_completo} - {miembro.rol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="buzo_asistente">Buzo Asistente</Label>
                <Select 
                  value={formData.buzo_asistente_id} 
                  onValueChange={handleBuzoAsistenteChange}
                >
                  <SelectTrigger className="ios-input">
                    <SelectValue placeholder="Seleccionar buzo asistente" />
                  </SelectTrigger>
                  <SelectContent>
                    {teamMembers.filter(m => 
                      m.rol.includes('buzo') && m.id !== formData.buzo_principal_id
                    ).map((miembro) => (
                      <SelectItem key={miembro.id} value={miembro.id}>
                        {miembro.nombre_completo} - {miembro.rol}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Condiciones */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <Label htmlFor="profundidad_max">Profundidad Máxima (m) *</Label>
                <Input
                  id="profundidad_max"
                  type="number"
                  value={formData.profundidad_max}
                  onChange={(e) => handleChange('profundidad_max', Number(e.target.value))}
                  className="ios-input"
                  required
                  min="0"
                  step="0.1"
                />
              </div>
              
              <div>
                <Label htmlFor="temperatura_agua">Temperatura (°C) *</Label>
                <Input
                  id="temperatura_agua"
                  type="number"
                  value={formData.temperatura_agua}
                  onChange={(e) => handleChange('temperatura_agua', Number(e.target.value))}
                  className="ios-input"
                  required
                  step="0.1"
                />
              </div>

              <div>
                <Label htmlFor="visibilidad">Visibilidad (m) *</Label>
                <Input
                  id="visibilidad"
                  type="number"
                  value={formData.visibilidad}
                  onChange={(e) => handleChange('visibilidad', Number(e.target.value))}
                  className="ios-input"
                  required
                  min="0"
                  step="0.1"
                />
              </div>

              <div>
                <Label htmlFor="corriente">Corriente *</Label>
                <Select 
                  value={formData.corriente} 
                  onValueChange={(value) => handleChange('corriente', value)}
                >
                  <SelectTrigger className="ios-input">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="nula">Nula</SelectItem>
                    <SelectItem value="baja">Baja</SelectItem>
                    <SelectItem value="media">Media</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Objetivo */}
            <div>
              <Label htmlFor="objetivo">Objetivo de la Inmersión *</Label>
              <Textarea
                id="objetivo"
                value={formData.objetivo}
                onChange={(e) => handleChange('objetivo', e.target.value)}
                className="ios-input min-h-[100px]"
                placeholder="Describa el objetivo y tareas a realizar durante la inmersión..."
                required
              />
            </div>

            {/* Observaciones */}
            <div>
              <Label htmlFor="observaciones">Observaciones</Label>
              <Textarea
                id="observaciones"
                value={formData.observaciones}
                onChange={(e) => handleChange('observaciones', e.target.value)}
                className="ios-input min-h-[80px]"
                placeholder="Observaciones adicionales..."
              />
            </div>

            {/* Botones */}
            <div className="flex justify-end gap-3 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
                className="ios-button"
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isLoading || !validationStatus?.canExecute}
                className="ios-button bg-blue-600 hover:bg-blue-700 text-white"
              >
                {isLoading ? 'Creando...' : 'Crear Inmersión'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
