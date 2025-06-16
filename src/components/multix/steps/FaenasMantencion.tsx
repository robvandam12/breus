
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Trash2, Plus, Wrench, Fish } from "lucide-react";
import type { MultiXData, FaenaMantencion } from '@/types/multix';

interface FaenasMantencionProps {
  formData: MultiXData;
  updateFormData: (data: Partial<MultiXData>) => void;
  errors?: Record<string, string>;
}

export const FaenasMantencion = ({ 
  formData, 
  updateFormData, 
  errors = {} 
}: FaenasMantencionProps) => {
  
  const addFaena = () => {
    const newFaena: FaenaMantencion = {
      id: `faena-${Date.now()}`,
      tipo: 'Red',
      jaulas: '',
      cantidad: 0,
      ubicacion: '',
      tipo_rotura: '2×1',
      retensado: false,
      descostura: false,
      objetos: false,
      otros: '',
      obs_faena: ''
    };
    
    const updatedFaenas = [...(formData.faenas_mantencion || []), newFaena];
    updateFormData({ faenas_mantencion: updatedFaenas });
  };

  const updateFaena = (id: string, updates: Partial<FaenaMantencion>) => {
    const updatedFaenas = (formData.faenas_mantencion || []).map(faena =>
      faena.id === id ? { ...faena, ...updates } : faena
    );
    updateFormData({ faenas_mantencion: updatedFaenas });
  };

  const removeFaena = (id: string) => {
    const updatedFaenas = (formData.faenas_mantencion || []).filter(faena => faena.id !== id);
    updateFormData({ faenas_mantencion: updatedFaenas });
  };

  const getTipoIcon = (tipo: string) => {
    switch (tipo) {
      case 'Red': return <Fish className="h-4 w-4 text-blue-500" />;
      case 'Lobera': return <Fish className="h-4 w-4 text-green-500" />;
      case 'Peceras': return <Fish className="h-4 w-4 text-purple-500" />;
      default: return <Wrench className="h-4 w-4 text-gray-500" />;
    }
  };

  const faenas = formData.faenas_mantencion || [];

  return (
    <div className="space-y-6">
      <div className="text-center mb-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-2">
          Faenas de Mantención
        </h3>
        <p className="text-sm text-gray-600">
          Registro de trabajos de mantención en redes, loberas y peceras
        </p>
      </div>

      {/* Resumen de faenas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wrench className="h-4 w-4" />
            Resumen de Faenas ({faenas.length} registradas)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-3 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {faenas.filter(f => f.tipo === 'Red').length}
              </div>
              <div className="text-sm text-blue-600">Redes</div>
            </div>
            <div className="text-center p-3 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {faenas.filter(f => f.tipo === 'Lobera').length}
              </div>
              <div className="text-sm text-green-600">Loberas</div>
            </div>
            <div className="text-center p-3 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {faenas.filter(f => f.tipo === 'Peceras').length}
              </div>
              <div className="text-sm text-purple-600">Peceras</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Lista de faenas */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-base">Faenas Registradas</CardTitle>
            <Button onClick={addFaena} size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Agregar Faena
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {faenas.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Wrench className="mx-auto h-12 w-12 mb-4 text-gray-300" />
              <p>No hay faenas registradas</p>
              <p className="text-sm">Agrega faenas de mantención para continuar</p>
            </div>
          ) : (
            <div className="space-y-4">
              {faenas.map((faena) => (
                <Card key={faena.id} className="border border-gray-200">
                  <CardContent className="p-4">
                    <div className="space-y-4">
                      {/* Información básica */}
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                        <div>
                          <Label htmlFor={`tipo-${faena.id}`}>Tipo de Estructura</Label>
                          <Select
                            value={faena.tipo}
                            onValueChange={(value) => updateFaena(faena.id, { tipo: value as any })}
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Red">Red</SelectItem>
                              <SelectItem value="Lobera">Lobera</SelectItem>
                              <SelectItem value="Peceras">Peceras</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div>
                          <Label htmlFor={`jaulas-${faena.id}`}>Jaulas</Label>
                          <Input
                            id={`jaulas-${faena.id}`}
                            value={faena.jaulas}
                            onChange={(e) => updateFaena(faena.id, { jaulas: e.target.value })}
                            placeholder="Ej: J1, J2, J3"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`cantidad-${faena.id}`}>Cantidad</Label>
                          <Input
                            id={`cantidad-${faena.id}`}
                            type="number"
                            value={faena.cantidad}
                            onChange={(e) => updateFaena(faena.id, { cantidad: parseInt(e.target.value) || 0 })}
                            placeholder="0"
                          />
                        </div>

                        <div>
                          <Label htmlFor={`ubicacion-${faena.id}`}>Ubicación</Label>
                          <Input
                            id={`ubicacion-${faena.id}`}
                            value={faena.ubicacion}
                            onChange={(e) => updateFaena(faena.id, { ubicacion: e.target.value })}
                            placeholder="Ej: Sector Norte"
                          />
                        </div>
                      </div>

                      {/* Tipo de rotura */}
                      <div>
                        <Label htmlFor={`rotura-${faena.id}`}>Tipo de Rotura</Label>
                        <Select
                          value={faena.tipo_rotura}
                          onValueChange={(value) => updateFaena(faena.id, { tipo_rotura: value as any })}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="2×1">2×1</SelectItem>
                            <SelectItem value="2×2">2×2</SelectItem>
                            <SelectItem value=">2×2">&gt;2×2</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      {/* Checkboxes de trabajo realizado */}
                      <div>
                        <Label className="text-sm font-medium mb-3 block">Trabajos Realizados</Label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`retensado-${faena.id}`}
                              checked={faena.retensado}
                              onCheckedChange={(checked) => updateFaena(faena.id, { retensado: checked as boolean })}
                            />
                            <Label htmlFor={`retensado-${faena.id}`} className="text-sm">Retensado</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`descostura-${faena.id}`}
                              checked={faena.descostura}
                              onCheckedChange={(checked) => updateFaena(faena.id, { descostura: checked as boolean })}
                            />
                            <Label htmlFor={`descostura-${faena.id}`} className="text-sm">Descostura</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`objetos-${faena.id}`}
                              checked={faena.objetos}
                              onCheckedChange={(checked) => updateFaena(faena.id, { objetos: checked as boolean })}
                            />
                            <Label htmlFor={`objetos-${faena.id}`} className="text-sm">Retiro Objetos</Label>
                          </div>

                          <div>
                            <Input
                              value={faena.otros}
                              onChange={(e) => updateFaena(faena.id, { otros: e.target.value })}
                              placeholder="Otros trabajos..."
                              className="text-sm"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Observaciones */}
                      <div>
                        <Label htmlFor={`obs-${faena.id}`}>Observaciones</Label>
                        <Textarea
                          id={`obs-${faena.id}`}
                          value={faena.obs_faena}
                          onChange={(e) => updateFaena(faena.id, { obs_faena: e.target.value })}
                          placeholder="Observaciones adicionales de la faena..."
                          className="min-h-[60px]"
                        />
                      </div>

                      {/* Botón eliminar */}
                      <div className="flex justify-between items-center pt-2 border-t">
                        <div className="flex items-center gap-2">
                          {getTipoIcon(faena.tipo)}
                          <span className="text-sm font-medium">{faena.tipo} - {faena.jaulas || 'Sin jaulas'}</span>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => removeFaena(faena.id)}
                          className="text-red-600 hover:text-red-700"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Información de ayuda */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-start gap-2">
          <Wrench className="h-4 w-4 text-blue-600 mt-0.5" />
          <div>
            <p className="text-sm font-medium text-blue-900">Registro de Faenas</p>
            <ul className="text-sm text-blue-700 mt-1 space-y-1">
              <li>• Registra cada estructura trabajada por separado</li>
              <li>• Especifica el tipo de rotura encontrada</li>
              <li>• Marca todos los trabajos realizados</li>
              <li>• Incluye observaciones relevantes</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
