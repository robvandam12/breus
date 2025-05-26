
import { useState } from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { AppSidebar } from '@/components/AppSidebar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Users, Building, MapPin, Settings, Activity, Bell } from 'lucide-react';
import { UserPoolManager } from '@/components/admin/UserPoolManager';
import { TeamBuilder } from '@/components/admin/TeamBuilder';
import { useAuth } from '@/hooks/useAuth';
import { useWorkflowNotifications } from '@/hooks/useWorkflowNotifications';
import { Badge } from '@/components/ui/badge';

const AdminSalmoneraPage = () => {
  const { profile } = useAuth();
  const { notifications, unreadCount } = useWorkflowNotifications();
  const [activeTab, setActiveTab] = useState('pool');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
              <div className="flex items-center gap-3">
                <Building className="w-6 h-6 text-blue-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Panel Administrador Salmonera</h1>
                  <p className="text-sm text-zinc-500">Gestión completa de operaciones de buceo</p>
                </div>
              </div>
              <div className="flex-1" />
              <div className="flex items-center gap-3">
                {unreadCount > 0 && (
                  <div className="relative">
                    <Bell className="w-5 h-5 text-gray-600" />
                    <Badge className="absolute -top-2 -right-2 bg-red-500 text-white text-xs px-1 min-w-[20px] h-5 flex items-center justify-center rounded-full">
                      {unreadCount}
                    </Badge>
                  </div>
                )}
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* Stats Overview */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Users className="w-8 h-8 text-blue-600" />
                      <div>
                        <div className="text-2xl font-bold">12</div>
                        <div className="text-sm text-gray-500">Usuarios Activos</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Building className="w-8 h-8 text-green-600" />
                      <div>
                        <div className="text-2xl font-bold">5</div>
                        <div className="text-sm text-gray-500">Contratistas</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <MapPin className="w-8 h-8 text-purple-600" />
                      <div>
                        <div className="text-2xl font-bold">8</div>
                        <div className="text-sm text-gray-500">Sitios Activos</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-3">
                      <Activity className="w-8 h-8 text-orange-600" />
                      <div>
                        <div className="text-2xl font-bold">3</div>
                        <div className="text-sm text-gray-500">Operaciones Activas</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Main Content Tabs */}
              <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
                <TabsList className="grid w-full grid-cols-6">
                  <TabsTrigger value="pool" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Pool Usuarios
                  </TabsTrigger>
                  <TabsTrigger value="teams" className="flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Equipos
                  </TabsTrigger>
                  <TabsTrigger value="contractors" className="flex items-center gap-2">
                    <Building className="w-4 h-4" />
                    Contratistas
                  </TabsTrigger>
                  <TabsTrigger value="sites" className="flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Sitios
                  </TabsTrigger>
                  <TabsTrigger value="operations" className="flex items-center gap-2">
                    <Activity className="w-4 h-4" />
                    Operaciones
                  </TabsTrigger>
                  <TabsTrigger value="notifications" className="flex items-center gap-2">
                    <Bell className="w-4 h-4" />
                    Notificaciones
                    {unreadCount > 0 && (
                      <Badge className="ml-1 bg-red-500 text-white text-xs px-1 min-w-[16px] h-4 flex items-center justify-center rounded-full">
                        {unreadCount}
                      </Badge>
                    )}
                  </TabsTrigger>
                </TabsList>

                <TabsContent value="pool" className="space-y-6">
                  <UserPoolManager />
                </TabsContent>

                <TabsContent value="teams" className="space-y-6">
                  <TeamBuilder />
                </TabsContent>

                <TabsContent value="contractors" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gestión de Contratistas</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        <Building className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Componente de gestión de contratistas</p>
                        <p className="text-sm">Funcionalidad en desarrollo</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="sites" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gestión de Sitios</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Componente de gestión de sitios</p>
                        <p className="text-sm">Funcionalidad en desarrollo</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="operations" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Gestión de Operaciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-8 text-gray-500">
                        <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                        <p>Componente de gestión de operaciones</p>
                        <p className="text-sm">Funcionalidad en desarrollo</p>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="notifications" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Centro de Notificaciones</CardTitle>
                    </CardHeader>
                    <CardContent>
                      {notifications.length > 0 ? (
                        <div className="space-y-4">
                          {notifications.map((notif) => (
                            <div key={notif.id} className="p-4 border rounded-lg">
                              <div className="flex items-start justify-between">
                                <div>
                                  <h4 className="font-medium">{notif.titulo}</h4>
                                  <p className="text-sm text-gray-600 mt-1">{notif.mensaje}</p>
                                  <p className="text-xs text-gray-400 mt-2">
                                    {new Date(notif.created_at).toLocaleString()}
                                  </p>
                                </div>
                                <Badge className={`${notif.tipo === 'aprobacion_requerida' ? 'bg-red-100 text-red-800' : 'bg-blue-100 text-blue-800'}`}>
                                  {notif.tipo.replace(/_/g, ' ')}
                                </Badge>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-8 text-gray-500">
                          <Bell className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                          <p>No hay notificaciones pendientes</p>
                        </div>
                      )}
                    </CardContent>
                  </Card>
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
