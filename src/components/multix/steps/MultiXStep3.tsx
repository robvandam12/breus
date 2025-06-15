
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import { MultiXFormData, EquipoSuperficie, EQUIPOS_SUPERFICIE } from "@/types/multix";

interface MultiXStep3Props {
  formData: MultiXFormData;
  updateFormData: (updates: Partial<MultiXFormData>) => void;
}

export const MultiXStep3 = ({ formData, updateFormData }: MultiXStep3Props) => {
  const addEquipoSuperficie = () => {
    const newEquipo: EquipoSuperficie = {
      equipo_sup: '',
      matricula_eq: '',
      horometro_ini: 0,
      horometro_fin: 0,
      orden: formData.equipos_superficie.length
    };

    updateFormData({
      equipos_superficie: [...formData.equipos_superficie, newEquipo]
    });
  };

  const updateEquipoSuperficie = (index: number, updates: Partial<EquipoSuperficie>) => {
    const updatedEquipos = formData.equipos_superficie.map((equipo, i) =>
      i === index ? { ...equipo, ...updates } : equipo
    );
    updateFormData({ equipos_superficie: updatedEquipos });
  };

  const removeEquipoSuperficie = (index: number) => {
    const updatedEquipos = formData.equipos_superficie.filter((_, i) => i !== index);
    updateFormData({ equipos_superficie: updatedEquipos });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium">Equipos de Superficie</h3>
          <p className="text-sm text-muted-foreground">
            Registra los equipos de superficie utilizados y sus horómetros
          </p>
        </div>
        <Button onClick={addEquipoSuperficie} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Agregar Equipo
        </Button>
      </div>

      {formData.equipos_superficie.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-muted rounded-lg">
          <p className="text-muted-foreground mb-4">No hay equipos de superficie registrados</p>
          <Button onClick={addEquipoSuperficie} variant="outline">
            <Plus className="w-4 h-4 mr-2" />
            Agregar Primer Equipo
          </Button>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipo</TableHead>
                <TableHead>Nº Matrícula</TableHead>
                <TableHead>Horómetro Inicio</TableHead>
                <TableHead>Horómetro Término</TableHead>
                <TableHead>Horas Trabajadas</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {formData.equipos_superficie.map((equipo, index) => {
                const horasTrabajadas = (equipo.horometro_fin || 0) - (equipo.horometro_ini || 0);
                
                return (
                  <TableRow key={index}>
                    <TableCell>
                      <Select
                        value={equipo.equipo_sup || ''}
                        onValueChange={(value) => updateEquipoSuperficie(index, { equipo_sup: value })}
                      >
                        <SelectTrigger className="w-40">
                          <SelectValue placeholder="Seleccionar equipo" />
                        </SelectTrigger>
                        <SelectContent>
                          {EQUIPOS_SUPERFICIE.map((eq) => (
                            <SelectItem key={eq} value={eq}>
                              {eq}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </TableCell>
                    <TableCell>
                      <Input
                        value={equipo.matricula_eq || ''}
                        onChange={(e) => updateEquipoSuperficie(index, { matricula_eq: e.target.value })}
                        className="w-32"
                        placeholder="Matrícula"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.1"
                        value={equipo.horometro_ini || ''}
                        onChange={(e) => updateEquipoSuperficie(index, { horometro_ini: parseFloat(e.target.value) || 0 })}
                        className="w-32"
                        placeholder="0.0"
                      />
                    </TableCell>
                    <TableCell>
                      <Input
                        type="number"
                        step="0.1"
                        value={equipo.horometro_fin || ''}
                        onChange={(e) => updateEquipoSuperficie(index, { horometro_fin: parseFloat(e.target.value) || 0 })}
                        className="w-32"
                        placeholder="0.0"
                      />
                    </TableCell>
                    <TableCell>
                      <div className="text-sm font-medium">
                        {horasTrabajadas >= 0 ? horasTrabajadas.toFixed(1) : '---'} hrs
                      </div>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeEquipoSuperficie(index)}
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </div>
      )}

      {/* Resumen de equipos */}
      {formData.equipos_superficie.length > 0 && (
        <div className="bg-muted/50 p-4 rounded-lg">
          <h4 className="font-medium mb-2">Resumen de Equipos</h4>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-muted-foreground">Total equipos:</span>
              <div className="font-medium">{formData.equipos_superficie.length}</div>
            </div>
            <div>
              <span className="text-muted-foreground">Total horas:</span>
              <div className="font-medium">
                {formData.equipos_superficie.reduce((total, equipo) => {
                  const horas = (equipo.horometro_fin || 0) - (equipo.horometro_ini || 0);
                  return total + (horas >= 0 ? horas : 0);
                }, 0).toFixed(1)} hrs
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Compresores:</span>
              <div className="font-medium">
                {formData.equipos_superficie.filter(eq => eq.equipo_sup?.includes('Compresor')).length}
              </div>
            </div>
            <div>
              <span className="text-muted-foreground">Promedio horas:</span>
              <div className="font-medium">
                {formData.equipos_superficie.length > 0 ? 
                  (formData.equipos_superficie.reduce((total, equipo) => {
                    const horas = (equipo.horometro_fin || 0) - (equipo.horometro_ini || 0);
                    return total + (horas >= 0 ? horas : 0);
                  }, 0) / formData.equipos_superficie.length).toFixed(1) : '0.0'
                } hrs
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
