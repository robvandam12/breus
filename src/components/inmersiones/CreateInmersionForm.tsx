
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { EnhancedSelect } from "@/components/ui/enhanced-select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Anchor, Users, FileText, CheckCircle } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useInmersiones } from "@/hooks/useInmersiones";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface CreateInmersionFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  defaultOperacionId?: string;
}

export const CreateInmersionForm = ({ onSubmit, onCancel, defaultOperacionId }: CreateInmersionFormProps) => {
  const { operaciones } = useOperaciones();
  const { getOperationCompleteData } = useInmersiones();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [operationData, setOperationData] = useState<any>(null);
  const [loadingOperationData, setLoadingOperationData] = useState(false);
  
  const [formData, setFormData] = useState({
    operacion_id: defaultOperacionId || "",
    codigo: "",
    buzo_principal: "",
    buzo_asistente: "",
    supervisor: "",
    fecha_inmersion: new Date().toISOString().split('T')[0],
    hora_inicio: "",
    hora_fin: "",
    profundidad_max: "",
    temperatura_agua: "",
    visibilidad: "",
    corriente: "",
    objetivo: "",
    observaciones: ""
  });

  // Cargar datos automáticamente cuando se selecciona una operación
  useEffect(() => {
    if (formData.operacion_id) {
      loadOperationData(formData.operacion_id);
    }
  }, [formData.operacion_id]);

  const loadOperationData = async (operacionId: string) => {
    setLoadingOperationData(true);
    try {
      const data = await getOperationCompleteData(operacionId);
      if (data) {
        setOperationData(data);
        
        // Auto-poblar campos
        const updatedFormData = { ...formData };
        
        // Poblar supervisor desde HPT o Anexo Bravo
        if (data.hpt?.supervisor && !updatedFormData.supervisor) {
          updatedFormData.supervisor = data.hpt.supervisor;
        } else if (data.anexoBravo?.supervisor && !updatedFormData.supervisor) {
          updatedFormData.supervisor = data.anexoBravo.supervisor;
        }

        // Poblar buzos desde el equipo de buceo
        if (data.equipoBuceo?.miembros) {
          const buzoPrincipal = data.equipoBuceo.miembros.find(m => 
            m.rol_equipo === 'buzo_principal' || m.rol_equipo === 'supervisor'
          );
          const buzoAsistente = data.equipoBuceo.miembros.find(m => 
            m.rol_equipo === 'buzo_asistente' || m.rol_equipo === 'buzo'
          );

          if (buzoPrincipal?.nombre && !updatedFormData.buzo_principal) {
            updatedFormData.buzo_principal = buzoPrincipal.nombre;
          }

          if (buzoAsistente?.nombre && !updatedFormData.buzo_asistente) {
            updatedFormData.buzo_asistente = buzoAsistente.nombre;
          }
        }

        // Generar código automático
        if (!updatedFormData.codigo) {
          const timestamp = Date.now().toString().slice(-6);
          updatedFormData.codigo = `INM-${data.operacion.codigo}-${timestamp}`;
        }

        setFormData(updatedFormData);
      }
    } catch (error) {
      console.error('Error loading operation data:', error);
    } finally {
      setLoadingOperationData(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const submitData = {
        ...formData,
        profundidad_max: formData.profundidad_max ? parseFloat(formData.profundidad_max) : 0,
        temperatura_agua: formData.temperatura_agua ? parseFloat(formData.temperatura_agua) : 0,
        visibilidad: formData.visibilidad ? parseFloat(formData.visibilidad) : 0,
      };
      await onSubmit(submitData);
    } catch (error) {
      console.error('Error creating inmersion:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const operacionOptions = operaciones.map(op => ({
    value: op.id,
    label: `${op.codigo} - ${op.nombre}`
  }));

  return (
    <Card>
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
            <Label htmlFor="operacion_id">Operación *</Label>
            <EnhancedSelect
              options={operacionOptions}
              value={formData.operacion_id}
              onValueChange={(value) => setFormData(prev => ({ ...prev, operacion_id: value }))}
              placeholder="Seleccione una operación"
              className="w-full"
            />
          </div>

          {/* Información de la operación cargada */}
          {loadingOperationData && (
            <Alert>
              <AlertDescription>Cargando datos de la operación...</AlertDescription>
            </Alert>
          )}

          {operationData && (
            <Alert>
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                <div className="space-y-2">
                  <div><strong>Operación:</strong> {operationData.operacion?.nombre}</div>
                  {operationData.hpt && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span>HPT: {operationData.hpt.codigo} (Firmado)</span>
                    </div>
                  )}
                  {operationData.anexoBravo && (
                    <div className="flex items-center gap-2">
                      <FileText className="h-4 w-4 text-green-600" />
                      <span>Anexo Bravo: {operationData.anexoBravo.codigo} (Firmado)</span>
                    </div>
                  )}
                  {operationData.equipoBuceo && (
                    <div className="flex items-center gap-2">
                      <Users className="h-4 w-4 text-blue-600" />
                      <span>Equipo: {operationData.equipoBuceo.nombre} ({operationData.equipoBuceo.miembros?.length || 0} miembros)</span>
                    </div>
                  )}
                </div>
              </AlertDescription>
            </Alert>
          )}

          {/* Código generado automáticamente */}
          <div>
            <Label htmlFor="codigo">Código</Label>
            <Input
              id="codigo"
              value={formData.codigo}
              onChange={(e) => setFormData(prev => ({ ...prev, codigo: e.target.value }))}
              placeholder="Se generará automáticamente"
              className="bg-gray-50"
            />
          </div>

          {/* Personal (poblado automáticamente) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="buzo_principal">Buzo Principal *</Label>
              <Input
                id="buzo_principal"
                value={formData.buzo_principal}
                onChange={(e) => setFormData(prev => ({ ...prev, buzo_principal: e.target.value }))}
                placeholder="Se poblará desde el equipo de buceo"
                required
              />
            </div>

            <div>
              <Label htmlFor="buzo_asistente">Buzo Asistente</Label>
              <Input
                id="buzo_asistente"
                value={formData.buzo_asistente}
                onChange={(e) => setFormData(prev => ({ ...prev, buzo_asistente: e.target.value }))}
                placeholder="Se poblará desde el equipo de buceo"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="supervisor">Supervisor *</Label>
            <Input
              id="supervisor"
              value={formData.supervisor}
              onChange={(e) => setFormData(prev => ({ ...prev, supervisor: e.target.value }))}
              placeholder="Se poblará desde HPT/Anexo Bravo"
              required
            />
          </div>

          {/* Resto de campos del formulario */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="fecha_inmersion">Fecha de Inmersión</Label>
              <Input
                type="date"
                id="fecha_inmersion"
                value={formData.fecha_inmersion}
                onChange={(e) => setFormData(prev => ({ ...prev, fecha_inmersion: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="hora_inicio">Hora Inicio</Label>
              <Input
                type="time"
                id="hora_inicio"
                value={formData.hora_inicio}
                onChange={(e) => setFormData(prev => ({ ...prev, hora_inicio: e.target.value }))}
              />
            </div>

            <div>
              <Label htmlFor="hora_fin">Hora Fin</Label>
              <Input
                type="time"
                id="hora_fin"
                value={formData.hora_fin}
                onChange={(e) => setFormData(prev => ({ ...prev, hora_fin: e.target.value }))}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <Label htmlFor="profundidad_max">Profundidad Máxima (m)</Label>
              <Input
                type="number"
                step="0.1"
                id="profundidad_max"
                value={formData.profundidad_max}
                onChange={(e) => setFormData(prev => ({ ...prev, profundidad_max: e.target.value }))}
                placeholder="0.0"
              />
            </div>

            <div>
              <Label htmlFor="temperatura_agua">Temperatura Agua (°C)</Label>
              <Input
                type="number"
                step="0.1"
                id="temperatura_agua"
                value={formData.temperatura_agua}
                onChange={(e) => setFormData(prev => ({ ...prev, temperatura_agua: e.target.value }))}
                placeholder="0.0"
              />
            </div>

            <div>
              <Label htmlFor="visibilidad">Visibilidad (m)</Label>
              <Input
                type="number"
                step="0.1"
                id="visibilidad"
                value={formData.visibilidad}
                onChange={(e) => setFormData(prev => ({ ...prev, visibilidad: e.target.value }))}
                placeholder="0.0"
              />
            </div>
          </div>

          <div>
            <Label htmlFor="corriente">Corriente</Label>
            <Input
              id="corriente"
              value={formData.corriente}
              onChange={(e) => setFormData(prev => ({ ...prev, corriente: e.target.value }))}
              placeholder="Descripción de la corriente"
            />
          </div>

          <div>
            <Label htmlFor="objetivo">Objetivo *</Label>
            <Textarea
              id="objetivo"
              value={formData.objetivo}
              onChange={(e) => setFormData(prev => ({ ...prev, objetivo: e.target.value }))}
              placeholder="Objetivo de la inmersión"
              required
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={formData.observaciones}
              onChange={(e) => setFormData(prev => ({ ...prev, observaciones: e.target.value }))}
              placeholder="Observaciones adicionales"
              rows={3}
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button 
              type="submit" 
              disabled={!formData.operacion_id || !formData.buzo_principal || !formData.supervisor || !formData.objetivo || isSubmitting}
              className="flex-1"
            >
              {isSubmitting ? 'Creando...' : 'Crear Inmersión'}
            </Button>
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
