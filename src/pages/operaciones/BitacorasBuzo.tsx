
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Plus } from "lucide-react";
import { CreateBitacoraBuzoFormCompleteWithInmersion } from "@/components/bitacoras/CreateBitacoraBuzoFormCompleteWithInmersion";
import { BitacorasBuzoContent } from "@/components/bitacoras/BitacorasBuzoContent";
import { useBitacorasBuzo, BitacoraBuzoFormData } from "@/hooks/useBitacorasBuzo";
import { useBitacorasSupervisor } from "@/hooks/useBitacorasSupervisor";
import { useBitacoraFilters } from "@/hooks/useBitacoraFilters";
import { BitacoraBuzoCompleta, BitacoraSupervisorCompleta } from "@/types/bitacoras";
import { BitacoraDetailView } from "@/components/bitacoras/BitacoraDetailView";
import { BitacoraSignatureModal } from "@/components/bitacoras/BitacoraSignatureModal";
import { BitacoraPageLayout } from "@/components/layout/BitacoraPageLayout";
import { BitacoraPageSkeleton } from "@/components/layout/BitacoraPageSkeleton";
import { BitacoraStatsCards } from "@/components/bitacoras/BitacoraStatsCards";
import { BitacoraViewControls } from "@/components/bitacoras/BitacoraViewControls";
import { FormDialog } from "@/components/forms/FormDialog";

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

  const { bitacorasSupervisor, isLoading: loadingSupervisor } = useBitacorasSupervisor();
  
  const loading = loadingBuzo || loadingSupervisor;
  
  // Transformar bitacorasSupervisor a BitacoraSupervisorCompleta[]
  const bitacorasSupervisorCompletas: BitacoraSupervisorCompleta[] = bitacorasSupervisor.map(bitacora => ({
    ...bitacora,
    inmersion: null, // Por ahora null, se puede expandir para incluir datos de inmersión
    supervisor_data: null,
    aprobador_data: null,
    inmersiones_buzos: bitacora.inmersiones_buzos || [],
    equipos_utilizados: bitacora.equipos_utilizados || [],
    diving_records: bitacora.diving_records || []
  }));
  
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
    <BitacoraViewControls
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      onNewBitacora={() => setIsCreateDialogOpen(true)}
      newButtonText="Nueva Bitácora Buzo"
      newButtonColor="bg-teal-600 hover:bg-teal-700"
    />
  );

  if (loading) {
    return (
      <BitacoraPageSkeleton
        title="Bitácoras Buzo"
        subtitle="Registro personal de inmersiones"
        icon={FileText}
      />
    );
  }

  return (
    <BitacoraPageLayout
      title="Bitácoras Buzo"
      subtitle="Registro completo personal de inmersiones basado en bitácoras de supervisor"
      icon={FileText}
      headerActions={headerActions}
    >
      <BitacoraStatsCards
        total={bitacorasBuzo.length}
        completed={completedBuzo}
        pending={bitacorasBuzo.length - completedBuzo}
        type="buzo"
      />
      
      <BitacorasBuzoContent
        filteredBitacorasBuzo={filteredBitacorasBuzo}
        bitacorasBuzo={bitacorasBuzo}
        bitacorasSupervisor={bitacorasSupervisorCompletas}
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

      <FormDialog
        variant="form"
        size="xl"
        open={isCreateDialogOpen}
        onOpenChange={setIsCreateDialogOpen}
      >
        <CreateBitacoraBuzoFormCompleteWithInmersion
          onSubmit={handleCreateBuzo}
          onCancel={() => setIsCreateDialogOpen(false)}
        />
      </FormDialog>

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
