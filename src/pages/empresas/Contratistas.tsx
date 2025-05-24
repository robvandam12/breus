
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, Plus, MapPin, Phone, Mail, HardHat } from "lucide-react";

const Contratistas = () => {
  // Mock data para empresas contratistas
  const contratistas = [
    {
      id: 1,
      nombre: "Servicios Subacuáticos del Sur Ltda.",
      rut: "76.234.567-8",
      direccion: "Puerto Montt, Región de Los Lagos",
      telefono: "+56 65 2345678",
      email: "contacto@subacuaticos.cl",
      buzos: 15,
      certificaciones: ["PADI", "NAUI", "Commercial Diver"],
      estado: "Activa"
    },
    {
      id: 2,
      nombre: "Buzos Profesionales Patagonia S.A.",
      rut: "99.876.543-2",
      direccion: "Castro, Región de Los Lagos",
      telefono: "+56 65 9876543",
      email: "info@buzospatagonia.cl",
      buzos: 22,
      certificaciones: ["Commercial Diver", "Underwater Welding"],
      estado: "Activa"
    },
    {
      id: 3,
      nombre: "Servicios Marinos Chiloé Ltda.",
      rut: "77.123.456-9",
      direccion: "Ancud, Región de Los Lagos",
      telefono: "+56 65 1234567",
      email: "servicios@marinoschiloe.cl",
      buzos: 8,
      certificaciones: ["PADI", "Commercial Diver"],
      estado: "Inactiva"
    }
  ];

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "Activa":
        return "bg-emerald-100 text-emerald-700";
      case "Inactiva":
        return "bg-red-100 text-red-700";
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
                <HardHat className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Contratistas</h1>
                  <p className="text-sm text-zinc-500">Empresas de servicios de buceo</p>
                </div>
              </div>
              <div className="flex-1" />
              <Button className="ios-button">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Empresa
              </Button>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              <div className="grid gap-6">
                {contratistas.map((contratista) => (
                  <Card key={contratista.id} className="ios-card hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                            <HardHat className="w-6 h-6 text-orange-600" />
                          </div>
                          <div>
                            <CardTitle className="text-lg text-zinc-900">{contratista.nombre}</CardTitle>
                            <p className="text-sm text-zinc-500">RUT: {contratista.rut}</p>
                          </div>
                        </div>
                        <Badge variant="secondary" className={getEstadoBadge(contratista.estado)}>
                          {contratista.estado}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                          <MapPin className="w-4 h-4" />
                          <span>{contratista.direccion}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                          <Phone className="w-4 h-4" />
                          <span>{contratista.telefono}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                          <Mail className="w-4 h-4" />
                          <span>{contratista.email}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-zinc-600">
                          <Users className="w-4 h-4" />
                          <span>{contratista.buzos} buzos certificados</span>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-zinc-700">Certificaciones:</p>
                        <div className="flex flex-wrap gap-2">
                          {contratista.certificaciones.map((cert) => (
                            <Badge key={cert} variant="outline" className="text-xs">
                              {cert}
                            </Badge>
                          ))}
                        </div>
                      </div>
                      <div className="flex justify-end gap-2 pt-2">
                        <Button variant="outline" size="sm">
                          Ver Equipo
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

export default Contratistas;
