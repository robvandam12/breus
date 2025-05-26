
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart3, 
  Calendar, 
  FileText, 
  Anchor, 
  Users, 
  TrendingUp,
  Filter,
  Search,
  Eye,
  Plus,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
  const [showFilters, setShowFilters] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPeriod, setSelectedPeriod] = useState('30');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [isLoading, setIsLoading] = useState(false);

  // Mock data
  const stats = [
    {
      title: "Operaciones Activas",
      value: "12",
      change: "+2",
      icon: Calendar,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Inmersiones del Mes",
      value: "47",
      change: "+8",
      icon: Anchor,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Bitácoras Pendientes",
      value: "3",
      change: "-2",
      icon: FileText,
      color: "text-orange-600",
      bgColor: "bg-orange-100"
    },
    {
      title: "Usuarios Activos",
      value: "24",
      change: "+1",
      icon: Users,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const recentActivities = [
    {
      id: "1",
      type: "inmersion",
      title: "Nueva inmersión completada",
      description: "Centro Salmones del Sur - Sitio A",
      time: "Hace 2 horas",
      status: "completed"
    },
    {
      id: "2",
      type: "bitacora",
      title: "Bitácora supervisor pendiente",
      description: "Operación OP-2024-003",
      time: "Hace 4 horas",
      status: "pending"
    },
    {
      id: "3",
      type: "hpt",
      title: "HPT firmado",
      description: "Centro Hualaihué - Equipo 2",
      time: "Hace 6 horas",
      status: "approved"
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-100 text-green-700">Completado</Badge>;
      case 'pending':
        return <Badge className="bg-orange-100 text-orange-700">Pendiente</Badge>;
      case 'approved':
        return <Badge className="bg-blue-100 text-blue-700">Aprobado</Badge>;
      default:
        return <Badge variant="secondary">Desconocido</Badge>;
    }
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'inmersion':
        return <Anchor className="w-4 h-4 text-blue-600" />;
      case 'bitacora':
        return <FileText className="w-4 h-4 text-orange-600" />;
      case 'hpt':
        return <CheckCircle className="w-4 h-4 text-green-600" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  if (isLoading) {
    return <HomeSkeleton />;
  }

  return (
    <div className="container mx-auto py-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Dashboard</h1>
          <p className="text-zinc-500">
            Resumen de actividades y operaciones de buceo
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          Nueva Operación
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => (
          <Card key={index}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="flex items-center gap-2">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <span className={`text-sm ${stat.change.startsWith('+') ? 'text-green-600' : 'text-red-600'}`}>
                      {stat.change}
                    </span>
                  </div>
                </div>
                <div className={`w-12 h-12 ${stat.bgColor} rounded-lg flex items-center justify-center`}>
                  <stat.icon className={`w-6 h-6 ${stat.color}`} />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Filter className="w-5 h-5" />
              Filtros de Búsqueda
            </CardTitle>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
            >
              {showFilters ? 'Ocultar' : 'Mostrar'} Filtros
            </Button>
          </div>
        </CardHeader>
        <Collapsible open={showFilters} onOpenChange={setShowFilters}>
          <CollapsibleContent>
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

                <Select value={selectedPeriod} onValueChange={setSelectedPeriod}>
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

                <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                  <SelectTrigger className="w-48">
                    <SelectValue placeholder="Estado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los estados</SelectItem>
                    <SelectItem value="active">Activas</SelectItem>
                    <SelectItem value="completed">Completadas</SelectItem>
                    <SelectItem value="pending">Pendientes</SelectItem>
                  </SelectContent>
                </Select>

                <Button variant="outline">
                  Limpiar Filtros
                </Button>
              </div>
            </CardContent>
          </CollapsibleContent>
        </Collapsible>
      </Card>

      {/* Recent Activities and Quick Actions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              Actividad Reciente
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="space-y-1">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center gap-3 p-4 hover:bg-gray-50 transition-colors">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    {getActivityIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm">{activity.title}</p>
                    <p className="text-xs text-gray-500 truncate">{activity.description}</p>
                    <p className="text-xs text-gray-400">{activity.time}</p>
                  </div>
                  <div className="flex-shrink-0">
                    {getStatusBadge(activity.status)}
                  </div>
                </div>
              ))}
            </div>
            <div className="p-4 border-t">
              <Button variant="outline" className="w-full">
                <Eye className="w-4 h-4 mr-2" />
                Ver Todas las Actividades
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Acciones Rápidas</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Calendar className="w-4 h-4 mr-2" />
              Nueva Operación
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <FileText className="w-4 h-4 mr-2" />
              Crear HPT
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Anchor className="w-4 h-4 mr-2" />
              Registrar Inmersión
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Gestionar Usuarios
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <BarChart3 className="w-4 h-4 mr-2" />
              Ver Reportes
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Pending Items Table */}
      <Card>
        <CardHeader>
          <CardTitle>Elementos Pendientes de Atención</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead>Asignado a</TableHead>
                <TableHead>Fecha Límite</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <FileText className="w-4 h-4 text-orange-600" />
                    <span className="text-sm">Bitácora</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">Bitácora Supervisor - OP-2024-003</TableCell>
                <TableCell className="text-sm">Carlos Supervisor</TableCell>
                <TableCell className="text-sm">Hoy</TableCell>
                <TableCell>
                  <Badge className="bg-red-100 text-red-700">Vencido</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-blue-600" />
                    <span className="text-sm">HPT</span>
                  </div>
                </TableCell>
                <TableCell className="text-sm">HPT - Centro Hualaihué</TableCell>
                <TableCell className="text-sm">Ana Admin</TableCell>
                <TableCell className="text-sm">Mañana</TableCell>
                <TableCell>
                  <Badge className="bg-orange-100 text-orange-700">Pendiente</Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4" />
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}

const HomeSkeleton = () => (
  <div className="container mx-auto py-6 space-y-6">
    <div className="flex items-center justify-between">
      <div>
        <Skeleton className="h-8 w-48 mb-2" />
        <Skeleton className="h-4 w-64" />
      </div>
      <Skeleton className="h-10 w-32" />
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {[...Array(4)].map((_, i) => (
        <Card key={i}>
          <CardContent className="p-4">
            <Skeleton className="h-16 w-full" />
          </CardContent>
        </Card>
      ))}
    </div>

    <Card>
      <CardHeader>
        <Skeleton className="h-6 w-48" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-4">
          <Skeleton className="h-10 flex-1" />
          <Skeleton className="h-10 w-48" />
          <Skeleton className="h-10 w-48" />
        </div>
      </CardContent>
    </Card>

    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {[...Array(2)].map((_, i) => (
        <Card key={i}>
          <CardHeader>
            <Skeleton className="h-6 w-32" />
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[...Array(3)].map((_, j) => (
                <Skeleton key={j} className="h-12 w-full" />
              ))}
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  </div>
);
