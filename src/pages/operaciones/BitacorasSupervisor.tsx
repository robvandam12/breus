
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Plus, FileText } from "lucide-react";
import { BitacoraWizard } from "@/components/bitacoras/BitacoraWizard";
import { BitacoraStats } from "@/components/bitacoras/BitacoraStats";
import { BitacoraTableRow } from "@/components/bitacoras/BitacoraTableRow";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useBitacoras } from "@/hooks/useBitacoras";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function BitacorasSupervisor() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { bitacorasSupervisor, isLoading, signBitacoraSupervisor } = useBitacoras();

  const handleCreateBitacora = async (data: any) => {
    console.log('Creating bitacora supervisor:', data);
    setShowCreateForm(false);
  };

  const handleSignBitacora = async (id: string, signatureData: string) => {
    try {
      await signBitacoraSupervisor(id, signatureData);
    } catch (error) {
      console.error('Error signing bitacora:', error);
    }
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-white">
          <Header 
            title="Bitácoras de Supervisor" 
            subtitle="Gestión de bitácoras de supervisión" 
            icon={FileText} 
          >
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Bitácora
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-6 space-y-6">
              <BitacoraStats />
              
              <Card>
                <CardHeader>
                  <CardTitle>Bitácoras de Supervisor</CardTitle>
                </CardHeader>
                <CardContent>
                  {isLoading ? (
                    <div className="text-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                      <p className="mt-2 text-gray-600">Cargando bitácoras...</p>
                    </div>
                  ) : bitacorasSupervisor.length === 0 ? (
                    <div className="text-center py-8">
                      <FileText className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-semibold mb-2">No hay bitácoras</h3>
                      <p className="text-gray-600 mb-6">
                        Comience creando su primera bitácora de supervisor.
                      </p>
                      <Button onClick={() => setShowCreateForm(true)}>
                        <Plus className="w-4 h-4 mr-2" />
                        Nueva Bitácora
                      </Button>
                    </div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Código</TableHead>
                          <TableHead>Inmersión</TableHead>
                          <TableHead>Supervisor</TableHead>
                          <TableHead>Fecha</TableHead>
                          <TableHead>Estado</TableHead>
                          <TableHead className="text-right">Acciones</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {bitacorasSupervisor.map((bitacora) => (
                          <BitacoraTableRow
                            key={bitacora.bitacora_id}
                            bitacora={bitacora}
                            type="supervisor"
                            onSign={handleSignBitacora}
                            currentUserName="Supervisor"
                            currentUserRole="Supervisor"
                          />
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>

          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>Nueva Bitácora de Supervisor</DialogTitle>
              </DialogHeader>
              <BitacoraWizard
                type="supervisor"
                onComplete={handleCreateBitacora}
                onCancel={() => setShowCreateForm(false)}
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
}
