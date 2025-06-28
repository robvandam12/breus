
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { HardHat, Users, Link as LinkIcon, ArrowLeft, UserPlus, Mail } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Contratista } from "@/hooks/useContratistas";
import { AsociacionSalmoneras } from "@/components/contratistas/AsociacionSalmoneras";
import { UserManagement, User } from "@/components/empresa/UserManagement";
import { useUsuarios } from "@/hooks/useUsuarios";
import { CreateUserInviteForm } from "@/components/usuarios/CreateUserInviteForm";

interface ContratistaDetailsProps {
  contratista: Contratista;
  onBack: () => void;
}

export const ContratistaDetails = ({ contratista, onBack }: ContratistaDetailsProps) => {
  const [showInviteForm, setShowInviteForm] = useState(false);
  const { usuarios, isLoading, inviteUsuario } = useUsuarios();
  
  // Filter users belonging to this contractor and convert to User interface
  const contratistaUsers: User[] = usuarios
    .filter(user => user.servicio_id === contratista.id)
    .map(user => ({
      id: user.usuario_id,
      usuario_id: user.usuario_id,
      nombre: user.nombre,
      apellido: user.apellido,
      email: user.email,
      rol: user.rol,
      estado: 'activo' as const, // Default state
      created_at: user.created_at
    }));

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "activo":
        return "bg-emerald-100 text-emerald-700";
      case "inactivo":
        return "bg-red-100 text-red-700";
      case "suspendido":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  const handleInviteUser = async (data: {
    email: string;
    nombre: string;
    apellido: string;
    rol: string;
  }) => {
    await inviteUsuario({
      email: data.email,
      rol: data.rol,
      nombre: data.nombre,
      apellido: data.apellido,
      empresa_selection: `contratista_${contratista.id}`
    });
    setShowInviteForm(false);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
              <Button
                variant="ghost"
                onClick={onBack}
                className="mr-4 flex items-center gap-2"
              >
                <ArrowLeft className="w-4 h-4" />
                Volver
              </Button>
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <HardHat className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">{contratista.nombre}</h1>
                  <p className="text-sm text-zinc-500">RUT: {contratista.rut}</p>
                </div>
              </div>
              <div className="flex-1" />
              <Badge variant="outline" className={getEstadoBadge(contratista.estado)}>
                {contratista.estado}
              </Badge>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              <div className="space-y-6">
                {/* Información General */}
                <Card className="ios-card">
                  <CardHeader>
                    <CardTitle>Información General</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid md:grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm font-medium text-zinc-700">Dirección</p>
                        <p className="text-zinc-600">{contratista.direccion}</p>
                      </div>
                      {contratista.telefono && (
                        <div>
                          <p className="text-sm font-medium text-zinc-700">Teléfono</p>
                          <p className="text-zinc-600">{contratista.telefono}</p>
                        </div>
                      )}
                      {contratista.email && (
                        <div>
                          <p className="text-sm font-medium text-zinc-700">Email</p>
                          <p className="text-zinc-600">{contratista.email}</p>
                        </div>
                      )}
                      <div>
                        <p className="text-sm font-medium text-zinc-700">Personal Activo</p>
                        <p className="text-zinc-600">{contratistaUsers.length} usuarios</p>
                      </div>
                    </div>
                    
                    {contratista.especialidades && contratista.especialidades.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-zinc-700 mb-2">Especialidades</p>
                        <div className="flex flex-wrap gap-2">
                          {contratista.especialidades.map((esp, index) => (
                            <Badge key={index} variant="outline">
                              {esp}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {contratista.certificaciones && contratista.certificaciones.length > 0 && (
                      <div className="mt-4">
                        <p className="text-sm font-medium text-zinc-700 mb-2">Certificaciones</p>
                        <div className="flex flex-wrap gap-2">
                          {contratista.certificaciones.map((cert, index) => (
                            <Badge key={index} variant="outline">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </CardContent>
                </Card>

                {/* Tabs para diferentes secciones */}
                <Tabs defaultValue="usuarios" className="space-y-6">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="usuarios" className="flex items-center gap-2">
                      <Users className="w-4 h-4" />
                      Personal ({contratistaUsers.length})
                    </TabsTrigger>
                    <TabsTrigger value="asociaciones" className="flex items-center gap-2">
                      <LinkIcon className="w-4 h-4" />
                      Salmoneras
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="usuarios">
                    <Card>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <CardTitle>Gestión de Personal</CardTitle>
                          <Button 
                            onClick={() => setShowInviteForm(true)}
                            className="flex items-center gap-2"
                          >
                            <UserPlus className="w-4 h-4" />
                            Invitar Usuario
                          </Button>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <UserManagement
                          empresaType="servicio"
                          empresaId={contratista.id}
                          users={contratistaUsers}
                          onCreateUser={handleInviteUser}
                          onUpdateUser={async () => {}}
                          onDeleteUser={async () => {}}
                        />
                      </CardContent>
                    </Card>
                  </TabsContent>

                  <TabsContent value="asociaciones">
                    <AsociacionSalmoneras
                      contratistaId={contratista.id}
                      contratistaName={contratista.nombre}
                    />
                  </TabsContent>
                </Tabs>
              </div>
            </div>
          </div>
        </main>
      </div>

      {/* Dialog para invitar usuarios */}
      <Dialog open={showInviteForm} onOpenChange={setShowInviteForm}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5 text-blue-600" />
              Invitar Usuario a {contratista.nombre}
            </DialogTitle>
          </DialogHeader>
          <CreateUserInviteForm
            onSubmit={handleInviteUser}
            onCancel={() => setShowInviteForm(false)}
            empresaType="contratista"
          />
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};
