
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Book } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BitacorasSupervisor() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Bitácoras Supervisor" 
            subtitle="Gestión de bitácoras de supervisor" 
            icon={Book} 
          />
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Bitácoras de Supervisor</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Módulo de bitácoras de supervisor en desarrollo.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
