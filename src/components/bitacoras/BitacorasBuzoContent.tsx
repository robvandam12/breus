
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Plus, AlertTriangle, Users, Info, ArrowRight, FileCheck } from "lucide-react";
import { BitacoraTableRow } from "@/components/bitacoras/BitacoraTableRow";
import { BitacoraFilters } from "@/components/bitacoras/BitacoraFilters";
import { BitacoraStats } from "@/components/bitacoras/BitacoraStats";
import { BitacoraBuzoCompleta, BitacoraSupervisorCompleta } from "@/types/bitacoras";
import { BitacoraFilters as IBitacoraFilters } from "@/hooks/useBitacoraFilters";
import { SimplePagination } from "@/components/ui/SimplePagination";
import { BitacoraCard } from "@/components/bitacoras/BitacoraCard";

interface BitacorasBuzoContentProps {
  filteredBitacorasBuzo: BitacoraBuzoCompleta[];
  bitacorasBuzo: BitacoraBuzoCompleta[];
  bitacorasSupervisor: BitacoraSupervisorCompleta[];
  hasSupervisorLogs: boolean;
  filters: IBitacoraFilters;
  onFiltersChange: (filters: Partial<IBitacoraFilters>) => void;
  onSignBuzo: (id: string, signatureData: string) => Promise<void>;
  onNewBitacora: () => void;
  viewMode: 'cards' | 'table';
  currentPage: number;
  totalPages: number;
  setCurrentPage: (page: number) => void;
  totalItems: number;
  itemsPerPage: number;
  onItemsPerPageChange: (size: number) => void;
  onViewDetails: (id: string) => void;
  onOpenSignModal: (id: string) => void;
}

export const BitacorasBuzoContent = ({
  filteredBitacorasBuzo,
  bitacorasBuzo,
  bitacorasSupervisor,
  hasSupervisorLogs,
  filters,
  onFiltersChange,
  onSignBuzo,
  onNewBitacora,
  viewMode,
  currentPage,
  totalPages,
  setCurrentPage,
  totalItems,
  itemsPerPage,
  onItemsPerPageChange,
  onViewDetails,
  onOpenSignModal,
}: BitacorasBuzoContentProps) => {
  
  // Calcular bitácoras de supervisor firmadas disponibles
  const supervisorFirmadas = bitacorasSupervisor.filter(bs => bs.firmado).length;
  const supervisorPendientes = bitacorasSupervisor.filter(bs => !bs.firmado).length;

  return (
    <div className="space-y-6">
      {/* Flujo de Creación Recomendado */}
      {hasSupervisorLogs && (
        <Alert className="border-blue-200 bg-blue-50">
          <Info className="w-4 h-4 text-blue-600" />
          <AlertDescription className="text-blue-800">
            <div className="flex items-center justify-between">
              <div>
                <strong>Flujo Recomendado:</strong> Crear bitácoras de buzo basadas en bitácoras de supervisor firmadas.
                <br />
                <span className="text-sm">
                  Disponibles: {supervisorFirmadas} bitácoras de supervisor firmadas
                  {supervisorPendientes > 0 && ` • ${supervisorPendientes} pendientes de firma`}
                </span>
              </div>
              <Button 
                onClick={onNewBitacora}
                size="sm"
                className="bg-teal-600 hover:bg-teal-700 ml-4"
              >
                <FileCheck className="w-4 h-4 mr-2" />
                Desde Supervisor
                <ArrowRight className="w-4 h-4 ml-2" />
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Supervisor Requirement Alert */}
      {!hasSupervisorLogs && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Bitácoras de Supervisor Requeridas:</strong> Las bitácoras de buzo requieren 
            datos de inmersión registrados por el supervisor. Debe crear primero una bitácora 
            de supervisor que incluya el registro de inmersiones del equipo de buceo.
          </AlertDescription>
        </Alert>
      )}

      {/* Emergency Diver Info */}
      <Alert className="border-blue-200 bg-blue-50">
        <Users className="w-4 h-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Buzos de Emergencia:</strong> Los buzos designados como "emergencia" 
          que no realizan inmersión efectiva no generan bitácora individual, 
          pero se registran en la bitácora del supervisor como parte del equipo.
        </AlertDescription>
      </Alert>

      <BitacoraStats 
        bitacorasSupervisor={bitacorasSupervisor}
        bitacorasBuzo={bitacorasBuzo}
        filteredSupervisor={bitacorasSupervisor}
        filteredBuzo={filteredBitacorasBuzo}
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
            onFiltersChange={onFiltersChange}
          />
        </CardContent>
      </Card>

      {bitacorasBuzo.length > 0 && totalItems === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">No se encontraron resultados</h3>
            <p className="text-muted-foreground mb-4">Intenta ajustar los filtros de búsqueda</p>
          </CardContent>
        </Card>
      ) : filteredBitacorasBuzo.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground mb-2">
              {bitacorasBuzo.length === 0 
                ? "No hay bitácoras de buzo" 
                : "No se encontraron resultados"}
            </h3>
            <p className="text-muted-foreground mb-4">
              {bitacorasBuzo.length === 0 
                ? hasSupervisorLogs 
                  ? "Comienza creando bitácoras de buzo basadas en los registros del supervisor"
                  : "Primero necesitas bitácoras de supervisor con datos de inmersión"
                : "Intenta ajustar los filtros de búsqueda"}
            </p>
            
            {/* Opciones de Creación */}
            {bitacorasBuzo.length === 0 && hasSupervisorLogs && (
              <div className="flex flex-col sm:flex-row gap-3 justify-center items-center">
                <Button 
                  onClick={onNewBitacora} 
                  className="bg-teal-600 hover:bg-teal-700"
                  size="lg"
                >
                  <FileCheck className="w-4 h-4 mr-2" />
                  Desde Bitácora de Supervisor
                </Button>
                
                <div className="text-sm text-muted-foreground">
                  Recomendado: Hereda datos automáticamente
                </div>
              </div>
            )}
          </CardContent>
        </Card>
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
                        <TableHead className="text-muted-foreground">Buzo</TableHead>
                        <TableHead className="text-muted-foreground">Fecha</TableHead>
                        <TableHead className="text-muted-foreground">Profundidad</TableHead>
                        <TableHead className="text-muted-foreground">Estado</TableHead>
                        <TableHead className="text-right text-muted-foreground">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredBitacorasBuzo.map((bitacora) => (
                        <BitacoraTableRow
                          key={bitacora.bitacora_id}
                          bitacora={bitacora}
                          type="buzo"
                          onSign={onSignBuzo}
                        />
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredBitacorasBuzo.map((bitacora) => (
                <BitacoraCard
                  key={bitacora.bitacora_id}
                  bitacora={bitacora}
                  type="buzo"
                  onView={onViewDetails}
                  onSign={onOpenSignModal}
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
            onItemsPerPageChange={onItemsPerPageChange}
          />
        </div>
      )}
    </div>
  );
};
