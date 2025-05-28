import React, { useState, useEffect } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, Plus, Users, AlertTriangle, CheckCircle, Edit, Trash2, Info } from "lucide-react";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useSitios } from "@/hooks/useSitios";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { CreateSitioForm } from "@/components/sitios/CreateSitioForm";
import { EditSitioForm } from "@/components/sitios/EditSitioForm";
import { PersonnelManager } from "@/components/shared/PersonnelManager";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export default function SalmoneraAdmin() {
  const [activeTab, setActiveTab] = useState("overview");
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateSitio, setShowCreateSitio] = useState(false);
  const [editingSitio, setEditingSitio] = useState<any>(null);
  const { profile } = useAuth();

  const {
    salmoneras,
    isLoading: isLoadingSalmoneras,
    createSalmonera,
    updateSalmonera,
    deleteSalmonera,
    addPersonalToSalmonera,
    removePersonalFromSalmonera,
    inviteUserToSalmonera
  } = useSalmoneras();

  const {
    sitios,
    isLoading: isLoadingSitios,
    createSitio,
    updateSitio,
    deleteSitio
  } = useSitios();

  const salmonera = salmoneras.find(s => s.id === profile?.salmonera_id);
  const sitiosSalmonera = sitios.filter(sitio => sitio.salmonera_id === profile?.salmonera_id);
  const personalSalmonera = salmonera?.personal || [];

  const filteredSitios = sitiosSalmonera.filter(sitio =>
    sitio.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    sitio.ubicacion.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSitio = async (data: any) => {
    try {
      await createSitio({ ...data, salmonera_id: profile?.salmonera_id });
      setShowCreateSitio(false);
      toast({
        title: "Sitio creado",
        description: "El sitio ha sido creado exitosamente.",
      });
    } catch (error) {
      console.error('Error creating sitio:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el sitio.",
        variant: "destructive",
      });
    }
  };

  const handleEditSitio = async (data: any) => {
    if (!editingSitio) return;
    try {
      await updateSitio({ id: editingSitio.id, data });
      setEditingSitio(null);
      toast({
        title: "Sitio actualizado",
        description: "El sitio ha sido actualizado exitosamente.",
      });
    } catch (error) {
      console.error('Error updating sitio:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el sitio.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteSitio = async (sitioId: string) => {
    try {
      await deleteSitio(sitioId);
      toast({
        title: "Sitio eliminado",
        description: "El sitio ha sido eliminado exitosamente.",
      });
    } catch (error) {
      console.error('Error deleting sitio:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el sitio.",
        variant: "destructive",
      });
    }
  };

  const handleAddPersonal = async (memberData: any) => {
    if (!salmonera) return;
    try {
      await addPersonalToSalmonera(salmonera.id, memberData);
      toast({
        title: "Personal agregado",
        description: "El personal ha sido agregado exitosamente a la salmonera.",
      });
    } catch (error) {
      console.error('Error adding personal:', error);
      toast({
        title: "Error",
        description: "No se pudo agregar el personal.",
        variant: "destructive",
      });
    }
  };

  const handleRemovePersonal = async (memberId: string) => {
    if (!salmonera) return;
    try {
      await removePersonalFromSalmonera(salmonera.id, memberId);
      toast({
        title: "Personal removido",
        description: "El personal ha sido removido exitosamente de la salmonera.",
      });
    } catch (error) {
      console.error('Error removing personal:', error);
      toast({
        title: "Error",
        description: "No se pudo remover el personal.",
        variant: "destructive",
      });
    }
  };

  const handleInviteUser = async (userData: any) => {
    if (!salmonera) return;
    try {
      await inviteUserToSalmonera(salmonera.id, userData);
      toast({
        title: "Invitación enviada",
        description: "La invitación ha sido enviada exitosamente al usuario.",
      });
    } catch (error) {
      console.error('Error inviting user:', error);
      toast({
        title: "Error",
        description: "No se pudo enviar la invitación.",
        variant: "destructive",
      });
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Administración de Salmonera" 
            subtitle="Gestión de operaciones, sitios y personal" 
            icon={Building} 
          />
          
          <div className="flex-1 overflow-auto">
            <div className="p-6 max-w-7xl mx-auto space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {sitiosSalmonera.length}
                    </div>
                    <div className="text-sm text-gray-600">Sitios</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600 mb-1">
                      {personalSalmonera.length}
                    </div>
                    <div className="text-sm text-gray-600">Personal Asignado</div>
                  </CardContent>
                </Card>
                <Card className="border-0 shadow-sm bg-white">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-yellow-600 mb-1">
                      {/* Add dynamic value here */}
                      0
                    </div>
                    <div className="text-sm text-gray-600">Operaciones Activas</div>
                  </CardContent>
                </Card>
              </div>

              {/* Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab}>
                <TabsList className="grid w-full grid-cols-4 max-w-lg">
                  <TabsTrigger value="overview">Resumen</TabsTrigger>
                  <TabsTrigger value="sitios">Sitios</TabsTrigger>
                  <TabsTrigger value="personal">Gestión de Personal</TabsTrigger>
                  <TabsTrigger value="operaciones">Operaciones</TabsTrigger>
                </TabsList>

                <TabsContent value="overview" className="space-y-6">
                  <Card className="border-0 shadow-sm bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-blue-600" />
                        Información de la Salmonera
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {salmonera ? (
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-gray-700">Nombre:</p>
                          <p className="text-gray-900">{salmonera.nombre}</p>
                          <p className="text-sm font-medium text-gray-700">RUT:</p>
                          <p className="text-gray-900">{salmonera.rut}</p>
                          <p className="text-sm font-medium text-gray-700">Descripción:</p>
                          <p className="text-gray-900">{salmonera.descripcion || 'Sin descripción'}</p>
                        </div>
                      ) : (
                        <Alert className="border-amber-200 bg-amber-50">
                          <Info className="h-4 w-4" />
                          <AlertDescription className="text-amber-800">
                            No se ha asignado una salmonera a este perfil. Contacte al administrador.
                          </AlertDescription>
                        </Alert>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sitios" className="space-y-6">
                  <Card className="border-0 shadow-sm bg-white">
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                          <MapPin className="w-5 h-5 text-blue-600" />
                          Sitios de la Salmonera
                        </CardTitle>
                        <Button onClick={() => setShowCreateSitio(true)} className="bg-blue-600 hover:bg-blue-700">
                          <Plus className="w-4 h-4 mr-2" />
                          Nuevo Sitio
                        </Button>
                      </div>
                      <Input
                        type="search"
                        placeholder="Buscar sitios..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="max-w-sm mt-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                      />
                    </CardHeader>
                    <CardContent>
                      {filteredSitios.length === 0 ? (
                        <div className="text-center py-8">
                          <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                          <p className="text-gray-500">No hay sitios registrados</p>
                        </div>
                      ) : (
                        <Table>
                          <TableHeader>
                            <TableRow>
                              <TableHead>Nombre</TableHead>
                              <TableHead>Ubicación</TableHead>
                              <TableHead className="text-right">Acciones</TableHead>
                            </TableRow>
                          </TableHeader>
                          <TableBody>
                            {filteredSitios.map((sitio) => (
                              <TableRow key={sitio.id}>
                                <TableCell>{sitio.nombre}</TableCell>
                                <TableCell>{sitio.ubicacion}</TableCell>
                                <TableCell className="text-right">
                                  <div className="flex justify-end gap-2">
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => setEditingSitio(sitio)}
                                      className="text-gray-600 border-gray-200"
                                    >
                                      <Edit className="w-4 h-4" />
                                    </Button>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() => handleDeleteSitio(sitio.id)}
                                      className="text-red-600 border-red-200 hover:bg-red-50"
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </Button>
                                  </div>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      )}
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="personal" className="space-y-6">
                  <Card className="border-0 shadow-sm bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Users className="w-5 h-5 text-blue-600" />
                        Gestión de Personal
                      </CardTitle>
                      <p className="text-sm text-gray-600">
                        Administre el personal asignado a su salmonera. Puede buscar usuarios existentes o invitar nuevos miembros.
                      </p>
                    </CardHeader>
                    <CardContent>
                      <PersonnelManager
                        title="Personal de la Salmonera"
                        description="Busque personal existente por nombre o email. Si no encuentra al usuario, puede enviarlo una invitación completando su email."
                        currentMembers={personalSalmonera}
                        availableRoles={[
                          { value: 'supervisor', label: 'Supervisor' },
                          { value: 'jefe_operaciones', label: 'Jefe de Operaciones' },
                          { value: 'coordinador', label: 'Coordinador' },
                          { value: 'apoyo', label: 'Personal de Apoyo' }
                        ]}
                        onAddMember={handleAddPersonal}
                        onRemoveMember={handleRemovePersonal}
                        onInviteUser={handleInviteUser}
                        showInviteOption={true}
                        memberDisplayName={(member) => `${member.nombre} ${member.apellido}`}
                        memberDisplayRole={(member) => member.rol}
                      />
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="operaciones" className="space-y-6">
                  <Card className="border-0 shadow-sm bg-white">
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Building className="w-5 h-5 text-blue-600" />
                        Operaciones de la Salmonera
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-gray-500">
                        Aquí se mostrarán las operaciones asociadas a esta salmonera.
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>

      {/* Dialogs */}
      <Dialog open={showCreateSitio} onOpenChange={() => setShowCreateSitio(false)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Sitio</DialogTitle>
          </DialogHeader>
          <CreateSitioForm onSubmit={handleCreateSitio} onCancel={() => setShowCreateSitio(false)} />
        </DialogContent>
      </Dialog>

      <Dialog open={!!editingSitio} onOpenChange={() => setEditingSitio(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Sitio</DialogTitle>
          </DialogHeader>
          {editingSitio && (
            <EditSitioForm
              sitio={editingSitio}
              onSubmit={handleEditSitio}
              onCancel={() => setEditingSitio(null)}
            />
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
}
