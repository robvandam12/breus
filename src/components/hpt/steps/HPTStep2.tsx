
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, UserPlus, X } from "lucide-react";
import { useUsersByCompany } from "@/hooks/useUsersByCompany";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";

interface HPTStep2Props {
  data: any;
  onUpdate: (data: any) => void;
  operacionId: string;
}

export const HPTStep2 = ({ data, onUpdate, operacionId }: HPTStep2Props) => {
  const { usuarios: allUsers } = useUsersByCompany();
  const { equipos } = useEquiposBuceoEnhanced();

  // Filter users for supervisors and buzos
  const supervisores = allUsers.filter(u => u.rol === 'supervisor');
  const buzos = allUsers.filter(u => u.rol === 'buzo');

  const handleAddBuzo = (buzoId: string) => {
    const buzo = buzos.find(b => b.usuario_id === buzoId);
    if (buzo) {
      const newBuzo = {
        id: buzo.usuario_id,
        nombre: `${buzo.nombre} ${buzo.apellido}`,
        matricula: buzo.perfil_buzo?.matricula || '',
        empresa: buzo.empresa_nombre || '',
      };
      
      const currentBuzos = Array.isArray(data.buzos) ? data.buzos : [];
      const updatedBuzos = [...currentBuzos, newBuzo];
      onUpdate({ buzos: updatedBuzos });
    }
  };

  const handleRemoveBuzo = (buzoId: string) => {
    const currentBuzos = Array.isArray(data.buzos) ? data.buzos : [];
    const updatedBuzos = currentBuzos.filter((b: any) => b.id !== buzoId);
    onUpdate({ buzos: updatedBuzos });
  };

  const handleAddAsistente = (asistenteId: string) => {
    const asistente = allUsers.find(u => u.usuario_id === asistenteId);
    if (asistente) {
      const newAsistente = {
        id: asistente.usuario_id,
        nombre: `${asistente.nombre} ${asistente.apellido}`,
        rol: asistente.rol,
        empresa: asistente.empresa_nombre || '',
      };
      
      const currentAsistentes = Array.isArray(data.asistentes) ? data.asistentes : [];
      const updatedAsistentes = [...currentAsistentes, newAsistente];
      onUpdate({ asistentes: updatedAsistentes });
    }
  };

  const handleRemoveAsistente = (asistenteId: string) => {
    const currentAsistentes = Array.isArray(data.asistentes) ? data.asistentes : [];
    const updatedAsistentes = currentAsistentes.filter((a: any) => a.id !== asistenteId);
    onUpdate({ asistentes: updatedAsistentes });
  };

  const currentBuzos = Array.isArray(data.buzos) ? data.buzos : [];
  const currentAsistentes = Array.isArray(data.asistentes) ? data.asistentes : [];
  const addedBuzoIds = currentBuzos.map((b: any) => b.id);
  const addedAsistenteIds = currentAsistentes.map((a: any) => a.id);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Personal Asignado</h2>
        <p className="mt-2 text-gray-600">
          Seleccione el personal que participará en esta operación
        </p>
      </div>

      {/* Supervisor Responsable */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Supervisor Responsable
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div>
            <Label htmlFor="supervisor_id">Supervisor</Label>
            <Select 
              value={data.supervisor_id || ''} 
              onValueChange={(value) => {
                const supervisor = supervisores.find(s => s.usuario_id === value);
                onUpdate({ 
                  supervisor_id: value,
                  supervisor_nombre: supervisor ? `${supervisor.nombre} ${supervisor.apellido}` : ''
                });
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar supervisor..." />
              </SelectTrigger>
              <SelectContent>
                {supervisores.map((supervisor) => (
                  <SelectItem key={supervisor.usuario_id} value={supervisor.usuario_id}>
                    <div className="flex items-center gap-3">
                      <div>
                        <div className="font-medium">{supervisor.nombre} {supervisor.apellido}</div>
                        <div className="text-sm text-zinc-500">{supervisor.empresa_nombre}</div>
                      </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Buzos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Buzos Asignados
            <Badge variant="outline" className="ml-auto">
              {currentBuzos.length} buzos
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Agregar Buzo</Label>
            <Select onValueChange={handleAddBuzo}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar buzo..." />
              </SelectTrigger>
              <SelectContent>
                {buzos
                  .filter(buzo => !addedBuzoIds.includes(buzo.usuario_id))
                  .map((buzo) => (
                    <SelectItem key={buzo.usuario_id} value={buzo.usuario_id}>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium">{buzo.nombre} {buzo.apellido}</div>
                          <div className="text-sm text-zinc-500">
                            {buzo.perfil_buzo?.matricula && `Matrícula: ${buzo.perfil_buzo.matricula} • `}
                            {buzo.empresa_nombre}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {currentBuzos.length > 0 && (
            <div className="space-y-2">
              <Label>Buzos Seleccionados</Label>
              {currentBuzos.map((buzo: any) => (
                <div key={buzo.id} className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
                  <div>
                    <div className="font-medium">{buzo.nombre}</div>
                    <div className="text-sm text-blue-700">
                      {buzo.matricula && `Matrícula: ${buzo.matricula} • `}
                      {buzo.empresa}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveBuzo(buzo.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asistentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="w-5 h-5" />
            Personal Asistente
            <Badge variant="outline" className="ml-auto">
              {currentAsistentes.length} asistentes
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Agregar Asistente</Label>
            <Select onValueChange={handleAddAsistente}>
              <SelectTrigger>
                <SelectValue placeholder="Seleccionar personal asistente..." />
              </SelectTrigger>
              <SelectContent>
                {allUsers
                  .filter(user => !addedAsistenteIds.includes(user.usuario_id))
                  .map((user) => (
                    <SelectItem key={user.usuario_id} value={user.usuario_id}>
                      <div className="flex items-center gap-3">
                        <div>
                          <div className="font-medium">{user.nombre} {user.apellido}</div>
                          <div className="text-sm text-zinc-500">
                            {user.rol} • {user.empresa_nombre}
                          </div>
                        </div>
                      </div>
                    </SelectItem>
                  ))}
              </SelectContent>
            </Select>
          </div>

          {currentAsistentes.length > 0 && (
            <div className="space-y-2">
              <Label>Asistentes Seleccionados</Label>
              {currentAsistentes.map((asistente: any) => (
                <div key={asistente.id} className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                  <div>
                    <div className="font-medium">{asistente.nombre}</div>
                    <div className="text-sm text-green-700">
                      {asistente.rol} • {asistente.empresa}
                    </div>
                  </div>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleRemoveAsistente(asistente.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
