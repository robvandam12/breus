
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import { Plus, Users, Edit, Trash2, Eye, UserPlus } from "lucide-react";
import { CreateEquipoFormWizard } from "@/components/equipos/CreateEquipoFormWizard";
import { useEquipoBuceo } from "@/hooks/useEquipoBuceo";
import { toast } from "@/hooks/use-toast";

export default function EquipoBuceo() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedEquipo, setSelectedEquipo] = useState<any>(null);
  const [equipoToDelete, setEquipoToDelete] = useState<string | null>(null);

  const { equipos, isLoading, createEquipo, updateEquipo, deleteEquipo } = useEquipoBuceo();

  const handleCreateEquipo = async (data: any) => {
    try {
      await createEquipo(data);
      setShowCreateForm(false);
      toast({
        title: "Equipo creado",
        description: "El equipo de buceo ha sido creado exitosamente.",
      });
    } catch (error) {
      console.error('Error creating equipo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el equipo de buceo.",
        variant: "destructive",
      });
    }
  };

  const handleEditEquipo = async (data: any) => {
    try {
      if (selectedEquipo) {
        await updateEquipo({ id: selectedEquipo.id, data });
        setShowEditForm(false);
        setSelectedEquipo(null);
        toast({
          title: "Equipo actualizado",
          description: "El equipo de buceo ha sido actualizado exitosamente.",
        });
      }
    } catch (error) {
      console.error('Error updating equipo:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el equipo de buceo.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteEquipo = async () => {
    try {
      if (equipoToDelete) {
        await deleteEquipo(equipoToDelete);
        setEquipoToDelete(null);
        toast({
          title: "Equipo eliminado",
          description: "El equipo de buceo ha sido eliminado exitosamente.",
        });
      }
    } catch (error) {
      console.error('Error deleting equipo:', error);
      toast({
        title: "Error",
        description: "No se pudo eliminar el equipo de buceo.",
        variant: "destructive",
      });
    }
  };

  const handleViewEquipo = (equipo: any) => {
    setSelectedEquipo(equipo);
    setShowViewModal(true);
  };

  const handleEditClick = (equipo: any) => {
    setSelectedEquipo(equipo);
    setShowEditForm(true);
  };

  const getRolBadgeColor = (rol: string) => {
    const colorMap: Record<string, string> = {
      supervisor: 'bg-blue-100 text-blue-700',
      buzo_principal: 'bg-green-100 text-green-700',
      buzo_asistente: 'bg-yellow-100 text-yellow-700',
    };
    return colorMap[rol] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-white">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-white">
            <Header 
              title="Equipos de Buceo" 
              subtitle="Gestión de equipos de buceo y sus miembros" 
              icon={Users} 
            />
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <p className="text-gray-500">Cargando equipos...</p>
              </div>
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
            title="Equipos de Buceo" 
            subtitle="Gestión de equipos de buceo y sus miembros" 
            icon={Users} 
          >
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Equipo
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-6">
              {equipos.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      No hay equipos de buceo registrados
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      Comience creando el primer equipo de buceo
                    </p>
                    <Button onClick={() => setShowCreateForm(true)}>
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Primer Equipo
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Empresa</TableHead>
                        <TableHead>Miembros</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {equipos.map((equipo) => (
                        <TableRow key={equipo.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{equipo.nombre}</div>
                              {equipo.descripcion && (
                                <div className="text-sm text-gray-500">{equipo.descripcion}</div>
                              )}
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant="outline">
                              {equipo.tipo_empresa === 'salmonera' ? 'Salmonera' : 'Contratista'}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <Users className="w-4 h-4 text-gray-500" />
                              <span>{equipo.miembros?.length || 0} miembros</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={equipo.activo ? 'default' : 'secondary'}>
                              {equipo.activo ? 'Activo' : 'Inactivo'}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewEquipo(equipo)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleEditClick(equipo)}
                              >
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setEquipoToDelete(equipo.id)}
                                className="text-red-600 hover:text-red-700"
                              >
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}

              {/* Create Form Modal */}
              <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  <CreateEquipoFormWizard 
                    onSubmit={handleCreateEquipo}
                    onCancel={() => setShowCreateForm(false)}
                  />
                </DialogContent>
              </Dialog>

              {/* Edit Form Modal */}
              <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                  {selectedEquipo && (
                    <CreateEquipoFormWizard 
                      onSubmit={handleEditEquipo}
                      onCancel={() => {
                        setShowEditForm(false);
                        setSelectedEquipo(null);
                      }}
                      salmoneraId={selectedEquipo.tipo_empresa === 'salmonera' ? selectedEquipo.empresa_id : undefined}
                      contratistaId={selectedEquipo.tipo_empresa === 'contratista' ? selectedEquipo.empresa_id : undefined}
                    />
                  )}
                </DialogContent>
              </Dialog>

              {/* View Modal */}
              <Dialog open={showViewModal} onOpenChange={setShowViewModal}>
                <DialogContent className="max-w-2xl">
                  <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                      <Users className="w-5 h-5 text-blue-600" />
                      {selectedEquipo?.nombre}
                    </DialogTitle>
                  </DialogHeader>
                  {selectedEquipo && (
                    <div className="space-y-4">
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <span className="font-medium">Tipo:</span> {selectedEquipo.tipo_empresa === 'salmonera' ? 'Salmonera' : 'Contratista'}
                        </div>
                        <div>
                          <span className="font-medium">Estado:</span> {selectedEquipo.activo ? 'Activo' : 'Inactivo'}
                        </div>
                      </div>
                      {selectedEquipo.descripcion && (
                        <div>
                          <span className="font-medium">Descripción:</span>
                          <p className="text-gray-600 mt-1">{selectedEquipo.descripcion}</p>
                        </div>
                      )}
                      <div>
                        <h4 className="font-medium mb-2">Miembros del Equipo ({selectedEquipo.miembros?.length || 0})</h4>
                        {selectedEquipo.miembros?.length > 0 ? (
                          <div className="space-y-2">
                            {selectedEquipo.miembros.map((miembro: any) => (
                              <div key={miembro.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                                <div>
                                  <p className="font-medium">{miembro.nombre_completo}</p>
                                  <p className="text-sm text-gray-500">{miembro.email}</p>
                                </div>
                                <Badge variant="outline" className={getRolBadgeColor(miembro.rol_equipo)}>
                                  {miembro.rol_equipo === 'supervisor' ? 'Supervisor' :
                                   miembro.rol_equipo === 'buzo_principal' ? 'Buzo Principal' :
                                   'Buzo Asistente'}
                                </Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p className="text-gray-500">No hay miembros asignados</p>
                        )}
                      </div>
                    </div>
                  )}
                </DialogContent>
              </Dialog>

              {/* Delete Confirmation Modal */}
              <AlertDialog open={!!equipoToDelete} onOpenChange={() => setEquipoToDelete(null)}>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>¿Confirmar eliminación?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Esta acción no se puede deshacer. Se eliminará permanentemente el equipo de buceo y todos sus miembros asociados.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleDeleteEquipo} className="bg-red-600 hover:bg-red-700">
                      Eliminar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
