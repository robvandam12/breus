
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { FileText, Plus } from "lucide-react";
import { BitacoraWizardFromInmersion } from "@/components/bitacoras/BitacoraWizardFromInmersion";
import { useBitacorasSupervisor, BitacoraSupervisorFormData } from "@/hooks/useBitacorasSupervisor";
import { useBitacorasBuzo } from "@/hooks/useBitacorasBuzo";
import { useBitacoraFilters } from "@/hooks/useBitacoraFilters";
import { useInmersiones } from "@/hooks/useInmersiones";
import { BitacoraTableRow } from "@/components/bitacoras/BitacoraTableRow";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BitacoraFilters } from "@/components/bitacoras/BitacoraFilters";
import { SimplePagination } from "@/components/ui/SimplePagination";
import { BitacoraSupervisorCompleta } from "@/types/bitacoras";
import { BitacoraCard } from "@/components/bitacoras/BitacoraCard";
import { BitacoraDetailView } from "@/components/bitacoras/BitacoraDetailView";
import { BitacoraSignatureModal } from "@/components/bitacoras/BitacoraSignatureModal";
import { BitacoraPageLayout } from "@/components/layout/BitacoraPageLayout";
import { BitacoraPageSkeleton } from "@/components/layout/BitacoraPageSkeleton";
import { BitacoraStatsCards } from "@/components/bitacoras/BitacoraStatsCards";
import { BitacoraViewControls } from "@/components/bitacoras/BitacoraViewControls";
import { EmptyState } from "@/components/layout/EmptyState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const BitacorasSupervisor = () => {
  const [viewMode, setViewMode] = useState<'cards' | 'table'>('table');
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [selectedInmersionId, setSelectedInmersionId] = useState<string>('');
  const [selectedBitacora, setSelectedBitacora] = useState<BitacoraSupervisorCompleta | null>(null);
  const [bitacoraToSign, setBitacoraToSign] = useState<BitacoraSupervisorCompleta | null>(null);
  
  const { 
    bitacorasSupervisor, 
    loadingSupervisor,
    createBitacoraSupervisor,
    updateBitacoraSupervisorSignature
  } = useBitacorasSupervisor();

  const { bitacorasBuzo, loadingBuzo } = useBitacorasBuzo();
  const { inmersiones } = useInmersiones();
  
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

  // Filtrar inmersiones que no tengan bitácora de supervisor
  const inmersionesSinBitacora = inmersiones.filter(inmersion => 
    !bitacorasSupervisor.some(bitacora => bitacora.inmersion_id === inmersion.inmersion_id)
  );

  const handleCreateSupervisor = async (data: any) => {
    try {
      const completeData: BitacoraSupervisorFormData = {
        codigo: data.codigo,
        inmersion_id: data.inmersion_id,
        supervisor: data.supervisor || '',
        desarrollo_inmersion: data.desarrollo_inmersion,
        incidentes: data.incidentes,
        evaluacion_general: data.evaluacion_general,
        fecha: data.fecha_inicio_faena || new Date().toISOString().split('T')[0],
        fecha_inicio_faena: data.fecha_inicio_faena,
        hora_inicio_faena: data.hora_inicio_faena,
        hora_termino_faena: data.hora_termino_faena,
        lugar_trabajo: data.lugar_trabajo,
        supervisor_nombre_matricula: data.supervisor_nombre_matricula,
        estado_mar: data.estado_mar,
        visibilidad_fondo: data.visibilidad_fondo,
        inmersiones_buzos: data.inmersiones_buzos || [],
        equipos_utilizados: data.equipos_utilizados || [],
        trabajo_a_realizar: data.trabajo_a_realizar,
        descripcion_trabajo: data.descripcion_trabajo,
        embarcacion_apoyo: data.embarcacion_apoyo,
        observaciones_generales_texto: data.observaciones_generales_texto,
        validacion_contratista: data.validacion_contratista,
        comentarios_validacion: data.comentarios_validacion,
        diving_records: data.diving_records || [],
        operacion_id: data.operacion_id,
        empresa_nombre: data.empresa_nombre,
        centro_nombre: data.centro_nombre,
        equipo_buceo_id: data.equipo_buceo_id,
        buzos_asistentes: data.buzos_asistentes || []
      };
      
      await createBitacoraSupervisor.mutateAsync(completeData);
      setIsCreateDialogOpen(false);
      setSelectedInmersionId('');
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

  const handleNewBitacora = () => {
    if (inmersionesSinBitacora.length === 0) {
      return;
    }
    setIsCreateDialogOpen(true);
  };

  const headerActions = (
    <BitacoraViewControls
      viewMode={viewMode}
      onViewModeChange={setViewMode}
      onNewBitacora={handleNewBitacora}
      newButtonText="Nueva Bitácora Supervisor"
      newButtonColor="bg-purple-600 hover:bg-purple-700"
      disabled={inmersionesSinBitacora.length === 0}
    />
  );

  if (loading) {
    return (
      <BitacoraPageSkeleton
        title="Bitácoras Supervisor"
        subtitle="Registro de supervisión de inmersiones"
        icon={FileText}
      />
    );
  }

  return (
    <BitacoraPageLayout
      title="Bitácoras Supervisor"
      subtitle="Registro completo de supervisión de inmersiones (Formulario de 6 pasos)"
      icon={FileText}
      headerActions={headerActions}
    >
      <BitacoraStatsCards
        total={bitacorasSupervisor.length}
        completed={completedSupervisor}
        pending={bitacorasSupervisor.length - completedSupervisor}
        type="supervisor"
      />
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-foreground">
            <FileText className="w-5 h-5 text-primary" />
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
        <EmptyState
          icon={FileText}
          title="No se encontraron resultados"
          description="Intenta ajustar los filtros de búsqueda"
        />
      ) : filteredBitacorasSupervisor.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={bitacorasSupervisor.length === 0 ? "No hay bitácoras de supervisor" : "No se encontraron resultados"}
          description={
            bitacorasSupervisor.length === 0 
              ? inmersionesSinBitacora.length === 0 
                ? "No hay inmersiones disponibles para crear bitácoras de supervisor"
                : "Comienza creando una nueva bitácora de supervisor" 
              : "Intenta ajustar los filtros de búsqueda"
          }
          actionText={inmersionesSinBitacora.length > 0 ? "Nueva Bitácora Supervisor" : undefined}
          onAction={inmersionesSinBitacora.length > 0 ? handleNewBitacora : undefined}
          actionIcon={Plus}
        />
      ) : (
        <div className="space-y-6">
          {viewMode === 'table' ? (
            <Card>
              <CardContent className="p-0">
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-muted-foreground">Código</TableHead>
                        <TableHead className="text-muted-foreground">Inmersión</TableHead>
                        <TableHead className="text-muted-foreground">Supervisor</TableHead>
                        <TableHead className="text-muted-foreground">Fecha</TableHead>
                        <TableHead className="text-muted-foreground">Estado</TableHead>
                        <TableHead className="text-right text-muted-foreground">Acciones</TableHead>
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
                </div>
              </CardContent>
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
          <div className="p-6">
            {!selectedInmersionId ? (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Seleccionar Inmersión</h3>
                <p className="text-sm text-gray-600">
                  Seleccione la inmersión para la cual desea crear una bitácora de supervisor:
                </p>
                
                <div className="space-y-2">
                  <Label>Inmersión</Label>
                  <Select value={selectedInmersionId} onValueChange={setSelectedInmersionId}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione una inmersión..." />
                    </SelectTrigger>
                    <SelectContent>
                      {inmersionesSinBitacora.map((inmersion) => (
                        <SelectItem key={inmersion.inmersion_id} value={inmersion.inmersion_id}>
                          {inmersion.codigo} - {inmersion.objetivo} ({inmersion.fecha_inmersion})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex justify-end gap-2 pt-4">
                  <Button variant="outline" onClick={() => setIsCreateDialogOpen(false)}>
                    Cancelar
                  </Button>
                  <Button 
                    onClick={() => {}} 
                    disabled={!selectedInmersionId}
                  >
                    Continuar
                  </Button>
                </div>
              </div>
            ) : (
              <BitacoraWizardFromInmersion
                inmersionId={selectedInmersionId}
                onComplete={handleCreateSupervisor}
                onCancel={() => {
                  setIsCreateDialogOpen(false);
                  setSelectedInmersionId('');
                }}
              />
            )}
          </div>
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
