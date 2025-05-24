
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Building2, Plus, MapPin, Phone, Mail } from "lucide-react";

const Salmoneras = () => {
  // Mock data para salmoneras
  const salmoneras = [
    {
      id: 1,
      nombre: "AquaChile S.A.",
      rut: "96.856.780-3",
      direccion: "Puerto Montt, Región de Los Lagos",
      telefono: "+56 65 2270000",
      email: "contacto@aquachile.cl",
      sitios: 12,
      estado: "Activa"
    },
    {
      id: 2,
      nombre: "Salmones Camanchaca S.A.",
      rut: "76.536.353-4",
      direccion: "Isla de Maipo, Región Metropolitana",
      telefono: "+56 2 2589 8000",
      email: "info@camanchaca.cl",
      sitios: 8,
      estado: "Activa"
    },
    {
      id: 3,
      nombre: "Multiexport Foods S.A.",
      rut: "99.300.400-0",
      direccion: "Santiago, Región Metropolitana",
      telefono: "+56 2 2476 8000",
      email: "contacto@multiexport.cl",
      sitios: 15,
      estado: "Activa"
    }
  ];

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
              <div className="flex items-center gap-3">
                <Building2 className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Salmoneras</h1>
                  <p className="text-sm text-zinc-500">Gestión de empresas salmoneras</p>
                </div>
              </div>
              <div className="flex-1" />
              <Button className="ios-button">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Salmonera
              </Button>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              <div className="grid gap-6">
                {salmoneras.map((salmonera) => (
                  <Card key={salmonera.id} className="ios-card hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-zinc-100 rounded-xl flex items-center justify-center">
                            <Building2 className="w-6 h-6 text-zinc-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-zinc-900">{salmonera.nombre}</CardTitle>
                            <p className="text-sm text-zinc-500">RUT: {salmonera.rut}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className="bg-emerald-100 text-emerald-700">
                          {salmonera.estado}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                          <MapPin className="w-4 h-4" />
                          <span>{salmonera.direccion}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                          <Phone className="w-4 h-4" />
                          <span>{salmonera.telefono}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                          <Mail className="w-4 h-4" />
                          <span>{salmonera.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                          <Building2 className="w-4 h-4" />
                          <span>{salmonera.sitios} sitios activos</span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm">
                          Ver Sitios
                        </Button>
                        <Button variant="outline" size="sm">
                          Editar
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Salmoneras;
