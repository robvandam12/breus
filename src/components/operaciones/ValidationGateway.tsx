
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { CheckCircle, Clock, AlertCircle, FileText, Shield, Users } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

interface ValidationGatewayProps {
  operacionId: string;
  onValidationComplete: () => void;
}

export const ValidationGateway = ({ 
  operacionId, 
  onValidationComplete 
}: ValidationGatewayProps) => {
  const [isValidating, setIsValidating] = useState(false);

  // Obtener estado de la operación
  const { data: operacion, refetch } = useQuery({
    queryKey: ['operacion-validation', operacionId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('operacion')
        .select(`
          *,
          sitios:sitio_id(nombre),
          equipos_buceo:equipo_buceo_id(nombre),
          usuario_supervisor:supervisor_asignado_id(nombre, apellido)
        `)
        .eq('id', operacionId)
        .single();

      if (error) throw error;
      return data;
    }
  });

  // Verificar documentos
  const { data: documentStatus } = useQuery({
    queryKey: ['operation-documents-validation', operacionId],
    queryFn: async () => {
      try {
        const [hptResult, anexoResult] = await Promise.all([
          supabase.from('hpt').select('id, firmado').eq('operacion_id', operacionId).limit(1),
          supabase.from('anexo_bravo').select('id, firmado').eq('operacion_id', operacionId).limit(1)
        ]);

        const hptExists = hptResult.data && hptResult.data.length > 0;
        const hptSigned = hptExists && hptResult.data[0]?.firmado;
        const anexoExists = anexoResult.data && anexoResult.data.length > 0;
        const anexoSigned = anexoExists && anexoResult.data[0]?.firmado;

        return {
          hptExists,
          hptSigned,
          anexoExists,
          anexoSigned
        };
      } catch (error) {
        console.error('Error checking documents:', error);
        return {
          hptExists: false,
          hptSigned: false,
          anexoExists: false,
          anexoSigned: false
        };
      }
    },
    refetchInterval: 3000
  });

  const validationItems = [
    {
      id: 'sitio',
      title: 'Sitio Asignado',
      description: 'Sitio de trabajo seleccionado',
      status: operacion?.sitio_id ? 'completed' : 'pending',
      icon: <FileText className="w-5 h-5" />,
      detail: operacion?.sitios?.nombre || 'No asignado'
    },
    {
      id: 'equipo',
      title: 'Equipo de Buceo',
      description: 'Equipo y supervisor asignados',
      status: (operacion?.equipo_buceo_id && operacion?.supervisor_asignado_id) ? 'completed' : 'pending',
      icon: <Users className="w-5 h-5" />,
      detail: operacion?.equipos_buceo?.nombre || 'No asignado'
    },
    {
      id: 'hpt',
      title: 'HPT (Herramientas y Procedimientos)',
      description: 'Documento HPT completado y firmado',
      status: documentStatus?.hptSigned ? 'completed' : documentStatus?.hptExists ? 'warning' : 'pending',
      icon: <Shield className="w-5 h-5" />,
      detail: documentStatus?.hptSigned ? 'Firmado' : documentStatus?.hptExists ? 'Pendiente firma' : 'No creado'
    },
    {
      id: 'anexo',
      title: 'Anexo Bravo',
      description: 'Análisis de seguridad completado y firmado',
      status: documentStatus?.anexoSigned ? 'completed' : documentStatus?.anexoExists ? 'warning' : 'pending',
      icon: <Shield className="w-5 h-5" />,
      detail: documentStatus?.anexoSigned ? 'Firmado' : documentStatus?.anexoExists ? 'Pendiente firma' : 'No creado'
    }
  ];

  const completedItems = validationItems.filter(item => item.status === 'completed').length;
  const progress = (completedItems / validationItems.length) * 100;
  const isReady = completedItems === validationItems.length;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertCircle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Clock className="w-5 h-5 text-gray-400" />;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Pendiente</Badge>;
      default:
        return <Badge variant="outline">Pendiente</Badge>;
    }
  };

  const handleApproveAndContinue = async () => {
    if (!isReady) return;
    
    setIsValidating(true);
    try {
      // Simular validación
      await new Promise(resolve => setTimeout(resolve, 1000));
      onValidationComplete();
    } finally {
      setIsValidating(false);
    }
  };

  const handleCreateDocument = (type: 'hpt' | 'anexo') => {
    const baseUrl = type === 'hpt' ? '/hpt' : '/anexo-bravo';
    const url = `${baseUrl}?operacion=${operacionId}`;
    window.open(url, '_blank');
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <CheckCircle className="w-6 h-6 text-blue-600" />
          Validación de Operación
        </CardTitle>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-600">
              {completedItems} de {validationItems.length} requisitos completados
            </span>
            <span className="text-sm font-medium">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="w-full" />
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        {isReady && (
          <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-green-800 font-medium">
              ✓ ¡Operación lista para ejecutarse! Todos los requisitos están completados.
            </p>
          </div>
        )}

        <div className="space-y-4">
          {validationItems.map((item) => (
            <div key={item.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                {item.icon}
                <div>
                  <h4 className="font-medium">{item.title}</h4>
                  <p className="text-sm text-gray-600">{item.description}</p>
                  <p className="text-sm text-gray-500">{item.detail}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {getStatusIcon(item.status)}
                {getStatusBadge(item.status)}
                {(item.id === 'hpt' && !documentStatus?.hptExists) && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCreateDocument('hpt')}
                  >
                    Crear HPT
                  </Button>
                )}
                {(item.id === 'anexo' && !documentStatus?.anexoExists) && (
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={() => handleCreateDocument('anexo')}
                  >
                    Crear Anexo
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="flex justify-end pt-4">
          <Button 
            onClick={handleApproveAndContinue}
            disabled={!isReady || isValidating}
            className="flex items-center gap-2"
          >
            {isValidating ? (
              <>
                <Clock className="w-4 h-4 animate-spin" />
                Validando...
              </>
            ) : (
              <>
                <CheckCircle className="w-4 h-4" />
                {isReady ? 'Aprobar y Continuar' : 'Completar Requisitos'}
              </>
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
