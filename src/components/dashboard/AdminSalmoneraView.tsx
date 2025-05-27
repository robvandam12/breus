
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building, Users, MapPin, FileText, TrendingUp, AlertTriangle } from "lucide-react";

export const AdminSalmoneraView = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Sitios Activos</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Building className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Contratistas</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Operaciones</p>
                <p className="text-2xl font-bold">45</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Alertas</p>
                <p className="text-2xl font-bold text-red-600">3</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Resumen de Actividades
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Operaciones Completadas</span>
                <span className="font-semibold">32</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">HPTs Firmados</span>
                <span className="font-semibold">28</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Inmersiones Registradas</span>
                <span className="font-semibold">156</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <MapPin className="w-4 h-4 mr-2" />
              Gestionar Sitios
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Building className="w-4 h-4 mr-2" />
              Administrar Contratistas
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Gestión de Usuarios
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Ver Reportes
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
