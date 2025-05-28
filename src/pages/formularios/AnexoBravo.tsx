import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Search, FileText, Plus } from "lucide-react";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";

export default function AnexoBravo() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOperacion, setSelectedOperacion] = useState<any>(null);
  
  const { anexosBravo, isLoading, createAnexoBravo } = useAnexoBravo();

  const handleCreateAnexo = async (data: any) => {
    if (!selectedOperacion) return;
    
    const anexoData = {
      ...data,
      operacion_id: selectedOperacion.id
    };
    
    await createAnexoBravo(anexoData);
    setShowCreateForm(false);
    setSelectedOperacion(null);
  };

  const handleOperacionSelected = (operacion: any) => {
    setSelectedOperacion(operacion);
    setShowCreateForm(true);
  };

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col bg-gray-50">
          <Header 
            title="Anexos Bravo" 
            subtitle="Gestión de Anexos Bravo" 
            icon={FileText} 
          >
            <div className="flex items-center gap-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
                <Input
                  placeholder="Buscar operaciones..."
                  className="pl-10 w-64 ios-input"
                />
              </div>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
              <Card className="ios-card text-center py-12">
                <CardContent>
                  <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-zinc-900 mb-2">
                    Seleccione una operación
                  </h3>
                  <p className="text-zinc-500 mb-4">
                    Comience seleccionando una operación para crear un Anexo Bravo
                  </p>
                  <Button onClick={() => handleOperacionSelected({ id: 'test-operacion' })} className="ios-button bg-blue-600 hover:bg-blue-700">
                    <Plus className="w-4 h-4 mr-2" />
                    Nueva Operación (Test)
                  </Button>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Create Form Modal */}
          <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
            <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
              {selectedOperacion && (
                <FullAnexoBravoForm
                  operacionId={selectedOperacion.id}
                  onSubmit={handleCreateAnexo}
                  onCancel={() => {
                    setShowCreateForm(false);
                    setSelectedOperacion(null);
                  }}
                />
              )}
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
}
