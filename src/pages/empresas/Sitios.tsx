
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { MapPin } from "lucide-react";
import { SitiosManager } from "@/components/sitios/SitiosManager";

export default function Sitios() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Sitios" 
            subtitle="Gestión de sitios de trabajo" 
            icon={MapPin} 
          />
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <SitiosManager />
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
