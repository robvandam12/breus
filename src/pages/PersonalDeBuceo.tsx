
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
import { MainLayout } from "@/components/layout/MainLayout";
import { WizardDialog } from "@/components/forms/WizardDialog";
import { Skeleton } from "@/components/ui/skeleton";

const PersonalDeBuceo = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { equipos, isLoading, createEquipo, updateEquipo, deleteEquipo } = useEquipoBuceo();

  const filteredEquipos = equipos.filter(equipo => 
    equipo.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    equipo.descripcion?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePersonal = async (data: any) => {
    try {
      const newPersonal = await createEquipo(data.equipoData);
      
      if (data.members && data.members.length > 0) {
        toast({
          title: "Personal creado",
          description: `Personal "${data.equipoData.nombre}" creado exitosamente con ${data.members.length} miembros.`,
        });
      }
      
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating personal:', error);
      toast({
        title: "Error",
        description: "No se pudo crear el personal.",
        variant: "destructive",
      });
    }
  };

  const handleEditPersonal = async (personal: any) => {
    try {
      await updateEquipo({
        id: personal.id,
        data: {
          nombre: personal.nombre,
          descripcion: personal.descripcion
        }
      });
    } catch (error) {
      console.error('Error updating personal:', error);
    }
  };

  const handleDeletePersonal = async (personalId: string) => {
    try {
      await deleteEquipo(personalId);
    } catch (error) {
      console.error('Error deleting personal:', error);
    }
  };

  const handleAddMember = (personalId: string) => {
    toast({
      title: "Agregar Miembro",
      description: "Funcionalidad de agregar miembro próximamente.",
    });
  };

  const totalMiembros = equipos.reduce((total, personal) => total + (personal.miembros?.length || 0), 0);
  const supervisores = equipos.reduce((total, personal) => total + (personal.miembros?.filter(m => m.rol_equipo === 'supervisor').length || 0), 0);
  const buzos = equipos.reduce((total, personal) => total + (personal.miembros?.filter(m => m.rol_equipo && m.rol_equipo.includes('buzo')).length || 0), 0);

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

      <WizardDialog
        triggerText="Nuevo Personal"
        triggerIcon={Plus}
        triggerClassName="bg-blue-600 hover:bg-blue-700"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
        size="xl"
      >
        <CreateEquipoFormWizard
          onSubmit={handleCreatePersonal}
          onCancel={() => setIsCreateDialogOpen(false)}
        />
      </WizardDialog>
    </div>
  );

  if (isLoading) {
    return (
      <MainLayout
        title="Personal de Buceo"
        subtitle="Gestión de personal y grupos de buceo"
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
      title="Personal de Buceo"
      subtitle="Gestión de personal y grupos de buceo"
      icon={Users}
      headerChildren={headerActions}
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {equipos.length}
          </div>
          <div className="text-sm text-zinc-500">Grupos Activos</div>
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
              {equipos.length === 0 ? "No hay personal registrado" : "No se encontró personal"}
            </h3>
            <p className="text-zinc-500 mb-4">
              {equipos.length === 0 
                ? "Comience creando el primer grupo de personal de buceo"
                : "Intenta ajustar la búsqueda"}
            </p>
            {equipos.length === 0 && (
              <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Personal
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Personal</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Miembros</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead>Empresa</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredEquipos.map((personal) => (
                <TableRow key={personal.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                        <Users className="w-4 h-4 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium">{personal.nombre}</div>
                        <div className="text-xs text-zinc-500">
                          Creado: {new Date(personal.created_at || '').toLocaleDateString('es-CL')}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className="text-zinc-600 max-w-xs truncate">
                    {personal.descripcion || 'Sin descripción'}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">
                        {personal.miembros?.length || 0} miembros
                      </Badge>
                      {(personal.miembros?.length || 0) > 0 && (
                        <div className="flex -space-x-1">
                          {personal.miembros?.slice(0, 3).map((miembro, index) => (
                            <div
                              key={miembro.id}
                              className="w-6 h-6 bg-zinc-300 rounded-full flex items-center justify-center text-xs font-medium border-2 border-white"
                              title={miembro.nombre_completo}
                            >
                              {(miembro.nombre_completo || '').charAt(0).toUpperCase()}
                            </div>
                          ))}
                          {(personal.miembros?.length || 0) > 3 && (
                            <div className="w-6 h-6 bg-zinc-500 rounded-full flex items-center justify-center text-xs font-medium text-white border-2 border-white">
                              +{(personal.miembros?.length || 0) - 3}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={personal.activo ? 'default' : 'secondary'}>
                      {personal.activo ? 'Activo' : 'Inactivo'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-zinc-600">
                    <Badge variant="outline" className="bg-blue-50 text-blue-700">
                      {personal.tipo_empresa === 'salmonera' ? 'Salmonera' : 'Servicio'}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <EquipoBuceoActions
                      equipo={personal}
                      onEdit={handleEditPersonal}
                      onDelete={handleDeletePersonal}
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

export default PersonalDeBuceo;
