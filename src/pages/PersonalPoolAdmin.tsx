
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Users, Search, Plus } from "lucide-react";
import { useUsuarios } from "@/hooks/useUsuarios";
import { MainLayout } from "@/components/layout/MainLayout";

const PersonalPoolAdmin = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const { usuarios, isLoading } = useUsuarios();

  const filteredUsuarios = usuarios.filter(usuario => 
    usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    usuario.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getRolBadge = (rol: string) => {
    const colorMap: Record<string, string> = {
      superuser: 'bg-purple-100 text-purple-700',
      admin_salmonera: 'bg-blue-100 text-blue-700',
      admin_servicio: 'bg-green-100 text-green-700',
      supervisor: 'bg-yellow-100 text-yellow-700',
      buzo: 'bg-teal-100 text-teal-700',
    };
    return colorMap[rol] || 'bg-gray-100 text-gray-700';
  };

  const headerActions = (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
        <Input
          placeholder="Buscar personal..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-64"
        />
      </div>
      <Button className="bg-blue-600 hover:bg-blue-700">
        <Plus className="w-4 h-4 mr-2" />
        Nuevo Usuario
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <MainLayout
        title="Personal Pool"
        subtitle="Todos los usuarios del sistema"
        icon={Users}
        headerChildren={headerActions}
      >
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner text="Cargando Personal..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Personal Pool"
      subtitle="Todos los usuarios del sistema"
      icon={Users}
      headerChildren={headerActions}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Total Personal</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usuarios.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Supervisores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usuarios.filter(u => u.rol === 'supervisor').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Buzos</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usuarios.filter(u => u.rol === 'buzo').length}
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium">Admins Salmonera</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {usuarios.filter(u => u.rol === 'admin_salmonera').length}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Personal Registrado</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Usuario</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Rol</TableHead>
                  <TableHead>Empresa</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha Registro</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsuarios.map((usuario) => (
                  <TableRow key={usuario.usuario_id}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <Users className="w-4 h-4 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-medium">
                            {usuario.nombre} {usuario.apellido}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="text-zinc-600">
                      {usuario.email || 'Sin email'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={getRolBadge(usuario.rol)}>
                        {usuario.rol}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-600">
                      {usuario.salmonera_id ? 'Salmonera' : usuario.servicio_id ? 'Contratista' : 'Sin asignar'}
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={
                        usuario.perfil_completado 
                          ? 'bg-green-100 text-green-700'
                          : 'bg-yellow-100 text-yellow-700'
                      }>
                        {usuario.perfil_completado ? 'Activo' : 'Incompleto'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-zinc-600">
                      {new Date(usuario.created_at).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default PersonalPoolAdmin;
