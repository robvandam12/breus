
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText, AlertTriangle, CheckCircle, Edit, Eye } from "lucide-react";
import { HPTWizard } from "@/components/hpt/HPTWizard";
import { HPTOperationSelector } from "@/components/hpt/HPTOperationSelector";
import { useHPT } from "@/hooks/useHPT";
import { useOperacionValidation } from "@/hooks/useOperacionValidation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const HPTPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showOperacionSelector, setShowOperacionSelector] = useState(false);
  const [selectedOperacionId, setSelectedOperacionId] = useState<string>('');
  
  const { hpts, isLoading } = useHPT();
  const { 
    operacionesConDocumentos, 
    getOperacionesDisponiblesParaHPT,
    validarOperacionParaDocumento 
  } = useOperacionValidation();

  const operacionesDisponibles = getOperacionesDisponiblesParaHPT();

  const filteredHPTs = hpts.filter(hpt => 
    hpt.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hpt.supervisor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateHPT = () => {
    if (operacionesDisponibles.length === 0) {
      alert('No hay operaciones disponibles para crear HPT');
      return;
    }
    setShowOperacionSelector(true);
  };

  const handleOperacionSelected = (operacionId: string) => {
    setSelectedOperacionId(operacionId);
    setShowOperacionSelector(false);
    setShowCreateForm(true);
  };

  const handleHPTComplete = () => {
    setShowCreateForm(false);
    setSelectedOperacionId('');
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setShowOperacionSelector(false);
    setSelectedOperacionId('');
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-gray-50">
            <Header 
              title="Hojas de Planificación de Tarea (HPT)" 
              subtitle="Gestión de documentos HPT para operaciones de buceo" 
              icon={FileText} 
            />
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <LoadingSpinner text="Cargando HPTs..." />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (showOperacionSelector) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-gray-50">
            <Header 
              title="Seleccionar Operación" 
              subtitle="Seleccione la operación para crear el HPT" 
              icon={FileText} 
            />
            <div className="flex-1 overflow-auto bg-gray-50 p-4 md:p-6">
              <div className="max-w-4xl mx-auto">
                <HPTOperationSelector
                  onOperacionSelected={handleOperacionSelected}
                  selectedOperacionId={selectedOperacionId}
                />
                <div className="flex justify-end mt-6 gap-3">
                  <Button variant="outline" onClick={handleCancel} className="px-6">
                    Cancelar
                  </Button>
                </div>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-gray-50">
          <Header 
            title="Hojas de Planificación de Tarea (HPT)" 
            subtitle="Gestión de documentos HPT para operaciones de buceo" 
            icon={FileText} 
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar HPTs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-72 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Button 
                onClick={handleCreateHPT}
                disabled={operacionesDisponibles.length === 0}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo HPT
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto bg-gray-50">
            <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
              {/* Alertas de validación */}
              {operacionesDisponibles.length === 0 && (
                <Card className="border-orange-200 bg-orange-50 shadow-sm rounded-xl">
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-orange-800">No hay operaciones disponibles</h3>
                        <p className="text-sm text-orange-700 mt-1">
                          Todas las operaciones existentes ya tienen HPTs asociados. Crea una nueva operación para poder generar un HPT.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="p-4 bg-white shadow-sm rounded-xl border-gray-200">
                  <div className="text-2xl font-bold text-blue-600">
                    {hpts.length}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">HPTs Totales</div>
                </Card>
                <Card className="p-4 bg-white shadow-sm rounded-xl border-gray-200">
                  <div className="text-2xl font-bold text-green-600">
                    {hpts.filter(h => h.firmado).length}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Firmados</div>
                </Card>
                <Card className="p-4 bg-white shadow-sm rounded-xl border-gray-200">
                  <div className="text-2xl font-bold text-yellow-600">
                    {hpts.filter(h => h.estado === 'borrador').length}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">En Borrador</div>
                </Card>
                <Card className="p-4 bg-white shadow-sm rounded-xl border-gray-200">
                  <div className="text-2xl font-bold text-gray-600">
                    {operacionesDisponibles.length}
                  </div>
                  <div className="text-sm text-gray-500 font-medium">Disponibles</div>
                </Card>
              </div>

              {filteredHPTs.length === 0 ? (
                <Card className="text-center py-16 bg-white shadow-sm rounded-xl border-gray-200">
                  <CardContent>
                    <FileText className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {hpts.length === 0 ? "No hay HPTs registrados" : "No se encontraron resultados"}
                    </h3>
                    <p className="text-gray-500 mb-6">
                      {hpts.length === 0 
                        ? "Comience creando el primer HPT seleccionando una operación"
                        : "Intenta ajustar los filtros de búsqueda"}
                    </p>
                    {operacionesDisponibles.length > 0 && (
                      <Button 
                        onClick={handleCreateHPT}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo HPT
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="bg-white shadow-sm rounded-xl border-gray-200 overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 border-gray-200">
                        <TableHead className="font-semibold text-gray-700">Código</TableHead>
                        <TableHead className="font-semibold text-gray-700">Operación</TableHead>
                        <TableHead className="font-semibold text-gray-700">Supervisor</TableHead>
                        <TableHead className="font-semibold text-gray-700">Fecha</TableHead>
                        <TableHead className="font-semibold text-gray-700">Estado</TableHead>
                        <TableHead className="font-semibold text-gray-700">Progreso</TableHead>
                        <TableHead className="text-right font-semibold text-gray-700">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHPTs.map((hpt) => {
                        const operacion = operacionesConDocumentos.find(op => op.id === hpt.operacion_id);
                        return (
                          <TableRow key={hpt.id} className="border-gray-100 hover:bg-gray-50">
                            <TableCell>
                              <div className="font-semibold text-gray-900">{hpt.codigo || hpt.folio}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-600">
                                {operacion ? `${operacion.codigo} - ${operacion.nombre}` : 'Operación no encontrada'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-900">{hpt.supervisor}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-600">
                                {hpt.fecha ? new Date(hpt.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant={hpt.firmado ? 'default' : 'secondary'}
                                className={hpt.firmado ? 'bg-green-100 text-green-700 border-green-200' : 'bg-gray-100 text-gray-700 border-gray-200'}
                              >
                                {hpt.firmado ? (
                                  <div className="flex items-center gap-1">
                                    <CheckCircle className="w-3 h-3" />
                                    Firmado
                                  </div>
                                ) : (
                                  hpt.estado || 'Borrador'
                                )}
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-20 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-500 h-2 rounded-full transition-all"
                                    style={{ width: `${hpt.progreso || 0}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500 min-w-[30px]">{hpt.progreso || 0}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {!hpt.firmado && (
                                  <Button variant="outline" size="sm" className="h-8 w-8 p-0">
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                )}
                              </div>
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>
          </div>

          {/* Modal para crear HPT */}
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogContent className="max-w-[95vw] max-h-[95vh] overflow-hidden p-0">
              <HPTWizard 
                operacionId={selectedOperacionId}
                onComplete={handleHPTComplete}
                onCancel={() => setShowCreateForm(false)}
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default HPTPage;
