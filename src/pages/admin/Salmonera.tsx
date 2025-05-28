
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Plus, Building, Users, MapPin, Phone, Mail, Edit, Trash2, AlertTriangle } from "lucide-react";
import { CreateSalmoneraForm } from "@/components/salmoneras/CreateSalmoneraForm";
import { EditSalmoneraForm } from "@/components/salmoneras/EditSalmoneraForm";
import { PersonnelManager } from "@/components/shared/PersonnelManager";
import { useSalmonerasEnhanced } from "@/hooks/useSalmonerasEnhanced";

export default function Salmonera() {
  const [activeTab, setActiveTab] = useState('lista');
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedSalmonera, setSelectedSalmonera] = useState<any>(null);

  const {
    salmoneras,
    isLoading,
    addPersonalToSalmonera,
    removePersonalFromSalmonera,
    inviteUserToSalmonera,
    deleteSalmonera
  } = useSalmonerasEnhanced();

  const handleEditSalmonera = (salmonera: any) => {
    setSelectedSalmonera(salmonera);
    setShowEditForm(true);
  };

  const handleDeleteSalmonera = async (salmoneraId: string) => {
    if (window.confirm('¿Está seguro de que desea eliminar esta salmonera?')) {
      try {
        await deleteSalmonera(salmoneraId);
      } catch (error) {
        console.error('Error deleting salmonera:', error);
      }
    }
  };

  const availableRoles = [
    { value: 'admin_salmonera', label: 'Administrador' },
    { value: 'supervisor', label: 'Supervisor' },
    { value: 'operador', label: 'Operador' }
  ];

  if (isLoading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-6 w-6 border-2 border-blue-600 border-t-transparent mx-auto"></div>
        <p className="text-gray-500 mt-2 text-sm">Cargando salmoneras...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Gestión de Salmoneras</h1>
          <p className="text-gray-600">Administre las salmoneras y su personal asociado</p>
        </div>
        <Button 
          onClick={() => setShowCreateForm(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="w-4 h-4 mr-2" />
          Nueva Salmonera
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="lista">Lista de Salmoneras</TabsTrigger>
          <TabsTrigger value="personal">Gestión de Personal</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-4">
          {salmoneras.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Building className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No hay salmoneras registradas
                </h3>
                <p className="text-gray-600 mb-4">
                  Comience creando su primera salmonera
                </p>
                <Button onClick={() => setShowCreateForm(true)}>
                  <Plus className="w-4 h-4 mr-2" />
                  Crear Primera Salmonera
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {salmoneras.map((salmonera) => (
                <Card key={salmonera.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{salmonera.nombre}</CardTitle>
                      <Badge variant={salmonera.estado === 'activa' ? 'default' : 'secondary'}>
                        {salmonera.estado}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="space-y-2 text-sm">
                      <div className="flex items-center gap-2">
                        <Building className="w-4 h-4 text-gray-500" />
                        <span>{salmonera.rut}</span>
                      </div>
                      {salmonera.email && (
                        <div className="flex items-center gap-2">
                          <Mail className="w-4 h-4 text-gray-500" />
                          <span>{salmonera.email}</span>
                        </div>
                      )}
                      {salmonera.telefono && (
                        <div className="flex items-center gap-2">
                          <Phone className="w-4 h-4 text-gray-500" />
                          <span>{salmonera.telefono}</span>
                        </div>
                      )}
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span className="truncate">{salmonera.direccion}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-gray-500" />
                        <span>{salmonera.personal?.length || 0} miembros</span>
                      </div>
                    </div>

                    <div className="flex gap-2 pt-3 border-t">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleEditSalmonera(salmonera)}
                        className="flex-1"
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        Editar
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteSalmonera(salmonera.id)}
                        className="text-red-600 border-red-200 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="personal" className="space-y-4">
          {selectedSalmonera ? (
            <PersonnelManager
              title={`Personal de ${selectedSalmonera.nombre}`}
              description="Gestione el personal asignado a esta salmonera"
              currentMembers={selectedSalmonera.personal || []}
              availableRoles={availableRoles}
              onAddMember={(memberData) => addPersonalToSalmonera(selectedSalmonera.id, memberData)}
              onRemoveMember={(memberId) => removePersonalFromSalmonera(selectedSalmonera.id, memberId)}
              showInviteOption={true}
            />
          ) : (
            <Alert>
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Seleccione una salmonera de la lista para gestionar su personal.
              </AlertDescription>
            </Alert>
          )}
        </TabsContent>
      </Tabs>

      {/* Dialogs */}
      <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Crear Nueva Salmonera</DialogTitle>
          </DialogHeader>
          <CreateSalmoneraForm 
            onClose={() => setShowCreateForm(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Editar Salmonera</DialogTitle>
          </DialogHeader>
          {selectedSalmonera && (
            <EditSalmoneraForm 
              salmonera={selectedSalmonera}
              onClose={() => {
                setShowEditForm(false);
                setSelectedSalmonera(null);
              }}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
