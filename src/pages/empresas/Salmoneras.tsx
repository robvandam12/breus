
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Building } from "lucide-react";
import { SalmoneraManager } from "@/components/salmoneras/SalmoneraManager";

export default function Salmoneras() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Salmoneras" 
            subtitle="Gestión de empresas salmoneras" 
            icon={Building} 
          />
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <SalmoneraManager />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
