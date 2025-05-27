
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Users } from "lucide-react";
import { UserManagement as UserManagementComponent } from "@/components/admin/UserManagement";

export default function UserManagement() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Gestión de Usuarios" 
            subtitle="Administración de usuarios del sistema" 
            icon={Users} 
          />
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <UserManagementComponent />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
