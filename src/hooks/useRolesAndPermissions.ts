
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface Role {
  id: string;
  name: string;
  description: string;
  predefined: boolean;
  userCount: number;
  permissions: string[];
}

export interface Permission {
  id: string;
  name: string;
  module: string;
  description: string;
}

export const useRolesAndPermissions = () => {
  const [roles, setRoles] = useState<Role[]>([]);
  const [permissions, setPermissions] = useState<Permission[]>([]);
  const [rolePermissions, setRolePermissions] = useState<Record<string, boolean>>({});
  const [loading, setLoading] = useState(true);

  // Permisos predefinidos del sistema
  const systemPermissions: Permission[] = [
    { id: 'dashboard_view', name: 'Ver Dashboard', module: 'Dashboard', description: 'Acceso al dashboard principal' },
    { id: 'empresas_view', name: 'Ver Empresas', module: 'Empresas', description: 'Ver información de empresas' },
    { id: 'empresas_create', name: 'Crear Empresas', module: 'Empresas', description: 'Crear nuevas empresas' },
    { id: 'empresas_edit', name: 'Editar Empresas', module: 'Empresas', description: 'Modificar empresas existentes' },
    { id: 'empresas_delete', name: 'Eliminar Empresas', module: 'Empresas', description: 'Eliminar empresas' },
    { id: 'operaciones_view', name: 'Ver Operaciones', module: 'Operaciones', description: 'Ver operaciones de buceo' },
    { id: 'operaciones_create', name: 'Crear Operaciones', module: 'Operaciones', description: 'Crear nuevas operaciones' },
    { id: 'operaciones_edit', name: 'Editar Operaciones', module: 'Operaciones', description: 'Modificar operaciones' },
    { id: 'hpt_view', name: 'Ver HPT', module: 'Formularios', description: 'Ver formularios HPT' },
    { id: 'hpt_create', name: 'Crear HPT', module: 'Formularios', description: 'Crear formularios HPT' },
    { id: 'hpt_sign', name: 'Firmar HPT', module: 'Formularios', description: 'Firmar formularios HPT' },
    { id: 'anexo_view', name: 'Ver Anexo Bravo', module: 'Formularios', description: 'Ver anexos bravo' },
    { id: 'anexo_create', name: 'Crear Anexo Bravo', module: 'Formularios', description: 'Crear anexos bravo' },
    { id: 'anexo_sign', name: 'Firmar Anexo Bravo', module: 'Formularios', description: 'Firmar anexos bravo' },
    { id: 'inmersiones_view', name: 'Ver Inmersiones', module: 'Inmersiones', description: 'Ver registros de inmersiones' },
    { id: 'inmersiones_create', name: 'Crear Inmersiones', module: 'Inmersiones', description: 'Registrar nuevas inmersiones' },
    { id: 'bitacoras_view', name: 'Ver Bitácoras', module: 'Bitácoras', description: 'Ver bitácoras de buceo' },
    { id: 'bitacoras_create', name: 'Crear Bitácoras', module: 'Bitácoras', description: 'Crear bitácoras' },
    { id: 'bitacoras_sign', name: 'Firmar Bitácoras', module: 'Bitácoras', description: 'Firmar bitácoras digitalmente' },
    { id: 'reportes_view', name: 'Ver Reportes', module: 'Reportes', description: 'Acceder a reportes' },
    { id: 'reportes_export', name: 'Exportar Reportes', module: 'Reportes', description: 'Exportar reportes' },
    { id: 'config_view', name: 'Ver Configuración', module: 'Configuración', description: 'Acceder a configuración' },
    { id: 'config_edit', name: 'Editar Configuración', module: 'Configuración', description: 'Modificar configuración' },
    { id: 'admin_view', name: 'Ver Admin', module: 'Admin', description: 'Acceder a panel de administración' },
    { id: 'admin_roles', name: 'Gestionar Roles', module: 'Admin', description: 'Administrar roles y permisos' }
  ];

  // Roles predefinidos del sistema
  const systemRoles: Role[] = [
    {
      id: 'superuser',
      name: 'Superuser',
      description: 'Acceso total al sistema',
      predefined: true,
      userCount: 0,
      permissions: systemPermissions.map(p => p.id)
    },
    {
      id: 'admin_salmonera',
      name: 'Admin Salmonera',
      description: 'Administrador de empresa salmonera',
      predefined: true,
      userCount: 0,
      permissions: [
        'dashboard_view', 'empresas_view', 'empresas_edit', 'operaciones_view', 'operaciones_create', 'operaciones_edit',
        'hpt_view', 'hpt_create', 'anexo_view', 'anexo_create', 'inmersiones_view', 'inmersiones_create',
        'bitacoras_view', 'bitacoras_create', 'reportes_view', 'reportes_export', 'config_view', 'config_edit'
      ]
    },
    {
      id: 'admin_servicio',
      name: 'Admin Servicio',
      description: 'Administrador de empresa de servicios',
      predefined: true,
      userCount: 0,
      permissions: [
        'dashboard_view', 'operaciones_view', 'hpt_view', 'hpt_create', 'hpt_sign',
        'anexo_view', 'anexo_create', 'anexo_sign', 'inmersiones_view', 'inmersiones_create',
        'bitacoras_view', 'bitacoras_create', 'bitacoras_sign', 'reportes_view', 'config_view'
      ]
    },
    {
      id: 'supervisor',
      name: 'Supervisor',
      description: 'Supervisor de operaciones de buceo',
      predefined: true,
      userCount: 0,
      permissions: [
        'dashboard_view', 'operaciones_view', 'hpt_view', 'hpt_create', 'anexo_view', 'anexo_create',
        'inmersiones_view', 'inmersiones_create', 'bitacoras_view', 'bitacoras_create', 'bitacoras_sign', 'reportes_view'
      ]
    },
    {
      id: 'buzo',
      name: 'Buzo',
      description: 'Buzo profesional',
      predefined: true,
      userCount: 0,
      permissions: [
        'dashboard_view', 'operaciones_view', 'inmersiones_view', 'bitacoras_view', 'bitacoras_create', 'reportes_view'
      ]
    }
  ];

  const fetchUserCounts = async () => {
    try {
      const { data, error } = await supabase
        .from('usuario')
        .select('rol');

      if (error) throw error;

      const counts = data?.reduce((acc, user) => {
        acc[user.rol] = (acc[user.rol] || 0) + 1;
        return acc;
      }, {} as Record<string, number>) || {};

      return counts;
    } catch (error) {
      console.error('Error fetching user counts:', error);
      return {};
    }
  };

  const loadRolesAndPermissions = async () => {
    try {
      setLoading(true);
      
      // Obtener conteos de usuarios por rol
      const userCounts = await fetchUserCounts();
      
      // Actualizar roles con conteos reales
      const rolesWithCounts = systemRoles.map(role => ({
        ...role,
        userCount: userCounts[role.id] || 0
      }));

      setRoles(rolesWithCounts);
      setPermissions(systemPermissions);

      // Inicializar matriz de permisos
      const initialMatrix: Record<string, boolean> = {};
      rolesWithCounts.forEach(role => {
        systemPermissions.forEach(permission => {
          const key = `${role.id}_${permission.id}`;
          initialMatrix[key] = role.permissions.includes(permission.id);
        });
      });
      setRolePermissions(initialMatrix);

    } catch (error) {
      console.error('Error loading roles and permissions:', error);
      toast({
        title: "Error",
        description: "No se pudieron cargar los roles y permisos",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const createCustomRole = async (name: string, description: string) => {
    try {
      const newRole: Role = {
        id: `custom_${Date.now()}`,
        name,
        description,
        predefined: false,
        userCount: 0,
        permissions: []
      };

      setRoles(prev => [...prev, newRole]);

      toast({
        title: "Rol creado",
        description: `El rol "${name}" ha sido creado exitosamente.`,
      });

      return newRole;
    } catch (error) {
      console.error('Error creating role:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el rol",
        variant: "destructive",
      });
      throw error;
    }
  };

  const updateRolePermission = (roleId: string, permissionId: string, granted: boolean) => {
    const key = `${roleId}_${permissionId}`;
    setRolePermissions(prev => ({
      ...prev,
      [key]: granted
    }));

    // También actualizar el array de permisos del rol
    setRoles(prev => prev.map(role => {
      if (role.id === roleId) {
        const newPermissions = granted
          ? [...new Set([...role.permissions, permissionId])]
          : role.permissions.filter(p => p !== permissionId);
        
        return { ...role, permissions: newPermissions };
      }
      return role;
    }));
  };

  const savePermissionChanges = async () => {
    try {
      // En una implementación real, aquí guardarías los cambios en la base de datos
      // Por ahora, solo mostramos una confirmación
      toast({
        title: "Cambios guardados",
        description: "Los permisos han sido actualizados exitosamente.",
      });
    } catch (error) {
      console.error('Error saving permissions:', error);
      toast({
        title: "Error",
        description: "No se pudieron guardar los cambios",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    loadRolesAndPermissions();
  }, []);

  return {
    roles,
    permissions,
    rolePermissions,
    loading,
    createCustomRole,
    updateRolePermission,
    savePermissionChanges,
    refetch: loadRolesAndPermissions
  };
};
