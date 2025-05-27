
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search, Edit, Trash2, Eye, UserCheck, Shield } from "lucide-react";
import { useEquiposBuceo } from "@/hooks/useEquiposBuceo";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

const EquipoBuceo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { equipos, isLoading, createEquipo, updateEquipo, deleteEquipo } = useEquiposBuceo();

  const filteredEquipos = equipos.filter(equipo => 
    equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (equipo.descripcion && equipo.descripcion.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const getRoleIcon = (role: string) => {
    switch (role) {
      case 'supervisor':
        return <Shield className="w-4 h-4 text-blue-600" />;
      case 'buzo':
        return <UserCheck className="w-4 h-4 text-green-600" />;
      default:
        return <Users className="w-4 h-4 text-gray-600" />;
    }
  };

  const getRoleBadge = (role: string) => {
    const roleMap: Record<string, { className: string; label: string }> = {
      supervisor: { className: "bg-blue-100 text-blue-700", label: "Supervisor" },
      buzo: { className: "bg-green-100 text-green-700", label: "Buzo" },
      asistente: { className: "bg-yellow-100 text-yellow-700", label: "Asistente" }
    };
    return roleMap[role] || { className: "bg-gray-100 text-gray-700", label: role };
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd/MM/yyyy", { locale: es });
    } catch {
      return dateString;
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col">
            <Header 
              title="Equipo de Buceo" 
              subtitle="Gestión de equipos de trabajo" 
              icon={Users} 
            />
            <div className="flex-1 flex items-center justify-center">
              <LoadingSpinner text="Cargando equipos..." />
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Equipo de Buceo" 
            subtitle="Gestión de equipos de trabajo" 
            icon={Users} 
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  placeholder="Buscar equipos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>

              <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
                <DialogTrigger asChild>
                  <Button className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Equipo
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl">
                  <div className="p-6">
                    <h3 className="text-lg font-semibold mb-4">Crear Nuevo Equipo</h3>
                    <p className="text-gray-600">Funcionalidad en desarrollo...</p>
                  </div>
                </DialogContent>
              </Dialog>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <Card className="p-4">
                  <div className="text-2xl font-bold text-blue-600">
                    {equipos.length}
                  </div>
                  <div className="text-sm text-zinc-500">Total Equipos</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-green-600">
                    {equipos.filter(e => e.activo).length}
                  </div>
                  <div className="text-sm text-zinc-500">Activos</div>
                </Card>
                <Card className="p-4">
                  <div className="text-2xl font-bold text-yellow-600">
                    {equipos.reduce((acc, e) => acc + (e.miembros?.length || 0), 0)}
                  </div>
                  <div className="text-sm text-zinc-500">Total Miembros</div>
                </Card>
              </div>

              {filteredEquipos.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay equipos registrados</h3>
                    <p className="text-zinc-500 mb-4">Comience creando el primer equipo de buceo</p>
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Equipo
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-6">
                  {filteredEquipos.map((equipo) => (
                    <Card key={equipo.id}>
                      <CardHeader>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                              <Users className="w-5 h-5 text-blue-600" />
                            </div>
                            <div>
                              <CardTitle className="text-lg">{equipo.nombre}</CardTitle>
                              <p className="text-sm text-gray-500">
                                {equipo.descripcion || "Sin descripción"}
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant={equipo.activo ? "default" : "secondary"}>
                              {equipo.activo ? "Activo" : "Inactivo"}
                            </Badge>
                            <div className="flex gap-1">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Trash2 className="w-4 h-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between text-sm text-gray-600">
                            <span>Creado: {formatDate(equipo.created_at)}</span>
                            <span>{equipo.miembros?.length || 0} miembros</span>
                          </div>
                          
                          {equipo.miembros && equipo.miembros.length > 0 ? (
                            <div className="space-y-2">
                              <h4 className="font-medium text-sm">Miembros del equipo:</h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {equipo.miembros.map((miembro) => (
                                  <div key={miembro.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                                    <div className="flex items-center gap-2">
                                      {getRoleIcon(miembro.rol_equipo)}
                                      <div>
                                        <span className="font-medium text-sm">
                                          {miembro.usuario?.nombre} {miembro.usuario?.apellido}
                                        </span>
                                        <div className="text-xs text-gray-500">
                                          {miembro.usuario?.email}
                                        </div>
                                      </div>
                                    </div>
                                    <Badge 
                                      variant="secondary" 
                                      className={getRoleBadge(miembro.rol_equipo).className}
                                    >
                                      {getRoleBadge(miembro.rol_equipo).label}
                                    </Badge>
                                  </div>
                                ))}
                              </div>
                            </div>
                          ) : (
                            <div className="text-center py-4 text-gray-500">
                              <Users className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                              <p className="text-sm">No hay miembros asignados</p>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EquipoBuceo;
