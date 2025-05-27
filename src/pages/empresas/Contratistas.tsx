
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Users } from "lucide-react";
import { ContratistaManager } from "@/components/contratistas/ContratistaManager";

export default function Contratistas() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Contratistas" 
            subtitle="Gestión de empresas contratistas" 
            icon={Users} 
          />
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <ContratistaManager />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
