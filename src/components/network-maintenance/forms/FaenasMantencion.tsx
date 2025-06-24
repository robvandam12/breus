
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Plus, X } from "lucide-react";

interface FaenaMantencion {
  id: string;
  jaulas: string;
  cantidad: number;
  ubicacion: string;
  tipo_rotura: string;
  retensado: boolean;
  descostura: boolean;
  objetos: boolean;
  otros: string;
  obs_faena: string;
}

interface FaenasMantencionProps {
  data: FaenaMantencion[];
  onChange: (data: FaenaMantencion[]) => void;
  readOnly?: boolean;
}

const tiposRotura = ['2×1', '2×2', '>2×2'];

export const FaenasMantencion = ({ data, onChange, readOnly = false }: FaenasMantencionProps) => {
  const addFaena = () => {
    if (readOnly) return;
    const newFaena: FaenaMantencion = {
      id: `faena-${Date.now()}`,
      jaulas: '',
      cantidad: 0,
      ubicacion: '',
      tipo_rotura: '',
      retensado: false,
      descostura: false,
      objetos: false,
      otros: '',
      obs_faena: ''
    };
    onChange([...data, newFaena]);
  };

  const removeFaena = (id: string) => {
    if (readOnly) return;
    onChange(data.filter(faena => faena.id !== id));
  };

  const updateFaena = (id: string, field: keyof FaenaMantencion, value: any) => {
    if (readOnly) return;
    onChange(data.map(faena => 
      faena.id === id ? { ...faena, [field]: value } : faena
    ));
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Faenas de Mantención - Redes</CardTitle>
          {!readOnly && (
            <Button type="button" onClick={addFaena} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Faena
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {data.map((faena, index) => (
            <div key={faena.id} className="p-4 border rounded-lg">
              <div className="flex items-center justify-between mb-4">
                <Badge variant="outline">Faena {index + 1}</Badge>
                {data.length > 1 && !readOnly && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => removeFaena(faena.id)}
                  >
                    <X className="w-4 h-4" />
                  </Button>
                )}
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                <div>
                  <Label>Nº Jaula(s)</Label>
                  <Input
                    value={faena.jaulas}
                    onChange={(e) => updateFaena(faena.id, 'jaulas', e.target.value)}
                    disabled={readOnly}
                  />
                </div>

                <div>
                  <Label>Cantidad</Label>
                  <Input
                    type="number"
                    value={faena.cantidad}
                    onChange={(e) => updateFaena(faena.id, 'cantidad', parseInt(e.target.value) || 0)}
                    disabled={readOnly}
                  />
                </div>

                <div>
                  <Label>Ubicación</Label>
                  <Input
                    value={faena.ubicacion}
                    onChange={(e) => updateFaena(faena.id, 'ubicacion', e.target.value)}
                    disabled={readOnly}
                  />
                </div>

                <div>
                  <Label>Tipo rotura</Label>
                  <Select 
                    value={faena.tipo_rotura} 
                    onValueChange={(value) => updateFaena(faena.id, 'tipo_rotura', value)}
                    disabled={readOnly}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposRotura.map(tipo => (
                        <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`retensado-${faena.id}`}
                    checked={faena.retensado}
                    onCheckedChange={(checked) => updateFaena(faena.id, 'retensado', checked)}
                    disabled={readOnly}
                  />
                  <Label htmlFor={`retensado-${faena.id}`}>Retensado</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`descostura-${faena.id}`}
                    checked={faena.descostura}
                    onCheckedChange={(checked) => updateFaena(faena.id, 'descostura', checked)}
                    disabled={readOnly}
                  />
                  <Label htmlFor={`descostura-${faena.id}`}>Descostura</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox
                    id={`objetos-${faena.id}`}
                    checked={faena.objetos}
                    onCheckedChange={(checked) => updateFaena(faena.id, 'objetos', checked)}
                    disabled={readOnly}
                  />
                  <Label htmlFor={`objetos-${faena.id}`}>Objetos</Label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label>Otros</Label>
                  <Input
                    value={faena.otros}
                    onChange={(e) => updateFaena(faena.id, 'otros', e.target.value)}
                    disabled={readOnly}
                  />
                </div>

                <div>
                  <Label>Observaciones</Label>
                  <Textarea
                    value={faena.obs_faena}
                    onChange={(e) => updateFaena(faena.id, 'obs_faena', e.target.value)}
                    disabled={readOnly}
                    rows={3}
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
