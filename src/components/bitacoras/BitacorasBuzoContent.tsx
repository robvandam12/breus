
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { FileText, Plus, AlertTriangle, Users } from "lucide-react";
import { BitacoraTableRow } from "@/components/bitacoras/BitacoraTableRow";
import { BitacoraFilters } from "@/components/bitacoras/BitacoraFilters";
import { BitacoraStats } from "@/components/bitacoras/BitacoraStats";
import { BitacoraBuzoCompleta, BitacoraSupervisorCompleta } from "@/types/bitacoras";
import { BitacoraFilters as IBitacoraFilters } from "@/hooks/useBitacoraFilters";

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
}: BitacorasBuzoContentProps) => {
  return (
    <div className="p-4 md:p-8 max-w-7xl mx-auto">
      {/* Supervisor Requirement Alert */}
      {!hasSupervisorLogs && (
        <Alert className="mb-6 border-orange-200 bg-orange-50">
          <AlertTriangle className="w-4 h-4 text-orange-600" />
          <AlertDescription className="text-orange-800">
            <strong>Bitácoras de Supervisor Requeridas:</strong> Las bitácoras de buzo requieren 
            datos de inmersión registrados por el supervisor. Debe crear primero una bitácora 
            de supervisor que incluya el registro de inmersiones del equipo de buceo.
          </AlertDescription>
        </Alert>
      )}

      {/* Emergency Diver Info */}
      <Alert className="mb-6 border-blue-200 bg-blue-50">
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
            onFiltersChange={onFiltersChange}
          />
        </CardContent>
      </Card>

      {filteredBitacorasBuzo.length === 0 ? (
        <Card className="text-center py-12">
          <CardContent>
            <FileText className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-zinc-900 mb-2">
              {bitacorasBuzo.length === 0 
                ? "No hay bitácoras de buzo" 
                : "No se encontraron resultados"}
            </h3>
            <p className="text-zinc-500 mb-4">
              {bitacorasBuzo.length === 0 
                ? hasSupervisorLogs 
                  ? "Comienza creando bitácoras de buzo basadas en los registros del supervisor"
                  : "Primero necesitas bitácoras de supervisor con datos de inmersión"
                : "Intenta ajustar los filtros de búsqueda"}
            </p>
            {bitacorasBuzo.length === 0 && hasSupervisorLogs && (
              <Button onClick={onNewBitacora} className="bg-teal-600 hover:bg-teal-700">
                <Plus className="w-4 h-4 mr-2" />
                Nueva Bitácora Buzo
              </Button>
            )}
          </CardContent>
        </Card>
      ) : (
        <>
          {viewMode === 'table' ? (
            <Card>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Código</TableHead>
                    <TableHead>Inmersión</TableHead>
                    <TableHead>Buzo</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Profundidad</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
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
            </Card>
          ) : (
            <div className="text-center p-8 border rounded-lg bg-zinc-50">
              <p className="text-zinc-500">La vista de tarjetas no está implementada aún.</p>
            </div>
          )}
        </>
      )}
    </div>
  );
};
