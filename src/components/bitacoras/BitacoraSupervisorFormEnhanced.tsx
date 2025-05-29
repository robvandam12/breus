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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { FileText, X, Plus, Users } from "lucide-react";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useUsuarios } from "@/hooks/useUsuarios";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";
import { BitacoraSupervisorFormData } from "@/hooks/useBitacoras";

const formSchema = z.object({
  inmersion_id: z.string().min(1, "Debe seleccionar una inmersión"),
  supervisor_id: z.string().min(1, "Debe seleccionar un supervisor"),
  desarrollo_inmersion: z.string().min(10, "Debe describir el desarrollo de la inmersión"),
  incidentes: z.string().optional().default(""),
  evaluacion_general: z.string().min(10, "La evaluación general es requerida"),
});

interface DivingRecord {
  id: string;
  buzo_id: string;
  buzo_nombre: string;
  profundidad_maxima: number;
  hora_dejo_superficie: string;
  hora_llego_superficie: string;
  tiempo_fondo: number;
  tiempo_descompresion: number;
  tiempo_buceo: number;
  tabulacion_usada: string;
  gas_usado: string;
}

interface BitacoraSupervisorFormEnhancedProps {
  onSubmit: (data: BitacoraSupervisorFormData) => Promise<void>;
  onCancel: () => void;
}

export const BitacoraSupervisorFormEnhanced = ({ onSubmit, onCancel }: BitacoraSupervisorFormEnhancedProps) => {
  const [loading, setLoading] = useState(false);
  const [currentTab, setCurrentTab] = useState("general");
  const [divingRecords, setDivingRecords] = useState<DivingRecord[]>([]);
  const [isAddDiverDialogOpen, setIsAddDiverDialogOpen] = useState(false);
  const [selectedInmersion, setSelectedInmersion] = useState<string>('');
  
  const { inmersiones } = useInmersiones();
  const { usuarios } = useUsuarios();
  const { equipos } = useEquiposBuceoEnhanced();

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors }
  } = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      incidentes: ""
    }
  });

  const watchedInmersion = watch('inmersion_id');
  
  // Get supervisors from usuarios
  const supervisores = usuarios.filter(u => u.rol === 'supervisor');
  
  // Get available divers from the selected immersion's operation team
  const selectedInmersionData = inmersiones.find(i => i.inmersion_id === watchedInmersion);
  const availableDivers = usuarios.filter(u => u.rol === 'buzo');

  const inmersionesCompletadas = inmersiones.filter(i => i.estado === 'completada');

  const [newDivingRecord, setNewDivingRecord] = useState<Partial<DivingRecord>>({
    buzo_id: '',
    profundidad_maxima: 0,
    hora_dejo_superficie: '',
    hora_llego_superficie: '',
    tiempo_fondo: 0,
    tiempo_descompresion: 0,
    tiempo_buceo: 0,
    tabulacion_usada: '',
    gas_usado: ''
  });

  const handleFormSubmit = async (data: z.infer<typeof formSchema>) => {
    setLoading(true);
    try {
      const supervisor = usuarios.find(u => u.usuario_id === data.supervisor_id);
      const formData: BitacoraSupervisorFormData = {
        codigo: `BIT-SUP-${Date.now()}`,
        inmersion_id: data.inmersion_id,
        supervisor: supervisor ? `${supervisor.nombre} ${supervisor.apellido}` : '',
        desarrollo_inmersion: data.desarrollo_inmersion,
        incidentes: data.incidentes || "",
        evaluacion_general: data.evaluacion_general,
        fecha: new Date().toISOString().split('T')[0],
        // Initialize additional required fields with default values
        fecha_inicio_faena: new Date().toISOString().split('T')[0],
        hora_inicio_faena: '',
        hora_termino_faena: '',
        lugar_trabajo: '',
        supervisor_nombre_matricula: supervisor ? `${supervisor.nombre} ${supervisor.apellido}` : '',
        estado_mar: '',
        visibilidad_fondo: 0,
        inmersiones_buzos: [],
        equipos_utilizados: [],
        trabajo_a_realizar: '',
        descripcion_trabajo: '',
        embarcacion_apoyo: '',
        observaciones_generales_texto: '',
        validacion_contratista: false,
        comentarios_validacion: '',
        diving_records: divingRecords
      };
      await onSubmit(formData);
    } catch (error) {
      console.error('Error creating bitácora supervisor:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddDivingRecord = () => {
    if (newDivingRecord.buzo_id) {
      const buzo = usuarios.find(u => u.usuario_id === newDivingRecord.buzo_id);
      const record: DivingRecord = {
        id: crypto.randomUUID(),
        buzo_id: newDivingRecord.buzo_id,
        buzo_nombre: buzo ? `${buzo.nombre} ${buzo.apellido}` : '',
        profundidad_maxima: newDivingRecord.profundidad_maxima || 0,
        hora_dejo_superficie: newDivingRecord.hora_dejo_superficie || '',
        hora_llego_superficie: newDivingRecord.hora_llego_superficie || '',
        tiempo_fondo: newDivingRecord.tiempo_fondo || 0,
        tiempo_descompresion: newDivingRecord.tiempo_descompresion || 0,
        tiempo_buceo: newDivingRecord.tiempo_buceo || 0,
        tabulacion_usada: newDivingRecord.tabulacion_usada || '',
        gas_usado: newDivingRecord.gas_usado || ''
      };
      
      setDivingRecords(prev => [...prev, record]);
      setNewDivingRecord({
        buzo_id: '',
        profundidad_maxima: 0,
        hora_dejo_superficie: '',
        hora_llego_superficie: '',
        tiempo_fondo: 0,
        tiempo_descompresion: 0,
        tiempo_buceo: 0,
        tabulacion_usada: '',
        gas_usado: ''
      });
      setIsAddDiverDialogOpen(false);
    }
  };

  const removeDivingRecord = (id: string) => {
    setDivingRecords(prev => prev.filter(r => r.id !== id));
  };

  return (
    <Card className="max-w-6xl mx-auto">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
              <FileText className="w-5 h-5 text-purple-600" />
            </div>
            <div>
              <CardTitle className="text-xl">Nueva Bitácora de Supervisor</CardTitle>
              <p className="text-sm text-zinc-500">Registro detallado de supervisión de inmersión</p>
            </div>
          </div>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          <Tabs value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="general">Información General</TabsTrigger>
              <TabsTrigger value="personal">Personal y Equipos</TabsTrigger>
              <TabsTrigger value="revision">Revisión y Firma</TabsTrigger>
            </TabsList>

            <TabsContent value="general" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="inmersion_id">Inmersión *</Label>
                  <Select onValueChange={(value) => setValue('inmersion_id', value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar inmersión..." />
                    </SelectTrigger>
                    <SelectContent>
                      {inmersionesCompletadas.map((inmersion) => (
                        <SelectItem key={inmersion.inmersion_id} value={inmersion.inmersion_id}>
                          {inmersion.codigo} - {inmersion.operacion_nombre}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  {errors.inmersion_id && (
                    <p className="text-sm text-red-600">{errors.inmersion_id.message}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="supervisor_id">Supervisor *</Label>
                  <Select onValueChange={(value) => setValue('supervisor_id', value)}>
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
                  {errors.supervisor_id && (
                    <p className="text-sm text-red-600">{errors.supervisor_id.message}</p>
                  )}
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="desarrollo_inmersion">Desarrollo de la Inmersión *</Label>
                <Textarea
                  id="desarrollo_inmersion"
                  {...register('desarrollo_inmersion')}
                  placeholder="Describa cómo se desarrolló la inmersión..."
                  className="min-h-[120px]"
                />
                {errors.desarrollo_inmersion && (
                  <p className="text-sm text-red-600">{errors.desarrollo_inmersion.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="incidentes">Incidentes (Opcional)</Label>
                <Textarea
                  id="incidentes"
                  {...register('incidentes')}
                  placeholder="Describa cualquier incidente ocurrido durante la inmersión..."
                  className="min-h-[100px]"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="evaluacion_general">Evaluación General *</Label>
                <Textarea
                  id="evaluacion_general"
                  {...register('evaluacion_general')}
                  placeholder="Evaluación general de la inmersión..."
                  className="min-h-[120px]"
                />
                {errors.evaluacion_general && (
                  <p className="text-sm text-red-600">{errors.evaluacion_general.message}</p>
                )}
              </div>

              <div className="flex justify-end">
                <Button type="button" onClick={() => setCurrentTab("personal")}>
                  Siguiente: Personal →
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="personal" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      Registro de Buzos
                      <Badge variant="outline">
                        {divingRecords.length} registros
                      </Badge>
                    </CardTitle>
                    <Dialog open={isAddDiverDialogOpen} onOpenChange={setIsAddDiverDialogOpen}>
                      <DialogTrigger asChild>
                        <Button variant="outline" size="sm">
                          <Plus className="w-4 h-4 mr-2" />
                          Agregar Buzo
                        </Button>
                      </DialogTrigger>
                      <DialogContent className="max-w-2xl">
                        <DialogHeader>
                          <DialogTitle>Agregar Registro de Buzo</DialogTitle>
                        </DialogHeader>
                        <div className="grid grid-cols-2 gap-4 space-y-0">
                          <div className="col-span-2">
                            <Label>Buzo *</Label>
                            <Select 
                              value={newDivingRecord.buzo_id || ''} 
                              onValueChange={(value) => setNewDivingRecord(prev => ({ ...prev, buzo_id: value }))}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Seleccionar buzo..." />
                              </SelectTrigger>
                              <SelectContent>
                                {availableDivers.map((buzo) => (
                                  <SelectItem key={buzo.usuario_id} value={buzo.usuario_id}>
                                    {buzo.nombre} {buzo.apellido}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                          
                          <div>
                            <Label htmlFor="profundidad_maxima">Profundidad Máxima (m)</Label>
                            <Input
                              id="profundidad_maxima"
                              type="number"
                              value={newDivingRecord.profundidad_maxima || ''}
                              onChange={(e) => setNewDivingRecord(prev => ({ ...prev, profundidad_maxima: Number(e.target.value) }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="tiempo_fondo">Tiempo Fondo (min)</Label>
                            <Input
                              id="tiempo_fondo"
                              type="number"
                              value={newDivingRecord.tiempo_fondo || ''}
                              onChange={(e) => setNewDivingRecord(prev => ({ ...prev, tiempo_fondo: Number(e.target.value) }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="hora_dejo_superficie">Hora Dejó Superficie</Label>
                            <Input
                              id="hora_dejo_superficie"
                              type="time"
                              value={newDivingRecord.hora_dejo_superficie || ''}
                              onChange={(e) => setNewDivingRecord(prev => ({ ...prev, hora_dejo_superficie: e.target.value }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="hora_llego_superficie">Hora Llegó Superficie</Label>
                            <Input
                              id="hora_llego_superficie"
                              type="time"
                              value={newDivingRecord.hora_llego_superficie || ''}
                              onChange={(e) => setNewDivingRecord(prev => ({ ...prev, hora_llego_superficie: e.target.value }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="tiempo_descompresion">Tiempo Descompresión (min)</Label>
                            <Input
                              id="tiempo_descompresion"
                              type="number"
                              value={newDivingRecord.tiempo_descompresion || ''}
                              onChange={(e) => setNewDivingRecord(prev => ({ ...prev, tiempo_descompresion: Number(e.target.value) }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="tiempo_buceo">Tiempo Total Buceo (min)</Label>
                            <Input
                              id="tiempo_buceo"
                              type="number"
                              value={newDivingRecord.tiempo_buceo || ''}
                              onChange={(e) => setNewDivingRecord(prev => ({ ...prev, tiempo_buceo: Number(e.target.value) }))}
                            />
                          </div>

                          <div>
                            <Label htmlFor="tabulacion_usada">Tabulación Usada</Label>
                            <Input
                              id="tabulacion_usada"
                              value={newDivingRecord.tabulacion_usada || ''}
                              onChange={(e) => setNewDivingRecord(prev => ({ ...prev, tabulacion_usada: e.target.value }))}
                              placeholder="Ej: NAUI, PADI, etc."
                            />
                          </div>

                          <div>
                            <Label htmlFor="gas_usado">Gas Usado</Label>
                            <Input
                              id="gas_usado"
                              value={newDivingRecord.gas_usado || ''}
                              onChange={(e) => setNewDivingRecord(prev => ({ ...prev, gas_usado: e.target.value }))}
                              placeholder="Ej: Aire, Nitrox 32%, etc."
                            />
                          </div>
                        </div>
                        
                        <div className="flex gap-3 pt-4">
                          <Button onClick={handleAddDivingRecord} className="flex-1">
                            Agregar Registro
                          </Button>
                          <Button variant="outline" onClick={() => setIsAddDiverDialogOpen(false)}>
                            Cancelar
                          </Button>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </CardHeader>
                <CardContent>
                  {divingRecords.length === 0 ? (
                    <div className="text-center py-8 text-zinc-500">
                      No hay registros de buzos agregados
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Buzo</TableHead>
                          <TableHead>Prof. Máx (m)</TableHead>
                          <TableHead>Tiempo Fondo</TableHead>
                          <TableHead>Descompresión</TableHead>
                          <TableHead>Gas Usado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {divingRecords.map((record) => (
                          <TableRow key={record.id}>
                            <TableCell className="font-medium">{record.buzo_nombre}</TableCell>
                            <TableCell>{record.profundidad_maxima}m</TableCell>
                            <TableCell>{record.tiempo_fondo} min</TableCell>
                            <TableCell>{record.tiempo_descompresion} min</TableCell>
                            <TableCell>{record.gas_usado}</TableCell>
                            <TableCell className="text-right">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => removeDivingRecord(record.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <X className="w-4 h-4" />
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentTab("general")}>
                  ← Anterior
                </Button>
                <Button type="button" onClick={() => setCurrentTab("revision")}>
                  Siguiente: Revisión →
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="revision" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Resumen de la Bitácora</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium text-zinc-700">Inmersión:</Label>
                      <p className="text-sm text-zinc-600">
                        {inmersionesCompletadas.find(i => i.inmersion_id === watch('inmersion_id'))?.codigo}
                      </p>
                    </div>
                    <div>
                      <Label className="text-sm font-medium text-zinc-700">Supervisor:</Label>
                      <p className="text-sm text-zinc-600">
                        {supervisores.find(s => s.usuario_id === watch('supervisor_id'))?.nombre} {supervisores.find(s => s.usuario_id === watch('supervisor_id'))?.apellido}
                      </p>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-zinc-700">Registros de Buceo:</Label>
                    <p className="text-sm text-zinc-600">{divingRecords.length} buzos registrados</p>
                  </div>
                </CardContent>
              </Card>

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => setCurrentTab("personal")}>
                  ← Anterior
                </Button>
                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={onCancel}>
                    Cancelar
                  </Button>
                  <Button type="submit" disabled={loading} className="bg-purple-600 hover:bg-purple-700">
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
              </div>
            </TabsContent>
          </Tabs>
        </form>
      </CardContent>
    </Card>
  );
};
