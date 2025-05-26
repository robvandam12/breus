
import { useState } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { 
  Settings,
  Webhook,
  Bell,
  Key,
  User,
  Globe,
  Shield,
  Database,
  Mail
} from "lucide-react";
import { WebhookManagement } from "@/components/configuration/WebhookManagement";
import { NotificationSettings } from "@/components/configuration/NotificationSettings";

export default function Configuracion() {
  const [activeTab, setActiveTab] = useState('webhooks');

  return (
    <>
      {/* Header */}
      <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
        <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
          <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
          <div className="flex items-center gap-3">
            <Settings className="w-6 h-6 text-zinc-600" />
            <div>
              <h1 className="text-xl font-semibold text-zinc-900">Configuración</h1>
              <p className="text-sm text-zinc-500">Configurar sistema y notificaciones</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="webhooks" className="flex items-center gap-2">
                <Webhook className="w-4 h-4" />
                Webhooks
              </TabsTrigger>
              <TabsTrigger value="notifications" className="flex items-center gap-2">
                <Bell className="w-4 h-4" />
                Notificaciones
              </TabsTrigger>
              <TabsTrigger value="security" className="flex items-center gap-2">
                <Shield className="w-4 h-4" />
                Seguridad
              </TabsTrigger>
              <TabsTrigger value="account" className="flex items-center gap-2">
                <User className="w-4 h-4" />
                Cuenta
              </TabsTrigger>
            </TabsList>

            <TabsContent value="webhooks">
              <WebhookManagement />
            </TabsContent>

            <TabsContent value="notifications">
              <NotificationSettings />
            </TabsContent>

            <TabsContent value="security">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="w-5 h-5" />
                    Configuración de Seguridad
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="two-factor">Autenticación de dos factores</Label>
                        <p className="text-sm text-zinc-500">Añade una capa extra de seguridad</p>
                      </div>
                      <Switch id="two-factor" />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="session-timeout">Expiración automática de sesión</Label>
                        <p className="text-sm text-zinc-500">Cerrar sesión después de inactividad</p>
                      </div>
                      <Switch id="session-timeout" defaultChecked />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="api-key">Clave API</Label>
                      <div className="flex gap-2">
                        <Input 
                          id="api-key" 
                          type="password" 
                          value="••••••••••••••••••••••••••••••••"
                          readOnly
                        />
                        <Button variant="outline">Regenerar</Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="account">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <User className="w-5 h-5" />
                    Información de la Cuenta
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="first-name">Nombre</Label>
                        <Input id="first-name" defaultValue="Usuario" />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="last-name">Apellido</Label>
                        <Input id="last-name" defaultValue="Admin" />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input id="email" type="email" defaultValue="admin@breus.cl" />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="role">Rol actual</Label>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">Superuser</Badge>
                        <span className="text-sm text-zinc-500">Acceso completo al sistema</span>
                      </div>
                    </div>

                    <div className="pt-4 border-t">
                      <Button>Guardar Cambios</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </>
  );
}
