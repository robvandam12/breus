
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Plus, AlertTriangle, Users, TrendingUp, CheckCircle, Clock } from "lucide-react";
import { BitacoraTableRow } from "@/components/bitacoras/BitacoraTableRow";
import { BitacoraFilters } from "@/components/bitacoras/BitacoraFilters";
import { BitacoraStats } from "@/components/bitacoras/BitacoraStats";
import { BitacoraBuzoCompleta, BitacoraSupervisorCompleta } from "@/types/bitacoras";
import { BitacoraFilters as IBitacoraFilters } from "@/hooks/useBitacoraFilters";
import { SimplePagination } from "@/components/ui/SimplePagination";
import { BitacoraCard } from "@/components/bitacoras/BitacoraCard";
import { Badge } from "@/components/ui/badge";

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
  
  // Estadísticas específicas para salmoneros
  const pendingSignatures = filteredBitacorasBuzo.filter(b => !b.firmado).length;
  const completedToday = filteredBitacorasBuzo.filter(b => 
    b.firmado && new Date(b.fecha).toDateString() === new Date().toDateString()
  ).length;
  const fromSupervisor = filteredBitacorasBuzo.filter(b => b.bitacora_supervisor_id).length;

  return (
    <div className="space-y-6">
      {/* Estadísticas contextuales para salmoneros */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="border-blue-200 bg-blue-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-blue-600 font-medium">Total Bitácoras</p>
                <p className="text-2xl font-bold text-blue-800">{filteredBitacorasBuzo.length}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-amber-200 bg-amber-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-amber-500 flex items-center justify-center">
                <Clock className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-amber-600 font-medium">Pendientes Firma</p>
                <p className="text-2xl font-bold text-amber-800">{pendingSignatures}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-green-200 bg-green-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-green-600 font-medium">Firmadas Hoy</p>
                <p className="text-2xl font-bold text-green-800">{completedToday}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-purple-200 bg-purple-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-purple-500 flex items-center justify-center">
                <Users className="w-5 h-5 text-white" />
              </div>
              <div>
                <p className="text-sm text-purple-600 font-medium">Desde Supervisor</p>
                <p className="text-2xl font-bold text-purple-800">{fromSupervisor}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Información contextual para salmoneros */}
      {!hasSupervisorLogs && (
        <Alert className="border-orange-200 bg-orange-50">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Bitácoras de Supervisor Requeridas:</strong> Para una gestión completa, 
            las bitácoras de buzo deben crearse desde bitácoras de supervisor firmadas. 
            Esto garantiza trazabilidad y cumplimiento normativo.
          </AlertDescription>
        </Alert>
      )}

      {/* Guía para usuarios salmoneros */}
      <Alert className="border-blue-200 bg-blue-50">
        <Users className="w-4 h-4 text-blue-600" />
        <AlertDescription className="text-blue-800">
          <strong>Gestión de Bitácoras:</strong> Como administrador salmonero, puede visualizar 
          todas las bitácoras de buzo de su organización. Use los filtros para encontrar 
          bitácoras específicas por buzo, fecha o estado de firma.
        </AlertDescription>
      </Alert>

      <Tabs defaultValue="all" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="all" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Todas ({filteredBitacorasBuzo.length})
          </TabsTrigger>
          <TabsTrigger value="pending" className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            Pendientes ({pendingSignatures})
          </TabsTrigger>
          <TabsTrigger value="signed" className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4" />
            Firmadas ({filteredBitacorasBuzo.length - pendingSignatures})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="all" className="space-y-6">
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

          {filteredBitacorasBuzo.length === 0 ? (
            <Card className="text-center py-12">
              <CardContent>
                <FileText className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">
                  No hay bitácoras de buzo
                </h3>
                <p className="text-muted-foreground mb-4">
                  Las bitácoras aparecerán aquí cuando los buzos las creen desde las bitácoras de supervisor firmadas.
                </p>
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
        </TabsContent>

        <TabsContent value="pending" className="space-y-6">
          {/* Contenido para bitácoras pendientes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBitacorasBuzo
              .filter(b => !b.firmado)
              .map((bitacora) => (
              <BitacoraCard
                key={bitacora.bitacora_id}
                bitacora={bitacora}
                type="buzo"
                onView={onViewDetails}
                onSign={onOpenSignModal}
              />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="signed" className="space-y-6">
          {/* Contenido para bitácoras firmadas */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredBitacorasBuzo
              .filter(b => b.firmado)
              .map((bitacora) => (
              <BitacoraCard
                key={bitacora.bitacora_id}
                bitacora={bitacora}
                type="buzo"
                onView={onViewDetails}
                onSign={onOpenSignModal}
              />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};
