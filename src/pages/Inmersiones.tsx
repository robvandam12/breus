
import { useState } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { Plus, Anchor, AlertCircle, Info } from 'lucide-react';
import { useInmersionesContextual } from '@/hooks/useInmersionesContextual';
import { useContextualOperations } from '@/hooks/useContextualOperations';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

export default function Inmersiones() {
  const [showCreateForm, setShowCreateForm] = useState(false);
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

  const getContextualActions = () => {
    const actions = [];

    if (allowsDirectOperations()) {
      actions.push({
        title: 'Crear Inmersión Directa',
        description: 'Crear inmersión sin operación planificada',
        variant: 'default' as const,
        icon: Plus,
        onClick: () => setShowCreateForm(true),
        enabled: true
      });
    }

    if (requiresPlanning()) {
      actions.push({
        title: 'Crear desde Operación',
        description: 'Crear inmersión asociada a operación planificada',
        variant: 'outline' as const,
        icon: Anchor,
        onClick: () => {/* TODO: Implementar */},
        enabled: true
      });
    }

    return actions;
  };

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

        {/* Acciones contextuales */}
        <div className="flex flex-wrap gap-3">
          {getContextualActions().map((action, index) => (
            <Button
              key={index}
              variant={action.variant}
              onClick={action.onClick}
              disabled={!action.enabled}
              className="flex items-center gap-2 ios-button"
            >
              <action.icon className="w-4 h-4" />
              <div className="text-left">
                <div className="font-medium">{action.title}</div>
                <div className="text-xs opacity-75">{action.description}</div>
              </div>
            </Button>
          ))}
        </div>

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

        {/* Lista de inmersiones */}
        <div className="bg-white rounded-2xl border border-gray-200/50 p-6 ios-card">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">Lista de Inmersiones</h3>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {inmersiones?.length || 0} inmersiones
            </Badge>
          </div>

          {inmersiones && inmersiones.length > 0 ? (
            <div className="space-y-4">
              {inmersiones.map((inmersion: any) => (
                <div key={inmersion.id} className="p-4 border border-gray-200 rounded-xl hover:bg-gray-50/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium text-gray-900">{inmersion.fecha_inmersion}</h4>
                      <p className="text-sm text-gray-600">Profundidad: {inmersion.profundidad_metros}m</p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant={inmersion.context_type === 'direct' ? 'default' : 'secondary'}
                        className="text-xs"
                      >
                        {inmersion.context_type === 'direct' ? 'Directa' : 'Planificada'}
                      </Badge>
                      {inmersion.requires_validation && (
                        <Badge variant="outline" className="text-xs">
                          {inmersion.validation_status}
                        </Badge>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <Anchor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No hay inmersiones</h3>
              <p className="text-gray-600 mb-6">
                {allowsDirectOperations() 
                  ? 'Crea tu primera inmersión para comenzar'
                  : 'Las inmersiones deben estar asociadas a operaciones planificadas'
                }
              </p>
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
}
