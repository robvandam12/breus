
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Anchor, Clock, FileText, Shield, Calendar, Activity, Users, AlertTriangle } from "lucide-react";

export const BuzoView = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Anchor className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Inmersiones Mes</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Horas de Buceo</p>
                <p className="text-2xl font-bold">89</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Bitácoras Creadas</p>
                <p className="text-2xl font-bold">15</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Activity className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Profundidad Máx</p>
                <p className="text-2xl font-bold">35m</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              Próximas Inmersiones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="border-l-4 border-blue-500 pl-4">
                <p className="font-semibold">Mantenimiento Red - Sitio A</p>
                <p className="text-sm text-gray-600">Mañana 08:00 - 12:00</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">Buzo Principal</Badge>
                </div>
              </div>
              <div className="border-l-4 border-green-500 pl-4">
                <p className="font-semibold">Inspección Estructura - Sitio B</p>
                <p className="text-sm text-gray-600">15 Dic 09:00 - 11:00</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="text-xs">Buzo Asistente</Badge>
                </div>
              </div>
              <div className="border-l-4 border-orange-500 pl-4">
                <p className="font-semibold">Limpieza Sensores - Sitio C</p>
                <p className="text-sm text-gray-600">18 Dic 14:00 - 16:00</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="outline" className="bg-orange-100 text-orange-700 text-xs">
                    <AlertTriangle className="w-3 h-3 mr-1" />
                    Buzo Emergencia
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Mis Acciones</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Ver Bitácoras Completas
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Anchor className="w-4 h-4 mr-2" />
              Ver Mis Inmersiones
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Clock className="w-4 h-4 mr-2" />
              Historial de Buceo
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Equipo de Seguridad
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Estado del Equipo
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Emergency Diver Information */}
      <Card className="border-orange-200 bg-orange-50">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-orange-800">
            <AlertTriangle className="w-5 h-5" />
            Información sobre Buzos de Emergencia
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm text-orange-700 space-y-2">
            <p>
              <strong>Buzo de Emergencia:</strong> Un buzo designado para sustituir a otro miembro del equipo 
              cuando sea necesario. Este buzo no realiza inmersión efectiva, por lo que no genera bitácora 
              de buzo individual.
            </p>
            <p>
              <strong>Registro:</strong> El buzo de emergencia se registra en la bitácora de supervisor 
              como parte del equipo de buceo, pero sin datos de inmersión específicos.
            </p>
            <div className="flex items-center gap-2 mt-3">
              <Badge variant="outline" className="bg-orange-100 text-orange-700">
                <AlertTriangle className="w-3 h-3 mr-1" />
                Solo registrado en bitácora de supervisor
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
