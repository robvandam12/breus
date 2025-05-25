
import { 
  Calendar, 
  ChevronRight, 
  FileText, 
  Book,
  Folder,
  Anchor,
  BarChart3,
  Settings,
  Shield
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
import { Link } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: BarChart3,
    url: "/",
    badge: "3"
  },
  {
    title: "Empresas",
    icon: Folder,
    items: [
      { title: "Salmoneras", url: "/empresas/salmoneras" },
      { title: "Sitios", url: "/empresas/sitios" },
      { title: "Contratistas", url: "/empresas/contratistas" }
    ]
  },
  {
    title: "Operaciones",
    icon: Calendar,
    url: "/operaciones",
    badge: "12"
  },
  {
    title: "Formularios",
    icon: FileText,
    items: [
      { title: "HPT", url: "/formularios/hpt" },
      { title: "Anexo Bravo", url: "/formularios/anexo-bravo" }
    ]
  },
  {
    title: "Inmersiones",
    icon: Anchor,
    url: "/inmersiones",
    badge: "7"
  },
  {
    title: "Bitácoras",
    icon: Book,
    url: "/bitacoras"
  },
  {
    title: "Reportes",
    icon: BarChart3,
    url: "/reportes"
  },
  {
    title: "Configuración",
    icon: Settings,
    url: "/configuracion"
  },
  {
    title: "Admin",
    icon: Shield,
    items: [
      { title: "Roles y Permisos", url: "/admin/roles" }
    ],
    roleRequired: "superuser"
  }
];

export function AppSidebar() {
  // TODO: Get user role from auth context
  const userRole = "superuser"; // This should come from auth

  const filteredMenuItems = menuItems.filter(item => 
    !item.roleRequired || item.roleRequired === userRole
  );

  return (
    <Sidebar className="border-r border-border/40">
      <SidebarHeader className="border-b border-border/40 p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-zinc-800 rounded-lg flex items-center justify-center">
            <span className="text-white font-bold text-sm">B</span>
          </div>
          <div>
            <h2 className="font-semibold text-lg">Breus</h2>
            <p className="text-xs text-zinc-500">Gestión de Buceo</p>
          </div>
        </div>
      </SidebarHeader>
      
      <SidebarContent className="p-2">
        <SidebarGroup>
          <SidebarGroupLabel className="text-xs uppercase tracking-wider font-medium text-zinc-500 mb-2">
            Navegación Principal
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {filteredMenuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  {item.items ? (
                    <Collapsible defaultOpen className="group/collapsible">
                      <CollapsibleTrigger asChild>
                        <SidebarMenuButton className="w-full">
                          <item.icon className="w-4 h-4" />
                          <span className="flex-1">{item.title}</span>
                          <ChevronRight className="w-4 h-4 transition-transform group-data-[state=open]/collapsible:rotate-90" />
                        </SidebarMenuButton>
                      </CollapsibleTrigger>
                      <CollapsibleContent>
                        <SidebarMenuSub>
                          {item.items.map((subItem) => (
                            <SidebarMenuSubItem key={subItem.title}>
                              <SidebarMenuSubButton asChild>
                                <Link to={subItem.url}>
                                  <span>{subItem.title}</span>
                                </Link>
                              </SidebarMenuSubButton>
                            </SidebarMenuSubItem>
                          ))}
                        </SidebarMenuSub>
                      </CollapsibleContent>
                    </Collapsible>
                  ) : (
                    <SidebarMenuButton asChild>
                      <Link to={item.url} className="flex items-center justify-between w-full">
                        <div className="flex items-center gap-3">
                          <item.icon className="w-4 h-4" />
                          <span>{item.title}</span>
                        </div>
                        {item.badge && (
                          <Badge variant="secondary" className="h-5 text-xs">
                            {item.badge}
                          </Badge>
                        )}
                      </Link>
                    </SidebarMenuButton>
                  )}
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
      
      <SidebarFooter className="border-t border-border/40 p-4">
        <div className="flex items-center gap-3 p-2 rounded-lg bg-zinc-100">
          <div className="w-8 h-8 bg-zinc-600 rounded-full flex items-center justify-center">
            <span className="text-white font-medium text-sm">JS</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate">Juan Supervisor</p>
            <p className="text-xs text-zinc-500 truncate">supervisor@breus.cl</p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}
