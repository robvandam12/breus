
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InmersionTeamManagerEnhanced } from './InmersionTeamManagerEnhanced';
import { useAuth } from '@/hooks/useAuth';
import { Calendar, Clock, Users, FileText } from 'lucide-react';

const inmersionSchema = z.object({
  codigo: z.string().min(1, 'Código es requerido'),
  fecha_inmersion: z.string().min(1, 'Fecha es requerida'),
  hora_inicio: z.string().min(1, 'Hora de inicio es requerida'),
  hora_fin: z.string().optional(),
  objetivo: z.string().min(1, 'Objetivo es requerido'),
  profundidad_max: z.number().min(0.1, 'Profundidad debe ser mayor a 0'),
  temperatura_agua: z.number().min(0, 'Temperatura debe ser mayor o igual a 0'),
  visibilidad: z.number().min(0.1, 'Visibilidad debe ser mayor a 0'),
  corriente: z.string().min(1, 'Información de corriente es requerida'),
  supervisor: z.string().min(1, 'Supervisor es requerido'),
  buzo_principal: z.string().min(1, 'Buzo principal es requerido'),
  buzo_asistente: z.string().optional(),
  observaciones: z.string().optional(),
  external_operation_code: z.string().optional(),
});

type InmersionFormData = z.infer<typeof inmersionSchema>;

interface IndependentImmersionFormProps {
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
}

export const IndependentImmersionForm = ({ onSubmit, onCancel }: IndependentImmersionFormProps) => {
  const [currentTab, setCurrentTab] = useState('general');
  const [selectedTeam, setSelectedTeam] = useState<any[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { profile } = useAuth();

  const form = useForm<InmersionFormData>({
    resolver: zodResolver(inmersionSchema),
    defaultValues: {
      codigo: '',
      fecha_inmersion: new Date().toISOString().split('T')[0],
      hora_inicio: '',
      hora_fin: '',
      objetivo: '',
      profundidad_max: 0,
      temperatura_agua: 0,
      visibilidad: 0,
      corriente: '',
      supervisor: '',
      buzo_principal: '',
      buzo_asistente: '',
      observaciones: '',
      external_operation_code: '',
    },
  });

  const handleSubmit = async (data: InmersionFormData) => {
    setIsSubmitting(true);
    try {
      // Preparar datos con contexto empresarial y equipo
      const submissionData = {
        ...data,
        company_id: profile?.salmonera_id || profile?.servicio_id,
        company_type: profile?.salmonera_id ? 'salmonera' : 'contratista',
        is_independent: true,
        operacion_id: null,
        team_members: selectedTeam,
        context_type: 'direct',
      };

      await onSubmit(submissionData);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormValid = () => {
    const values = form.getValues();
    return values.codigo && values.fecha_inmersion && values.hora_inicio && 
           values.objetivo && values.profundidad_max > 0 && values.temperatura_agua >= 0 &&
           values.visibilidad > 0 && values.corriente && values.supervisor && values.buzo_principal;
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs value={currentTab} onValueChange={setCurrentTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Información General
            </TabsTrigger>
            <TabsTrigger value="team" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Personal de Buceo
            </TabsTrigger>
            <TabsTrigger value="review" className="flex items-center gap-2">
              <Calendar className="w-4 h-4" />
              Revisión
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  Datos de la Inmersión
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="codigo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código *</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: INM-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="external_operation_code"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Código Operación Externa</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: OP-EXT-001" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="fecha_inmersion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha *</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hora_inicio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora Inicio *</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hora_fin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora Fin (Estimada)</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="objetivo"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Objetivo *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe el objetivo de la inmersión..."
                          className="min-h-[80px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Condiciones Técnicas</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    control={form.control}
                    name="profundidad_max"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Profundidad Máxima (m) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="temperatura_agua"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Temperatura Agua (°C) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="visibilidad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Visibilidad (m) *</FormLabel>
                        <FormControl>
                          <Input 
                            type="number"
                            step="0.1"
                            {...field}
                            onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="corriente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Corriente *</FormLabel>
                      <FormControl>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona condición de corriente" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="sin_corriente">Sin corriente</SelectItem>
                            <SelectItem value="corriente_leve">Corriente leve</SelectItem>
                            <SelectItem value="corriente_moderada">Corriente moderada</SelectItem>
                            <SelectItem value="corriente_fuerte">Corriente fuerte</SelectItem>
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Personal Principal</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="supervisor"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Supervisor *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre del supervisor" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="buzo_principal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Buzo Principal *</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre del buzo principal" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="buzo_asistente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Buzo Asistente</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del buzo asistente (opcional)" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Observaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <FormField
                  control={form.control}
                  name="observaciones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones Adicionales</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Observaciones adicionales sobre la inmersión..."
                          className="min-h-[100px]"
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="team" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5" />
                  Gestión del Personal de Buceo
                </CardTitle>
              </CardHeader>
              <CardContent>
                <InmersionTeamManagerEnhanced
                  inmersionId={null} // Nuevo, no tiene ID aún
                  onTeamUpdate={setSelectedTeam}
                  isCreatingNew={true}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Calendar className="w-5 h-5" />
                  Revisión de Datos
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <strong>Código:</strong> {form.watch('codigo')}
                  </div>
                  <div>
                    <strong>Fecha:</strong> {form.watch('fecha_inmersion')}
                  </div>
                  <div>
                    <strong>Hora Inicio:</strong> {form.watch('hora_inicio')}
                  </div>
                  <div>
                    <strong>Profundidad:</strong> {form.watch('profundidad_max')}m
                  </div>
                  <div>
                    <strong>Supervisor:</strong> {form.watch('supervisor')}
                  </div>
                  <div>
                    <strong>Buzo Principal:</strong> {form.watch('buzo_principal')}
                  </div>
                </div>
                
                <Separator />
                
                <div>
                  <strong>Personal Seleccionado:</strong>
                  <div className="mt-2">
                    {selectedTeam.length === 0 ? (
                      <p className="text-muted-foreground">No se ha seleccionado personal adicional</p>
                    ) : (
                      <div className="space-y-1">
                        {selectedTeam.map((member, index) => (
                          <div key={index} className="text-sm">
                            {member.nombre} - {member.role}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-between pt-6">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          
          <div className="flex gap-2">
            {currentTab !== 'general' && (
              <Button 
                type="button" 
                variant="outline"
                onClick={() => {
                  const tabs = ['general', 'team', 'review'];
                  const currentIndex = tabs.indexOf(currentTab);
                  if (currentIndex > 0) {
                    setCurrentTab(tabs[currentIndex - 1]);
                  }
                }}
              >
                Anterior
              </Button>
            )}
            
            {currentTab !== 'review' ? (
              <Button 
                type="button"
                onClick={() => {
                  const tabs = ['general', 'team', 'review'];
                  const currentIndex = tabs.indexOf(currentTab);
                  if (currentIndex < tabs.length - 1) {
                    setCurrentTab(tabs[currentIndex + 1]);
                  }
                }}
                disabled={currentTab === 'general' && !isFormValid()}
              >
                Siguiente
              </Button>
            ) : (
              <Button 
                type="submit" 
                disabled={isSubmitting || !isFormValid()}
              >
                {isSubmitting ? 'Creando...' : 'Crear Inmersión'}
              </Button>
            )}
          </div>
        </div>
      </form>
    </Form>
  );
};
