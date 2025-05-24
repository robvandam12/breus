
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { PenTool, CheckCircle, AlertTriangle, FileCheck, Shield } from "lucide-react";

interface AnexoBravoData {
  operacionId: string;
  fechaVerificacion: string;
  checklistItems: Array<{
    id: string;
    item: string;
    verificado: boolean;
    observaciones?: string;
  }>;
  jefeCentroFirma: string | null;
  supervisorFirma: string | null;
  observacionesGenerales: string;
}

interface AnexoBravoFormProps {
  onSubmit: (data: AnexoBravoData) => void;
  onCancel: () => void;
  initialData?: Partial<AnexoBravoData>;
}

export const AnexoBravoForm = ({ onSubmit, onCancel, initialData }: AnexoBravoFormProps) => {
  const [jefeCentroSigned, setJefeCentroSigned] = useState(!!initialData?.jefeCentroFirma);
  const [supervisorSigned, setSupervisorSigned] = useState(!!initialData?.supervisorFirma);

  const form = useForm({
    defaultValues: {
      operacionId: initialData?.operacionId || "",
      fechaVerificacion: initialData?.fechaVerificacion || new Date().toISOString().split('T')[0],
      observacionesGenerales: initialData?.observacionesGenerales || "",
    }
  });

  const [checklistItems, setChecklistItems] = useState(
    initialData?.checklistItems || [
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
    ]
  );

  const formData = form.watch();

  // Auto-save draft every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      saveDraft();
    }, 30000);

    return () => clearInterval(interval);
  }, [formData, checklistItems]);

  const saveDraft = () => {
    const draftData = {
      ...formData,
      checklistItems,
      jefeCentroFirma: jefeCentroSigned ? "FIRMADO_DIGITALMENTE" : null,
      supervisorFirma: supervisorSigned ? "FIRMADO_DIGITALMENTE" : null,
      lastSaved: new Date().toISOString()
    };
    localStorage.setItem('anexo-bravo-draft', JSON.stringify(draftData));
    console.log('Anexo Bravo Draft saved automatically');
  };

  const handleChecklistChange = (itemId: string, checked: boolean) => {
    setChecklistItems(prev => 
      prev.map(item => 
        item.id === itemId ? { ...item, verificado: checked } : item
      )
    );
  };

  const handleJefeCentroSign = () => {
    setJefeCentroSigned(true);
  };

  const handleSupervisorSign = () => {
    setSupervisorSigned(true);
  };

  const resetJefeCentroSign = () => {
    setJefeCentroSigned(false);
  };

  const resetSupervisorSign = () => {
    setSupervisorSigned(false);
  };

  const getCompletionPercentage = () => {
    const checkedItems = checklistItems.filter(item => item.verificado).length;
    return (checkedItems / checklistItems.length) * 100;
  };

  const canSubmit = () => {
    const allItemsChecked = checklistItems.every(item => item.verificado);
    return allItemsChecked && jefeCentroSigned && supervisorSigned;
  };

  const handleSubmit = () => {
    if (canSubmit()) {
      const submitData: AnexoBravoData = {
        ...formData,
        checklistItems,
        jefeCentroFirma: jefeCentroSigned ? "FIRMADO_DIGITALMENTE" : null,
        supervisorFirma: supervisorSigned ? "FIRMADO_DIGITALMENTE" : null,
      };
      onSubmit(submitData);
      localStorage.removeItem('anexo-bravo-draft');
    }
  };

  const completionPercentage = getCompletionPercentage();
  const isReadyToSign = completionPercentage === 100;

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
            <Badge variant="outline" className="bg-green-100 text-green-700">
              Draft Auto-guardado
            </Badge>
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
                  name="operacionId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>ID de Operación</FormLabel>
                      <FormControl>
                        <input 
                          className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                          placeholder="ID de la operación"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="fechaVerificacion"
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
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {checklistItems.map((item) => (
                <div key={item.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                  <Checkbox
                    id={item.id}
                    checked={item.verificado}
                    onCheckedChange={(checked) => handleChecklistChange(item.id, checked as boolean)}
                  />
                  <label
                    htmlFor={item.id}
                    className="flex-1 text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
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
                name="observacionesGenerales"
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

        {/* Firmas */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Firma Jefe de Centro */}
          <Card className={jefeCentroSigned ? "border-green-200 bg-green-50" : "border-gray-200"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-blue-600" />
                Firma Jefe de Centro
                {jefeCentroSigned && (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Firmado
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-zinc-600">
                  <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
                  <p><strong>Hora:</strong> {new Date().toLocaleTimeString()}</p>
                </div>
                
                {jefeCentroSigned ? (
                  <div className="p-4 bg-green-100 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Documento Firmado Digitalmente</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetJefeCentroSign}
                        className="text-gray-600"
                      >
                        Anular Firma
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 min-h-[120px] flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <PenTool className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Área de firma digital</p>
                      </div>
                    </div>
                    <Button 
                      onClick={handleJefeCentroSign}
                      className="w-full"
                      disabled={!isReadyToSign}
                    >
                      <PenTool className="w-4 h-4 mr-2" />
                      Firmar Como Jefe de Centro
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Firma Supervisor */}
          <Card className={supervisorSigned ? "border-green-200 bg-green-50" : "border-gray-200"}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PenTool className="w-5 h-5 text-orange-600" />
                Firma Supervisor de Servicio
                {supervisorSigned && (
                  <Badge className="bg-green-100 text-green-700">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Firmado
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="text-sm text-zinc-600">
                  <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
                  <p><strong>Hora:</strong> {new Date().toLocaleTimeString()}</p>
                </div>
                
                {supervisorSigned ? (
                  <div className="p-4 bg-green-100 rounded-lg border border-green-200">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-green-700">
                        <CheckCircle className="w-5 h-5" />
                        <span className="font-medium">Documento Firmado Digitalmente</span>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={resetSupervisorSign}
                        className="text-gray-600"
                      >
                        Anular Firma
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <div className="p-4 bg-gray-100 rounded-lg border-2 border-dashed border-gray-300 min-h-[120px] flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <PenTool className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">Área de firma digital</p>
                      </div>
                    </div>
                    <Button 
                      onClick={handleSupervisorSign}
                      className="w-full"
                      disabled={!isReadyToSign}
                    >
                      <PenTool className="w-4 h-4 mr-2" />
                      Firmar Como Supervisor
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
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
                    {!isReadyToSign 
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
            <PenTool className="w-4 h-4" />
            Guardar Draft
          </Button>
        </div>

        <Button
          onClick={handleSubmit}
          disabled={!canSubmit()}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
        >
          <FileCheck className="w-4 h-4" />
          Finalizar Anexo Bravo
        </Button>
      </div>
    </div>
  );
};
