import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, Anchor, AlertCircle, Info } from 'lucide-react';
import { useInmersionesContextual } from '@/hooks/useInmersionesContextual';
import { useContextualOperations } from '@/hooks/useContextualOperations';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { IndependentImmersionManager } from '@/components/inmersiones/IndependentImmersionManager';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { InmersionesDataTable } from '@/components/inmersiones/InmersionesDataTable';

export default function Inmersiones() {
  const [activeTab, setActiveTab] = useState('all');
  const { 
    inmersiones, 
    isLoading, 
    canCreateDirectImmersion,
    operationalContext 
  } = useInmersionesContextual();
  
  const {
    getWorkflowType,
    requiresPlanning,
    requiresDocuments,
    allowsDirectOperations
  } = useContextualOperations();

  const workflowType = getWorkflowType();

  const getContextInfo = () => {
    if (!operationalContext) return null;

    const contextLabels = {
      planned: 'Planificado',
      direct: 'Operativo Directo',
      mixed: 'Mixto'
    };

    const typeLabels = {
      salmonera: 'Salmonera',
      contratista: 'Contratista'
    };

    return {
      contextType: contextLabels[operationalContext.context_type],
      companyType: typeLabels[operationalContext.company_type],
      requiresPlanning: operationalContext.requires_planning,
      requiresDocuments: operationalContext.requires_documents,
      allowsDirectOperations: operationalContext.allows_direct_operations
    };
  };

  const contextInfo = getContextInfo();

  // Filtrar inmersiones por tipo
  const plannedImmersions = inmersiones?.filter(i => i.operacion_id) || [];
  const independentImmersions = inmersiones?.filter(i => !i.operacion_id || i.is_independent) || [];

  if (isLoading) {
    return (
      <MainLayout title="Inmersiones" subtitle="Gestión de inmersiones" icon={Anchor}>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout 
      title="Inmersiones" 
      subtitle="Gestión contextual de inmersiones" 
      icon={Anchor}
    >
      <div className="space-y-6">
        {/* Información de contexto operativo */}
        {contextInfo && (
          <Card className="border-l-4 border-l-blue-500 bg-blue-50/50">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-lg flex items-center gap-2">
                  <Info className="w-5 h-5 text-blue-600" />
                  Contexto Operativo
                </CardTitle>
                <div className="flex gap-2">
                  <Badge variant="outline" className="bg-white">
                    {contextInfo.companyType}
                  </Badge>
                  <Badge variant="secondary">
                    {contextInfo.contextType}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${contextInfo.requiresPlanning ? 'bg-yellow-500' : 'bg-gray-300'}`} />
                  <span className={contextInfo.requiresPlanning ? 'text-yellow-800' : 'text-gray-600'}>
                    {contextInfo.requiresPlanning ? 'Requiere planificación' : 'Planificación opcional'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${contextInfo.requiresDocuments ? 'bg-orange-500' : 'bg-gray-300'}`} />
                  <span className={contextInfo.requiresDocuments ? 'text-orange-800' : 'text-gray-600'}>
                    {contextInfo.requiresDocuments ? 'Requiere documentos' : 'Documentos opcionales'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${contextInfo.allowsDirectOperations ? 'bg-green-500' : 'bg-red-500'}`} />
                  <span className={contextInfo.allowsDirectOperations ? 'text-green-800' : 'text-red-800'}>
                    {contextInfo.allowsDirectOperations ? 'Permite operación directa' : 'Solo operación planificada'}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Alertas según contexto */}
        {workflowType === 'planned' && !allowsDirectOperations() && (
          <Alert>
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Tu contexto operativo requiere que las inmersiones estén asociadas a operaciones planificadas.
              Contacta a tu salmonera para coordinar las operaciones.
            </AlertDescription>
          </Alert>
        )}

        {workflowType === 'direct' && (
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              Puedes crear inmersiones directamente sin necesidad de planificación previa.
              Asegúrate de coordinar con la salmonera correspondiente.
            </AlertDescription>
          </Alert>
        )}

        {/* Usar el nuevo componente de tabla de inmersiones */}
        <InmersionesDataTable />
      </div>
    </MainLayout>
  );
}
