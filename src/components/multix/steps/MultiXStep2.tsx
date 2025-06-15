
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { MultiXFormData, DotacionMember, ROLES_BUCEO, TIPOS_EQUIPO } from "@/types/multix";

interface MultiXStep2Props {
  formData: MultiXFormData;
  updateFormData: (updates: Partial<MultiXFormData>) => void;
}

export const MultiXStep2 = ({ formData, updateFormData }: MultiXStep2Props) => {
  const addDotacionMember = () => {
    const newMember: DotacionMember = {
      rol: '',
      nombre: '',
      apellido: '',
      matricula: '',
      contratista: false,
      equipo: '',
      hora_inicio_buzo: '',
      hora_fin_buzo: '',
      profundidad: 0,
      orden: formData.dotacion.length
    };

    updateFormData({
      dotacion: [...formData.dotacion, newMember]
    });
  };

  const updateDotacionMember = (index: number, updates: Partial<DotacionMember>) => {
    const updatedDotacion = formData.dotacion.map((member, i) =>
      i === index ? { ...member, ...updates } : member
    );
    updateFormData({ dotacion: updatedDotacion });
  };

  const removeDotacionMember = (index: number) => {
    const updatedDotacion = formData.dotacion.filter((_, i) => i !== index);
    updateFormData({ dotacion: updatedDotacion });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Dotación y Roles de Buceo</h3>
          <p className="text-sm text-muted-foreground">
            Añade los miembros del equipo y sus roles específicos
          </p>
        </div>
        <Button onClick={addDotacionMember} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar Persona
        </Button>
      </div>

      {formData.dotacion.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground mb-4">No hay personas en la dotación</p>
          <Button onClick={addDotacionMember} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Primera Persona
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Rol</TableHead>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead>Matrícula</TableHead>
                <TableHead>Contratista</TableHead>
                <TableHead>Equipo</TableHead>
                <TableHead>Hora Inicio</TableHead>
                <TableHead>Hora Fin</TableHead>
                <TableHead>Profundidad (m)</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.dotacion.map((member, index) => (
                <TableRow key={index}>
                  <TableCell>
                    <Select
                      value={member.rol}
                      onValueChange={(value) => updateDotacionMember(index, { rol: value })}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Seleccionar rol" />
                      </SelectTrigger>
                      <SelectContent>
                        {ROLES_BUCEO.map((rol) => (
                          <SelectItem key={rol} value={rol}>
                            {rol}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={member.nombre || ''}
                      onChange={(e) => updateDotacionMember(index, { nombre: e.target.value })}
                      className="w-32"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={member.apellido || ''}
                      onChange={(e) => updateDotacionMember(index, { apellido: e.target.value })}
                      className="w-32"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={member.matricula || ''}
                      onChange={(e) => updateDotacionMember(index, { matricula: e.target.value })}
                      className="w-32"
                    />
                  </TableCell>
                  <TableCell>
                    <Checkbox
                      checked={member.contratista || false}
                      onCheckedChange={(checked) => 
                        updateDotacionMember(index, { contratista: checked as boolean })
                      }
                    />
                  </TableCell>
                  <TableCell>
                    <Select
                      value={member.equipo || ''}
                      onValueChange={(value) => updateDotacionMember(index, { equipo: value })}
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Equipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {TIPOS_EQUIPO.map((equipo) => (
                          <SelectItem key={equipo} value={equipo}>
                            {equipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={member.hora_inicio_buzo || ''}
                      onChange={(e) => updateDotacionMember(index, { hora_inicio_buzo: e.target.value })}
                      className="w-32"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="time"
                      value={member.hora_fin_buzo || ''}
                      onChange={(e) => updateDotacionMember(index, { hora_fin_buzo: e.target.value })}
                      className="w-32"
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      type="number"
                      step="0.1"
                      value={member.profundidad || ''}
                      onChange={(e) => updateDotacionMember(index, { profundidad: parseFloat(e.target.value) || 0 })}
                      className="w-24"
                    />
                  </TableCell>
                  <TableCell>
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => removeDotacionMember(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  );
};
