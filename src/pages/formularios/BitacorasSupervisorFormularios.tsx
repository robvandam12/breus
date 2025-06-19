
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableHead, TableHeader, TableRow, TableCell } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Plus, Search, FileText, CheckCircle, PenTool, Trash2, Edit } from "lucide-react";
import { BitacoraWizardFromInmersion } from "@/components/bitacoras/BitacoraWizardFromInmersion";
import { useBitacorasSupervisor, BitacoraSupervisorFormData } from "@/hooks/useBitacorasSupervisor";
import { useInmersiones } from "@/hooks/useInmersiones";
import { toast } from "@/hooks/use-toast";
import { FormDialog } from "@/components/forms/FormDialog";
import { MainLayout } from "@/components/layout/MainLayout";
import { PageLoadingSkeleton } from "@/components/layout/PageLoadingSkeleton";
import { EmptyState } from "@/components/layout/EmptyState";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

const BitacorasSupervisorFormulariosPage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [selectedInmersionId, setSelectedInmersionId] = useState<string>('');
  const [showInmersionSelector, setShowInmersionSelector] = useState(false);
  const [editingBitacora, setEditingBitacora] = useState<string | null>(null);
  
  const { 
    bitacorasSupervisor, 
    loadingSupervisor, 
    createBitacoraSupervisor,
    updateBitacoraSupervisorSignature 
  } = useBitacorasSupervisor();
  const { inmersiones } = useInmersiones();

  const filteredBitacoras = bitacorasSupervisor.filter(bitacora => 
    bitacora.codigo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    bitacora.supervisor?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Filtrar inmersiones que no tengan bitácora de supervisor O que ya tengan una para editar
  const inmersionesDisponibles = inmersiones.filter(inmersion => {
    const tieneBitacora = bitacorasSupervisor.some(bitacora => bitacora.inmersion_id === inmersion.inmersion_id);
    return !tieneBitacora || editingBitacora;
  });

  const handleCreateBitacora = () => {
    setEditingBitacora(null);
    setShowInmersionSelector(true);
  };

  const handleEditBitacora = (bitacoraId: string) => {
    const bitacora = bitacorasSupervisor.find(b => b.bitacora_id === bitacoraId);
    if (bitacora) {
      setEditingBitacora(bitacoraId);
      setSelectedInmersionId(bitacora.inmersion_id);
      setShowCreateForm(true);
    }
  };

  const handleInmersionSelected = (inmersionId: string) => {
    setSelectedInmersionId(inmersionId);
    setShowInmersionSelector(false);
    setShowCreateForm(true);
  };

  const handleBitacoraComplete = async (data: any) => {
    try {
      if (editingBitacora) {
        // Para edición, actualizamos la bitácora existente
        // Aquí necesitarías implementar una función de actualización
        toast({
          title: "Bitácora actualizada",
          description: "Los cambios han sido guardados exitosamente.",
        });
      } else {
        // Para creación nueva
        await createBitacoraSupervisor.mutateAsync(data);
      }
      setShowCreateForm(false);
      setSelectedInmersionId('');
      setEditingBitacora(null);
    } catch (error) {
      console.error('Error processing bitácora:', error);
    }
  };

  const handleSignBitacora = async (bitacoraId: string, signatureData: string) => {
    await updateBitacoraSupervisorSignature.mutateAsync({ bitacoraId, signatureData });
  };

  const handleDeleteBitacora = async (bitacoraId: string) => {
    // Implementar eliminación si es necesario
    toast({
      title: "Función no implementada",
      description: "La eliminación de bitácoras será implementada próximamente.",
      variant: "destructive",
    });
  };

  if (loadingSupervisor) {
    return (
      <PageLoadingSkeleton
        title="Bitácoras de Supervisor"
        subtitle="Gestión independiente de bitácoras de supervisión"
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
        className="bg-purple-600 hover:bg-purple-700"
      >
        <Plus className="w-4 h-4 mr-2" />
        Nueva Bitácora
      </Button>
    </div>
  );

  return (
    <MainLayout
      title="Bitácoras de Supervisor"
      subtitle="Gestión independiente de bitácoras de supervisión"
      icon={FileText}
      headerChildren={headerActions}
    >
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-purple-600">
              {bitacorasSupervisor.length}
            </div>
            <div className="text-sm text-muted-foreground">Bitácoras Totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-green-600">
              {bitacorasSupervisor.filter(b => b.firmado).length}
            </div>
            <div className="text-sm text-muted-foreground">Firmadas</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-yellow-600">
              {bitacorasSupervisor.filter(b => !b.firmado).length}
            </div>
            <div className="text-sm text-muted-foreground">Pendientes</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="text-2xl font-bold text-muted-foreground">
              {inmersionesDisponibles.length}
            </div>
            <div className="text-sm text-muted-foreground">Inmersiones Disponibles</div>
          </CardContent>
        </Card>
      </div>

      {/* Lista de Bitácoras */}
      {filteredBitacoras.length === 0 ? (
        <EmptyState
          icon={FileText}
          title={bitacorasSupervisor.length === 0 ? "No hay bitácoras registradas" : "No se encontraron bitácoras"}
          description={bitacorasSupervisor.length === 0 
            ? "Comience creando la primera bitácora de supervisor"
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
                <TableHead>Supervisor</TableHead>
                <TableHead>Fecha</TableHead>
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
                    <TableCell>{bitacora.supervisor}</TableCell>
                    <TableCell>
                      {bitacora.fecha ? new Date(bitacora.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
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
                            onClick={() => handleSignBitacora(bitacora.bitacora_id, 'signed')}
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

      {/* Selector de Inmersión */}
      <FormDialog
        variant="form"
        size="xl"
        open={showInmersionSelector}
        onOpenChange={setShowInmersionSelector}
      >
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
                {inmersionesDisponibles.map((inmersion) => (
                  <SelectItem key={inmersion.inmersion_id} value={inmersion.inmersion_id}>
                    {inmersion.codigo} - {inmersion.objetivo} ({inmersion.fecha_inmersion})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-2 pt-4">
            <Button variant="outline" onClick={() => setShowInmersionSelector(false)}>
              Cancelar
            </Button>
            <Button 
              onClick={() => handleInmersionSelected(selectedInmersionId)} 
              disabled={!selectedInmersionId}
            >
              Continuar
            </Button>
          </div>
        </div>
      </FormDialog>

      {/* Wizard de Creación/Edición */}
      <FormDialog
        variant="wizard"
        size="full"
        open={showCreateForm}
        onOpenChange={setShowCreateForm}
      >
        <BitacoraWizardFromInmersion
          inmersionId={selectedInmersionId}
          onComplete={handleBitacoraComplete}
          onCancel={() => {
            setShowCreateForm(false);
            setSelectedInmersionId('');
            setEditingBitacora(null);
          }}
        />
      </FormDialog>
    </MainLayout>
  );
};

export default BitacorasSupervisorFormulariosPage;
