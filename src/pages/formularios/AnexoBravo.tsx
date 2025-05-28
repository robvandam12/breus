
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
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { useOperacionValidation } from "@/hooks/useOperacionValidation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EnhancedSelect } from "@/components/ui/enhanced-select";

const AnexoBravoPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOperacionId, setSelectedOperacionId] = useState<string>('');
  
  const { anexosBravo, isLoading, createAnexoBravo } = useAnexoBravo();
  const { 
    operacionesConDocumentos, 
    getOperacionesDisponiblesParaAnexoBravo,
    validarOperacionParaDocumento 
  } = useOperacionValidation();

  const operacionesDisponibles = getOperacionesDisponiblesParaAnexoBravo();

  const filteredAnexos = anexosBravo.filter(anexo => 
    anexo.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    anexo.supervisor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAnexoBravo = () => {
    if (!selectedOperacionId) {
      alert('Debe seleccionar una operación para crear el Anexo Bravo');
      return;
    }
    
    if (!validarOperacionParaDocumento(selectedOperacionId, 'anexo_bravo')) {
      alert('Esta operación ya tiene un Anexo Bravo asociado');
      return;
    }
    
    setShowCreateForm(true);
  };

  const handleAnexoBravoComplete = async (data: any) => {
    try {
      await createAnexoBravo(data);
      setShowCreateForm(false);
      setSelectedOperacionId('');
    } catch (error) {
      console.error('Error creating anexo bravo:', error);
    }
  };

  const handleCancel = () => {
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
              title="Anexo Bravo" 
              subtitle="Gestión de documentos Anexo Bravo para operaciones de buceo" 
              icon={FileText} 
            />
            <div className="flex-1 flex items-center justify-center bg-white">
              <LoadingSpinner text="Cargando Anexos Bravo..." />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (showCreateForm) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-white">
            <Header 
              title="Nuevo Anexo Bravo" 
              subtitle="Crear nuevo anexo bravo de buceo" 
              icon={FileText} 
            />
            <div className="flex-1 overflow-auto bg-white">
              <FullAnexoBravoForm
                onSubmit={handleAnexoBravoComplete}
                onCancel={handleCancel}
                operacionId={selectedOperacionId}
              />
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
            title="Anexo Bravo" 
            subtitle="Gestión de documentos Anexo Bravo para operaciones de buceo" 
            icon={FileText} 
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  placeholder="Buscar Anexos Bravo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <div className="flex items-center gap-2">
                <EnhancedSelect
                  options={operacionesDisponibles.map(op => ({
                    value: op.id,
                    label: `${op.codigo} - ${op.nombre}`
                  }))}
                  value={selectedOperacionId}
                  onValueChange={setSelectedOperacionId}
                  placeholder="Seleccionar operación"
                  className="w-64"
                />
                
                <Button 
                  onClick={handleCreateAnexoBravo}
                  disabled={!selectedOperacionId}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Nuevo Anexo Bravo
                </Button>
              </div>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* Alertas de validación */}
              {operacionesDisponibles.length === 0 && (
                <Card className="mb-6 border-orange-200 bg-orange-50">
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <AlertTriangle className="w-5 h-5 text-orange-600" />
                      <div>
                        <h3 className="font-medium text-orange-800">No hay operaciones disponibles</h3>
                        <p className="text-sm text-orange-600">
                          Todas las operaciones existentes ya tienen Anexos Bravo asociados. Crea una nueva operación para poder generar un Anexo Bravo.
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
                    {anexosBravo.length}
                  </div>
                  <div className="text-sm text-zinc-500">Anexos Totales</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {anexosBravo.filter(a => a.firmado).length}
                  </div>
                  <div className="text-sm text-zinc-500">Anexos Firmados</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {anexosBravo.filter(a => a.estado === 'borrador').length}
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

              {filteredAnexos.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      {anexosBravo.length === 0 ? "No hay Anexos Bravo registrados" : "No se encontraron Anexos Bravo"}
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      {anexosBravo.length === 0 
                        ? "Comience creando el primer Anexo Bravo seleccionando una operación"
                        : "Intenta ajustar la búsqueda"}
                    </p>
                    {operacionesDisponibles.length > 0 && (
                      <div className="flex items-center justify-center gap-2">
                        <EnhancedSelect
                          options={operacionesDisponibles.map(op => ({
                            value: op.id,
                            label: `${op.codigo} - ${op.nombre}`
                          }))}
                          value={selectedOperacionId}
                          onValueChange={setSelectedOperacionId}
                          placeholder="Seleccionar operación"
                          className="w-64"
                        />
                        <Button 
                          onClick={handleCreateAnexoBravo} 
                          disabled={!selectedOperacionId}
                          className="bg-blue-600 hover:bg-blue-700"
                        >
                          <Plus className="w-4 h-4 mr-2" />
                          Nuevo Anexo Bravo
                        </Button>
                      </div>
                    )}
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
                      {filteredAnexos.map((anexo) => {
                        const operacion = operacionesConDocumentos.find(op => op.id === anexo.operacion_id);
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
                            <TableCell>
                              <div className="flex items-center gap-2">
                                <div className="w-16 bg-gray-200 rounded-full h-2">
                                  <div 
                                    className="bg-blue-600 h-2 rounded-full transition-all"
                                    style={{ width: `${anexo.progreso || 0}%` }}
                                  />
                                </div>
                                <span className="text-xs text-gray-500">{anexo.progreso || 0}%</span>
                              </div>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-1">
                                <Button variant="outline" size="sm">
                                  Ver
                                </Button>
                                {!anexo.firmado && (
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
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AnexoBravoPage;
