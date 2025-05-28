
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, Search, Building, Users, Edit, Eye, MapPin } from "lucide-react";
import { PersonnelManager } from "@/components/shared/PersonnelManager";
import { CreateSalmoneraForm } from "@/components/admin/CreateSalmoneraForm";
import { EditSalmoneraForm } from "@/components/admin/EditSalmoneraForm";
import { SalmoneraStats } from "@/components/admin/SalmoneraStats";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const SalmoneraPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingSalmonera, setEditingSalmonera] = useState<any>(null);
  const [selectedSalmonera, setSelectedSalmonera] = useState<any>(null);
  const [activeTab, setActiveTab] = useState("general");
  
  const { 
    salmoneras, 
    isLoading, 
    createSalmonera, 
    updateSalmonera, 
    deleteSalmonera 
  } = useSalmoneras();

  const filteredSalmoneras = salmoneras.filter(salmonera => 
    salmonera.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    salmonera.rut.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSalmonera = async (data: any) => {
    try {
      await createSalmonera(data);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating salmonera:', error);
    }
  };

  const handleUpdateSalmonera = async (data: any) => {
    try {
      if (editingSalmonera) {
        await updateSalmonera({ id: editingSalmonera.id, data });
        setEditingSalmonera(null);
      }
    } catch (error) {
      console.error('Error updating salmonera:', error);
    }
  };

  const handleAddPersonal = (member: any) => {
    console.log('Adding personal to salmonera:', member);
  };

  const handleRemovePersonal = (memberId: string) => {
    console.log('Removing personal from salmonera:', memberId);
  };

  const handleInviteUser = (inviteData: any) => {
    console.log('Inviting user to salmonera:', inviteData);
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-gray-50">
            <Header title="Salmoneras" subtitle="Gestión de empresas salmoneras" icon={Building} />
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <LoadingSpinner text="Cargando salmoneras..." />
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
            title="Salmoneras" 
            subtitle="Gestión de empresas salmoneras y su personal" 
            icon={Building}
          >
            <div className="flex items-center gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar salmoneras..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-72 bg-white border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <Button 
                onClick={() => setShowCreateForm(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl shadow-sm"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Salmonera
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto bg-gray-50">
            <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
              {/* Estadísticas */}
              <SalmoneraStats salmoneras={salmoneras} />

              {selectedSalmonera ? (
                <div className="space-y-6">
                  {/* Header de detalle */}
                  <Card className="bg-white shadow-sm rounded-xl border-gray-200">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-4">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Building className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <h2 className="text-xl font-bold text-gray-900">{selectedSalmonera.nombre}</h2>
                            <div className="flex items-center gap-4 mt-1 text-sm text-gray-600">
                              <span>RUT: {selectedSalmonera.rut}</span>
                              <span>📧 {selectedSalmonera.email}</span>
                              <span>📍 {selectedSalmonera.direccion}</span>
                              <Badge className="bg-green-100 text-green-700 border-green-200">
                                {selectedSalmonera.estado}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <Button
                            variant="outline"
                            onClick={() => setEditingSalmonera(selectedSalmonera)}
                            className="border-gray-200 hover:bg-gray-50"
                          >
                            <Edit className="w-4 h-4 mr-2" />
                            Editar
                          </Button>
                          <Button
                            variant="outline"
                            onClick={() => setSelectedSalmonera(null)}
                            className="border-gray-200 hover:bg-gray-50"
                          >
                            Volver
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Tabs de detalle */}
                  <Tabs value={activeTab} onValueChange={setActiveTab}>
                    <TabsList className="grid w-full grid-cols-3 bg-white rounded-xl border border-gray-200">
                      <TabsTrigger value="general" className="rounded-lg">Información General</TabsTrigger>
                      <TabsTrigger value="personal" className="rounded-lg">Equipo de Trabajo</TabsTrigger>
                      <TabsTrigger value="sitios" className="rounded-lg">Sitios</TabsTrigger>
                    </TabsList>

                    <TabsContent value="general" className="space-y-4">
                      <Card className="bg-white shadow-sm rounded-xl border-gray-200">
                        <CardContent className="p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4">Detalles de la Salmonera</h3>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <p className="text-sm font-medium text-gray-700">Nombre</p>
                              <p className="text-gray-900">{selectedSalmonera.nombre}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">RUT</p>
                              <p className="text-gray-900">{selectedSalmonera.rut}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Email</p>
                              <p className="text-gray-900">{selectedSalmonera.email}</p>
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-700">Teléfono</p>
                              <p className="text-gray-900">{selectedSalmonera.telefono}</p>
                            </div>
                            <div className="md:col-span-2">
                              <p className="text-sm font-medium text-gray-700">Dirección</p>
                              <p className="text-gray-900">{selectedSalmonera.direccion}</p>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>

                    <TabsContent value="personal" className="space-y-4">
                      <PersonnelManager
                        title="Equipo de Trabajo"
                        description="Gestione el personal asociado a esta salmonera. Puede buscar usuarios existentes o invitar nuevos miembros al equipo."
                        currentMembers={[]} // Aquí irían los miembros reales
                        onAddMember={handleAddPersonal}
                        onRemoveMember={handleRemovePersonal}
                        onInviteUser={handleInviteUser}
                        memberRoleField="rol"
                        searchPlaceholder="Buscar por nombre, email o RUT..."
                      />
                    </TabsContent>

                    <TabsContent value="sitios" className="space-y-4">
                      <Card className="bg-white shadow-sm rounded-xl border-gray-200">
                        <CardContent className="p-6">
                          <div className="text-center py-8">
                            <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 mb-2">
                              Sitios activos: {selectedSalmonera.sitios_activos || 0}
                            </p>
                            <p className="text-sm text-gray-400">
                              La gestión de sitios se encuentra en el módulo de sitios
                            </p>
                          </div>
                        </CardContent>
                      </Card>
                    </TabsContent>
                  </Tabs>
                </div>
              ) : (
                /* Lista de salmoneras */
                filteredSalmoneras.length === 0 ? (
                  <Card className="text-center py-16 bg-white shadow-sm rounded-xl border-gray-200">
                    <CardContent>
                      <Building className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        {salmoneras.length === 0 ? "No hay salmoneras registradas" : "No se encontraron resultados"}
                      </h3>
                      <p className="text-gray-500 mb-6">
                        {salmoneras.length === 0 
                          ? "Comience agregando la primera empresa salmonera"
                          : "Intenta ajustar los filtros de búsqueda"}
                      </p>
                      <Button 
                        onClick={() => setShowCreateForm(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-xl"
                      >
                        <Plus className="w-4 h-4 mr-2" />
                        Nueva Salmonera
                      </Button>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="bg-white shadow-sm rounded-xl border-gray-200 overflow-hidden">
                    <Table>
                      <TableHeader>
                        <TableRow className="bg-gray-50 border-gray-200">
                          <TableHead className="font-semibold text-gray-700">Empresa</TableHead>
                          <TableHead className="font-semibold text-gray-700">RUT</TableHead>
                          <TableHead className="font-semibold text-gray-700">Contacto</TableHead>
                          <TableHead className="font-semibold text-gray-700">Sitios</TableHead>
                          <TableHead className="font-semibold text-gray-700">Estado</TableHead>
                          <TableHead className="text-right font-semibold text-gray-700">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredSalmoneras.map((salmonera) => (
                          <TableRow key={salmonera.id} className="border-gray-100 hover:bg-gray-50">
                            <TableCell>
                              <div>
                                <div className="font-semibold text-gray-900">{salmonera.nombre}</div>
                                <div className="text-sm text-gray-600">{salmonera.direccion}</div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-900">{salmonera.rut}</div>
                            </TableCell>
                            <TableCell>
                              <div className="text-sm text-gray-900">{salmonera.email}</div>
                              <div className="text-sm text-gray-600">{salmonera.telefono}</div>
                            </TableCell>
                            <TableCell>
                              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                                {salmonera.sitios_activos || 0} sitios
                              </Badge>
                            </TableCell>
                            <TableCell>
                              <Badge 
                                variant="outline"
                                className={salmonera.estado === 'activa' 
                                  ? 'bg-green-50 text-green-700 border-green-200' 
                                  : 'bg-gray-50 text-gray-700 border-gray-200'
                                }
                              >
                                {salmonera.estado}
                              </Badge>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => setSelectedSalmonera(salmonera)}
                                >
                                  <Eye className="w-4 h-4" />
                                </Button>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="h-8 w-8 p-0"
                                  onClick={() => setEditingSalmonera(salmonera)}
                                >
                                  <Edit className="w-4 h-4" />
                                </Button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </Card>
                )
              )}
            </div>
          </div>

          {/* Dialogs */}
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Nueva Salmonera</DialogTitle>
              </DialogHeader>
              <CreateSalmoneraForm
                onSubmit={handleCreateSalmonera}
                onCancel={() => setShowCreateForm(false)}
              />
            </DialogContent>
          </Dialog>

          <Dialog open={!!editingSalmonera} onOpenChange={() => setEditingSalmonera(null)}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Salmonera</DialogTitle>
              </DialogHeader>
              <EditSalmoneraForm
                salmonera={editingSalmonera}
                onSubmit={handleUpdateSalmonera}
                onCancel={() => setEditingSalmonera(null)}
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default SalmoneraPage;
