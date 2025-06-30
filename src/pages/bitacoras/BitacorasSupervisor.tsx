
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileText, Clock, User, CheckCircle, AlertTriangle, ArrowLeft } from 'lucide-react';
import { BitacoraWizardFromInmersion } from '@/components/bitacoras/BitacoraWizardFromInmersion';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useBitacorasSupervisor } from '@/hooks/useBitacorasSupervisor';
import { BitacorasSupervisorContent } from '@/components/bitacoras/BitacorasSupervisorContent';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export default function BitacorasSupervisor() {
  const { inmersiones, isLoading: loadingInmersiones } = useInmersiones();
  const { bitacorasSupervisor, loadingSupervisor } = useBitacorasSupervisor();
  const [selectedInmersionId, setSelectedInmersionId] = useState<string | null>(null);
  const [showWizard, setShowWizard] = useState(false);

  // Filtrar inmersiones que no tienen bitácora de supervisor
  const inmersionesSinBitacora = inmersiones.filter(inmersion => 
    !bitacorasSupervisor.some(bitacora => bitacora.inmersion_id === inmersion.inmersion_id)
  );

  const handleSelectInmersion = (inmersionId: string) => {
    setSelectedInmersionId(inmersionId);
    setShowWizard(true);
  };

  const handleWizardComplete = () => {
    setShowWizard(false);
    setSelectedInmersionId(null);
  };

  const handleWizardCancel = () => {
    setShowWizard(false);
    setSelectedInmersionId(null);
  };

  if (showWizard && selectedInmersionId) {
    return (
      <BitacoraWizardFromInmersion
        inmersionId={selectedInmersionId}
        onComplete={handleWizardComplete}
        onCancel={handleWizardCancel}
      />
    );
  }

  return (
    <MainLayout
      title="Bitácoras de Supervisor"
      subtitle="Gestión y creación de bitácoras de supervisores de buceo"
      icon={FileText}
    >
      <div className="space-y-6">
        {/* Botón para nueva bitácora */}
        {inmersionesSinBitacora.length > 0 && (
          <Card className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <FileText className="w-5 h-5" />
                Nueva Bitácora de Supervisor
              </CardTitle>
              <p className="text-sm text-blue-700">
                Seleccione una inmersión para crear su bitácora de supervisor
              </p>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {inmersionesSinBitacora.slice(0, 3).map((inmersion) => (
                  <Card key={inmersion.inmersion_id} className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200" onClick={() => handleSelectInmersion(inmersion.inmersion_id)}>
                    <CardContent className="p-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Badge variant="outline">{inmersion.codigo}</Badge>
                            <Badge variant={inmersion.estado === 'completada' ? 'default' : 'secondary'}>
                              {inmersion.estado}
                            </Badge>
                          </div>
                          <h4 className="font-medium text-gray-900">{inmersion.objetivo}</h4>
                          <div className="flex items-center gap-4 text-sm text-gray-600">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              <span>{format(new Date(inmersion.fecha_inmersion), 'dd MMM yyyy', { locale: es })}</span>
                            </div>
                            <div className="flex items-center gap-1">
                              <User className="w-3 h-3" />
                              <span>{inmersion.supervisor || 'Sin asignar'}</span>
                            </div>
                          </div>
                        </div>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                          Crear Bitácora
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
                
                {inmersionesSinBitacora.length > 3 && (
                  <Card className="border-dashed">
                    <CardContent className="p-4 text-center">
                      <p className="text-sm text-gray-600">
                        +{inmersionesSinBitacora.length - 3} inmersiones más disponibles
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Listado de bitácoras existentes */}
        <BitacorasSupervisorContent />
      </div>
    </MainLayout>
  );
}
