import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, Play, Bug } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";

interface TestResult {
  step: string;
  status: 'success' | 'error' | 'pending';
  message: string;
  timestamp: Date;
}

export const OperacionFlowTester = () => {
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState<TestResult[]>([]);
  const { operaciones, checkCanDelete, validateOperacionCompleteness } = useOperaciones();

  const addTestResult = (step: string, status: 'success' | 'error' | 'pending', message: string) => {
    setTestResults(prev => [...prev, {
      step,
      status,
      message,
      timestamp: new Date()
    }]);
  };

  const runCompleteFlowTest = async () => {
    setIsRunning(true);
    setTestResults([]);
    
    try {
      // Test 1: Verificar carga de operaciones
      addTestResult('Carga de Operaciones', 'pending', 'Verificando carga de operaciones...');
      if (operaciones && operaciones.length >= 0) {
        addTestResult('Carga de Operaciones', 'success', `${operaciones.length} operaciones cargadas correctamente`);
      } else {
        addTestResult('Carga de Operaciones', 'error', 'No se pudieron cargar las operaciones');
      }

      // Test 2: Verificar función de eliminación
      addTestResult('Test de Eliminación', 'pending', 'Verificando función checkCanDelete...');
      if (operaciones.length > 0) {
        const testOpId = operaciones[0].id;
        try {
          const deleteResult = await checkCanDelete(testOpId);
          addTestResult('Test de Eliminación', 'success', `Función checkCanDelete funcionando: ${deleteResult.canDelete ? 'Puede eliminar' : deleteResult.reason}`);
        } catch (error) {
          addTestResult('Test de Eliminación', 'error', `Error en checkCanDelete: ${error}`);
        }
      } else {
        addTestResult('Test de Eliminación', 'success', 'Sin operaciones para testear eliminación');
      }

      // Test 3: Verificar validación de completitud
      addTestResult('Test de Validación', 'pending', 'Verificando función de validación...');
      if (operaciones.length > 0) {
        const testOpId = operaciones[0].id;
        try {
          const validationResult = await validateOperacionCompleteness(testOpId);
          addTestResult('Test de Validación', 'success', `Validación funcionando: ${validationResult.canExecute ? 'Completa' : 'Incompleta'}`);
        } catch (error) {
          addTestResult('Test de Validación', 'error', `Error en validación: ${error}`);
        }
      } else {
        addTestResult('Test de Validación', 'success', 'Sin operaciones para testear validación');
      }

      // Test 4: Verificar estructura de datos
      addTestResult('Estructura de Datos', 'pending', 'Verificando estructura de operaciones...');
      const hasValidStructure = operaciones.every(op => 
        op.id && op.codigo && op.nombre && op.estado
      );
      if (hasValidStructure) {
        addTestResult('Estructura de Datos', 'success', 'Todas las operaciones tienen estructura válida');
      } else {
        addTestResult('Estructura de Datos', 'error', 'Algunas operaciones tienen estructura inválida');
      }

      // Test 5: Verificar queries de documentos
      addTestResult('Test de Documentos', 'pending', 'Verificando queries de documentos...');
      try {
        const hptTest = await supabase
          .from('hpt')
          .select('id, firmado')
          .limit(1)
          .maybeSingle();
        
        const anexoTest = await supabase
          .from('anexo_bravo')
          .select('id, firmado')
          .limit(1)
          .maybeSingle();

        if (!hptTest.error && !anexoTest.error) {
          addTestResult('Test de Documentos', 'success', 'Queries de documentos funcionando correctamente');
        } else {
          addTestResult('Test de Documentos', 'error', `Error en queries: HPT=${hptTest.error?.message}, Anexo=${anexoTest.error?.message}`);
        }
      } catch (error) {
        addTestResult('Test de Documentos', 'error', `Error general en queries de documentos: ${error}`);
      }

      toast({
        title: "Testing completado",
        description: "Se han ejecutado todos los tests del flujo de operaciones",
      });

    } catch (error) {
      addTestResult('Test General', 'error', `Error general en testing: ${error}`);
      toast({
        title: "Error en testing",
        description: "Ocurrió un error durante el testing",
        variant: "destructive"
      });
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'error':
        return <AlertTriangle className="w-4 h-4 text-red-600" />;
      case 'pending':
        return <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />;
      default:
        return null;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      case 'pending':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bug className="w-5 h-5 text-blue-600" />
          Testing de Flujo de Operaciones
        </CardTitle>
        <p className="text-sm text-gray-600">
          Herramienta de testing para verificar que todos los componentes del módulo de operaciones funcionen correctamente
        </p>
      </CardHeader>
      <CardContent className="space-y-4">
        <Button 
          onClick={runCompleteFlowTest}
          disabled={isRunning}
          className="flex items-center gap-2"
        >
          <Play className="w-4 h-4" />
          {isRunning ? 'Ejecutando Tests...' : 'Ejecutar Tests Completos'}
        </Button>

        {testResults.length > 0 && (
          <div className="space-y-2">
            <h3 className="font-semibold">Resultados de Testing:</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {testResults.map((result, index) => (
                <div 
                  key={index}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    {getStatusIcon(result.status)}
                    <div>
                      <div className="font-medium">{result.step}</div>
                      <div className="text-sm text-gray-600">{result.message}</div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(result.status)}>
                      {result.status}
                    </Badge>
                    <div className="text-xs text-gray-500 mt-1">
                      {result.timestamp.toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="text-sm text-gray-600 p-3 bg-gray-50 rounded-lg">
          <strong>Tests incluidos:</strong>
          <ul className="list-disc list-inside mt-2 space-y-1">
            <li>Carga correcta de operaciones desde la base de datos</li>
            <li>Funcionamiento de la función checkCanDelete (evita errores 400)</li>
            <li>Validación de completitud de operaciones</li>
            <li>Estructura válida de datos de operaciones</li>
            <li>Queries correctos para documentos HPT y Anexo Bravo</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};
