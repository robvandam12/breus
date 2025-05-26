
import { useState } from "react";
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart3, Anchor, FileText, Users, Calendar, AlertTriangle } from "lucide-react";
import { DashboardChart } from "@/components/dashboard/DashboardChart";
import { Skeleton } from "@/components/ui/skeleton";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Index = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [filters, setFilters] = useState({
    dateRange: '',
    sitio: '',
    estado: ''
  });

  const stats = [
    {
      title: "Operaciones Activas",
      value: "12",
      change: "+2",
      changeType: "positive" as const,
      icon: Calendar,
    },
    {
      title: "Inmersiones del Mes",
      value: "89",
      change: "+12%",
      changeType: "positive" as const,
      icon: Anchor,
    },
    {
      title: "Formularios Pendientes",
      value: "5",
      change: "-3",
      changeType: "negative" as const,
      icon: FileText,
    },
    {
      title: "Personal Disponible",
      value: "24",
      change: "±0",
      changeType: "neutral" as const,
      icon: Users,
    },
  ];

  const recentActivity = [
    {
      id: 1,
      type: "inmersion",
      title: "Nueva inmersión completada",
      description: "Juan Pérez - Sitio Alpha - 45m profundidad",
      time: "Hace 2 horas",
      status: "completed"
    },
    {
      id: 2,
      type: "hpt",
      title: "HPT firmado",
      description: "Operación Beta-004 - Supervisor: María González",
      time: "Hace 4 horas",
      status: "approved"
    },
    {
      id: 3,
      type: "alert",
      title: "Certificación próxima a vencer",
      description: "Carlos Silva - Matrícula vence en 15 días",
      time: "Hace 6 horas",
      status: "warning"
    },
  ];

  const getChangeColor = (changeType: string) => {
    switch (changeType) {
      case "positive":
        return "text-green-600";
      case "negative":
        return "text-red-600";
      default:
        return "text-gray-600";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "bg-green-100 text-green-800";
      case "approved":
        return "bg-blue-100 text-blue-800";
      case "warning":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  if (isLoading) {
    return (
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-gray-50">
          <AppSidebar />
          <main className="flex-1 flex flex-col">
            <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
              <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
                <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
                <div className="flex items-center gap-3">
                  <BarChart3 className="w-6 h-6 text-zinc-600" />
                  <div>
                    <h1 className="text-xl font-semibold text-zinc-900">Dashboard</h1>
                    <p className="text-sm text-zinc-500">Resumen de operaciones de buceo</p>
                  </div>
                </div>
              </div>
            </header>
            <div className="flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <Card key={i}>
                    <CardContent className="p-6">
                      <Skeleton className="h-8 w-20 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardContent>
                  </Card>
                ))}
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-40" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-64 w-full" />
                  </CardContent>
                </Card>
                <Card>
                  <CardHeader>
                    <Skeleton className="h-6 w-40" />
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {Array.from({ length: 3 }).map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </main>
        </div>
      </SidebarProvider>
    );
  }

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <AppSidebar />
        <main className="flex-1 flex flex-col">
          <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
            <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
              <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
              <div className="flex items-center gap-3">
                <BarChart3 className="w-6 h-6 text-zinc-600" />
                <div>
                  <h1 className="text-xl font-semibold text-zinc-900">Dashboard</h1>
                  <p className="text-sm text-zinc-500">Resumen de operaciones de buceo</p>
                </div>
              </div>
              <div className="flex-1" />
              <Collapsible open={showFilters} onOpenChange={setShowFilters}>
                <CollapsibleTrigger asChild>
                  <Button
                    variant="outline"
                    className="ios-button"
                  >
                    Filtros de búsqueda
                  </Button>
                </CollapsibleTrigger>
              </Collapsible>
            </div>
          </header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-4 md:p-8 max-w-7xl mx-auto">
              {/* Filters Section */}
              <Collapsible open={showFilters} onOpenChange={setShowFilters}>
                <CollapsibleContent className="space-y-4 mb-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Filtros de Búsqueda</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="dateRange">Rango de Fecha</Label>
                          <Select
                            value={filters.dateRange}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Seleccionar período" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="today">Hoy</SelectItem>
                              <SelectItem value="week">Esta semana</SelectItem>
                              <SelectItem value="month">Este mes</SelectItem>
                              <SelectItem value="quarter">Este trimestre</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="sitio">Sitio</Label>
                          <Select
                            value={filters.sitio}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, sitio: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Todos los sitios" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos los sitios</SelectItem>
                              <SelectItem value="alpha">Sitio Alpha</SelectItem>
                              <SelectItem value="beta">Sitio Beta</SelectItem>
                              <SelectItem value="gamma">Sitio Gamma</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="estado">Estado</Label>
                          <Select
                            value={filters.estado}
                            onValueChange={(value) => setFilters(prev => ({ ...prev, estado: value }))}
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Todos los estados" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="all">Todos</SelectItem>
                              <SelectItem value="active">Activo</SelectItem>
                              <SelectItem value="completed">Completado</SelectItem>
                              <SelectItem value="pending">Pendiente</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CollapsibleContent>
              </Collapsible>

              {/* Stats Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
                {stats.map((stat, index) => (
                  <Card key={index} className="ios-card">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-zinc-600">{stat.title}</p>
                          <p className="text-2xl font-bold">{stat.value}</p>
                          <p className={`text-xs ${getChangeColor(stat.changeType)}`}>
                            {stat.change} vs mes anterior
                          </p>
                        </div>
                        <stat.icon className="w-8 h-8 text-zinc-400" />
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Charts and Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="ios-card">
                  <CardHeader>
                    <CardTitle>Inmersiones por Día</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <DashboardChart />
                  </CardContent>
                </Card>

                <Card className="ios-card">
                  <CardHeader>
                    <CardTitle>Actividad Reciente</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {recentActivity.map((activity) => (
                        <div key={activity.id} className="flex items-start space-x-3 p-3 border rounded-lg">
                          <div className="flex-shrink-0">
                            {activity.type === "inmersion" && <Anchor className="w-5 h-5 text-blue-500" />}
                            {activity.type === "hpt" && <FileText className="w-5 h-5 text-green-500" />}
                            {activity.type === "alert" && <AlertTriangle className="w-5 h-5 text-yellow-500" />}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium text-zinc-900">{activity.title}</p>
                              <Badge variant="secondary" className={getStatusColor(activity.status)}>
                                {activity.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-zinc-500">{activity.description}</p>
                            <p className="text-xs text-zinc-400">{activity.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};

export default Index;
