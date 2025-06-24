
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface DotacionMiembro {
  id: string;
  rol: string;
  nombre: string;
  apellido: string;
  matricula: string;
  contratista: boolean;
  equipo: string;
  hora_inicio_buzo: string;
  hora_fin_buzo: string;
  profundidad: number;
}

interface DotacionBuceoProps {
  data: DotacionMiembro[];
  onChange: (data: DotacionMiembro[]) => void;
  readOnly?: boolean;
}

const roles = [
  'Supervisor',
  'Buzo Emergencia 1',
  'Buzo Emergencia 2',
  'Buzo N°1',
  'Buzo N°2',
  'Buzo N°3',
  'Buzo N°4',
  'Buzo N°5',
  'Buzo N°6',
  'Buzo N°7',
  'Buzo N°8'
];

const equipos = ['Liviano', 'Mediano'];

export const DotacionBuceo = ({ data, onChange, readOnly = false }: DotacionBuceoProps) => {
  const addMember = () => {
    if (readOnly) return;
    const newMember: DotacionMiembro = {
      id: `member-${Date.now()}`,
      rol: '',
      nombre: '',
      apellido: '',
      matricula: '',
      contratista: false,
      equipo: '',
      hora_inicio_buzo: '',
      hora_fin_buzo: '',
      profundidad: 0
    };
    onChange([...data, newMember]);
  };

  const removeMember = (id: string) => {
    if (readOnly) return;
    onChange(data.filter(member => member.id !== id));
  };

  const updateMember = (id: string, field: keyof DotacionMiembro, value: any) => {
    if (readOnly) return;
    onChange(data.map(member => 
      member.id === id ? { ...member, [field]: value } : member
    ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Dotación y Roles de Buceo</CardTitle>
          {!readOnly && (
            <Button type="button" onClick={addMember} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Persona
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((member, index) => (
            <div key={member.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">Persona {index + 1}</Badge>
                {data.length > 1 && !readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeMember(member.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Rol</Label>
                  <Select 
                    value={member.rol} 
                    onValueChange={(value) => updateMember(member.id, 'rol', value)}
                    disabled={readOnly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar rol" />
                    </SelectTrigger>
                    <SelectContent>
                      {roles.map(rol => (
                        <SelectItem key={rol} value={rol}>{rol}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Nombre</Label>
                  <Input
                    value={member.nombre}
                    onChange={(e) => updateMember(member.id, 'nombre', e.target.value)}
                    disabled={readOnly}
                  />
                </div>

                <div>
                  <Label>Apellido</Label>
                  <Input
                    value={member.apellido}
                    onChange={(e) => updateMember(member.id, 'apellido', e.target.value)}
                    disabled={readOnly}
                  />
                </div>

                <div>
                  <Label>Nº Matrícula</Label>
                  <Input
                    value={member.matricula}
                    onChange={(e) => updateMember(member.id, 'matricula', e.target.value)}
                    disabled={readOnly}
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`contratista-${member.id}`}
                    checked={member.contratista}
                    onCheckedChange={(checked) => updateMember(member.id, 'contratista', checked)}
                    disabled={readOnly}
                  />
                  <Label htmlFor={`contratista-${member.id}`}>Contratista</Label>
                </div>

                <div>
                  <Label>Equipo</Label>
                  <Select 
                    value={member.equipo} 
                    onValueChange={(value) => updateMember(member.id, 'equipo', value)}
                    disabled={readOnly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipos.map(equipo => (
                        <SelectItem key={equipo} value={equipo}>{equipo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Hora inicio inmersión</Label>
                  <Input
                    type="time"
                    value={member.hora_inicio_buzo}
                    onChange={(e) => updateMember(member.id, 'hora_inicio_buzo', e.target.value)}
                    disabled={readOnly}
                  />
                </div>

                <div>
                  <Label>Hora término inmersión</Label>
                  <Input
                    type="time"
                    value={member.hora_fin_buzo}
                    onChange={(e) => updateMember(member.id, 'hora_fin_buzo', e.target.value)}
                    disabled={readOnly}
                  />
                </div>

                <div>
                  <Label>Profundidad (m)</Label>
                  <Input
                    type="number"
                    value={member.profundidad}
                    onChange={(e) => updateMember(member.id, 'profundidad', parseFloat(e.target.value) || 0)}
                    disabled={readOnly}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
