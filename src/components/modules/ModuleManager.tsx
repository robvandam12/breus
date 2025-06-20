
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Settings, Shield, FileText, Wrench, Network } from "lucide-react";
import { useModules, AVAILABLE_MODULES, ModuleName } from "@/hooks/useModules";
import { toast } from "@/hooks/use-toast";

const MODULE_ICONS = {
  core: Settings,
  planificacion: Shield,
  mantencion_redes: Wrench,
  faena_redes: Network
} as const;

export const ModuleManager = () => {
  const { activeModules, isModuleActive, toggleModule, isToggling } = useModules();

  const handleToggleModule = async (moduleId: string, moduleName: string, currentState: boolean) => {
    if (moduleName === 'core') {
      toast({
        title: "Módulo Core",
        description: "El módulo Core no se puede desactivar ya que es fundamental.",
        variant: "default",
      });
      return;
    }

    try {
      await toggleModule({ moduleId, active: !currentState });
    } catch (error) {
      console.error('Error toggling module:', error);
    }
  };

  if (!activeModules.length) {
    return (
      <Card>
        <CardContent className="p-6">
          <p className="text-center text-gray-500">Cargando módulos...</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Gestión de Módulos</h2>
        <p className="text-gray-600 mt-2">
          Configura qué módulos están activos para tu organización
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {Object.entries(AVAILABLE_MODULES).map(([key, moduleInfo]) => {
          const moduleName = key as ModuleName;
          const moduleData = activeModules.find(m => m.modulo_nombre === moduleName);
          const isActive = isModuleActive(moduleName);
          const IconComponent = MODULE_ICONS[moduleName];

          return (
            <Card key={key} className={`relative ${isActive ? 'ring-2 ring-blue-500' : ''}`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
                <div className="flex items-center space-x-3">
                  <div className={`p-2 rounded-lg ${isActive ? 'bg-blue-100' : 'bg-gray-100'}`}>
                    <IconComponent className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>
                  <div>
                    <CardTitle className="text-lg">{moduleInfo.name}</CardTitle>
                    {moduleInfo.required && (
                      <Badge variant="secondary" className="text-xs mt-1">
                        Requerido
                      </Badge>
                    )}
                  </div>
                </div>
                
                <Switch
                  checked={isActive}
                  disabled={moduleInfo.required || isToggling}
                  onCheckedChange={() => moduleData && handleToggleModule(
                    moduleData.id, 
                    moduleName, 
                    isActive
                  )}
                />
              </CardHeader>
              
              <CardContent>
                <p className="text-sm text-gray-600 mb-4">
                  {moduleInfo.description}
                </p>
                
                <div className="flex items-center justify-between">
                  <Badge variant={isActive ? "default" : "secondary"}>
                    {isActive ? "Activo" : "Inactivo"}
                  </Badge>
                  
                  {moduleData && (
                    <span className="text-xs text-gray-500">
                      Actualizado: {new Date(moduleData.updated_at).toLocaleDateString()}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-start space-x-3">
            <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
              <FileText className="w-4 h-4 text-blue-600" />
            </div>
            <div className="text-sm text-blue-800">
              <strong>Información:</strong> Los cambios en los módulos afectan la funcionalidad 
              disponible para todos los usuarios de tu organización. El módulo Core siempre 
              permanece activo ya que contiene las funcionalidades básicas.
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
