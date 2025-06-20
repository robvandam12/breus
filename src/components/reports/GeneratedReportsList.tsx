
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Download, 
  Clock, 
  CheckCircle, 
  AlertCircle,
  FileText,
  RefreshCw
} from "lucide-react";
import { GeneratedReport } from "@/hooks/useAdvancedReports";

interface GeneratedReportsListProps {
  reports: GeneratedReport[];
  isLoading: boolean;
  onExport: (reportId: string, format: 'pdf' | 'excel' | 'csv') => void;
}

export const GeneratedReportsList = ({ 
  reports, 
  isLoading, 
  onExport 
}: GeneratedReportsListProps) => {
  const getStatusIcon = (estado: string) => {
    switch (estado) {
      case 'completado':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'generando':
        return <RefreshCw className="w-4 h-4 text-blue-500 animate-spin" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusBadge = (estado: string) => {
    switch (estado) {
      case 'completado':
        return <Badge className="bg-green-100 text-green-800">Completado</Badge>;
      case 'generando':
        return <Badge className="bg-blue-100 text-blue-800">Generando</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge variant="outline">Desconocido</Badge>;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {Array.from({ length: 3 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-48"></div>
                  <div className="h-3 bg-gray-200 rounded w-32"></div>
                </div>
                <div className="h-8 bg-gray-200 rounded w-24"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (reports.length === 0) {
    return (
      <Card>
        <CardContent className="py-12">
          <div className="text-center text-gray-500">
            <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p className="text-lg font-medium">No hay reportes generados</p>
            <p className="text-sm">Genera tu primer reporte usando las plantillas disponibles</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Reportes Generados ({reports.length})</h3>
      </div>
      
      {reports.map((report) => (
        <Card key={report.id}>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-start gap-4">
                <div className="flex items-center gap-2">
                  {getStatusIcon(report.estado)}
                </div>
                
                <div className="space-y-1">
                  <h4 className="font-medium">{report.nombre}</h4>
                  <div className="flex items-center gap-3 text-sm text-gray-500">
                    <span>
                      Generado el {new Date(report.fecha_generacion).toLocaleString()}
                    </span>
                    {getStatusBadge(report.estado)}
                  </div>
                  
                  {report.resultados && (
                    <div className="text-xs text-gray-600 mt-2">
                      <span className="font-medium">Resumen:</span>
                      {Object.entries(report.resultados).map(([key, value]) => (
                        <span key={key} className="ml-2">
                          {key}: {String(value)}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {report.estado === 'completado' && (
                <div className="flex items-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExport(report.id, 'pdf')}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    PDF
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onExport(report.id, 'excel')}
                  >
                    <Download className="w-4 h-4 mr-1" />
                    Excel
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
