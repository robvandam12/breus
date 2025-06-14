import { useState } from "react";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, Plus, LayoutGrid, LayoutList } from "lucide-react";
import { CreateBitacoraBuzoFormCompleteWithInmersion } from "@/components/bitacoras/CreateBitacoraBuzoFormCompleteWithInmersion";
import { BitacorasBuzoContent } from "@/components/bitacoras/BitacorasBuzoContent";
import { useBitacorasBuzo, BitacoraBuzoFormData } from "@/hooks/useBitacorasBuzo";
import { useBitacorasSupervisor } from "@/hooks/useBitacorasSupervisor";
import { useBitacoraFilters } from "@/hooks/useBitacoraFilters";
import { Skeleton } from "@/components/ui/skeleton";

const BitacorasBuzo = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  
  const { 
    bitacorasBuzo, 
    loadingBuzo,
    createBitacoraBuzo,
    updateBitacoraBuzoSignature
  } = useBitacorasBuzo();

  const { bitacorasSupervisor, loadingSupervisor } = useBitacorasSupervisor();
  
  const loading = loadingBuzo || loadingSupervisor;
  
  const { 
    filters, 
    setFilters, 
    paginatedData: filteredBitacorasBuzo,
    currentPage,
    totalPages,
    setCurrentPage,
    totalItems,
    itemsPerPage,
    setItemsPerPage
  } = useBitacoraFilters(bitacorasBuzo);

  const handleCreateBuzo = async (data: BitacoraBuzoFormData) => {
    try {
      await createBitacoraBuzo.mutateAsync(data);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating bitácora buzo:', error);
    }
  };

  const handleSignBuzo = async (id: string, signatureData: string) => {
    await updateBitacoraBuzoSignature.mutateAsync({ bitacoraId: id, signatureData });
  };

  const hasSupervisorLogs = bitacorasSupervisor.length > 0;

  if (loading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <Header 
              title="Bitácoras Buzo" 
              subtitle="Registro personal de inmersiones" 
              icon={FileText} 
            />
            <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-8 w-20 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Bitácoras Buzo" 
            subtitle="Registro completo personal de inmersiones basado en bitácoras de supervisor" 
            icon={FileText} 
          >
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-zinc-100 rounded-lg p-1">
                <Button
                  variant={viewMode === 'cards' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('cards')}
                  className="h-8 px-3"
                >
                  <LayoutGrid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'table' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('table')}
                  className="h-8 px-3"
                >
                  <LayoutList className="w-4 h-4" />
                </Button>
              </div>

              <Button
                onClick={() => setIsCreateDialogOpen(true)}
                className="bg-teal-600 hover:bg-teal-700"
                disabled={!hasSupervisorLogs}
              >
                <Plus className="w-4 h-4 mr-2" />
                Nueva Bitácora Buzo
              </Button>
            </div>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <BitacorasBuzoContent
              filteredBitacorasBuzo={filteredBitacorasBuzo}
              bitacorasBuzo={bitacorasBuzo}
              bitacorasSupervisor={bitacorasSupervisor}
              hasSupervisorLogs={hasSupervisorLogs}
              filters={filters}
              onFiltersChange={setFilters}
              onSignBuzo={handleSignBuzo}
              onNewBitacora={() => setIsCreateDialogOpen(true)}
              viewMode={viewMode}
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
              totalItems={totalItems}
              itemsPerPage={itemsPerPage}
              onItemsPerPageChange={setItemsPerPage}
            />
          </div>

          <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
            <DialogContent variant="form" className="max-w-7xl max-h-[95vh] overflow-y-auto p-0">
              <CreateBitacoraBuzoFormCompleteWithInmersion
                onSubmit={handleCreateBuzo}
                onCancel={() => setIsCreateDialogOpen(false)}
              />
            </DialogContent>
          </Dialog>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default BitacorasBuzo;
