
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Building } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function AdminSalmoneraPage() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Administración Salmonera" 
            subtitle="Panel de administración para salmoneras" 
            icon={Building} 
          />
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle>Panel Administrativo</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">Panel administrativo para salmoneras.</p>
                </CardContent>
              </Card>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
