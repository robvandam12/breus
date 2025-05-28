
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
import { HPTWizardComplete } from "@/components/hpt/HPTWizardComplete";
import { HPTOperationSelector } from "@/components/hpt/HPTOperationSelector";
import { useHPT } from "@/hooks/useHPT";
import { useOperacionValidation } from "@/hooks/useOperacionValidation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const HPTPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
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
    if (!selectedOperacionId) {
      alert('Debe seleccionar una operación para crear el HPT');
      return;
    }
    
    if (!validarOperacionParaDocumento(selectedOperacionId, 'hpt')) {
      alert('Esta operación ya tiene un HPT asociado');
      return;
    }
    
    setShowCreateForm(true);
  };

  const handleHPTComplete = () => {
    setShowCreateForm(false);
    setSelectedOperacionId('');
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-white">
            <Header 
              title="Hojas de Planificación de Tarea (HPT)" 
              subtitle="Gestión de documentos HPT para operaciones de buceo" 
              icon={FileText} 
            />
            <div className="flex-1 flex items-center justify-center bg-white">
              <LoadingSpinner text="Cargando HPTs..." />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-white">
          <Header 
            title="Hojas de Planificación de Tarea (HPT)" 
            subtitle="Gestión de documentos HPT para operaciones de buceo" 
            icon={FileText} 
          >
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="Buscar HPTs..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 w-64"
              />
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* Selector de Operación */}
              <HPTOperationSelector
                selectedOperacionId={selectedOperacionId}
                onSelectOperacion={setSelectedOperacionId}
                onCreateHPT={handleCreateHPT}
              />

              {/* Alertas de validación */}
              {operacionesDisponibles.length === 0 && (
                <Card className="mb-6 border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <div>
                        <h3 className="font-medium text-orange-800">No hay operaciones disponibles</h3>
                        <p className="text-sm text-orange-600">
                          Todas las operaciones existentes ya tienen HPTs asociados. Crea una nueva operación para poder generar un HPT.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {hpts.length}
                  </div>
                  <div className="text-sm text-zinc-500">HPTs Totales</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {hpts.filter(h => h.firmado).length}
                  </div>
                  <div className="text-sm text-zinc-500">HPTs Firmados</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {hpts.filter(h => h.estado === 'borrador').length}
                  </div>
                  <div className="text-sm text-zinc-500">En Borrador</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-gray-600">
                    {operacionesDisponibles.length}
                  </div>
                  <div className="text-sm text-zinc-500">Operaciones Disponibles</div>
                </Card>
              </div>

              {filteredHPTs.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      {hpts.length === 0 ? "No hay HPTs registrados" : "No se encontraron HPTs"}
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      {hpts.length === 0 
                        ? "Comience creando el primer HPT seleccionando una operación"
                        : "Intenta ajustar la búsqueda"}
                    </p>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Operación</TableHead>
                        <TableHead>Supervisor</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead>Progreso</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredHPTs.map((hpt) => {
                        const operacion = operacionesConDocumentos.find(op => op.id === hpt.operacion_id);
                        return (
                          <TableRow key={hpt.id}>
                            <TableCell>
                              <div className="font-medium">{hpt.codigo || hpt.folio}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-zinc-600">
                                {operacion ? `${operacion.codigo} - ${operacion.nombre}` : 'Operación no encontrada'}
                              </div>
                            </TableCell>
                            <TableCell>{hpt.supervisor}</TableCell>
                            <TableCell>
                              {hpt.fecha ? new Date(hpt.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={hpt.firmado ? 'default' : 'secondary'}>
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
                                <Button variant="outline" size="sm">
                                  Ver
                                </Button>
                                {!hpt.firmado && (
                                  <Button variant="outline" size="sm">
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
              <HPTWizardComplete 
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
