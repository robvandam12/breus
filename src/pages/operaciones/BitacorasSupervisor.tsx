
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, Plus, LayoutGrid, LayoutList } from "lucide-react";
import { BitacoraWizard } from "@/components/bitacoras/BitacoraWizard";
import { useBitacorasSupervisor, BitacoraSupervisorFormData } from "@/hooks/useBitacorasSupervisor";
import { useBitacorasBuzo } from "@/hooks/useBitacorasBuzo";
import { useBitacoraFilters } from "@/hooks/useBitacoraFilters";
import { BitacoraTableRow } from "@/components/bitacoras/BitacoraTableRow";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BitacoraFilters } from "@/components/bitacoras/BitacoraFilters";
import { SimplePagination } from "@/components/ui/SimplePagination";
import { BitacoraSupervisorCompleta } from "@/types/bitacoras";
import { BitacoraCard } from "@/components/bitacoras/BitacoraCard";
import { BitacoraDetailView } from "@/components/bitacoras/BitacoraDetailView";
import { BitacoraSignatureModal } from "@/components/bitacoras/BitacoraSignatureModal";
import { BitacoraPageLayout } from "@/components/layout/BitacoraPageLayout";
import { BitacoraPageStats } from "@/components/bitacoras/BitacoraPageStats";
import { Skeleton } from "@/components/ui/skeleton";

const BitacorasSupervisor = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedBitacora, setSelectedBitacora] = useState<BitacoraSupervisorCompleta | null>(null);
  const [bitacoraToSign, setBitacoraToSign] = useState<BitacoraSupervisorCompleta | null>(null);
  
  const { 
    bitacorasSupervisor, 
    loadingSupervisor,
    createBitacoraSupervisor,
    updateBitacoraSupervisorSignature
  } = useBitacorasSupervisor();

  const { bitacorasBuzo, loadingBuzo } = useBitacorasBuzo();
  
  const loading = loadingSupervisor || loadingBuzo;
  
  const { 
    filters, 
    setFilters, 
    paginatedData: filteredBitacorasSupervisor,
    currentPage,
    totalPages,
    setCurrentPage,
    totalItems,
    itemsPerPage,
    setItemsPerPage
  } = useBitacoraFilters(bitacorasSupervisor);

  const handleCreateSupervisor = async (data: BitacoraSupervisorFormData) => {
    try {
      const completeData = {
        ...data,
        supervisor_id: data.supervisor_id || '',
        supervisor: data.supervisor || '',
      };
      await createBitacoraSupervisor.mutateAsync(completeData);
      setIsCreateDialogOpen(false);
    } catch (error) {
      console.error('Error creating bitácora supervisor:', error);
    }
  };

  const handleSignSupervisor = async (id: string, signatureData: string) => {
    await updateBitacoraSupervisorSignature.mutateAsync({ bitacoraId: id, signatureData });
  };
  
  const handleViewDetails = (bitacoraId: string) => {
    const bitacora = bitacorasSupervisor.find(b => b.bitacora_id === bitacoraId);
    if (bitacora) setSelectedBitacora(bitacora);
  };

  const handleOpenSignModal = (bitacoraId: string) => {
    const bitacora = bitacorasSupervisor.find(b => b.bitacora_id === bitacoraId);
    if (bitacora) setBitacoraToSign(bitacora);
  };

  const completedSupervisor = bitacorasSupervisor.filter(b => b.firmado).length;

  const headerActions = (
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
        className="bg-purple-600 hover:bg-purple-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Nueva Bitácora Supervisor
      </Button>
    </div>
  );

  if (loading) {
    return (
      <BitacoraPageLayout
        title="Bitácoras Supervisor"
        subtitle="Registro de supervisión de inmersiones"
        icon={FileText}
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {Array.from({ length: 4 }).map((_, i) => (
            <Skeleton key={i} className="h-24" />
          ))}
        </div>
      </BitacoraPageLayout>
    );
  }

  return (
    <BitacoraPageLayout
      title="Bitácoras Supervisor"
      subtitle="Registro completo de supervisión de inmersiones"
      icon={FileText}
      headerActions={headerActions}
    >
      <BitacoraPageStats
        type="both"
        totalSupervisor={bitacorasSupervisor.length}
        totalBuzo={bitacorasBuzo.length}
        completed={completedSupervisor}
        pendingSignature={bitacorasSupervisor.length - completedSupervisor}
      />
      
      <Card className="mb-6">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Filtros y Búsqueda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BitacoraFilters
            activeFilters={filters}
            onFiltersChange={setFilters}
          />
        </CardContent>
      </Card>

      {bitacorasSupervisor.length > 0 && totalItems === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">No se encontraron resultados</h3>
            <p className="text-zinc-500 mb-4">Intenta ajustar los filtros de búsqueda</p>
          </CardContent>
        </Card>
      ) : filteredBitacorasSupervisor.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">
              {bitacorasSupervisor.length === 0 
                ? "No hay bitácoras de supervisor" 
                : "No se encontraron resultados"}
            </h3>
            <p className="text-zinc-500 mb-4">
              {bitacorasSupervisor.length === 0 
                ? "Comienza creando una nueva bitácora de supervisor"
                : "Intenta ajustar los filtros de búsqueda"}
            </p>
            <Button onClick={() => setIsCreateDialogOpen(true)} className="bg-purple-600 hover:bg-purple-700">
              <Plus className="w-4 h-4 mr-2" />
              Nueva Bitácora Supervisor
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-6">
          {viewMode === 'table' ? (
            <Card>
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
                  {filteredBitacorasSupervisor.map((bitacora) => (
                    <BitacoraTableRow
                      key={bitacora.bitacora_id}
                      bitacora={bitacora}
                      type="supervisor"
                      onSign={handleSignSupervisor}
                    />
                  ))}
                </TableBody>
              </Table>
            </Card>
          ) : (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBitacorasSupervisor.map((bitacora) => (
                <BitacoraCard
                  key={bitacora.bitacora_id}
                  bitacora={bitacora}
                  type="supervisor"
                  onView={handleViewDetails}
                  onSign={handleOpenSignModal}
                />
              ))}
            </div>
          )}
          <SimplePagination 
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={setCurrentPage}
            totalItems={totalItems}
            itemsPerPage={itemsPerPage}
            onItemsPerPageChange={setItemsPerPage}
          />
        </div>
      )}

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent variant="form" className="max-w-7xl max-h-[85vh] overflow-y-auto p-0">
          <BitacoraWizard
            onComplete={handleCreateSupervisor}
            onCancel={() => setIsCreateDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>

      {selectedBitacora && (
        <BitacoraDetailView
          isOpen={!!selectedBitacora}
          onClose={() => setSelectedBitacora(null)}
          bitacora={selectedBitacora}
          type="supervisor"
          onSign={handleOpenSignModal}
        />
      )}

      {bitacoraToSign && (
        <BitacoraSignatureModal
          isOpen={!!bitacoraToSign}
          onClose={() => setBitacoraToSign(null)}
          onSign={(signature) => {
            handleSignSupervisor(bitacoraToSign.bitacora_id, signature);
            setBitacoraToSign(null);
          }}
          title="Firmar Bitácora de Supervisor"
          userName={bitacoraToSign.supervisor || 'Supervisor'}
          role="Supervisor de Buceo"
        />
      )}
    </BitacoraPageLayout>
  );
};

export default BitacorasSupervisor;
