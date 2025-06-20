
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  Search,
  Filter,
  TrendingUp,
  Users,
  Activity,
} from "lucide-react";
import { useNotificationSystem } from "@/hooks/useNotificationSystem";

export const SecurityAlertsManager = () => {
  const { securityAlerts, acknowledgeAlert, isAcknowledging } = useNotificationSystem();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState<string>('all');
  const [filterStatus, setFilterStatus] = useState<string>('all');

  // Filtrar alertas
  const filteredAlerts = securityAlerts.filter(alert => {
    const matchesSearch = searchTerm === '' || 
      alert.type.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (alert.inmersion as any)?.codigo?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesPriority = filterPriority === 'all' || alert.priority === filterPriority;
    const matchesStatus = filterStatus === 'all' || 
      (filterStatus === 'acknowledged' && alert.acknowledged) ||
      (filterStatus === 'pending' && !alert.acknowledged);

    return matchesSearch && matchesPriority && matchesStatus;
  });

  // Estadísticas
  const stats = {
    total: securityAlerts.length,
    pending: securityAlerts.filter(a => !a.acknowledged).length,
    critical: securityAlerts.filter(a => a.priority === 'critical').length,
    today: securityAlerts.filter(a => {
      const today = new Date().toDateString();
      return new Date(a.created_at).toDateString() === today;
    }).length,
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical':
        return 'bg-red-500 text-white';
      case 'high':
        return 'bg-orange-500 text-white';
      case 'medium':
        return 'bg-yellow-500 text-white';
      default:
        return 'bg-blue-500 text-white';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'depth_exceeded':
        return <TrendingUp className="w-4 h-4" />;
      case 'time_exceeded':
        return <Clock className="w-4 h-4" />;
      case 'equipment_failure':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Shield className="w-6 h-6 text-blue-500" />
              <div>
                <p className="text-sm text-gray-600">Total Alertas</p>
                <p className="text-2xl font-bold">{stats.total}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="w-6 h-6 text-yellow-500" />
              <div>
                <p className="text-sm text-gray-600">Pendientes</p>
                <p className="text-2xl font-bold">{stats.pending}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="w-6 h-6 text-red-500" />
              <div>
                <p className="text-sm text-gray-600">Críticas</p>
                <p className="text-2xl font-bold">{stats.critical}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Activity className="w-6 h-6 text-green-500" />
              <div>
                <p className="text-sm text-gray-600">Hoy</p>
                <p className="text-2xl font-bold">{stats.today}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5" />
            Gestión de Alertas de Seguridad
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Filtros */}
          <div className="flex flex-wrap gap-4 mb-6">
            <div className="flex-1 min-w-[200px]">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Buscar por tipo o código de inmersión..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <Select value={filterPriority} onValueChange={setFilterPriority}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Prioridad" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="critical">Crítica</SelectItem>
                <SelectItem value="high">Alta</SelectItem>
                <SelectItem value="medium">Media</SelectItem>
                <SelectItem value="low">Baja</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-[150px]">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todas</SelectItem>
                <SelectItem value="pending">Pendientes</SelectItem>
                <SelectItem value="acknowledged">Reconocidas</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Alertas */}
          <div className="space-y-4">
            {filteredAlerts.length === 0 ? (
              <div className="text-center py-8 text-gray-500">
                <Shield className="w-12 h-12 mx-auto mb-4 opacity-50" />
                <h3 className="text-lg font-medium mb-2">No hay alertas</h3>
                <p>No se encontraron alertas que coincidan con los filtros aplicados.</p>
              </div>
            ) : (
              filteredAlerts.map((alert) => (
                <Card 
                  key={alert.id} 
                  className={`transition-all hover:shadow-md ${
                    !alert.acknowledged ? 'border-l-4 border-l-red-500' : ''
                  }`}
                >
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 flex-1">
                        <div className="p-2 rounded-full bg-gray-100">
                          {getTypeIcon(alert.type)}
                        </div>
                        
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-2">
                            <Badge className={getPriorityColor(alert.priority)}>
                              {alert.priority.toUpperCase()}
                            </Badge>
                            <span className="text-sm text-gray-600">
                              {alert.type.replace('_', ' ').toUpperCase()}
                            </span>
                          </div>
                          
                          <h3 className="font-semibold mb-2">
                            Inmersión: {(alert.inmersion as any)?.codigo}
                          </h3>
                          
                          {alert.details && (
                            <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                              {Object.entries(alert.details).map(([key, value]) => (
                                <div key={key}>
                                  <span className="font-medium text-gray-600">
                                    {key.replace('_', ' ').toUpperCase()}:
                                  </span>
                                  <span className="ml-1">{String(value)}</span>
                                </div>
                              ))}
                            </div>
                          )}
                          
                          <div className="flex items-center gap-4 text-xs text-gray-500">
                            <div className="flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {new Date(alert.created_at).toLocaleString()}
                            </div>
                            
                            {alert.acknowledged && alert.acknowledged_at && (
                              <div className="flex items-center gap-1 text-green-600">
                                <CheckCircle className="w-3 h-3" />
                                Reconocida {new Date(alert.acknowledged_at).toLocaleString()}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex flex-col gap-2">
                        {!alert.acknowledged ? (
                          <Button
                            size="sm"
                            onClick={() => acknowledgeAlert(alert.id)}
                            disabled={isAcknowledging}
                          >
                            <CheckCircle className="w-4 h-4 mr-2" />
                            Reconocer
                          </Button>
                        ) : (
                          <Badge variant="outline" className="text-green-600">
                            <CheckCircle className="w-3 h-3 mr-1" />
                            Reconocida
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
