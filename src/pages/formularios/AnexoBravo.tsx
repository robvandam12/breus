
import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus, Eye, Edit, Download, TestTube } from "lucide-react";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { AnexoBravoWizard } from "@/components/anexo-bravo/AnexoBravoWizard";
import { CreateAnexoBravoForm } from "@/components/anexo-bravo/CreateAnexoBravoForm";
import { AnexoBravoForm } from "@/components/anexo-bravo/AnexoBravoForm";

const AnexoBravo = () => {
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [isTestDialogOpen, setIsTestDialogOpen] = useState(false);
  const [selectedForm, setSelectedForm] = useState<string>('');

  const anexosBravo = [
    {
      id: '1',
      codigo: 'AB-2024-001',
      empresa: 'Constructora Marina',
      fecha_creacion: '2024-01-15',
      estado: 'firmado',
      supervisor: 'Juan Pérez',
    },
    {
      id: '2',
      codigo: 'AB-2024-002',
      empresa: 'Servicios Submarinos',
      fecha_creacion: '2024-01-16',
      estado: 'borrador',
      supervisor: 'María González',
    },
  ];

  const handleCreateAnexo = async (data: any) => {
    console.log('Creating Anexo Bravo:', data);
    setIsCreateDialogOpen(false);
  };

  const getStatusColor = (estado: string) => {
    const colors = {
      'firmado': 'bg-green-100 text-green-700',
      'borrador': 'bg-yellow-100 text-yellow-700',
      'pendiente': 'bg-blue-100 text-blue-700'
    };
    return colors[estado as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  const forms = [
    { id: 'full', name: 'FullAnexoBravoForm', description: 'Formulario completo en pasos con todos los campos' },
    { id: 'wizard', name: 'AnexoBravoWizard', description: 'Wizard anterior en pasos' },
    { id: 'create', name: 'CreateAnexoBravoForm', description: 'Formulario básico de creación' },
    { id: 'simple', name: 'AnexoBravoForm', description: 'Formulario simple' }
  ];

  const renderSelectedForm = () => {
    switch (selectedForm) {
      case 'full':
        return (
          <FullAnexoBravoForm
            onSubmit={handleCreateAnexo}
            onCancel={() => setIsTestDialogOpen(false)}
          />
        );
      case 'wizard':
        return (
          <AnexoBravoWizard
            onSubmit={handleCreateAnexo}
            onCancel={() => setIsTestDialogOpen(false)}
          />
        );
      case 'create':
        return (
          <CreateAnexoBravoForm
            onSubmit={handleCreateAnexo}
            onCancel={() => setIsTestDialogOpen(false)}
          />
        );
      case 'simple':
        return (
          <AnexoBravoForm
            onSubmit={handleCreateAnexo}
            onCancel={() => setIsTestDialogOpen(false)}
          />
        );
      default:
        return null;
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-white">
          <Header 
            title="Anexos Bravo" 
            subtitle="Gestión de anexos bravo para operaciones de buceo" 
            icon={FileText} 
          >
            <div className="flex items-center gap-3">
              <Button 
                variant="outline"
                onClick={() => setIsTestDialogOpen(true)}
                className="flex items-center gap-2"
              >
                <TestTube className="w-4 h-4" />
                Probar Formularios
              </Button>
              <Button 
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Anexo Bravo
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {anexosBravo.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      No hay anexos bravo registrados
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      Comience creando el primer anexo bravo
                    </p>
                    <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-blue-600 hover:bg-blue-700">
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Anexo Bravo
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Empresa</TableHead>
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
                          <TableCell>{anexo.empresa}</TableCell>
                          <TableCell>{anexo.supervisor}</TableCell>
                          <TableCell>
                            {new Date(anexo.fecha_creacion).toLocaleDateString('es-CL')}
                          </TableCell>
                          <TableCell>
                            <Badge className={getStatusColor(anexo.estado)}>
                              {anexo.estado}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center gap-2 justify-end">
                              <Button variant="outline" size="sm">
                                <Eye className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Edit className="w-4 h-4" />
                              </Button>
                              <Button variant="outline" size="sm">
                                <Download className="w-4 h-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </Card>
              )}
            </div>
          </div>
        </main>
      </div>

      {/* Dialog para crear nuevo Anexo Bravo */}
      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Crear Nuevo Anexo Bravo</DialogTitle>
          </DialogHeader>
          <FullAnexoBravoForm
            onSubmit={handleCreateAnexo}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {/* Dialog para probar formularios */}
      <Dialog open={isTestDialogOpen} onOpenChange={setIsTestDialogOpen}>
        <DialogContent className="max-w-7xl max-h-[90vh] overflow-hidden">
          <DialogHeader>
            <DialogTitle>Probar Formularios de Anexo Bravo</DialogTitle>
          </DialogHeader>
          {!selectedForm ? (
            <div className="space-y-4">
              <p className="text-sm text-gray-600 mb-4">
                Selecciona un formulario para probar:
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {forms.map((form) => (
                  <Card key={form.id} className="cursor-pointer hover:bg-gray-50" onClick={() => setSelectedForm(form.id)}>
                    <CardHeader>
                      <CardTitle className="text-lg">{form.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-gray-600">{form.description}</p>
                      <Button className="mt-3" size="sm">
                        Probar este formulario
                      </Button>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">
                  Probando: {forms.find(f => f.id === selectedForm)?.name}
                </h3>
                <Button variant="outline" onClick={() => setSelectedForm('')}>
                  Volver a la lista
                </Button>
              </div>
              {renderSelectedForm()}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </SidebarProvider>
  );
};

export default AnexoBravo;
