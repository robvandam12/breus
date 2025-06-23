
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useModularSystem } from "./useModularSystem";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface Integration {
  id: string;
  nombre: string;
  tipo: 'api' | 'webhook' | 'database' | 'file_sync' | 'saas';
  descripcion: string;
  estado: 'activa' | 'inactiva' | 'error' | 'configurando' | 'testing';
  configuracion: any;
  ultima_sincronizacion: string | null;
  proxima_sincronizacion: string | null;
  url_endpoint?: string;
  metodo_autenticacion?: 'api_key' | 'oauth' | 'basic' | 'bearer';
  frecuencia_sync?: 'real_time' | 'hourly' | 'daily' | 'weekly' | 'manual';
  webhook_url?: string;
  eventos_soportados?: string[];
  configuracion_avanzada?: any;
  metricas?: {
    total_requests: number;
    successful_requests: number;
    failed_requests: number;
    avg_response_time: number;
    uptime_percentage: number;
  };
  created_at: string;
  updated_at: string;
}

export interface IntegrationLog {
  id: string;
  integration_id: string;
  timestamp: string;
  tipo: 'sync' | 'error' | 'config' | 'test' | 'webhook' | 'auth';
  mensaje: string;
  detalles: any;
  estado: 'success' | 'warning' | 'error' | 'info';
  duracion_ms?: number;
  response_code?: number;
  metadata?: any;
}

export interface IntegrationTemplate {
  id: string;
  nombre: string;
  descripcion: string;
  proveedor: string;
  tipo: string;
  icono: string;
  configuracion_default: any;
  documentacion_url?: string;
  categoria: 'monitoring' | 'erp' | 'reporting' | 'safety' | 'communication';
}

export const useIntegrations = () => {
  const { hasModuleAccess, modules } = useModularSystem();
  const { profile } = useAuth();
  const queryClient = useQueryClient();

  const canAccessIntegrations = hasModuleAccess(modules.EXTERNAL_INTEGRATIONS);

  const { data: integrations = [], isLoading } = useQuery({
    queryKey: ['integrations', profile?.salmonera_id],
    queryFn: async () => {
      if (!canAccessIntegrations) return [];
      
      // Simulación de integraciones expandidas
      return [
        {
          id: '1',
          nombre: 'API Mareógrafo SHOA',
          tipo: 'api',
          descripcion: 'Sincronización de datos oceánicos y meteorológicos',
          estado: 'activa',
          url_endpoint: 'https://api.shoa.cl/v2/oceanografia',
          metodo_autenticacion: 'api_key',
          frecuencia_sync: 'hourly',
          configuracion: {
            api_key: '***HIDDEN***',
            estaciones: ['valparaiso', 'puerto_montt', 'punta_arenas'],
            parametros: ['altura_ola', 'direccion_viento', 'temperatura']
          },
          ultima_sincronizacion: '2024-01-15T10:30:00Z',
          proxima_sincronizacion: '2024-01-15T11:30:00Z',
          metricas: {
            total_requests: 1250,
            successful_requests: 1200,
            failed_requests: 50,
            avg_response_time: 245,
            uptime_percentage: 96.8
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          nombre: 'Webhook SERNAPESCA',
          tipo: 'webhook',
          descripcion: 'Notificaciones automáticas de cambios regulatorios',
          estado: 'activa',
          webhook_url: 'https://webhook.sernapesca.gob.cl/notifications',
          eventos_soportados: ['regulation_change', 'permit_update', 'inspection_scheduled'],
          configuracion: {
            eventos_habilitados: ['regulation_change', 'permit_update'],
            formato_respuesta: 'json',
            timeout: 30
          },
          ultima_sincronizacion: '2024-01-14T15:20:00Z',
          proxima_sincronizacion: null,
          metricas: {
            total_requests: 89,
            successful_requests: 87,
            failed_requests: 2,
            avg_response_time: 156,
            uptime_percentage: 97.8
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '3',
          nombre: 'ERP Salmón Connect',
          tipo: 'saas',
          descripcion: 'Integración con sistema ERP para gestión de operaciones',
          estado: 'configurando',
          url_endpoint: 'https://api.salmonconnect.cl/v1',
          metodo_autenticacion: 'oauth',
          frecuencia_sync: 'daily',
          configuracion: {
            client_id: 'sc_client_12345',
            scopes: ['operations', 'reports', 'users'],
            modulos_sincronizados: ['operaciones', 'personal', 'equipos']
          },
          ultima_sincronizacion: null,
          proxima_sincronizacion: '2024-01-16T02:00:00Z',
          metricas: {
            total_requests: 15,
            successful_requests: 10,
            failed_requests: 5,
            avg_response_time: 890,
            uptime_percentage: 66.7
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '4',
          nombre: 'Sistema Monitoreo IoT',
          tipo: 'database',
          descripcion: 'Conexión directa con base de datos de sensores IoT',
          estado: 'error',
          configuracion: {
            host: 'sensors.aquachile.internal',
            database: 'iot_sensors',
            schema: 'production',
            tablas_monitoreadas: ['temperature_sensors', 'water_quality', 'equipment_status']
          },
          ultima_sincronizacion: '2024-01-13T08:45:00Z',
          proxima_sincronizacion: '2024-01-16T08:45:00Z',
          metricas: {
            total_requests: 2340,
            successful_requests: 2100,
            failed_requests: 240,
            avg_response_time: 120,
            uptime_percentage: 89.7
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '5',
          nombre: 'Sync Archivos Documentos',
          tipo: 'file_sync',
          descripcion: 'Sincronización automática de documentos con SharePoint',
          estado: 'inactiva',
          configuracion: {
            sharepoint_site: 'aquachile.sharepoint.com',
            carpetas_monitoreadas: ['/Operaciones', '/Documentos_Regulatorios', '/Certificaciones'],
            filtros_archivo: ['.pdf', '.docx', '.xlsx'],
            sincronizacion_bidireccional: true
          },
          ultima_sincronizacion: '2024-01-10T14:20:00Z',
          proxima_sincronizacion: null,
          metricas: {
            total_requests: 456,
            successful_requests: 440,
            failed_requests: 16,
            avg_response_time: 2100,
            uptime_percentage: 96.5
          },
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ] as Integration[];
    },
    enabled: canAccessIntegrations && !!profile?.salmonera_id,
  });

  const { data: integrationLogs = [], isLoading: isLoadingLogs } = useQuery({
    queryKey: ['integration-logs', profile?.salmonera_id],
    queryFn: async () => {
      if (!canAccessIntegrations) return [];
      
      // Simulación de logs expandidos
      return [
        {
          id: '1',
          integration_id: '1',
          timestamp: '2024-01-15T10:30:00Z',
          tipo: 'sync',
          mensaje: 'Sincronización exitosa de datos oceanográficos',
          detalles: { 
            records_processed: 150, 
            duration_ms: 2340,
            estaciones_consultadas: 3,
            parametros_obtenidos: 45
          },
          estado: 'success',
          duracion_ms: 2340,
          response_code: 200
        },
        {
          id: '2',
          integration_id: '2',
          timestamp: '2024-01-14T15:20:00Z',
          tipo: 'webhook',
          mensaje: 'Notificación recibida: Actualización regulatoria D.S. 320/2024',
          detalles: { 
            evento: 'regulation_change',
            documento: 'D.S. 320/2024',
            vigencia: '2024-02-01',
            categoria: 'operaciones_buceo'
          },
          estado: 'success',
          duracion_ms: 156,
          response_code: 200
        },
        {
          id: '3',
          integration_id: '4',
          timestamp: '2024-01-13T08:45:00Z',
          tipo: 'error',
          mensaje: 'Error de conexión con base de datos IoT',
          detalles: { 
            error: 'connection_timeout',
            retry_count: 3,
            last_successful_connection: '2024-01-12T20:30:00Z',
            affected_sensors: ['temp_001', 'wq_005', 'eq_status_012']
          },
          estado: 'error',
          duracion_ms: 30000,
          response_code: 408
        },
        {
          id: '4',
          integration_id: '3',
          timestamp: '2024-01-12T16:15:00Z',
          tipo: 'config',
          mensaje: 'Configuración OAuth actualizada para ERP',
          detalles: {
            cambios: ['scopes_updated', 'refresh_token_renewed'],
            nueva_expiracion: '2024-07-12T16:15:00Z',
            permisos_otorgados: ['operations:read', 'reports:write', 'users:read']
          },
          estado: 'success',
          duracion_ms: 1250,
          response_code: 200
        },
        {
          id: '5',
          integration_id: '1',
          timestamp: '2024-01-12T09:30:00Z',
          tipo: 'test',
          mensaje: 'Test de conectividad completado',
          detalles: {
            test_type: 'connectivity_check',
            endpoints_tested: 3,
            response_times: [245, 198, 312],
            all_passed: true
          },
          estado: 'success',
          duracion_ms: 755,
          response_code: 200
        },
        {
          id: '6',
          integration_id: '5',
          timestamp: '2024-01-10T14:20:00Z',
          tipo: 'sync',
          mensaje: 'Sincronización de archivos pausada por usuario',
          detalles: {
            archivos_pendientes: 12,
            ultimo_archivo_procesado: 'HPT-2024-001.pdf',
            razon_pausa: 'maintenance_window'
          },
          estado: 'warning',
          duracion_ms: 0,
          response_code: null
        }
      ] as IntegrationLog[];
    },
    enabled: canAccessIntegrations && !!profile?.salmonera_id,
  });

  const { data: integrationTemplates = [], isLoading: isLoadingTemplates } = useQuery({
    queryKey: ['integration-templates'],
    queryFn: async () => {
      if (!canAccessIntegrations) return [];
      
      return [
        {
          id: 'template-shoa',
          nombre: 'SHOA Oceanografía',
          descripcion: 'Datos oceanográficos y meteorológicos del Servicio Hidrográfico',
          proveedor: 'SHOA',
          tipo: 'api',
          icono: '🌊',
          categoria: 'monitoring',
          configuracion_default: {
            tipo_autenticacion: 'api_key',
            frecuencia: 'hourly',
            parametros: ['altura_ola', 'viento', 'temperatura']
          },
          documentacion_url: 'https://docs.shoa.cl/api/oceanografia'
        },
        {
          id: 'template-sernapesca',
          nombre: 'SERNAPESCA Notificaciones',
          descripcion: 'Notificaciones automáticas de cambios regulatorios',
          proveedor: 'SERNAPESCA',
          tipo: 'webhook',
          icono: '🐟',
          categoria: 'safety',
          configuracion_default: {
            eventos: ['regulation_change', 'permit_update'],
            formato: 'json'
          },
          documentacion_url: 'https://sernapesca.cl/webhooks'
        },
        {
          id: 'template-slack',
          nombre: 'Slack Notificaciones',
          descripcion: 'Envío de alertas y notificaciones a canales de Slack',
          proveedor: 'Slack',
          tipo: 'webhook',
          icono: '💬',
          categoria: 'communication',
          configuracion_default: {
            webhook_url: '',
            canal_default: '#operaciones',
            formato_mensaje: 'rich'
          },
          documentacion_url: 'https://api.slack.com/messaging/webhooks'
        },
        {
          id: 'template-sharepoint',
          nombre: 'SharePoint Documentos',
          descripcion: 'Sincronización bidireccional de documentos',
          proveedor: 'Microsoft',
          tipo: 'file_sync',
          icono: '📄',
          categoria: 'reporting',
          configuracion_default: {
            autenticacion: 'oauth',
            sincronizacion: 'bidireccional',
            filtros: ['.pdf', '.docx', '.xlsx']
          },
          documentacion_url: 'https://docs.microsoft.com/sharepoint/dev/'
        }
      ] as IntegrationTemplate[];
    },
    enabled: canAccessIntegrations,
  });

  const createIntegration = useMutation({
    mutationFn: async (integrationData: Omit<Integration, 'id' | 'created_at' | 'updated_at' | 'metricas'>) => {
      if (!canAccessIntegrations) {
        throw new Error('Acceso denegado al módulo de integraciones');
      }

      const newIntegration: Integration = {
        ...integrationData,
        id: `integration-${Date.now()}`,
        metricas: {
          total_requests: 0,
          successful_requests: 0,
          failed_requests: 0,
          avg_response_time: 0,
          uptime_percentage: 0
        },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return newIntegration;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({
        title: "Integración creada",
        description: "La integración ha sido configurada exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la integración.",
        variant: "destructive",
      });
    },
  });

  const updateIntegration = useMutation({
    mutationFn: async ({ id, data }: { id: string; data: Partial<Integration> }) => {
      if (!canAccessIntegrations) {
        throw new Error('Acceso denegado al módulo de integraciones');
      }

      const integration = integrations.find(i => i.id === id);
      if (!integration) {
        throw new Error('Integración no encontrada');
      }

      return {
        ...integration,
        ...data,
        updated_at: new Date().toISOString()
      };
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({
        title: "Integración actualizada",
        description: "Los cambios han sido guardados exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo actualizar la integración.",
        variant: "destructive",
      });
    },
  });

  const deleteIntegration = useMutation({
    mutationFn: async (integrationId: string) => {
      if (!canAccessIntegrations) {
        throw new Error('Acceso denegado al módulo de integraciones');
      }

      // Simulación de eliminación
      await new Promise(resolve => setTimeout(resolve, 1000));
      return integrationId;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      toast({
        title: "Integración eliminada",
        description: "La integración ha sido eliminada exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo eliminar la integración.",
        variant: "destructive",
      });
    },
  });

  const testIntegration = useMutation({
    mutationFn: async (integrationId: string) => {
      if (!canAccessIntegrations) {
        throw new Error('Acceso denegado al módulo de integraciones');
      }

      const integration = integrations.find(i => i.id === integrationId);
      if (!integration) {
        throw new Error('Integración no encontrada');
      }

      // Simulación de test más realista
      await new Promise(resolve => setTimeout(resolve, 2000 + Math.random() * 3000));
      
      const success = Math.random() > 0.2; // 80% de éxito
      
      if (!success) {
        throw new Error('Error de conectividad: No se pudo establecer conexión con el endpoint');
      }

      return {
        success: true,
        message: 'Conexión exitosa',
        response_time: Math.floor(150 + Math.random() * 500),
        timestamp: new Date().toISOString(),
        details: {
          endpoint_reachable: true,
          authentication_valid: true,
          data_accessible: true
        }
      };
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: ['integration-logs'] });
      toast({
        title: "Test exitoso",
        description: `Integración funcionando correctamente (${result.response_time}ms)`,
      });
    },
    onError: (error) => {
      toast({
        title: "Test fallido",
        description: error.message || "La integración no está funcionando correctamente.",
        variant: "destructive",
      });
    },
  });

  const syncIntegration = async (integrationId: string) => {
    if (!canAccessIntegrations) {
      throw new Error('Acceso denegado al módulo de integraciones');
    }

    const integration = integrations.find(i => i.id === integrationId);
    if (!integration) {
      throw new Error('Integración no encontrada');
    }

    toast({
      title: "Sincronización iniciada",
      description: `Procesando datos de ${integration.nombre}...`,
    });

    // Simulación de sincronización
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['integration-logs'] });
      queryClient.invalidateQueries({ queryKey: ['integrations'] });
      
      const success = Math.random() > 0.15; // 85% de éxito
      
      if (success) {
        toast({
          title: "Sincronización completada",
          description: `Datos de ${integration.nombre} actualizados exitosamente.`,
        });
      } else {
        toast({
          title: "Error en sincronización",
          description: `No se pudieron sincronizar los datos de ${integration.nombre}.`,
          variant: "destructive",
        });
      }
    }, 3000 + Math.random() * 2000);
  };

  const pauseIntegration = async (integrationId: string) => {
    return updateIntegration.mutateAsync({
      id: integrationId,
      data: { estado: 'inactiva' }
    });
  };

  const resumeIntegration = async (integrationId: string) => {
    return updateIntegration.mutateAsync({
      id: integrationId,
      data: { estado: 'activa' }
    });
  };

  return {
    integrations,
    integrationLogs,
    integrationTemplates,
    isLoading,
    isLoadingLogs,
    isLoadingTemplates,
    canAccessIntegrations,
    createIntegration: createIntegration.mutateAsync,
    updateIntegration: updateIntegration.mutateAsync,
    deleteIntegration: deleteIntegration.mutateAsync,
    isCreating: createIntegration.isPending,
    isUpdating: updateIntegration.isPending,
    isDeleting: deleteIntegration.isPending,
    testIntegration: testIntegration.mutateAsync,
    isTesting: testIntegration.isPending,
    syncIntegration,
    pauseIntegration,
    resumeIntegration,
  };
};
