
import { MockupToggle } from "@/components/mockup/MockupToggle";
import { OperacionCompletaViewer } from "@/components/mockup/OperacionCompletaViewer";
import { useMockupData } from "@/hooks/useMockupData";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Users, Waves, BookOpen } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export const OperacionesMockupView = () => {
  const { 
    useMockup, 
    isLoading, 
    operaciones, 
    equipos, 
    inmersiones, 
    bitacorasSupervisor, 
    bitacorasBuzo,
    hpt,
    anexoBravo
  } = useMockupData();

  if (isLoading) {
    return <div className="p-6">Cargando datos...</div>;
  }

  const stats = {
    operaciones: operaciones.length,
    equipos: equipos.length,
    inmersiones: inmersiones.length,
    bitacoras: bitacorasSupervisor.length + bitacorasBuzo.length,
    hpt: hpt.length,
    anexoBravo: anexoBravo.length
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Datos de la Aplicación</h1>
          <p className="text-gray-600">
            {useMockup ? 'Visualizando datos de prueba' : 'Visualizando datos reales'}
          </p>
        </div>
      </div>

      <MockupToggle />

      {useMockup ? (
        <>
          {/* Stats Cards */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 mx-auto text-blue-600 mb-2" />
                <p className="text-2xl font-bold">{stats.operaciones}</p>
                <p className="text-sm text-gray-600">Operaciones</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="w-8 h-8 mx-auto text-purple-600 mb-2" />
                <p className="text-2xl font-bold">{stats.equipos}</p>
                <p className="text-sm text-gray-600">Equipos</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <Waves className="w-8 h-8 mx-auto text-teal-600 mb-2" />
                <p className="text-2xl font-bold">{stats.inmersiones}</p>
                <p className="text-sm text-gray-600">Inmersiones</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="w-8 h-8 mx-auto text-orange-600 mb-2" />
                <p className="text-2xl font-bold">{stats.bitacoras}</p>
                <p className="text-sm text-gray-600">Bitácoras</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 mx-auto text-green-600 mb-2" />
                <p className="text-2xl font-bold">{stats.hpt}</p>
                <p className="text-sm text-gray-600">HPT</p>
              </CardContent>
            </Card>
            
            <Card>
              <CardContent className="p-4 text-center">
                <FileText className="w-8 h-8 mx-auto text-red-600 mb-2" />
                <p className="text-2xl font-bold">{stats.anexoBravo}</p>
                <p className="text-sm text-gray-600">Anexo B</p>
              </CardContent>
            </Card>
          </div>

          {/* Visualizador Completo */}
          <OperacionCompletaViewer />
        </>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>Modo de Datos Reales</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">
              Actualmente estás viendo datos reales de Supabase. Activa el modo mockup para ver datos de prueba.
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
