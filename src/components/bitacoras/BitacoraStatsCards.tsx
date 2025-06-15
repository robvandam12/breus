
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, Clock, AlertTriangle } from "lucide-react";

interface BitacoraStatsCardsProps {
  total: number;
  completed: number;
  pending: number;
  type: 'supervisor' | 'buzo' | 'both';
}

export const BitacoraStatsCards = ({ total, completed, pending, type }: BitacoraStatsCardsProps) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-primary">{total}</div>
              <div className="text-sm text-muted-foreground">
                {type === 'supervisor' ? 'Bitácoras Supervisor' : 
                 type === 'buzo' ? 'Bitácoras Buzo' : 'Total Bitácoras'}
              </div>
            </div>
            <Badge variant="outline" className="text-primary">
              Total
            </Badge>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-green-600">{completed}</div>
              <div className="text-sm text-muted-foreground">Completadas</div>
            </div>
            <CheckCircle className="w-5 h-5 text-green-600" />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-orange-600">{pending}</div>
              <div className="text-sm text-muted-foreground">Pendientes</div>
            </div>
            <Clock className="w-5 h-5 text-orange-600" />
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
