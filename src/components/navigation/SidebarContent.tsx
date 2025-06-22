
import { ModularSidebar } from './ModularSidebar';

export const SidebarContent = () => {
  console.log('SidebarContent: Rendering ModularSidebar');
  
  try {
    return <ModularSidebar />;
  } catch (error) {
    console.error('SidebarContent: Error rendering ModularSidebar:', error);
    
    // Fallback simple sidebar
    return (
      <div className="flex flex-col h-full p-4">
        <div className="mb-4">
          <h2 className="text-lg font-semibold">Breus</h2>
          <p className="text-sm text-gray-600">Cargando...</p>
        </div>
        <div className="text-sm text-red-600">
          Error al cargar la navegación. Revisa la consola.
        </div>
      </div>
    );
  }
};
