
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
import { Plus, Search, FileText, CheckCircle, Pen } from "lucide-react";
import { HPTWizard } from "@/components/hpt/HPTWizard";
import { HPTOperationSelector } from "@/components/hpt/HPTOperationSelector";
import { useHPT } from "@/hooks/useHPT";
import { useOperaciones } from "@/hooks/useOperaciones";
import { toast } from "@/hooks/use-toast";

const HPTPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOperacionId, setSelectedOperacionId] = useState<string>('');
  const [showOperationSelector, setShowOperationSelector] = useState(false);
  
  const { hpts, isLoading, signHPT } = useHPT();
  const { operaciones } = useOperaciones();

  const filteredHPTs = hpts.filter(hpt => 
    hpt.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hpt.supervisor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateHPT = () => {
    setShowOperationSelector(true);
  };

  const handleOperationSelected = (operacionId: string) => {
    setSelectedOperacionId(operacionId);
    setShowOperationSelector(false);
    setShowCreateForm(true);
  };

  const handleHPTComplete = () => {
    setShowCreateForm(false);
    setSelectedOperacionId('');
    
    toast({
      title: "HPT creado",
      description: "El HPT ha sido creado exitosamente. Ahora puede firmarlo desde la lista.",
    });
  };

  const handleSignHPT = async (hptId: string) => {
    try {
      // Simular firmas de supervisor de servicio y mandante
      const mockSignatures = {
        supervisor_servicio_url: 'firma_supervisor_servicio',
        supervisor_mandante_url: 'firma_supervisor_mandante'
      };
      
      await signHPT({ id: hptId, signatures: mockSignatures });
      
      toast({
        title: "HPT firmado",
        description: "El HPT ha sido firmado exitosamente.",
      });
    } catch (error) {
      console.error('Error signing HPT:', error);
      toast({
        title: "Error",
        description: "No se pudo firmar el HPT.",
        variant: "destructive",
      });
    }
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
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  placeholder="Buscar HPTs..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 ios-input"
                />
              </div>

              <Button 
                onClick={handleCreateHPT}
                className="ios-button bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo HPT
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="ios-card">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {hpts.length}
                    </div>
                    <div className="text-sm text-zinc-500">HPTs Totales</div>
                  </CardContent>
                </Card>
                <Card className="ios-card">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {hpts.filter(h => h.firmado).length}
                    </div>
                    <div className="text-sm text-zinc-500">HPTs Firmados</div>
                  </CardContent>
                </Card>
                <Card className="ios-card">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-yellow-600">
                      {hpts.filter(h => h.estado === 'borrador').length}
                    </div>
                    <div className="text-sm text-zinc-500">En Borrador</div>
                  </CardContent>
                </Card>
                <Card className="ios-card">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-gray-600">
                      {operaciones.filter(op => 
                        !hpts.some(hpt => hpt.operacion_id === op.id)
                      ).length}
                    </div>
                    <div className="text-sm text-zinc-500">Operaciones Disponibles</div>
                  </CardContent>
                </Card>
              </div>

              {/* HPTs List */}
              {filteredHPTs.length === 0 ? (
                <Card className="ios-card text-center py-12">
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
                    <Button 
                      onClick={handleCreateHPT}
                      className="ios-button bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo HPT
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="ios-card">
                  <div className="ios-table-container">
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
                          const operacion = operaciones.find(op => op.id === hpt.operacion_id);
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
                                    'Por Firmar'
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
                                  {!hpt.firmado && (
                                    <Button 
                                      variant="outline" 
                                      size="sm" 
                                      className="ios-button-sm flex items-center gap-1"
                                      onClick={() => handleSignHPT(hpt.id)}
                                    >
                                      <Pen className="w-3 h-3" />
                                      Firmar
                                    </Button>
                                  )}
                                  <Button variant="outline" size="sm" className="ios-button-sm">
                                    Ver
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              )}
            </div>
          </div>

          {/* Operation Selector Dialog */}
          <Dialog open={showOperationSelector} onOpenChange={setShowOperationSelector}>
            <DialogContent className="max-w-4xl">
              <HPTOperationSelector 
                onOperacionSelected={handleOperationSelected}
                selectedOperacionId={selectedOperacionId}
              />
            </DialogContent>
          </Dialog>

          {/* Create Form Modal */}
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
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
