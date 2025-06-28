import { useState, useEffect, useMemo } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Plus, Search, FileText, CheckCircle, Shield } from "lucide-react";
import { HPTWizard } from "@/components/hpt/HPTWizard";
import { HPTOperationSelector } from "@/components/hpt/HPTOperationSelector";
import { useHPT } from "@/hooks/useHPT";
import { useOperaciones } from "@/hooks/useOperaciones";
import { FormDialog } from "@/components/forms/FormDialog";
import { PageLoadingSkeleton } from "@/components/layout/PageLoadingSkeleton";
import { EmptyState } from "@/components/layout/EmptyState";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { FullAnexoBravoForm } from "@/components/anexo-bravo/FullAnexoBravoForm";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";

const BitacorasSupervisorPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedOperacion, setSelectedOperacion] = useState<string>('');
  const [showOperationSelector, setShowOperationSelector] = useState(false);
  const [showHPTWizard, setShowHPTWizard] = useState(false);
  const [showAnexoBravoForm, setShowAnexoBravoForm] = useState(false);
  
  const { hpts, isLoading: isLoadingHPT } = useHPT();
  const { anexosBravo, isLoading: isLoadingAnexos, createAnexoBravo } = useAnexoBravo();
  const { operaciones, isLoading: isLoadingOperaciones } = useOperaciones();
  const { profile } = useAuth();

  const filteredHPTs = useMemo(() => {
    return hpts.filter(hpt => 
      hpt.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hpt.supervisor?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [hpts, searchTerm]);

  const filteredAnexos = useMemo(() => {
    return anexosBravo.filter(anexo => 
      anexo.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      anexo.supervisor?.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [anexosBravo, searchTerm]);

  const handleCreateHPT = () => {
    setShowOperationSelector(true);
  };

  const handleOperationSelected = (operacionId: string) => {
    setSelectedOperacion(operacionId);
    setShowOperationSelector(false);
    setShowHPTWizard(true);
  };

  const handleHPTComplete = () => {
    setShowCreateForm(false);
    setSelectedOperacion('');
  };

  const handleAnexoBravoComplete = () => {
    setShowAnexoBravoForm(false);
    setSelectedOperacion('');
  };

  const isLoading = isLoadingHPT || isLoadingAnexos || isLoadingOperaciones;

  if (isLoading) {
    return (
      <PageLoadingSkeleton
        title="Bitácoras del Supervisor"
        subtitle="Gestión de documentos HPT y Anexos Bravo"
        icon={FileText}
      />
    );
  }

  const headerActions = (
    <div className="flex items-center gap-3">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
        <Input
          placeholder="Buscar documentos..."
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
        Nuevo Documento
      </Button>
    </div>
  );

  return (
    <MainLayout
      title="Bitácoras del Supervisor"
      subtitle="Gestión de documentos HPT y Anexos Bravo"
      icon={FileText}
      headerChildren={headerActions}
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
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
              {anexosBravo.length}
            </div>
            <div className="text-sm text-muted-foreground">Anexos Bravo</div>
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

      {/* Documents List */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* HPTs List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-blue-600" />
                Hojas de Planificación (HPT)
              </CardTitle>
              <Button 
                onClick={() => {
                  setShowOperationSelector(true);
                  setShowHPTWizard(true);
                  setShowAnexoBravoForm(false);
                }}
                className="bg-blue-600 hover:bg-blue-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo HPT
              </Button>
            </div>
          </CardHeader>
          <CardContent>
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
                        <TableCell>{hpt.supervisor}</TableCell>
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
                        <TableCell>
                          <div className="flex items-center gap-2">
                            <div className="w-16 bg-muted rounded-full h-2">
                              <div 
                                className="bg-primary h-2 rounded-full transition-all"
                                style={{ width: `${hpt.progreso || 0}%` }}
                              />
                            </div>
                            <span className="text-xs text-muted-foreground">{hpt.progreso || 0}%</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="outline" size="sm">
                              Ver
                            </Button>
                            {!hpt.firmado && (
                              <Button variant="outline" size="sm">
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
            )}
          </CardContent>
        </Card>

        {/* Anexos Bravo List */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5 text-green-600" />
                Anexos Bravo
              </CardTitle>
              <Button 
                onClick={() => {
                  setShowOperationSelector(true);
                  setShowHPTWizard(false);
                  setShowAnexoBravoForm(true);
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Anexo
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            {filteredAnexos.length === 0 ? (
              <EmptyState
                icon={Shield}
                title={anexosBravo.length === 0 ? "No hay Anexos Bravo registrados" : "No se encontraron Anexos Bravo"}
                description={anexosBravo.length === 0 
                  ? "Comience creando el primer Anexo Bravo seleccionando una operación"
                  : "Intenta ajustar la búsqueda"}
                actionText="Nuevo Anexo Bravo"
                onAction={() => {
                  setShowOperationSelector(true);
                  setShowHPTWizard(false);
                  setShowAnexoBravoForm(true);
                }}
                actionIcon={Plus}
              />
            ) : (
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
                  {filteredAnexos.map((anexo) => {
                    const operacion = operaciones.find(op => op.id === anexo.operacion_id);
                    return (
                      <TableRow key={anexo.id}>
                        <TableCell>
                          <div className="font-medium">{anexo.codigo || anexo.folio}</div>
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
                        <TableCell className="text-right">
                          <div className="flex justify-end gap-1">
                            <Button variant="outline" size="sm">
                              Ver
                            </Button>
                            {!anexo.firmado && (
                              <Button variant="outline" size="sm">
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
            )}
          </CardContent>
        </Card>
      </div>

      {/* Operation Selector Dialog */}
      <FormDialog
        variant="form"
        size="xl"
        open={showOperationSelector}
        onOpenChange={setShowOperationSelector}
      >
        <HPTOperationSelector 
          onOperacionSelected={handleOperationSelected}
          selectedOperacionId={selectedOperacion}
        />
      </FormDialog>

      {/* Create HPT Form Modal */}
      <FormDialog
        variant="wizard"
        size="full"
        open={showHPTWizard}
        onOpenChange={setShowHPTWizard}
      >
        <HPTWizard 
          operacionId={selectedOperacion}
          onComplete={handleHPTComplete}
          onCancel={() => setShowHPTWizard(false)}
        />
      </FormDialog>

      {/* Create Anexo Bravo Form Modal */}
      <FormDialog
        variant="form"
        size="full"
        open={showAnexoBravoForm}
        onOpenChange={setShowAnexoBravoForm}
      >
        
            <FullAnexoBravoForm
              operacionId={selectedOperacion}
              onSubmit={async (data) => {
                await createAnexoBravo(data);
                setShowAnexoBravoForm(false);
              }}
              onCancel={() => setShowAnexoBravoForm(false)}
            />
        
      </FormDialog>
    </MainLayout>
  );
};

export default BitacorasSupervisorPage;
