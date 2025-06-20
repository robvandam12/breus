
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { useModuleAccess } from "@/hooks/useModuleAccess";
import { toast } from "@/hooks/use-toast";

export interface NetworkMaintenanceTask {
  id: string;
  sitio_id: string;
  fecha_programada: string;
  tipo_mantencion: 'preventiva' | 'correctiva' | 'emergencia';
  descripcion: string;
  estado: 'programada' | 'en_proceso' | 'completada' | 'cancelada';
  prioridad: 'baja' | 'media' | 'alta' | 'critica';
  equipos_involucrados: string[];
  estimacion_horas: number;
  created_at: string;
  updated_at: string;
}

export interface NetworkOperation {
  id: string;
  sitio_id: string;
  fecha_ejecucion: string;
  tipo_faena: 'instalacion' | 'cambio_red' | 'reparacion' | 'inspeccion';
  descripcion: string;
  estado: 'planificada' | 'ejecutando' | 'completada' | 'suspendida';
  supervisor_id: string;
  equipo_asignado: string[];
  recursos_necesarios: any[];
  created_at: string;
  updated_at: string;
}

export const useNetworkMaintenance = () => {
  const { profile } = useAuth();
  const { isModuleActive, modules } = useModuleAccess();
  const queryClient = useQueryClient();

  const canAccessMaintenance = isModuleActive(modules.NETWORK_MAINTENANCE);

  const { data: maintenanceTasks = [], isLoading } = useQuery({
    queryKey: ['network-maintenance', profile?.salmonera_id],
    queryFn: async () => {
      if (!canAccessMaintenance) return [];
      
      // Simulación de datos hasta implementar tabla real
      return [
        {
          id: '1',
          sitio_id: 'sitio-1',
          fecha_programada: '2024-01-15',
          tipo_mantencion: 'preventiva',
          descripcion: 'Mantenimiento preventivo de redes principales',
          estado: 'programada',
          prioridad: 'media',
          equipos_involucrados: ['Red A', 'Red B'],
          estimacion_horas: 4,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ] as NetworkMaintenanceTask[];
    },
    enabled: canAccessMaintenance && !!profile?.salmonera_id,
  });

  const createMaintenanceTask = useMutation({
    mutationFn: async (taskData: Omit<NetworkMaintenanceTask, 'id' | 'created_at' | 'updated_at'>) => {
      if (!canAccessMaintenance) {
        throw new Error('Acceso denegado al módulo de mantención de redes');
      }

      // Simulación hasta implementar tabla real
      const newTask: NetworkMaintenanceTask = {
        ...taskData,
        id: `task-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return newTask;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-maintenance'] });
      toast({
        title: "Tarea de mantención creada",
        description: "La tarea ha sido programada exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la tarea de mantención.",
        variant: "destructive",
      });
    },
  });

  return {
    maintenanceTasks,
    isLoading,
    canAccessMaintenance,
    createMaintenanceTask: createMaintenanceTask.mutateAsync,
    isCreating: createMaintenanceTask.isPending,
  };
};

export const useNetworkOperations = () => {
  const { profile } = useAuth();
  const { isModuleActive, modules } = useModuleAccess();
  const queryClient = useQueryClient();

  const canAccessOperations = isModuleActive(modules.NETWORK_OPERATIONS);

  const { data: networkOperations = [], isLoading } = useQuery({
    queryKey: ['network-operations', profile?.salmonera_id],
    queryFn: async () => {
      if (!canAccessOperations) return [];
      
      // Simulación de datos hasta implementar tabla real
      return [
        {
          id: '1',
          sitio_id: 'sitio-1',
          fecha_ejecucion: '2024-01-16',
          tipo_faena: 'instalacion',
          descripcion: 'Instalación de nueva red en sector norte',
          estado: 'planificada',
          supervisor_id: 'supervisor-1',
          equipo_asignado: ['Buzo 1', 'Buzo 2'],
          recursos_necesarios: [],
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString()
        }
      ] as NetworkOperation[];
    },
    enabled: canAccessOperations && !!profile?.salmonera_id,
  });

  const createNetworkOperation = useMutation({
    mutationFn: async (operationData: Omit<NetworkOperation, 'id' | 'created_at' | 'updated_at'>) => {
      if (!canAccessOperations) {
        throw new Error('Acceso denegado al módulo de faenas de redes');
      }

      // Simulación hasta implementar tabla real
      const newOperation: NetworkOperation = {
        ...operationData,
        id: `operation-${Date.now()}`,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      return newOperation;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['network-operations'] });
      toast({
        title: "Faena de red creada",
        description: "La faena ha sido programada exitosamente.",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || "No se pudo crear la faena de red.",
        variant: "destructive",
      });
    },
  });

  return {
    networkOperations,
    isLoading,
    canAccessOperations,
    createNetworkOperation: createNetworkOperation.mutateAsync,
    isCreating: createNetworkOperation.isPending,
  };
};
