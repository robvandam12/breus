
import { useState } from "react";
import { FileText } from "lucide-react";
import { CreateBitacoraBuzoFormCompleteWithInmersion } from "@/components/bitacoras/CreateBitacoraBuzoFormCompleteWithInmersion";
import { BitacorasBuzoContent } from "@/components/bitacoras/BitacorasBuzoContent";
import { SupervisorBitacoraSelector } from "@/components/bitacoras/SupervisorBitacoraSelector";
import { useBitacorasBuzo, BitacoraBuzoFormData } from "@/hooks/useBitacorasBuzo";
import { useBitacorasSupervisor } from "@/hooks/useBitacorasSupervisor";
import { useBitacoraFilters } from "@/hooks/useBitacoraFilters";
import { BitacoraBuzoCompleta } from "@/types/bitacoras";
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
  const [showSupervisorSelector, setShowSupervisorSelector] = useState(false);
  const [selectedBitacora, setSelectedBitacora] = useState<BitacoraBuzoCompleta | null>(null);
  const [bitacoraToSign, setBitacoraToSign] = useState<BitacoraBuzoCompleta | null>(null);
  
  const { 
    bitacorasBuzo, 
    loadingBuzo,
    createBitacoraBuzo,
    createBitacoraBuzoFromSupervisor,
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

  const handleCreateFromSupervisor = async (bitacoraSupervisorId: string) => {
    try {
      await createBitacoraBuzoFromSupervisor.mutateAsync({ 
        bitacoraSupervisorId,
        usuarioId: 'current-user-id' // TODO: Obtener del contexto de auth
      });
      setShowSupervisorSelector(false);
    } catch (error) {
      console.error('Error creating bitácora from supervisor:', error);
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

  const handleNewBitacora = () => {
    // Mostrar opciones para crear bitácora
    setShowSupervisorSelector(true);
  };

  const hasSupervisorLogs = bitacorasSupervisor.length > 0;
  const completedBuzo = bitacorasBuzo.filter(b => b.firmado).length;

  const headerActions = (
    <BitacoraViewControls
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      onNewBitacora={handleNewBitacora}
      newButtonText="Nueva Bitácora Buzo"
      newButtonColor="bg-teal-600 hover:bg-teal-700"
    />
  );

  if (loading) {
    return (
      <BitacoraPageSkeleton
        title="Bitácoras Buzo"
        subtitle="Registro personal de inmersiones basado en bitácoras de supervisor"
        icon={FileText}
      />
    );
  }

  return (
    <BitacoraPageLayout
      title="Bitácoras Buzo"
      subtitle="Registro personal de inmersiones vinculado a bitácoras de supervisor firmadas"
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
        bitacorasSupervisor={bitacorasSupervisor}
        hasSupervisorLogs={hasSupervisorLogs}
        filters={filters}
        onFiltersChange={setFilters}
        onSignBuzo={handleSignBuzo}
        onNewBitacora={handleNewBitacora}
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

      {/* Selector de bitácora de supervisor */}
      <FormDialog
        variant="form"
        size="lg"
        open={showSupervisorSelector}
        onOpenChange={setShowSupervisorSelector}
      >
        <SupervisorBitacoraSelector
          onSelect={handleCreateFromSupervisor}
          onCancel={() => setShowSupervisorSelector(false)}
        />
      </FormDialog>

      {/* Formulario tradicional para inmersiones independientes */}
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

      {/* Vista de detalles */}
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

      {/* Modal de firma */}
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
