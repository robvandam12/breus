import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useForm } from "react-hook-form";
import { DigitalSignature } from "./DigitalSignature";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { FileCheck, Shield, CheckCircle, AlertTriangle, Save, Clock } from "lucide-react";

interface AnexoBravoData {
  operacion_id: string;
  fecha_verificacion: string;
  checklist_items: Array<{
    id: string;
    item: string;
    verificado: boolean;
    observaciones?: string;
  }>;
  jefe_centro_firma: string | null;
  supervisor_firma: string | null;
  observaciones_generales: string;
}

interface AnexoBravoFormProps {
  onSubmit: (data: AnexoBravoData) => void;
  onCancel: () => void;
  initialData?: Partial<AnexoBravoData>;
}

interface Operacion {
  id: string;
  codigo: string;
  nombre: string;
}

const DEFAULT_CHECKLIST_ITEMS = [
  { id: '1', item: 'Verificación de equipos de buceo individuales', verificado: false },
  { id: '2', item: 'Inspección de sistemas de aire comprimido', verificado: false },
  { id: '3', item: 'Verificación de equipos de comunicación', verificado: false },
  { id: '4', item: 'Inspección de equipos de seguridad y rescate', verificado: false },
  { id: '5', item: 'Verificación de condiciones meteorológicas', verificado: false },
  { id: '6', item: 'Inspección de embarcación y equipos de superficie', verificado: false },
  { id: '7', item: 'Verificación de personal certificado', verificado: false },
  { id: '8', item: 'Revisión del plan de emergencia', verificado: false },
  { id: '9', item: 'Verificación de contactos de emergencia', verificado: false },
  { id: '10', item: 'Inspección del área de trabajo subacuático', verificado: false },
  { id: '11', item: 'Verificación de herramientas y equipos específicos', verificado: false },
  { id: '12', item: 'Revisión de permisos y autorizaciones', verificado: false },
];

export const AnexoBravoForm = ({ onSubmit, onCancel, initialData }: AnexoBravoFormProps) => {
  const [operaciones, setOperaciones] = useState<Operacion[]>([]);
  const [loadingOperaciones, setLoadingOperaciones] = useState(false);
  const [jefeCentroSigned, setJefeCentroSigned] = useState(!!initialData?.jefe_centro_firma);
  const [supervisorSigned, setSupervisorSigned] = useState(!!initialData?.supervisor_firma);
  const [jefeCentroSignature, setJefeCentroSignature] = useState(initialData?.jefe_centro_firma || "");
  const [supervisorSignature, setSupervisorSignature] = useState(initialData?.supervisor_firma || "");
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const { toast } = useToast();

  const form = useForm({
    defaultValues: {
      operacion_id: initialData?.operacion_id || "",
      fecha_verificacion: initialData?.fecha_verificacion || new Date().toISOString().split('T')[0],
      observaciones_generales: initialData?.observaciones_generales || "",
    }
  });

  const [checklistItems, setChecklistItems] = useState(
    initialData?.checklist_items || DEFAULT_CHECKLIST_ITEMS
  );

  const formData = form.watch();

  // Cargar operaciones disponibles
  useEffect(() => {
    loadOperaciones();
  }, []);

  const loadOperaciones = async () => {
    setLoadingOperaciones(true);
    try {
      const { data, error } = await supabase
        .from('operacion')
        .select('id, codigo, nombre')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedData: Operacion[] = (data || []).map((item: any) => ({
        id: item.id,
        codigo: item.codigo,
        nombre: item.nombre
      }));

      setOperaciones(formattedData);
    } catch (err) {
      console.error('Error loading operaciones:', err);
      toast({
        title: "Error",
        description: "No se pudieron cargar las operaciones",
        variant: "destructive",
      });
    } finally {
      setLoadingOperaciones(false);
    }
  };

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft();
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, checklistItems, jefeCentroSignature, supervisorSignature]);

  const saveDraft = () => {
    const draftData = {
      ...formData,
      checklist_items: checklistItems,
      jefe_centro_firma: jefeCentroSignature,
      supervisor_firma: supervisorSignature,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem('anexo-bravo-draft', JSON.stringify(draftData));
    setLastSaved(new Date());
    console.log('Anexo Bravo Draft saved automatically');
  };

  const handleChecklistChange = (itemId: string, checked: boolean) => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, verificado: checked } : item
      )
    );
  };

  const handleJefeCentroSign = (signatureData: string) => {
    setJefeCentroSignature(signatureData);
    setJefeCentroSigned(true);
    toast({
      title: "Firma Registrada",
      description: "Firma del Jefe de Centro registrada exitosamente",
    });
  };

  const handleSupervisorSign = (signatureData: string) => {
    setSupervisorSignature(signatureData);
    setSupervisorSigned(true);
    toast({
      title: "Firma Registrada",
      description: "Firma del Supervisor registrada exitosamente",
    });
  };

  const resetJefeCentroSign = () => {
    setJefeCentroSigned(false);
    setJefeCentroSignature("");
  };

  const resetSupervisorSign = () => {
    setSupervisorSigned(false);
    setSupervisorSignature("");
  };

  const getCompletionPercentage = () => {
    const checkedItems = checklistItems.filter(item => item.verificado).length;
    return (checkedItems / checklistItems.length) * 100;
  };

  const canSubmit = () => {
    const allItemsChecked = checklistItems.every(item => item.verificado);
    return allItemsChecked && jefeCentroSigned && supervisorSigned && formData.operacion_id.trim();
  };

  const handleSubmit = () => {
    if (canSubmit()) {
      const submitData: AnexoBravoData = {
        ...formData,
        checklist_items: checklistItems,
        jefe_centro_firma: jefeCentroSignature,
        supervisor_firma: supervisorSignature,
      };
      onSubmit(submitData);
      localStorage.removeItem('anexo-bravo-draft');
      toast({
        title: "Anexo Bravo Completado",
        description: "El documento ha sido finalizado y firmado correctamente",
      });
    }
  };

  const completionPercentage = getCompletionPercentage();
  const isReadyToSign = completionPercentage === 100 && formData.operacion_id.trim();

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <FileCheck className="w-6 h-6 text-green-600" />
              <div>
                <CardTitle>Anexo Bravo</CardTitle>
                <p className="text-sm text-zinc-500">
                  Checklist de Verificación de Seguridad
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {lastSaved && (
                <Badge variant="outline" className="bg-blue-100 text-blue-700">
                  <Clock className="w-3 h-3 mr-1" />
                  Guardado {lastSaved.toLocaleTimeString()}
                </Badge>
              )}
              <Badge variant="outline" className="bg-green-100 text-green-700">
                <Save className="w-3 h-3 mr-1" />
                Auto-guardado activo
              </Badge>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex items-center justify-between text-sm text-zinc-600 mb-2">
              <span>Progreso del checklist</span>
              <span>{Math.round(completionPercentage)}% completo</span>
            </div>
            <Progress value={completionPercentage} className="h-2" />
          </div>
        </CardHeader>
      </Card>

      <div className="space-y-6">
        {/* Información General */}
        <Card>
          <CardHeader>
            <CardTitle>Información General</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <div className="grid md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="operacion_id"
                  rules={{ required: "Operación es requerida" }}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Operación *</FormLabel>
                      <FormControl>
                        <Select value={field.value} onValueChange={field.onChange}>
                          <SelectTrigger>
                            <SelectValue placeholder={loadingOperaciones ? "Cargando..." : "Seleccionar operación"} />
                          </SelectTrigger>
                          <SelectContent>
                            {operaciones.map((operacion) => (
                              <SelectItem key={operacion.id} value={operacion.id}>
                                {operacion.codigo} - {operacion.nombre}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fecha_verificacion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de Verificación</FormLabel>
                      <FormControl>
                        <input 
                          type="date"
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </Form>
          </CardContent>
        </Card>

        {/* Checklist Dinámico */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-blue-600" />
              Checklist de Verificación de Seguridad
              <Badge variant="outline">
                {checklistItems.filter(item => item.verificado).length}/{checklistItems.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50 transition-colors">
                  <Checkbox
                    id={item.id}
                    checked={item.verificado}
                    onCheckedChange={(checked) => handleChecklistChange(item.id, checked as boolean)}
                  />
                  <label
                    htmlFor={item.id}
                    className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                  >
                    {item.item}
                  </label>
                  {item.verificado && (
                    <CheckCircle className="w-4 h-4 text-green-600" />
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Observaciones Generales */}
        <Card>
          <CardHeader>
            <CardTitle>Observaciones Generales</CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <FormField
                control={form.control}
                name="observaciones_generales"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Observaciones</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Ingrese cualquier observación adicional sobre la verificación..."
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </Form>
          </CardContent>
        </Card>

        {/* Firmas Digitales */}
        <div className="grid md:grid-cols-2 gap-6">
          <DigitalSignature
            title="Firma Jefe de Centro"
            role="Jefe de Centro"
            isSigned={jefeCentroSigned}
            onSign={handleJefeCentroSign}
            onReset={resetJefeCentroSign}
            disabled={!isReadyToSign}
            iconColor="text-blue-600"
          />

          <DigitalSignature
            title="Firma Supervisor de Servicio"
            role="Supervisor de Servicio"
            isSigned={supervisorSigned}
            onSign={handleSupervisorSign}
            onReset={resetSupervisorSign}
            disabled={!isReadyToSign}
            iconColor="text-orange-600"
          />
        </div>

        {/* Estado de finalización */}
        <Card className={canSubmit() ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              {canSubmit() ? (
                <>
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <span className="font-medium text-green-700">
                    Anexo Bravo listo para finalizar - Checklist completo y ambas firmas realizadas
                  </span>
                </>
              ) : (
                <>
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                  <span className="font-medium text-amber-700">
                    {!formData.operacion_id.trim() 
                      ? "Seleccione una operación para continuar"
                      : !isReadyToSign 
                        ? "Complete todos los elementos del checklist para habilitar las firmas"
                        : "Se requieren ambas firmas para completar el Anexo Bravo"
                    }
                  </span>
                </>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Botones de acción */}
      <div className="flex justify-between items-center mt-6">
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={onCancel}
            className="flex items-center gap-2"
          >
            Cancelar
          </Button>
          <Button 
            variant="outline" 
            onClick={saveDraft}
            className="flex items-center gap-2"
          >
            <Save className="w-4 h-4" />
            Guardar Ahora
          </Button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit()}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 disabled:opacity-50"
        >
          <FileCheck className="w-4 h-4" />
          Finalizar Anexo Bravo
        </Button>
      </div>
    </div>
  );
};
