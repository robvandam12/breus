
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Separator } from "@/components/ui/separator";
import { BitacoraBuzoFormData } from "@/hooks/useBitacoras";

interface CreateBitacoraBuzoFormProps {
  onSubmit: (data: BitacoraBuzoFormData) => Promise<void>;
  onCancel: () => void;
  initialData?: any;
  isEditing?: boolean;
}

export const CreateBitacoraBuzoForm = ({ onSubmit, onCancel, initialData, isEditing }: CreateBitacoraBuzoFormProps) => {
  const [formData, setFormData] = useState<BitacoraBuzoFormData>({
    codigo: `BIT-BUZ-${Date.now()}`,
    inmersion_id: '',
    fecha: new Date().toISOString().split('T')[0],
    buzo: '',
    profundidad_maxima: 0,
    trabajos_realizados: '',
    estado_fisico_post: '',
    observaciones_tecnicas: '',
    // Additional fields for complete form
    folio: '',
    codigo_verificacion: '',
    empresa_nombre: '',
    centro_nombre: '',
    buzo_rut: '',
    supervisor_nombre: '',
    supervisor_rut: '',
    supervisor_correo: '',
    jefe_centro_correo: '',
    contratista_nombre: '',
    contratista_rut: '',
    // Condiciones ambientales
    condamb_estado_puerto: '',
    condamb_estado_mar: '',
    condamb_temp_aire_c: 0,
    condamb_temp_agua_c: 0,
    condamb_visibilidad_fondo_mts: 0,
    condamb_corriente_fondo_nudos: 0,
    // Datos técnicos del buceo
    datostec_equipo_usado: '',
    datostec_traje: '',
    datostec_hora_dejo_superficie: '',
    datostec_hora_llegada_fondo: '',
    datostec_hora_salida_fondo: '',
    datostec_hora_llegada_superficie: '',
    // Tiempos y tabulación
    tiempos_total_fondo: '',
    tiempos_total_descompresion: '',
    tiempos_total_buceo: '',
    tiempos_tabulacion_usada: '',
    tiempos_intervalo_superficie: '',
    tiempos_nitrogeno_residual: '',
    tiempos_grupo_repetitivo_anterior: '',
    tiempos_nuevo_grupo_repetitivo: '',
    // Objetivo del buceo
    objetivo_proposito: '',
    objetivo_tipo_area: '',
    objetivo_caracteristicas_dimensiones: '',
    // Condiciones y certificaciones
    condcert_buceo_altitud: false,
    condcert_certificados_equipos_usados: false,
    condcert_buceo_areas_confinadas: false,
    condcert_observaciones: '',
    // Firma final
    validador_nombre: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      await onSubmit(formData);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <Card className="w-full max-w-4xl">
      <CardHeader>
        <CardTitle>{isEditing ? 'Editar Bitácora de Buzo' : 'Nueva Bitácora de Buzo'}</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <Tabs defaultValue="identificacion" className="w-full">
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="identificacion">Identificación</TabsTrigger>
              <TabsTrigger value="datos-generales">Datos Generales</TabsTrigger>
              <TabsTrigger value="condiciones">Condiciones</TabsTrigger>
              <TabsTrigger value="buceo">Datos Buceo</TabsTrigger>
              <TabsTrigger value="objetivo">Objetivo</TabsTrigger>
              <TabsTrigger value="certificaciones">Certificaciones</TabsTrigger>
            </TabsList>

            <TabsContent value="identificacion" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="folio">Folio *</Label>
                  <Input
                    id="folio"
                    value={formData.folio}
                    onChange={(e) => updateField('folio', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="codigo_verificacion">Código de Verificación *</Label>
                  <Input
                    id="codigo_verificacion"
                    value={formData.codigo_verificacion}
                    onChange={(e) => updateField('codigo_verificacion', e.target.value)}
                    required
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="inmersion_id">Inmersión *</Label>
                <Select
                  value={formData.inmersion_id}
                  onValueChange={(value) => updateField('inmersion_id', value)}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar inmersión" />
                  </SelectTrigger>
                  <SelectContent>
                    {/* This would be populated with actual inmersions */}
                    <SelectItem value="imm1">Inmersión 001</SelectItem>
                    <SelectItem value="imm2">Inmersión 002</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </TabsContent>

            <TabsContent value="datos-generales" className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="empresa_nombre">Empresa *</Label>
                  <Input
                    id="empresa_nombre"
                    value={formData.empresa_nombre}
                    onChange={(e) => updateField('empresa_nombre', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="centro_nombre">Nombre del Centro *</Label>
                  <Input
                    id="centro_nombre"
                    value={formData.centro_nombre}
                    onChange={(e) => updateField('centro_nombre', e.target.value)}
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="fecha">Fecha *</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={formData.fecha}
                  onChange={(e) => updateField('fecha', e.target.value)}
                  required
                />
              </div>

              <Separator />
              <h3 className="text-lg font-semibold">Datos del Buzo</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="buzo">Nombre del Buzo *</Label>
                  <Input
                    id="buzo"
                    value={formData.buzo}
                    onChange={(e) => updateField('buzo', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="buzo_rut">RUT del Buzo *</Label>
                  <Input
                    id="buzo_rut"
                    value={formData.buzo_rut}
                    onChange={(e) => updateField('buzo_rut', e.target.value)}
                    required
                  />
                </div>
              </div>

              <Separator />
              <h3 className="text-lg font-semibold">Datos del Supervisor</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="supervisor_nombre">Nombre del Supervisor *</Label>
                  <Input
                    id="supervisor_nombre"
                    value={formData.supervisor_nombre}
                    onChange={(e) => updateField('supervisor_nombre', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supervisor_rut">RUT del Supervisor *</Label>
                  <Input
                    id="supervisor_rut"
                    value={formData.supervisor_rut}
                    onChange={(e) => updateField('supervisor_rut', e.target.value)}
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="supervisor_correo">Correo del Supervisor</Label>
                  <Input
                    id="supervisor_correo"
                    type="email"
                    value={formData.supervisor_correo}
                    onChange={(e) => updateField('supervisor_correo', e.target.value)}
                  />
                </div>
              </div>

              <Separator />
              <h3 className="text-lg font-semibold">Otros Contactos</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="jefe_centro_correo">Correo del Jefe de Centro</Label>
                  <Input
                    id="jefe_centro_correo"
                    type="email"
                    value={formData.jefe_centro_correo}
                    onChange={(e) => updateField('jefe_centro_correo', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contratista_nombre">Nombre del Contratista</Label>
                  <Input
                    id="contratista_nombre"
                    value={formData.contratista_nombre}
                    onChange={(e) => updateField('contratista_nombre', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contratista_rut">RUT del Contratista</Label>
                  <Input
                    id="contratista_rut"
                    value={formData.contratista_rut}
                    onChange={(e) => updateField('contratista_rut', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="condiciones" className="space-y-4">
              <h3 className="text-lg font-semibold">Condiciones Ambientales</h3>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="condamb_estado_puerto">Estado del Puerto</Label>
                  <Select
                    value={formData.condamb_estado_puerto}
                    onValueChange={(value) => updateField('condamb_estado_puerto', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abierto">Abierto</SelectItem>
                      <SelectItem value="cerrado">Cerrado</SelectItem>
                      <SelectItem value="restringido">Restringido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condamb_estado_mar">Estado del Mar</Label>
                  <Select
                    value={formData.condamb_estado_mar}
                    onValueChange={(value) => updateField('condamb_estado_mar', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar estado" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="calmo">Calmo</SelectItem>
                      <SelectItem value="moderado">Moderado</SelectItem>
                      <SelectItem value="agitado">Agitado</SelectItem>
                      <SelectItem value="muy-agitado">Muy Agitado</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="condamb_temp_aire_c">Temperatura del Aire (°C)</Label>
                  <Input
                    id="condamb_temp_aire_c"
                    type="number"
                    value={formData.condamb_temp_aire_c}
                    onChange={(e) => updateField('condamb_temp_aire_c', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condamb_temp_agua_c">Temperatura del Agua (°C)</Label>
                  <Input
                    id="condamb_temp_agua_c"
                    type="number"
                    value={formData.condamb_temp_agua_c}
                    onChange={(e) => updateField('condamb_temp_agua_c', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condamb_visibilidad_fondo_mts">Visibilidad del Fondo (mts)</Label>
                  <Input
                    id="condamb_visibilidad_fondo_mts"
                    type="number"
                    value={formData.condamb_visibilidad_fondo_mts}
                    onChange={(e) => updateField('condamb_visibilidad_fondo_mts', Number(e.target.value))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="condamb_corriente_fondo_nudos">Corriente del Fondo (nudos)</Label>
                  <Input
                    id="condamb_corriente_fondo_nudos"
                    type="number"
                    step="0.1"
                    value={formData.condamb_corriente_fondo_nudos}
                    onChange={(e) => updateField('condamb_corriente_fondo_nudos', Number(e.target.value))}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="buceo" className="space-y-4">
              <h3 className="text-lg font-semibold">Datos Técnicos del Buceo</h3>
              
              <div className="grid grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="datostec_equipo_usado">Equipo Usado</Label>
                  <Input
                    id="datostec_equipo_usado"
                    value={formData.datostec_equipo_usado}
                    onChange={(e) => updateField('datostec_equipo_usado', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="datostec_traje">Traje</Label>
                  <Input
                    id="datostec_traje"
                    value={formData.datostec_traje}
                    onChange={(e) => updateField('datostec_traje', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="profundidad_maxima">Profundidad Máxima (m) *</Label>
                  <Input
                    id="profundidad_maxima"
                    type="number"
                    value={formData.profundidad_maxima}
                    onChange={(e) => updateField('profundidad_maxima', Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="datostec_hora_dejo_superficie">Hora en que dejó superficie</Label>
                  <Input
                    id="datostec_hora_dejo_superficie"
                    type="time"
                    value={formData.datostec_hora_dejo_superficie}
                    onChange={(e) => updateField('datostec_hora_dejo_superficie', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="datostec_hora_llegada_fondo">Hora de llegada al fondo</Label>
                  <Input
                    id="datostec_hora_llegada_fondo"
                    type="time"
                    value={formData.datostec_hora_llegada_fondo}
                    onChange={(e) => updateField('datostec_hora_llegada_fondo', e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="datostec_hora_salida_fondo">Hora de salida del fondo</Label>
                  <Input
                    id="datostec_hora_salida_fondo"
                    type="time"
                    value={formData.datostec_hora_salida_fondo}
                    onChange={(e) => updateField('datostec_hora_salida_fondo', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="datostec_hora_llegada_superficie">Hora de llegada a superficie</Label>
                  <Input
                    id="datostec_hora_llegada_superficie"
                    type="time"
                    value={formData.datostec_hora_llegada_superficie}
                    onChange={(e) => updateField('datostec_hora_llegada_superficie', e.target.value)}
                  />
                </div>
              </div>

              <Separator />
              <h3 className="text-lg font-semibold">Tiempos y Tabulación</h3>
              
              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tiempos_total_fondo">Tiempo total en el fondo</Label>
                  <Input
                    id="tiempos_total_fondo"
                    value={formData.tiempos_total_fondo}
                    onChange={(e) => updateField('tiempos_total_fondo', e.target.value)}
                    placeholder="ej: 45 min"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiempos_total_descompresion">Tiempo total de descompresión</Label>
                  <Input
                    id="tiempos_total_descompresion"
                    value={formData.tiempos_total_descompresion}
                    onChange={(e) => updateField('tiempos_total_descompresion', e.target.value)}
                    placeholder="ej: 10 min"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiempos_total_buceo">Tiempo total de buceo</Label>
                  <Input
                    id="tiempos_total_buceo"
                    value={formData.tiempos_total_buceo}
                    onChange={(e) => updateField('tiempos_total_buceo', e.target.value)}
                    placeholder="ej: 55 min"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiempos_tabulacion_usada">Tabulación usada</Label>
                  <Input
                    id="tiempos_tabulacion_usada"
                    value={formData.tiempos_tabulacion_usada}
                    onChange={(e) => updateField('tiempos_tabulacion_usada', e.target.value)}
                    placeholder="ej: PADI RDP"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="tiempos_intervalo_superficie">Intervalo en superficie</Label>
                  <Input
                    id="tiempos_intervalo_superficie"
                    value={formData.tiempos_intervalo_superficie}
                    onChange={(e) => updateField('tiempos_intervalo_superficie', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiempos_nitrogeno_residual">Nitrógeno residual</Label>
                  <Input
                    id="tiempos_nitrogeno_residual"
                    value={formData.tiempos_nitrogeno_residual}
                    onChange={(e) => updateField('tiempos_nitrogeno_residual', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiempos_grupo_repetitivo_anterior">Grupo repetitivo anterior</Label>
                  <Input
                    id="tiempos_grupo_repetitivo_anterior"
                    value={formData.tiempos_grupo_repetitivo_anterior}
                    onChange={(e) => updateField('tiempos_grupo_repetitivo_anterior', e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="tiempos_nuevo_grupo_repetitivo">Nuevo grupo repetitivo</Label>
                  <Input
                    id="tiempos_nuevo_grupo_repetitivo"
                    value={formData.tiempos_nuevo_grupo_repetitivo}
                    onChange={(e) => updateField('tiempos_nuevo_grupo_repetitivo', e.target.value)}
                  />
                </div>
              </div>
            </TabsContent>

            <TabsContent value="objetivo" className="space-y-4">
              <h3 className="text-lg font-semibold">Objetivo del Buceo</h3>
              
              <div className="space-y-2">
                <Label htmlFor="objetivo_proposito">Propósito del Buceo *</Label>
                <Textarea
                  id="objetivo_proposito"
                  value={formData.objetivo_proposito}
                  onChange={(e) => updateField('objetivo_proposito', e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objetivo_tipo_area">Tipo de Área</Label>
                <Input
                  id="objetivo_tipo_area"
                  value={formData.objetivo_tipo_area}
                  onChange={(e) => updateField('objetivo_tipo_area', e.target.value)}
                  placeholder="ej: Centro de cultivo, puerto, etc."
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="objetivo_caracteristicas_dimensiones">Características y/o Dimensiones</Label>
                <Textarea
                  id="objetivo_caracteristicas_dimensiones"
                  value={formData.objetivo_caracteristicas_dimensiones}
                  onChange={(e) => updateField('objetivo_caracteristicas_dimensiones', e.target.value)}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="trabajos_realizados">Trabajos Realizados *</Label>
                <Textarea
                  id="trabajos_realizados"
                  value={formData.trabajos_realizados}
                  onChange={(e) => updateField('trabajos_realizados', e.target.value)}
                  required
                  rows={4}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="estado_fisico_post">Estado Físico Post-Inmersión *</Label>
                <Textarea
                  id="estado_fisico_post"
                  value={formData.estado_fisico_post}
                  onChange={(e) => updateField('estado_fisico_post', e.target.value)}
                  required
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="observaciones_tecnicas">Observaciones Técnicas</Label>
                <Textarea
                  id="observaciones_tecnicas"
                  value={formData.observaciones_tecnicas}
                  onChange={(e) => updateField('observaciones_tecnicas', e.target.value)}
                  rows={3}
                />
              </div>
            </TabsContent>

            <TabsContent value="certificaciones" className="space-y-4">
              <h3 className="text-lg font-semibold">Condiciones y Certificaciones</h3>
              
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="condcert_buceo_altitud"
                    checked={formData.condcert_buceo_altitud}
                    onChange={(e) => updateField('condcert_buceo_altitud', e.target.checked)}
                  />
                  <Label htmlFor="condcert_buceo_altitud">¿Buceo en altitud?</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="condcert_certificados_equipos_usados"
                    checked={formData.condcert_certificados_equipos_usados}
                    onChange={(e) => updateField('condcert_certificados_equipos_usados', e.target.checked)}
                  />
                  <Label htmlFor="condcert_certificados_equipos_usados">¿Certificados de los equipos usados?</Label>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    id="condcert_buceo_areas_confinadas"
                    checked={formData.condcert_buceo_areas_confinadas}
                    onChange={(e) => updateField('condcert_buceo_areas_confinadas', e.target.checked)}
                  />
                  <Label htmlFor="condcert_buceo_areas_confinadas">¿Buceo en áreas confinadas?</Label>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="condcert_observaciones">Observaciones</Label>
                <Textarea
                  id="condcert_observaciones"
                  value={formData.condcert_observaciones}
                  onChange={(e) => updateField('condcert_observaciones', e.target.value)}
                  rows={4}
                />
              </div>

              <Separator />
              <h3 className="text-lg font-semibold">Firma Final</h3>
              
              <div className="space-y-2">
                <Label htmlFor="validador_nombre">Nombre de quien valida (Ej.: Gerencia Aerocam)</Label>
                <Input
                  id="validador_nombre"
                  value={formData.validador_nombre}
                  onChange={(e) => updateField('validador_nombre', e.target.value)}
                />
              </div>
            </TabsContent>
          </Tabs>

          <div className="flex justify-end gap-3 pt-6 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? 'Guardando...' : (isEditing ? 'Actualizar' : 'Crear Bitácora')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
};
