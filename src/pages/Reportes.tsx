
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { BarChart3 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Reportes() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Reportes" 
            subtitle="Análisis y reportes de operaciones" 
            icon={BarChart3} 
          />
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Reportes del Sistema</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Módulo de reportes en desarrollo.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
