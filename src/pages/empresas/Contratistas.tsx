import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, Building, Table as TableIcon, Grid } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ContratistaTableView } from "@/components/contratistas/ContratistaTableView";
import { ContratistaDetails } from "@/pages/empresas/ContratistaDetails";
import { CreateContratistaForm } from "@/components/contratistas/CreateContratistaForm";
import { DeleteContratistaDialog } from "@/components/contratistas/DeleteContratistaDialog";
import { useContratistas } from "@/hooks/useContratistas";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";

export default function Contratistas() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedContratista, setSelectedContratista] = useState<any>(null);
  const [deleteContratista, setDeleteContratista] = useState<{id: string, nombre: string} | null>(null);
  const [viewMode, setViewMode] = useState<'table' | 'cards'>('table');
  const [searchTerm, setSearchTerm] = useState('');
  
  const { contratistas, deleteContratista: deleteContratistaFn, createContratista, isDeleting } = useContratistas();
  const { profile } = useAuth();

  const filteredContratistas = contratistas.filter(contratista =>
    contratista.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    contratista.rut.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (contratista.email && contratista.email.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleDelete = async () => {
    if (!deleteContratista) return;
    
    try {
      await deleteContratistaFn(deleteContratista.id);
      toast({
        title: "Contratista eliminado",
        description: "El contratista ha sido eliminado exitosamente.",
      });
      setDeleteContratista(null);
    } catch (error) {
      console.error('Error deleting contratista:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el contratista.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteContratista = async (id: string) => {
    const contratista = contratistas.find(c => c.id === id);
    if (contratista) {
      setDeleteContratista({
        id: contratista.id,
        nombre: contratista.nombre
      });
    }
  };

  const handleEditContratista = (contratista: any) => {
    setSelectedContratista(contratista);
  };

  const handleSelectContratista = (contratista: any) => {
    setSelectedContratista(contratista);
  };

  const handleCreateContratista = async (data: any) => {
    try {
      // Create the contratista using the mutation
      createContratista(data);
      
      // If the user is admin de salmonera and creation is successful, 
      // we need to wait for the mutation to complete and then associate
      // Since createContratista is async through mutation, we'll handle association in the success callback
      
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating contratista:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el contratista.",
        variant: "destructive",
      });
    }
  };

  if (showCreateForm) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col">
            <Header 
              title="Crear Contratista" 
              subtitle="Registro de nueva empresa contratista" 
              icon={Building}
            >
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>
                Cancelar
              </Button>
            </Header>
            <div className="flex-1 overflow-auto">
              <div className="p-6">
                <CreateContratistaForm 
                  onSubmit={handleCreateContratista}
                  onCancel={() => setShowCreateForm(false)}
                />
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  if (selectedContratista) {
    return (
      <ContratistaDetails
        contratista={selectedContratista}
        onBack={() => setSelectedContratista(null)}
      />
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Contratistas" 
            subtitle="Gestión de empresas contratistas y servicios de buceo" 
            icon={Building}
          >
            <div className="flex items-center gap-3">
              <div className="flex items-center bg-white rounded-lg border">
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="rounded-r-none"
                >
                  <TableIcon className="w-4 h-4" />
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
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Contratista
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-6 space-y-6">
              <Card className="ios-card">
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <CardTitle>Contratistas Registrados</CardTitle>
                    <Badge variant="outline">{filteredContratistas.length} contratistas</Badge>
                  </div>
                  <div className="flex items-center gap-4 mt-4">
                    <Input
                      placeholder="Buscar contratistas..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="max-w-sm"
                    />
                  </div>
                </CardHeader>
                <CardContent>
                  <Tabs value={viewMode} onValueChange={(value) => setViewMode(value as 'table' | 'cards')}>
                    <TabsContent value="table">
                      {filteredContratistas.length === 0 ? (
                        <div className="text-center py-12">
                          <Building className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay contratistas registrados</h3>
                          <p className="text-zinc-500 mb-4">Cree el primer contratista para comenzar</p>
                          <Button onClick={() => setShowCreateForm(true)} variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Primer Contratista
                          </Button>
                        </div>
                      ) : (
                        <ContratistaTableView 
                          contratistas={filteredContratistas}
                          onEdit={handleEditContratista}
                          onDelete={handleDeleteContratista}
                          onSelect={handleSelectContratista}
                        />
                      )}
                    </TabsContent>

                    <TabsContent value="cards">
                      {filteredContratistas.length === 0 ? (
                        <div className="text-center py-12">
                          <Building className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                          <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay contratistas registrados</h3>
                          <p className="text-zinc-500 mb-4">Cree el primer contratista para comenzar</p>
                          <Button onClick={() => setShowCreateForm(true)} variant="outline">
                            <Plus className="w-4 h-4 mr-2" />
                            Crear Primer Contratista
                          </Button>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {filteredContratistas.map((contratista) => (
                            <Card key={contratista.id} className="cursor-pointer hover:shadow-md transition-shadow">
                              <CardContent className="p-4">
                                <div className="flex items-start justify-between mb-2">
                                  <h3 className="font-medium">{contratista.nombre}</h3>
                                  <Badge variant={contratista.estado === 'activo' ? 'default' : 'secondary'}>
                                    {contratista.estado}
                                  </Badge>
                                </div>
                                <div className="space-y-1 text-sm text-gray-600">
                                  <div>RUT: {contratista.rut}</div>
                                  <div>{contratista.direccion}</div>
                                  {contratista.email && <div>{contratista.email}</div>}
                                  {contratista.telefono && <div>{contratista.telefono}</div>}
                                </div>
                                <div className="flex gap-2 mt-4">
                                  <Button size="sm" variant="outline" onClick={() => handleSelectContratista(contratista)}>
                                    Ver Detalles
                                  </Button>
                                  <Button size="sm" variant="outline" onClick={() => handleEditContratista(contratista)}>
                                    Editar
                                  </Button>
                                </div>
                              </CardContent>
                            </Card>
                          ))}
                        </div>
                      )}
                    </TabsContent>
                  </Tabs>
                </CardContent>
              </Card>

              {/* Delete Confirmation Dialog */}
              <DeleteContratistaDialog
                isOpen={!!deleteContratista}
                onClose={() => setDeleteContratista(null)}
                onConfirm={handleDelete}
                contratistaNombre={deleteContratista?.nombre || ''}
                isDeleting={isDeleting}
              />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
