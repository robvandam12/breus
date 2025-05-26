
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
import { FileText, X, Users, Shield, Tool } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { usePoolPersonal } from "@/hooks/usePoolPersonal";

const formSchema = z.object({
  operacion_id: z.string().min(1, "Debe seleccionar una operación"),
  empresa_nombre: z.string().min(1, "El nombre de la empresa es requerido"),
  lugar_faena: z.string().min(1, "El lugar de faena es requerido"),
  fecha: z.string().min(1, "La fecha es requerida"),
  jefe_centro_nombre: z.string().min(1, "El jefe de centro es requerido"),
  buzo_o_empresa_nombre: z.string().min(1, "El buzo o empresa es requerido"),
  buzo_matricula: z.string().min(1, "La matrícula del buzo es requerida"),
  autorizacion_armada: z.boolean(),
  asistente_buzo_nombre: z.string().optional(),
  asistente_buzo_matricula: z.string().optional(),
  bitacora_hora_inicio: z.string().min(1, "La hora de inicio es requerida"),
  bitacora_hora_termino: z.string().min(1, "La hora de término es requerida"),
  bitacora_fecha: z.string().min(1, "La fecha de bitácora es requerida"),
  bitacora_relator: z.string().min(1, "El relator es requerido"),
});

interface CreateAnexoBravoFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const CreateAnexoBravoForm = ({ onSubmit, onCancel }: CreateAnexoBravoFormProps) => {
  const [loading, setLoading] = useState(false);
  const { operaciones } = useOperaciones();
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
      fecha: new Date().toISOString().split('T')[0],
      bitacora_fecha: new Date().toISOString().split('T')[0],
      autorizacion_armada: false,
    }
  });

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      await onSubmit(data);
    } catch (error) {
      console.error('Error creating anexo bravo:', error);
    } finally {
      setLoading(false);
    }
  };

  const operacionesActivas = operaciones.filter(op => op.estado === 'activa');
  const buzos = personal.filter(p => p.rol === 'buzo');
  const supervisores = personal.filter(p => p.rol === 'supervisor');

  // Lista de equipos e insumos para chequeo
  const equiposChecklist = [
    "Compresor", "Regulador", "Traje", "Aletas", "Cinturón Lastre",
    "Mascarilla", "Pufal", "Profundímetro", "Salvavidas", "Tablas descompresión",
    "Botiquín", "Cabo de vida", "Cabo de descenso", "Manguera", "Equipo comunicación",
    "Matrícula buzo", "Matrícula asistente", "Certificado mantención equipos",
    "Filtro aire", "Nivel aceite motor", "Nivel aceite cabezal", "Válvula retención",
    "Protección partes móviles", "Botella aire auxiliar"
  ];

  return (
    <div className="max-w-5xl mx-auto p-6">
      <Card className="shadow-xl border-0">
        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-2xl text-blue-900">Nuevo Anexo Bravo</CardTitle>
                <p className="text-sm text-blue-600 mt-1">Autorización de trabajo de buceo</p>
              </div>
            </div>
            <Button variant="ghost" size="sm" onClick={onCancel} className="text-gray-500 hover:text-gray-700">
              <X className="w-5 h-5" />
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-8">
          <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-8">
            {/* 1. Información General */}
            <div className="bg-blue-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-blue-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                1. Información General
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="operacion_id">Operación</Label>
                  <Select onValueChange={(value) => setValue('operacion_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar operación..." />
                    </SelectTrigger>
                    <SelectContent>
                      {operacionesActivas.map((operacion) => (
                        <SelectItem key={operacion.id} value={operacion.id}>
                          {operacion.nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.operacion_id && <p className="text-sm text-red-600 mt-1">{errors.operacion_id.message}</p>}
                </div>
                <div>
                  <Label htmlFor="empresa_nombre">Empresa</Label>
                  <Input id="empresa_nombre" {...register('empresa_nombre')} />
                  {errors.empresa_nombre && <p className="text-sm text-red-600 mt-1">{errors.empresa_nombre.message}</p>}
                </div>
                <div>
                  <Label htmlFor="lugar_faena">Lugar de Faena / Centro</Label>
                  <Input id="lugar_faena" {...register('lugar_faena')} />
                  {errors.lugar_faena && <p className="text-sm text-red-600 mt-1">{errors.lugar_faena.message}</p>}
                </div>
                <div>
                  <Label htmlFor="fecha">Fecha</Label>
                  <Input type="date" id="fecha" {...register('fecha')} />
                  {errors.fecha && <p className="text-sm text-red-600 mt-1">{errors.fecha.message}</p>}
                </div>
                <div>
                  <Label htmlFor="jefe_centro_nombre">Jefe de Centro</Label>
                  <Select onValueChange={(value) => {
                    const supervisor = supervisores.find(s => s.usuario_id === value);
                    if (supervisor) {
                      setValue('jefe_centro_nombre', `${supervisor.nombre} ${supervisor.apellido}`);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar jefe de centro..." />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisores.map((supervisor) => (
                        <SelectItem key={supervisor.usuario_id} value={supervisor.usuario_id}>
                          {supervisor.nombre} {supervisor.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.jefe_centro_nombre && <p className="text-sm text-red-600 mt-1">{errors.jefe_centro_nombre.message}</p>}
                </div>
              </div>
            </div>

            {/* 2. Identificación del Buzo o Empresa de Buceo */}
            <div className="bg-green-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-green-900 mb-4 flex items-center gap-2">
                <Users className="w-5 h-5" />
                2. Identificación del Buzo o Empresa de Buceo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="buzo_o_empresa_nombre">Buzo o Empresa de Buceo</Label>
                  <Select onValueChange={(value) => {
                    const buzo = buzos.find(b => b.usuario_id === value);
                    if (buzo) {
                      setValue('buzo_o_empresa_nombre', `${buzo.nombre} ${buzo.apellido}`);
                      setValue('buzo_matricula', buzo.matricula || '');
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar buzo..." />
                    </SelectTrigger>
                    <SelectContent>
                      {buzos.map((buzo) => (
                        <SelectItem key={buzo.usuario_id} value={buzo.usuario_id}>
                          {buzo.nombre} {buzo.apellido}
                          {buzo.matricula && (
                            <span className="text-sm text-gray-500 ml-2">
                              (Mat: {buzo.matricula})
                            </span>
                          )}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.buzo_o_empresa_nombre && <p className="text-sm text-red-600 mt-1">{errors.buzo_o_empresa_nombre.message}</p>}
                </div>
                <div>
                  <Label htmlFor="buzo_matricula">Matrícula</Label>
                  <Input id="buzo_matricula" {...register('buzo_matricula')} />
                  {errors.buzo_matricula && <p className="text-sm text-red-600 mt-1">{errors.buzo_matricula.message}</p>}
                </div>
                <div className="flex items-center space-x-2 mt-6">
                  <Checkbox 
                    id="autorizacion_armada" 
                    onCheckedChange={(checked) => setValue('autorizacion_armada', !!checked)}
                  />
                  <Label htmlFor="autorizacion_armada">Autorización Autoridad Marítima</Label>
                </div>
                <div>
                  <Label htmlFor="asistente_buzo_nombre">Asistente de Buzo (Opcional)</Label>
                  <Select onValueChange={(value) => {
                    const asistente = buzos.find(b => b.usuario_id === value);
                    if (asistente) {
                      setValue('asistente_buzo_nombre', `${asistente.nombre} ${asistente.apellido}`);
                      setValue('asistente_buzo_matricula', asistente.matricula || '');
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar asistente..." />
                    </SelectTrigger>
                    <SelectContent>
                      {buzos.map((buzo) => (
                        <SelectItem key={buzo.usuario_id} value={buzo.usuario_id}>
                          {buzo.nombre} {buzo.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="asistente_buzo_matricula">Matrícula del Asistente</Label>
                  <Input id="asistente_buzo_matricula" {...register('asistente_buzo_matricula')} />
                </div>
              </div>
            </div>

            {/* 3. Chequeo de Equipos e Insumos */}
            <div className="bg-yellow-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-yellow-900 mb-4 flex items-center gap-2">
                <Tool className="w-5 h-5" />
                3. Chequeo de Equipos e Insumos
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {equiposChecklist.map((equipo, index) => (
                  <div key={index} className="flex items-center space-x-2">
                    <Checkbox id={`equipo_${index}`} />
                    <Label htmlFor={`equipo_${index}`} className="text-sm">{equipo}</Label>
                  </div>
                ))}
              </div>
            </div>

            {/* 4. Bitácora de Buceo */}
            <div className="bg-purple-50 p-6 rounded-xl">
              <h3 className="text-lg font-semibold text-purple-900 mb-4 flex items-center gap-2">
                <FileText className="w-5 h-5" />
                4. Bitácora de Buceo
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <Label htmlFor="bitacora_hora_inicio">Hora de Inicio</Label>
                  <Input type="time" id="bitacora_hora_inicio" {...register('bitacora_hora_inicio')} />
                  {errors.bitacora_hora_inicio && <p className="text-sm text-red-600 mt-1">{errors.bitacora_hora_inicio.message}</p>}
                </div>
                <div>
                  <Label htmlFor="bitacora_hora_termino">Hora de Término</Label>
                  <Input type="time" id="bitacora_hora_termino" {...register('bitacora_hora_termino')} />
                  {errors.bitacora_hora_termino && <p className="text-sm text-red-600 mt-1">{errors.bitacora_hora_termino.message}</p>}
                </div>
                <div>
                  <Label htmlFor="bitacora_fecha">Fecha</Label>
                  <Input type="date" id="bitacora_fecha" {...register('bitacora_fecha')} />
                  {errors.bitacora_fecha && <p className="text-sm text-red-600 mt-1">{errors.bitacora_fecha.message}</p>}
                </div>
                <div>
                  <Label htmlFor="bitacora_relator">Relator</Label>
                  <Select onValueChange={(value) => {
                    const relator = supervisores.find(s => s.usuario_id === value);
                    if (relator) {
                      setValue('bitacora_relator', `${relator.nombre} ${relator.apellido}`);
                    }
                  }}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar relator..." />
                    </SelectTrigger>
                    <SelectContent>
                      {supervisores.map((supervisor) => (
                        <SelectItem key={supervisor.usuario_id} value={supervisor.usuario_id}>
                          {supervisor.nombre} {supervisor.apellido}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.bitacora_relator && <p className="text-sm text-red-600 mt-1">{errors.bitacora_relator.message}</p>}
                </div>
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button type="button" variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              <Button type="submit" disabled={loading} className="bg-blue-600 hover:bg-blue-700">
                {loading ? (
                  <>
                    <LoadingSpinner size="sm" className="mr-2" />
                    Creando...
                  </>
                ) : (
                  "Crear Anexo Bravo"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};
