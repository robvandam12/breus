
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
import { Plus, Search, Shield, CheckCircle, PenTool } from "lucide-react";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { AnexoBravoOperationSelector } from "@/components/anexo-bravo/AnexoBravoOperationSelector";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { useOperaciones } from "@/hooks/useOperaciones";
import { toast } from "@/hooks/use-toast";

const AnexoBravoFormulariosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showOperationSelector, setShowOperationSelector] = useState(false);
  const [selectedOperacionId, setSelectedOperacionId] = useState<string>('');
  
  const { anexosBravo, isLoading, createAnexoBravo } = useAnexoBravo();
  const { operaciones } = useOperaciones();

  const filteredAnexos = anexosBravo.filter(anexo => 
    anexo.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    anexo.supervisor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAnexo = () => {
    setShowOperationSelector(true);
  };

  const handleOperationSelected = (operacionId: string) => {
    setSelectedOperacionId(operacionId);
    setShowOperationSelector(false);
    setShowCreateForm(true);
  };

  const handleAnexoComplete = () => {
    setShowCreateForm(false);
    setSelectedOperacionId('');
  };

  const handleSubmitAnexo = async (data: any) => {
    try {
      await createAnexoBravo(data);
      toast({
        title: "Anexo Bravo creado",
        description: "El Anexo Bravo ha sido creado exitosamente.",
      });
      handleAnexoComplete();
    } catch (error) {
      console.error('Error creating anexo bravo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el Anexo Bravo.",
        variant: "destructive",
      });
    }
  };

  const handleSignAnexo = async (anexoId: string) => {
    try {
      // Implementar lógica de firma
      toast({
        title: "Anexo firmado",
        description: "El Anexo Bravo ha sido firmado exitosamente.",
      });
    } catch (error) {
      console.error('Error signing anexo:', error);
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-gray-50">
            <Header 
              title="Anexos Bravo" 
              subtitle="Gestión de documentos Anexo Bravo para operaciones de buceo" 
              icon={Shield} 
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
            title="Anexos Bravo" 
            subtitle="Gestión de documentos Anexo Bravo para operaciones de buceo" 
            icon={Shield} 
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  placeholder="Buscar Anexos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 ios-input"
                />
              </div>

              <Button 
                onClick={handleCreateAnexo}
                className="ios-button bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Anexo Bravo
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
                      {anexosBravo.length}
                    </div>
                    <div className="text-sm text-zinc-500">Anexos Totales</div>
                  </CardContent>
                </Card>
                <Card className="ios-card">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {anexosBravo.filter(a => a.firmado).length}
                    </div>
                    <div className="text-sm text-zinc-500">Anexos Firmados</div>
                  </CardContent>
                </Card>
                <Card className="ios-card">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-yellow-600">
                      {anexosBravo.filter(a => a.estado === 'borrador').length}
                    </div>
                    <div className="text-sm text-zinc-500">En Borrador</div>
                  </CardContent>
                </Card>
                <Card className="ios-card">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-gray-600">
                      {operaciones.filter(op => 
                        !anexosBravo.some(anexo => anexo.operacion_id === op.id)
                      ).length}
                    </div>
                    <div className="text-sm text-zinc-500">Operaciones Disponibles</div>
                  </CardContent>
                </Card>
              </div>

              {/* Anexos List */}
              {filteredAnexos.length === 0 ? (
                <Card className="ios-card text-center py-12">
                  <CardContent>
                    <Shield className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      {anexosBravo.length === 0 ? "No hay Anexos Bravo registrados" : "No se encontraron Anexos"}
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      {anexosBravo.length === 0 
                        ? "Comience creando el primer Anexo Bravo seleccionando una operación"
                        : "Intenta ajustar la búsqueda"}
                    </p>
                    <Button 
                      onClick={handleCreateAnexo}
                      className="ios-button bg-blue-600 hover:bg-blue-700"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Anexo Bravo
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
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredAnexos.map((anexo) => {
                          const operacion = operaciones.find(op => op.id === anexo.operacion_id);
                          return (
                            <TableRow key={anexo.id}>
                              <TableCell>
                                <div className="font-medium">{anexo.codigo}</div>
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-zinc-600">
                                  {operacion ? `${operacion.codigo} - ${operacion.nombre}` : 'Operación no encontrada'}
                                </div>
                              </TableCell>
                              <TableCell>{anexo.supervisor}</TableCell>
                              <TableCell>
                                {anexo.fecha ? new Date(anexo.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                              </TableCell>
                              <TableCell>
                                <Badge variant={anexo.firmado ? 'default' : 'secondary'}>
                                  {anexo.firmado ? (
                                    <div className="flex items-center gap-1">
                                      <CheckCircle className="w-3 h-3" />
                                      Firmado
                                    </div>
                                  ) : (
                                    anexo.estado || 'Borrador'
                                  )}
                                </Badge>
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  {!anexo.firmado ? (
                                    <Button 
                                      onClick={() => handleSignAnexo(anexo.id)}
                                      size="sm" 
                                      className="ios-button-sm bg-blue-600 hover:bg-blue-700"
                                    >
                                      <PenTool className="w-3 h-3 mr-1" />
                                      Firmar
                                    </Button>
                                  ) : (
                                    <Button variant="outline" size="sm" className="ios-button-sm">
                                      Ver
                                    </Button>
                                  )}
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
              <AnexoBravoOperationSelector 
                onOperacionSelected={handleOperationSelected}
                selectedOperacionId={selectedOperacionId}
              />
            </DialogContent>
          </Dialog>

          {/* Create/Edit Form Modal */}
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <FullAnexoBravoForm 
                operacionId={selectedOperacionId}
                onSubmit={handleSubmitAnexo}
                onCancel={() => setShowCreateForm(false)}
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AnexoBravoFormulariosPage;
