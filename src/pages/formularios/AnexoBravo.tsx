
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, Plus, Eye, Edit, Download, Calendar, Building, MapPin } from "lucide-react";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { useOperaciones } from "@/hooks/useOperaciones";

export const AnexoBravoPage = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [editingAnexo, setEditingAnexo] = useState<any>(null);
  const { anexosBravo, createAnexoBravo, isLoading } = useAnexoBravo();
  const { operaciones } = useOperaciones();

  const handleCreateAnexo = async (data: any) => {
    try {
      await createAnexoBravo(data);
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating Anexo Bravo:', error);
    }
  };

  const getOperacionInfo = (operacionId: string) => {
    return operaciones.find(op => op.id === operacionId);
  };

  const anexoStats = {
    total: anexosBravo.length,
    firmados: anexosBravo.filter(a => a.firmado).length,
    borradores: anexosBravo.filter(a => !a.firmado).length,
    recientes: anexosBravo.filter(a => {
      const fecha = new Date(a.created_at);
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
              Anexos Bravo
            </h1>
            <p className="text-gray-600 mt-2">
              Gestiona los Anexos Bravo de tus operaciones de buceo
            </p>
          </div>
          <Button
            onClick={() => setShowCreateDialog(true)}
            className="bg-green-600 hover:bg-green-700 text-white rounded-xl shadow-lg"
          >
            <Plus className="w-5 h-5 mr-2" />
            Crear Anexo Bravo
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white shadow-sm rounded-xl border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Anexos</p>
                  <p className="text-3xl font-bold text-gray-900">{anexoStats.total}</p>
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
                  <p className="text-sm font-medium text-gray-600">Firmados</p>
                  <p className="text-3xl font-bold text-green-600">{anexoStats.firmados}</p>
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
                  <p className="text-3xl font-bold text-orange-600">{anexoStats.borradores}</p>
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
                  <p className="text-3xl font-bold text-purple-600">{anexoStats.recientes}</p>
                </div>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-6 h-6 text-purple-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Anexos List */}
        <Card className="bg-white shadow-sm rounded-xl border-gray-200">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <FileText className="w-5 h-5 text-green-600" />
              Lista de Anexos Bravo
            </CardTitle>
          </CardHeader>
          <CardContent>
            {isLoading ? (
              <div className="flex items-center justify-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-600"></div>
                <p className="ml-4 text-gray-500">Cargando Anexos Bravo...</p>
              </div>
            ) : anexosBravo.length === 0 ? (
              <div className="text-center py-12">
                <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500 mb-2">No hay Anexos Bravo creados</p>
                <p className="text-sm text-gray-400 mb-6">Crea tu primer Anexo Bravo para comenzar</p>
                <Button 
                  onClick={() => setShowCreateDialog(true)}
                  className="bg-green-600 hover:bg-green-700 text-white rounded-xl"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primer Anexo Bravo
                </Button>
              </div>
            ) : (
              <div className="space-y-4">
                {anexosBravo.map((anexo) => {
                  const operacion = getOperacionInfo(anexo.operacion_id);
                  return (
                    <div key={anexo.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                          <FileText className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h3 className="font-semibold text-gray-900">{anexo.codigo}</h3>
                            <Badge 
                              variant={anexo.firmado ? 'default' : 'secondary'}
                              className={anexo.firmado ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}
                            >
                              {anexo.firmado ? 'Firmado' : anexo.estado || 'Borrador'}
                            </Badge>
                          </div>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Calendar className="w-4 h-4" />
                              <span>{anexo.fecha ? new Date(anexo.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}</span>
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
                        {!anexo.firmado && (
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="h-9 w-9 p-0 rounded-lg"
                            onClick={() => setEditingAnexo(anexo)}
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

        {/* Create Anexo Dialog */}
        <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0">
            <FullAnexoBravoForm
              showOperationSelector={true}
              onSubmit={handleCreateAnexo}
              onCancel={() => setShowCreateDialog(false)}
            />
          </DialogContent>
        </Dialog>

        {/* Edit Anexo Dialog */}
        <Dialog open={!!editingAnexo} onOpenChange={() => setEditingAnexo(null)}>
          <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0">
            <FullAnexoBravoForm
              onSubmit={handleCreateAnexo}
              onCancel={() => setEditingAnexo(null)}
              operacionId={editingAnexo?.operacion_id}
              anexoId={editingAnexo?.id}
            />
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
