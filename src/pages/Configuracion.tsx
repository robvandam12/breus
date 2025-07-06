import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Settings, User, Bell, Shield, Key, Webhook, Zap, MapPin } from "lucide-react";
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/hooks/useAuth';
import { toast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { MainLayout } from '@/components/layout/MainLayout';
import { WebhookSettings } from '@/components/configuracion/WebhookSettings';
import { NotificationSettings } from '@/components/configuration/NotificationSettings';
import { AccountSettings } from '@/components/configuracion/AccountSettings';
import { SecuritySettings } from '@/components/configuracion/SecuritySettings';

export default function Configuracion() {
  const { profile, user } = useAuth();
  const [activeTab, setActiveTab] = useState("account");
  const [isLoading, setIsLoading] = useState(false);
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handlePasswordChange = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      toast({
        title: "Error",
        description: "Las contraseñas no coinciden",
        variant: "destructive",
      });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      toast({
        title: "Error",
        description: "La contraseña debe tener al menos 6 caracteres",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordData.newPassword
      });

      if (error) throw error;

      toast({
        title: "Contraseña actualizada",
        description: "Tu contraseña ha sido cambiada exitosamente",
      });

      setPasswordData({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message || "Error al cambiar la contraseña",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <MainLayout
      title="Configuración"
      subtitle="Gestiona tu cuenta, preferencias y configuración del sistema"
      icon={Settings}
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="account" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Cuenta
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center gap-2">
              <Shield className="w-4 h-4" />
              Seguridad
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center gap-2">
              <Bell className="w-4 h-4" />
              Notificaciones
            </TabsTrigger>
            <TabsTrigger value="webhooks" className="flex items-center gap-2">
              <Webhook className="w-4 h-4" />
              Webhooks
            </TabsTrigger>
            <TabsTrigger value="integrations" className="flex items-center gap-2">
              <Zap className="w-4 h-4" />
              Integraciones
            </TabsTrigger>
          </TabsList>

          <TabsContent value="account" className="space-y-6">
            <AccountSettings />
            
            {/* Cambio de Contraseña */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Key className="w-5 h-5" />
                  Cambiar Contraseña
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <Label htmlFor="newPassword">Nueva Contraseña</Label>
                  <Input
                    id="newPassword"
                    type="password"
                    value={passwordData.newPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      newPassword: e.target.value
                    }))}
                    placeholder="Mínimo 6 caracteres"
                  />
                </div>
                <div>
                  <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                  <Input
                    id="confirmPassword"
                    type="password"
                    value={passwordData.confirmPassword}
                    onChange={(e) => setPasswordData(prev => ({
                      ...prev,
                      confirmPassword: e.target.value
                    }))}
                    placeholder="Confirma tu nueva contraseña"
                  />
                </div>
                <Button 
                  onClick={handlePasswordChange}
                  disabled={isLoading || !passwordData.newPassword || !passwordData.confirmPassword}
                >
                  {isLoading ? "Actualizando..." : "Cambiar Contraseña"}
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="security">
            <SecuritySettings />
          </TabsContent>

          <TabsContent value="notifications">
            <NotificationSettings />
          </TabsContent>

          <TabsContent value="webhooks">
            <WebhookSettings />
          </TabsContent>

            <TabsContent value="integrations">
              <div className="space-y-6">
                {/* APIs Externas */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Zap className="w-5 h-5" />
                      APIs y Servicios Externos
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <Card className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                            <Zap className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">API de Clima</h4>
                            <p className="text-sm text-gray-600">Condiciones meteorológicas</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-200">Conectado</Badge>
                      </Card>
                      
                      <Card className="p-4">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                            <MapPin className="w-4 h-4 text-orange-600" />
                          </div>
                          <div>
                            <h4 className="font-medium">Geocodificación</h4>
                            <p className="text-sm text-gray-600">Mapas y ubicaciones</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-green-600 border-green-200">Conectado</Badge>
                      </Card>
                    </div>
                  </CardContent>
                </Card>

                {/* Sincronización */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                    <Zap className="w-5 h-5" />
                    APIs Externas
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">API de Clima</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Integración con servicios meteorológicos para datos ambientales
                      </p>
                      <Button variant="outline" size="sm">
                        Configurar
                      </Button>
                    </div>
                    <div className="p-4 border rounded-lg">
                      <h4 className="font-medium mb-2">Sistema de Mapas</h4>
                      <p className="text-sm text-gray-600 mb-3">
                        Integración con servicios de mapas y geolocalización
                      </p>
                      <Button variant="outline" size="sm">
                        Configurar
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Sincronización de Datos */}
              <Card>
                <CardHeader>
                  <CardTitle>Sincronización de Datos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Sincronización Automática</h4>
                      <p className="text-sm text-gray-600">
                        Sincronizar datos con sistemas externos automáticamente
                      </p>
                    </div>
                    <Button variant="outline">
                      Activar
                    </Button>
                  </div>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div>
                      <h4 className="font-medium">Backup en la Nube</h4>
                      <p className="text-sm text-gray-600">
                        Respaldo automático de datos críticos
                      </p>
                    </div>
                    <Button variant="outline">
                      Configurar
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Importar/Exportar */}
              <Card>
                <CardHeader>
                  <CardTitle>Importar/Exportar Datos</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                      <div className="text-lg mb-1">📁</div>
                      <span>Importar Datos</span>
                      <span className="text-xs text-gray-500">CSV, Excel, JSON</span>
                    </Button>
                    <Button variant="outline" className="h-24 flex flex-col items-center justify-center">
                      <div className="text-lg mb-1">📤</div>
                      <span>Exportar Datos</span>
                      <span className="text-xs text-gray-500">Múltiples formatos</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Estado de Integraciones */}
              <Card>
                <CardHeader>
                  <CardTitle>Estado de las Integraciones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg border border-green-200">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-medium">Base de Datos</span>
                      </div>
                      <span className="text-sm text-green-700">Conectado</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg border border-yellow-200">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="font-medium">Servicio de Email</span>
                      </div>
                      <span className="text-sm text-yellow-700">Configuración Pendiente</span>
                    </div>
                    <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-200">
                      <div className="flex items-center gap-3">
                        <div className="w-3 h-3 bg-gray-400 rounded-full"></div>
                        <span className="font-medium">APIs Externas</span>
                      </div>
                      <span className="text-sm text-gray-600">No configurado</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}