
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Wrench, Settings, HandHeart } from "lucide-react";
import type { FichaBuzo } from '@/types/fishing-networks';

interface BuzoFormSectionProps {
  ficha: FichaBuzo;
  onUpdate: (ficha: FichaBuzo) => void;
  readOnly?: boolean;
}

export const BuzoFormSection = ({ ficha, onUpdate, readOnly = false }: BuzoFormSectionProps) => {
  const updateFaenasMantencion = (field: string, value: any) => {
    onUpdate({
      ...ficha,
      faenas_mantencion: {
        ...ficha.faenas_mantencion,
        [field]: value
      }
    });
  };

  const updateSistemasEquipos = (field: string, value: any) => {
    onUpdate({
      ...ficha,
      sistemas_equipos: {
        ...ficha.sistemas_equipos,
        [field]: value
      }
    });
  };

  const updateApoyoFaenas = (field: string, value: any) => {
    onUpdate({
      ...ficha,
      apoyo_faenas: {
        ...ficha.apoyo_faenas,
        [field]: value
      }
    });
  };

  const updateActividad = (section: 'sistemas_equipos' | 'apoyo_faenas', field: string, subField: 'checked' | 'cantidad' | 'descripcion', value: any) => {
    if (section === 'sistemas_equipos') {
      updateSistemasEquipos(field, {
        ...ficha.sistemas_equipos[field as keyof typeof ficha.sistemas_equipos],
        [subField]: value
      });
    } else {
      updateApoyoFaenas('actividades', {
        ...ficha.apoyo_faenas.actividades,
        [field]: {
          ...ficha.apoyo_faenas.actividades[field as keyof typeof ficha.apoyo_faenas.actividades],
          [subField]: value
        }
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* 4.1 Faenas de mantención */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Wrench className="w-4 h-4" />
            Faenas de Mantención
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`red_lober_${ficha.buzo_numero}`}
                checked={ficha.faenas_mantencion.red_lober}
                onCheckedChange={(checked) => updateFaenasMantencion('red_lober', checked)}
                disabled={readOnly}
              />
              <Label htmlFor={`red_lober_${ficha.buzo_numero}`}>Red Lober</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`red_pecera_${ficha.buzo_numero}`}
                checked={ficha.faenas_mantencion.red_pecera}
                onCheckedChange={(checked) => updateFaenasMantencion('red_pecera', checked)}
                disabled={readOnly}
              />
              <Label htmlFor={`red_pecera_${ficha.buzo_numero}`}>Red Pecera</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`reparacion_roturas_${ficha.buzo_numero}`}
                checked={ficha.faenas_mantencion.reparacion_roturas}
                onCheckedChange={(checked) => updateFaenasMantencion('reparacion_roturas', checked)}
                disabled={readOnly}
              />
              <Label htmlFor={`reparacion_roturas_${ficha.buzo_numero}`}>Reparación roturas</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`reparacion_descosturas_${ficha.buzo_numero}`}
                checked={ficha.faenas_mantencion.reparacion_descosturas}
                onCheckedChange={(checked) => updateFaenasMantencion('reparacion_descosturas', checked)}
                disabled={readOnly}
              />
              <Label htmlFor={`reparacion_descosturas_${ficha.buzo_numero}`}>Reparación descosturas</Label>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>Nº jaula(s)</Label>
              <Input
                value={ficha.faenas_mantencion.num_jaulas}
                onChange={(e) => updateFaenasMantencion('num_jaulas', e.target.value)}
                placeholder="Ej: 1, 2, 3"
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label>Cantidad</Label>
              <Input
                type="number"
                value={ficha.faenas_mantencion.cantidad}
                onChange={(e) => updateFaenasMantencion('cantidad', Number(e.target.value))}
                min="0"
                disabled={readOnly}
              />
            </div>
            <div className="space-y-2">
              <Label>Ubicación</Label>
              <Input
                value={ficha.faenas_mantencion.ubicacion}
                onChange={(e) => updateFaenasMantencion('ubicacion', e.target.value)}
                placeholder="Ubicación específica"
                disabled={readOnly}
              />
            </div>
          </div>

          <div className="space-y-3">
            <Label>Tipo de rotura</Label>
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`tipo_rotura_2x1_${ficha.buzo_numero}`}
                  checked={ficha.faenas_mantencion.tipo_rotura_2x1}
                  onCheckedChange={(checked) => updateFaenasMantencion('tipo_rotura_2x1', checked)}
                  disabled={readOnly}
                />
                <Label htmlFor={`tipo_rotura_2x1_${ficha.buzo_numero}`}>2×1</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`tipo_rotura_2x2_${ficha.buzo_numero}`}
                  checked={ficha.faenas_mantencion.tipo_rotura_2x2}
                  onCheckedChange={(checked) => updateFaenasMantencion('tipo_rotura_2x2', checked)}
                  disabled={readOnly}
                />
                <Label htmlFor={`tipo_rotura_2x2_${ficha.buzo_numero}`}>2×2</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox
                  id={`tipo_rotura_mayor_2x2_${ficha.buzo_numero}`}
                  checked={ficha.faenas_mantencion.tipo_rotura_mayor_2x2}
                  onCheckedChange={(checked) => updateFaenasMantencion('tipo_rotura_mayor_2x2', checked)}
                  disabled={readOnly}
                />
                <Label htmlFor={`tipo_rotura_mayor_2x2_${ficha.buzo_numero}`}>Mayor 2×2</Label>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observaciones</Label>
            <Textarea
              value={ficha.faenas_mantencion.observaciones}
              onChange={(e) => updateFaenasMantencion('observaciones', e.target.value)}
              placeholder="Observaciones de faenas de mantención"
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* 4.2 Sistemas y equipos */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <Settings className="w-4 h-4" />
            Sistemas y Equipos
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {[
              { key: 'instalacion', label: 'Instalación' },
              { key: 'mantencion', label: 'Mantención' },
              { key: 'recuperacion', label: 'Recuperación' },
              { key: 'limpieza', label: 'Limpieza' },
              { key: 'ajuste', label: 'Ajuste' },
              { key: 'focos_fotoperiodo', label: 'Focos fotoperíodo' },
              { key: 'extractor_mortalidad', label: 'Extractor de mortalidad' },
              { key: 'sistema_aireacion', label: 'Sistema de aireación' },
              { key: 'sistema_oxigenacion', label: 'Sistema de oxigenación' }
            ].map((item) => {
              const fieldData = ficha.sistemas_equipos[item.key as keyof typeof ficha.sistemas_equipos];
              return (
                <div key={item.key} className="flex items-center space-x-3">
                  <Checkbox
                    id={`${item.key}_${ficha.buzo_numero}`}
                    checked={fieldData.checked}
                    onCheckedChange={(checked) => updateActividad('sistemas_equipos', item.key, 'checked', checked)}
                    disabled={readOnly}
                  />
                  <Label htmlFor={`${item.key}_${ficha.buzo_numero}`} className="flex-1">
                    {item.label}
                  </Label>
                  <Input
                    type="number"
                    value={fieldData.cantidad}
                    onChange={(e) => updateActividad('sistemas_equipos', item.key, 'cantidad', Number(e.target.value))}
                    className="w-20"
                    min="0"
                    disabled={readOnly || !fieldData.checked}
                  />
                </div>
              );
            })}
            
            {/* Otros con descripción */}
            <div className="col-span-full space-y-2">
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={`otros_${ficha.buzo_numero}`}
                  checked={ficha.sistemas_equipos.otros.checked}
                  onCheckedChange={(checked) => updateActividad('sistemas_equipos', 'otros', 'checked', checked)}
                  disabled={readOnly}
                />
                <Label htmlFor={`otros_${ficha.buzo_numero}`} className="flex-1">Otros</Label>
                <Input
                  type="number"
                  value={ficha.sistemas_equipos.otros.cantidad}
                  onChange={(e) => updateActividad('sistemas_equipos', 'otros', 'cantidad', Number(e.target.value))}
                  className="w-20"
                  min="0"
                  disabled={readOnly || !ficha.sistemas_equipos.otros.checked}
                />
              </div>
              {ficha.sistemas_equipos.otros.checked && (
                <Input
                  value={ficha.sistemas_equipos.otros.descripcion}
                  onChange={(e) => updateActividad('sistemas_equipos', 'otros', 'descripcion', e.target.value)}
                  placeholder="Descripción de otros equipos"
                  disabled={readOnly}
                />
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observaciones</Label>
            <Textarea
              value={ficha.sistemas_equipos.observaciones}
              onChange={(e) => updateSistemasEquipos('observaciones', e.target.value)}
              placeholder="Observaciones de sistemas y equipos"
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>

      {/* 4.3 Apoyo faenas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base">
            <HandHeart className="w-4 h-4" />
            Apoyo a Faenas
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`apoyo_red_lober_${ficha.buzo_numero}`}
                checked={ficha.apoyo_faenas.red_lober}
                onCheckedChange={(checked) => updateApoyoFaenas('red_lober', checked)}
                disabled={readOnly}
              />
              <Label htmlFor={`apoyo_red_lober_${ficha.buzo_numero}`}>Red Lober</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`apoyo_red_pecera_${ficha.buzo_numero}`}
                checked={ficha.apoyo_faenas.red_pecera}
                onCheckedChange={(checked) => updateApoyoFaenas('red_pecera', checked)}
                disabled={readOnly}
              />
              <Label htmlFor={`apoyo_red_pecera_${ficha.buzo_numero}`}>Red Pecera</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`apoyo_balsas_${ficha.buzo_numero}`}
                checked={ficha.apoyo_faenas.balsas}
                onCheckedChange={(checked) => updateApoyoFaenas('balsas', checked)}
                disabled={readOnly}
              />
              <Label htmlFor={`apoyo_balsas_${ficha.buzo_numero}`}>Balsas</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id={`apoyo_cosecha_${ficha.buzo_numero}`}
                checked={ficha.apoyo_faenas.cosecha}
                onCheckedChange={(checked) => updateApoyoFaenas('cosecha', checked)}
                disabled={readOnly}
              />
              <Label htmlFor={`apoyo_cosecha_${ficha.buzo_numero}`}>Cosecha</Label>
            </div>
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Actividades</Label>
            <div className="space-y-3">
              {[
                { key: 'soltar_reinstalar_tensores', label: 'Soltar y reinstalar tensores' },
                { key: 'reparacion_red', label: 'Reparación red' },
                { key: 'reinstalacion_extractor', label: 'Reinstalación extractor' },
                { key: 'instalacion_reventadores', label: 'Instalación de reventadores' },
                { key: 'recuperacion_fondones', label: 'Recuperación de fondones' }
              ].map((actividad) => {
                const actData = ficha.apoyo_faenas.actividades[actividad.key as keyof typeof ficha.apoyo_faenas.actividades];
                return (
                  <div key={actividad.key} className="flex items-center space-x-3">
                    <Checkbox
                      id={`${actividad.key}_${ficha.buzo_numero}`}
                      checked={actData.checked}
                      onCheckedChange={(checked) => updateActividad('apoyo_faenas', actividad.key, 'checked', checked)}
                      disabled={readOnly}
                    />
                    <Label htmlFor={`${actividad.key}_${ficha.buzo_numero}`} className="flex-1">
                      {actividad.label}
                    </Label>
                    <Input
                      type="number"
                      value={actData.cantidad}
                      onChange={(e) => updateActividad('apoyo_faenas', actividad.key, 'cantidad', Number(e.target.value))}
                      className="w-20"
                      min="0"
                      disabled={readOnly || !actData.checked}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div className="space-y-2">
            <Label>Observaciones</Label>
            <Textarea
              value={ficha.apoyo_faenas.observaciones}
              onChange={(e) => updateApoyoFaenas('observaciones', e.target.value)}
              placeholder="Observaciones de apoyo a faenas"
              disabled={readOnly}
            />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
