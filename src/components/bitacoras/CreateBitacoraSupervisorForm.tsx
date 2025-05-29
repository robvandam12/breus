
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EnhancedSelect } from '@/components/ui/enhanced-select';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useEquiposBuceo } from '@/hooks/useEquiposBuceo';

interface CreateBitacoraSupervisorFormProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

export const CreateBitacoraSupervisorForm = ({ onSubmit, onCancel }: CreateBitacoraSupervisorFormProps) => {
  const [selectedInmersion, setSelectedInmersion] = useState('');
  const [selectedBuzos, setSelectedBuzos] = useState<string[]>([]);
  const [observaciones, setObservaciones] = useState('');
  const [condicionesAmbientales, setCondicionesAmbientales] = useState('');
  
  const { inmersiones, isLoading: loadingInmersiones } = useInmersiones();
  const { equipos, isLoading: loadingEquipos } = useEquiposBuceo();

  // Get team members from the selected inmersion's operation
  const getTeamMembers = () => {
    if (!selectedInmersion) return [];
    
    const inmersion = inmersiones.find(i => i.inmersion_id === selectedInmersion);
    if (!inmersion) return [];

    // Find team for this operation
    const operationTeam = equipos.find(e => e.operacion_id === inmersion.operacion_id);
    if (!operationTeam || !operationTeam.miembros) return [];

    return operationTeam.miembros.map(member => ({
      value: member.usuario_id,
      label: `${member.nombre} ${member.apellido} - ${member.rol}`
    }));
  };

  const handleBuzoToggle = (buzoId: string) => {
    setSelectedBuzos(prev => 
      prev.includes(buzoId) 
        ? prev.filter(id => id !== buzoId)
        : [...prev, buzoId]
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedInmersion) {
      alert('Debe seleccionar una inmersión');
      return;
    }

    // Get selected team members details
    const teamMembers = getTeamMembers();
    const selectedMembersData = selectedBuzos.map(buzoId => {
      const member = teamMembers.find(tm => tm.value === buzoId);
      return {
        buzo_id: buzoId,
        buzo_nombre: member?.label.split(' - ')[0] || '',
        profundidad_maxima: 0,
        hora_dejo_superficie: '',
        hora_llego_superficie: '',
        tiempo_descenso: 0,
        tiempo_fondo: 0,
        tiempo_ascenso: 0,
        tabulacion_usada: '',
        tiempo_usado: 0
      };
    });

    const formData = {
      inmersion_id: selectedInmersion,
      observaciones,
      condiciones_ambientales: condicionesAmbientales,
      bitacora_supervisor_buzos: selectedMembersData,
    };

    onSubmit(formData);
  };

  const inmersionOptions = inmersiones.map(inmersion => ({
    value: inmersion.inmersion_id,
    label: `${inmersion.codigo} - ${inmersion.buzo_principal}`
  }));

  const teamMembers = getTeamMembers();

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Seleccionar Inmersión</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="inmersion">Inmersión</Label>
            <EnhancedSelect
              value={selectedInmersion}
              onValueChange={setSelectedInmersion}
              options={inmersionOptions}
              placeholder="Seleccione una inmersión..."
              disabled={loadingInmersiones}
            />
          </div>
        </CardContent>
      </Card>

      {selectedInmersion && (
        <Card>
          <CardHeader>
            <CardTitle>Equipo de Buceo</CardTitle>
          </CardHeader>
          <CardContent>
            {teamMembers.length > 0 ? (
              <div className="space-y-2">
                {teamMembers.map((member) => (
                  <div key={member.value} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={member.value}
                      checked={selectedBuzos.includes(member.value)}
                      onChange={() => handleBuzoToggle(member.value)}
                      className="w-4 h-4"
                    />
                    <Label htmlFor={member.value}>{member.label}</Label>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No hay equipo asignado a esta operación</p>
            )}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Detalles de la Bitácora</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="condiciones">Condiciones Ambientales</Label>
            <Textarea
              id="condiciones"
              value={condicionesAmbientales}
              onChange={(e) => setCondicionesAmbientales(e.target.value)}
              placeholder="Describa las condiciones ambientales..."
              rows={3}
            />
          </div>

          <div>
            <Label htmlFor="observaciones">Observaciones</Label>
            <Textarea
              id="observaciones"
              value={observaciones}
              onChange={(e) => setObservaciones(e.target.value)}
              placeholder="Observaciones generales..."
              rows={4}
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-2 justify-end">
        <Button type="button" variant="outline" onClick={onCancel}>
          Cancelar
        </Button>
        <Button type="submit">
          Crear Bitácora
        </Button>
      </div>
    </form>
  );
};
