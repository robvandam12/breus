
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { FileText, Plus, PenTool, Eye, CheckCircle } from "lucide-react";
import { useHPT } from "@/hooks/useHPT";
import { HPTStep6 } from "@/components/hpt/steps/HPTStep6";
import { useRouter } from "@/hooks/useRouter";
import { toast } from "@/hooks/use-toast";

export default function HPTList() {
  const [selectedHPT, setSelectedHPT] = useState<any>(null);
  const [showSignDialog, setShowSignDialog] = useState(false);
  const { hpts, isLoading, signHPT } = useHPT();
  const { navigateTo } = useRouter();

  const handleSignHPT = async (hptData: any) => {
    try {
      await signHPT({
        id: selectedHPT.id,
        signatures: {
          supervisor_servicio_url: hptData.supervisor_firma,
          supervisor_mandante_url: hptData.jefe_obra_firma
        }
      });
      setShowSignDialog(false);
      setSelectedHPT(null);
    } catch (error) {
      console.error('Error signing HPT:', error);
    }
  };

  const getEstadoBadge = (hpt: any) => {
    if (hpt.firmado) {
      return (
        <Badge className="bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Firmado
        </Badge>
      );
    }
    return (
      <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
        {hpt.estado === 'borrador' ? 'Borrador' : 'Pendiente Firma'}
      </Badge>
    );
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-white">
          <Header 
            title="HPTs" 
            subtitle="Hojas de Planificación de Tarea" 
            icon={FileText} 
          >
            <Button onClick={() => navigateTo('/formularios/hpt/new')}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva HPT
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-6">
              {isLoading ? (
                <div className="text-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                  <p className="mt-2 text-gray-600">Cargando HPTs...</p>
                </div>
              ) : hpts.length === 0 ? (
                <Card>
                  <CardContent className="text-center py-12">
                    <FileText className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No hay HPTs</h3>
                    <p className="text-gray-600 mb-6">
                      Comience creando su primera Hoja de Planificación de Tarea.
                    </p>
                    <Button onClick={() => navigateTo('/formularios/hpt/new')}>
                      <Plus className="w-4 h-4 mr-2" />
                      Nueva HPT
                    </Button>
                  </CardContent>
                </Card>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {hpts.map((hpt) => (
                    <Card key={hpt.id} className="hover:shadow-lg transition-shadow">
                      <CardHeader className="pb-3">
                        <div className="flex items-center justify-between">
                          <CardTitle className="text-lg">{hpt.codigo}</CardTitle>
                          {getEstadoBadge(hpt)}
                        </div>
                      </CardHeader>
                      <CardContent className="space-y-3">
                        <div className="text-sm text-gray-600">
                          <p><strong>Supervisor:</strong> {hpt.supervisor}</p>
                          <p><strong>Fecha:</strong> {hpt.fecha_programada || hpt.fecha || 'Sin fecha'}</p>
                          <p><strong>Estado:</strong> {hpt.estado}</p>
                        </div>
                        
                        <div className="pt-3 border-t border-gray-200 flex gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            onClick={() => navigateTo(`/formularios/hpt/${hpt.id}`)}
                            className="flex-1"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Ver
                          </Button>
                          {!hpt.firmado && (
                            <Button 
                              size="sm"
                              onClick={() => {
                                setSelectedHPT(hpt);
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
                <DialogTitle>Firmar HPT: {selectedHPT?.codigo}</DialogTitle>
              </DialogHeader>
              {selectedHPT && (
                <HPTStep6 
                  data={selectedHPT} 
                  onUpdate={handleSignHPT}
                />
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
}
