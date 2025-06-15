
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Plus, LayoutGrid, LayoutList } from "lucide-react";
import { CreateBitacoraBuzoFormCompleteWithInmersion } from "@/components/bitacoras/CreateBitacoraBuzoFormCompleteWithInmersion";
import { BitacorasBuzoContent } from "@/components/bitacoras/BitacorasBuzoContent";
import { useBitacorasBuzo, BitacoraBuzoFormData } from "@/hooks/useBitacorasBuzo";
import { useBitacorasSupervisor } from "@/hooks/useBitacorasSupervisor";
import { useBitacoraFilters } from "@/hooks/useBitacoraFilters";
import { BitacoraBuzoCompleta } from "@/types/bitacoras";
import { BitacoraDetailView } from "@/components/bitacoras/BitacoraDetailView";
import { BitacoraSignatureModal } from "@/components/bitacoras/BitacoraSignatureModal";
import { BitacoraPageLayout } from "@/components/layout/BitacoraPageLayout";
import { BitacoraPageStats } from "@/components/bitacoras/BitacoraPageStats";
import { FormDialog } from "@/components/forms/FormDialog";
import { Skeleton } from "@/components/ui/skeleton";

const BitacorasBuzo = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedBitacora, setSelectedBitacora] = useState<BitacoraBuzoCompleta | null>(null);
  const [bitacoraToSign, setBitacoraToSign] = useState<BitacoraBuzoCompleta | null>(null);
  
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

  const handleViewDetails = (bitacoraId: string) => {
    const bitacora = bitacorasBuzo.find(b => b.bitacora_id === bitacoraId);
    if (bitacora) setSelectedBitacora(bitacora);
  };

  const handleOpenSignModal = (bitacoraId: string) => {
    const bitacora = bitacorasBuzo.find(b => b.bitacora_id === bitacoraId);
    if (bitacora) setBitacoraToSign(bitacora);
  };

  const hasSupervisorLogs = bitacorasSupervisor.length > 0;
  const completedBuzo = bitacorasBuzo.filter(b => b.firmado).length;

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

      <FormDialog
        variant="form"
        size="xl"
        triggerText="Nueva Bitácora Buzo"
        triggerIcon={Plus}
        triggerClassName="bg-teal-600 hover:bg-teal-700"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <CreateBitacoraBuzoFormCompleteWithInmersion
          onSubmit={handleCreateBuzo}
          onCancel={() => setIsCreateDialogOpen(false)}
        />
      </FormDialog>
    </div>
  );

  if (loading) {
    return (
      <BitacoraPageLayout
        title="Bitácoras Buzo"
        subtitle="Registro personal de inmersiones"
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
      title="Bitácoras Buzo"
      subtitle="Registro completo personal de inmersiones basado en bitácoras de supervisor"
      icon={FileText}
      headerActions={headerActions}
    >
      <BitacoraPageStats
        type="buzo"
        totalBuzo={bitacorasBuzo.length}
        completed={completedBuzo}
        pendingSignature={bitacorasBuzo.length - completedBuzo}
      />
      
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
        onViewDetails={handleViewDetails}
        onOpenSignModal={handleOpenSignModal}
      />

      {selectedBitacora && (
        <FormDialog
          variant="detail"
          size="xl"
          open={!!selectedBitacora}
          onOpenChange={(open) => !open && setSelectedBitacora(null)}
        >
          <BitacoraDetailView
            isOpen={!!selectedBitacora}
            onClose={() => setSelectedBitacora(null)}
            bitacora={selectedBitacora}
            type="buzo"
            onSign={handleOpenSignModal}
          />
        </FormDialog>
      )}

      {bitacoraToSign && (
        <BitacoraSignatureModal
          isOpen={!!bitacoraToSign}
          onClose={() => setBitacoraToSign(null)}
          onSign={(signature) => {
            if(bitacoraToSign) {
              handleSignBuzo(bitacoraToSign.bitacora_id, signature);
              setBitacoraToSign(null);
            }
          }}
          title="Firmar Bitácora de Buzo"
          userName={bitacoraToSign.buzo || "Buzo"}
          role="Buzo"
        />
      )}
    </BitacoraPageLayout>
  );
};

export default BitacorasBuzo;
