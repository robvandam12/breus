import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Users, Plus, Search } from "lucide-react";
import { CreateEquipoFormWizard } from "@/components/equipos/CreateEquipoFormWizard";
import { EquipoBuceoActions } from "@/components/equipos/EquipoBuceoActions";
import { useEquipoBuceo } from "@/hooks/useEquipoBuceo";
import { toast } from "@/hooks/use-toast";
import { BitacoraPageLayout } from "@/components/layout/BitacoraPageLayout";
import { WizardDialog } from "@/components/forms/WizardDialog";
import { Skeleton } from "@/components/ui/skeleton";

const EquipoBuceo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { equipos, isLoading, createEquipo, updateEquipo, deleteEquipo } = useEquipoBuceo();

  const filteredEquipos = equipos.filter(equipo => 
    equipo.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateEquipo = async (data: any) => {
    try {
      const newEquipo = await createEquipo(data.equipoData);
      
      if (data.members && data.members.length > 0) {
        toast({
          title: "Equipo creado",
          description: `Equipo "${data.equipoData.nombre}" creado exitosamente con ${data.members.length} miembros.`,
        });
      }
      
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating equipo:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el equipo.",
        variant: "destructive",
      });
    }
  };

  const handleEditEquipo = async (equipo: any) => {
    try {
      await updateEquipo({
        id: equipo.id,
        data: {
          nombre: equipo.nombre,
          descripcion: equipo.descripcion
        }
      });
    } catch (error) {
      console.error('Error updating equipo:', error);
    }
  };

  const handleDeleteEquipo = async (equipoId: string) => {
    try {
      await deleteEquipo(equipoId);
    } catch (error) {
      console.error('Error deleting equipo:', error);
    }
  };

  const handleAddMember = (equipoId: string) => {
    toast({
      title: "Agregar Miembro",
      description: "Funcionalidad de agregar miembro próximamente.",
    });
  };

  const totalMiembros = equipos.reduce((total, equipo) => total + (equipo.miembros?.length || 0), 0);
  const supervisores = equipos.reduce((total, equipo) => total + (equipo.miembros?.filter(m => m.rol_equipo === 'supervisor').length || 0), 0);
  const buzos = equipos.reduce((total, equipo) => total + (equipo.miembros?.filter(m => m.rol_equipo && m.rol_equipo.includes('buzo')).length || 0), 0);

  const headerActions = (
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

      <WizardDialog
        triggerText="Nuevo Equipo"
        triggerIcon={Plus}
        triggerClassName="bg-blue-600 hover:bg-blue-700"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        size="xl"
      >
        <CreateEquipoFormWizard
          onSubmit={handleCreateEquipo}
          onCancel={() => setIsCreateDialogOpen(false)}
        />
      </WizardDialog>
    </div>
  );

  if (isLoading) {
    return (
      <BitacoraPageLayout
        title="Equipo de Buceo"
        subtitle="Gestión de equipos y personal de buceo"
        icon={Users}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </BitacoraPageLayout>
    );
  }

  return (
    <BitacoraPageLayout
      title="Equipo de Buceo"
      subtitle="Gestión de equipos y personal de buceo"
      icon={Users}
      headerActions={headerActions}
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {equipos.length}
          </div>
          <div className="text-sm text-zinc-500">Equipos Activos</div>
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
      </div>

      {filteredEquipos.length === 0 ? (
        <Card className="text-center py-12">
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
            {equipos.length === 0 && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Equipo
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Equipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Miembros</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipos.map((equipo) => (
                <TableRow key={equipo.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{equipo.nombre}</div>
                        <div className="text-xs text-zinc-500">
                          Creado: {new Date(equipo.created_at || '').toLocaleDateString('es-CL')}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-600 max-w-xs truncate">
                    {equipo.descripcion || 'Sin descripción'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {equipo.miembros?.length || 0} miembros
                      </Badge>
                      {(equipo.miembros?.length || 0) > 0 && (
                        <div className="flex -space-x-1">
                          {equipo.miembros?.slice(0, 3).map((miembro, index) => (
                            <div
                              key={miembro.id}
                              className="w-6 h-6 bg-zinc-300 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white"
                              title={miembro.nombre_completo}
                            >
                              {(miembro.nombre_completo || '').charAt(0).toUpperCase()}
                            </div>
                          ))}
                          {(equipo.miembros?.length || 0) > 3 && (
                            <div className="w-6 h-6 bg-zinc-500 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-white">
                              +{(equipo.miembros?.length || 0) - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={equipo.activo ? 'default' : 'secondary'}>
                      {equipo.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {equipo.tipo_empresa === 'salmonera' ? 'Salmonera' : 'Servicio'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <EquipoBuceoActions
                      equipo={equipo}
                      onEdit={handleEditEquipo}
                      onDelete={handleDeleteEquipo}
                      onAddMember={handleAddMember}
                    />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Card>
      )}
    </BitacoraPageLayout>
  );
};

export default EquipoBuceo;
