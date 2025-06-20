
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Users } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";

interface PersonalData {
  buzos: Array<{
    id: string;
    nombre: string;
    apellido: string;
    rol: string;
    matricula: string;
    rut: string;
  }>;
  asistentes: Array<{
    id: string;
    nombre: string;
    apellido: string;
    empresa: string;
    cargo: string;
  }>;
}

interface HPTStep3PersonalProps {
  data: PersonalData;
  onUpdate: (data: Partial<PersonalData>) => void;
}

export const HPTStep3Personal = ({ data, onUpdate }: HPTStep3PersonalProps) => {
  const { profile, getFormDefaults } = useUserProfile();
  const defaults = getFormDefaults();

  const addBuzo = () => {
    const newBuzo = {
      id: Date.now().toString(),
      nombre: data.buzos.length === 0 ? defaults.nombre : '',
      apellido: data.buzos.length === 0 ? defaults.apellido : '',
      rol: 'Buzo Principal',
      matricula: data.buzos.length === 0 ? defaults.matricula : '',
      rut: data.buzos.length === 0 ? defaults.rut : ''
    };
    
    onUpdate({
      buzos: [...data.buzos, newBuzo]
    });
  };

  const updateBuzo = (id: string, field: string, value: string) => {
    const updatedBuzos = data.buzos.map(buzo =>
      buzo.id === id ? { ...buzo, [field]: value } : buzo
    );
    onUpdate({ buzos: updatedBuzos });
  };

  const removeBuzo = (id: string) => {
    onUpdate({
      buzos: data.buzos.filter(buzo => buzo.id !== id)
    });
  };

  const addAsistente = () => {
    const newAsistente = {
      id: Date.now().toString(),
      nombre: '',
      apellido: '',
      empresa: '',
      cargo: 'Asistente'
    };
    
    onUpdate({
      asistentes: [...data.asistentes, newAsistente]
    });
  };

  const updateAsistente = (id: string, field: string, value: string) => {
    const updatedAsistentes = data.asistentes.map(asistente =>
      asistente.id === id ? { ...asistente, [field]: value } : asistente
    );
    onUpdate({ asistentes: updatedAsistentes });
  };

  const removeAsistente = (id: string) => {
    onUpdate({
      asistentes: data.asistentes.filter(asistente => asistente.id !== id)
    });
  };

  return (
    <div className="space-y-6">
      {/* Personal de Buceo */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Personal de Buceo
            </CardTitle>
            <Button type="button" onClick={addBuzo} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Buzo
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.buzos.map((buzo) => (
            <div key={buzo.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Buzo {data.buzos.indexOf(buzo) + 1}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeBuzo(buzo.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nombre *</Label>
                  <Input
                    value={buzo.nombre}
                    onChange={(e) => updateBuzo(buzo.id, 'nombre', e.target.value)}
                    placeholder="Juan"
                  />
                </div>
                <div>
                  <Label>Apellido *</Label>
                  <Input
                    value={buzo.apellido}
                    onChange={(e) => updateBuzo(buzo.id, 'apellido', e.target.value)}
                    placeholder="Pérez"
                  />
                </div>
                <div>
                  <Label>RUT</Label>
                  <Input
                    value={buzo.rut}
                    onChange={(e) => updateBuzo(buzo.id, 'rut', e.target.value)}
                    placeholder="12.345.678-9"
                  />
                </div>
                <div>
                  <Label>Matrícula</Label>
                  <Input
                    value={buzo.matricula}
                    onChange={(e) => updateBuzo(buzo.id, 'matricula', e.target.value)}
                    placeholder="BZ-12345"
                  />
                </div>
                <div className="md:col-span-2">
                  <Label>Rol *</Label>
                  <Select value={buzo.rol} onValueChange={(value) => updateBuzo(buzo.id, 'rol', value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Supervisor">Supervisor</SelectItem>
                      <SelectItem value="Buzo Principal">Buzo Principal</SelectItem>
                      <SelectItem value="Buzo Asistente">Buzo Asistente</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          ))}
          
          {data.buzos.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="mb-4">No hay personal de buceo agregado</p>
              <Button type="button" onClick={addBuzo} variant="outline">
                <Plus className="w-4 h-4 mr-2" />
                Agregar Primer Buzo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Asistentes */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Personal Asistente</CardTitle>
            <Button type="button" onClick={addAsistente} size="sm" variant="outline">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Asistente
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          {data.asistentes.map((asistente) => (
            <div key={asistente.id} className="p-4 border rounded-lg space-y-4">
              <div className="flex justify-between items-center">
                <h4 className="font-medium">Asistente {data.asistentes.indexOf(asistente) + 1}</h4>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => removeAsistente(asistente.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Nombre *</Label>
                  <Input
                    value={asistente.nombre}
                    onChange={(e) => updateAsistente(asistente.id, 'nombre', e.target.value)}
                    placeholder="María"
                  />
                </div>
                <div>
                  <Label>Apellido *</Label>
                  <Input
                    value={asistente.apellido}
                    onChange={(e) => updateAsistente(asistente.id, 'apellido', e.target.value)}
                    placeholder="González"
                  />
                </div>
                <div>
                  <Label>Empresa</Label>
                  <Input
                    value={asistente.empresa}
                    onChange={(e) => updateAsistente(asistente.id, 'empresa', e.target.value)}
                    placeholder="Empresa ABC"
                  />
                </div>
                <div>
                  <Label>Cargo</Label>
                  <Input
                    value={asistente.cargo}
                    onChange={(e) => updateAsistente(asistente.id, 'cargo', e.target.value)}
                    placeholder="Asistente de Buceo"
                  />
                </div>
              </div>
            </div>
          ))}
          
          {data.asistentes.length === 0 && (
            <div className="text-center py-4 text-gray-500">
              <p>No hay asistentes agregados (opcional)</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
