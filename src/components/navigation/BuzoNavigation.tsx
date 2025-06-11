
import { 
  Home, 
  FileText, 
  Calendar, 
  Users, 
  Bell, 
  User,
  Settings
} from "lucide-react";

export const buzoNavigationItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
  },
  {
    title: "Mis Bitácoras",
    url: "/bitacoras",
    icon: FileText,
  },
  {
    title: "Operaciones",
    url: "/operaciones", 
    icon: Calendar,
  },
  {
    title: "Mi Equipo",
    url: "/equipo",
    icon: Users,
  },
  {
    title: "Notificaciones",
    url: "/notificaciones",
    icon: Bell,
  },
  {
    title: "Mi Perfil",
    url: "/profile-setup",
    icon: User,
  }
];

// Páginas que el buzo puede acceder
export const buzoAccessiblePages = [
  "/",
  "/bitacoras",
  "/operaciones",
  "/equipo", 
  "/notificaciones",
  "/profile-setup",
  "/onboarding"
];
