
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Search, FileText, Plus, Eye, Signature } from "lucide-react";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { EnhancedDigitalSignature } from "@/components/signatures/EnhancedDigitalSignature";

export const AnexoBravoFormularios = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedAnexo, setSelectedAnexo] = useState<any>(null);
  const [showDetail, setShowDetail] = useState(false);
  const [showSignature, setShowSignature] = useState(false);
  const [signingAnexo, setSigningAnexo] = useState<any>(null);

  const { anexosBravo, isLoading, signAnexoBravo } = useAnexoBravo();

  const filteredAnexos = anexosBravo?.filter(anexo =>
    anexo.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    anexo.supervisor?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const handleViewDetail = (anexo: any) => {
    setSelectedAnexo(anexo);
    setShowDetail(true);
  };

  const handleSignAnexo = (anexo: any) => {
    setSigningAnexo(anexo);
    setShowSignature(true);
  };

  const handleSignatureComplete = async (signatureData: { signature: string; signerName: string; timestamp: string }) => {
    if (!signingAnexo) return;

    try {
      await signAnexoBravo({
        id: signingAnexo.id,
        signatures: {
          supervisor_servicio_url: signatureData.signature,
          supervisor_mandante_url: signatureData.signature
        }
      });
      setShowSignature(false);
      setSigningAnexo(null);
    } catch (error) {
      console.error('Error signing Anexo Bravo:', error);
    }
  };

  const getEstadoBadgeColor = (estado: string) => {
    const colors: Record<string, string> = {
      borrador: 'bg-gray-100 text-gray-700',
      firmado: 'bg-green-100 text-green-700',
      pendiente: 'bg-yellow-100 text-yellow-700',
    };
    return colors[estado] || 'bg-gray-100 text-gray-700';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="ml-4 text-gray-500">Cargando Anexos Bravo...</p>
      </div>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
              <div className="flex items-center gap-3">
                <FileText className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Formularios Anexo Bravo</h1>
                  <p className="text-sm text-zinc-500">Gestión de formularios de seguridad</p>
                </div>
              </div>
              <div className="flex-1" />
              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-orange-600 hover:bg-orange-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Anexo Bravo
              </Button>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* Search and Filters */}
              <Card className="mb-6">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="w-5 h-5 text-orange-600" />
                      Anexos Bravo Registrados
                    </CardTitle>
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                        <Input
                          placeholder="Buscar Anexos Bravo..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                          className="pl-10 w-64"
                        />
                      </div>
                    </div>
                  </div>
                </CardHeader>
              </Card>

              {/* Anexos Table */}
              {filteredAnexos.length === 0 ? (
                <Card className="text-center py-12">
                  <CardContent>
                    <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-zinc-900 mb-2">
                      {anexosBravo?.length === 0 ? "No hay Anexos Bravo registrados" : "No se encontraron Anexos Bravo"}
                    </h3>
                    <p className="text-zinc-500 mb-4">
                      {anexosBravo?.length === 0 
                        ? "Comience creando el primer Anexo Bravo"
                        : "Intenta ajustar la búsqueda"}
                    </p>
                    {anexosBravo?.length === 0 && (
                      <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-orange-600 hover:bg-orange-700">
                        <Plus className="w-4 h-4 mr-2" />
                        Crear Primer Anexo Bravo
                      </Button>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Código</TableHead>
                        <TableHead>Supervisor</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredAnexos.map((anexo) => (
                        <TableRow key={anexo.id}>
                          <TableCell>
                            <div className="font-medium">{anexo.codigo}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm">{anexo.supervisor}</div>
                          </TableCell>
                          <TableCell>
                            {anexo.fecha ? new Date(anexo.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                          </TableCell>
                          <TableCell>
                            <Badge className={getEstadoBadgeColor(anexo.estado || 'borrador')}>
                              {anexo.firmado ? 'Firmado' : (anexo.estado || 'Borrador')}
                            </Badge>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => handleViewDetail(anexo)}
                              >
                                <Eye className="w-4 h-4" />
                              </Button>
                              {!anexo.firmado && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => handleSignAnexo(anexo)}
                                  className="text-orange-600 hover:text-orange-700"
                                >
                                  <Signature className="w-4 h-4" />
                                </Button>
                              )}
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

          {/* Create Anexo Dialog */}
          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto p-0">
              <FullAnexoBravoForm
                onSubmit={() => setIsCreateDialogOpen(false)}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>

          {/* Detail Dialog */}
          <Dialog open={showDetail} onOpenChange={setShowDetail}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              {selectedAnexo && (
                <div className="space-y-6">
                  <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Detalle Anexo Bravo</h2>
                    <p className="mt-2 text-gray-600">Código: {selectedAnexo.codigo}</p>
                  </div>
                  {/* Add detail view content here */}
                </div>
              )}
            </DialogContent>
          </Dialog>

          {/* Signature Dialog */}
          <Dialog open={showSignature} onOpenChange={setShowSignature}>
            <DialogContent className="max-w-2xl">
              <div className="space-y-6">
                <div className="text-center">
                  <h2 className="text-2xl font-bold text-gray-900">Firmar Anexo Bravo</h2>
                  <p className="mt-2 text-gray-600">
                    Código: {signingAnexo?.codigo}
                  </p>
                </div>
                <EnhancedDigitalSignature
                  title="Firma del Administrador de Salmonera"
                  role="Administrador de Salmonera"
                  isSigned={false}
                  onSign={handleSignatureComplete}
                  onReset={() => {}}
                  iconColor="text-orange-600"
                  requireSignerName={true}
                />
              </div>
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default AnexoBravoFormularios;
