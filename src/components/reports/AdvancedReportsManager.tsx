
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Plus, BarChart3, FileText, Download, Play, Clock, CheckCircle } from "lucide-react";
import { useAdvancedReports } from "@/hooks/useAdvancedReports";
import type { ReportTemplate, GeneratedReport } from "@/hooks/useAdvancedReports";

export const AdvancedReportsManager = () => {
  const {
    reportTemplates,
    generatedReports,
    isLoadingTemplates,
    isLoadingReports,
    canAccessReports,
    generateReport,
    exportReport
  } = useAdvancedReports();

  const [selectedTemplate, setSelectedTemplate] = useState<ReportTemplate | null>(null);

  if (!canAccessReports) {
    return (
      <Card>
        <CardContent className="p-6">
          <div className="text-center">
            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Módulo de Reportes Avanzados
            </h3>
            <p className="text-gray-600">
              Este módulo no está habilitado para tu empresa.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Contacta al administrador para activar este módulo.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const getTipoReporteBadge = (tipo: string) => {
    switch (tipo) {
      case 'operacional':
        return <Badge className="bg-blue-100 text-blue-800">Operacional</Badge>;
      case 'seguridad':
        return <Badge className="bg-red-100 text-red-800">Seguridad</Badge>;
      case 'eficiencia':
        return <Badge className="bg-green-100 text-green-800">Eficiencia</Badge>;
      case 'personalizado':
        return <Badge className="bg-purple-100 text-purple-800">Personalizado</Badge>;
      default:
        return <Badge>General</Badge>;
    }
  };

  const getEstadoReporteBadge = (estado: string) => {
    switch (estado) {
      case 'generando':
        return <Badge className="bg-yellow-100 text-yellow-800"><Clock className="w-3 h-3 mr-1" />Generando</Badge>;
      case 'completado':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Completado</Badge>;
      case 'error':
        return <Badge className="bg-red-100 text-red-800">Error</Badge>;
      default:
        return <Badge>Desconocido</Badge>;
    }
  };

  const handleGenerateReport = async (templateId: string) => {
    try {
      await generateReport({
        templateId,
        parametros: {
          fecha_inicio: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
          fecha_fin: new Date().toISOString()
        }
      });
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Reportes Avanzados</h2>
          <p className="text-gray-600">Sistema de generación y gestión de reportes especializados</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Nueva Plantilla
        </Button>
      </div>

      <Tabs defaultValue="templates" className="space-y-6">
        <TabsList>
          <TabsTrigger value="templates">Plantillas</TabsTrigger>
          <TabsTrigger value="generated">Reportes Generados</TabsTrigger>
        </TabsList>

        <TabsContent value="templates" className="space-y-6">
          {/* Estadísticas de Plantillas */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <FileText className="h-8 w-8 text-blue-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Total Plantillas</p>
                    <p className="text-2xl font-bold text-gray-900">{reportTemplates.length}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <BarChart3 className="h-8 w-8 text-green-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Operacionales</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportTemplates.filter(t => t.tipo === 'operacional').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <Clock className="h-8 w-8 text-red-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Seguridad</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportTemplates.filter(t => t.tipo === 'seguridad').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center">
                  <CheckCircle className="h-8 w-8 text-purple-600" />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-600">Personalizados</p>
                    <p className="text-2xl font-bold text-gray-900">
                      {reportTemplates.filter(t => t.tipo === 'personalizado').length}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Lista de Plantillas */}
          <Card>
            <CardHeader>
              <CardTitle>Plantillas Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingTemplates ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : reportTemplates.length === 0 ? (
                <div className="text-center py-8">
                  <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay plantillas de reportes disponibles</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {reportTemplates.map((template) => (
                    <Card key={template.id} className="hover:shadow-md transition-shadow">
                      <CardContent className="p-4">
                        <div className="flex justify-between items-start mb-3">
                          <h3 className="font-medium text-gray-900">{template.nombre}</h3>
                          {getTipoReporteBadge(template.tipo)}
                        </div>
                        <p className="text-sm text-gray-600 mb-4">{template.descripcion}</p>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleGenerateReport(template.id)}
                          >
                            <Play className="w-4 h-4 mr-1" />
                            Generar
                          </Button>
                          <Button size="sm" variant="outline">Configure</Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="generated" className="space-y-6">
          {/* Lista de Reportes Generados */}
          <Card>
            <CardHeader>
              <CardTitle>Reportes Generados</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoadingReports ? (
                <div className="animate-pulse space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              ) : generatedReports.length === 0 ? (
                <div className="text-center py-8">
                  <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                  <p className="text-gray-500">No hay reportes generados</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {generatedReports.map((report) => (
                    <div
                      key={report.id}
                      className="border rounded-lg p-4 hover:shadow-md transition-shadow"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-medium text-gray-900">{report.nombre}</h3>
                          <p className="text-sm text-gray-600 mt-1">
                            Generado: {new Date(report.fecha_generacion).toLocaleDateString()}
                          </p>
                          {report.resultados && (
                            <div className="text-sm text-gray-600 mt-2">
                              <span className="font-medium">Resultados:</span>
                              <span className="ml-2">
                                {Object.entries(report.resultados).map(([key, value]) => (
                                  <span key={key} className="mr-3">
                                    {key}: {value}
                                  </span>
                                ))}
                              </span>
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-2 items-end">
                          {getEstadoReporteBadge(report.estado)}
                          {report.estado === 'completado' && (
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => exportReport(report.id, 'pdf')}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                PDF
                              </Button>
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => exportReport(report.id, 'excel')}
                              >
                                <Download className="w-4 h-4 mr-1" />
                                Excel
                              </Button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
