
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
import { Plus, Search, FileText, AlertTriangle, CheckCircle } from "lucide-react";
import { HPTWizard } from "@/components/hpt/HPTWizard";
import { useHPT } from "@/hooks/useHPT";
import { useOperacionValidation } from "@/hooks/useOperacionValidation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const HPTPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  
  const { hpts, isLoading } = useHPT();
  const { 
    operacionesConDocumentos, 
    getOperacionesDisponiblesParaHPT 
  } = useOperacionValidation();

  const operacionesDisponibles = getOperacionesDisponiblesParaHPT();

  const filteredHPTs = hpts.filter(hpt => 
    hpt.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hpt.supervisor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateHPT = () => {
    setShowCreateForm(true);
  };

  const handleHPTComplete = () => {
    setShowCreateForm(false);
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col">
            <Header 
              title="Hojas de Planificación de Tarea (HPT)" 
              subtitle="Gestión de documentos HPT para operaciones de buceo" 
              icon={FileText} 
            />
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner text="Cargando HPTs..." />
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
        <main className="flex-1 flex flex-col">
          <Header 
            title="Hojas de Planificación de Tarea (HPT)" 
            subtitle="Gestión de documentos HPT para operaciones de buceo" 
            icon={FileText} 
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar HPTs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Button 
                onClick={handleCreateHPT}
                disabled={operacionesDisponibles.length === 0}
                className="bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo HPT
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-6 max-w-7xl mx-auto space-y-6">
              {/* Alertas de validación */}
              {operacionesDisponibles.length === 0 && (
                <Card className="border-amber-200 bg-amber-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-amber-600" />
                      <div>
                        <h3 className="font-medium text-amber-800">No hay operaciones disponibles</h3>
                        <p className="text-sm text-amber-600">
                          Todas las operaciones existentes ya tienen HPTs asociados. Crea una nueva operación para poder generar un HPT.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* KPIs mejorados */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {hpts.length}
                    </div>
                    <div className="text-sm text-gray-600">HPTs Totales</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {hpts.filter(h => h.firmado).length}
                    </div>
                    <div className="text-sm text-gray-600">HPTs Firmados</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-amber-600 mb-1">
                      {hpts.filter(h => h.estado === 'borrador').length}
                    </div>
                    <div className="text-sm text-gray-600">En Borrador</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-gray-600 mb-1">
                      {operacionesDisponibles.length}
                    </div>
                    <div className="text-sm text-gray-600">Operaciones Disponibles</div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabla de HPTs */}
              {filteredHPTs.length === 0 ? (
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {hpts.length === 0 ? "No hay HPTs registrados" : "No se encontraron HPTs"}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {hpts.length === 0 
                        ? "Comience creando el primer HPT seleccionando una operación"
                        : "Intenta ajustar la búsqueda"}
                    </p>
                    {operacionesDisponibles.length > 0 && (
                      <Button 
                        onClick={handleCreateHPT}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo HPT
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card className="border-0 shadow-sm bg-white">
                  <Table>
                    <TableHeader>
                      <TableRow className="border-gray-100">
                        <TableHead className="text-gray-600">Código</TableHead>
                        <TableHead className="text-gray-600">Operación</TableHead>
                        <TableHead className="text-gray-600">Supervisor</TableHead>
                        <TableHead className="text-gray-600">Fecha</TableHead>
                        <TableHead className="text-gray-600">Estado</TableHead>
                        <TableHead className="text-gray-600">Progreso</TableHead>
                        <TableHead className="text-right text-gray-600">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHPTs.map((hpt) => {
                        const operacion = operacionesConDocumentos.find(op => op.id === hpt.operacion_id);
                        return (
                          <TableRow key={hpt.id} className="border-gray-50 hover:bg-gray-50/50">
                            <TableCell>
                              <div className="font-medium text-gray-900">{hpt.codigo || hpt.folio}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-600">
                                {operacion ? `${operacion.codigo} - ${operacion.nombre}` : 'Operación no encontrada'}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-900">{hpt.supervisor}</TableCell>
                            <TableCell className="text-gray-600">
                              {hpt.fecha ? new Date(hpt.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={hpt.firmado ? 'default' : 'secondary'} className={hpt.firmado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
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
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${hpt.progreso || 0}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">{hpt.progreso || 0}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="outline" size="sm" className="text-gray-600 border-gray-200">
                                  Ver
                                </Button>
                                {!hpt.firmado && (
                                  <Button variant="outline" size="sm" className="text-gray-600 border-gray-200">
                                    Editar
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
