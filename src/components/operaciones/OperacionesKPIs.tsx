
import { Card, CardContent } from "@/components/ui/card";

interface OperacionesKPIsProps {
  operaciones: any[];
}

export const OperacionesKPIs = ({ operaciones }: OperacionesKPIsProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="ios-card">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {operaciones.length}
          </div>
          <div className="text-sm text-zinc-500">Total Operaciones</div>
        </CardContent>
      </Card>
      <Card className="ios-card">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {operaciones.filter(op => op.estado === 'activa').length}
          </div>
          <div className="text-sm text-zinc-500">Activas</div>
        </CardContent>
      </Card>
      <Card className="ios-card">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-yellow-600">
            {operaciones.filter(op => op.estado === 'pausada').length}
          </div>
          <div className="text-sm text-zinc-500">Pausadas</div>
        </CardContent>
      </Card>
      <Card className="ios-card">
        <CardContent className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {operaciones.filter(op => op.estado === 'completada').length}
          </div>
          <div className="text-sm text-zinc-500">Completadas</div>
        </CardContent>
      </Card>
    </div>
  );
};
