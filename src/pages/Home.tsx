
import { useState } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Users, 
  Calendar, 
  AlertTriangle,
  TrendingUp,
  Activity,
  FileText,
  Clock,
  CheckCircle,
  XCircle,
  Filter,
  Search
} from "lucide-react";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [dateRange, setDateRange] = useState('30');
  const [searchTerm, setSearchTerm] = useState('');

  const stats = [
    {
      title: "Operaciones Activas",
      value: "12",
      change: "+2.5%",
      trend: "up",
      icon: Calendar,
      color: "text-blue-600"
    },
    {
      title: "Inmersiones del Mes",
      value: "89",
      change: "+15.3%",
      trend: "up",
      icon: Activity,
      color: "text-green-600"
    },
    {
      title: "Buzos Disponibles",
      value: "24",
      change: "-1",
      trend: "down",
      icon: Users,
      color: "text-purple-600"
    },
    {
      title: "Alertas Pendientes",
      value: "3",
      change: "-2",
      trend: "down",
      icon: AlertTriangle,
      color: "text-orange-600"
    }
  ];

  const recentActivity = [
    {
      id: 1,
      type: "inmersion",
      title: "Inmersión completada - Centro Las Rosas",
      description: "Buzo: Juan Pérez, Profundidad: 25m",
      time: "Hace 30 min",
      status: "completed"
    },
    {
      id: 2,
      type: "hpt",
      title: "HPT firmado - Operación Mantención",
      description: "Supervisor: María González",
      time: "Hace 1 hora",
      status: "approved"
    },
    {
      id: 3,
      type: "alert",
      title: "Certificación próxima a vencer",
      description: "Buzo: Carlos Silva - Vence en 15 días",
      time: "Hace 2 horas",
      status: "warning"
    }
  ];

  return (
    <>
      {/* Header */}
      <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
        <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
          <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
          <div className="flex items-center gap-3">
            <BarChart3 className="w-6 h-6 text-zinc-600" />
            <div>
              <h1 className="text-xl font-semibold text-zinc-900">Dashboard</h1>
              <p className="text-sm text-zinc-500">Resumen general de operaciones</p>
            </div>
          </div>
          <div className="flex-1" />
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filtros
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto space-y-6">
          {/* Filters Panel */}
          {showFilters && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="w-5 h-5" />
                  Filtros de Dashboard
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <Input
                        placeholder="Buscar operaciones, inmersiones..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pl-10"
                      />
                    </div>
                  </div>
                  <Select value={dateRange} onValueChange={setDateRange}>
                    <SelectTrigger className="w-48">
                      <SelectValue placeholder="Período" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="7">Últimos 7 días</SelectItem>
                      <SelectItem value="30">Últimos 30 días</SelectItem>
                      <SelectItem value="90">Últimos 3 meses</SelectItem>
                      <SelectItem value="365">Último año</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {stats.map((stat, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm font-medium text-zinc-600 mb-1">{stat.title}</p>
                      <p className="text-3xl font-bold text-zinc-900">{stat.value}</p>
                      <div className="flex items-center gap-1 mt-2">
                        <TrendingUp className={`w-4 h-4 ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`} />
                        <span className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                          {stat.change}
                        </span>
                        <span className="text-sm text-zinc-500">vs mes anterior</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg bg-zinc-50`}>
                      <stat.icon className={`w-6 h-6 ${stat.color}`} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Charts Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BarChart3 className="w-5 h-5" />
                  Inmersiones por Día
                </CardTitle>
              </CardHeader>
              <CardContent>
                <DashboardChart />
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Activity className="w-5 h-5" />
                  Actividad Reciente
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentActivity.map((activity) => (
                  <div key={activity.id} className="flex items-start gap-3 p-3 rounded-lg border">
                    <div className="flex-shrink-0">
                      {activity.status === 'completed' && <CheckCircle className="w-5 h-5 text-green-600" />}
                      {activity.status === 'approved' && <FileText className="w-5 h-5 text-blue-600" />}
                      {activity.status === 'warning' && <AlertTriangle className="w-5 h-5 text-orange-600" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-zinc-900">{activity.title}</p>
                      <p className="text-sm text-zinc-600">{activity.description}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <Clock className="w-3 h-3 text-zinc-400" />
                        <span className="text-xs text-zinc-500">{activity.time}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button className="h-16 flex flex-col items-center justify-center gap-2">
                  <Calendar className="w-5 h-5" />
                  <span>Nueva Operación</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
                  <Activity className="w-5 h-5" />
                  <span>Registrar Inmersión</span>
                </Button>
                <Button variant="outline" className="h-16 flex flex-col items-center justify-center gap-2">
                  <FileText className="w-5 h-5" />
                  <span>Crear HPT</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
}
