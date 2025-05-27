
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Anchor, FileText, User, Users } from "lucide-react";
import { InmersionWizard } from "@/components/inmersion/InmersionWizard";
import { ImmersionTableRow } from "@/components/inmersiones/ImmersionTableRow";
import { CreateBitacoraBuzoFormEnhanced } from "@/components/bitacoras/CreateBitacoraBuzoFormEnhanced";
import { CreateBitacoraSupervisorForm } from "@/components/bitacoras/CreateBitacoraSupervisorForm";
import { useInmersiones } from "@/hooks/useInmersiones";
import { useBitacoras } from "@/hooks/useBitacoras";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const InmersionesPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showCreateBitacoraBuzo, setShowCreateBitacoraBuzo] = useState(false);
  const [showCreateBitacoraSupervisor, setShowCreateBitacoraSupervisor] = useState(false);
  const [selectedInmersionId, setSelectedInmersionId] = useState<string>('');
  
  const { inmersiones, isLoading, createInmersion } = useInmersiones();
  const { bitacorasBuzo, bitacorasSupervisor, createBitacoraBuzo, createBitacoraSupervisor } = useBitacoras();

  const filteredInmersiones = inmersiones.filter(inmersion => 
    inmersion.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inmersion.buzo_principal?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    inmersion.supervisor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateInmersion = async (data: any) => {
    try {
      await createInmersion(data);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating inmersion:', error);
    }
  };

  const handleCreateBitacoraBuzo = async (data: any) => {
    try {
      await createBitacoraBuzo(data);
      setShowCreateBitacoraBuzo(false);
      setSelectedInmersionId('');
    } catch (error) {
      console.error('Error creating bitacora buzo:', error);
    }
  };

  const handleCreateBitacoraSupervisor = async (data: any) => {
    try {
      await createBitacoraSupervisor(data);
      setShowCreateBitacoraSupervisor(false);
      setSelectedInmersionId('');
    } catch (error) {
      console.error('Error creating bitacora supervisor:', error);
    }
  };

  const getInmersionBitacoras = (inmersionId: string) => {
    const bitacorasBuzoInmersion = bitacorasBuzo.filter(b => b.inmersion_id === inmersionId);
    const bitacorasSupervisorInmersion = bitacorasSupervisor.filter(b => b.inmersion_id === inmersionId);
    
    return {
      buzo: bitacorasBuzoInmersion,
      supervisor: bitacorasSupervisorInmersion
    };
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-white">
            <Header 
              title="Inmersiones" 
              subtitle="Gestión de inmersiones y bitácoras asociadas" 
              icon={Anchor} 
            />
            <div className="flex-1 flex items-center justify-center bg-white">
              <LoadingSpinner text="Cargando inmersiones..." />
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
            title="Inmersiones" 
            subtitle="Gestión de inmersiones y bitácoras asociadas" 
            icon={Anchor} 
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  placeholder="Buscar inmersiones..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Inmersión
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {inmersiones.length}
                  </div>
                  <div className="text-sm text-zinc-500">Inmersiones Totales</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {inmersiones.filter(i => i.estado === 'completada').length}
                  </div>
                  <div className="text-sm text-zinc-500">Completadas</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {bitacorasBuzo.length}
                  </div>
                  <div className="text-sm text-zinc-500">Bitácoras Buzo</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-purple-600">
                    {bitacorasSupervisor.length}
                  </div>
                  <div className="text-sm text-zinc-500">Bitácoras Supervisor</div>
                </Card>
              </div>

              {filteredInmersiones.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Anchor className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      {inmersiones.length === 0 ? "No hay inmersiones registradas" : "No se encontraron inmersiones"}
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      {inmersiones.length === 0 
                        ? "Comience creando la primera inmersión"
                        : "Intenta ajustar la búsqueda"}
                    </p>
                    {inmersiones.length === 0 && (
                      <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Nueva Inmersión
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredInmersiones.map((inmersion) => {
                    const bitacoras = getInmersionBitacoras(inmersion.inmersion_id);
                    
                    return (
                      <Card key={inmersion.inmersion_id} className="overflow-hidden">
                        <CardHeader className="bg-gradient-to-r from-blue-50 to-teal-50">
                          <div className="flex items-center justify-between">
                            <CardTitle className="flex items-center gap-2">
                              <Anchor className="w-5 h-5 text-blue-600" />
                              {inmersion.codigo}
                              <Badge variant={inmersion.estado === 'completada' ? 'default' : 'secondary'}>
                                {inmersion.estado}
                              </Badge>
                            </CardTitle>
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedInmersionId(inmersion.inmersion_id);
                                  setShowCreateBitacoraBuzo(true);
                                }}
                              >
                                <User className="w-4 h-4 mr-1" />
                                Bitácora Buzo
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => {
                                  setSelectedInmersionId(inmersion.inmersion_id);
                                  setShowCreateBitacoraSupervisor(true);
                                }}
                              >
                                <Users className="w-4 h-4 mr-1" />
                                Bitácora Supervisor
                              </Button>
                            </div>
                          </div>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                            <div>
                              <span className="text-zinc-500">Fecha:</span>
                              <div className="font-medium">
                                {new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}
                              </div>
                            </div>
                            <div>
                              <span className="text-zinc-500">Buzo Principal:</span>
                              <div className="font-medium">{inmersion.buzo_principal}</div>
                            </div>
                            <div>
                              <span className="text-zinc-500">Supervisor:</span>
                              <div className="font-medium">{inmersion.supervisor}</div>
                            </div>
                            <div>
                              <span className="text-zinc-500">Profundidad Máx:</span>
                              <div className="font-medium">{inmersion.profundidad_max}m</div>
                            </div>
                          </div>
                        </CardHeader>
                        
                        <CardContent className="p-6">
                          <Tabs defaultValue="bitacoras" className="w-full">
                            <TabsList className="grid w-full grid-cols-2">
                              <TabsTrigger value="bitacoras">
                                Bitácoras ({bitacoras.buzo.length + bitacoras.supervisor.length})
                              </TabsTrigger>
                              <TabsTrigger value="detalles">Detalles de Inmersión</TabsTrigger>
                            </TabsList>
                            
                            <TabsContent value="bitacoras" className="space-y-4">
                              {bitacoras.buzo.length === 0 && bitacoras.supervisor.length === 0 ? (
                                <div className="text-center py-8 text-zinc-500">
                                  <FileText className="w-8 h-8 mx-auto mb-2 text-zinc-300" />
                                  No hay bitácoras registradas para esta inmersión
                                </div>
                              ) : (
                                <div className="space-y-4">
                                  {bitacoras.buzo.length > 0 && (
                                    <div>
                                      <h4 className="font-medium text-sm text-zinc-700 mb-2">
                                        Bitácoras de Buzo ({bitacoras.buzo.length})
                                      </h4>
                                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        {bitacoras.buzo.map((bitacora) => (
                                          <div key={bitacora.bitacora_id} className="flex items-center justify-between">
                                            <div>
                                              <span className="font-medium">{bitacora.codigo}</span>
                                              <span className="text-sm text-zinc-500 ml-2">
                                                por {bitacora.buzo}
                                              </span>
                                            </div>
                                            <Badge variant={bitacora.firmado ? 'default' : 'secondary'}>
                                              {bitacora.firmado ? 'Firmada' : 'Sin firmar'}
                                            </Badge>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                  
                                  {bitacoras.supervisor.length > 0 && (
                                    <div>
                                      <h4 className="font-medium text-sm text-zinc-700 mb-2">
                                        Bitácoras de Supervisor ({bitacoras.supervisor.length})
                                      </h4>
                                      <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                                        {bitacoras.supervisor.map((bitacora) => (
                                          <div key={bitacora.bitacora_id} className="flex items-center justify-between">
                                            <div>
                                              <span className="font-medium">{bitacora.codigo}</span>
                                              <span className="text-sm text-zinc-500 ml-2">
                                                por {bitacora.supervisor}
                                              </span>
                                            </div>
                                            <Badge variant={bitacora.firmado ? 'default' : 'secondary'}>
                                              {bitacora.firmado ? 'Firmada' : 'Sin firmar'}
                                            </Badge>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                  )}
                                </div>
                              )}
                            </TabsContent>
                            
                            <TabsContent value="detalles" className="space-y-4">
                              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                <div>
                                  <span className="text-sm text-zinc-500">Objetivo:</span>
                                  <div className="font-medium">{inmersion.objetivo}</div>
                                </div>
                                <div>
                                  <span className="text-sm text-zinc-500">Temperatura:</span>
                                  <div className="font-medium">{inmersion.temperatura_agua}°C</div>
                                </div>
                                <div>
                                  <span className="text-sm text-zinc-500">Visibilidad:</span>
                                  <div className="font-medium">{inmersion.visibilidad}m</div>
                                </div>
                                <div>
                                  <span className="text-sm text-zinc-500">Corriente:</span>
                                  <div className="font-medium">{inmersion.corriente}</div>
                                </div>
                                <div>
                                  <span className="text-sm text-zinc-500">Hora Inicio:</span>
                                  <div className="font-medium">{inmersion.hora_inicio}</div>
                                </div>
                                <div>
                                  <span className="text-sm text-zinc-500">Hora Fin:</span>
                                  <div className="font-medium">{inmersion.hora_fin || 'N/A'}</div>
                                </div>
                              </div>
                              
                              {inmersion.observaciones && (
                                <div>
                                  <span className="text-sm text-zinc-500">Observaciones:</span>
                                  <div className="mt-1 p-3 bg-gray-50 rounded-lg">
                                    {inmersion.observaciones}
                                  </div>
                                </div>
                              )}
                            </TabsContent>
                          </Tabs>
                        </CardContent>
                      </Card>
                    );
                  })}
                </div>
              )}
            </div>
          </div>

          {/* Modal para crear inmersión */}
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              <InmersionWizard 
                onComplete={handleCreateInmersion}
                onCancel={() => setShowCreateForm(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Modal para crear bitácora de buzo */}
          <Dialog open={showCreateBitacoraBuzo} onOpenChange={setShowCreateBitacoraBuzo}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
              <CreateBitacoraBuzoFormEnhanced
                inmersionId={selectedInmersionId}
                onSubmit={handleCreateBitacoraBuzo}
                onCancel={() => setShowCreateBitacoraBuzo(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Modal para crear bitácora de supervisor */}
          <Dialog open={showCreateBitacoraSupervisor} onOpenChange={setShowCreateBitacoraSupervisor}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <CreateBitacoraSupervisorForm
                inmersionId={selectedInmersionId}
                onSubmit={handleCreateBitacoraSupervisor}
                onCancel={() => setShowCreateBitacoraSupervisor(false)}
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default InmersionesPage;
