
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MapPin, Plus, Building2, Waves, Fish } from "lucide-react";

const Sitios = () => {
  // Mock data para sitios
  const sitios = [
    {
      id: 1,
      nombre: "Sitio Chiloé Norte",
      salmonera: "AquaChile S.A.",
      coordenadas: "42°37'S 73°47'W",
      profundidad: "45m",
      especies: ["Salmón Atlántico", "Trucha"],
      estado: "Operativo",
      tipo: "Agua Mar"
    },
    {
      id: 2,
      nombre: "Centro Los Fiordos",
      salmonera: "Salmones Camanchaca S.A.",
      coordenadas: "45°22'S 72°15'W",
      profundidad: "60m",
      especies: ["Salmón Coho"],
      estado: "Operativo",
      tipo: "Agua Mar"
    },
    {
      id: 3,
      nombre: "Piscicultura Río Blanco",
      salmonera: "Multiexport Foods S.A.",
      coordenadas: "41°28'S 72°58'W",
      profundidad: "8m",
      especies: ["Smolt Salmón Atlántico"],
      estado: "Mantención",
      tipo: "Agua Dulce"
    }
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Operativo":
        return "bg-emerald-100 text-emerald-700";
      case "Mantención":
        return "bg-amber-100 text-amber-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
              <div className="flex items-center gap-3">
                <MapPin className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Sitios</h1>
                  <p className="text-sm text-zinc-500">Gestión de sitios acuícolas</p>
                </div>
              </div>
              <div className="flex-1" />
              <Button className="ios-button">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Sitio
              </Button>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              <div className="grid gap-6">
                {sitios.map((sitio) => (
                  <Card key={sitio.id} className="ios-card hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                            <Waves className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-zinc-900">{sitio.nombre}</CardTitle>
                            <p className="text-sm text-zinc-500">{sitio.salmonera}</p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Badge variant="outline" className="text-xs">
                            {sitio.tipo}
                          </Badge>
                          <Badge variant="secondary" className={getEstadoBadge(sitio.estado)}>
                            {sitio.estado}
                          </Badge>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                          <MapPin className="w-4 h-4" />
                          <span>{sitio.coordenadas}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                          <Waves className="w-4 h-4" />
                          <span>Profundidad: {sitio.profundidad}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                          <Fish className="w-4 h-4" />
                          <span>{sitio.especies.join(", ")}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                          <Building2 className="w-4 h-4" />
                          <span>{sitio.salmonera}</span>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm">
                          Ver Operaciones
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

export default Sitios;
