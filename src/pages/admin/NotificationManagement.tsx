
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Bell } from "lucide-react";
import { NotificationSettings } from "@/components/notifications/NotificationSettings";
import { SecurityAlertsManager } from "@/components/alerts/SecurityAlertsManager";

export default function NotificationManagement() {
  return (
    <MainLayout
      title="Gestión de Notificaciones"
      subtitle="Centro de control para notificaciones y alertas del sistema"
      icon={Bell}
    >
      <Tabs defaultValue="settings" className="space-y-6">
        <TabsList>
          <TabsTrigger value="settings">Configuración</TabsTrigger>
          <TabsTrigger value="alerts">Alertas de Seguridad</TabsTrigger>
        </TabsList>

        <TabsContent value="settings">
          <NotificationSettings />
        </TabsContent>

        <TabsContent value="alerts">
          <SecurityAlertsManager />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
