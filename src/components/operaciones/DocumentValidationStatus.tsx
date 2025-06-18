
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CheckCircle, XCircle, Clock, FileText, Shield, ExternalLink } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface DocumentValidationStatusProps {
  operacionId: string;
  onDocumentCreate?: (type: 'hpt' | 'anexo') => void;
}

export const DocumentValidationStatus = ({ 
  operacionId, 
  onDocumentCreate 
}: DocumentValidationStatusProps) => {
  const { data: documentStatus, isLoading, refetch } = useQuery({
    queryKey: ['document-validation', operacionId],
    queryFn: async () => {
      console.log('Checking document validation status for:', operacionId);
      
      const [hptResult, anexoResult] = await Promise.all([
        supabase
          .from('hpt')
          .select('id, codigo, estado, firmado, created_at')
          .eq('operacion_id', operacionId)
          .maybeSingle(),
        supabase
          .from('anexo_bravo')
          .select('id, codigo, estado, firmado, created_at')
          .eq('operacion_id', operacionId)
          .maybeSingle()
      ]);

      console.log('Document validation results:', { hptResult, anexoResult });

      return {
        hpt: hptResult.data,
        anexoBravo: anexoResult.data,
        hptValid: hptResult.data?.firmado && hptResult.data?.estado === 'firmado',
        anexoBravoValid: anexoResult.data?.firmado && anexoResult.data?.estado === 'firmado',
        allDocumentsValid: hptResult.data?.firmado && hptResult.data?.estado === 'firmado' &&
                          anexoResult.data?.firmado && anexoResult.data?.estado === 'firmado'
      };
    },
    refetchInterval: 3000, // Refrescar cada 3 segundos
    enabled: !!operacionId
  });

  const getStatusIcon = (isValid: boolean, exists: boolean) => {
    if (isValid) return <CheckCircle className="w-5 h-5 text-green-600" />;
    if (exists) return <Clock className="w-5 h-5 text-yellow-600" />;
    return <XCircle className="w-5 h-5 text-red-600" />;
  };

  const getStatusBadge = (isValid: boolean, exists: boolean) => {
    if (isValid) return <Badge className="bg-green-100 text-green-800">Firmado</Badge>;
    if (exists) return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
    return <Badge className="bg-red-100 text-red-800">No creado</Badge>;
  };

  if (isLoading) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-sm text-gray-600">Verificando documentos...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="w-5 h-5 text-blue-600" />
          Estado de Documentos
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* HPT Status */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <FileText className="w-4 h-4 text-blue-600" />
            <div>
              <p className="font-medium">HPT (Herramientas y Procedimientos)</p>
              {documentStatus?.hpt && (
                <p className="text-sm text-gray-600">
                  Código: {documentStatus.hpt.codigo}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(documentStatus?.hptValid || false, !!documentStatus?.hpt)}
            {getStatusBadge(documentStatus?.hptValid || false, !!documentStatus?.hpt)}
            {!documentStatus?.hpt && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDocumentCreate?.('hpt')}
                className="ml-2"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Crear
              </Button>
            )}
          </div>
        </div>

        {/* Anexo Bravo Status */}
        <div className="flex items-center justify-between p-3 border rounded-lg">
          <div className="flex items-center gap-3">
            <Shield className="w-4 h-4 text-green-600" />
            <div>
              <p className="font-medium">Anexo Bravo</p>
              {documentStatus?.anexoBravo && (
                <p className="text-sm text-gray-600">
                  Código: {documentStatus.anexoBravo.codigo}
                </p>
              )}
            </div>
          </div>
          <div className="flex items-center gap-2">
            {getStatusIcon(documentStatus?.anexoBravoValid || false, !!documentStatus?.anexoBravo)}
            {getStatusBadge(documentStatus?.anexoBravoValid || false, !!documentStatus?.anexoBravo)}
            {!documentStatus?.anexoBravo && (
              <Button
                size="sm"
                variant="outline"
                onClick={() => onDocumentCreate?.('anexo')}
                className="ml-2"
              >
                <ExternalLink className="w-3 h-3 mr-1" />
                Crear
              </Button>
            )}
          </div>
        </div>

        {/* Overall Status */}
        <div className={`p-3 rounded-lg border-2 ${
          documentStatus?.allDocumentsValid 
            ? 'border-green-200 bg-green-50' 
            : 'border-yellow-200 bg-yellow-50'
        }`}>
          <div className="flex items-center gap-2">
            {documentStatus?.allDocumentsValid ? (
              <CheckCircle className="w-5 h-5 text-green-600" />
            ) : (
              <Clock className="w-5 h-5 text-yellow-600" />
            )}
            <p className={`font-medium ${
              documentStatus?.allDocumentsValid ? 'text-green-800' : 'text-yellow-800'
            }`}>
              {documentStatus?.allDocumentsValid 
                ? '¡Todos los documentos están listos!' 
                : 'Documentos pendientes'
              }
            </p>
          </div>
          <p className={`text-sm mt-1 ${
            documentStatus?.allDocumentsValid ? 'text-green-700' : 'text-yellow-700'
          }`}>
            {documentStatus?.allDocumentsValid 
              ? 'La operación puede proceder a inmersiones.'
              : 'Complete y firme todos los documentos requeridos.'
            }
          </p>
        </div>

        {/* Refresh Button */}
        <div className="flex justify-center">
          <Button
            variant="outline"
            size="sm"
            onClick={() => refetch()}
          >
            Actualizar Estado
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
