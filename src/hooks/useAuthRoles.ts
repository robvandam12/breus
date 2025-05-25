
import { useAuth } from '@/hooks/useAuth';

export interface PermissionCheck {
  create_operacion: boolean;
  create_hpt: boolean;
  create_anexo_bravo: boolean;
  create_inmersion: boolean;
  create_bitacora_supervisor: boolean;
  create_bitacora_buzo: boolean;
  manage_salmoneras: boolean;
  manage_sitios: boolean;
  manage_contratistas: boolean;
  view_all_operaciones: boolean;
  manage_webhooks: boolean;
  sign_documents: boolean;
}

export const useAuthRoles = () => {
  const { profile, hasPermission, isRole } = useAuth();

  const permissions: PermissionCheck = {
    create_operacion: hasPermission('create_operacion') || isRole('admin_salmonera') || isRole('supervisor'),
    create_hpt: hasPermission('manage_hpt') || isRole('supervisor') || isRole('admin_servicio'),
    create_anexo_bravo: hasPermission('manage_anexo_bravo') || isRole('supervisor') || isRole('admin_servicio'),
    create_inmersion: hasPermission('create_inmersiones') || isRole('supervisor') || isRole('admin_servicio'),
    create_bitacora_supervisor: hasPermission('create_bitacora_supervisor') || isRole('supervisor') || isRole('admin_servicio'),
    create_bitacora_buzo: hasPermission('create_bitacora_buzo') || isRole('buzo') || isRole('supervisor'),
    manage_salmoneras: hasPermission('manage_salmonera') || isRole('superuser'),
    manage_sitios: hasPermission('manage_sitios') || isRole('admin_salmonera') || isRole('superuser'),
    manage_contratistas: hasPermission('manage_contratistas') || isRole('admin_salmonera') || isRole('superuser'),
    view_all_operaciones: hasPermission('view_operaciones') || isRole('admin_salmonera') || isRole('admin_servicio') || isRole('superuser'),
    manage_webhooks: isRole('admin_salmonera') || isRole('admin_servicio') || isRole('superuser'),
    sign_documents: hasPermission('sign_bitacoras') || isRole('supervisor') || isRole('admin_servicio')
  };

  const canAccessPage = (page: string): boolean => {
    switch (page) {
      case 'salmoneras':
        return isRole('superuser');
      case 'sitios':
        return permissions.manage_sitios;
      case 'contratistas':
        return permissions.manage_contratistas;
      case 'operaciones':
        return permissions.view_all_operaciones;
      case 'configuracion':
        return isRole('admin_salmonera') || isRole('admin_servicio') || isRole('superuser');
      case 'reportes':
        return true; // Todos pueden ver reportes con sus propios datos
      default:
        return true;
    }
  };

  const getRoleBadgeColor = (role: string): string => {
    switch (role) {
      case 'superuser':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'admin_salmonera':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'admin_servicio':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'supervisor':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'buzo':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRoleLabel = (role: string): string => {
    switch (role) {
      case 'superuser':
        return 'Super Usuario';
      case 'admin_salmonera':
        return 'Admin Salmonera';
      case 'admin_servicio':
        return 'Admin Servicio';
      case 'supervisor':
        return 'Supervisor';
      case 'buzo':
        return 'Buzo';
      default:
        return role;
    }
  };

  return {
    permissions,
    canAccessPage,
    getRoleBadgeColor,
    getRoleLabel,
    currentRole: profile?.role || 'buzo',
    salmonera_id: profile?.salmonera_id,
    servicio_id: profile?.servicio_id
  };
};
