
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Anchor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Inmersiones() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Inmersiones" 
            subtitle="Gestión de inmersiones de buceo" 
            icon={Anchor} 
          />
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Inmersiones de Buceo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Módulo de gestión de inmersiones en desarrollo.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
