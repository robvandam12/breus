
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Clock, User, Plus, Trash2, AlertCircle } from "lucide-react";
import { CuadrillaMemberData } from "@/types/bitacoras";

interface CuadrillaTimesManagerProps {
  cuadrillaData: CuadrillaMemberData[];
  onCuadrillaChange: (data: CuadrillaMemberData[]) => void;
  inmersionId?: string;
  readOnly?: boolean;
}

export const CuadrillaTimesManager = ({ 
  cuadrillaData, 
  onCuadrillaChange, 
  inmersionId,
  readOnly = false 
}: CuadrillaTimesManagerProps) => {
  const [members, setMembers] = useState<CuadrillaMemberData[]>(cuadrillaData || []);

  useEffect(() => {
    setMembers(cuadrillaData || []);
  }, [cuadrillaData]);

  const handleMemberChange = (index: number, field: keyof CuadrillaMemberData, value: any) => {
    const updatedMembers = [...members];
    updatedMembers[index] = { ...updatedMembers[index], [field]: value };
    
    // Calcular tiempo total automáticamente si se ingresan hora_entrada y hora_salida
    if (field === 'hora_entrada' || field === 'hora_salida') {
      const member = updatedMembers[index];
      if (member.hora_entrada && member.hora_salida) {
        const entrada = new Date(`2000-01-01T${member.hora_entrada}`);
        const salida = new Date(`2000-01-01T${member.hora_salida}`);
        const diffMs = salida.getTime() - entrada.getTime();
        const diffMinutes = Math.round(diffMs / (1000 * 60));
        updatedMembers[index].tiempo_total_minutos = diffMinutes > 0 ? diffMinutes : 0;
      }
    }
    
    setMembers(updatedMembers);
    onCuadrillaChange(updatedMembers);
  };

  const addMember = () => {
    const newMember: CuadrillaMemberData = {
      usuario_id: `temp_${Date.now()}`,
      nombre: '',
      rol: 'buzo_asistente',
      hora_entrada: '',
      hora_salida: '',
      profundidad_maxima: 0,
      tiempo_total_minutos: 0,
      observaciones: '',
      estado_fisico_pre: 'normal',
      estado_fisico_post: 'normal'
    };
    
    const updatedMembers = [...members, newMember];
    setMembers(updatedMembers);
    onCuadrillaChange(updatedMembers);
  };

  const removeMember = (index: number) => {
    const updatedMembers = members.filter((_, i) => i !== index);
    setMembers(updatedMembers);
    onCuadrillaChange(updatedMembers);
  };

  const getRoleColor = (rol: string) => {
    switch (rol) {
      case 'supervisor': return 'bg-blue-100 text-blue-800';
      case 'buzo_principal': return 'bg-green-100 text-green-800';
      case 'buzo_asistente': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (rol: string) => {
    switch (rol) {
      case 'supervisor': return 'Supervisor';
      case 'buzo_principal': return 'Buzo Principal';
      case 'buzo_asistente': return 'Buzo Asistente';
      default: return rol;
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-blue-600" />
            <CardTitle>Tiempos de Cuadrilla</CardTitle>
          </div>
          {!readOnly && (
            <Button 
              type="button" 
              variant="outline" 
              size="sm" 
              onClick={addMember}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Agregar Miembro
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {members.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <User className="w-12 h-12 mx-auto mb-3 text-gray-300" />
            <p>No hay miembros de cuadrilla registrados</p>
            <p className="text-sm">Agregue los miembros y sus tiempos de buceo</p>
          </div>
        ) : (
          <div className="space-y-6">
            {members.map((member, index) => (
              <Card key={index} className="border border-gray-200">
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge className={getRoleColor(member.rol)}>
                        {getRoleLabel(member.rol)}
                      </Badge>
                      <span className="font-medium">
                        {member.nombre} {member.apellido}
                      </span>
                    </div>
                    {!readOnly && members.length > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Información básica */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor={`nombre-${index}`}>Nombre *</Label>
                      <Input
                        id={`nombre-${index}`}
                        value={member.nombre}
                        onChange={(e) => handleMemberChange(index, 'nombre', e.target.value)}
                        placeholder="Nombre del buzo"
                        disabled={readOnly}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor={`apellido-${index}`}>Apellido</Label>
                      <Input
                        id={`apellido-${index}`}
                        value={member.apellido || ''}
                        onChange={(e) => handleMemberChange(index, 'apellido', e.target.value)}
                        placeholder="Apellido del buzo"
                        disabled={readOnly}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`rol-${index}`}>Rol *</Label>
                      <Select 
                        value={member.rol} 
                        onValueChange={(value) => handleMemberChange(index, 'rol', value)}
                        disabled={readOnly}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Seleccionar rol" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="supervisor">Supervisor</SelectItem>
                          <SelectItem value="buzo_principal">Buzo Principal</SelectItem>
                          <SelectItem value="buzo_asistente">Buzo Asistente</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Tiempos de buceo */}
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label htmlFor={`entrada-${index}`}>Hora Entrada</Label>
                      <Input
                        id={`entrada-${index}`}
                        type="time"
                        value={member.hora_entrada || ''}
                        onChange={(e) => handleMemberChange(index, 'hora_entrada', e.target.value)}
                        disabled={readOnly}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`salida-${index}`}>Hora Salida</Label>
                      <Input
                        id={`salida-${index}`}
                        type="time"
                        value={member.hora_salida || ''}
                        onChange={(e) => handleMemberChange(index, 'hora_salida', e.target.value)}
                        disabled={readOnly}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`profundidad-${index}`}>Prof. Máx (m)</Label>
                      <Input
                        id={`profundidad-${index}`}
                        type="number"
                        step="0.1"
                        value={member.profundidad_maxima || ''}
                        onChange={(e) => handleMemberChange(index, 'profundidad_maxima', parseFloat(e.target.value) || 0)}
                        placeholder="0.0"
                        disabled={readOnly}
                      />
                    </div>
                    <div>
                      <Label htmlFor={`tiempo-${index}`}>Tiempo Total (min)</Label>
                      <Input
                        id={`tiempo-${index}`}
                        type="number"
                        value={member.tiempo_total_minutos || ''}
                        onChange={(e) => handleMemberChange(index, 'tiempo_total_minutos', parseInt(e.target.value) || 0)}
                        placeholder="0"
                        disabled={readOnly}
                        className="bg-gray-50"
                      />
                      {member.hora_entrada && member.hora_salida && (
                        <p className="text-xs text-gray-500 mt-1">
                          Calculado automáticamente
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Estado físico */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor={`estado-pre-${index}`}>Estado Físico Pre-Buceo</Label>
                      <Select 
                        value={member.estado_fisico_pre || 'normal'} 
                        onValueChange={(value) => handleMemberChange(index, 'estado_fisico_pre', value)}
                        disabled={readOnly}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Estado físico" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="preocupante">Preocupante</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor={`estado-post-${index}`}>Estado Físico Post-Buceo</Label>
                      <Select 
                        value={member.estado_fisico_post || 'normal'} 
                        onValueChange={(value) => handleMemberChange(index, 'estado_fisico_post', value)}
                        disabled={readOnly}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Estado físico" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="excelente">Excelente</SelectItem>
                          <SelectItem value="normal">Normal</SelectItem>
                          <SelectItem value="regular">Regular</SelectItem>
                          <SelectItem value="preocupante">Preocupante</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Observaciones */}
                  <div>
                    <Label htmlFor={`observaciones-${index}`}>Observaciones</Label>
                    <Textarea
                      id={`observaciones-${index}`}
                      value={member.observaciones || ''}
                      onChange={(e) => handleMemberChange(index, 'observaciones', e.target.value)}
                      placeholder="Observaciones específicas para este buzo..."
                      disabled={readOnly}
                      rows={2}
                    />
                  </div>

                  {/* Advertencias de validación */}
                  {!readOnly && (
                    <div className="space-y-2">
                      {!member.nombre && (
                        <div className="flex items-center gap-2 text-amber-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>El nombre es requerido</span>
                        </div>
                      )}
                      {member.hora_entrada && member.hora_salida && member.hora_entrada >= member.hora_salida && (
                        <div className="flex items-center gap-2 text-red-600 text-sm">
                          <AlertCircle className="w-4 h-4" />
                          <span>La hora de salida debe ser posterior a la hora de entrada</span>
                        </div>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
