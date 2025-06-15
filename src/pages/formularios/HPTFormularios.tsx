
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Search, FileText, CheckCircle, PenTool, Trash2 } from "lucide-react";
import { HPTWizard } from "@/components/hpt/HPTWizard";
import { HPTOperationSelector } from "@/components/hpt/HPTOperationSelector";
import { useHPT } from "@/hooks/useHPT";
import { useOperaciones } from "@/hooks/useOperaciones";
import { toast } from "@/hooks/use-toast";
import { FormDialog } from "@/components/forms/FormDialog";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageLoadingSkeleton } from "@/components/layout/PageLoadingSkeleton";
import { EmptyState } from "@/components/layout/EmptyState";

const HPTFormulariosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOperacionId, setSelectedOperacionId] = useState<string>('');
  const [showOperationSelector, setShowOperationSelector] = useState(false);
  
  const { hpts, isLoading, signHPT, deleteHPT } = useHPT();
  const { operaciones } = useOperaciones();

  const filteredHPTs = hpts.filter(hpt => 
    hpt.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    hpt.supervisor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateHPT = () => {
    setShowOperationSelector(true);
  };

  const handleOperationSelected = (operacionId: string) => {
    setSelectedOperacionId(operacionId);
    setShowOperationSelector(false);
    setShowCreateForm(true);
  };

  const handleHPTComplete = () => {
    setShowCreateForm(false);
    setSelectedOperacionId('');
  };

  const handleSignHPT = async (hptId: string) => {
    try {
      await signHPT({ 
        id: hptId, 
        signatures: {
          supervisor_servicio_url: 'signed',
          supervisor_mandante_url: 'signed'
        }
      });
      toast({
        title: "HPT firmado",
        description: "El documento ha sido firmado exitosamente.",
      });
    } catch (error) {
      console.error('Error signing HPT:', error);
      toast({
        title: "Error al firmar",
        description: "No se pudo firmar el HPT.",
        variant: "destructive",
      });
    }
  };

  const handleDeleteHPT = async (hptId: string) => {
    try {
      await deleteHPT(hptId);
      toast({
        title: "HPT eliminado",
        description: "El documento ha sido eliminado exitosamente.",
      });
    } catch (error: any) {
      console.error('Error deleting HPT:', error);
      toast({
        title: "Error al eliminar",
        description: "No se pudo eliminar el HPT.",
        variant: "destructive",
      });
    }
  };

  if (isLoading) {
    return (
      <PageLoadingSkeleton
        title="Hojas de Planificación de Tarea (HPT)"
        subtitle="Gestión de documentos HPT para operaciones de buceo"
        icon={FileText}
      />
    );
  }

  const headerActions = (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar HPTs..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-64"
        />
      </div>

      <Button 
        onClick={handleCreateHPT}
        className="bg-primary hover:bg-primary/90"
      >
        <Plus className="w-4 h-4 mr-2" />
        Nuevo HPT
      </Button>
    </div>
  );

  return (
    <MainLayout
      title="Hojas de Planificación de Tarea (HPT)"
      subtitle="Gestión de documentos HPT para operaciones de buceo"
      icon={FileText}
      headerChildren={headerActions}
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-primary">
              {hpts.length}
            </div>
            <div className="text-sm text-muted-foreground">HPTs Totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {hpts.filter(h => h.firmado).length}
            </div>
            <div className="text-sm text-muted-foreground">HPTs Firmados</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {hpts.filter(h => h.estado === 'borrador').length}
            </div>
            <div className="text-sm text-muted-foreground">En Borrador</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-muted-foreground">
              {operaciones.filter(op => 
                !hpts.some(hpt => hpt.operacion_id === op.id)
              ).length}
            </div>
            <div className="text-sm text-muted-foreground">Operaciones Disponibles</div>
          </CardContent>
        </Card>
      </div>

      {/* HPTs List */}
      {filteredHPTs.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={hpts.length === 0 ? "No hay HPTs registrados" : "No se encontraron HPTs"}
          description={hpts.length === 0 
            ? "Comience creando el primer HPT seleccionando una operación"
            : "Intenta ajustar la búsqueda"}
          actionText="Nuevo HPT"
          onAction={handleCreateHPT}
          actionIcon={Plus}
        />
      ) : (
        <Card>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Operación</TableHead>
                <TableHead>Supervisor</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredHPTs.map((hpt) => {
                const operacion = operaciones.find(op => op.id === hpt.operacion_id);
                return (
                  <TableRow key={hpt.id}>
                    <TableCell>
                      <div className="font-medium">{hpt.codigo || hpt.folio}</div>
                    </TableCell>
                    <TableCell>
                      <div className="text-sm text-muted-foreground">
                        {operacion ? `${operacion.codigo} - ${operacion.nombre}` : 'Operación no encontrada'}
                      </div>
                    </TableCell>
                    <TableCell>{hpt.supervisor || hpt.supervisor_nombre}</TableCell>
                    <TableCell>
                      {hpt.fecha ? new Date(hpt.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                    </TableCell>
                    <TableCell>
                      <Badge variant={hpt.firmado ? 'default' : 'secondary'}>
                        {hpt.firmado ? (
                          <div className="flex items-center gap-1">
                            <CheckCircle className="w-3 h-3" />
                            Firmado
                          </div>
                        ) : (
                          hpt.estado || 'Borrador'
                        )}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-1">
                        {!hpt.firmado ? (
                          <>
                            <Button 
                              onClick={() => handleSignHPT(hpt.id)}
                              size="sm" 
                              className="bg-primary hover:bg-primary/90"
                            >
                              <PenTool className="w-3 h-3 mr-1" />
                              Firmar
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button 
                                  variant="outline" 
                                  size="sm" 
                                  className="text-destructive hover:text-destructive"
                                >
                                  <Trash2 className="w-3 h-3" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar HPT?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente el HPT "{hpt.codigo || hpt.folio}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction 
                                    onClick={() => handleDeleteHPT(hpt.id)}
                                    className="bg-destructive hover:bg-destructive/90"
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </>
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

      {/* Operation Selector Dialog */}
      <FormDialog
        variant="form"
        size="xl"
        open={showOperationSelector}
        onOpenChange={setShowOperationSelector}
      >
        <HPTOperationSelector 
          onOperacionSelected={handleOperationSelected}
          selectedOperacionId={selectedOperacionId}
        />
      </FormDialog>

      {/* Create Form Modal */}
      <FormDialog
        variant="wizard"
        size="full"
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
      >
        <HPTWizard 
          operacionId={selectedOperacionId}
          onComplete={handleHPTComplete}
          onCancel={() => setShowCreateForm(false)}
        />
      </FormDialog>
    </MainLayout>
  );
};

export default HPTFormulariosPage;
