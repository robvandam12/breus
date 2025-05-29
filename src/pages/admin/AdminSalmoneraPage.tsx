
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Crown, Users, Building, MapPin, Calendar, Bell } from "lucide-react";
import { PersonalManager } from "@/components/shared/PersonalManager";
import { CentroNotificaciones } from "@/components/admin/CentroNotificaciones";
import { useWorkflowNotifications } from "@/hooks/useWorkflowNotifications";
import { useUsersByCompany } from "@/hooks/useUsersByCompany";
import { useAuth } from "@/hooks/useAuth";

const AdminSalmoneraPage = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const { notifications, unreadCount } = useWorkflowNotifications();
  const { profile } = useAuth();
  
  // Obtener usuarios asociados a esta salmonera
  const { usuarios, createUser, inviteUser } = useUsersByCompany(
    profile?.salmonera_id,
    'salmonera'
  );

  const statsCards = [
    {
      title: "Personal Disponible",
      value: usuarios.length.toString(),
      description: "Supervisores y buzos activos",
      icon: Users,
      color: "bg-blue-100 text-blue-600"
    },
    {
      title: "Sitios Activos",
      value: "8",
      description: "Centros y barcos operativos",
      icon: MapPin,
      color: "bg-green-100 text-green-600"
    },
    {
      title: "Operaciones",
      value: "12",
      description: "En curso este mes",
      icon: Calendar,
      color: "bg-purple-100 text-purple-600"
    },
    {
      title: "Notificaciones",
      value: unreadCount.toString(),
      description: "Pendientes de revisar",
      icon: Bell,
      color: "bg-orange-100 text-orange-600"
    }
  ];

  const handleAddMember = async (memberData: any) => {
    try {
      if (memberData.usuario_id) {
        // Usuario existente
        await createUser({
          email: memberData.email,
          nombre: memberData.nombre,
          apellido: memberData.apellido,
          rol: memberData.rol,
          empresa_id: profile?.salmonera_id,
          tipo_empresa: 'salmonera'
        });
      } else {
        // Invitar nuevo usuario
        await inviteUser({
          email: memberData.email,
          nombre: memberData.nombre,
          apellido: memberData.apellido,
          rol: memberData.rol,
          empresa_id: profile?.salmonera_id,
          tipo_empresa: 'salmonera'
        });
      }
    } catch (error) {
      console.error('Error adding member:', error);
    }
  };

  const handleRemoveMember = async (memberId: string) => {
    console.log('Removing member:', memberId);
    // Implementar lógica para remover miembro
  };

  const handleUpdateRole = async (memberId: string, newRole: string) => {
    console.log('Updating role:', memberId, newRole);
    // Implementar lógica para actualizar rol
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
              <div className="flex items-center gap-3">
                <Crown className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Panel Administrador Salmonera</h1>
                  <p className="text-sm text-zinc-500">Gestión integral de operaciones de buceo</p>
                </div>
              </div>
              <div className="flex-1" />
              <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                Admin Salmonera
              </Badge>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-5">
                  <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
                  <TabsTrigger value="personal-disponible">Personal Disponible</TabsTrigger>
                  <TabsTrigger value="sitios">Sitios</TabsTrigger>
                  <TabsTrigger value="operaciones">Operaciones</TabsTrigger>
                  <TabsTrigger value="notificaciones" className="relative">
                    Notificaciones
                    {unreadCount > 0 && (
                      <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 p-0 text-xs">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="dashboard" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900 mb-6">Dashboard General</h2>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                      {statsCards.map((card, index) => {
                        const IconComponent = card.icon;
                        return (
                          <Card key={index} className="ios-card">
                            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
                              <div className={`p-2 rounded-lg ${card.color}`}>
                                <IconComponent className="w-4 h-4" />
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="text-2xl font-bold">{card.value}</div>
                              <p className="text-xs text-muted-foreground">{card.description}</p>
                            </CardContent>
                          </Card>
                        );
                      })}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card className="ios-card">
                      <CardHeader>
                        <CardTitle>Flujo de Trabajo</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm">HPTs Pendientes</span>
                            <Badge variant="outline">3</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm">Anexos Bravo Firmados</span>
                            <Badge variant="outline">8</Badge>
                          </div>
                          <div className="flex items-center justify-between p-3 border rounded-lg">
                            <span className="text-sm">Bitácoras Completadas</span>
                            <Badge variant="outline">15</Badge>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="ios-card">
                      <CardHeader>
                        <CardTitle>Actividad Reciente</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="text-sm">
                            <p className="font-medium">Operación Centro Norte completada</p>
                            <p className="text-muted-foreground">Hace 2 horas</p>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium">Nuevo supervisor agregado al personal</p>
                            <p className="text-muted-foreground">Hace 4 horas</p>
                          </div>
                          <div className="text-sm">
                            <p className="font-medium">Sitio Sur actualizado</p>
                            <p className="text-muted-foreground">Hace 1 día</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="personal-disponible" className="space-y-6">
                  <div>
                    <h2 className="text-2xl font-bold text-zinc-900 mb-6">Gestión de Personal Disponible</h2>
                    <PersonalManager
                      title="Personal Disponible"
                      description="Gestione el personal disponible para operaciones de buceo"
                      personal={usuarios.map(usuario => ({
                        id: usuario.usuario_id,
                        nombre_completo: `${usuario.nombre} ${usuario.apellido}`,
                        nombre: usuario.nombre,
                        apellido: usuario.apellido,
                        email: usuario.email,
                        rol: usuario.rol,
                        rol_equipo: usuario.rol,
                        disponible: true,
                        empresa_nombre: usuario.empresa_nombre,
                        empresa_tipo: usuario.empresa_tipo
                      }))}
                      onAddMember={handleAddMember}
                      onRemoveMember={handleRemoveMember}
                      onUpdateRole={handleUpdateRole}
                      allowedRoles={['admin_salmonera', 'supervisor', 'buzo']}
                      emptyStateMessage="No hay personal registrado en esta salmonera"
                      addButtonText="Agregar Personal"
                    />
                  </div>
                </TabsContent>

                <TabsContent value="sitios" className="space-y-6">
                  <Card className="ios-card">
                    <CardHeader>
                      <CardTitle>Gestión de Sitios</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Funcionalidad de gestión de sitios en desarrollo...
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="operaciones" className="space-y-6">
                  <Card className="ios-card">
                    <CardHeader>
                      <CardTitle>Gestión de Operaciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground">
                        Funcionalidad de gestión de operaciones en desarrollo...
                      </p>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notificaciones" className="space-y-6">
                  <CentroNotificaciones />
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AdminSalmoneraPage;
