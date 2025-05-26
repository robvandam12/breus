
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FileText, X, Clock, Thermometer, Eye, Activity } from "lucide-react";
import { useInmersiones } from "@/hooks/useInmersiones";
import { usePoolPersonal } from "@/hooks/usePoolPersonal";
import { BitacoraBuzoFormData } from "@/hooks/useBitacoras";

// Enhanced schema for complete Bitácora Buzo
const formSchema = z.object({
  // 1. Identificación del Registro
  folio: z.string().min(1, "El folio es requerido"),
  codigo_verificacion: z.string().min(1, "El código de verificación es requerido"),
  
  // 2. Datos Generales
  empresa_nombre: z.string().min(1, "El nombre de la empresa es requerido"),
  centro_nombre: z.string().min(1, "El nombre del centro es requerido"),
  fecha: z.string().min(1, "La fecha es requerida"),
  
  // 3. Datos del Buzo
  buzo_nombre: z.string().min(1, "El nombre del buzo es requerido"),
  buzo_rut: z.string().min(1, "El RUT del buzo es requerido"),
  
  // 4. Datos del Supervisor
  supervisor_nombre: z.string().min(1, "El nombre del supervisor es requerido"),
  supervisor_rut: z.string().min(1, "El RUT del supervisor es requerido"),
  supervisor_correo: z.string().email("Email inválido"),
  
  // 5. Otros Contactos
  jefe_centro_correo: z.string().email("Email inválido"),
  contratista_nombre: z.string().min(1, "El nombre del contratista es requerido"),
  contratista_rut: z.string().min(1, "El RUT del contratista es requerido"),
  
  // 6. Condiciones Ambientales
  condamb_estado_puerto: z.enum(["abierto", "cerrado"]),
  condamb_estado_mar: z.string().min(1, "El estado del mar es requerido"),
  condamb_temp_aire_c: z.number().min(-10).max(50),
  condamb_temp_agua_c: z.number().min(0).max(30),
  condamb_visibilidad_fondo_mts: z.number().min(0).max(100),
  condamb_corriente_fondo_nudos: z.number().min(0).max(10),
  
  // 7. Datos Técnicos del Buceo
  datostec_equipo_usado: z.string().min(1, "El equipo usado es requerido"),
  datostec_traje: z.string().min(1, "El tipo de traje es requerido"),
  datostec_profundidad_maxima: z.number().min(0, "La profundidad debe ser positiva"),
  datostec_hora_dejo_superficie: z.string().min(1, "La hora es requerida"),
  datostec_hora_llegada_fondo: z.string().min(1, "La hora es requerida"),
  datostec_hora_salida_fondo: z.string().min(1, "La hora es requerida"),
  datostec_hora_llegada_superficie: z.string().min(1, "La hora es requerida"),
  
  // 8. Tiempos y Tabulación
  tiempos_total_fondo: z.string().min(1, "El tiempo total en fondo es requerido"),
  tiempos_total_descompresion: z.string().min(1, "El tiempo de descompresión es requerido"),
  tiempos_total_buceo: z.string().min(1, "El tiempo total de buceo es requerido"),
  tiempos_tabulacion_usada: z.string().min(1, "La tabulación usada es requerida"),
  tiempos_intervalo_superficie: z.string().optional(),
  tiempos_nitrogeno_residual: z.string().optional(),
  tiempos_grupo_repetitivo_anterior: z.string().optional(),
  tiempos_nuevo_grupo_repetitivo: z.string().optional(),
  
  // 9. Objetivo del Buceo
  objetivo_proposito: z.string().min(10, "Debe describir el propósito del buceo"),
  objetivo_tipo_area: z.string().min(1, "El tipo de área es requerido"),
  objetivo_caracteristicas_dimensiones: z.string().min(10, "Debe describir las características"),
  
  // 10. Condiciones y Certificaciones
  condcert_buceo_altitud: z.boolean(),
  condcert_certificados_equipos_usados: z.boolean(),
  condcert_buceo_areas_confinadas: z.boolean(),
  condcert_observaciones: z.string().optional(),
  
  inmersion_id: z.string().min(1, "Debe seleccionar una inmersión"),
});

interface CreateBitacoraBuzoFormProps {
  onSubmit: (data: BitacoraBuzoFormData) => Promise<void>;
  onCancel: () => void;
}

export const CreateBitacoraBuzoForm = ({ onSubmit, onCancel }: CreateBitacoraBuzoFormProps) => {
  const [loading, setLoading] = useState(false);
  const { inmersiones } = useInmersiones();
  const { personal } = usePoolPersonal();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      folio: `BB-${Date.now().toString().slice(-6)}`,
      codigo_verificacion: `CV-${Date.now().toString().slice(-4)}`,
      fecha: new Date().toISOString().split('T')[0],
      condamb_estado_puerto: "abierto",
      condcert_buceo_altitud: false,
      condcert_certificados_equipos_usados: true,
      condcert_buceo_areas_confinadas: false,
    }
  });

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await onSubmit(data as BitacoraBuzoFormData);
    } catch (error) {
      console.error('Error creating bitácora buzo:', error);
    } finally {
      setLoading(false);
    }
  };

  const inmersionesCompletadas = inmersiones.filter(i => i.estado === 'completada');
  const buzos = personal.filter(p => p.rol === 'buzo');
  const supervisores = personal.filter(p => p.rol === 'supervisor');

  const estadosDelMar = [
    "Calmo (0-1 nudos)",
    "Ligero (1-3 nudos)", 
    "Moderado (3-7 nudos)",
    "Agitado (7-12 nudos)",
    "Muy agitado (12+ nudos)"
  ];

  const tiposTraje = [
    "Traje seco", 
    "Traje húmedo 3mm", 
    "Traje húmedo 5mm", 
    "Traje húmedo 7mm"
  ];

  const equiposBuceo = [
    "Equipo autónomo (SCUBA)",
    "Equipo de superficie (Hookah)",
    "Equipo mixto"
  ];

  return (
    <div className="max-w-7xl mx-auto p-6">
      <Card className="shadow-xl border-0">
        <CardHeader className="pb-4 bg-gradient-to-r from-teal-50 to-cyan-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-teal-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-teal-900">Nueva Bitácora de Buzo</CardTitle>
                <p className="text-sm text-teal-600 mt-1">Registro completo de inmersión personal</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* 1. Identificación del Registro */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                1. Identificación del Registro
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="folio">Folio</Label>
                  <Input id="folio" {...register('folio')} />
                  {errors.folio && <p className="text-sm text-red-600 mt-1">{errors.folio.message}</p>}
                </div>
                <div>
                  <Label htmlFor="codigo_verificacion">Código de Verificación</Label>
                  <Input id="codigo_verificacion" {...register('codigo_verificacion')} />
                  {errors.codigo_verificacion && <p className="text-sm text-red-600 mt-1">{errors.codigo_verificacion.message}</p>}
                </div>
                <div>
                  <Label htmlFor="inmersion_id">Inmersión</Label>
                  <Select onValueChange={(value) => setValue('inmersion_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar inmersión..." />
                    </SelectTrigger>
                    <SelectContent>
                      {inmersionesCompletadas.map((inmersion) => (
                        <SelectItem key={inmersion.inmersion_id} value={inmersion.inmersion_id}>
                          {inmersion.codigo} - {inmersion.objetivo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.inmersion_id && <p className="text-sm text-red-600 mt-1">{errors.inmersion_id.message}</p>}
                </div>
              </div>
            </div>

            {/* 2-3. Datos Generales y del Buzo */}
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-green-900 mb-4">2-3. Datos Generales y del Buzo</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="empresa_nombre">Empresa</Label>
                  <Input id="empresa_nombre" {...register('empresa_nombre')} />
                  {errors.empresa_nombre && <p className="text-sm text-red-600 mt-1">{errors.empresa_nombre.message}</p>}
                </div>
                <div>
                  <Label htmlFor="centro_nombre">Nombre del Centro</Label>
                  <Input id="centro_nombre" {...register('centro_nombre')} />
                  {errors.centro_nombre && <p className="text-sm text-red-600 mt-1">{errors.centro_nombre.message}</p>}
                </div>
                <div>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input type="date" id="fecha" {...register('fecha')} />
                  {errors.fecha && <p className="text-sm text-red-600 mt-1">{errors.fecha.message}</p>}
                </div>
                <div>
                  <Label htmlFor="buzo_nombre">Buzo</Label>
                  <Select onValueChange={(value) => {
                    const buzo = buzos.find(b => b.usuario_id === value);
                    if (buzo) {
                      setValue('buzo_nombre', `${buzo.nombre} ${buzo.apellido}`);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar buzo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {buzos.map((buzo) => (
                        <SelectItem key={buzo.usuario_id} value={buzo.usuario_id}>
                          {buzo.nombre} {buzo.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.buzo_nombre && <p className="text-sm text-red-600 mt-1">{errors.buzo_nombre.message}</p>}
                </div>
                <div>
                  <Label htmlFor="buzo_rut">RUT del Buzo</Label>
                  <Input id="buzo_rut" {...register('buzo_rut')} placeholder="12.345.678-9" />
                  {errors.buzo_rut && <p className="text-sm text-red-600 mt-1">{errors.buzo_rut.message}</p>}
                </div>
              </div>
            </div>

            {/* 4-5. Supervisor y Otros Contactos */}
            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-900 mb-4">4-5. Supervisor y Otros Contactos</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="supervisor_nombre">Supervisor</Label>
                  <Select onValueChange={(value) => {
                    const supervisor = supervisores.find(s => s.usuario_id === value);
                    if (supervisor) {
                      setValue('supervisor_nombre', `${supervisor.nombre} ${supervisor.apellido}`);
                      setValue('supervisor_correo', supervisor.email || '');
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar supervisor..." />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisores.map((supervisor) => (
                        <SelectItem key={supervisor.usuario_id} value={supervisor.usuario_id}>
                          {supervisor.nombre} {supervisor.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.supervisor_nombre && <p className="text-sm text-red-600 mt-1">{errors.supervisor_nombre.message}</p>}
                </div>
                <div>
                  <Label htmlFor="supervisor_rut">RUT del Supervisor</Label>
                  <Input id="supervisor_rut" {...register('supervisor_rut')} />
                  {errors.supervisor_rut && <p className="text-sm text-red-600 mt-1">{errors.supervisor_rut.message}</p>}
                </div>
                <div>
                  <Label htmlFor="supervisor_correo">Correo del Supervisor</Label>
                  <Input type="email" id="supervisor_correo" {...register('supervisor_correo')} />
                  {errors.supervisor_correo && <p className="text-sm text-red-600 mt-1">{errors.supervisor_correo.message}</p>}
                </div>
                <div>
                  <Label htmlFor="jefe_centro_correo">Correo del Jefe de Centro</Label>
                  <Input type="email" id="jefe_centro_correo" {...register('jefe_centro_correo')} />
                  {errors.jefe_centro_correo && <p className="text-sm text-red-600 mt-1">{errors.jefe_centro_correo.message}</p>}
                </div>
                <div>
                  <Label htmlFor="contratista_nombre">Nombre del Contratista</Label>
                  <Input id="contratista_nombre" {...register('contratista_nombre')} />
                  {errors.contratista_nombre && <p className="text-sm text-red-600 mt-1">{errors.contratista_nombre.message}</p>}
                </div>
                <div>
                  <Label htmlFor="contratista_rut">RUT del Contratista</Label>
                  <Input id="contratista_rut" {...register('contratista_rut')} />
                  {errors.contratista_rut && <p className="text-sm text-red-600 mt-1">{errors.contratista_rut.message}</p>}
                </div>
              </div>
            </div>

            {/* 6. Condiciones Ambientales */}
            <div className="bg-cyan-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-cyan-900 mb-4 flex items-center gap-2">
                <Thermometer className="w-5 h-5" />
                6. Condiciones Ambientales
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="condamb_estado_puerto">Estado del Puerto</Label>
                  <Select onValueChange={(value) => setValue('condamb_estado_puerto', value as "abierto" | "cerrado")}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="abierto">Abierto</SelectItem>
                      <SelectItem value="cerrado">Cerrado</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.condamb_estado_puerto && <p className="text-sm text-red-600 mt-1">{errors.condamb_estado_puerto.message}</p>}
                </div>
                <div>
                  <Label htmlFor="condamb_estado_mar">Estado del Mar</Label>
                  <Select onValueChange={(value) => setValue('condamb_estado_mar', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {estadosDelMar.map((estado) => (
                        <SelectItem key={estado} value={estado}>{estado}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.condamb_estado_mar && <p className="text-sm text-red-600 mt-1">{errors.condamb_estado_mar.message}</p>}
                </div>
                <div>
                  <Label htmlFor="condamb_temp_aire_c">Temperatura del Aire (°C)</Label>
                  <Input type="number" step="0.1" id="condamb_temp_aire_c" {...register('condamb_temp_aire_c', { valueAsNumber: true })} />
                  {errors.condamb_temp_aire_c && <p className="text-sm text-red-600 mt-1">{errors.condamb_temp_aire_c.message}</p>}
                </div>
                <div>
                  <Label htmlFor="condamb_temp_agua_c">Temperatura del Agua (°C)</Label>
                  <Input type="number" step="0.1" id="condamb_temp_agua_c" {...register('condamb_temp_agua_c', { valueAsNumber: true })} />
                  {errors.condamb_temp_agua_c && <p className="text-sm text-red-600 mt-1">{errors.condamb_temp_agua_c.message}</p>}
                </div>
                <div>
                  <Label htmlFor="condamb_visibilidad_fondo_mts">Visibilidad del Fondo (mts)</Label>
                  <Input type="number" step="0.1" id="condamb_visibilidad_fondo_mts" {...register('condamb_visibilidad_fondo_mts', { valueAsNumber: true })} />
                  {errors.condamb_visibilidad_fondo_mts && <p className="text-sm text-red-600 mt-1">{errors.condamb_visibilidad_fondo_mts.message}</p>}
                </div>
                <div>
                  <Label htmlFor="condamb_corriente_fondo_nudos">Corriente del Fondo (nudos)</Label>
                  <Input type="number" step="0.1" id="condamb_corriente_fondo_nudos" {...register('condamb_corriente_fondo_nudos', { valueAsNumber: true })} />
                  {errors.condamb_corriente_fondo_nudos && <p className="text-sm text-red-600 mt-1">{errors.condamb_corriente_fondo_nudos.message}</p>}
                </div>
              </div>
            </div>

            {/* 7. Datos Técnicos del Buceo */}
            <div className="bg-indigo-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-indigo-900 mb-4 flex items-center gap-2">
                <Activity className="w-5 h-5" />
                7. Datos Técnicos del Buceo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="datostec_equipo_usado">Equipo Usado</Label>
                  <Select onValueChange={(value) => setValue('datostec_equipo_usado', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {equiposBuceo.map((equipo) => (
                        <SelectItem key={equipo} value={equipo}>{equipo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.datostec_equipo_usado && <p className="text-sm text-red-600 mt-1">{errors.datostec_equipo_usado.message}</p>}
                </div>
                <div>
                  <Label htmlFor="datostec_traje">Traje</Label>
                  <Select onValueChange={(value) => setValue('datostec_traje', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar..." />
                    </SelectTrigger>
                    <SelectContent>
                      {tiposTraje.map((traje) => (
                        <SelectItem key={traje} value={traje}>{traje}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.datostec_traje && <p className="text-sm text-red-600 mt-1">{errors.datostec_traje.message}</p>}
                </div>
                <div>
                  <Label htmlFor="datostec_profundidad_maxima">Profundidad Máxima (mts)</Label>
                  <Input type="number" step="0.1" id="datostec_profundidad_maxima" {...register('datostec_profundidad_maxima', { valueAsNumber: true })} />
                  {errors.datostec_profundidad_maxima && <p className="text-sm text-red-600 mt-1">{errors.datostec_profundidad_maxima.message}</p>}
                </div>
                <div>
                  <Label htmlFor="datostec_hora_dejo_superficie">Hora dejó superficie</Label>
                  <Input type="time" id="datostec_hora_dejo_superficie" {...register('datostec_hora_dejo_superficie')} />
                  {errors.datostec_hora_dejo_superficie && <p className="text-sm text-red-600 mt-1">{errors.datostec_hora_dejo_superficie.message}</p>}
                </div>
                <div>
                  <Label htmlFor="datostec_hora_llegada_fondo">Hora llegada al fondo</Label>
                  <Input type="time" id="datostec_hora_llegada_fondo" {...register('datostec_hora_llegada_fondo')} />
                  {errors.datostec_hora_llegada_fondo && <p className="text-sm text-red-600 mt-1">{errors.datostec_hora_llegada_fondo.message}</p>}
                </div>
                <div>
                  <Label htmlFor="datostec_hora_salida_fondo">Hora salida del fondo</Label>
                  <Input type="time" id="datostec_hora_salida_fondo" {...register('datostec_hora_salida_fondo')} />
                  {errors.datostec_hora_salida_fondo && <p className="text-sm text-red-600 mt-1">{errors.datostec_hora_salida_fondo.message}</p>}
                </div>
                <div>
                  <Label htmlFor="datostec_hora_llegada_superficie">Hora llegada a superficie</Label>
                  <Input type="time" id="datostec_hora_llegada_superficie" {...register('datostec_hora_llegada_superficie')} />
                  {errors.datostec_hora_llegada_superficie && <p className="text-sm text-red-600 mt-1">{errors.datostec_hora_llegada_superficie.message}</p>}
                </div>
              </div>
            </div>

            {/* 8. Tiempos y Tabulación */}
            <div className="bg-orange-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-orange-900 mb-4 flex items-center gap-2">
                <Clock className="w-5 h-5" />
                8. Tiempos y Tabulación
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="tiempos_total_fondo">Tiempo total en el fondo</Label>
                  <Input id="tiempos_total_fondo" {...register('tiempos_total_fondo')} placeholder="ej: 45 min" />
                  {errors.tiempos_total_fondo && <p className="text-sm text-red-600 mt-1">{errors.tiempos_total_fondo.message}</p>}
                </div>
                <div>
                  <Label htmlFor="tiempos_total_descompresion">Tiempo total descompresión</Label>
                  <Input id="tiempos_total_descompresion" {...register('tiempos_total_descompresion')} placeholder="ej: 10 min" />
                  {errors.tiempos_total_descompresion && <p className="text-sm text-red-600 mt-1">{errors.tiempos_total_descompresion.message}</p>}
                </div>
                <div>
                  <Label htmlFor="tiempos_total_buceo">Tiempo total de buceo</Label>
                  <Input id="tiempos_total_buceo" {...register('tiempos_total_buceo')} placeholder="ej: 55 min" />
                  {errors.tiempos_total_buceo && <p className="text-sm text-red-600 mt-1">{errors.tiempos_total_buceo.message}</p>}
                </div>
                <div>
                  <Label htmlFor="tiempos_tabulacion_usada">Tabulación usada</Label>
                  <Input id="tiempos_tabulacion_usada" {...register('tiempos_tabulacion_usada')} placeholder="ej: PADI RDP" />
                  {errors.tiempos_tabulacion_usada && <p className="text-sm text-red-600 mt-1">{errors.tiempos_tabulacion_usada.message}</p>}
                </div>
                <div>
                  <Label htmlFor="tiempos_intervalo_superficie">Intervalo en superficie (opcional)</Label>
                  <Input id="tiempos_intervalo_superficie" {...register('tiempos_intervalo_superficie')} placeholder="ej: 2 horas" />
                </div>
                <div>
                  <Label htmlFor="tiempos_nitrogeno_residual">Nitrógeno residual (opcional)</Label>
                  <Input id="tiempos_nitrogeno_residual" {...register('tiempos_nitrogeno_residual')} placeholder="ej: Grupo C" />
                </div>
                <div>
                  <Label htmlFor="tiempos_grupo_repetitivo_anterior">Grupo repetitivo anterior (opcional)</Label>
                  <Input id="tiempos_grupo_repetitivo_anterior" {...register('tiempos_grupo_repetitivo_anterior')} placeholder="ej: Grupo B" />
                </div>
                <div>
                  <Label htmlFor="tiempos_nuevo_grupo_repetitivo">Nuevo grupo repetitivo (opcional)</Label>
                  <Input id="tiempos_nuevo_grupo_repetitivo" {...register('tiempos_nuevo_grupo_repetitivo')} placeholder="ej: Grupo D" />
                </div>
              </div>
            </div>

            {/* 9. Objetivo del Buceo */}
            <div className="bg-yellow-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
                <Eye className="w-5 h-5" />
                9. Objetivo del Buceo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="objetivo_proposito">Propósito del Buceo</Label>
                  <Textarea id="objetivo_proposito" {...register('objetivo_proposito')} placeholder="Describe el propósito del buceo..." className="min-h-[80px]" />
                  {errors.objetivo_proposito && <p className="text-sm text-red-600 mt-1">{errors.objetivo_proposito.message}</p>}
                </div>
                <div>
                  <Label htmlFor="objetivo_tipo_area">Tipo de Área</Label>
                  <Input id="objetivo_tipo_area" {...register('objetivo_tipo_area')} placeholder="ej: Área confinada, Aguas abiertas" />
                  {errors.objetivo_tipo_area && <p className="text-sm text-red-600 mt-1">{errors.objetivo_tipo_area.message}</p>}
                </div>
                <div>
                  <Label htmlFor="objetivo_caracteristicas_dimensiones">Características y/o Dimensiones</Label>
                  <Textarea id="objetivo_caracteristicas_dimensiones" {...register('objetivo_caracteristicas_dimensiones')} placeholder="Describe las características del área..." className="min-h-[80px]" />
                  {errors.objetivo_caracteristicas_dimensiones && <p className="text-sm text-red-600 mt-1">{errors.objetivo_caracteristicas_dimensiones.message}</p>}
                </div>
              </div>
            </div>

            {/* 10. Condiciones y Certificaciones */}
            <div className="bg-red-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-red-900 mb-4">10. Condiciones y Certificaciones</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="condcert_buceo_altitud" 
                      onCheckedChange={(checked) => setValue('condcert_buceo_altitud', !!checked)}
                    />
                    <Label htmlFor="condcert_buceo_altitud">¿Buceo en altitud?</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="condcert_certificados_equipos_usados" 
                      defaultChecked
                      onCheckedChange={(checked) => setValue('condcert_certificados_equipos_usados', !!checked)}
                    />
                    <Label htmlFor="condcert_certificados_equipos_usados">¿Certificados de los equipos usados?</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Checkbox 
                      id="condcert_buceo_areas_confinadas" 
                      onCheckedChange={(checked) => setValue('condcert_buceo_areas_confinadas', !!checked)}
                    />
                    <Label htmlFor="condcert_buceo_areas_confinadas">¿Buceo en áreas confinadas?</Label>
                  </div>
                </div>
                <div>
                  <Label htmlFor="condcert_observaciones">Observaciones</Label>
                  <Textarea id="condcert_observaciones" {...register('condcert_observaciones')} placeholder="Observaciones adicionales..." className="min-h-[120px]" />
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-teal-600 hover:bg-teal-700">
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creando...
                  </>
                ) : (
                  "Crear Bitácora"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
