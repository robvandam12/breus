
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useForm } from "react-hook-form";
import { useEffect, useState } from "react";
import { PenTool, CheckCircle, AlertTriangle, FileText } from "lucide-react";

interface HPTStep6Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep6 = ({ data, onUpdate }: HPTStep6Props) => {
  const [supervisorSigned, setSupervisorSigned] = useState(!!data.supervisorFirma);
  const [jefeObraSigned, setJefeObraSigned] = useState(!!data.jefeObraFirma);

  const form = useForm({
    defaultValues: {
      observaciones: data.observaciones || "",
    }
  });

  const formData = form.watch();

  useEffect(() => {
    onUpdate({
      ...formData,
      supervisorFirma: supervisorSigned ? "FIRMADO_DIGITALMENTE" : null,
      jefeObraFirma: jefeObraSigned ? "FIRMADO_DIGITALMENTE" : null,
    });
  }, [formData, supervisorSigned, jefeObraSigned, onUpdate]);

  const handleSupervisorSign = () => {
    setSupervisorSigned(true);
  };

  const handleJefeObraSign = () => {
    setJefeObraSigned(true);
  };

  const resetSupervisorSign = () => {
    setSupervisorSigned(false);
  };

  const resetJefeObraSign = () => {
    setJefeObraSigned(false);
  };

  const isReadyToFinalize = supervisorSigned && jefeObraSigned;

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Autorizaciones y Firmas</h3>
        <p className="text-sm text-zinc-500 mb-6">
          Ambas firmas son obligatorias para completar la HPT y habilitar el inicio de la operación.
        </p>
      </div>

      <Form {...form}>
        <FormField
          control={form.control}
          name="observaciones"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observaciones Finales</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Ingrese cualquier observación adicional o consideración especial para esta HPT..."
                  className="min-h-[100px]"
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </Form>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Firma Supervisor */}
        <Card className={supervisorSigned ? "border-green-200 bg-green-50" : "border-gray-200"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="w-5 h-5 text-blue-600" />
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
                <p><strong>Responsable:</strong> {data.supervisor || "No asignado"}</p>
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
                  <p className="text-sm text-green-600 mt-2">
                    Firmado por: {data.supervisor}
                  </p>
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
                    disabled={!data.supervisor}
                  >
                    <PenTool className="w-4 h-4 mr-2" />
                    Firmar Como Supervisor
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Firma Jefe de Obra */}
        <Card className={jefeObraSigned ? "border-green-200 bg-green-50" : "border-gray-200"}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <PenTool className="w-5 h-5 text-orange-600" />
              Firma Jefe de Obra
              {jefeObraSigned && (
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
                <p><strong>Responsable:</strong> {data.jefeObra || "No asignado"}</p>
                <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
                <p><strong>Hora:</strong> {new Date().toLocaleTimeString()}</p>
              </div>
              
              {jefeObraSigned ? (
                <div className="p-4 bg-green-100 rounded-lg border border-green-200">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-green-700">
                      <CheckCircle className="w-5 h-5" />
                      <span className="font-medium">Documento Firmado Digitalmente</span>
                    </div>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={resetJefeObraSign}
                      className="text-gray-600"
                    >
                      Anular Firma
                    </Button>
                  </div>
                  <p className="text-sm text-green-600 mt-2">
                    Firmado por: {data.jefeObra}
                  </p>
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
                    onClick={handleJefeObraSign}
                    className="w-full"
                    disabled={!data.jefeObra}
                  >
                    <PenTool className="w-4 h-4 mr-2" />
                    Firmar Como Jefe de Obra
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Estado de finalización */}
      <Card className={isReadyToFinalize ? "border-green-200 bg-green-50" : "border-amber-200 bg-amber-50"}>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            {isReadyToFinalize ? (
              <>
                <CheckCircle className="w-5 h-5 text-green-600" />
                <span className="font-medium text-green-700">
                  HPT lista para finalizar - Ambas firmas completadas
                </span>
              </>
            ) : (
              <>
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                <span className="font-medium text-amber-700">
                  Se requieren ambas firmas para completar la HPT
                </span>
              </>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Resumen de la HPT */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Resumen de la HPT
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-4 text-sm">
            <div>
              <span className="font-medium">Operación:</span>
              <p className="text-zinc-600">{data.operacionId || "No especificada"}</p>
            </div>
            <div>
              <span className="font-medium">Fecha Programada:</span>
              <p className="text-zinc-600">{data.fechaProgramada || "No especificada"}</p>
            </div>
            <div>
              <span className="font-medium">Buzos:</span>
              <p className="text-zinc-600">{data.buzos?.length || 0} buzos asignados</p>
            </div>
            <div>
              <span className="font-medium">Profundidad Máx:</span>
              <p className="text-zinc-600">{data.profundidadMaxima || 0}m</p>
            </div>
            <div>
              <span className="font-medium">Tipo de Trabajo:</span>
              <p className="text-zinc-600">{data.tipoTrabajo || "No especificado"}</p>
            </div>
            <div>
              <span className="font-medium">Contactos Emergencia:</span>
              <p className="text-zinc-600">{data.contactosEmergencia?.length || 0} contactos</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
