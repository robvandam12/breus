
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { User, Users, Plus, Search } from 'lucide-react';
import { useEquiposBuceoEnhanced } from '@/hooks/useEquiposBuceoEnhanced';
import { usePersonalPool } from '@/hooks/usePersonalPool';

interface TeamMember {
  id: string;
  nombre: string;
  apellido?: string;
  rol: string;
  isFromTeam?: boolean;
  teamName?: string;
  usuarioId?: string;
}

interface StepPersonalEnhancedProps {
  formData: any;
  handleInputChange: (field: string, value: any) => void;
  isFieldDisabled: (field: string) => boolean;
}

export const StepPersonalEnhanced = ({ 
  formData, 
  handleInputChange, 
  isFieldDisabled 
}: StepPersonalEnhancedProps) => {
  const [showTeamSelector, setShowTeamSelector] = useState(false);
  const [selectedTeamMembers, setSelectedTeamMembers] = useState<TeamMember[]>([]);
  const [personalMode, setPersonalMode] = useState<'manual' | 'team' | 'mixed'>('manual');
  
  const { equipos, isLoading: loadingTeams } = useEquiposBuceoEnhanced();
  const { personalPool, isLoading: loadingPersonal } = usePersonalPool();

  const handleSelectFromTeam = (equipo: any) => {
    const teamMembers: TeamMember[] = equipo.miembros?.map((miembro: any) => ({
      id: miembro.usuario_id || `temp_${Date.now()}_${Math.random()}`,
      nombre: miembro.nombre || '',
      apellido: miembro.apellido || '',
      rol: miembro.rol_equipo,
      isFromTeam: true,
      teamName: equipo.nombre,
      usuarioId: miembro.usuario_id
    })) || [];

    setSelectedTeamMembers(prev => [...prev, ...teamMembers]);
    
    // Asignar automáticamente roles principales si están disponibles
    const supervisor = teamMembers.find(m => m.rol === 'supervisor');
    const buzoP = teamMembers.find(m => m.rol === 'buzo_principal');
    const buzoA = teamMembers.find(m => m.rol === 'buzo_asistente');

    if (supervisor && !formData.supervisor) {
      handleInputChange('supervisor', `${supervisor.nombre} ${supervisor.apellido || ''}`.trim());
      handleInputChange('supervisor_id', supervisor.usuarioId);
    }
    if (buzoP && !formData.buzo_principal) {
      handleInputChange('buzo_principal', `${buzoP.nombre} ${buzoP.apellido || ''}`.trim());
      handleInputChange('buzo_principal_id', buzoP.usuarioId);
    }
    if (buzoA && !formData.buzo_asistente) {
      handleInputChange('buzo_asistente', `${buzoA.nombre} ${buzoA.apellido || ''}`.trim());
      handleInputChange('buzo_asistente_id', buzoA.usuarioId);
    }

    setShowTeamSelector(false);
  };

  const handleSelectFromPool = (person: any, role: string) => {
    const fullName = `${person.nombre} ${person.apellido || ''}`.trim();
    handleInputChange(role, fullName);
    handleInputChange(`${role}_id`, person.usuario_id);
  };

  const removeMember = (memberId: string) => {
    setSelectedTeamMembers(prev => prev.filter(m => m.id !== memberId));
  };

  return (
    <Card className="w-full animate-fade-in">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5 text-green-600" />
          Personal de Buceo
        </CardTitle>
        <div className="flex gap-2 mt-4">
          <Button
            type="button"
            variant={personalMode === 'manual' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPersonalMode('manual')}
          >
            Manual
          </Button>
          <Button
            type="button"
            variant={personalMode === 'team' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPersonalMode('team')}
          >
            <Users className="w-4 h-4 mr-1" />
            Desde Equipo
          </Button>
          <Button
            type="button"
            variant={personalMode === 'mixed' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setPersonalMode('mixed')}
          >
            Mixto
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {personalMode === 'team' && (
          <div className="space-y-4">
            <Button
              type="button"
              onClick={() => setShowTeamSelector(true)}
              className="w-full"
              variant="outline"
            >
              <Users className="w-4 h-4 mr-2" />
              Seleccionar Equipo de Buceo
            </Button>
            
            {selectedTeamMembers.length > 0 && (
              <div className="space-y-2">
                <Label>Miembros Seleccionados</Label>
                <div className="flex flex-wrap gap-2">
                  {selectedTeamMembers.map((member) => (
                    <Badge
                      key={member.id}
                      variant="secondary"
                      className="flex items-center gap-1"
                    >
                      {member.nombre} {member.apellido} - {member.rol}
                      <button
                        type="button"
                        onClick={() => removeMember(member.id)}
                        className="ml-1 text-red-500 hover:text-red-700"
                      >
                        ×
                      </button>
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {(personalMode === 'manual' || personalMode === 'mixed') && (
          <div className="space-y-4">
            <div>
              <Label htmlFor="supervisor">Supervisor *</Label>
              <div className="flex gap-2">
                <Input 
                  id="supervisor" 
                  value={formData.supervisor || ''} 
                  onChange={(e) => handleInputChange('supervisor', e.target.value)} 
                  placeholder="Nombre del supervisor" 
                  disabled={isFieldDisabled('supervisor')} 
                />
                {personalMode === 'mixed' && (
                  <Select onValueChange={(value) => {
                    const person = personalPool?.find(p => p.usuario_id === value);
                    if (person) handleSelectFromPool(person, 'supervisor');
                  }}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Del pool" />
                    </SelectTrigger>
                    <SelectContent>
                      {personalPool?.filter(p => p.rol === 'supervisor' || p.rol === 'admin_servicio').map((person) => (
                        <SelectItem key={person.usuario_id} value={person.usuario_id}>
                          {person.nombre} {person.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="buzo_principal">Buzo Principal *</Label>
              <div className="flex gap-2">
                <Input 
                  id="buzo_principal" 
                  value={formData.buzo_principal || ''} 
                  onChange={(e) => handleInputChange('buzo_principal', e.target.value)} 
                  placeholder="Nombre del buzo principal" 
                  disabled={isFieldDisabled('buzo_principal')} 
                />
                {personalMode === 'mixed' && (
                  <Select onValueChange={(value) => {
                    const person = personalPool?.find(p => p.usuario_id === value);
                    if (person) handleSelectFromPool(person, 'buzo_principal');
                  }}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Del pool" />
                    </SelectTrigger>
                    <SelectContent>
                      {personalPool?.filter(p => p.rol === 'buzo' || p.estado_buzo === 'activo').map((person) => (
                        <SelectItem key={person.usuario_id} value={person.usuario_id}>
                          {person.nombre} {person.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>

            <div>
              <Label htmlFor="buzo_asistente">Buzo Asistente (Opcional)</Label>
              <div className="flex gap-2">
                <Input 
                  id="buzo_asistente" 
                  value={formData.buzo_asistente || ''} 
                  onChange={(e) => handleInputChange('buzo_asistente', e.target.value)} 
                  placeholder="Nombre del buzo asistente" 
                  disabled={isFieldDisabled('buzo_asistente')} 
                />
                {personalMode === 'mixed' && (
                  <Select onValueChange={(value) => {
                    const person = personalPool?.find(p => p.usuario_id === value);
                    if (person) handleSelectFromPool(person, 'buzo_asistente');
                  }}>
                    <SelectTrigger className="w-[140px]">
                      <SelectValue placeholder="Del pool" />
                    </SelectTrigger>
                    <SelectContent>
                      {personalPool?.filter(p => p.rol === 'buzo' || p.estado_buzo === 'activo').map((person) => (
                        <SelectItem key={person.usuario_id} value={person.usuario_id}>
                          {person.nombre} {person.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Selector de Equipos Dialog */}
        <Dialog open={showTeamSelector} onOpenChange={setShowTeamSelector}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Seleccionar Equipo de Buceo
              </DialogTitle>
            </DialogHeader>
            <div className="space-y-4 max-h-96 overflow-y-auto">
              {loadingTeams ? (
                <div className="text-center p-4">Cargando equipos...</div>
              ) : equipos?.length === 0 ? (
                <div className="text-center p-4 text-gray-500">
                  No hay equipos de buceo disponibles
                </div>
              ) : (
                equipos?.map((equipo) => (
                  <Card key={equipo.id} className="cursor-pointer hover:bg-gray-50">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <h4 className="font-semibold">{equipo.nombre}</h4>
                          <p className="text-sm text-gray-600 mb-2">{equipo.descripcion}</p>
                          <div className="flex flex-wrap gap-1">
                            {equipo.miembros?.map((miembro: any, idx: number) => (
                              <Badge key={idx} variant="outline" className="text-xs">
                                {miembro.nombre} - {miembro.rol}
                              </Badge>
                            ))}
                          </div>
                        </div>
                        <Button
                          onClick={() => handleSelectFromTeam(equipo)}
                          size="sm"
                        >
                          Seleccionar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};
