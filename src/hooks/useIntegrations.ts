
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useModularSystem } from "./useModularSystem";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface Integration {
  id: string;
  nombre: string;
  tipo: 'api' | 'webhook' | 'database' | 'file_sync';
  descripcion: string;
  estado: 'activa' | 'inactiva' | 'error' | 'configurando';
  configuracion: any;
  ultima_sincronizacion: string | null;
  proxima_sincronizacion: string | null;
  created_at: string;
  updated_at: string;
}

export interface IntegrationLog {
  id: string;
  integration_id: string;
  timestamp: string;
  tipo: 'sync' | 'error' | 'config' | 'test';
  mensaje: string;
  detalles: any;
  estado: 'success' | 'warning' | 'error';
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
      
      // Simulación de integraciones hasta implementar tabla real
      return [
        {
          id: '1',
          nombre: 'API Mareógrafo',
          tipo: 'api',
          descripcion: 'Sincronización de datos oceánicos',
          estado: 'activa',
          configuracion: {
            endpoint: 'https://api.mareografo.cl/v1/data',
            frecuencia: 'hourly',
            autenticacion: 'api_key'
          },
          ultima_sincronizacion: '2024-01-15T10:30:00Z',
          proxima_sincronizacion: '2024-01-15T11:30:00Z',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        },
        {
          id: '2',
          nombre: 'Webhook SERNAPESCA',
          tipo: 'webhook',
          descripcion: 'Notificaciones de cambios regulatorios',
          estado: 'activa',
          configuracion: {
            url: 'https://webhook.sernapesca.cl/buceo',
            eventos: ['regulation_change', 'permit_update']
          },
          ultima_sincronizacion: '2024-01-14T15:20:00Z',
          proxima_sincronizacion: null,
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
      
      // Simulación de logs
      return [
        {
          id: '1',
          integration_id: '1',
          timestamp: '2024-01-15T10:30:00Z',
          tipo: 'sync',
          mensaje: 'Sincronización exitosa',
          detalles: { records_processed: 150, duration_ms: 2340 },
          estado: 'success'
        },
        {
          id: '2',
          integration_id: '2',
          timestamp: '2024-01-14T15:20:00Z',
          tipo: 'error',
          mensaje: 'Error de conexión',
          detalles: { error: 'timeout', retry_count: 3 },
          estado: 'error'
        }
      ] as IntegrationLog[];
    },
    enabled: canAccessIntegrations && !!profile?.salmonera_id,
  });

  const createIntegration = useMutation({
    mutationFn: async (integrationData: Omit<Integration, 'id' | 'created_at' | 'updated_at'>) => {
      if (!canAccessIntegrations) {
        throw new Error('Acceso denegado al módulo de integraciones');
      }

      // Simulación hasta implementar tabla real
      const newIntegration: Integration = {
        ...integrationData,
        id: `integration-${Date.now()}`,
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

  const testIntegration = useMutation({
    mutationFn: async (integrationId: string) => {
      if (!canAccessIntegrations) {
        throw new Error('Acceso denegado al módulo de integraciones');
      }

      // Simulación de prueba
      const integration = integrations.find(i => i.id === integrationId);
      if (!integration) {
        throw new Error('Integración no encontrada');
      }

      // Simulación de test
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      return {
        success: true,
        message: 'Conexión exitosa',
        response_time: 245
      };
    },
    onSuccess: (result) => {
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

    toast({
      title: "Sincronización iniciada",
      description: "Procesando datos de la integración...",
    });

    // Simulación de sincronización
    setTimeout(() => {
      queryClient.invalidateQueries({ queryKey: ['integration-logs'] });
      toast({
        title: "Sincronización completada",
        description: "Datos actualizados exitosamente.",
      });
    }, 3000);
  };

  return {
    integrations,
    integrationLogs,
    isLoading,
    isLoadingLogs,
    canAccessIntegrations,
    createIntegration: createIntegration.mutateAsync,
    isCreating: createIntegration.isPending,
    testIntegration: testIntegration.mutateAsync,
    isTesting: testIntegration.isPending,
    syncIntegration,
  };
};
