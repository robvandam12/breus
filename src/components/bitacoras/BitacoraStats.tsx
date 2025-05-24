
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileText, CheckCircle, Clock, TrendingUp } from "lucide-react";
import { BitacoraSupervisorItem, BitacoraBuzoItem } from "@/hooks/useBitacoras";

interface BitacoraStatsProps {
  bitacorasSupervisor: BitacoraSupervisorItem[];
  bitacorasBuzo: BitacoraBuzoItem[];
  filteredSupervisor: BitacoraSupervisorItem[];
  filteredBuzo: BitacoraBuzoItem[];
}

export const BitacoraStats = ({ 
  bitacorasSupervisor, 
  bitacorasBuzo, 
  filteredSupervisor, 
  filteredBuzo 
}: BitacoraStatsProps) => {
  const totalBitacoras = bitacorasSupervisor.length + bitacorasBuzo.length;
  const totalFirmadas = bitacorasSupervisor.filter(b => b.firmado).length + 
                       bitacorasBuzo.filter(b => b.firmado).length;
  const totalPendientes = totalBitacoras - totalFirmadas;
  
  const filteredTotal = filteredSupervisor.length + filteredBuzo.length;
  const isFiltered = filteredTotal !== totalBitacoras;

  const stats = [
    {
      label: "Total Bitácoras",
      value: isFiltered ? `${filteredTotal} / ${totalBitacoras}` : totalBitacoras,
      icon: FileText,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      label: "Firmadas",
      value: totalFirmadas,
      icon: CheckCircle,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      label: "Pendientes",
      value: totalPendientes,
      icon: Clock,
      color: "text-amber-600",
      bgColor: "bg-amber-100"
    },
    {
      label: "% Completado",
      value: totalBitacoras > 0 ? `${Math.round((totalFirmadas / totalBitacoras) * 100)}%` : "0%",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
      {stats.map((stat, index) => (
        <Card key={index}>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
              </div>
              <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                <stat.icon className={`w-6 h-6 ${stat.color}`} />
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
