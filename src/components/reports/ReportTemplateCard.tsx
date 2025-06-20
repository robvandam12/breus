
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Shield, 
  TrendingUp, 
  Settings, 
  Play,
  Clock
} from "lucide-react";
import { ReportTemplate } from "@/hooks/useAdvancedReports";

interface ReportTemplateCardProps {
  template: ReportTemplate;
  onGenerate: (templateId: string) => void;
}

export const ReportTemplateCard = ({ template, onGenerate }: ReportTemplateCardProps) => {
  const getTypeIcon = (tipo: string) => {
    switch (tipo) {
      case 'operacional':
        return <BarChart3 className="w-5 h-5 text-blue-500" />;
      case 'seguridad':
        return <Shield className="w-5 h-5 text-red-500" />;
      case 'eficiencia':
        return <TrendingUp className="w-5 h-5 text-green-500" />;
      default:
        return <Settings className="w-5 h-5 text-gray-500" />;
    }
  };

  const getTypeBadgeColor = (tipo: string) => {
    switch (tipo) {
      case 'operacional':
        return 'bg-blue-100 text-blue-800';
      case 'seguridad':
        return 'bg-red-100 text-red-800';
      case 'eficiencia':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            {getTypeIcon(template.tipo)}
            <div>
              <CardTitle className="text-lg">{template.nombre}</CardTitle>
              <Badge className={`mt-1 ${getTypeBadgeColor(template.tipo)}`}>
                {template.tipo.charAt(0).toUpperCase() + template.tipo.slice(1)}
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 line-clamp-2">
          {template.descripcion}
        </p>
        
        <div className="flex items-center justify-between text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Actualizado {new Date(template.updated_at).toLocaleDateString()}
          </div>
        </div>
        
        <div className="space-y-2">
          <div className="text-xs font-medium text-gray-700">Métricas incluidas:</div>
          <div className="flex flex-wrap gap-1">
            {template.configuracion?.metricas?.map((metrica: string, index: number) => (
              <Badge key={index} variant="outline" className="text-xs">
                {metrica}
              </Badge>
            )) || (
              <Badge variant="outline" className="text-xs">
                Configuración personalizada
              </Badge>
            )}
          </div>
        </div>
        
        <Button 
          onClick={() => onGenerate(template.id)}
          className="w-full"
          size="sm"
        >
          <Play className="w-4 h-4 mr-2" />
          Generar Reporte
        </Button>
      </CardContent>
    </Card>
  );
};
