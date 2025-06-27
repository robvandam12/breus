import React from 'react';
import { LayoutDashboard, Anchor, Zap, Users, FileText, Shield, Book, Settings } from 'lucide-react';
import { NavLink } from 'react-router-dom';

export const ModularSidebar = () => {
  const menuItems = [
    { icon: LayoutDashboard, label: "Dashboard", path: "/" },
    { icon: Anchor, label: "Inmersiones", path: "/inmersiones" },
    { icon: Zap, label: "Operaciones", path: "/operaciones" },
    { icon: Users, label: "Cuadrillas de Buceo", path: "/cuadrillas-de-buceo" },
    { icon: FileText, label: "HPT", path: "/hpt" },
    { icon: Shield, label: "Anexo Bravo", path: "/anexo-bravo" },
    { icon: Book, label: "Bitácoras", path: "/bitacoras" },
    { icon: Settings, label: "Configuración", path: "/configuracion" },
  ];

  return (
    <nav className="flex flex-col space-y-1 p-4">
      {menuItems.map(({ icon: Icon, label, path }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `flex items-center gap-3 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
              isActive ? 'bg-blue-600 text-white' : 'text-zinc-700 hover:bg-zinc-100'
            }`
          }
        >
          <Icon className="w-5 h-5" />
          {label}
        </NavLink>
      ))}
    </nav>
  );
};
