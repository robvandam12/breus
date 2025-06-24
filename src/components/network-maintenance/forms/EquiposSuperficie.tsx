
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface EquipoSuperficie {
  id: string;
  equipo_sup: string;
  matricula_eq: string;
  horometro_ini: number;
  horometro_fin: number;
}

interface EquiposSuperficieProps {
  data: EquipoSuperficie[];
  onChange: (data: EquipoSuperficie[]) => void;
  readOnly?: boolean;
}

const equipos = ['Compresor 1', 'Compresor 2'];

export const EquiposSuperficie = ({ data, onChange, readOnly = false }: EquiposSuperficieProps) => {
  const addEquipo = () => {
    if (readOnly) return;
    const newEquipo: EquipoSuperficie = {
      id: `equipo-${Date.now()}`,
      equipo_sup: '',
      matricula_eq: '',
      horometro_ini: 0,
      horometro_fin: 0
    };
    onChange([...data, newEquipo]);
  };

  const removeEquipo = (id: string) => {
    if (readOnly) return;
    onChange(data.filter(equipo => equipo.id !== id));
  };

  const updateEquipo = (id: string, field: keyof EquipoSuperficie, value: any) => {
    if (readOnly) return;
    onChange(data.map(equipo => 
      equipo.id === id ? { ...equipo, [field]: value } : equipo
    ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Equipos de Superficie</CardTitle>
          {!readOnly && (
            <Button type="button" onClick={addEquipo} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Equipo
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((equipo, index) => (
            <div key={equipo.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">Equipo {index + 1}</Badge>
                {data.length > 1 && !readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeEquipo(equipo.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label>Equipo</Label>
                  <Select 
                    value={equipo.equipo_sup} 
                    onValueChange={(value) => updateEquipo(equipo.id, 'equipo_sup', value)}
                    disabled={readOnly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar equipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {equipos.map(eq => (
                        <SelectItem key={eq} value={eq}>{eq}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label>Nº Matrícula</Label>
                  <Input
                    value={equipo.matricula_eq}
                    onChange={(e) => updateEquipo(equipo.id, 'matricula_eq', e.target.value)}
                    disabled={readOnly}
                  />
                </div>

                <div>
                  <Label>Horómetro inicio</Label>
                  <Input
                    type="number"
                    value={equipo.horometro_ini}
                    onChange={(e) => updateEquipo(equipo.id, 'horometro_ini', parseFloat(e.target.value) || 0)}
                    disabled={readOnly}
                  />
                </div>

                <div>
                  <Label>Horómetro término</Label>
                  <Input
                    type="number"
                    value={equipo.horometro_fin}
                    onChange={(e) => updateEquipo(equipo.id, 'horometro_fin', parseFloat(e.target.value) || 0)}
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
