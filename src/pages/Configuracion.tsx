
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Settings, Save } from "lucide-react";

export default function Configuracion() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Configuración" 
            subtitle="Configuración del sistema y preferencias" 
            icon={Settings} 
          >
            <Button>
              <Save className="w-4 h-4 mr-2" />
              Guardar Cambios
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto bg-gray-50">
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Settings className="w-5 h-5 text-blue-600" />
                    Configuración del Sistema
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <div className="space-y-4">
                    <Settings className="w-16 h-16 text-blue-600 mx-auto" />
                    <h3 className="text-lg font-semibold">Configuración</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Configure las preferencias del sistema y parámetros de la aplicación.
                    </p>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
