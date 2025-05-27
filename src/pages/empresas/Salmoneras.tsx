
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AppSidebar } from "@/components/AppSidebar";
import { CreateSalmoneraForm } from "@/components/salmoneras/CreateSalmoneraForm";
import { SalmoneraTableView } from "@/components/salmoneras/SalmoneraTableView";
import { SalmoneraCardView } from "@/components/salmoneras/SalmoneraCardView";
import { AsociacionContratistas } from "@/components/salmoneras/AsociacionContratistas";
import { UserManagement } from "@/components/empresa/UserManagement";
import { Building, Plus, Table, Grid, Users, Link } from "lucide-react";
import { useSalmoneras, Salmonera } from "@/hooks/useSalmoneras";
import { useUsersByCompany } from "@/hooks/useUsersByCompany";
import { useToast } from "@/hooks/use-toast";

export default function Salmoneras() {
  const { salmoneras, isLoading, createSalmonera, updateSalmonera, deleteSalmonera } = useSalmoneras();
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [editingSalmonera, setEditingSalmonera] = useState<Salmonera | null>(null);
  const [selectedSalmonera, setSelectedSalmonera] = useState<Salmonera | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const { toast } = useToast();

  const { usuarios, inviteUser, createUser } = useUsersByCompany(
    selectedSalmonera?.id, 
    'salmonera'
  );

  const handleCreateSalmonera = async (data: any) => {
    try {
      await createSalmonera(data);
      setShowCreateForm(false);
      toast({
        title: "Salmonera creada",
        description: "La salmonera ha sido creada exitosamente.",
      });
    } catch (error) {
      console.error('Error creating salmonera:', error);
    }
  };

  const handleEditSalmonera = async (data: any) => {
    if (!editingSalmonera) return;
    try {
      await updateSalmonera({ id: editingSalmonera.id, data });
      setShowEditForm(false);
      setEditingSalmonera(null);
      toast({
        title: "Salmonera actualizada",
        description: "La salmonera ha sido actualizada exitosamente.",
      });
    } catch (error) {
      console.error('Error updating salmonera:', error);
    }
  };

  const handleDeleteSalmonera = async (id: string) => {
    try {
      await deleteSalmonera(id);
      toast({
        title: "Salmonera eliminada",
        description: "La salmonera ha sido eliminada exitosamente.",
      });
    } catch (error) {
      console.error('Error deleting salmonera:', error);
    }
  };

  const handleSelectSalmonera = (salmonera: Salmonera) => {
    setSelectedSalmonera(salmonera);
  };

  const handleEditClick = (id: string) => {
    const salmonera = salmoneras.find(s => s.id === id);
    if (salmonera) {
      setEditingSalmonera(salmonera);
      setShowEditForm(true);
    }
  };

  const salmoneraUsers = usuarios.filter(u => u.salmonera_id === selectedSalmonera?.id);

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="space-y-4">
              <Skeleton className="h-8 w-64" />
              <Skeleton className="h-32 w-full" />
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <Skeleton key={i} className="h-48" />
                ))}
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
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            <CreateSalmoneraForm
              onSubmit={handleCreateSalmonera}
              onCancel={() => setShowCreateForm(false)}
            />
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (selectedSalmonera) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <AppSidebar />
          <main className="flex-1 p-6">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSalmonera(null)}
                  >
                    ← Volver
                  </Button>
                  <div>
                    <h1 className="text-2xl font-bold">{selectedSalmonera.nombre}</h1>
                    <p className="text-zinc-500">{selectedSalmonera.rut}</p>
                  </div>
                </div>
                <Badge variant="outline" className="bg-green-100 text-green-700">
                  {selectedSalmonera.estado}
                </Badge>
              </div>

              <Tabs defaultValue="usuarios" className="space-y-6">
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="usuarios" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Administradores
                  </TabsTrigger>
                  <TabsTrigger value="asociaciones" className="flex items-center gap-2">
                    <Link className="w-4 h-4" />
                    Contratistas
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="usuarios">
                  <UserManagement
                    empresaType="salmonera"
                    empresaId={selectedSalmonera.id}
                    users={salmoneraUsers.map(u => ({
                      id: u.usuario_id,
                      usuario_id: u.usuario_id,
                      nombre: u.nombre,
                      apellido: u.apellido,
                      email: u.email,
                      rol: u.rol,
                      estado: 'activo' as const,
                      created_at: u.created_at
                    }))}
                    onCreateUser={async (userData) => {
                      if (userData.usuario_id) {
                        await createUser(userData);
                      } else {
                        await inviteUser(userData);
                      }
                    }}
                    onUpdateUser={async () => {}}
                    onDeleteUser={async () => {}}
                  />
                </TabsContent>

                <TabsContent value="asociaciones">
                  <AsociacionContratistas
                    salmoneraId={selectedSalmonera.id}
                    salmoneraName={selectedSalmonera.nombre}
                  />
                </TabsContent>
              </Tabs>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <AppSidebar />
        <main className="flex-1 p-6">
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <SidebarTrigger />
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-bold">Salmoneras</h1>
                    <p className="text-zinc-500">Gestión de empresas salmoneras</p>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center bg-white rounded-lg border">
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="rounded-r-none"
                  >
                    <Table className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                    className="rounded-l-none"
                  >
                    <Grid className="w-4 h-4" />
                  </Button>
                </div>
                <Button onClick={() => setShowCreateForm(true)} className="bg-blue-600 hover:bg-blue-700">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Salmonera
                </Button>
              </div>
            </div>

            <Card className="ios-card">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center justify-between">
                  <span>Empresas Registradas</span>
                  <Badge variant="outline">{salmoneras.length} empresas</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {viewMode === 'table' ? (
                  <SalmoneraTableView
                    salmoneras={salmoneras}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteSalmonera}
                    onSelect={handleSelectSalmonera}
                  />
                ) : (
                  <SalmoneraCardView
                    salmoneras={salmoneras}
                    onEdit={handleEditClick}
                    onDelete={handleDeleteSalmonera}
                    onSelect={handleSelectSalmonera}
                  />
                )}
              </CardContent>
            </Card>
          </div>

          {/* Edit Dialog */}
          <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
            <DialogContent className="max-w-2xl">
              <DialogHeader>
                <DialogTitle>Editar Salmonera</DialogTitle>
              </DialogHeader>
              {editingSalmonera && (
                <CreateSalmoneraForm
                  onSubmit={handleEditSalmonera}
                  onCancel={() => {
                    setShowEditForm(false);
                    setEditingSalmonera(null);
                  }}
                  initialData={editingSalmonera}
                  isEditing={true}
                />
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
}
