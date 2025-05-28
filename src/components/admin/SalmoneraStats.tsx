
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Building, Users, MapPin, CheckCircle } from "lucide-react";

interface SalmoneraStatsProps {
  salmoneras: any[];
}

export const SalmoneraStats = ({ salmoneras }: SalmoneraStatsProps) => {
  const totalSalmoneras = salmoneras.length;
  const activeSalmoneras = salmoneras.filter(s => s.estado === 'activa').length;
  const inactiveSalmoneras = salmoneras.filter(s => s.estado === 'inactiva').length;
  const totalSitios = salmoneras.reduce((acc, s) => acc + (s.sitios_activos || 0), 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      <Card className="bg-white shadow-sm rounded-xl border-gray-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">Total Salmoneras</CardTitle>
            <Building className="w-4 h-4 text-blue-600" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-2xl font-bold text-gray-900">{totalSalmoneras}</div>
          <p className="text-xs text-gray-500 mt-1">Empresas registradas</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm rounded-xl border-gray-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">Salmoneras Activas</CardTitle>
            <CheckCircle className="w-4 h-4 text-green-600" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-2xl font-bold text-green-600">{activeSalmoneras}</div>
          <div className="flex items-center gap-2 mt-1">
            <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 text-xs">
              {totalSalmoneras > 0 ? Math.round((activeSalmoneras / totalSalmoneras) * 100) : 0}%
            </Badge>
            <span className="text-xs text-gray-500">del total</span>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm rounded-xl border-gray-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">Sitios Totales</CardTitle>
            <MapPin className="w-4 h-4 text-purple-600" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-2xl font-bold text-purple-600">{totalSitios}</div>
          <p className="text-xs text-gray-500 mt-1">Sitios registrados</p>
        </CardContent>
      </Card>

      <Card className="bg-white shadow-sm rounded-xl border-gray-200">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-gray-600">Promedio Sitios</CardTitle>
            <Users className="w-4 h-4 text-orange-600" />
          </div>
        </CardHeader>
        <CardContent className="pt-2">
          <div className="text-2xl font-bold text-orange-600">
            {activeSalmoneras > 0 ? Math.round(totalSitios / activeSalmoneras) : 0}
          </div>
          <p className="text-xs text-gray-500 mt-1">Sitios por salmonera</p>
        </CardContent>
      </Card>
    </div>
  );
};
