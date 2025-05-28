import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { FileText, Plus, Download, Eye, CheckCircle, Clock, AlertCircle } from "lucide-react";
import { EnhancedAnexoBravoForm } from "@/components/anexo-bravo/EnhancedAnexoBravoForm";
import { CreateHPTForm } from "@/components/hpt/CreateHPTForm";
import { useAnexoBravo } from "@/hooks/useAnexoBravo";
import { useHPT } from "@/hooks/useHPT";
import { useOperaciones } from "@/hooks/useOperaciones";
import { useEquipoBuceo } from "@/hooks/useEquipoBuceo";

interface OperacionDocumentsProps {
  operacionId: string;
}

export const OperacionDocuments = ({ operacionId }: OperacionDocumentsProps) => {
  const [showCreateAnexoBravo, setShowCreateAnexoBravo] = useState(false);
  const [showCreateHPT, setShowCreateHPT] = useState(false);

  const { anexosBravo, createAnexoBravo } = useAnexoBravo();
  const { hpts, createHPT } = useHPT();
  const { operaciones } = useOperaciones();
  const { equipos } = useEquipoBuceo();

  const operacion = operaciones.find(op => op.id === operacionId);
  const equipoAsignado = operacion?.equipo_buceo_id 
    ? equipos.find(e => e.id === operacion.equipo_buceo_id)
    : null;

  // Filtrar documentos de esta operación
  const anexosOperacion = anexosBravo.filter(anexo => anexo.operacion_id === operacionId);
  const hptsOperacion = hpts.filter(hpt => hpt.operacion_id === operacionId);

  const handleCreateAnexoBravo = async (data: any) => {
    try {
      await createAnexoBravo({
        ...data,
        operacion_id: operacionId,
      });
      setShowCreateAnexoBravo(false);
    } catch (error) {
      console.error('Error creating anexo bravo:', error);
    }
  };

  const handleCreateHPT = async (data: any) => {
    try {
      // Auto-poblar campos basados en la operación y equipo
      const enrichedData = {
        ...data,
        operacion_id: operacionId,
        empresa_servicio_nombre: operacion?.salmonera?.nombre || '',
        centro_trabajo_nombre: operacion?.sitio?.nombre || '',
        supervisor_nombre: equipoAsignado?.miembros?.find(m => m.rol_equipo === 'supervisor')?.nombre_completo || '',
        // No poblar lugar_especifico como se solicita
      };

      await createHPT(enrichedData);
      setShowCreateHPT(false);
    } catch (error) {
      console.error('Error creating HPT:', error);
    }
  };

  const getStatusBadge = (firmado: boolean, estado?: string) => {
    if (firmado) {
      return (
        <Badge variant="default" className="bg-green-100 text-green-700">
          <CheckCircle className="w-3 h-3 mr-1" />
          Firmado
        </Badge>
      );
    }
    
    if (estado === 'completado') {
      return (
        <Badge variant="outline" className="border-yellow-300 text-yellow-700">
          <Clock className="w-3 h-3 mr-1" />
          Pendiente Firma
        </Badge>
      );
    }

    return (
      <Badge variant="outline" className="border-gray-300 text-gray-700">
        <AlertCircle className="w-3 h-3 mr-1" />
        En Proceso
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Resumen de Documentos */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Anexos Bravo</p>
              <p className="text-2xl font-bold text-blue-600">{anexosOperacion.length}</p>
            </div>
            <FileText className="w-8 h-8 text-blue-600" />
          </div>
        </Card>
        
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">HPT</p>
              <p className="text-2xl font-bold text-green-600">{hptsOperacion.length}</p>
            </div>
            <FileText className="w-8 h-8 text-green-600" />
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Firmados</p>
              <p className="text-2xl font-bold text-purple-600">
                {anexosOperacion.filter(a => a.firmado).length + hptsOperacion.filter(h => h.firmado).length}
              </p>
            </div>
            <CheckCircle className="w-8 h-8 text-purple-600" />
          </div>
        </Card>
      </div>

      {/* Acciones Rápidas */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-5 h-5 text-blue-600" />
            Crear Nuevos Documentos
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button onClick={() => setShowCreateAnexoBravo(true)} className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Nuevo Anexo Bravo
            </Button>
            <Button onClick={() => setShowCreateHPT(true)} variant="outline" className="flex items-center gap-2">
              <FileText className="w-4 h-4" />
              Nuevo HPT
            </Button>
          </div>
          {operacion && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <strong>Operación seleccionada:</strong> {operacion.codigo} - {operacion.nombre}
              </p>
              {equipoAsignado && (
                <p className="text-sm text-blue-700 mt-1">
                  <strong>Equipo asignado:</strong> {equipoAsignado.nombre}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Lista de Anexos Bravo */}
      {anexosOperacion.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              Anexos Bravo ({anexosOperacion.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {anexosOperacion.map((anexo) => (
                  <TableRow key={anexo.id}>
                    <TableCell className="font-medium">{anexo.codigo}</TableCell>
                    <TableCell>
                      {anexo.fecha ? new Date(anexo.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                    </TableCell>
                    <TableCell>{anexo.supervisor}</TableCell>
                    <TableCell>{getStatusBadge(anexo.firmado, anexo.estado)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Lista de HPTs */}
      {hptsOperacion.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-green-600" />
              HPT ({hptsOperacion.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Código</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Supervisor</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {hptsOperacion.map((hpt) => (
                  <TableRow key={hpt.id}>
                    <TableCell className="font-medium">{hpt.codigo}</TableCell>
                    <TableCell>
                      {hpt.fecha ? new Date(hpt.fecha).toLocaleDateString('es-CL') : 'Sin fecha'}
                    </TableCell>
                    <TableCell>{hpt.supervisor}</TableCell>
                    <TableCell>{getStatusBadge(hpt.firmado, hpt.estado)}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Download className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      )}

      {/* Modal para crear Anexo Bravo - USAR EL WIZARD COMPLETO */}
      <Dialog open={showCreateAnexoBravo} onOpenChange={setShowCreateAnexoBravo}>
        <DialogContent className="max-w-6xl max-h-[95vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo Anexo Bravo - Wizard Completo</DialogTitle>
          </DialogHeader>
          <EnhancedAnexoBravoForm
            operacionId={operacionId}
            onSubmit={handleCreateAnexoBravo}
            onCancel={() => setShowCreateAnexoBravo(false)}
            type="completo"
          />
        </DialogContent>
      </Dialog>

      {/* Modal para crear HPT con información de operación visible */}
      <Dialog open={showCreateHPT} onOpenChange={setShowCreateHPT}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Nuevo HPT</DialogTitle>
            {operacion && (
              <div className="mt-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
                <p className="text-sm text-blue-800">
                  <strong>Operación:</strong> {operacion.codigo} - {operacion.nombre}
                </p>
                <p className="text-sm text-blue-700">
                  <strong>Centro:</strong> {operacion.sitio?.nombre || 'No especificado'}
                </p>
                {equipoAsignado && (
                  <p className="text-sm text-blue-700">
                    <strong>Equipo:</strong> {equipoAsignado.nombre}
                  </p>
                )}
              </div>
            )}
          </DialogHeader>
          <CreateHPTForm
            defaultOperacionId={operacionId}
            onSubmit={handleCreateHPT}
            onCancel={() => setShowCreateHPT(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
