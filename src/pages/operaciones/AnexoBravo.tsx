
import { useState } from "react";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, Plus, Calendar, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { CreateAnexoBravoForm } from "@/components/formularios/CreateAnexoBravoForm";
import { Skeleton } from "@/components/ui/skeleton";

// Mock data - en producción vendría de la API
const anexosBravo = [
  {
    id: "1",
    codigo: "AB-001",
    operacion: "Mantención Centro Norte",
    fecha: "2024-01-15",
    supervisor: "Juan Pérez",
    estado: "firmado",
    firmado: true,
    created_at: "2024-01-15T10:00:00Z"
  },
  {
    id: "2", 
    codigo: "AB-002",
    operacion: "Inspección Redes Sur",
    fecha: "2024-01-16",
    supervisor: "María González",
    estado: "pendiente",
    firmado: false,
    created_at: "2024-01-16T08:30:00Z"
  }
];

export default function AnexoBravo() {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCreateAnexo = async (data: any) => {
    setLoading(true);
    try {
      console.log('Creating Anexo Bravo:', data);
      // Aquí iría la lógica para crear el anexo bravo
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simular API call
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating anexo bravo:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusBadge = (estado: string, firmado: boolean) => {
    if (firmado && estado === 'firmado') {
      return <Badge className="bg-green-100 text-green-800">Firmado</Badge>;
    }
    if (estado === 'pendiente') {
      return <Badge variant="outline" className="text-orange-600 border-orange-300">Pendiente</Badge>;
    }
    return <Badge variant="secondary">Borrador</Badge>;
  };

  if (loading) {
    return (
      <>
        <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
          <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
            <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
            <div className="flex items-center gap-3">
              <FileText className="w-6 h-6 text-zinc-600" />
              <div>
                <h1 className="text-xl font-semibold text-zinc-900">Anexo Bravo</h1>
                <p className="text-sm text-zinc-500">Autorización de trabajo de buceo</p>
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
            <FileText className="w-6 h-6 text-zinc-600" />
            <div>
              <h1 className="text-xl font-semibold text-zinc-900">Anexo Bravo</h1>
              <p className="text-sm text-zinc-500">Autorización de trabajo de buceo</p>
            </div>
          </div>
          <div className="flex-1" />
          <Button
            onClick={() => setIsCreateDialogOpen(true)}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <Plus className="w-4 h-4 mr-2" />
            Nuevo Anexo Bravo
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <FileText className="w-4 h-4 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600">Total Anexos</p>
                    <p className="text-2xl font-bold">{anexosBravo.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Firmados</p>
                    <p className="text-2xl font-bold">{anexosBravo.filter(a => a.firmado).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <Clock className="w-4 h-4 text-orange-600" />
                  <div>
                    <p className="text-sm text-gray-600">Pendientes</p>
                    <p className="text-2xl font-bold">{anexosBravo.filter(a => !a.firmado).length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Anexos Table */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5" />
                Anexos Bravo
              </CardTitle>
            </CardHeader>
            <CardContent>
              {anexosBravo.length === 0 ? (
                <div className="text-center py-12">
                  <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay anexos bravo</h3>
                  <p className="text-zinc-500 mb-4">Comienza creando tu primer anexo bravo</p>
                  <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nuevo Anexo Bravo
                  </Button>
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Operación</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {anexosBravo.map((anexo) => (
                      <TableRow key={anexo.id}>
                        <TableCell className="font-medium">{anexo.codigo}</TableCell>
                        <TableCell>{anexo.operacion}</TableCell>
                        <TableCell>{anexo.supervisor}</TableCell>
                        <TableCell>{new Date(anexo.fecha).toLocaleDateString()}</TableCell>
                        <TableCell>{getStatusBadge(anexo.estado, anexo.firmado)}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2">
                            <Button variant="outline" size="sm">
                              Ver
                            </Button>
                            {!anexo.firmado && (
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
          <CreateAnexoBravoForm
            onSubmit={handleCreateAnexo}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}
