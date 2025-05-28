
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Waves, Plus } from "lucide-react";

interface OperacionInmersionesProps {
  operacionId: string;
}

export const OperacionInmersiones = ({ operacionId }: OperacionInmersionesProps) => {
  // Mock data - En producción esto vendría de hooks
  const inmersiones = [
    {
      id: '1',
      codigo: 'INM-001',
      fecha: '2024-01-15',
      buzo_principal: 'Juan Pérez',
      supervisor: 'Carlos López',
      estado: 'completada',
      profundidad: 15
    }
  ];

  const getStatusColor = (estado: string) => {
    switch (estado) {
      case 'completada':
        return 'bg-green-100 text-green-700';
      case 'en_progreso':
        return 'bg-blue-100 text-blue-700';
      case 'planificada':
        return 'bg-yellow-100 text-yellow-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Waves className="w-5 h-5 text-blue-600" />
            Inmersiones de la Operación
          </CardTitle>
          <Button size="sm">
            <Plus className="w-4 h-4 mr-2" />
            Nueva Inmersión
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {inmersiones.length === 0 ? (
          <div className="text-center py-8">
            <Waves className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
            <p className="text-zinc-500 mb-4">No hay inmersiones registradas</p>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Crear Primera Inmersión
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            {inmersiones.map((inmersion) => (
              <div key={inmersion.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-4">
                  <Waves className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="font-medium">{inmersion.codigo}</p>
                    <p className="text-sm text-zinc-500">
                      {new Date(inmersion.fecha).toLocaleDateString('es-CL')} - {inmersion.profundidad}m
                    </p>
                    <div className="flex gap-2 mt-1">
                      <span className="text-xs text-zinc-600">Buzo: {inmersion.buzo_principal}</span>
                      <span className="text-xs text-zinc-600">Supervisor: {inmersion.supervisor}</span>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Badge className={getStatusColor(inmersion.estado)}>
                    {inmersion.estado}
                  </Badge>
                  <Button variant="outline" size="sm">
                    Ver Detalles
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
