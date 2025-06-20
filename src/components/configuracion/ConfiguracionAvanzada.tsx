import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Settings, Webhook, Bell, Database, Shield, Globe, Users, Key } from "lucide-react";
import { WebhookSettings } from './WebhookSettings';
import { NotificationSettings } from '../notifications/NotificationSettings';
import { CatalogSettings } from './CatalogSettings';
import { AccountSettings } from './AccountSettings';
import { PermissionsSettings } from './PermissionsSettings';
import { SecuritySettings } from './SecuritySettings';

export const ConfiguracionAvanzada = () => {
  const [activeTab, setActiveTab] = useState('webhooks');

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Settings className="w-8 h-8 text-blue-600" />
        <div>
          <h1 className="text-3xl font-bold">Configuración del Sistema</h1>
          <p className="text-gray-600">Gestiona webhooks, notificaciones, permisos, seguridad y configuraciones avanzadas</p>
        </div>
      </div>

      <Card>
        <CardContent className="p-6">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-8 bg-gray-100">
              <TabsTrigger value="webhooks" className="flex items-center gap-2 data-[state=active]:bg-white">
                <Webhook className="w-4 h-4" />
                Webhooks
              </TabsTrigger>
              <TabsTrigger value="notificaciones" className="flex items-center gap-2 data-[state=active]:bg-white">
                <Bell className="w-4 h-4" />
                Notificaciones
              </TabsTrigger>
              <TabsTrigger value="permisos" className="flex items-center gap-2 data-[state=active]:bg-white">
                <Users className="w-4 h-4" />
                Permisos
              </TabsTrigger>
              <TabsTrigger value="seguridad" className="flex items-center gap-2 data-[state=active]:bg-white">
                <Shield className="w-4 h-4" />
                Seguridad
              </TabsTrigger>
              <TabsTrigger value="catalogos" className="flex items-center gap-2 data-[state=active]:bg-white">
                <Database className="w-4 h-4" />
                Catálogos
              </TabsTrigger>
              <TabsTrigger value="cuenta" className="flex items-center gap-2 data-[state=active]:bg-white">
                <Key className="w-4 h-4" />
                Cuenta
              </TabsTrigger>
              <TabsTrigger value="sistema" className="flex items-center gap-2 data-[state=active]:bg-white">
                <Globe className="w-4 h-4" />
                Sistema
              </TabsTrigger>
              <TabsTrigger value="integraciones" className="flex items-center gap-2 data-[state=active]:bg-white">
                <Settings className="w-4 h-4" />
                Integraciones
              </TabsTrigger>
            </TabsList>

            <TabsContent value="webhooks" className="mt-6">
              <WebhookSettings />
            </TabsContent>

            <TabsContent value="notificaciones" className="mt-6">
              <NotificationSettings />
            </TabsContent>

            <TabsContent value="permisos" className="mt-6">
              <PermissionsSettings />
            </TabsContent>

            <TabsContent value="seguridad" className="mt-6">
              <SecuritySettings />
            </TabsContent>

            <TabsContent value="catalogos" className="mt-6">
              <CatalogSettings />
            </TabsContent>

            <TabsContent value="cuenta" className="mt-6">
              <AccountSettings />
            </TabsContent>

            <TabsContent value="sistema" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Configuración del Sistema</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Zona Horaria</h3>
                        <p className="text-sm text-gray-600">America/Santiago (UTC-3)</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Idioma del Sistema</h3>
                        <p className="text-sm text-gray-600">Español (Chile)</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Formato de Fecha</h3>
                        <p className="text-sm text-gray-600">DD/MM/YYYY</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Auto-guardado</h3>
                        <p className="text-sm text-gray-600">Cada 30 segundos en formularios</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Configuración de Rendimiento</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Cache del Sistema</h3>
                        <p className="text-sm text-gray-600">Redis activo - 15 minutos TTL</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Compresión de Datos</h3>
                        <p className="text-sm text-gray-600">Gzip habilitado para API responses</p>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Límites de Rate</h3>
                        <p className="text-sm text-gray-600">100 requests/minuto por usuario</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="integraciones" className="mt-6">
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Integraciones Externas</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Mapbox</h3>
                        <p className="text-sm text-gray-600">Para geolocalización de sitios operativos</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                            Conectado
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Supabase Realtime</h3>
                        <p className="text-sm text-gray-600">Actualizaciones en tiempo real del dashboard</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                            Activo
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">Microsoft Fabric</h3>
                        <p className="text-sm text-gray-600">Data lake corporativo (Roadmap)</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                            Planificado
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">AI Agents</h3>
                        <p className="text-sm text-gray-600">LangChain + vectors para consultas naturales (Roadmap)</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-gray-100 text-gray-700">
                            Planificado
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>APIs y Webhooks</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid gap-4">
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">REST API</h3>
                        <p className="text-sm text-gray-600">v1.0 - Documentación Swagger disponible</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-green-100 text-green-700">
                            Activo
                          </span>
                        </div>
                      </div>
                      
                      <div className="p-4 border rounded-lg">
                        <h3 className="font-medium mb-2">GraphQL Endpoint</h3>
                        <p className="text-sm text-gray-600">Para consultas complejas de datos relacionados</p>
                        <div className="mt-2">
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                            Beta
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};
