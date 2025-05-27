
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, Anchor, FileText, Clock, Shield, Settings } from "lucide-react";

export const AdminServicioView = () => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <p className="text-sm text-gray-600">Equipos de Buceo</p>
                <p className="text-2xl font-bold">6</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Anchor className="w-5 h-5 text-green-600" />
              <div>
                <p className="text-sm text-gray-600">Inmersiones Activas</p>
                <p className="text-2xl font-bold">12</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <FileText className="w-5 h-5 text-purple-600" />
              <div>
                <p className="text-sm text-gray-600">Documentos Pendientes</p>
                <p className="text-2xl font-bold">8</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-orange-600" />
              <div>
                <p className="text-sm text-gray-600">Horas de Buceo</p>
                <p className="text-2xl font-bold">234</p>
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
              Control de Operaciones
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm">Operaciones Asignadas</span>
                <span className="font-semibold">15</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Bitácoras Firmadas</span>
                <span className="font-semibold">42</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm">Equipos Disponibles</span>
                <span className="font-semibold text-green-600">6</span>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Acciones de Servicio</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Gestionar Equipos
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Anchor className="w-4 h-4 mr-2" />
              Planificar Inmersiones
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Revisar Bitácoras
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Settings className="w-4 h-4 mr-2" />
              Configurar Equipos
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
