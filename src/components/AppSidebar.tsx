
import React from 'react';
import { Sidebar, SidebarContent, SidebarHeader, SidebarFooter } from '@/components/ui/sidebar';
import { SidebarContent as ModularSidebarContent } from '@/components/navigation/SidebarContent';
import { BreusLogo } from '@/components/ui/breus-logo';

export function AppSidebar() {
  return (
    <Sidebar className="border-r border-gray-200">
      <SidebarHeader className="p-6 border-b border-gray-100">
        <div className="flex items-center gap-3">
          <BreusLogo size={40} />
          <div>
            <h2 className="text-lg font-bold text-gray-900">Breus</h2>
            <p className="text-xs text-gray-600">Sistema de Gestión</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="flex-1">
        <ModularSidebarContent />
      </SidebarContent>
      
      <SidebarFooter className="p-4 border-t border-gray-100">
        <div className="text-xs text-gray-500 text-center">
          © 2024 Breus
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
