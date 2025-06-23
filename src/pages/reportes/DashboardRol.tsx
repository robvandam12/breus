
import React, { useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Shield, Wrench, Activity, CheckCircle, AlertTriangle, Clock, Target } from "lucide-react";
import { useAuth } from '@/hooks/useAuth';
import { useInmersiones } from '@/hooks/useInmersiones';
import { useBitacoras } from '@/hooks/useBitacoras';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

export default function DashboardRol() {
  const { profile } = useAuth();
  const { inmersiones = [] } = useInmersiones();
  const { bitacoras = [] } = useBitacoras();

  const role = profile?.role || 'buzo';

  // Métricas contextuales por rol
  const roleMetrics = useMemo(() => {
    const userInmersiones = inmersiones.filter(i => 
      i.buzo_principal === profile?.id || 
      i.supervisor === profile?.id ||
      (role === 'admin_salmonera' || role === 'superuser')
    );

    const userBitacoras = bitacoras.filter(b => 
      b.created_by === profile?.id ||
      (role === 'admin_salmonera' || role === 'superuser')
    );

    switch (role) {
      case 'buzo':
        return {
          title: 'Dashboard del Buzo',
          subtitle: 'Métricas personales de inmersiones y actividades',
          metrics: [
            {
              label: 'Inmersiones Realizadas',
              value: userInmersiones.filter(i => i.estado === 'completada').length,
              icon: Activity,
              color: 'blue',
              trend: '+15%'
            },
            {
              label: 'Horas de Inmersión',
              value: userInmersiones.reduce((sum, i) => sum + (i.duracion_estimada || 0), 0),
              icon: Clock,
              color: 'green',
              trend: '+8%'
            },
            {
              label: 'Profundidad Máxima',
              value: Math.max(...userInmersiones.map(i => i.profundidad_maxima || 0)),
              icon: Target,
              color: 'purple',
              trend: 'Récord personal'
            },
            {
              label: 'Bitácoras Completadas',
              value: userBitacoras.filter(b => b.firmado).length,
              icon: CheckCircle,
              color: 'orange',
              trend: '+5%'
            }
          ]
        };

      case 'supervisor':
        return {
          title: 'Dashboard del Supervisor',
          subtitle: 'Supervisión de operaciones y equipos de trabajo',
          metrics: [
            {
              label: 'Operaciones Supervisadas',
              value: userInmersiones.length,
              icon: Shield,
              color: 'blue',
              trend: '+12%'
            },
            {
              label: 'Equipos Coordinados',
              value: new Set(userInmersiones.map(i => i.buzo_principal)).size,
              icon: Users,
              color: 'green',
              trend: '3 activos'
            },
            {
              label: 'Eficiencia del Equipo',
              value: userInmersiones.length > 0 ? 
                (userInmersiones.filter(i => i.estado === 'completada').length / userInmersiones.length) * 100 : 0,
              icon: Target,
              color: 'purple',
              trend: '+3%'
            },
            {
              label: 'Incidentes Gestionados',
              value: 2,
              icon: AlertTriangle,
              color: 'orange',
              trend: '-50%'
            }
          ]
        };

      case 'admin_salmonera':
        return {
          title: 'Dashboard Administrativo',
          subtitle: 'Gestión integral de centros y operaciones',
          metrics: [
            {
              label: 'Centros Activos',
              value: 3,
              icon: Activity,
              color: 'blue',
              trend: 'Estable'
            },
            {
              label: 'Personal Operativo',
              value: 24,
              icon: Users,
              color: 'green',
              trend: '+2 nuevos'
            },
            {
              label: 'Operaciones Mes',
              value: inmersiones.length,
              icon: Target,
              color: 'purple',
              trend: '+18%'
            },
            {
              label: 'Cumplimiento',
              value: 94,
              icon: CheckCircle,
              color: 'orange',
              trend: '+2%'
            }
          ]
        };

      default:
        return {
          title: 'Dashboard General',
          subtitle: 'Vista general del sistema',
          metrics: [
            {
              label: 'Total Operaciones',
              value: inmersiones.length,
              icon: Activity,
              color: 'blue',
              trend: '+10%'
            },
            {
              label: 'Usuarios Activos',
              value: 48,
              icon: Users,
              color: 'green',
              trend: '+5%'
            },
            {
              label: 'Eficiencia Global',
              value: 92,
              icon: Target,
              color: 'purple',
              trend: '+1%'
            },
            {
              label: 'Documentos',
              value: bitacoras.length,
              icon: CheckCircle,
              color: 'orange',
              trend: '+15%'
            }
          ]
        };
    }
  }, [role, profile, inmersiones, bitacoras]);

  // Datos para gráficos específicos por rol
  const chartData = useMemo(() => {
    const last7Days = Array.from({ length: 7 }, (_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        day: date.toLocaleDateString('es-CL', { weekday: 'short' }),
        value: Math.floor(Math.random() * 20) + 5
      };
    });
    return last7Days;
  }, []);

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <MainLayout
      title={roleMetrics.title}
      subtitle={roleMetrics.subtitle}
      icon={Users}
    >
      <div className="space-y-6">
        {/* Información del usuario */}
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center">
                  <span className="text-white font-bold text-xl">
                    {profile?.nombre?.charAt(0) || 'U'}
                  </span>
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">
                    {profile?.nombre} {profile?.apellido}
                  </h3>
                  <p className="text-gray-600">{profile?.email}</p>
                  <Badge variant="outline" className="mt-1">
                    {role === 'buzo' ? 'Buzo' : 
                     role === 'supervisor' ? 'Supervisor' :
                     role === 'admin_salmonera' ? 'Admin Salmonera' :
                     role === 'admin_servicio' ? 'Admin Servicio' : 'Super Usuario'}
                  </Badge>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Último acceso</p>
                <p className="font-medium">Hoy, 14:32</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Métricas principales */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {roleMetrics.metrics.map((metric, index) => (
            <Card key={index}>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">{metric.label}</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {typeof metric.value === 'number' && metric.label.includes('%') 
                        ? `${metric.value}%` 
                        : metric.value}
                    </p>
                    <p className="text-sm text-green-600 mt-1">{metric.trend}</p>
                  </div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${getColorClasses(metric.color)}`}>
                    <metric.icon className="w-6 h-6" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Gráficos y análisis específicos por rol */}
        <Tabs defaultValue="activity" className="space-y-6">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="activity">Actividad</TabsTrigger>
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
            <TabsTrigger value="objectives">Objetivos</TabsTrigger>
          </TabsList>

          <TabsContent value="activity" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Actividad de los Últimos 7 Días</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="value" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tendencia de Productividad</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="day" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="value" stroke="#22c55e" strokeWidth={3} />
                    </LineChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="performance" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Indicadores de Rendimiento</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Eficiencia Operativa</span>
                      <span className="text-sm text-gray-600">92%</span>
                    </div>
                    <Progress value={92} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Cumplimiento de Tiempos</span>
                      <span className="text-sm text-gray-600">88%</span>
                    </div>
                    <Progress value={88} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Calidad de Documentación</span>
                      <span className="text-sm text-gray-600">95%</span>
                    </div>
                    <Progress value={95} className="h-3" />
                  </div>
                  
                  <div>
                    <div className="flex justify-between mb-2">
                      <span className="text-sm font-medium">Seguridad Operacional</span>
                      <span className="text-sm text-gray-600">98%</span>
                    </div>
                    <Progress value={98} className="h-3" />
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Comparativa con Promedio</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { metric: 'Inmersiones/Mes', personal: 12, promedio: 10, better: true },
                      { metric: 'Tiempo Promedio', personal: 3.2, promedio: 3.8, better: true },
                      { metric: 'Documentos/Día', personal: 2.5, promedio: 2.1, better: true },
                      { metric: 'Incidentes', personal: 0.1, promedio: 0.3, better: true }
                    ].map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                        <span className="font-medium">{item.metric}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-sm">{item.personal}</span>
                          <Badge variant={item.better ? "default" : "destructive"} className="text-xs">
                            {item.better ? "Superior" : "Inferior"}
                          </Badge>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="objectives" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Objetivos del Período</CardTitle>
                <CardDescription>Progreso hacia las metas establecidas</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {[
                    { objetivo: 'Inmersiones Mensuales', actual: 12, meta: 15, progreso: 80 },
                    { objetivo: 'Eficiencia Operativa', actual: 92, meta: 90, progreso: 100 },
                    { objetivo: 'Capacitaciones', actual: 3, meta: 4, progreso: 75 },
                    { objetivo: 'Documentación', actual: 95, meta: 98, progreso: 97 }
                  ].map((objetivo, index) => (
                    <div key={index} className="p-4 bg-white border border-gray-200 rounded-xl">
                      <div className="flex justify-between mb-3">
                        <h4 className="font-medium">{objetivo.objetivo}</h4>
                        <Badge variant="outline">
                          {objetivo.actual}/{objetivo.meta}
                        </Badge>
                      </div>
                      <Progress value={objetivo.progreso} className="h-3 mb-2" />
                      <p className="text-sm text-gray-600">
                        {objetivo.progreso >= 100 ? 'Meta alcanzada' : 
                         objetivo.progreso >= 80 ? 'En buen camino' : 'Requiere atención'}
                      </p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
