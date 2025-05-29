
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Shield, Plus, PenTool, Eye, CheckCircle } from "lucide-react";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { AnexoBravoStep5 } from "@/components/anexo-bravo/steps/AnexoBravoStep5";
import { useRouter } from "@/hooks/useRouter";

export default function AnexoBravoList() {
  const [selectedAnexo, setSelectedAnexo] = useState<any>(null);
  const [showSignDialog, setShowSignDialog] = useState(false);
  const { anexosBravo, isLoading, signAnexoBravo } = useAnexoBravo();
  const { navigateTo } = useRouter();

  const handleSignAnexo = async (anexoData: any) => {
    try {
      await signAnexoBravo({
        id: selectedAnexo.id,
        signatures: anexoData.anexo_bravo_firmas
      });
      setShowSignDialog(false);
      setSelectedAnexo(null);
    } catch (error) {
      console.error('Error signing Anexo Bravo:', error);
    }
  };

  const getEstadoBadge = (anexo: any) => {
    if (anexo.firmado) {
      return (
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Firmado
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
        {anexo.estado === 'borrador' ? 'Borrador' : 'Pendiente Firma'}
      </Badge>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-white">
          <Header 
            title="Anexos Bravo" 
            subtitle="Anexos de Seguridad para Buceo" 
            icon={Shield} 
          >
            <Button onClick={() => navigateTo('/formularios/anexo-bravo/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Anexo Bravo
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando Anexos Bravo...</p>
                </div>
              ) : anexosBravo.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <Shield className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay Anexos Bravo</h3>
                    <p className="text-gray-600 mb-6">
                      Comience creando su primer Anexo Bravo.
                    </p>
                    <Button onClick={() => navigateTo('/formularios/anexo-bravo/new')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nuevo Anexo Bravo
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {anexosBravo.map((anexo) => (
                    <Card key={anexo.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{anexo.codigo}</CardTitle>
                          {getEstadoBadge(anexo)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm text-gray-600">
                          <p><strong>Lugar:</strong> {anexo.lugar_faena || 'Sin especificar'}</p>
                          <p><strong>Empresa:</strong> {anexo.empresa_nombre || 'Sin especificar'}</p>
                          <p><strong>Fecha:</strong> {anexo.fecha || 'Sin fecha'}</p>
                          <p><strong>Estado:</strong> {anexo.estado}</p>
                        </div>
                        
                        <div className="pt-3 border-t border-gray-200 flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigateTo(`/formularios/anexo-bravo/${anexo.id}`)}
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                          {!anexo.firmado && (
                            <Button 
                              size="sm"
                              onClick={() => {
                                setSelectedAnexo(anexo);
                                setShowSignDialog(true);
                              }}
                              className="bg-blue-600 hover:bg-blue-700"
                            >
                              <PenTool className="w-4 h-4 mr-1" />
                              Firmar
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          <Dialog open={showSignDialog} onOpenChange={setShowSignDialog}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Firmar Anexo Bravo: {selectedAnexo?.codigo}</DialogTitle>
              </DialogHeader>
              {selectedAnexo && (
                <AnexoBravoStep5 
                  data={selectedAnexo} 
                  onUpdate={handleSignAnexo}
                />
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
}
