
import { useState, useEffect } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Calendar, Clock, User, Building, MapPin, FileText, Save, X, Users, Anchor } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useAnexoBravo } from '@/hooks/useAnexoBravo';
import { useHPT } from '@/hooks/useHPT';
import { HPTWizardComplete } from '@/components/hpt/HPTWizardComplete';
import { AnexoBravoWizard } from '@/components/anexo-bravo/AnexoBravoWizard';
import { useToast } from '@/hooks/use-toast';

export default function BitacorasSupervisor() {
  const { profile } = useAuth();
  const { operaciones, isLoading: loadingOperaciones } = useOperaciones();
  const { anexosBravo, isLoading: loadingAnexosBravo } = useAnexoBravo();
  const { hpts, isLoading: loadingHPTs } = useHPT();
  const [selectedOperacionId, setSelectedOperacionId] = useState<string | null>(null);
  const [showHPTWizard, setShowHPTWizard] = useState(false);
  const [showAnexoBravoWizard, setShowAnexoBravoWizard] = useState(false);
  const [formData, setFormData] = useState({
    desarrollo_inmersion: '',
    incidentes: '',
    evaluacion_general: ''
  });
  const { toast } = useToast();

  useEffect(() => {
    if (loadingOperaciones || loadingAnexosBravo || loadingHPTs) return;
  }, [loadingOperaciones, loadingAnexosBravo, loadingHPTs]);

  const pendingOperaciones = operaciones.map(operacion => {
    const anexo_bravo_info = anexosBravo.find(anexo => anexo.operacion_id === operacion.id);
    const hpt_info = hpts.find(hpt => hpt.operacion_id === operacion.id);

    return {
      ...operacion,
      anexo_bravo_info,
      hpt_info
    };
  });

  const pendingOperacion = selectedOperacionId ? pendingOperaciones.find(op => op.id === selectedOperacionId) : null;

  const handleCreateBitacora = async (data: any) => {
    // Handle creation logic here
    console.log('Creating bitacora:', data);
  };

  const handleShowHPTWizard = (operacionId: string) => {
    setSelectedOperacionId(operacionId);  
    setShowHPTWizard(true);
  };

  const handleHPTComplete = () => {
    setShowHPTWizard(false);
    setSelectedOperacionId(null);
  };

  const handleHPTCancel = () => {
    setShowHPTWizard(false);
    setSelectedOperacionId(null);
  };

  const handleShowAnexoBravoWizard = (operacionId: string) => {
    setSelectedOperacionId(operacionId);
    setShowAnexoBravoWizard(true);
  };

  const handleAnexoBravoComplete = () => {
    setShowAnexoBravoWizard(false);
    setSelectedOperacionId(null);
  };

  const handleAnexoBravoCancel = () => {
    setShowAnexoBravoWizard(false);
    setSelectedOperacionId(null);
  };

  if (showHPTWizard && selectedOperacionId) {
    return (
      <HPTWizardComplete
        operacionId={selectedOperacionId}
        onComplete={handleHPTComplete}
        onCancel={handleHPTCancel}
      />
    );
  }

  if (showAnexoBravoWizard && selectedOperacionId) {
    return (
      <AnexoBravoWizard
        operacionId={selectedOperacionId}
        onComplete={handleAnexoBravoComplete}
        onCancel={handleAnexoBravoCancel}
      />
    );
  }

  return (
    <MainLayout
      title="Bitácoras de Supervisor"
      subtitle="Registro y gestión de bitácoras de supervisores de buceo"
      icon={FileText}
    >
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Nueva Bitácora de Supervisor
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-blue-700 border-b pb-2">
                  1. Seleccionar Operación
                </h3>
                <div>
                  <Label htmlFor="operacion_id">Operación</Label>
                  <Select value={selectedOperacionId || ''} onValueChange={setSelectedOperacionId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar operación..." />
                    </SelectTrigger>
                    <SelectContent>
                      {pendingOperaciones.map((operacion) => (
                        <SelectItem key={operacion.id} value={operacion.id}>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{operacion.codigo}</Badge>
                            <span>{operacion.nombre}</span>
                            <span className="text-sm text-gray-500">
                              ({new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')})
                            </span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {pendingOperacion && (
                <>
                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-700 border-b pb-2">
                      2. Información de la Operación
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <Building className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Empresa:</span>
                          <span>{pendingOperacion.salmoneras?.nombre || pendingOperacion.contratistas?.nombre || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <MapPin className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Centro:</span>
                          <span>{pendingOperacion.centros?.nombre || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Calendar className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Fecha:</span>
                          <span>{new Date(pendingOperacion.fecha_inicio).toLocaleDateString('es-CL')}</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">HPT:</span>
                          {pendingOperacion.hpt_info ? (
                            <Badge variant="default">
                              {pendingOperacion.hpt_info.codigo}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Pendiente</Badge>
                          )}
                        </div>
                        <div className="flex items-center gap-2">
                          <FileText className="w-4 h-4 text-gray-500" />
                          <span className="font-medium">Anexo Bravo:</span>
                          {pendingOperacion.anexo_bravo_info ? (
                            <Badge variant="default">
                              {pendingOperacion.anexo_bravo_info.codigo}
                            </Badge>
                          ) : (
                            <Badge variant="secondary">Pendiente</Badge>
                          )}
                        </div>
                        <div>
                          <span className="font-medium">Tareas:</span>
                          <p className="text-sm text-gray-600 mt-1">{pendingOperacion.tareas}</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <Separator />

                  <div className="space-y-4">
                    <h3 className="text-lg font-semibold text-blue-700 border-b pb-2">
                      3. Registro del Supervisor
                    </h3>
                    <div>
                      <Label htmlFor="desarrollo_inmersion">Desarrollo de la Inmersión</Label>
                      <Textarea
                        id="desarrollo_inmersion"
                        value={formData.desarrollo_inmersion}
                        onChange={(e) => setFormData({...formData, desarrollo_inmersion: e.target.value})}
                        placeholder="Describa cómo se desarrolló la inmersión..."
                        className="min-h-[120px]"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="incidentes">Incidentes (Opcional)</Label>
                      <Textarea
                        id="incidentes"
                        value={formData.incidentes}
                        onChange={(e) => setFormData({...formData, incidentes: e.target.value})}
                        placeholder="Describa cualquier incidente ocurrido durante la inmersión..."
                        className="min-h-[80px]"
                      />
                    </div>
                    <div>
                      <Label htmlFor="evaluacion_general">Evaluación General</Label>
                      <Textarea
                        id="evaluacion_general"
                        value={formData.evaluacion_general}
                        onChange={(e) => setFormData({...formData, evaluacion_general: e.target.value})}
                        placeholder="Evaluación general de la inmersión..."
                        className="min-h-[120px]"
                        required
                      />
                    </div>
                  </div>

                  <div className="flex gap-3 pt-6">
                    <Button
                      type="submit"
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleCreateBitacora(formData)}
                      disabled={!formData.desarrollo_inmersion || !formData.evaluacion_general}
                    >
                      <Save className="w-4 h-4 mr-2" />
                      Crear Bitácora
                    </Button>
                    <Button type="button" variant="outline" onClick={() => {}}>
                      <X className="w-4 h-4 mr-2" />
                      Cancelar
                    </Button>
                  </div>
                </>
              )}
            </form>

            <Separator className="my-4" />

            <div className="flex justify-between">
              <Button
                variant="secondary"
                onClick={() => {
                  if (pendingOperacion) {
                    handleShowHPTWizard(pendingOperacion.id);
                  } else {
                    toast({
                      title: "Error",
                      description: "Debe seleccionar una operación primero.",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={!pendingOperacion}
              >
                Crear HPT
              </Button>

              <Button
                variant="secondary"
                onClick={() => {
                  if (pendingOperacion) {
                    handleShowAnexoBravoWizard(pendingOperacion.id);
                  } else {
                    toast({
                      title: "Error",
                      description: "Debe seleccionar una operación primero.",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={!pendingOperacion}
              >
                Crear Anexo Bravo
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
