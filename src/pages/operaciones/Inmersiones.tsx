
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Anchor, Plus, Calendar, Users, Activity, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CreateInmersionFormEnhanced } from "@/components/inmersiones/CreateInmersionFormEnhanced";
import { useInmersiones } from "@/hooks/useInmersiones";
import { Skeleton } from "@/components/ui/skeleton";

export default function Inmersiones() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const { inmersiones, loading, createInmersion } = useInmersiones();

  const handleCreateInmersion = async (data: any) => {
    try {
      await createInmersion(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating inmersion:', error);
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'planificada':
        return <Badge variant="outline" className="text-blue-600 border-blue-300">Planificada</Badge>;
      case 'en_progreso':
        return <Badge className="bg-yellow-100 text-yellow-800">En Progreso</Badge>;
      case 'completada':
        return <Badge className="bg-green-100 text-green-800">Completada</Badge>;
      case 'cancelada':
        return <Badge variant="destructive">Cancelada</Badge>;
      default:
        return <Badge variant="secondary">Borrador</Badge>;
    }
  };

  if (loading) {
    return (
      <>
        <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
          <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
            <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
            <div className="flex items-center gap-3">
              <Anchor className="w-6 h-6 text-zinc-600" />
              <div>
                <h1 className="text-xl font-semibold text-zinc-900">Inmersiones</h1>
                <p className="text-sm text-zinc-500">Registro de inmersiones planificadas y realizadas</p>
              </div>
            </div>
          </div>
        </header>
        <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto space-y-6">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-16 w-full" />
          ))}
        </div>
      </>
    );
  }

  return (
    <>
      {/* Header */}
      <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
        <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
          <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
          <div className="flex items-center gap-3">
            <Anchor className="w-6 h-6 text-zinc-600" />
            <div>
              <h1 className="text-xl font-semibold text-zinc-900">Inmersiones</h1>
              <p className="text-sm text-zinc-500">Registro de inmersiones planificadas y realizadas</p>
            </div>
          </div>
          <div className="flex-1" />
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-teal-600 hover:bg-teal-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nueva Inmersión
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Anchor className="w-4 h-4 text-teal-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Inmersiones</p>
                    <p className="text-2xl font-bold">{inmersiones.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Completadas</p>
                    <p className="text-2xl font-bold">{inmersiones.filter(i => i.estado === 'completada').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Planificadas</p>
                    <p className="text-2xl font-bold">{inmersiones.filter(i => i.estado === 'planificada').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Activity className="w-4 h-4 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">En Progreso</p>
                    <p className="text-2xl font-bold">{inmersiones.filter(i => i.estado === 'en_progreso').length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Inmersiones Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Anchor className="w-5 h-5" />
                Registro de Inmersiones
              </CardTitle>
            </CardHeader>
            <CardContent>
              {inmersiones.length === 0 ? (
                <div className="text-center py-12">
                  <Anchor className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay inmersiones registradas</h3>
                  <p className="text-zinc-500 mb-4">Comienza creando tu primera inmersión</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-teal-600 hover:bg-teal-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Inmersión
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Operación</TableHead>
                      <TableHead>Buzo Principal</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Profundidad</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {inmersiones.map((inmersion) => (
                      <TableRow key={inmersion.inmersion_id}>
                        <TableCell className="font-medium">{inmersion.codigo}</TableCell>
                        <TableCell>{inmersion.operacion_nombre || 'N/A'}</TableCell>
                        <TableCell>{inmersion.buzo_principal}</TableCell>
                        <TableCell>{inmersion.supervisor}</TableCell>
                        <TableCell>{new Date(inmersion.fecha_inmersion).toLocaleDateString()}</TableCell>
                        <TableCell>{inmersion.profundidad_max}m</TableCell>
                        <TableCell>{getStatusBadge(inmersion.estado)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Ver
                            </Button>
                            {inmersion.estado === 'planificada' && (
                              <Button variant="outline" size="sm">
                                Editar
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Create Dialog */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent variant="form" className="max-w-4xl max-h-[90vh] overflow-y-auto p-0">
          <CreateInmersionFormEnhanced
            onSubmit={handleCreateInmersion}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
