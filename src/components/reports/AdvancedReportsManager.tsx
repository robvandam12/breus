
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  BarChart3, 
  Download, 
  Calendar, 
  Clock, 
  TrendingUp, 
  FileText,
  Play,
  RefreshCw,
  Filter,
  Settings2
} from "lucide-react";
import { useAdvancedReports } from "@/hooks/useAdvancedReports";
import { ReportTemplateCard } from "./ReportTemplateCard";
import { GeneratedReportsList } from "./GeneratedReportsList";
import { ReportChartsDashboard } from "./ReportChartsDashboard";
import { ReportFiltersPanel } from "./ReportFiltersPanel";

export const AdvancedReportsManager = () => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [reportFilters, setReportFilters] = useState({
    dateRange: { from: new Date(), to: new Date() },
    tipo: 'todos',
    sitio: 'todos'
  });

  const {
    reportTemplates,
    generatedReports,
    isLoadingTemplates,
    isLoadingReports,
    canAccessReports,
    generateReport,
    isGenerating,
    exportReport,
  } = useAdvancedReports();

  if (!canAccessReports) {
    return (
      <Card>
        <CardContent className="py-8">
          <div className="text-center text-gray-500">
            <BarChart3 className="w-12 h-12 mx-auto mb-4 opacity-50" />
            <p>Módulo de Reportes Avanzados no disponible</p>
            <p className="text-sm">Contacta al administrador para activar este módulo</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleGenerateReport = async () => {
    if (!selectedTemplate) return;
    
    try {
      await generateReport({
        templateId: selectedTemplate,
        parametros: reportFilters
      });
    } catch (error) {
      console.error('Error generating report:', error);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header with actions */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">Reportes Avanzados</h2>
          <p className="text-gray-600">Sistema de análisis y reportes especializados</p>
        </div>
        <div className="flex items-center gap-3">
          <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
            <SelectTrigger className="w-64">
              <SelectValue placeholder="Seleccionar plantilla..." />
            </SelectTrigger>
            <SelectContent>
              {reportTemplates.map((template) => (
                <SelectItem key={template.id} value={template.id}>
                  {template.nombre}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button 
            onClick={handleGenerateReport}
            disabled={!selectedTemplate || isGenerating}
          >
            {isGenerating ? (
              <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
            ) : (
              <Play className="w-4 h-4 mr-2" />
            )}
            Generar Reporte
          </Button>
        </div>
      </div>

      {/* Main content */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="dashboard" className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4" />
            Dashboard
          </TabsTrigger>
          <TabsTrigger value="templates" className="flex items-center gap-2">
            <FileText className="w-4 h-4" />
            Plantillas
          </TabsTrigger>
          <TabsTrigger value="generated" className="flex items-center gap-2">
            <Download className="w-4 h-4" />
            Reportes Generados
          </TabsTrigger>
          <TabsTrigger value="filters" className="flex items-center gap-2">
            <Filter className="w-4 h-4" />
            Filtros
          </TabsTrigger>
        </TabsList>

        <TabsContent value="dashboard" className="mt-6">
          <ReportChartsDashboard filters={reportFilters} />
        </TabsContent>

        <TabsContent value="templates" className="mt-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {isLoadingTemplates ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i} className="animate-pulse">
                  <CardContent className="p-6">
                    <div className="h-4 bg-gray-200 rounded mb-2"></div>
                    <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                  </CardContent>
                </Card>
              ))
            ) : (
              reportTemplates.map((template) => (
                <ReportTemplateCard
                  key={template.id}
                  template={template}
                  onGenerate={(templateId) => {
                    setSelectedTemplate(templateId);
                    handleGenerateReport();
                  }}
                />
              ))
            )}
          </div>
        </TabsContent>

        <TabsContent value="generated" className="mt-6">
          <GeneratedReportsList 
            reports={generatedReports} 
            isLoading={isLoadingReports}
            onExport={exportReport}
          />
        </TabsContent>

        <TabsContent value="filters" className="mt-6">
          <ReportFiltersPanel 
            filters={reportFilters}
            onFiltersChange={setReportFilters}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};
