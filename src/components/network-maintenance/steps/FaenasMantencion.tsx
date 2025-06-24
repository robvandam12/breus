
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Trash2, Wrench } from "lucide-react";
import type { NetworkMaintenanceData, FaenaMantencion } from '@/types/network-maintenance';

interface FaenasMantencionProps {
  formData: NetworkMaintenanceData;
  updateFormData: (updates: Partial<NetworkMaintenanceData>) => void;
  readOnly?: boolean;
}

export const FaenasMantencion = ({ formData, updateFormData, readOnly = false }: FaenasMantencionProps) => {
  const faenas = formData.faenas_mantencion || [];

  const addFaena = () => {
    const newFaena: FaenaMantencion = {
      id: Date.now().toString(),
      tipo_mantencion: 'reparacion_red',
      cantidad: 0,
      unidad: 'm2',
      descripcion_trabajo: '',
      tipo_seccion: 'red' as const,
      jaulas: '',
      ubicacion: '',
      tipo_rotura: '2x1' as const,
      retensado: false,
      descostura: false,
      objetos: false,
      otros: '',
      obs_faena: ''
    };

    updateFormData({
      faenas_mantencion: [...faenas, newFaena]
    });
  };

  const updateFaena = (id: string, field: keyof FaenaMantencion, value: any) => {
    const updatedFaenas = faenas.map(faena =>
      faena.id === id ? { ...faena, [field]: value } : faena
    );
    
    updateFormData({
      faenas_mantencion: updatedFaenas
    });
  };

  const removeFaena = (id: string) => {
    const filteredFaenas = faenas.filter(faena => faena.id !== id);
    updateFormData({
      faenas_mantencion: filteredFaenas
    });
  };

  const getSectionColor = (tipo: string) => {
    const colors = {
      'red': 'bg-blue-50 border-blue-200',
      'lobera': 'bg-green-50 border-green-200',
      'peceras': 'bg-purple-50 border-purple-200'
    };
    return colors[tipo as keyof typeof colors] || 'bg-gray-50 border-gray-200';
  };

  const getSectionIcon = (tipo: string) => {
    return tipo.charAt(0).toUpperCase() + tipo.slice(1);
  };

  // Agrupar faenas por tipo de sección
  const faenasPorSeccion = {
    red: faenas.filter(f => f.tipo_seccion === 'red'),
    lobera: faenas.filter(f => f.tipo_seccion === 'lobera'),
    peceras: faenas.filter(f => f.tipo_seccion === 'peceras')
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold flex items-center gap-2">
          <Wrench className="w-5 h-5" />
          Faenas de Mantención de Redes
        </h3>
        <p className="text-sm text-gray-600">
          Registro de trabajos de mantención por sección
        </p>
      </div>

      {/* Controles generales */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
          <CardTitle className="text-base">Lista de Faenas</CardTitle>
          {!readOnly && (
            <Button onClick={addFaena} size="sm">
              <Plus className="w-4 h-4 mr-2" />
              Agregar Faena
            </Button>
          )}
        </CardHeader>
        <CardContent>
          {faenas.length === 0 ? (
            <p className="text-center text-gray-500 py-8">
              No hay faenas registradas
            </p>
          ) : (
            <div className="space-y-6">
              {Object.entries(faenasPorSeccion).map(([seccion, faenasSeccion]) => 
                faenasSeccion.length > 0 && (
                  <div key={seccion} className="space-y-4">
                    <h4 className="font-semibold text-lg capitalize flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full ${seccion === 'red' ? 'bg-blue-500' : seccion === 'lobera' ? 'bg-green-500' : 'bg-purple-500'}`}></div>
                      {getSectionIcon(seccion)} ({faenasSeccion.length})
                    </h4>
                    {faenasSeccion.map((faena) => (
                      <div key={faena.id} className={`p-4 border rounded-lg ${getSectionColor(faena.tipo_seccion)}`}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                          <div>
                            <Label htmlFor={`tipo_mantencion_${faena.id}`}>Tipo de Mantención</Label>
                            <Select
                              value={faena.tipo_mantencion}
                              onValueChange={(value) => updateFaena(faena.id, 'tipo_mantencion', value)}
                              disabled={readOnly}
                            >
                              <SelectTrigger id={`tipo_mantencion_${faena.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="reparacion_red">Reparación de Red</SelectItem>
                                <SelectItem value="cambio_malla">Cambio de Malla</SelectItem>
                                <SelectItem value="instalacion">Instalación</SelectItem>
                                <SelectItem value="mantenimiento_preventivo">Mantención Preventiva</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor={`tipo_seccion_${faena.id}`}>Tipo de Sección</Label>
                            <Select
                              value={faena.tipo_seccion}
                              onValueChange={(value) => updateFaena(faena.id, 'tipo_seccion', value)}
                              disabled={readOnly}
                            >
                              <SelectTrigger id={`tipo_seccion_${faena.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="red">Red</SelectItem>
                                <SelectItem value="lobera">Lobera</SelectItem>
                                <SelectItem value="peceras">Peceras</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor={`jaulas_${faena.id}`}>Nº Jaula(s)</Label>
                            <Input
                              id={`jaulas_${faena.id}`}
                              value={faena.jaulas}
                              onChange={(e) => updateFaena(faena.id, 'jaulas', e.target.value)}
                              placeholder="Ej: 1, 2-5, 10"
                              disabled={readOnly}
                            />
                          </div>

                          <div>
                            <Label htmlFor={`cantidad_${faena.id}`}>Cantidad</Label>
                            <Input
                              id={`cantidad_${faena.id}`}
                              type="number"
                              value={faena.cantidad}
                              onChange={(e) => updateFaena(faena.id, 'cantidad', Number(e.target.value))}
                              placeholder="0"
                              disabled={readOnly}
                            />
                          </div>

                          <div>
                            <Label htmlFor={`unidad_${faena.id}`}>Unidad</Label>
                            <Select
                              value={faena.unidad}
                              onValueChange={(value) => updateFaena(faena.id, 'unidad', value)}
                              disabled={readOnly}
                            >
                              <SelectTrigger id={`unidad_${faena.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="m2">m²</SelectItem>
                                <SelectItem value="m">metros</SelectItem>
                                <SelectItem value="unidades">unidades</SelectItem>
                                <SelectItem value="kg">kilogramos</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div>
                            <Label htmlFor={`ubicacion_${faena.id}`}>Ubicación</Label>
                            <Input
                              id={`ubicacion_${faena.id}`}
                              value={faena.ubicacion}
                              onChange={(e) => updateFaena(faena.id, 'ubicacion', e.target.value)}
                              placeholder="Descripción de ubicación"
                              disabled={readOnly}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                          <div>
                            <Label htmlFor={`descripcion_trabajo_${faena.id}`}>Descripción del Trabajo</Label>
                            <Textarea
                              id={`descripcion_trabajo_${faena.id}`}
                              value={faena.descripcion_trabajo}
                              onChange={(e) => updateFaena(faena.id, 'descripcion_trabajo', e.target.value)}
                              placeholder="Describe el trabajo realizado..."
                              rows={3}
                              disabled={readOnly}
                            />
                          </div>

                          <div>
                            <Label htmlFor={`tipo_rotura_${faena.id}`}>Tipo de Rotura</Label>
                            <Select
                              value={faena.tipo_rotura}
                              onValueChange={(value) => updateFaena(faena.id, 'tipo_rotura', value)}
                              disabled={readOnly}
                            >
                              <SelectTrigger id={`tipo_rotura_${faena.id}`}>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="2x1">2×1</SelectItem>
                                <SelectItem value="2x2">2×2</SelectItem>
                                <SelectItem value="mayor_2x2">&gt;2×2</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        {/* Checkboxes de actividades */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`retensado_${faena.id}`}
                              checked={faena.retensado}
                              onCheckedChange={(checked) => updateFaena(faena.id, 'retensado', checked)}
                              disabled={readOnly}
                            />
                            <Label htmlFor={`retensado_${faena.id}`}>Retensado</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`descostura_${faena.id}`}
                              checked={faena.descostura}
                              onCheckedChange={(checked) => updateFaena(faena.id, 'descostura', checked)}
                              disabled={readOnly}
                            />
                            <Label htmlFor={`descostura_${faena.id}`}>Descostura</Label>
                          </div>

                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={`objetos_${faena.id}`}
                              checked={faena.objetos}
                              onCheckedChange={(checked) => updateFaena(faena.id, 'objetos', checked)}
                              disabled={readOnly}
                            />
                            <Label htmlFor={`objetos_${faena.id}`}>Objetos</Label>
                          </div>

                          <div>
                            <Label htmlFor={`otros_${faena.id}`}>Otros</Label>
                            <Input
                              id={`otros_${faena.id}`}
                              value={faena.otros}
                              onChange={(e) => updateFaena(faena.id, 'otros', e.target.value)}
                              placeholder="Otros trabajos"
                              disabled={readOnly}
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor={`obs_faena_${faena.id}`}>Observaciones</Label>
                          <Textarea
                            id={`obs_faena_${faena.id}`}
                            value={faena.obs_faena}
                            onChange={(e) => updateFaena(faena.id, 'obs_faena', e.target.value)}
                            placeholder="Observaciones de la faena..."
                            rows={3}
                            disabled={readOnly}
                          />
                        </div>

                        {!readOnly && (
                          <div className="flex justify-end mt-4">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => removeFaena(faena.id)}
                              className="text-red-600 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4 mr-2" />
                              Eliminar Faena
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                )
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Resumen de faenas */}
      {faenas.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Resumen de Faenas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-2xl font-bold text-blue-600">{faenasPorSeccion.red.length}</div>
                <div className="text-sm text-blue-600">Faenas en Redes</div>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-2xl font-bold text-green-600">{faenasPorSeccion.lobera.length}</div>
                <div className="text-sm text-green-600">Faenas en Loberas</div>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-2xl font-bold text-purple-600">{faenasPorSeccion.peceras.length}</div>
                <div className="text-sm text-purple-600">Faenas en Peceras</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
