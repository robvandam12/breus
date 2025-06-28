
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

export interface CompanyWithModules {
  id: string;
  nombre: string;
  rut: string;
  type: 'salmonera' | 'contratista';
  estado: string;
  modules: {
    module_name: string;
    is_active: boolean;
    display_name: string;
    description?: string;
    is_core: boolean;
  }[];
}

export interface ModuleStats {
  total_modules: number;
  active_activations: number;
  companies_with_modules: number;
  usage_by_module: Record<string, number>;
  recent_activations: any[];
}

export const useModuleManagementDashboard = () => {
  const { profile } = useAuth();
  const queryClient = useQueryClient();
  
  const isSuperuser = profile?.role === 'superuser';

  // Obtener todas las empresas con sus módulos
  const { data: companiesWithModules = [], isLoading: loadingCompanies } = useQuery({
    queryKey: ['companies-with-modules'],
    queryFn: async () => {
      // Obtener salmoneras
      const { data: salmoneras } = await supabase
        .from('salmoneras')
        .select('id, nombre, rut, estado')
        .eq('estado', 'activa');

      // Obtener contratistas
      const { data: contratistas } = await supabase
        .from('contratistas')
        .select('id, nombre, rut, estado')
        .eq('estado', 'activo');

      // Obtener módulos del sistema
      const { data: systemModules } = await supabase
        .from('system_modules')
        .select('*');

      // Obtener módulos activos por empresa
      const { data: companyModules } = await supabase
        .from('company_modules')
        .select('*');

      const companies: CompanyWithModules[] = [];

      // Procesar salmoneras
      if (salmoneras) {
        for (const salmonera of salmoneras) {
          const modules = systemModules?.map(module => {
            const activeModule = companyModules?.find(
              cm => cm.company_id === salmonera.id && 
                    cm.company_type === 'salmonera' && 
                    cm.module_name === module.name
            );
            
            return {
              module_name: module.name,
              is_active: module.is_core || (activeModule?.is_active || false),
              display_name: module.display_name,
              description: module.description,
              is_core: module.is_core
            };
          }) || [];

          companies.push({
            id: salmonera.id,
            nombre: salmonera.nombre,
            rut: salmonera.rut,
            type: 'salmonera',
            estado: salmonera.estado,
            modules
          });
        }
      }

      // Procesar contratistas
      if (contratistas) {
        for (const contratista of contratistas) {
          const modules = systemModules?.map(module => {
            const activeModule = companyModules?.find(
              cm => cm.company_id === contratista.id && 
                    cm.company_type === 'contratista' && 
                    cm.module_name === module.name
            );
            
            return {
              module_name: module.name,
              is_active: module.is_core || (activeModule?.is_active || false),
              display_name: module.display_name,
              description: module.description,
              is_core: module.is_core
            };
          }) || [];

          companies.push({
            id: contratista.id,
            nombre: contratista.nombre,
            rut: contratista.rut,
            type: 'contratista',
            estado: contratista.estado,
            modules
          });
        }
      }

      return companies;
    },
    enabled: isSuperuser,
  });

  // Obtener estadísticas de módulos
  const { data: moduleStats, isLoading: loadingStats } = useQuery({
    queryKey: ['module-dashboard-stats'],
    queryFn: async () => {
      const { data: systemModules } = await supabase
        .from('system_modules')
        .select('*');

      const { data: companyModules } = await supabase
        .from('company_modules')
        .select('*');

      const { data: activationLogs } = await supabase
        .from('module_activation_logs')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(10);

      const stats: ModuleStats = {
        total_modules: systemModules?.length || 0,
        active_activations: companyModules?.filter(m => m.is_active).length || 0,
        companies_with_modules: new Set(companyModules?.map(m => m.company_id)).size,
        usage_by_module: {},
        recent_activations: activationLogs || []
      };

      // Calcular uso por módulo
      if (companyModules) {
        companyModules.forEach(module => {
          if (module.is_active) {
            stats.usage_by_module[module.module_name] = 
              (stats.usage_by_module[module.module_name] || 0) + 1;
          }
        });
      }

      return stats;
    },
    enabled: isSuperuser,
  });

  // Mutation para activar/desactivar módulos
  const toggleModuleMutation = useMutation({
    mutationFn: async ({ 
      companyId, 
      companyType, 
      moduleName, 
      isActive 
    }: { 
      companyId: string; 
      companyType: 'salmonera' | 'contratista'; 
      moduleName: string; 
      isActive: boolean;
    }) => {
      const { data, error } = await supabase
        .from('company_modules')
        .upsert({
          company_id: companyId,
          company_type: companyType,
          module_name: moduleName,
          is_active: isActive,
          activated_by: isActive ? profile?.id : null,
        }, {
          onConflict: 'company_id,company_type,module_name'
        })
        .select()
        .single();

      if (error) throw error;

      // Registrar log
      await supabase
        .from('module_activation_logs')
        .insert({
          module_name: moduleName,
          company_id: companyId,
          company_type: companyType,
          action: isActive ? 'activated' : 'deactivated',
          performed_by: profile?.id,
        });

      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['companies-with-modules'] });
      queryClient.invalidateQueries({ queryKey: ['module-dashboard-stats'] });
      toast({
        title: "Módulo actualizado",
        description: "El estado del módulo ha sido actualizado correctamente.",
      });
    },
    onError: (error) => {
      console.error('Error toggling module:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar el estado del módulo.",
        variant: "destructive",
      });
    },
  });

  return {
    companiesWithModules,
    moduleStats,
    isLoading: loadingCompanies || loadingStats,
    isSuperuser,
    toggleModule: toggleModuleMutation.mutateAsync,
    isToggling: toggleModuleMutation.isPending,
  };
};
