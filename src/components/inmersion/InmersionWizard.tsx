
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { CalendarIcon, Clock, Waves, Users } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { InmersionTeamManager } from "@/components/inmersiones/InmersionTeamManager";
import { toast } from "@/hooks/use-toast";

interface InmersionWizardProps {
  onComplete: (data: any) => void;
  onCancel: () => void;
  operationId?: string;
}

interface TeamMember {
  id: string;
  usuario_id: string;
  nombre: string;
  apellido: string;
  rol: 'supervisor' | 'buzo_principal' | 'buzo_asistente';
  email: string;
}

export const InmersionWizard = ({ onComplete, onCancel, operationId }: InmersionWizardProps) => {
  const { operaciones } = useOperaciones();
  const [step, setStep] = useState(1);
  const [team, setTeam] = useState<TeamMember[]>([]);
  
  const [formData, setFormData] = useState({
    codigo: '',
    operacion_id: operationId || '',
    fecha_inmersion: '',
    hora_inicio: '',
    hora_fin: '',
    objetivo: '',
    observaciones: '',
    profundidad_max: 0,
    temperatura_agua: 0,
    visibilidad: 0,
    corriente: 'leve',
    supervisor: '',
    supervisor_id: '',
    buzo_principal: '',
    buzo_principal_id: '',
    buzo_asistente: '',
    buzo_asistente_id: '',
    estado: 'planificada'
  });

  // Generate código when operation changes
  useEffect(() => {
    if (formData.operacion_id) {
      const operation = operaciones.find(op => op.id === formData.operacion_id);
      if (operation) {
        const timestamp = Date.now().toString().slice(-4);
        const codigo = `INM-${operation.codigo}-${timestamp}`;
        setFormData(prev => ({ ...prev, codigo }));
        
        // Auto-populate objetivo with operation name
        setFormData(prev => ({ 
          ...prev, 
          objetivo: `Inmersión para ${operation.nombre}` 
        }));
        
        console.log('Populating inmersion data for operation:', formData.operacion_id);
        console.log('Operation:', operation);
      }
    }
  }, [formData.operacion_id, operaciones]);

  // Auto-populate team members when available
  useEffect(() => {
    if (team.length > 0) {
      const supervisor = team.find(member => member.rol === 'supervisor');
      const buzoPrincipal = team.find(member => member.rol === 'buzo_principal');
      const buzoAsistente = team.find(member => member.rol === 'buzo_asistente');

      setFormData(prev => ({
        ...prev,
        supervisor: supervisor ? `${supervisor.nombre} ${supervisor.apellido}` : '',
        supervisor_id: supervisor?.usuario_id || null,
        buzo_principal: buzoPrincipal ? `${buzoPrincipal.nombre} ${buzoPrincipal.apellido}` : '',
        buzo_principal_id: buzoPrincipal?.usuario_id || null,
        buzo_asistente: buzoAsistente ? `${buzoAsistente.nombre} ${buzoAsistente.apellido}` : '',
        buzo_asistente_id: buzoAsistente?.usuario_id || null,
      }));
    }
  }, [team]);

  const handleAddMember = (member: Omit<TeamMember, 'id'>) => {
    const newMember = {
      ...member,
      id: Date.now().toString()
    };
    setTeam([...team, newMember]);
  };

  const handleRemoveMember = (memberId: string) => {
    setTeam(team.filter(member => member.id !== memberId));
  };

  const handleSubmit = () => {
    console.log('Inmersion form data:', formData);
    
    // Ensure all required UUID fields have valid values or null
    const cleanFormData = {
      ...formData,
      supervisor_id: formData.supervisor_id || null,
      buzo_principal_id: formData.buzo_principal_id || null,
      buzo_asistente_id: formData.buzo_asistente_id || null,
    };
    
    // Remove empty string UUIDs
    Object.keys(cleanFormData).forEach(key => {
      if (typeof cleanFormData[key] === 'string' && cleanFormData[key] === '' && key.includes('_id')) {
        cleanFormData[key] = null;
      }
    });
    
    console.log('Clean inmersion data:', cleanFormData);
    onComplete(cleanFormData);
  };

  const handleInviteUser = (userData: any) => {
    toast({
      title: "Invitación enviada",
      description: "Se ha enviado una invitación al usuario.",
    });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const renderStep1 = () => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Waves className="w-5 h-5" />
          Información Básica de la Inmersión
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="operacion">Operación</Label>
            <Select 
              value={formData.operacion_id} 
              onValueChange={(value) => setFormData({...formData, operacion_id: value})}
              disabled={!!operationId}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar operación" />
              </SelectTrigger>
              <SelectContent>
                {operaciones.map((op) => (
                  <SelectItem key={op.id} value={op.id}>
                    {op.codigo} - {op.nombre}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div>
            <Label htmlFor="codigo">Código de Inmersión</Label>
            <Input
              id="codigo"
              value={formData.codigo}
              onChange={(e) => setFormData({...formData, codigo: e.target.value})}
              placeholder="INM-001"
            />
          </div>

          <div>
            <Label htmlFor="fecha">Fecha de Inmersión</Label>
            <Input
              id="fecha"
              type="date"
              value={formData.fecha_inmersion}
              onChange={(e) => setFormData({...formData, fecha_inmersion: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="hora_inicio">Hora de Inicio</Label>
            <Input
              id="hora_inicio"
              type="time"
              value={formData.hora_inicio}
              onChange={(e) => setFormData({...formData, hora_inicio: e.target.value})}
            />
          </div>

          <div>
            <Label htmlFor="hora_fin">Hora de Fin (Opcional)</Label>
            <Input
              id="hora_fin"
              type="time"
              value={formData.hora_fin}
              onChange={(e) => setFormData({...formData, hora_fin: e.target.value})}
            />
          </div>
        </div>

        <div>
          <Label htmlFor="objetivo">Objetivo de la Inmersión</Label>
          <Textarea
            id="objetivo"
            value={formData.objetivo}
            onChange={(e) => setFormData({...formData, objetivo: e.target.value})}
            placeholder="Describir el objetivo principal de la inmersión"
          />
        </div>

        <div>
          <Label htmlFor="observaciones">Observaciones</Label>
          <Textarea
            id="observaciones"
            value={formData.observaciones}
            onChange={(e) => setFormData({...formData, observaciones: e.target.value})}
            placeholder="Observaciones adicionales (opcional)"
          />
        </div>
      </CardContent>
    </Card>
  );

  const renderStep2 = () => (
    <Card>
      <CardHeader>
        <CardTitle>Condiciones de Inmersión</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <Label htmlFor="profundidad">Profundidad Máxima (metros)</Label>
            <Input
              id="profundidad"
              type="number"
              value={formData.profundidad_max}
              onChange={(e) => setFormData({...formData, profundidad_max: parseFloat(e.target.value) || 0})}
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <Label htmlFor="temperatura">Temperatura del Agua (°C)</Label>
            <Input
              id="temperatura"
              type="number"
              value={formData.temperatura_agua}
              onChange={(e) => setFormData({...formData, temperatura_agua: parseFloat(e.target.value) || 0})}
              placeholder="0"
              step="0.1"
            />
          </div>

          <div>
            <Label htmlFor="visibilidad">Visibilidad (metros)</Label>
            <Input
              id="visibilidad"
              type="number"
              value={formData.visibilidad}
              onChange={(e) => setFormData({...formData, visibilidad: parseFloat(e.target.value) || 0})}
              placeholder="0"
              min="0"
              step="0.1"
            />
          </div>

          <div>
            <Label htmlFor="corriente">Corriente</Label>
            <Select 
              value={formData.corriente} 
              onValueChange={(value) => setFormData({...formData, corriente: value})}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="nula">Nula</SelectItem>
                <SelectItem value="leve">Leve</SelectItem>
                <SelectItem value="moderada">Moderada</SelectItem>
                <SelectItem value="fuerte">Fuerte</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  const renderStep3 = () => (
    <InmersionTeamManager
      inmersionId="new"
      team={team}
      onAddMember={handleAddMember}
      onRemoveMember={handleRemoveMember}
      onInviteUser={handleInviteUser}
    />
  );

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Progress indicator */}
      <div className="flex items-center justify-center space-x-4 mb-8">
        {[1, 2, 3].map((stepNumber) => (
          <div key={stepNumber} className="flex items-center">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
              step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              {stepNumber}
            </div>
            {stepNumber < 3 && (
              <div className={`w-16 h-1 ml-4 ${
                step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
              }`} />
            )}
          </div>
        ))}
      </div>

      {/* Step content */}
      {step === 1 && renderStep1()}
      {step === 2 && renderStep2()}
      {step === 3 && renderStep3()}

      {/* Navigation buttons */}
      <div className="flex justify-between pt-6">
        <div>
          {step > 1 && (
            <Button variant="outline" onClick={prevStep}>
              Anterior
            </Button>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          
          {step < 3 ? (
            <Button onClick={nextStep}>
              Siguiente
            </Button>
          ) : (
            <Button onClick={handleSubmit}>
              Crear Inmersión
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
