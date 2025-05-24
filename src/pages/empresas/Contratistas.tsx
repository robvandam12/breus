import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, MapPin, Phone, Mail, HardHat, LayoutGrid, LayoutList } from "lucide-react";

const Contratistas = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');

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

  const renderCardsView = () => (
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
  );

  const renderTableView = () => (
    <Card>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Empresa</TableHead>
            <TableHead>RUT</TableHead>
            <TableHead>Dirección</TableHead>
            <TableHead>Teléfono</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Buzos</TableHead>
            <TableHead>Certificaciones</TableHead>
            <TableHead>Estado</TableHead>
            <TableHead className="text-right">Acciones</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contratistas.map((contratista) => (
            <TableRow key={contratista.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                    <HardHat className="w-4 h-4 text-orange-600" />
                  </div>
                  <div>
                    <div className="font-medium">{contratista.nombre}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell className="text-zinc-600">{contratista.rut}</TableCell>
              <TableCell className="text-zinc-600">{contratista.direccion}</TableCell>
              <TableCell className="text-zinc-600">{contratista.telefono}</TableCell>
              <TableCell className="text-zinc-600">{contratista.email}</TableCell>
              <TableCell className="text-zinc-600">{contratista.buzos}</TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {contratista.certificaciones.slice(0, 2).map((cert) => (
                    <Badge key={cert} variant="outline" className="text-xs">
                      {cert}
                    </Badge>
                  ))}
                  {contratista.certificaciones.length > 2 && (
                    <Badge variant="outline" className="text-xs">
                      +{contratista.certificaciones.length - 2}
                    </Badge>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <Badge variant="secondary" className={getEstadoBadge(contratista.estado)}>
                  {contratista.estado}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <div className="flex justify-end gap-2">
                  <Button variant="outline" size="sm">
                    Ver Equipo
                  </Button>
                  <Button variant="outline" size="sm">
                    Editar
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Card>
  );

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
              <div className="flex items-center gap-2">
                <div className="flex items-center bg-zinc-100 rounded-lg p-1">
                  <Button
                    variant={viewMode === 'cards' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('cards')}
                    className="h-8 px-3"
                  >
                    <LayoutGrid className="w-4 h-4" />
                  </Button>
                  <Button
                    variant={viewMode === 'table' ? 'default' : 'ghost'}
                    size="sm"
                    onClick={() => setViewMode('table')}
                    className="h-8 px-3"
                  >
                    <LayoutList className="w-4 h-4" />
                  </Button>
                </div>
                <Button className="ios-button">
                  <Plus className="w-4 h-4 mr-2" />
                  Nueva Empresa
                </Button>
              </div>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {viewMode === 'cards' ? renderCardsView() : renderTableView()}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Contratistas;
