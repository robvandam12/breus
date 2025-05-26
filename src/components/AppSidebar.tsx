import {
  LayoutDashboard,
  Settings,
  Building,
  MapPin,
  Users,
  FileText,
  Waves,
  User,
  AlertTriangle,
  CheckCircle,
  Clock
} from "lucide-react";

import { NavItem } from "@/types/nav";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { useAuthRoles } from '@/hooks/useAuthRoles';

export const AppSidebar = () => {
  const { profile, signOut } = useAuth();
  const { permissions, currentRole } = useAuthRoles();
  
  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  const navigationItems: NavItem[] = [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: LayoutDashboard,
      visible: true,
    },
    // Nuevo item para admin salmonera
    {
      title: "Panel Administrador",
      url: "/admin/salmonera",
      icon: Building,
      visible: currentRole === 'admin_salmonera',
    },
    {
      title: "Empresas",
      icon: Building,
      visible: permissions.manage_salmoneras || permissions.manage_sitios || permissions.manage_contratistas,
      children: [
        {
          title: "Salmoneras",
          url: "/empresas/salmoneras",
          icon: Building,
          visible: permissions.manage_salmoneras,
        },
        {
          title: "Sitios",
          url: "/empresas/sitios", 
          icon: MapPin,
          visible: permissions.manage_sitios,
        },
        {
          title: "Contratistas",
          url: "/empresas/contratistas",
          icon: Users,
          visible: permissions.manage_contratistas,
        },
      ],
    },
    {
      title: "Operaciones",
      url: "/operaciones",
      icon: Settings,
      visible: permissions.view_all_operaciones,
    },
    {
      title: "Inmersiones",
      url: "/operaciones/inmersiones",
      icon: Waves,
      visible: permissions.create_inmersion,
    },
    {
      title: "Bitácoras",
      icon: FileText,
      visible: permissions.create_bitacora_supervisor || permissions.create_bitacora_buzo,
      children: [
        {
          title: "Supervisor",
          url: "/operaciones/bitacoras-supervisor",
          icon: AlertTriangle,
          visible: permissions.create_bitacora_supervisor,
        },
        {
          title: "Buzo",
          url: "/operaciones/bitacoras-buzo",
          icon: CheckCircle,
          visible: permissions.create_bitacora_buzo,
        },
      ],
    },
    {
      title: "Reportes",
      url: "/reportes",
      icon: Clock,
      visible: true,
    },
  ];

  return (
    <aside className="bg-white border-r border-border/20 w-64 flex flex-col">
      <div className="h-16 flex items-center justify-between px-4 border-b border-border/20">
        <Link to="/" className="flex items-center gap-2 font-semibold">
          <Waves className="w-6 h-6 text-blue-600" />
          <span>BuceoApp</span>
        </Link>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-8 h-8 rounded-full overflow-hidden border border-border/20">
              <Avatar>
                <AvatarImage src="https://github.com/shadcn.png" alt="Imagen de perfil" />
                <AvatarFallback>{profile?.nombre[0]}{profile?.apellido[0]}</AvatarFallback>
              </Avatar>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem disabled>
              {profile?.nombre} {profile?.apellido}
            </DropdownMenuItem>
            <DropdownMenuItem disabled>
              {profile?.email}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Link to="/perfil" className="w-full h-full block">
                <User className="w-4 h-4 mr-2" />
                Mi Perfil
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              Cerrar Sesión
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <nav className="flex-1 py-4">
        {navigationItems.map((item, index) => {
          if (!item.visible) {
            return null;
          }

          if (item.children) {
            return (
              <details key={index} className="group [&_summary::-webkit-details-marker]:hidden">
                <summary className="flex items-center px-4 py-2 text-sm text-zinc-500 hover:bg-gray-50 hover:text-zinc-700 cursor-pointer">
                  <item.icon className="w-4 h-4 mr-2 text-zinc-400 group-hover:text-zinc-600" />
                  {item.title}
                </summary>
                <div className="pl-8 space-y-1">
                  {item.children.map((child, childIndex) =>
                    child.visible ? (
                      <Link
                        key={childIndex}
                        to={child.url}
                        className="block px-4 py-2 text-sm text-zinc-500 hover:bg-gray-50 hover:text-zinc-700"
                      >
                        {child.title}
                      </Link>
                    ) : null
                  )}
                </div>
              </details>
            );
          }

          return (
            <Link
              key={index}
              to={item.url}
              className="flex items-center px-4 py-2 text-sm text-zinc-500 hover:bg-gray-50 hover:text-zinc-700"
            >
              <item.icon className="w-4 h-4 mr-2 text-zinc-400" />
              {item.title}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
};
