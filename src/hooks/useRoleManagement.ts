
import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";

interface Permission {
  id: string;
  name: string;
  description: string;
  category: string;
}

interface Role {
  id: string;
  name: string;
  description: string;
  permissions: string[];
}

const defaultPermissions: Permission[] = [
  // Gestión de Usuarios
  { id: 'create_users', name: 'Crear Usuarios', description: 'Permite crear nuevos usuarios', category: 'usuarios' },
  { id: 'edit_users', name: 'Editar Usuarios', description: 'Permite editar información de usuarios', category: 'usuarios' },
  { id: 'delete_users', name: 'Eliminar Usuarios', description: 'Permite eliminar usuarios', category: 'usuarios' },
  { id: 'view_users', name: 'Ver Usuarios', description: 'Permite ver listado de usuarios', category: 'usuarios' },
  
  // Gestión de Empresas
  { id: 'manage_salmoneras', name: 'Gestionar Salmoneras', description: 'Gestión completa de salmoneras', category: 'empresas' },
  { id: 'manage_contratistas', name: 'Gestionar Contratistas', description: 'Gestión completa de contratistas', category: 'empresas' },
  { id: 'view_empresas', name: 'Ver Empresas', description: 'Permite ver información de empresas', category: 'empresas' },
  
  // Operaciones
  { id: 'create_operaciones', name: 'Crear Operaciones', description: 'Permite crear nuevas operaciones', category: 'operaciones' },
  { id: 'manage_hpt', name: 'Gestionar HPT', description: 'Gestión de Hojas de Planificación de Trabajos', category: 'operaciones' },
  { id: 'manage_anexo_bravo', name: 'Gestionar Anexo Bravo', description: 'Gestión de Anexos Bravo', category: 'operaciones' },
  { id: 'create_inmersiones', name: 'Crear Inmersiones', description: 'Permite crear y gestionar inmersiones', category: 'operaciones' },
  
  // Bitácoras
  { id: 'create_bitacora_supervisor', name: 'Bitácora Supervisor', description: 'Crear y gestionar bitácoras de supervisor', category: 'bitacoras' },
  { id: 'create_bitacora_buzo', name: 'Bitácora Buzo', description: 'Crear y gestionar bitácoras de buzo', category: 'bitacoras' },
  { id: 'sign_bitacoras', name: 'Firmar Bitácoras', description: 'Permite firmar y aprobar bitácoras', category: 'bitacoras' },
  
  // Reportes
  { id: 'view_reports', name: 'Ver Reportes', description: 'Acceso a reportes y estadísticas', category: 'reportes' },
  { id: 'export_data', name: 'Exportar Datos', description: 'Permite exportar información', category: 'reportes' },
  
  // Administración
  { id: 'manage_roles', name: 'Gestionar Roles', description: 'Gestión completa de roles y permisos', category: 'administracion' },
  { id: 'system_settings', name: 'Configuración Sistema', description: 'Acceso a configuración del sistema', category: 'administracion' }
];

const defaultRoles: Role[] = [
  {
    id: 'superuser',
    name: 'Super Usuario',
    description: 'Acceso completo al sistema',
    permissions: defaultPermissions.map(p => p.id)
  },
  {
    id: 'admin_salmonera',
    name: 'Admin Salmonera',
    description: 'Administrador de empresa salmonera',
    permissions: [
      'view_users', 'create_users', 'edit_users',
      'manage_salmoneras', 'manage_contratistas', 'view_empresas',
      'create_operaciones', 'manage_hpt', 'manage_anexo_bravo',
      'view_reports', 'export_data'
    ]
  },
  {
    id: 'admin_servicio',
    name: 'Admin Servicio',
    description: 'Administrador de empresa de servicios',
    permissions: [
      'view_users', 'create_users', 'edit_users',
      'view_empresas', 'create_operaciones',
      'manage_hpt', 'manage_anexo_bravo', 'create_inmersiones',
      'create_bitacora_supervisor', 'sign_bitacoras',
      'view_reports'
    ]
  },
  {
    id: 'supervisor',
    name: 'Supervisor',
    description: 'Supervisor de operaciones de buceo',
    permissions: [
      'view_users', 'view_empresas',
      'create_inmersiones', 'manage_hpt', 'manage_anexo_bravo',
      'create_bitacora_supervisor', 'sign_bitacoras',
      'view_reports'
    ]
  },
  {
    id: 'buzo',
    name: 'Buzo',
    description: 'Buzo profesional',
    permissions: [
      'view_empresas', 'create_bitacora_buzo', 'view_reports'
    ]
  }
];

export const useRoleManagement = () => {
  const [permissions] = useState<Permission[]>(defaultPermissions);
  const [roles, setRoles] = useState<Role[]>(defaultRoles);
  const [isLoading, setIsLoading] = useState(false);

  const updateRolePermissions = async (roleId: string, newPermissions: string[]) => {
    setIsLoading(true);
    try {
      setRoles(prevRoles => 
        prevRoles.map(role => 
          role.id === roleId 
            ? { ...role, permissions: newPermissions }
            : role
        )
      );
      
      toast({
        title: "Permisos actualizados",
        description: "Los permisos del rol han sido actualizados exitosamente.",
      });
    } catch (error) {
      console.error('Error updating role permissions:', error);
      toast({
        title: "Error",
        description: "No se pudieron actualizar los permisos.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleById = (roleId: string) => {
    return roles.find(role => role.id === roleId);
  };

  const getPermissionsByCategory = () => {
    const categories: { [key: string]: Permission[] } = {};
    permissions.forEach(permission => {
      if (!categories[permission.category]) {
        categories[permission.category] = [];
      }
      categories[permission.category].push(permission);
    });
    return categories;
  };

  const hasPermission = (roleId: string, permissionId: string) => {
    const role = getRoleById(roleId);
    return role?.permissions.includes(permissionId) || false;
  };

  return {
    permissions,
    roles,
    isLoading,
    updateRolePermissions,
    getRoleById,
    getPermissionsByCategory,
    hasPermission
  };
};
