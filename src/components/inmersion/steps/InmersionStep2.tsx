
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, User } from "lucide-react";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { useEffect, useState } from "react";

interface InmersionStep2Props {
  data: any;
  onUpdate: (updates: any) => void;
  operacionId: string;
}

export const InmersionStep2 = ({ data, onUpdate, operacionId }: InmersionStep2Props) => {
  const { equipos } = useEquiposBuceoEnhanced();
  const [teamMembers, setTeamMembers] = useState<any[]>([]);

  useEffect(() => {
    // Find team members based on operation's assigned team
    const findTeamMembers = async () => {
      if (!operacionId) return;
      
      // This would be populated from the operation's assigned team
      // For now, we'll use the equipos data
      const operationTeam = equipos.find(e => e.miembros && e.miembros.length > 0);
      if (operationTeam) {
        setTeamMembers(operationTeam.miembros || []);
      }
    };

    findTeamMembers();
  }, [operacionId, equipos]);

  const handleChange = (field: string, value: any) => {
    onUpdate({ [field]: value });
  };

  const handlePersonSelection = (field: string, personId: string) => {
    const person = teamMembers.find(m => m.usuario_id === personId);
    if (person) {
      onUpdate({
        [field]: person.nombre_completo,
        [`${field}_id`]: person.usuario_id
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Personal y Roles</h2>
        <p className="mt-2 text-gray-600">
          Asigne el personal responsable de la inmersión
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Asignación de Personal
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="supervisor">Supervisor *</Label>
            {teamMembers.length > 0 ? (
              <Select 
                value={data.supervisor_id || ''} 
                onValueChange={(value) => handlePersonSelection('supervisor', value)}
              >
                <SelectTrigger className="ios-input">
                  <SelectValue placeholder="Seleccionar supervisor..." />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers
                    .filter(m => m.rol === 'supervisor')
                    .map((member) => (
                      <SelectItem key={member.usuario_id} value={member.usuario_id}>
                        {member.nombre_completo}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="supervisor"
                value={data.supervisor || ''}
                onChange={(e) => handleChange('supervisor', e.target.value)}
                placeholder="Nombre del supervisor"
                className="ios-input"
              />
            )}
          </div>

          <div>
            <Label htmlFor="buzo_principal">Buzo Principal *</Label>
            {teamMembers.length > 0 ? (
              <Select 
                value={data.buzo_principal_id || ''} 
                onValueChange={(value) => handlePersonSelection('buzo_principal', value)}
              >
                <SelectTrigger className="ios-input">
                  <SelectValue placeholder="Seleccionar buzo principal..." />
                </SelectTrigger>
                <SelectContent>
                  {teamMembers
                    .filter(m => m.rol === 'buzo_principal' || m.rol === 'buzo')
                    .map((member) => (
                      <SelectItem key={member.usuario_id} value={member.usuario_id}>
                        {member.nombre_completo}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="buzo_principal"
                value={data.buzo_principal || ''}
                onChange={(e) => handleChange('buzo_principal', e.target.value)}
                placeholder="Nombre del buzo principal"
                className="ios-input"
              />
            )}
          </div>

          <div>
            <Label htmlFor="buzo_asistente">Buzo Asistente</Label>
            {teamMembers.length > 0 ? (
              <Select 
                value={data.buzo_asistente_id || ''} 
                onValueChange={(value) => handlePersonSelection('buzo_asistente', value)}
              >
                <SelectTrigger className="ios-input">
                  <SelectValue placeholder="Seleccionar buzo asistente..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Sin asistente</SelectItem>
                  {teamMembers
                    .filter(m => m.rol === 'buzo_asistente' || m.rol === 'buzo')
                    .map((member) => (
                      <SelectItem key={member.usuario_id} value={member.usuario_id}>
                        {member.nombre_completo}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            ) : (
              <Input
                id="buzo_asistente"
                value={data.buzo_asistente || ''}
                onChange={(e) => handleChange('buzo_asistente', e.target.value)}
                placeholder="Nombre del buzo asistente (opcional)"
                className="ios-input"
              />
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
