
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText, CheckCircle, PenTool, Edit } from "lucide-react";
import { useBitacorasBuzo } from "@/hooks/useBitacorasBuzo";
import { useInmersiones } from "@/hooks/useInmersiones";
import { toast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageLoadingSkeleton } from "@/components/layout/PageLoadingSkeleton";
import { EmptyState } from "@/components/layout/EmptyState";

const BitacorasBuzoFormulariosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  
  const { bitacorasBuzo, loadingBuzo } = useBitacorasBuzo();
  const { inmersiones } = useInmersiones();

  const filteredBitacoras = bitacorasBuzo.filter(bitacora => 
    bitacora.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bitacora.buzo?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateBitacora = () => {
    toast({
      title: "Función en desarrollo",
      description: "La creación de bitácoras de buzo será implementada próximamente.",
    });
  };

  const handleEditBitacora = (bitacoraId: string) => {
    toast({
      title: "Función en desarrollo",
      description: "La edición de bitácoras de buzo será implementada próximamente.",
    });
  };

  const handleSignBitacora = (bitacoraId: string) => {
    toast({
      title: "Función en desarrollo",
      description: "La firma de bitácoras de buzo será implementada próximamente.",
    });
  };

  if (loadingBuzo) {
    return (
      <PageLoadingSkeleton
        title="Bitácoras de Buzo"
        subtitle="Gestión independiente de bitácoras de buceo"
        icon={FileText}
      />
    );
  }

  const headerActions = (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar bitácoras..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-64"
        />
      </div>

      <Button 
        onClick={handleCreateBitacora}
        className="bg-teal-600 hover:bg-teal-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Nueva Bitácora
      </Button>
    </div>
  );

  return (
    <MainLayout
      title="Bitácoras de Buzo"
      subtitle="Gestión independiente de bitácoras de buceo"
      icon={FileText}
      headerChildren={headerActions}
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-teal-600">
              {bitacorasBuzo.length}
            </div>
            <div className="text-sm text-muted-foreground">Bitácoras Totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {bitacorasBuzo.filter(b => b.firmado).length}
            </div>
            <div className="text-sm text-muted-foreground">Firmadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {bitacorasBuzo.filter(b => !b.firmado).length}
            </div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-blue-600">
              {inmersiones.length}
            </div>
            <div className="text-sm text-muted-foreground">Inmersiones Disponibles</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Bitácoras */}
      {filteredBitacoras.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={bitacorasBuzo.length === 0 ? "No hay bitácoras registradas" : "No se encontraron bitácoras"}
          description={bitacorasBuzo.length === 0 
            ? "Comience creando la primera bitácora de buzo"
            : "Intenta ajustar la búsqueda"}
          actionText="Nueva Bitácora"
          onAction={handleCreateBitacora}
          actionIcon={Plus}
        />
      ) : (
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
              {filteredBitacoras.map((bitacora) => {
                const inmersion = inmersiones.find(i => i.inmersion_id === bitacora.inmersion_id);
                return (
                  <TableRow key={bitacora.bitacora_id}>
                    <TableCell>
                      <div className="font-medium">{bitacora.codigo}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {inmersion ? `${inmersion.codigo} - ${inmersion.objetivo}` : 'Inmersión no encontrada'}
                      </div>
                    </TableCell>
                    <TableCell>{bitacora.buzo}</TableCell>
                    <TableCell>
                      {bitacora.fecha ? new Date(bitacora.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                    </TableCell>
                    <TableCell>
                      {bitacora.profundidad_maxima ? `${bitacora.profundidad_maxima}m` : 'Sin datos'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={bitacora.firmado ? 'default' : 'secondary'}>
                        {bitacora.firmado ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Firmada
                          </div>
                        ) : (
                          'Borrador'
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        <Button 
                          onClick={() => handleEditBitacora(bitacora.bitacora_id)}
                          size="sm" 
                          variant="outline"
                        >
                          <Edit className="w-3 h-3 mr-1" />
                          Editar
                        </Button>
                        {!bitacora.firmado ? (
                          <Button 
                            onClick={() => handleSignBitacora(bitacora.bitacora_id)}
                            size="sm" 
                            className="bg-primary hover:bg-primary/90"
                          >
                            <PenTool className="w-3 h-3 mr-1" />
                            Firmar
                          </Button>
                        ) : (
                          <Button variant="outline" size="sm">
                            Ver
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Card>
      )}
    </MainLayout>
  );
};

export default BitacorasBuzoFormulariosPage;
