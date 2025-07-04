
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, Shield, CheckCircle, Eye, Edit } from "lucide-react";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { AnexoBravoOperationSelector } from "@/components/anexo-bravo/AnexoBravoOperationSelector";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { useOperaciones } from "@/hooks/useOperaciones";
import { toast } from "@/hooks/use-toast";
import { MainLayout } from "@/components/layout/MainLayout";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { EmptyState } from "@/components/layout/EmptyState";

const AnexoBravoPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showOperationSelector, setShowOperationSelector] = useState(false);
  const [selectedOperacionId, setSelectedOperacionId] = useState<string>('');
  const [editingAnexoId, setEditingAnexoId] = useState<string | null>(null);
  
  const { anexosBravo, isLoading, createAnexoBravo } = useAnexoBravo();
  const { operaciones } = useOperaciones();

  const filteredAnexos = anexosBravo.filter(anexo => 
    anexo.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    anexo.supervisor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateAnexo = () => {
    setEditingAnexoId(null);
    setShowOperationSelector(true);
  };

  const handleOperationSelected = (operacionId: string) => {
    setSelectedOperacionId(operacionId);
    setShowOperationSelector(false);
    setShowCreateForm(true);
  };

  const handleAnexoComplete = () => {
    setShowCreateForm(false);
    setSelectedOperacionId('');
    setEditingAnexoId(null);
  };

  const handleSubmitAnexo = async (data: any) => {
    try {
      await createAnexoBravo(data);
      handleAnexoComplete();
    } catch (error) {
      console.error('Error creating anexo bravo:', error);
    }
  };

  const handleViewAnexo = (anexoId: string) => {
    // TODO: Implement view functionality
    console.log('View anexo:', anexoId);
  };

  const handleEditAnexo = (anexoId: string) => {
    const anexo = anexosBravo.find(a => a.id === anexoId);
    if (anexo) {
      setEditingAnexoId(anexoId);
      setSelectedOperacionId(anexo.operacion_id);
      setShowCreateForm(true);
    }
  };

  const headerActions = (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar Anexos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10 w-64"
        />
      </div>

      <Button 
        onClick={handleCreateAnexo}
        className="bg-primary hover:bg-primary/90"
      >
        <Plus className="w-4 h-4 mr-2" />
        Nuevo Anexo Bravo
      </Button>
    </div>
  );

  if (isLoading) {
    return (
      <MainLayout
        title="Anexos Bravo"
        subtitle="Gestión de documentos Anexo Bravo para operaciones de buceo"
        icon={Shield}
        headerChildren={headerActions}
      >
        <div className="flex items-center justify-center min-h-96">
          <LoadingSpinner text="Cargando Anexos Bravo..." />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Anexos Bravo"
      subtitle="Gestión de documentos Anexo Bravo para operaciones de buceo"
      icon={Shield}
      headerChildren={headerActions}
    >
      <div className="space-y-6">
        {/* KPIs */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-primary">
                {anexosBravo.length}
              </div>
              <div className="text-sm text-muted-foreground">Anexos Totales</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-green-600">
                {anexosBravo.filter(a => a.firmado).length}
              </div>
              <div className="text-sm text-muted-foreground">Anexos Firmados</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-yellow-600">
                {anexosBravo.filter(a => a.estado === 'borrador').length}
              </div>
              <div className="text-sm text-muted-foreground">En Borrador</div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4">
              <div className="text-2xl font-bold text-muted-foreground">
                {operaciones.filter(op => 
                  !anexosBravo.some(anexo => anexo.operacion_id === op.id)
                ).length}
              </div>
              <div className="text-sm text-muted-foreground">Operaciones Disponibles</div>
            </CardContent>
          </Card>
        </div>

        {/* Anexos List */}
        {filteredAnexos.length === 0 ? (
          <EmptyState
            icon={Shield}
            title={anexosBravo.length === 0 ? "No hay Anexos Bravo registrados" : "No se encontraron Anexos"}
            description={anexosBravo.length === 0 
              ? "Comience creando el primer Anexo Bravo seleccionando una operación"
              : "Intenta ajustar la búsqueda"}
            actionText={anexosBravo.length === 0 ? "Nuevo Anexo Bravo" : undefined}
            onAction={anexosBravo.length === 0 ? handleCreateAnexo : undefined}
            actionIcon={anexosBravo.length === 0 ? Plus : undefined}
          />
        ) : (
          <Card>
            <CardContent className="p-0">
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Código</TableHead>
                      <TableHead>Operación</TableHead>
                      <TableHead>Supervisor</TableHead>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Progreso</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {filteredAnexos.map((anexo) => {
                      const operacion = operaciones.find(op => op.id === anexo.operacion_id);
                      return (
                        <TableRow key={anexo.id}>
                          <TableCell>
                            <div className="font-medium">{anexo.codigo}</div>
                          </TableCell>
                          <TableCell>
                            <div className="text-sm text-muted-foreground">
                              {operacion ? `${operacion.codigo} - ${operacion.nombre}` : 'Operación no encontrada'}
                            </div>
                          </TableCell>
                          <TableCell>{anexo.supervisor}</TableCell>
                          <TableCell>
                            {anexo.fecha ? new Date(anexo.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                          </TableCell>
                          <TableCell>
                            <Badge variant={anexo.firmado ? 'default' : 'secondary'}>
                              {anexo.firmado ? (
                                <div className="flex items-center gap-1">
                                  <CheckCircle className="w-3 h-3" />
                                  Firmado
                                </div>
                              ) : (
                                anexo.estado || 'Borrador'
                              )}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center gap-2">
                              <div className="w-16 bg-muted rounded-full h-2">
                                <div 
                                  className="bg-primary h-2 rounded-full transition-all"
                                  style={{ width: `${anexo.progreso || 0}%` }}
                                />
                              </div>
                              <span className="text-xs text-muted-foreground">{anexo.progreso || 0}%</span>
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-1">
                              <Button 
                                variant="outline" 
                                size="sm"
                                onClick={() => handleViewAnexo(anexo.id)}
                              >
                                <Eye className="w-4 h-4 mr-1" />
                                Ver
                              </Button>
                              {!anexo.firmado && (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  onClick={() => handleEditAnexo(anexo.id)}
                                >
                                  <Edit className="w-4 h-4 mr-1" />
                                  Editar
                                </Button>
                              )}
                            </div>
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Operation Selector Dialog */}
        <Dialog open={showOperationSelector} onOpenChange={setShowOperationSelector}>
          <DialogContent className="max-w-4xl">
            <AnexoBravoOperationSelector 
              onOperacionSelected={handleOperationSelected}
              selectedOperacionId={selectedOperacionId}
            />
          </DialogContent>
        </Dialog>

        {/* Create/Edit Form Modal */}
        <Dialog open={showCreateForm} onOpenChange={setShowCreateForm}>
          <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
            <FullAnexoBravoForm 
              operacionId={selectedOperacionId}
              anexoId={editingAnexoId || undefined}
              onSubmit={handleSubmitAnexo}
              onCancel={() => setShowCreateForm(false)}
            />
          </DialogContent>
        </Dialog>
      </div>
    </MainLayout>
  );
};

export default AnexoBravoPage;
