
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PoolUsuarios } from '@/components/admin/PoolUsuarios';
import { GestionEquipos } from '@/components/admin/GestionEquipos';
import { CentroNotificaciones } from '@/components/admin/CentroNotificaciones';
import { Badge } from '@/components/ui/badge';
import { Users, UserCheck, Bell, BarChart3, Building, MapPin, Waves } from 'lucide-react';
import { useWorkflowNotifications } from '@/hooks/useWorkflowNotifications';
import { useUserPool } from '@/hooks/useUserPool';
import { useOperaciones } from '@/hooks/useOperaciones';
import { useSalmoneras } from '@/hooks/useSalmoneras';
import { useAuth } from '@/hooks/useAuth';

const AdminSalmoneraPage = () => {
  const { profile } = useAuth();
  const { unreadCount } = useWorkflowNotifications();
  const { poolUsers, invitaciones } = useUserPool(profile?.salmonera_id);
  const { operaciones } = useOperaciones();
  const { salmoneras } = useSalmoneras();

  const [activeTab, setActiveTab] = useState("dashboard");

  // Estadísticas del dashboard
  const stats = {
    totalUsuarios: poolUsers.length,
    usuariosDisponibles: poolUsers.filter(u => u.disponible).length,
    invitacionesPendientes: invitaciones.filter(i => i.estado === 'pendiente').length,
    operacionesActivas: operaciones.filter(o => o.estado === 'activa').length,
    totalSalmoneras: salmoneras.length,
    notificacionesPendientes: unreadCount
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Panel de Administración</h1>
          <p className="text-gray-600">Gestión integral de usuarios, equipos y operaciones</p>
        </div>
        <Badge variant="outline" className="text-sm">
          Admin Salmonera
        </Badge>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="usuarios" className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            Pool Usuarios
            {stats.invitacionesPendientes > 0 && (
              <Badge variant="destructive" className="text-xs rounded-full h-5 w-5 p-0 flex items-center justify-center">
                {stats.invitacionesPendientes}
              </Badge>
            )}
          </TabsTrigger>
          <TabsTrigger value="equipos" className="flex items-center gap-2">
            <UserCheck className="w-4 h-4" />
            Equipos
          </TabsTrigger>
          <TabsTrigger value="notificaciones" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notificaciones
            {unreadCount > 0 && (
              <Badge variant="destructive" className="text-xs rounded-full h-5 w-5 p-0 flex items-center justify-center">
                {unreadCount}
              </Badge>
            )}
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Usuarios</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsuarios}</div>
                <p className="text-xs text-muted-foreground">
                  {stats.usuariosDisponibles} disponibles
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Invitaciones Pendientes</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.invitacionesPendientes}</div>
                <p className="text-xs text-muted-foreground">
                  Por confirmar
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Operaciones Activas</CardTitle>
                <Waves className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.operacionesActivas}</div>
                <p className="text-xs text-muted-foreground">
                  En ejecución
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Salmoneras</CardTitle>
                <Building className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalSalmoneras}</div>
                <p className="text-xs text-muted-foreground">
                  Total registradas
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Notificaciones</CardTitle>
                <Bell className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.notificacionesPendientes}</div>
                <p className="text-xs text-muted-foreground">
                  Sin leer
                </p>
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Resumen del Workflow</CardTitle>
              <CardDescription>
                Estado actual del proceso de buceo profesional
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                    <span>Pool de Usuarios Configurado</span>
                  </div>
                  <Badge variant="default">Activo</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                    <span>Sistema de Notificaciones</span>
                  </div>
                  <Badge variant="default">Funcionando</Badge>
                </div>
                <div className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span>Gestión de Equipos</span>
                  </div>
                  <Badge variant="secondary">En desarrollo</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="usuarios">
          <PoolUsuarios salmoneraId={profile?.salmonera_id} />
        </TabsContent>

        <TabsContent value="equipos">
          <GestionEquipos />
        </TabsContent>

        <TabsContent value="notificaciones">
          <CentroNotificaciones />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminSalmoneraPage;
