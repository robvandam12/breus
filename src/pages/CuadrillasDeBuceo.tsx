
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search, Calendar, AlertTriangle } from "lucide-react";
import { CreateCuadrillaFormWizard } from "@/components/cuadrillas/CreateCuadrillaFormWizard";
import { CuadrillaBuceoActions } from "@/components/cuadrillas/CuadrillaBuceoActions";
import { useCuadrillasBuceo } from "@/hooks/useCuadrillasBuceo";
import { toast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/layout/MainLayout";
import { WizardDialog } from "@/components/forms/WizardDialog";
import { Skeleton } from "@/components/ui/skeleton";

const CuadrillasDeBuceo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { cuadrillas, isLoading, createCuadrilla, updateCuadrilla, deleteCuadrilla } = useCuadrillasBuceo();

  const filteredCuadrillas = cuadrillas.filter(cuadrilla => 
    cuadrilla.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    cuadrilla.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateCuadrilla = async (data: any) => {
    try {
      const newCuadrilla = await createCuadrilla(data.cuadrillaData);
      
      if (data.members && data.members.length > 0) {
        toast({
          title: "Cuadrilla creada",
          description: `Cuadrilla "${data.cuadrillaData.nombre}" creada exitosamente con ${data.members.length} miembros.`,
        });
      }
      
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating cuadrilla:', error);
      toast({
        title: "Error",
        description: "No se pudo crear la cuadrilla.",
        variant: "destructive",
      });
    }
  };

  const handleEditCuadrilla = async (cuadrilla: any) => {
    try {
      await updateCuadrilla({
        id: cuadrilla.id,
        data: {
          nombre: cuadrilla.nombre,
          descripcion: cuadrilla.descripcion
        }
      });
    } catch (error) {
      console.error('Error updating cuadrilla:', error);
    }
  };

  const handleDeleteCuadrilla = async (cuadrillaId: string) => {
    try {
      await deleteCuadrilla(cuadrillaId);
    } catch (error) {
      console.error('Error deleting cuadrilla:', error);
    }
  };

  const handleAddMember = (cuadrillaId: string) => {
    toast({
      title: "Agregar Miembro",
      description: "Funcionalidad de agregar miembro próximamente.",
    });
  };

  const totalMiembros = cuadrillas.reduce((total, cuadrilla) => total + (cuadrilla.miembros?.length || 0), 0);
  const supervisores = cuadrillas.reduce((total, cuadrilla) => total + (cuadrilla.miembros?.filter(m => m.rol === 'supervisor').length || 0), 0);
  const buzos = cuadrillas.reduce((total, cuadrilla) => total + (cuadrilla.miembros?.filter(m => m.rol && m.rol.includes('buzo')).length || 0), 0);
  const cuadrillasConAsignaciones = cuadrillas.filter(cuadrilla => (cuadrilla.asignaciones_activas?.length || 0) > 0).length;

  const headerActions = (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
        <Input
          placeholder="Buscar cuadrillas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-64"
        />
      </div>

      <WizardDialog
        triggerText="Nueva Cuadrilla"
        triggerIcon={Plus}
        triggerClassName="bg-blue-600 hover:bg-blue-700"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        size="xl"
      >
        <CreateCuadrillaFormWizard
          onSubmit={handleCreateCuadrilla}
          onCancel={() => setIsCreateDialogOpen(false)}
        />
      </WizardDialog>
    </div>
  );

  if (isLoading) {
    return (
      <MainLayout
        title="Cuadrillas de Buceo"
        subtitle="Gestión de cuadrillas y personal de buceo"
        icon={Users}
        headerChildren={headerActions}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Cuadrillas de Buceo"
      subtitle="Gestión de cuadrillas y personal de buceo"
      icon={Users}
      headerChildren={headerActions}
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6 mb-6">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {cuadrillas.length}
          </div>
          <div className="text-sm text-zinc-500">Cuadrillas Activas</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {totalMiembros}
          </div>
          <div className="text-sm text-zinc-500">Total Miembros</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {supervisores}
          </div>
          <div className="text-sm text-zinc-500">Supervisores</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-gray-600">
            {buzos}
          </div>
          <div className="text-sm text-zinc-500">Buzos</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-orange-600">
            {cuadrillasConAsignaciones}
          </div>
          <div className="text-sm text-zinc-500">Con Asignaciones</div>
        </Card>
      </div>

      {filteredCuadrillas.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">
              {cuadrillas.length === 0 ? "No hay cuadrillas registradas" : "No se encontraron cuadrillas"}
            </h3>
            <p className="text-zinc-500 mb-4">
              {cuadrillas.length === 0 
                ? "Comience creando la primera cuadrilla de buceo"
                : "Intenta ajustar la búsqueda"}
            </p>
            {cuadrillas.length === 0 && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Cuadrilla
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cuadrilla</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Miembros</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Asignaciones</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredCuadrillas.map((cuadrilla) => (
                <TableRow key={cuadrilla.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{cuadrilla.nombre}</div>
                        <div className="text-xs text-zinc-500">
                          Creada: {new Date(cuadrilla.created_at || '').toLocaleDateString('es-CL')}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-600 max-w-xs truncate">
                    {cuadrilla.descripcion || 'Sin descripción'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {cuadrilla.miembros?.length || 0} miembros
                      </Badge>
                      {(cuadrilla.miembros?.length || 0) > 0 && (
                        <div className="flex -space-x-1">
                          {cuadrilla.miembros?.slice(0, 3).map((miembro, index) => (
                            <div
                              key={miembro.id}
                              className="w-6 h-6 bg-zinc-300 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white"
                              title={miembro.nombre_completo}
                            >
                              {(miembro.nombre_completo || '').charAt(0).toUpperCase()}
                            </div>
                          ))}
                          {(cuadrilla.miembros?.length || 0) > 3 && (
                            <div className="w-6 h-6 bg-zinc-500 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-white">
                              +{(cuadrilla.miembros?.length || 0) - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={cuadrilla.activo ? 'default' : 'secondary'}>
                      {cuadrilla.activo ? 'Activa' : 'Inactiva'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {(cuadrilla.asignaciones_activas?.length || 0) > 0 ? (
                        <>
                          <Calendar className="w-4 h-4 text-orange-600" />
                          <Badge variant="outline" className="bg-orange-50 text-orange-700">
                            {cuadrilla.asignaciones_activas?.length} activas
                          </Badge>
                        </>
                      ) : (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Disponible
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {cuadrilla.tipo_empresa === 'salmonera' ? 'Salmonera' : 'Servicio'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <CuadrillaBuceoActions
                      cuadrilla={cuadrilla}
                      onEdit={handleEditCuadrilla}
                      onDelete={handleDeleteCuadrilla}
                      onAddMember={handleAddMember}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </MainLayout>
  );
};

export default CuadrillasDeBuceo;
