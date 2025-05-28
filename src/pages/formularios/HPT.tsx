
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, Plus, Eye, Edit, Download, Calendar, Building, MapPin } from "lucide-react";
import { HPTWizard } from "@/components/hpt/HPTWizard";
import { useHPT } from "@/hooks/useHPT";
import { useOperaciones } from "@/hooks/useOperaciones";

export const HPTPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingHPT, setEditingHPT] = useState<any>(null);
  const { hpts, createHPT, isLoading } = useHPT();
  const { operaciones } = useOperaciones();

  const handleCreateHPT = async (data: any) => {
    try {
      await createHPT(data);
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating HPT:', error);
    }
  };

  const getOperacionInfo = (operacionId: string) => {
    return operaciones.find(op => op.id === operacionId);
  };

  const hptStats = {
    total: hpts.length,
    firmados: hpts.filter(h => h.firmado).length,
    borradores: hpts.filter(h => !h.firmado).length,
    recientes: hpts.filter(h => {
      const fecha = new Date(h.created_at);
      const hoy = new Date();
      const diferencia = hoy.getTime() - fecha.getTime();
      const dias = diferencia / (1000 * 3600 * 24);
      return dias <= 7;
    }).length
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="p-6 space-y-6 max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Hojas de Planificación de Tarea (HPT)
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona las HPTs de tus operaciones de buceo
            </p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear HPT
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white shadow-sm rounded-xl border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total HPTs</p>
                  <p className="text-3xl font-bold text-gray-900">{hptStats.total}</p>
                </div>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm rounded-xl border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Firmados</p>
                  <p className="text-3xl font-bold text-green-600">{hptStats.firmados}</p>
                </div>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm rounded-xl border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Borradores</p>
                  <p className="text-3xl font-bold text-orange-600">{hptStats.borradores}</p>
                </div>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-6 h-6 text-orange-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white shadow-sm rounded-xl border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Esta Semana</p>
                  <p className="text-3xl font-bold text-purple-600">{hptStats.recientes}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* HPTs List */}
        <Card className="bg-white shadow-sm rounded-xl border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <FileText className="w-5 h-5 text-blue-600" />
              Lista de HPTs
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                <p className="ml-4 text-gray-500">Cargando HPTs...</p>
              </div>
            ) : hpts.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No hay HPTs creados</p>
                <p className="text-sm text-gray-400 mb-6">Crea tu primer HPT para comenzar</p>
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primer HPT
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {hpts.map((hpt) => {
                  const operacion = getOperacionInfo(hpt.operacion_id);
                  return (
                    <div key={hpt.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{hpt.folio || hpt.codigo}</h3>
                            <Badge 
                              variant={hpt.firmado ? 'default' : 'secondary'}
                              className={hpt.firmado ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}
                            >
                              {hpt.firmado ? 'Firmado' : hpt.estado || 'Borrador'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{hpt.fecha ? new Date(hpt.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}</span>
                            </div>
                            {operacion && (
                              <>
                                <div className="flex items-center gap-1">
                                  <Building className="w-4 h-4" />
                                  <span>{operacion.codigo}</span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <MapPin className="w-4 h-4" />
                                  <span>{operacion.salmoneras?.nombre || 'Sin salmonera'}</span>
                                </div>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-lg">
                          <Eye className="w-4 h-4" />
                        </Button>
                        {!hpt.firmado && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 w-9 p-0 rounded-lg"
                            onClick={() => setEditingHPT(hpt)}
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="h-9 w-9 p-0 rounded-lg">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Create HPT Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0">
            <HPTWizard 
              showOperationSelector={true}
              onComplete={() => setShowCreateDialog(false)}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit HPT Dialog */}
        <Dialog open={!!editingHPT} onOpenChange={() => setEditingHPT(null)}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0">
            <HPTWizard 
              operacionId={editingHPT?.operacion_id}
              hptId={editingHPT?.id}
              onComplete={() => setEditingHPT(null)}
              onCancel={() => setEditingHPT(null)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
