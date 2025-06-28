
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, FileText, Plus } from "lucide-react";
import { HPTWizardComplete } from "@/components/hpt/HPTWizardComplete";
import { AnexoBravoWizard } from "@/components/anexo-bravo/AnexoBravoWizard";
import { useOperacionDetails } from "@/hooks/useOperacionDetails";

interface OperacionDocumentsProps {
  operacion: { id: string };
}

export const OperacionDocuments = ({ operacion }: OperacionDocumentsProps) => {
  const [showHPTWizard, setShowHPTWizard] = useState(false);
  const [showAnexoBravoWizard, setShowAnexoBravoWizard] = useState(false);
  const { refreshOperacionDetails, isLoading, isError } = useOperacionDetails(operacion.id);

  const handleCreateHPT = () => {
    setShowHPTWizard(true);
  };

  const handleHPTComplete = () => {
    setShowHPTWizard(false);
    refreshOperacionDetails();
  };

  const handleHPTCancel = () => {
    setShowHPTWizard(false);
  };

  const handleCreateAnexoBravo = () => {
    setShowAnexoBravoWizard(true);
  };

  const handleAnexoBravoComplete = () => {
    setShowAnexoBravoWizard(false);
    refreshOperacionDetails();
  };

  const handleAnexoBravoCancel = () => {
    setShowAnexoBravoWizard(false);
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Cargando documentos...</div>;
  }

  if (isError) {
    return <div className="flex justify-center p-8 text-red-600">Error al cargar documentos.</div>;
  }

  if (showHPTWizard) {
    return (
      <HPTWizardComplete
        operacionId={operacion.id}
        onComplete={handleHPTComplete}
        onCancel={handleHPTCancel}
      />
    );
  }

  if (showAnexoBravoWizard) {
    return (
      <AnexoBravoWizard
        operacionId={operacion.id}
        onComplete={handleAnexoBravoComplete}
        onCancel={handleAnexoBravoCancel}
      />
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            HPT - Hoja de Planificación de Trabajo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            Documento que detalla la planificación de las tareas a realizar en la operación.
          </p>
          <Button onClick={handleCreateHPT} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Crear HPT
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="w-5 h-5" />
            Anexo Bravo
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-gray-500">
            Anexo que complementa la información de la operación.
          </p>
          <Button onClick={handleCreateAnexoBravo} className="w-full">
            <Plus className="w-4 h-4 mr-2" />
            Crear Anexo Bravo
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
