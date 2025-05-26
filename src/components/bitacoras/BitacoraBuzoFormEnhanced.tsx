
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Save } from 'lucide-react';
import { BitacoraBuzoData } from '@/types/auth';

interface BitacoraBuzoFormEnhancedProps {
  initialData?: Partial<BitacoraBuzoData>;
  onSubmit: (data: BitacoraBuzoData) => void;
  onCancel: () => void;
}

export const BitacoraBuzoFormEnhanced: React.FC<BitacoraBuzoFormEnhancedProps> = ({
  initialData,
  onSubmit,
  onCancel
}) => {
  const [formData, setFormData] = useState<Partial<BitacoraBuzoData>>({
    folio: '',
    codigo_verificacion: '',
    empresa_nombre: '',
    centro_nombre: '',
    fecha: '',
    buzo_nombre: '',
    buzo_rut: '',
    supervisor_nombre: '',
    supervisor_rut: '',
    supervisor_correo: '',
    jefe_centro_correo: '',
    contratista_nombre: '',
    contratista_rut: '',
    condamb_estado_puerto: 'abierto',
    condamb_estado_mar: '',
    condamb_temp_aire_c: 0,
    condamb_temp_agua_c: 0,
    condamb_visibilidad_fondo_mts: 0,
    condamb_corriente_fondo_nudos: 0,
    datostec_equipo_usado: '',
    datostec_traje: '',
    datostec_profundidad_maxima: 0,
    datostec_hora_dejo_superficie: '',
    datostec_hora_llegada_fondo: '',
    datostec_hora_salida_fondo: '',
    datostec_hora_llegada_superficie: '',
    tiempos_total_fondo: '',
    tiempos_total_descompresion: '',
    tiempos_total_buceo: '',
    tiempos_tabulacion_usada: '',
    tiempos_intervalo_superficie: '',
    tiempos_nitrogeno_residual: '',
    tiempos_grupo_repetitivo_anterior: '',
    tiempos_nuevo_grupo_repetitivo: '',
    objetivo_proposito: '',
    objetivo_tipo_area: '',
    objetivo_caracteristicas_dimensiones: '',
    condcert_buceo_altitud: false,
    condcert_certificados_equipos_usados: false,
    condcert_buceo_areas_confinadas: false,
    condcert_observaciones: '',
    buzo_firma: null,
    validador_nombre: '',
    validador_firma: null,
    inmersion_id: '',
    ...initialData
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(formData as BitacoraBuzoData);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Bitácora del Buzo</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* 1. Identificación del Registro */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 1. Identificación del Registro</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="folio">Folio</Label>
                  <Input
                    id="folio"
                    value={formData.folio}
                    onChange={(e) => setFormData({...formData, folio: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="codigo_verificacion">Código de Verificación</Label>
                  <Input
                    id="codigo_verificacion"
                    value={formData.codigo_verificacion}
                    onChange={(e) => setFormData({...formData, codigo_verificacion: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="validador_nombre">Firma del Supervisor</Label>
                  <Input
                    id="validador_nombre"
                    value={formData.validador_nombre}
                    onChange={(e) => setFormData({...formData, validador_nombre: e.target.value})}
                    placeholder="Nombre del supervisor validador"
                  />
                </div>
              </div>
            </div>

            {/* 2. Datos Generales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 2. Datos Generales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="empresa_nombre">Empresa</Label>
                  <Input
                    id="empresa_nombre"
                    value={formData.empresa_nombre}
                    onChange={(e) => setFormData({...formData, empresa_nombre: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="centro_nombre">Nombre del Centro</Label>
                  <Input
                    id="centro_nombre"
                    value={formData.centro_nombre}
                    onChange={(e) => setFormData({...formData, centro_nombre: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input
                    id="fecha"
                    type="date"
                    value={formData.fecha}
                    onChange={(e) => setFormData({...formData, fecha: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 3. Datos del Buzo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 3. Datos del Buzo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="buzo_nombre">Nombre del Buzo</Label>
                  <Input
                    id="buzo_nombre"
                    value={formData.buzo_nombre}
                    onChange={(e) => setFormData({...formData, buzo_nombre: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="buzo_rut">RUT del Buzo</Label>
                  <Input
                    id="buzo_rut"
                    value={formData.buzo_rut}
                    onChange={(e) => setFormData({...formData, buzo_rut: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 4. Datos del Supervisor */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 4. Datos del Supervisor</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="supervisor_nombre">Nombre del Supervisor</Label>
                  <Input
                    id="supervisor_nombre"
                    value={formData.supervisor_nombre}
                    onChange={(e) => setFormData({...formData, supervisor_nombre: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="supervisor_rut">RUT del Supervisor</Label>
                  <Input
                    id="supervisor_rut"
                    value={formData.supervisor_rut}
                    onChange={(e) => setFormData({...formData, supervisor_rut: e.target.value})}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="supervisor_correo">Correo del Supervisor</Label>
                  <Input
                    id="supervisor_correo"
                    type="email"
                    value={formData.supervisor_correo}
                    onChange={(e) => setFormData({...formData, supervisor_correo: e.target.value})}
                    required
                  />
                </div>
              </div>
            </div>

            {/* 5. Otros Contactos */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 5. Otros Contactos</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="jefe_centro_correo">Correo del Jefe de Centro</Label>
                  <Input
                    id="jefe_centro_correo"
                    type="email"
                    value={formData.jefe_centro_correo}
                    onChange={(e) => setFormData({...formData, jefe_centro_correo: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="contratista_nombre">Nombre del Contratista de Buceo</Label>
                  <Input
                    id="contratista_nombre"
                    value={formData.contratista_nombre}
                    onChange={(e) => setFormData({...formData, contratista_nombre: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="contratista_rut">RUT del Contratista</Label>
                  <Input
                    id="contratista_rut"
                    value={formData.contratista_rut}
                    onChange={(e) => setFormData({...formData, contratista_rut: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* 6. Condiciones Ambientales */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 6. Condiciones Ambientales</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="estado_puerto">Estado del Puerto</Label>
                  <Select value={formData.condamb_estado_puerto} onValueChange={(value: 'abierto' | 'cerrado') => setFormData({...formData, condamb_estado_puerto: value})}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abierto">Abierto</SelectItem>
                      <SelectItem value="cerrado">Cerrado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="estado_mar">Estado del Mar</Label>
                  <Input
                    id="estado_mar"
                    value={formData.condamb_estado_mar}
                    onChange={(e) => setFormData({...formData, condamb_estado_mar: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="temp_aire">Temperatura del Aire (°C)</Label>
                  <Input
                    id="temp_aire"
                    type="number"
                    step="0.1"
                    value={formData.condamb_temp_aire_c}
                    onChange={(e) => setFormData({...formData, condamb_temp_aire_c: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="temp_agua">Temperatura del Agua (°C)</Label>
                  <Input
                    id="temp_agua"
                    type="number"
                    step="0.1"
                    value={formData.condamb_temp_agua_c}
                    onChange={(e) => setFormData({...formData, condamb_temp_agua_c: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="visibilidad">Visibilidad del Fondo (mts)</Label>
                  <Input
                    id="visibilidad"
                    type="number"
                    step="0.1"
                    value={formData.condamb_visibilidad_fondo_mts}
                    onChange={(e) => setFormData({...formData, condamb_visibilidad_fondo_mts: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="corriente">Corriente del Fondo (nudos)</Label>
                  <Input
                    id="corriente"
                    type="number"
                    step="0.1"
                    value={formData.condamb_corriente_fondo_nudos}
                    onChange={(e) => setFormData({...formData, condamb_corriente_fondo_nudos: parseFloat(e.target.value) || 0})}
                  />
                </div>
              </div>
            </div>

            {/* 7. Datos Técnicos del Buceo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 7. Datos Técnicos del Buceo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="equipo_usado">Equipo Usado</Label>
                  <Input
                    id="equipo_usado"
                    value={formData.datostec_equipo_usado}
                    onChange={(e) => setFormData({...formData, datostec_equipo_usado: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="traje">Traje</Label>
                  <Input
                    id="traje"
                    value={formData.datostec_traje}
                    onChange={(e) => setFormData({...formData, datostec_traje: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="profundidad_max">Profundidad Máxima</Label>
                  <Input
                    id="profundidad_max"
                    type="number"
                    step="0.1"
                    value={formData.datostec_profundidad_maxima}
                    onChange={(e) => setFormData({...formData, datostec_profundidad_maxima: parseFloat(e.target.value) || 0})}
                  />
                </div>
                <div>
                  <Label htmlFor="hora_dejo_superficie">Hora en que dejó superficie</Label>
                  <Input
                    id="hora_dejo_superficie"
                    type="time"
                    value={formData.datostec_hora_dejo_superficie}
                    onChange={(e) => setFormData({...formData, datostec_hora_dejo_superficie: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="hora_llegada_fondo">Hora de llegada al fondo</Label>
                  <Input
                    id="hora_llegada_fondo"
                    type="time"
                    value={formData.datostec_hora_llegada_fondo}
                    onChange={(e) => setFormData({...formData, datostec_hora_llegada_fondo: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="hora_salida_fondo">Hora de salida del fondo</Label>
                  <Input
                    id="hora_salida_fondo"
                    type="time"
                    value={formData.datostec_hora_salida_fondo}
                    onChange={(e) => setFormData({...formData, datostec_hora_salida_fondo: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="hora_llegada_superficie">Hora de llegada a superficie</Label>
                  <Input
                    id="hora_llegada_superficie"
                    type="time"
                    value={formData.datostec_hora_llegada_superficie}
                    onChange={(e) => setFormData({...formData, datostec_hora_llegada_superficie: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* 8. Tiempos y Tabulación */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 8. Tiempos y Tabulación</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="tiempo_fondo">Tiempo total en el fondo</Label>
                  <Input
                    id="tiempo_fondo"
                    value={formData.tiempos_total_fondo}
                    onChange={(e) => setFormData({...formData, tiempos_total_fondo: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="tiempo_descompresion">Tiempo total de descompresión</Label>
                  <Input
                    id="tiempo_descompresion"
                    value={formData.tiempos_total_descompresion}
                    onChange={(e) => setFormData({...formData, tiempos_total_descompresion: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="tiempo_buceo">Tiempo total de buceo</Label>
                  <Input
                    id="tiempo_buceo"
                    value={formData.tiempos_total_buceo}
                    onChange={(e) => setFormData({...formData, tiempos_total_buceo: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="tabulacion">Tabulación usada</Label>
                  <Input
                    id="tabulacion"
                    value={formData.tiempos_tabulacion_usada}
                    onChange={(e) => setFormData({...formData, tiempos_tabulacion_usada: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="intervalo">Intervalo en superficie</Label>
                  <Input
                    id="intervalo"
                    value={formData.tiempos_intervalo_superficie}
                    onChange={(e) => setFormData({...formData, tiempos_intervalo_superficie: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="nitrogeno">Nitrógeno residual</Label>
                  <Input
                    id="nitrogeno"
                    value={formData.tiempos_nitrogeno_residual}
                    onChange={(e) => setFormData({...formData, tiempos_nitrogeno_residual: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="grupo_anterior">Grupo repetitivo anterior</Label>
                  <Input
                    id="grupo_anterior"
                    value={formData.tiempos_grupo_repetitivo_anterior}
                    onChange={(e) => setFormData({...formData, tiempos_grupo_repetitivo_anterior: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="nuevo_grupo">Nuevo grupo repetitivo</Label>
                  <Input
                    id="nuevo_grupo"
                    value={formData.tiempos_nuevo_grupo_repetitivo}
                    onChange={(e) => setFormData({...formData, tiempos_nuevo_grupo_repetitivo: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* 9. Objetivo del Buceo */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 9. Objetivo del Buceo</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="proposito">Propósito del Buceo</Label>
                  <Input
                    id="proposito"
                    value={formData.objetivo_proposito}
                    onChange={(e) => setFormData({...formData, objetivo_proposito: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="tipo_area">Tipo de Área</Label>
                  <Input
                    id="tipo_area"
                    value={formData.objetivo_tipo_area}
                    onChange={(e) => setFormData({...formData, objetivo_tipo_area: e.target.value})}
                  />
                </div>
                <div>
                  <Label htmlFor="caracteristicas">Características y/o Dimensiones</Label>
                  <Input
                    id="caracteristicas"
                    value={formData.objetivo_caracteristicas_dimensiones}
                    onChange={(e) => setFormData({...formData, objetivo_caracteristicas_dimensiones: e.target.value})}
                  />
                </div>
              </div>
            </div>

            {/* 10. Condiciones y Certificaciones */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold border-b pb-2 text-green-700">🟩 10. Condiciones y Certificaciones</h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="buceo_altitud"
                    checked={formData.condcert_buceo_altitud}
                    onCheckedChange={(checked) => setFormData({...formData, condcert_buceo_altitud: !!checked})}
                  />
                  <Label htmlFor="buceo_altitud">¿Buceo en altitud?</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="certificados_equipos"
                    checked={formData.condcert_certificados_equipos_usados}
                    onCheckedChange={(checked) => setFormData({...formData, condcert_certificados_equipos_usados: !!checked})}
                  />
                  <Label htmlFor="certificados_equipos">¿Certificados de los equipos usados?</Label>
                </div>
                <div className="flex items-center space-x-2">
                  <Checkbox
                    id="areas_confinadas"
                    checked={formData.condcert_buceo_areas_confinadas}
                    onCheckedChange={(checked) => setFormData({...formData, condcert_buceo_areas_confinadas: !!checked})}
                  />
                  <Label htmlFor="areas_confinadas">¿Buceo en áreas confinadas?</Label>
                </div>
                <div>
                  <Label htmlFor="observaciones_cert">Observaciones</Label>
                  <Textarea
                    id="observaciones_cert"
                    value={formData.condcert_observaciones}
                    onChange={(e) => setFormData({...formData, condcert_observaciones: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-4 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit">
                <Save className="w-4 h-4 mr-2" />
                Guardar Bitácora
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
