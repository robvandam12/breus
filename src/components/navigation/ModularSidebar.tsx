import React from 'react';
import { 
  Calendar, 
  ChevronRight, 
  FileText, 
  Book,
  Folder,
  Anchor,
  BarChart3,
  Settings,
  Shield,
  LogOut,
  Users,
  Building,
  Menu,
  X,
  Wrench
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  SidebarHeader,
  SidebarFooter,
} from "@/components/ui/sidebar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { toast } from "@/hooks/use-toast";
import { useSidebar } from "@/components/ui/sidebar";
import { useModularSystem } from "@/hooks/useModularSystem";

const BreusLogo = ({ size = 32 }: { size?: number }) => (
  <svg 
    version="1.2" 
    xmlns="http://www.w3.org/2000/svg" 
    viewBox="0 0 500 305" 
    width={size} 
    height={(size * 305) / 500}
    className="fill-white"
  >
    <path d="m355.2 201.7c-33.7 40.1-84.1 67.3-135.9 73.1-4.5 0.6-8.4 4.5-7.7 9.7 0.6 4.5 4.5 7.8 8.4 7.8h0.6c55.7-5.9 111.3-35 147.5-79 3.2-3.8 2.6-9-1.3-12.2-2.6-3.3-8.4-3.3-11.6 0.6z"/>
    <path d="m276.3 68.5h-0.7l-64-45.3c-2-1.3-4.5-1.9-6.5-1.3-1.9 0.7-4.5 2-5.2 3.9l-19.4 29.7c-77.6 8.5-146.1 62.1-170.1 114.5 0 0.7 0 1.3-0.6 2 0 0.6 0 1.3 0 1.3 0 0.6 0 1.2 0 1.2 0 0.7 0 1.3 0.6 2 16.2 35.6 60.8 80.2 116.5 102.2l9.7-15.6 69.8-103.4c2.6-3.9 1.3-9.7-2.6-12.3-3.9-2.6-9.7-1.3-12.3 2.6l-68.5 103.4-3.3 3.9c-43.9-20-76.3-53-91.1-84 23.9-48.6 88.6-97.1 161.6-101.6l20.1-29.1 18.1 12.9 33 25.3c40.7 14.2 73.7 40.1 93.8 64.6 3.2 3.9 8.4 4.6 12.2 1.3 3.9-3.2 4.6-8.4 1.3-12.3-20.7-25.2-53-51-92.4-65.9z"/>
    <path d="m486.4 84.6c-3.2-3.2-9-3.2-12.2 0l-82.8 82.8c-2 2-2.6 3.9-2.6 5.9 0 2.5 0.6 4.5 2.6 6.4l82.8 82.8c3.2 3.2 9 3.2 12.2 0 3.3-3.2 3.3-9 0-12.2l-76.4-76.4 76.4-76.4c3.3-3.2 3.3-8.3 0-12.9z"/>
  </svg>
);

interface SidebarItemProps {
  label: string;
  icon: React.ComponentType<any>;
  to: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({ label, icon: Icon, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <SidebarMenuItem className={isActive ? "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground" : ""}>
      <Link to={to} className="w-full">
        <Icon className="mr-2 h-4 w-4" />
        {label}
      </Link>
    </SidebarMenuItem>
  );
};

const SidebarSubItem: React.FC<SidebarItemProps> = ({ label, icon: Icon, to }) => {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <SidebarMenuSubItem className={isActive ? "bg-accent text-accent-foreground hover:bg-accent hover:text-accent-foreground" : ""}>
      <Link to={to} className="w-full">
        {label}
      </Link>
    </SidebarMenuSubItem>
  );
};

const ModularSidebar = () => {
  const { collapsed, setCollapsed } = useSidebar();
  const { modules } = useModularSystem();
  const { signOut } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      toast({
        title: "Error al cerrar sesión",
        description: "Por favor, inténtalo de nuevo.",
        variant: "destructive",
      });
    }
  };

  return (
    <Sidebar className="bg-secondary text-secondary-foreground border-r">
      <SidebarTrigger
        className="absolute right-2 top-2 rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-accent-foreground"
        onClick={() => setCollapsed(!collapsed)}
      >
        {collapsed ? <Menu className="h-5 w-5" /> : <X className="h-5 w-5" />}
      </SidebarTrigger>
      <SidebarHeader className="text-center">
        <Link to="/">
          <BreusLogo size={32} />
          <h1 className="hidden pt-4 text-lg font-bold md:block">Breus</h1>
        </Link>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          <SidebarItem label="Dashboard" icon={BarChart3} to="/" />
          {modules?.includes('operaciones') && (
            <Collapsible>
              <SidebarMenuButton>
                <SidebarGroupLabel>
                  Operaciones
                  <CollapsibleTrigger className="ml-auto">
                    <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 peer-data-[state=open]:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
              </SidebarMenuButton>
              <CollapsibleContent>
                <SidebarGroupContent className="pl-2">
                  <SidebarSubItem label="Inmersiones" icon={Anchor} to="/inmersiones" />
                  <SidebarSubItem label="Bitácoras Supervisor" icon={FileText} to="/bitacoras/supervisor" />
                  <SidebarSubItem label="Bitácoras Buzo" icon={Users} to="/bitacoras/buzo" />
                  {/* <SidebarSubItem label="Equipos" icon={Wrench} to="/equipos" /> */}
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          )}
          {modules?.includes('empresas') && (
            <Collapsible>
              <SidebarMenuButton>
                <SidebarGroupLabel>
                  Empresas
                  <CollapsibleTrigger className="ml-auto">
                    <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 peer-data-[state=open]:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
              </SidebarMenuButton>
              <CollapsibleContent>
                <SidebarGroupContent className="pl-2">
                  <SidebarSubItem label="Salmoneras" icon={Building} to="/empresas/salmoneras" />
                  <SidebarSubItem label="Contratistas" icon={Users} to="/empresas/contratistas" />
                  <SidebarSubItem label="Centros" icon={Building} to="/empresas/centros" />
                  <SidebarSubItem label="Usuarios" icon={Users} to="/empresas/usuarios" />
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          )}
          {modules?.includes('admin') && (
            <Collapsible>
              <SidebarMenuButton>
                <SidebarGroupLabel>
                  Administración
                  <CollapsibleTrigger className="ml-auto">
                    <ChevronRight className="h-4 w-4 shrink-0 transition-transform duration-200 peer-data-[state=open]:rotate-90" />
                  </CollapsibleTrigger>
                </SidebarGroupLabel>
              </SidebarMenuButton>
              <CollapsibleContent>
                <SidebarGroupContent className="pl-2">
                  <SidebarSubItem label="Usuarios" icon={Users} to="/admin/users" />
                  <SidebarSubItem label="Roles" icon={Shield} to="/admin/roles" />
                  <SidebarSubItem label="Módulos" icon={Folder} to="/admin/modules" />
                  <SidebarSubItem label="Sistema" icon={Settings} to="/admin/system-monitoring" />
                </SidebarGroupContent>
              </CollapsibleContent>
            </Collapsible>
          )}
          {modules?.includes('reportes') && (
            <SidebarItem label="Reportes" icon={FileText} to="/reportes" />
          )}
          {modules?.includes('configuracion') && (
            <SidebarItem label="Configuración" icon={Settings} to="/configuracion" />
          )}
          {modules?.includes('integraciones') && (
            <SidebarItem label="Integraciones" icon={Anchor} to="/integraciones" />
          )}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenuItem onClick={handleSignOut}>
          <LogOut className="mr-2 h-4 w-4" />
          Cerrar sesión
        </SidebarMenuItem>
      </SidebarFooter>
    </Sidebar>
  );
};

export { ModularSidebar };
