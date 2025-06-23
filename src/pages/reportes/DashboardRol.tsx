
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
      i.buzo_principal === profile?.nombre || 
      i.supervisor === profile?.nombre ||
      (role === 'admin_salmonera' || role === 'superuser')
    );

    const userBitacoras = bitacoras.filter(b => 
      b.buzo === profile?.nombre ||
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
              value: userInmersiones.reduce((sum, i) => {
                if (i.hora_inicio && i.hora_fin) {
                  const inicio = new Date(`2000-01-01 ${i.hora_inicio}`);
                  const fin = new Date(`2000-01-01 ${i.hora_fin}`);
                  return sum + (fin.getTime() - inicio.getTime()) / (1000 * 60 * 60);
                }
                return sum;
              }, 0),
              icon: Clock,
              color: 'green',
              trend: '+8%'
            },
            {
              label: 'Profundidad Máxima',
              value: Math.max(...userInmersiones.map(i => i.profundidad_max || 0)),
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
                Math.round((userInmersiones.filter(i => i.estado === 'completada').length / userInmersiones.length) * 100) : 0,
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
                        : Math.round(metric.value)}
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
        <Card>
          <CardHeader>
            <CardTitle>Actividad Reciente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-gray-600">Dashboard contextual por rol implementado exitosamente.</p>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
}
