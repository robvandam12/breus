import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Calendar, Building, Plus, Eye, CheckCircle, AlertTriangle, Clock } from "lucide-react";
import { supabase } from '@/integrations/supabase/client';
import { HPTWizardComplete } from '@/components/hpt/HPTWizardComplete';
import { useOperacionValidation } from "@/hooks/useOperacionValidation";

export default function HPTPage() {
  const [hpts, setHpts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOperacionId, setSelectedOperacionId] = useState<string | null>(null);
  const [selectedOperacionData, setSelectedOperacionData] = useState<any>(null);
  const { operacionesConDocumentos, getOperacionesDisponiblesParaHPT } = useOperacionValidation();

  const operacionesDisponibles = getOperacionesDisponiblesParaHPT();

  useEffect(() => {
    const fetchHPTs = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('hpt')
          .select('*')
          .order('created_at', { ascending: false });

        if (error) {
          console.error('Error fetching HPTs:', error);
        } else {
          setHpts(data || []);
        }
      } catch (error) {
        console.error('Error fetching HPTs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHPTs();
  }, []);

  const handleOperacionChange = (operacionId: string) => {
    setSelectedOperacionId(operacionId);
    const operacion = operacionesConDocumentos.find(op => op.id === operacionId);
    setSelectedOperacionData(operacion);
  };

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto"></div>
        <p className="text-gray-500 mt-2 text-sm">Cargando HPTs...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Hojas de Planificación de Tarea (HPT)</h1>
          <p className="text-gray-600">Administre las HPTs creadas para las operaciones</p>
        </div>
        <Button
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Crear Nueva HPT
        </Button>
      </div>

      {/* Selector de Operación */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg font-semibold text-gray-900">
            <FileText className="w-5 h-5 text-blue-600" />
            Seleccionar Operación
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label className="block text-sm font-medium text-gray-700 mb-2">
              Operación
            </Label>
            <Select value={selectedOperacionId || ''} onValueChange={handleOperacionChange}>
              <SelectTrigger className="h-11 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                <SelectValue placeholder="Seleccione una operación" />
              </SelectTrigger>
              <SelectContent className="bg-white border-gray-200 shadow-lg">
                {operacionesDisponibles.map((operacion) => (
                  <SelectItem key={operacion.id} value={operacion.id} className="py-3">
                    <div className="flex items-center gap-3 w-full">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium text-gray-900">{operacion.codigo}</span>
                          <span className="text-gray-400">-</span>
                          <span className="text-gray-700">{operacion.nombre}</span>
                        </div>
                        <div className="flex items-center gap-4 mt-1 text-xs text-gray-500">
                          <span>{operacion.salmoneras?.nombre}</span>
                          <span>•</span>
                          <span>{new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}</span>
                        </div>
                      </div>
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        {operacion.estado}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* HPT List */}
      <Card className="border-0 shadow-sm bg-white">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-lg">HPTs Creadas</CardTitle>
        </CardHeader>
        <CardContent>
          {hpts.length === 0 ? (
            <div className="text-center py-8 border border-dashed border-gray-200 rounded-lg">
              <FileText className="w-8 h-8 text-gray-300 mx-auto mb-3" />
              <p className="text-gray-500 text-sm">No hay HPTs creadas aún</p>
            </div>
          ) : (
            <div className="space-y-3">
              {hpts.map((hpt) => (
                <div key={hpt.id} className="flex items-center justify-between p-3 border rounded-lg bg-gray-50/50">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <FileText className="w-5 h-5 text-blue-600" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{hpt.codigo}</p>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-3 h-3" />
                        <span>{new Date(hpt.created_at).toLocaleDateString('es-CL')}</span>
                        <span>•</span>
                        <span>{hpt.supervisor}</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={hpt.firmado ? "default" : "secondary"} className={hpt.firmado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
                      {hpt.firmado ? (
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-3 h-3" />
                          Firmado
                        </div>
                      ) : (
                        <div className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {hpt.estado || 'Borrador'}
                        </div>
                      )}
                    </Badge>
                    <Button variant="outline" size="sm" className="text-gray-600 border-gray-200">
                      <Eye className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Dialog */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0">
          <HPTWizardComplete
            operacionId={selectedOperacionData?.id}
            onComplete={(hptId: string) => {
              setShowCreateForm(false);
              // Refresh the list or navigate
              window.location.reload();
            }}
            onCancel={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
}
