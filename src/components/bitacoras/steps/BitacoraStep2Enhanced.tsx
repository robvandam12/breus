
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Users, Plus, X, User, Award } from "lucide-react";
import { usePersonalProfiles } from "@/hooks/usePersonalProfiles";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { useOperaciones } from "@/hooks/useOperaciones";

interface BitacoraStep2Props {
  data: any;
  onUpdate: (data: any) => void;
}

interface BuzoInfo {
  usuario_id?: string;
  nombre: string;
  rut: string;
  matricula: string;
  rol: 'buzo_principal' | 'buzo_asistente' | 'emergencia';
  telefono?: string;
}

export const BitacoraStep2Enhanced = ({ data, onUpdate }: BitacoraStep2Props) => {
  const { profiles, getUserData } = usePersonalProfiles();
  const { equipos } = useEquiposBuceoEnhanced();
  const { operaciones } = useOperaciones();
  
  const [buzos, setBuzos] = useState<BuzoInfo[]>([]);
  const [newBuzo, setNewBuzo] = useState<BuzoInfo>({
    nombre: '',
    rut: '',
    matricula: '',
    rol: 'emergencia'
  });

  // Get current operation and team
  const currentOperation = operaciones.find(op => op.id === data.operacion_id);
  const currentTeam = currentOperation?.equipo_buceo_id 
    ? equipos.find(eq => eq.id === currentOperation.equipo_buceo_id)
    : null;

  useEffect(() => {
    if (currentTeam?.miembros) {
      const teamBuzos: BuzoInfo[] = currentTeam.miembros
        .filter(m => m.rol === 'buzo_principal' || m.rol === 'buzo_asistente')
        .map(miembro => {
          const userData = getUserData(miembro.usuario_id);
          return {
            usuario_id: miembro.usuario_id,
            nombre: userData?.nombre_completo || `${miembro.nombre || ''} ${miembro.apellido || ''}`.trim(),
            rut: userData?.rut || '',
            matricula: userData?.matricula || '',
            rol: miembro.rol_equipo as 'buzo_principal' | 'buzo_asistente',
            telefono: userData?.telefono
          };
        });

      setBuzos(teamBuzos);
      
      // Update form data
      onUpdate({
        buzos_equipo: teamBuzos
      });
    }
  }, [currentTeam, getUserData, onUpdate]);

  const addBuzoEmergencia = () => {
    if (newBuzo.nombre.trim() && newBuzo.rut.trim()) {
      const buzoEmergencia: BuzoInfo = {
        ...newBuzo,
        rol: 'emergencia'
      };
      
      setBuzos(prev => [...prev, buzoEmergencia]);
      setNewBuzo({
        nombre: '',
        rut: '',
        matricula: '',
        rol: 'emergencia'
      });

      onUpdate({
        buzos_equipo: [...buzos, buzoEmergencia]
      });
    }
  };

  const removeBuzo = (index: number) => {
    const updatedBuzos = buzos.filter((_, i) => i !== index);
    setBuzos(updatedBuzos);
    onUpdate({
      buzos_equipo: updatedBuzos
    });
  };

  const availableProfiles = profiles.filter(p => 
    p.rol === 'buzo' && 
    p.perfil_completado && 
    !buzos.some(b => b.usuario_id === p.usuario_id)
  );

  const addFromProfile = (profileId: string) => {
    const profile = profiles.find(p => p.usuario_id === profileId);
    const userData = getUserData(profileId);
    
    if (profile && userData) {
      const newBuzoFromProfile: BuzoInfo = {
        usuario_id: profile.usuario_id,
        nombre: userData.nombre_completo,
        rut: userData.rut || '',
        matricula: userData.matricula || '',
        rol: 'emergencia',
        telefono: userData.telefono
      };

      setBuzos(prev => [...prev, newBuzoFromProfile]);
      onUpdate({
        buzos_equipo: [...buzos, newBuzoFromProfile]
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Equipo de Buceo</h2>
        <p className="mt-2 text-gray-600">
          Personal asignado para la operación de buceo
        </p>
      </div>

      {/* Equipo Principal */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Equipo Principal Asignado
            {currentTeam && (
              <Badge variant="outline">
                {currentTeam.nombre}
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {buzos.filter(b => b.rol !== 'emergencia').length > 0 ? (
            <div className="space-y-3">
              {buzos.filter(b => b.rol !== 'emergencia').map((buzo, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-blue-50">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <User className="w-4 h-4 text-blue-600" />
                      <div>
                        <p className="font-medium text-sm">{buzo.nombre}</p>
                        <div className="flex gap-4 text-xs text-gray-600">
                          <span>RUT: {buzo.rut || 'No registrado'}</span>
                          <span>Matrícula: {buzo.matricula || 'No registrada'}</span>
                          <span>Rol: {buzo.rol === 'buzo_principal' ? 'Buzo Principal' : 'Buzo Asistente'}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  <Badge variant={buzo.rol === 'buzo_principal' ? 'default' : 'secondary'}>
                    {buzo.rol === 'buzo_principal' ? 'Principal' : 'Asistente'}
                  </Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-6 text-gray-500">
              <Users className="w-8 h-8 mx-auto mb-2 text-gray-400" />
              <p>No hay equipo asignado a esta operación</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Buzos de Emergencia */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Award className="w-5 h-5 text-orange-600" />
            Buzos de Emergencia
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Agregar desde perfiles existentes */}
          {availableProfiles.length > 0 && (
            <div className="space-y-2">
              <Label>Agregar Buzo de Emergencia (Perfiles Registrados)</Label>
              <Select onValueChange={addFromProfile}>
                <SelectTrigger>
                  <SelectValue placeholder="Seleccionar buzo registrado" />
                </SelectTrigger>
                <SelectContent>
                  {availableProfiles.map((profile) => {
                    const userData = getUserData(profile.usuario_id);
                    return (
                      <SelectItem key={profile.usuario_id} value={profile.usuario_id}>
                        <div className="flex flex-col">
                          <span>{userData?.nombre_completo}</span>
                          <span className="text-xs text-gray-500">
                            {userData?.matricula && `Mat: ${userData.matricula}`}
                            {userData?.certificacion_nivel && ` - ${userData.certificacion_nivel}`}
                          </span>
                        </div>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          )}

          {/* Agregar manualmente */}
          <div className="space-y-3 p-4 border rounded-lg bg-gray-50">
            <Label className="text-sm font-medium">Agregar Buzo de Emergencia Manualmente</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <Input
                placeholder="Nombre completo"
                value={newBuzo.nombre}
                onChange={(e) => setNewBuzo({ ...newBuzo, nombre: e.target.value })}
              />
              <Input
                placeholder="RUT"
                value={newBuzo.rut}
                onChange={(e) => setNewBuzo({ ...newBuzo, rut: e.target.value })}
              />
              <Input
                placeholder="Matrícula"
                value={newBuzo.matricula}
                onChange={(e) => setNewBuzo({ ...newBuzo, matricula: e.target.value })}
              />
            </div>
            <Button 
              onClick={addBuzoEmergencia}
              disabled={!newBuzo.nombre.trim() || !newBuzo.rut.trim()}
              size="sm"
              className="w-full"
            >
              <Plus className="w-4 h-4 mr-2" />
              Agregar Buzo de Emergencia
            </Button>
          </div>

          {/* Lista de buzos de emergencia */}
          {buzos.filter(b => b.rol === 'emergencia').length > 0 && (
            <div className="space-y-2">
              <Label className="text-sm font-medium">Buzos de Emergencia Agregados</Label>
              {buzos.filter(b => b.rol === 'emergencia').map((buzo, index) => (
                <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-orange-50">
                  <div>
                    <p className="font-medium text-sm">{buzo.nombre}</p>
                    <div className="flex gap-4 text-xs text-gray-600">
                      <span>RUT: {buzo.rut}</span>
                      <span>Matrícula: {buzo.matricula || 'No registrada'}</span>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => removeBuzo(buzos.indexOf(buzo))}
                    className="text-red-600 hover:text-red-700"
                  >
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-sm text-blue-800">
            <strong>Equipo registrado:</strong> {buzos.length} buzos en total 
            ({buzos.filter(b => b.rol !== 'emergencia').length} del equipo principal, {buzos.filter(b => b.rol === 'emergencia').length} de emergencia)
          </div>
        </div>
      </div>
    </div>
  );
};
