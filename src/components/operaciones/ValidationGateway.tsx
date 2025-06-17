
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  CheckCircle2, 
  AlertTriangle, 
  Clock, 
  Shield, 
  FileText, 
  Users,
  Eye,
  RefreshCw
} from "lucide-react";

interface ValidationItem {
  id: string;
  category: 'documentos' | 'personal' | 'equipos' | 'seguridad';
  title: string;
  description: string;
  status: 'valid' | 'warning' | 'error' | 'pending';
  required: boolean;
  details?: string;
}

interface ValidationGatewayProps {
  operacionId: string;
  onValidationComplete?: () => void;
}

export const ValidationGateway = ({ operacionId, onValidationComplete }: ValidationGatewayProps) => {
  const [isValidating, setIsValidating] = useState(false);
  const [lastValidation, setLastValidation] = useState<Date | null>(null);

  // Mock validation items - en producción vendría del backend
  const validationItems: ValidationItem[] = [
    {
      id: 'hpt-complete',
      category: 'documentos',
      title: 'HPT Completado',
      description: 'Herramientas y Procedimientos de Trabajo documentados',
      status: 'valid',
      required: true
    },
    {
      id: 'anexo-bravo',
      category: 'seguridad',
      title: 'Anexo Bravo',
      description: 'Análisis de Riesgo y Seguridad completado',
      status: 'valid',
      required: true
    },
    {
      id: 'personal-asignado',
      category: 'personal',
      title: 'Personal Asignado',
      description: 'Supervisor y buzos certificados asignados',
      status: 'warning',
      required: true,
      details: 'Falta certificación de buzo secundario'
    },
    {
      id: 'equipo-verificado',
      category: 'equipos',
      title: 'Equipos Verificados',
      description: 'Equipos de buceo y superficie verificados',
      status: 'pending',
      required: true
    },
    {
      id: 'permisos-vigentes',
      category: 'documentos',
      title: 'Permisos Vigentes',
      description: 'Permisos y autorizaciones vigentes',
      status: 'error',
      required: true,
      details: 'Permiso ambiental vence en 2 días'
    }
  ];

  const getCategoryIcon = (category: ValidationItem['category']) => {
    switch (category) {
      case 'documentos':
        return <FileText className="w-4 h-4" />;
      case 'personal':
        return <Users className="w-4 h-4" />;
      case 'equipos':
        return <Shield className="w-4 h-4" />;
      case 'seguridad':
        return <Shield className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusIcon = (status: ValidationItem['status']) => {
    switch (status) {
      case 'valid':
        return <CheckCircle2 className="w-4 h-4 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <Clock className="w-4 h-4 text-gray-600" />;
      default:
        return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getStatusBadge = (status: ValidationItem['status']) => {
    switch (status) {
      case 'valid':
        return <Badge className="bg-green-100 text-green-800">Válido</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-100 text-yellow-800">Advertencia</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      case 'pending':
        return <Badge className="bg-gray-100 text-gray-800">Pendiente</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">Desconocido</Badge>;
    }
  };

  const handleValidation = async () => {
    setIsValidating(true);
    // Simular validación
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsValidating(false);
    setLastValidation(new Date());
  };

  const validItems = validationItems.filter(item => item.status === 'valid').length;
  const totalItems = validationItems.length;
  const requiredItems = validationItems.filter(item => item.required);
  const validRequiredItems = requiredItems.filter(item => item.status === 'valid').length;
  const hasErrors = validationItems.some(item => item.status === 'error' && item.required);
  const canProceed = validRequiredItems === requiredItems.length && !hasErrors;

  const categories = Array.from(new Set(validationItems.map(item => item.category)));

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Portal de Validaciones
          </div>
          <div className="flex items-center gap-2">
            <Badge variant={canProceed ? "default" : "destructive"}>
              {validItems}/{totalItems} válidos
            </Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={handleValidation}
              disabled={isValidating}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${isValidating ? 'animate-spin' : ''}`} />
              {isValidating ? 'Validando...' : 'Revalidar'}
            </Button>
          </div>
        </CardTitle>
        {lastValidation && (
          <p className="text-sm text-gray-600">
            Última validación: {lastValidation.toLocaleString('es-CL')}
          </p>
        )}
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status General */}
        {!canProceed && (
          <Alert variant={hasErrors ? "destructive" : "default"}>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              {hasErrors 
                ? "Hay errores críticos que deben resolverse antes de proceder."
                : "Hay validaciones pendientes que deben completarse."
              }
            </AlertDescription>
          </Alert>
        )}

        {canProceed && (
          <Alert>
            <CheckCircle2 className="h-4 w-4" />
            <AlertDescription>
              Todas las validaciones requeridas han sido completadas. La operación puede proceder.
            </AlertDescription>
          </Alert>
        )}

        {/* Validaciones por Categoría */}
        {categories.map(category => {
          const categoryItems = validationItems.filter(item => item.category === category);
          
          return (
            <div key={category} className="space-y-3">
              <h4 className="font-medium text-lg capitalize flex items-center gap-2">
                {getCategoryIcon(category)}
                {category}
              </h4>
              
              <div className="space-y-2">
                {categoryItems.map(item => (
                  <div key={item.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      {getStatusIcon(item.status)}
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <p className="font-medium">{item.title}</p>
                          {item.required && (
                            <Badge variant="outline" className="text-xs">Requerido</Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">{item.description}</p>
                        {item.details && (
                          <p className="text-xs text-amber-600 mt-1">{item.details}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      {getStatusBadge(item.status)}
                      <Button variant="ghost" size="sm">
                        <Eye className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          );
        })}

        {/* Acciones */}
        <div className="flex justify-between pt-4 border-t">
          <Button variant="outline">
            Ver Detalles Completos
          </Button>
          
          <Button 
            onClick={onValidationComplete}
            disabled={!canProceed}
            className="flex items-center gap-2"
          >
            <CheckCircle2 className="w-4 h-4" />
            Aprobar y Continuar
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
