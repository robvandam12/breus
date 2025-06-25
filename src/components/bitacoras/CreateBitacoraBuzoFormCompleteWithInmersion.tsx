
import { useState } from "react";
import { CreateBitacoraBuzoFormComplete } from "./CreateBitacoraBuzoFormComplete";
import { BitacoraBuzoFormData, useBitacorasBuzo } from "@/hooks/useBitacorasBuzo";
import { useInmersiones } from "@/hooks/useInmersiones";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { FileText } from 'lucide-react';
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";

interface CreateBitacoraBuzoFormCompleteWithInmersionProps {
  onSubmit: (data: BitacoraBuzoFormData) => Promise<void>;
  onCancel: () => void;
  inmersionId?: string;
}

export const CreateBitacoraBuzoFormCompleteWithInmersion = ({ 
  onSubmit, 
  onCancel,
  inmersionId,
}: CreateBitacoraBuzoFormCompleteWithInmersionProps) => {
  const [selectedInmersionId, setSelectedInmersionId] = useState<string | null>(inmersionId || null);
  const { inmersiones, isLoading: loadingInmersiones } = useInmersiones();
  const { bitacorasBuzo } = useBitacorasBuzo();

  // Filtra inmersiones que ya tienen una bitácora de buzo.
  const bitacoraInmersionIds = new Set(bitacorasBuzo.map(b => b.inmersion_id).filter(Boolean));
  const availableInmersiones = inmersiones.filter(i => !bitacoraInmersionIds.has(i.inmersion_id));

  const handleSelectInmersion = (inmersionId: string) => {
    setSelectedInmersionId(inmersionId);
  };

  const selectedInmersion = selectedInmersionId
    ? inmersiones.find(i => i.inmersion_id === selectedInmersionId)
    : null;
  
  if (loadingInmersiones) {
    return (
      <div className="p-6 text-center flex flex-col items-center justify-center h-full min-h-[400px]">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-zinc-500">Cargando inmersiones disponibles...</p>
      </div>
    );
  }

  // Una vez seleccionada la inmersión, muestra el formulario completo.
  if (selectedInmersionId && selectedInmersion) {
    return (
      <CreateBitacoraBuzoFormComplete
        inmersion={selectedInmersion}
        onSubmit={onSubmit}
        onCancel={() => setSelectedInmersionId(null)} // Permite volver a la pantalla de selección
      />
    );
  }

  // Paso inicial: seleccionar una inmersión.
  return (
    <Card className="max-w-3xl mx-auto border-0 shadow-none">
      <CardHeader>
        <CardTitle className="flex items-center gap-3">
          <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
            <FileText className="w-5 h-5 text-teal-600" />
          </div>
          <div>
            <h2 className="text-xl font-bold">Nueva Bitácora de Buzo</h2>
            <p className="text-sm text-zinc-500">Selecciona una inmersión para registrar tu bitácora.</p>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-2">
        {availableInmersiones.length === 0 ? (
          <Alert variant="default" className="bg-yellow-50 border-yellow-200">
            <AlertTitle className="font-semibold text-yellow-800">No hay Inmersiones para Registrar</AlertTitle>
            <AlertDescription className="text-yellow-700">
              Todas las inmersiones registradas por supervisores ya tienen una bitácora de buzo asociada.
              Por favor, espera a que se registren nuevas inmersiones.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            <Label htmlFor="inmersion-select" className="font-medium text-zinc-800">
                Inmersiones Disponibles
            </Label>
            <Select onValueChange={handleSelectInmersion}>
              <SelectTrigger id="inmersion-select" className="w-full">
                <SelectValue placeholder="Elige una inmersión de la lista..." />
              </SelectTrigger>
              <SelectContent>
                {availableInmersiones.map((inmersion) => (
                  <SelectItem key={inmersion.inmersion_id} value={inmersion.inmersion_id}>
                    <div className="flex items-center justify-between w-full space-x-4">
                        <div className="flex flex-col items-start text-left">
                            <span className="font-semibold">{inmersion.codigo}</span>
                            <span className="text-xs text-zinc-500 truncate max-w-[200px]">{inmersion.objetivo}</span>
                        </div>
                         <div className="flex flex-col items-end text-right">
                             <span className="text-xs">{new Date(inmersion.fecha_inmersion).toLocaleDateString('es-CL')}</span>
                            <Badge variant="outline">{inmersion.supervisor}</Badge>
                         </div>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <p className="text-xs text-zinc-500">
                Solo se muestran las inmersiones que aún no tienen una bitácora de buzo registrada.
            </p>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onCancel}>
              Cancelar
            </Button>
        </div>
      </CardContent>
    </Card>
  );
};
