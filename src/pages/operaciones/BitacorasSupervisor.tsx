import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, FileText, Search, Filter, Eye, Download, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useBitacorasSupervisor, BitacoraSupervisorFormData } from "@/hooks/useBitacorasSupervisor";
import { useInmersiones } from "@/hooks/useInmersiones";
import { CreateBitacoraSupervisorForm } from "@/components/bitacoras/CreateBitacoraSupervisorForm";
import { BitacoraWizardFromInmersion } from "@/components/bitacoras/BitacoraWizardFromInmersion";
import { BitacoraSupervisorCompleta } from "@/types/bitacoras";
import type { Inmersion } from "@/types/inmersion";

const BitacorasSupervisor = () => {
  const { operacionId } = useParams();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [showWizardForm, setShowWizardForm] = useState(false);
  const [selectedInmersionId, setSelectedInmersionId] = useState<string>("");
  const [selectedBitacora, setSelectedBitacora] = useState<BitacoraSupervisorCompleta | null>(null);

  const {
    bitacorasSupervisor,
    isLoading,
    createBitacoraSupervisor,
    updateBitacoraSupervisor,
    deleteBitacoraSupervisor,
  } = useBitacorasSupervisor();

  const { inmersiones } = useInmersiones();

  // Filtrar inmersiones y bitácoras por operación
  const operacionInmersiones = Array.isArray(inmersiones) 
    ? inmersiones.filter(inmersion => inmersion.operacion_id === operacionId)
    : [];

  const operacionBitacoras = Array.isArray(bitacorasSupervisor)
    ? bitacorasSupervisor.filter(bitacora => {
        const inmersion = operacionInmersiones.find(i => i.inmersion_id === bitacora.inmersion_id);
        return inmersion !== undefined;
      })
    : [];

  // Aplicar filtros
  const filteredBitacoras = operacionBitacoras.filter(bitacora => {
    const matchesSearch = bitacora.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bitacora.supervisor.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "all" || bitacora.estado_aprobacion === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleCreateBitacora = async (data: BitacoraSupervisorFormData) => {
    try {
      await createBitacoraSupervisor.mutateAsync(data);
      setShowCreateForm(false);
      setShowWizardForm(false);
    } catch (error) {
      console.error('Error creating bitácora:', error);
    }
  };

  const handleCreateFromInmersion = (inmersionId: string) => {
    setSelectedInmersionId(inmersionId);
    setShowWizardForm(true);
  };

  const handleViewBitacora = (bitacora: any) => {
    // Convertir BitacoraSupervisor a BitacoraSupervisorCompleta agregando inmersion
    const inmersion = operacionInmersiones.find(i => i.inmersion_id === bitacora.inmersion_id);
    const bitacoraCompleta: BitacoraSupervisorCompleta = {
      ...bitacora,
      inmersion: inmersion || null
    };
    setSelectedBitacora(bitacoraCompleta);
  };

  const handleDeleteBitacora = async (bitacoraId: string) => {
    if (confirm('¿Estás seguro de que deseas eliminar esta bitácora?')) {
      try {
        await deleteBitacoraSupervisor.mutateAsync(bitacoraId);
      } catch (error) {
        console.error('Error deleting bitácora:', error);
      }
    }
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'aprobada':
        return 'bg-green-100 text-green-800';
      case 'rechazada':
        return 'bg-red-100 text-red-800';
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (showCreateForm) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Nueva Bitácora de Supervisor</h1>
          <Button variant="outline" onClick={() => setShowCreateForm(false)}>
            Volver
          </Button>
        </div>
        {/* Crear un formulario básico sin componente enhanced */}
        <Card>
          <CardContent className="p-6">
            <p>Formulario de creación básico aquí</p>
            <div className="flex gap-2 mt-4">
              <Button onClick={() => setShowCreateForm(false)}>Cancelar</Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (showWizardForm && selectedInmersionId) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold">Nueva Bitácora de Supervisor</h1>
          <Button variant="outline" onClick={() => setShowWizardForm(false)}>
            Volver
          </Button>
        </div>
        <BitacoraWizardFromInmersion
          inmersionId={selectedInmersionId}
          onComplete={handleCreateBitacora}
          onCancel={() => setShowWizardForm(false)}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Bitácoras de Supervisor</h1>
          <p className="text-gray-600">Gestiona las bitácoras de supervisor para esta operación</p>
        </div>
        <div className="flex gap-2">
          <Button onClick={() => setShowCreateForm(true)} className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Nueva Bitácora
          </Button>
        </div>
      </div>

      {/* Inmersiones disponibles para crear bitácoras */}
      {operacionInmersiones.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              Crear Bitácora desde Inmersión
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {operacionInmersiones.map((inmersion) => {
                const tieneBitacora = Array.isArray(operacionBitacoras) && operacionBitacoras.some(b => b.inmersion_id === inmersion.inmersion_id);
                return (
                  <div key={inmersion.inmersion_id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <h4 className="font-medium">{inmersion.codigo}</h4>
                      <p className="text-sm text-gray-600">{inmersion.objetivo}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')} - {inmersion.buzo_principal}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      {tieneBitacora && (
                        <Badge variant="outline" className="bg-green-50 text-green-700">
                          Bitácora creada
                        </Badge>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleCreateFromInmersion(inmersion.inmersion_id)}
                        disabled={tieneBitacora}
                      >
                        {tieneBitacora ? 'Ya tiene bitácora' : 'Crear Bitácora'}
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Filtros */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por código o supervisor..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger className="w-48">
                <Filter className="w-4 h-4 mr-2" />
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendiente</SelectItem>
                <SelectItem value="aprobada">Aprobada</SelectItem>
                <SelectItem value="rechazada">Rechazada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Lista de bitácoras */}
      <Card>
        <CardHeader>
          <CardTitle>Bitácoras ({filteredBitacoras.length})</CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse p-4 border rounded-lg">
                  <div className="h-4 bg-gray-200 rounded w-1/4 mb-2" />
                  <div className="h-3 bg-gray-200 rounded w-1/2" />
                </div>
              ))}
            </div>
          ) : filteredBitacoras.length === 0 ? (
            <div className="text-center py-8">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay bitácoras
              </h3>
              <p className="text-gray-500">
                {searchTerm || statusFilter !== "all" 
                  ? "No se encontraron bitácoras con los filtros aplicados"
                  : "Aún no se han creado bitácoras para esta operación"
                }
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredBitacoras.map((bitacora) => (
                <div key={bitacora.bitacora_id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="font-medium text-gray-900">{bitacora.codigo}</h3>
                        <Badge className={getStatusBadgeColor(bitacora.estado_aprobacion || 'pendiente')}>
                          {bitacora.estado_aprobacion || 'Pendiente'}
                        </Badge>
                        {bitacora.firmado && (
                          <Badge variant="outline" className="bg-blue-50 text-blue-700">
                            Firmado
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Supervisor:</strong> {bitacora.supervisor}
                      </p>
                      <p className="text-sm text-gray-600 mb-1">
                        <strong>Fecha:</strong> {new Date(bitacora.fecha).toLocaleDateString('es-CL')}
                      </p>
                      <p className="text-sm text-gray-500">
                        Desarrollo: {bitacora.desarrollo_inmersion.substring(0, 100)}...
                      </p>
                    </div>
                    <div className="flex items-center gap-2 ml-4">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleViewBitacora(bitacora)}
                      >
                        <Eye className="w-4 h-4 mr-1" />
                        Ver
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                      >
                        <Download className="w-4 h-4 mr-1" />
                        PDF
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteBitacora(bitacora.bitacora_id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default BitacorasSupervisor;
