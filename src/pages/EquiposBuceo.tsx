
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Users, Eye, Edit, Trash2 } from "lucide-react";
import { useEquiposBuceoEnhanced } from "@/hooks/useEquiposBuceoEnhanced";

const EquiposBuceoPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { equipos, isLoading } = useEquiposBuceoEnhanced();

  const filteredEquipos = equipos.filter(equipo => 
    equipo.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <RoleBasedSidebar />
          <main className="flex-1 flex flex-col bg-gray-50">
            <Header 
              title="Equipos de Buceo" 
              subtitle="Gestión de equipos de buceo y miembros" 
              icon={Users} 
            />
            <div className="flex-1 flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
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
        <main className="flex-1 flex flex-col bg-gray-50">
          <Header 
            title="Equipos de Buceo" 
            subtitle="Gestión de equipos de buceo y miembros" 
            icon={Users} 
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  placeholder="Buscar equipos..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64 ios-input"
                />
              </div>

              <Button className="ios-button bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Equipo
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
              {/* KPIs */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <Card className="ios-card">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-blue-600">
                      {equipos.length}
                    </div>
                    <div className="text-sm text-zinc-500">Equipos Totales</div>
                  </CardContent>
                </Card>
                <Card className="ios-card">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-green-600">
                      {equipos.filter(e => e.activo).length}
                    </div>
                    <div className="text-sm text-zinc-500">Equipos Activos</div>
                  </CardContent>
                </Card>
                <Card className="ios-card">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-yellow-600">
                      {equipos.reduce((acc, e) => acc + (e.miembros?.length || 0), 0)}
                    </div>
                    <div className="text-sm text-zinc-500">Total Miembros</div>
                  </CardContent>
                </Card>
                <Card className="ios-card">
                  <CardContent className="p-4">
                    <div className="text-2xl font-bold text-gray-600">
                      {equipos.filter(e => (e.miembros?.length || 0) >= 3).length}
                    </div>
                    <div className="text-sm text-zinc-500">Equipos Completos</div>
                  </CardContent>
                </Card>
              </div>

              {/* Equipos List */}
              {filteredEquipos.length === 0 ? (
                <Card className="ios-card text-center py-12">
                  <CardContent>
                    <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      {equipos.length === 0 ? "No hay equipos registrados" : "No se encontraron equipos"}
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      {equipos.length === 0 
                        ? "Comience creando el primer equipo de buceo"
                        : "Intenta ajustar la búsqueda"}
                    </p>
                    <Button className="ios-button bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Equipo
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card className="ios-card">
                  <div className="ios-table-container">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Nombre del Equipo</TableHead>
                          <TableHead>Empresa</TableHead>
                          <TableHead>Miembros</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead>Supervisor</TableHead>
                          <TableHead>Fecha Creación</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredEquipos.map((equipo) => {
                          const supervisor = equipo.miembros?.find(m => m.rol === 'supervisor');
                          return (
                            <TableRow key={equipo.id}>
                              <TableCell>
                                <div className="font-medium">{equipo.nombre}</div>
                                {equipo.descripcion && (
                                  <div className="text-sm text-gray-500">{equipo.descripcion}</div>
                                )}
                              </TableCell>
                              <TableCell>
                                <div className="text-sm text-zinc-600">
                                  {equipo.tipo_empresa === 'salmonera' ? 'Salmonera' : 'Contratista'}
                                </div>
                              </TableCell>
                              <TableCell>
                                <div className="flex items-center gap-2">
                                  <Users className="w-4 h-4 text-gray-400" />
                                  <span>{equipo.miembros?.length || 0}</span>
                                  {(equipo.miembros?.length || 0) >= 3 && (
                                    <Badge variant="outline" className="text-xs bg-green-50 text-green-700">
                                      Completo
                                    </Badge>
                                  )}
                                </div>
                              </TableCell>
                              <TableCell>
                                <Badge variant={equipo.activo ? 'default' : 'secondary'}>
                                  {equipo.activo ? 'Activo' : 'Inactivo'}
                                </Badge>
                              </TableCell>
                              <TableCell>
                                {supervisor ? (
                                  <div className="text-sm">
                                    <div className="font-medium">{supervisor.nombre_completo}</div>
                                  </div>
                                ) : (
                                  <span className="text-gray-400 text-sm">Sin supervisor</span>
                                )}
                              </TableCell>
                              <TableCell>
                                {equipo.created_at ? new Date(equipo.created_at).toLocaleDateString('es-CL') : 'Sin fecha'}
                              </TableCell>
                              <TableCell className="text-right">
                                <div className="flex justify-end gap-1">
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="ios-button-sm h-8 w-8 p-0"
                                    title="Ver detalles"
                                  >
                                    <Eye className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="ios-button-sm h-8 w-8 p-0"
                                    title="Editar"
                                  >
                                    <Edit className="w-4 h-4" />
                                  </Button>
                                  <Button 
                                    variant="outline" 
                                    size="sm" 
                                    className="ios-button-sm h-8 w-8 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                                    title="Eliminar"
                                  >
                                    <Trash2 className="w-4 h-4" />
                                  </Button>
                                </div>
                              </TableCell>
                            </TableRow>
                          );
                        })}
                      </TableBody>
                    </Table>
                  </div>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default EquiposBuceoPage;
