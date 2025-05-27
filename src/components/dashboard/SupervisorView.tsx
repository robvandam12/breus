
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shield, FileText, Users, Clock, CheckCircle, AlertTriangle } from "lucide-react";

export const SupervisorView = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">HPTs Pendientes</p>
                <p className="text-2xl font-bold">5</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Buzos a Cargo</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Inmersiones Supervisadas</p>
                <p className="text-2xl font-bold">23</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5 text-red-600" />
              <div>
                <p className="text-sm text-gray-600">Alertas de Seguridad</p>
                <p className="text-2xl font-bold text-red-600">2</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5" />
              Supervisión Activa
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Operaciones Supervisadas</span>
                <span className="font-semibold">12</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Bitácoras Firmadas</span>
                <span className="font-semibold">18</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Horas de Supervisión</span>
                <span className="font-semibold">156</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tareas de Supervisión</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Crear HPT
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Shield className="w-4 h-4 mr-2" />
              Firmar Bitácoras
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Gestionar Equipos
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Clock className="w-4 h-4 mr-2" />
              Planificar Inmersiones
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
