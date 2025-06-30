
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { FileText, Users, Plus, TrendingUp, CheckCircle } from 'lucide-react';
import { SupervisorBitacoraSelector } from '@/components/bitacoras/SupervisorBitacoraSelector';
import { CreateBitacoraBuzoFormCompleteWithInmersion } from '@/components/bitacoras/CreateBitacoraBuzoFormCompleteWithInmersion';
import { BitacorasBuzoContent } from '@/components/bitacoras/BitacorasBuzoContent';
import { useBitacorasBuzo } from '@/hooks/useBitacorasBuzo';

export default function BitacorasBuzo() {
  const { createBitacoraBuzoFromSupervisor } = useBitacorasBuzo();
  const [activeTab, setActiveTab] = useState('list');
  const [showSupervisorSelector, setShowSupervisorSelector] = useState(false);
  const [showIndependentForm, setShowIndependentForm] = useState(false);

  const handleSupervisorBitacoraSelect = async (bitacoraSupervisorId: string) => {
    // Aquí asumiríamos que tenemos el ID del usuario actual
    const userId = 'current-user-id'; // Esto vendría del contexto de auth
    
    try {
      await createBitacoraBuzoFromSupervisor.mutateAsync({
        bitacoraSupervisorId,
        usuarioId: userId
      });
      setShowSupervisorSelector(false);
      setActiveTab('list');
    } catch (error) {
      console.error('Error creating bitacora from supervisor:', error);
    }
  };

  const handleIndependentFormComplete = () => {
    setShowIndependentForm(false);
    setActiveTab('list');
  };

  if (showSupervisorSelector) {
    return (
      <MainLayout
        title="Crear Bitácora de Buzo"
        subtitle="Basada en bitácora de supervisor"
        icon={FileText}
      >
        <div className="max-w-4xl mx-auto">
          <SupervisorBitacoraSelector
            onSelect={handleSupervisorBitacoraSelect}
            onCancel={() => setShowSupervisorSelector(false)}
          />
        </div>
      </MainLayout>
    );
  }

  if (showIndependentForm) {
    return (
      <MainLayout
        title="Crear Bitácora de Buzo"
        subtitle="Bitácora independiente"
        icon={FileText}
      >
        <div className="max-w-4xl mx-auto">
          <CreateBitacoraBuzoFormCompleteWithInmersion
            onSuccess={handleIndependentFormComplete}
            onCancel={() => setShowIndependentForm(false)}
          />
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Bitácoras de Buzo"
      subtitle="Gestión de bitácoras personales de buceo"
      icon={FileText}
    >
      <div className="space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <div className="flex items-center justify-between">
            <TabsList className="grid w-auto grid-cols-2">
              <TabsTrigger value="list" className="flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Mis Bitácoras
              </TabsTrigger>
              <TabsTrigger value="create" className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Nueva Bitácora
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="list" className="space-y-6">
            <BitacorasBuzoContent />
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Opción recomendada: Desde Supervisor */}
              <Card className="border-green-200 bg-green-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-green-800">
                    <CheckCircle className="w-5 h-5" />
                    Desde Supervisor (Recomendado)
                  </CardTitle>
                  <Badge className="w-fit bg-green-100 text-green-800">Más Fácil</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-green-700">
                    Cree su bitácora personal basándose en una bitácora de supervisor ya firmada. 
                    Los datos se heredan automáticamente.
                  </p>
                  <div className="space-y-2 text-xs text-green-600">
                    <div className="flex items-center gap-2">
                      <TrendingUp className="w-3 h-3" />
                      <span>Datos pre-llenados automáticamente</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      <span>Vinculado a la cuadrilla de buceo</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Validaciones automáticas</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setShowSupervisorSelector(true)}
                    className="w-full bg-green-600 hover:bg-green-700"
                  >
                    Seleccionar Bitácora de Supervisor
                  </Button>
                </CardContent>
              </Card>

              {/* Opción alternativa: Independiente */}
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-blue-800">
                    <FileText className="w-5 h-5" />
                    Bitácora Independiente
                  </CardTitle>
                  <Badge variant="outline" className="w-fit">Avanzado</Badge>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-blue-700">
                    Cree una bitácora completamente nueva. Debe llenar todos los datos manualmente 
                    y seleccionar la inmersión correspondiente.
                  </p>
                  <div className="space-y-2 text-xs text-blue-600">
                    <div className="flex items-center gap-2">
                      <FileText className="w-3 h-3" />
                      <span>Formulario completo a llenar</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Users className="w-3 h-3" />
                      <span>Selección manual de inmersión</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <CheckCircle className="w-3 h-3" />
                      <span>Control total sobre los datos</span>
                    </div>
                  </div>
                  <Button 
                    onClick={() => setShowIndependentForm(true)}
                    variant="outline"
                    className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                  >
                    Crear Bitácora Independiente
                  </Button>
                </CardContent>
              </Card>
            </div>

            {/* Información adicional */}
            <Card className="border-amber-200 bg-amber-50">
              <CardContent className="p-4">
                <div className="flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-amber-500 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-white text-xs font-bold">!</span>
                  </div>
                  <div className="space-y-1">
                    <h4 className="font-medium text-amber-800">¿Cuál opción elegir?</h4>
                    <p className="text-sm text-amber-700">
                      <strong>Use "Desde Supervisor"</strong> si participó en una inmersión donde ya existe una bitácora de supervisor firmada.
                      <br />
                      <strong>Use "Independiente"</strong> solo para casos especiales donde no existe bitácora de supervisor previa.
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
