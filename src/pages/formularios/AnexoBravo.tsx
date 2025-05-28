import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Plus, Search, FileText, AlertTriangle, CheckCircle, Edit, Eye } from "lucide-react";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { AnexoBravoOperationSelector } from "@/components/anexo-bravo/AnexoBravoOperationSelector";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { useOperacionValidation } from "@/hooks/useOperacionValidation";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export default function AnexoBravoPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showOperacionSelector, setShowOperacionSelector] = useState(false);
  const [selectedOperacionData, setSelectedOperacionData] = useState<any>(null);
  
  const { anexosBravo, isLoading, createAnexoBravo } = useAnexoBravo();
  const { 
    operacionesConDocumentos, 
    getOperacionesDisponiblesParaAnexoBravo 
  } = useOperacionValidation();

  const operacionesDisponibles = getOperacionesDisponiblesParaAnexoBravo();

  const filteredAnexos = anexosBravo.filter(anexo => 
    anexo.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    anexo.supervisor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAnexoBravo = () => {
    if (operacionesDisponibles.length === 0) {
      return;
    }
    setShowOperacionSelector(true);
  };

  const handleOperacionSelected = (operacionData: any) => {
    setSelectedOperacionData(operacionData);
    setShowOperacionSelector(false);
    setShowCreateForm(true);
  };

  const handleAnexoBravoComplete = async (data: any) => {
    try {
      await createAnexoBravo({
        ...data,
        operacion_id: selectedOperacionData.id
      });
      setShowCreateForm(false);
      setSelectedOperacionData(null);
    } catch (error) {
      console.error('Error creating anexo bravo:', error);
    }
  };

  const handleCancel = () => {
    setShowCreateForm(false);
    setShowOperacionSelector(false);
    setSelectedOperacionData(null);
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col">
            <Header 
              title="Anexo Bravo" 
              subtitle="Gestión de documentos Anexo Bravo para operaciones de buceo" 
              icon={FileText} 
            />
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner text="Cargando Anexos Bravo..." />
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
          <main className="flex-1 flex flex-col">
            <Header 
              title="Seleccionar Operación" 
              subtitle="Seleccione la operación para crear el Anexo Bravo" 
              icon={FileText} 
            />
            <div className="flex-1 overflow-auto p-6">
              <div className="max-w-4xl mx-auto space-y-6">
                <AnexoBravoOperationSelector
                  onOperacionSelected={handleOperacionSelected}
                />
                <div className="flex justify-end">
                  <Button variant="outline" onClick={handleCancel} className="border-gray-200">
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

  if (showCreateForm) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col">
            <Header 
              title="Nuevo Anexo Bravo" 
              subtitle="Crear nuevo anexo bravo de buceo" 
              icon={FileText} 
            />
            <div className="flex-1 overflow-auto">
              <FullAnexoBravoForm
                onSubmit={handleAnexoBravoComplete}
                onCancel={handleCancel}
                operacionId={selectedOperacionData?.id}
              />
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
            title="Anexo Bravo" 
            subtitle="Gestión de documentos Anexo Bravo para operaciones de buceo" 
            icon={FileText} 
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar Anexos Bravo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Button 
                onClick={handleCreateAnexoBravo}
                disabled={operacionesDisponibles.length === 0}
                className="bg-blue-600 hover:bg-blue-700 shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Anexo Bravo
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
                          Todas las operaciones existentes ya tienen Anexos Bravo asociados. Crea una nueva operación para poder generar un Anexo Bravo.
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )}

              {/* KPIs */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {anexosBravo.length}
                    </div>
                    <div className="text-sm text-gray-600">Anexos Totales</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {anexosBravo.filter(a => a.firmado).length}
                    </div>
                    <div className="text-sm text-gray-600">Anexos Firmados</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-amber-600 mb-1">
                      {anexosBravo.filter(a => a.estado === 'borrador').length}
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

              {/* Tabla de Anexos Bravo */}
              {filteredAnexos.length === 0 ? (
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="text-center py-12">
                    <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {anexosBravo.length === 0 ? "No hay Anexos Bravo registrados" : "No se encontraron Anexos Bravo"}
                    </h3>
                    <p className="text-gray-500 mb-4">
                      {anexosBravo.length === 0 
                        ? "Comience creando el primer Anexo Bravo seleccionando una operación"
                        : "Intenta ajustar la búsqueda"}
                    </p>
                    {operacionesDisponibles.length > 0 && (
                      <Button 
                        onClick={handleCreateAnexoBravo}
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Nuevo Anexo Bravo
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
                        <TableHead className="text-right text-gray-600">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAnexos.map((anexo) => {
                        const operacion = operacionesConDocumentos.find(op => op.id === anexo.operacion_id);
                        return (
                          <TableRow key={anexo.id} className="border-gray-50 hover:bg-gray-50/50">
                            <TableCell>
                              <div className="font-medium text-gray-900">{anexo.codigo}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-600">
                                {operacion ? `${operacion.codigo} - ${operacion.nombre}` : 'Operación no encontrada'}
                              </div>
                            </TableCell>
                            <TableCell className="text-gray-900">{anexo.supervisor}</TableCell>
                            <TableCell className="text-gray-600">
                              {anexo.fecha ? new Date(anexo.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                            </TableCell>
                            <TableCell>
                              <Badge variant={anexo.firmado ? 'default' : 'secondary'} className={anexo.firmado ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}>
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
                                <Button variant="outline" size="sm" className="text-gray-600 border-gray-200">
                                  <Eye className="w-4 h-4" />
                                </Button>
                                {!anexo.firmado && (
                                  <Button variant="outline" size="sm" className="text-gray-600 border-gray-200">
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
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AnexoBravoPage;
