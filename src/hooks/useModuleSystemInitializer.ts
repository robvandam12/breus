
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

const SYSTEM_MODULES = [
  {
    name: 'core_immersions',
    display_name: 'Inmersiones Core',
    description: 'Funcionalidad básica de inmersiones (siempre activo)',
    category: 'operational',
    is_core: true,
    dependencies: [],
    version: '1.0.0'
  },
  {
    name: 'planning_operations',
    display_name: 'Planificación de Operaciones',
    description: 'Creación y gestión de operaciones planificadas',
    category: 'planning',
    is_core: false,
    dependencies: ['core_immersions'],
    version: '1.0.0'
  },
  {
    name: 'maintenance_networks',
    display_name: 'Mantención de Redes',
    description: 'Gestión de mantención de redes y equipos',
    category: 'operational',
    is_core: false,
    dependencies: ['core_immersions'],
    version: '1.0.0'
  },
  {
    name: 'advanced_reporting',
    display_name: 'Reportes Avanzados',
    description: 'Generación de reportes y análisis detallados',
    category: 'reporting',
    is_core: false,
    dependencies: ['core_immersions'],
    version: '1.0.0'
  },
  {
    name: 'external_integrations',
    display_name: 'Integraciones Externas',
    description: 'Conectores con sistemas externos y APIs',
    category: 'integration',
    is_core: false,
    dependencies: ['core_immersions'],
    version: '1.0.0'
  }
];

export const useModuleSystemInitializer = () => {
  const { profile } = useAuth();

  useEffect(() => {
    const initializeSystemModules = async () => {
      if (profile?.role !== 'superuser') return;

      try {
        // Verificar si ya existen módulos
        const { data: existingModules } = await supabase
          .from('system_modules')
          .select('name');

        const existingNames = existingModules?.map(m => m.name) || [];
        const modulesToInsert = SYSTEM_MODULES.filter(m => !existingNames.includes(m.name));

        if (modulesToInsert.length > 0) {
          console.log('Inicializando módulos del sistema...', modulesToInsert);
          
          const { error } = await supabase
            .from('system_modules')
            .insert(modulesToInsert);

          if (error) {
            console.error('Error inicializando módulos:', error);
          } else {
            console.log('Módulos del sistema inicializados correctamente');
          }
        }
      } catch (error) {
        console.error('Error en la inicialización de módulos:', error);
      }
    };

    initializeSystemModules();
  }, [profile?.role]);
};
