
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Trash2, Users } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";

interface PersonalData {
  supervisor_nombre: string;
  supervisor_apellido: string;
  buzo_principal_nombre: string;
  buzo_principal_apellido: string;
  buzo_asistente_nombre: string;
  buzo_asistente_apellido: string;
  participantes: Array<{
    id: string;
    nombre: string;
    apellido: string;
    rut: string;
    rol: string;
  }>;
}

interface AnexoBravoStep2PersonalProps {
  data: PersonalData;
  onUpdate: (data: Partial<PersonalData>) => void;
}

export const AnexoBravoStep2Personal = ({ data, onUpdate }: AnexoBravoStep2PersonalProps) => {
  const { profile, getFormDefaults } = useUserProfile();
  const defaults = getFormDefaults();

  // Auto-poblar datos del usuario actual si están vacíos
  React.useEffect(() => {
    if (profile && !data.supervisor_nombre && !data.supervisor_apellido) {
      onUpdate({
        supervisor_nombre: defaults.nombre,
        supervisor_apellido: defaults.apellido,
        buzo_principal_nombre: defaults.nombre,
        buzo_principal_apellido: defaults.apellido,
      });
    }
  }, [profile, data.supervisor_nombre, data.supervisor_apellido]);

  const addParticipante = () => {
    const newParticipante = {
      id: Date.now().toString(),
      nombre: '',
      apellido: '',
      rut: '',
      rol: 'Participante'
    };
    
    onUpdate({
      participantes: [...(data.participantes || []), newParticipante]
    });
  };

  const updateParticipante = (id: string, field: string, value: string) => {
    const updatedParticipantes = (data.participantes || []).map(participante =>
      participante.id === id ? { ...participante, [field]: value } : participante
    );
    onUpdate({ participantes: updatedParticipantes });
  };

  const removeParticipante = (id: string) => {
    onUpdate({
      participantes: (data.participantes || []).filter(participante => participante.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      {/* Personal Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Personal Principal de Buceo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Supervisor */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Supervisor</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="supervisor_nombre">Nombre del Supervisor *</Label>
                <Input
                  id="supervisor_nombre"
                  value={data.supervisor_nombre || ''}
                  onChange={(e) => onUpdate({ supervisor_nombre: e.target.value })}
                  placeholder="Juan"
                />
              </div>
              <div>
                <Label htmlFor="supervisor_apellido">Apellido del Supervisor *</Label>
                <Input
                  id="supervisor_apellido"
                  value={data.supervisor_apellido || ''}
                  onChange={(e) => onUpdate({ supervisor_apellido: e.target.value })}
                  placeholder="Pérez"
                />
              </div>
            </div>
          </div>

          {/* Buzo Principal */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Buzo Principal</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buzo_principal_nombre">Nombre del Buzo Principal *</Label>
                <Input
                  id="buzo_principal_nombre"
                  value={data.buzo_principal_nombre || ''}
                  onChange={(e) => onUpdate({ buzo_principal_nombre: e.target.value })}
                  placeholder="María"
                />
              </div>
              <div>
                <Label htmlFor="buzo_principal_apellido">Apellido del Buzo Principal *</Label>
                <Input
                  id="buzo_principal_apellido"
                  value={data.buzo_principal_apellido || ''}
                  onChange={(e) => onUpdate({ buzo_principal_apellido: e.target.value })}
                  placeholder="González"
                />
              </div>
            </div>
          </div>

          {/* Buzo Asistente (Opcional) */}
          <div className="space-y-4">
            <h3 className="font-medium text-lg">Buzo Asistente (Opcional)</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="buzo_asistente_nombre">Nombre del Buzo Asistente</Label>
                <Input
                  id="buzo_asistente_nombre"
                  value={data.buzo_asistente_nombre || ''}
                  onChange={(e) => onUpdate({ buzo_asistente_nombre: e.target.value })}
                  placeholder="Carlos"
                />
              </div>
              <div>
                <Label htmlFor="buzo_asistente_apellido">Apellido del Buzo Asistente</Label>
                <Input
                  id="buzo_asistente_apellido"
                  value={data.buzo_asistente_apellido || ''}
                  onChange={(e) => onUpdate({ buzo_asistente_apellido: e.target.value })}
                  placeholder="López"
                />
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Otros Participantes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Otros Participantes</CardTitle>
            <Button type="button" onClick={addParticipante} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Participante
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {(data.participantes || []).map((participante) => (
            <div key={participante.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Participante {(data.participantes || []).indexOf(participante) + 1}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeParticipante(participante.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label>Nombre *</Label>
                  <Input
                    value={participante.nombre}
                    onChange={(e) => updateParticipante(participante.id, 'nombre', e.target.value)}
                    placeholder="Nombre"
                  />
                </div>
                <div>
                  <Label>Apellido *</Label>
                  <Input
                    value={participante.apellido}
                    onChange={(e) => updateParticipante(participante.id, 'apellido', e.target.value)}
                    placeholder="Apellido"
                  />
                </div>
                <div>
                  <Label>RUT</Label>
                  <Input
                    value={participante.rut}
                    onChange={(e) => updateParticipante(participante.id, 'rut', e.target.value)}
                    placeholder="12.345.678-9"
                  />
                </div>
                <div>
                  <Label>Rol</Label>
                  <Input
                    value={participante.rol}
                    onChange={(e) => updateParticipante(participante.id, 'rol', e.target.value)}
                    placeholder="Participante"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {(!data.participantes || data.participantes.length === 0) && (
            <div className="text-center py-4 text-gray-500">
              <p>No hay participantes adicionales (opcional)</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
