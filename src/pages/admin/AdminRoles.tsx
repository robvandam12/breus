
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Shield } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminRoles() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Roles y Permisos" 
            subtitle="Gestión de roles y permisos del sistema" 
            icon={Shield} 
          />
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Administración de Roles</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Módulo de gestión de roles en desarrollo.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
