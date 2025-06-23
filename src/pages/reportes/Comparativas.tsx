
import React, { useState, useMemo } from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { TrendingUp, TrendingDown, Minus, Crown, Trophy, Target } from "lucide-react";
import { useInmersiones } from '@/hooks/useInmersiones';
import { useBitacoras } from '@/hooks/useBitacoras';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, LineChart, Line } from 'recharts';

export default function Comparativas() {
  const { inmersiones = [] } = useInmersiones();
  const { bitacoras = [] } = useBitacoras();
  
  const [comparisonType, setComparisonType] = useState<'centros' | 'contratistas' | 'periodos'>('centros');
  const [selectedPeriod, setSelectedPeriod] = useState<'month' | 'quarter' | 'year'>('month');

  // Datos simulados para comparativas
  const centerData = useMemo(() => [
    {
      id: 'centro-norte',
      name: 'Centro Norte',
      inmersiones: 45,
      eficiencia: 92,
      tiempoPromedio: 3.2,
      incidentes: 1,
      personal: 12,
      profundidadPromedio: 15.5,
      costoOperativo: 850000,
      satisfaccion: 4.6
    },
    {
      id: 'centro-sur',
      name: 'Centro Sur',
      inmersiones: 38,
      eficiencia: 88,
      tiempoPromedio: 3.8,
      incidentes: 2,
      personal: 10,
      profundidadPromedio: 18.2,
      costoOperativo: 920000,
      satisfaccion: 4.4
    },
    {
      id: 'centro-este',
      name: 'Centro Este',
      inmersiones: 32,
      eficiencia: 85,
      tiempoPromedio: 4.1,
      incidentes: 0,
      personal: 8,
      profundidadPromedio: 12.8,
      costoOperativo: 780000,
      satisfaccion: 4.7
    },
    {
      id: 'centro-oeste',
      name: 'Centro Oeste',
      inmersiones: 28,
      eficiencia: 90,
      tiempoPromedio: 3.5,
      incidentes: 1,
      personal: 9,
      profundidadPromedio: 16.1,
      costoOperativo: 820000,
      satisfaccion: 4.5
    }
  ], []);

  const contractorData = useMemo(() => [
    {
      id: 'buceo-austral',
      name: 'Buceo Austral',
      inmersiones: 75,
      eficiencia: 94,
      tiempoPromedio: 3.1,
      experiencia: 15,
      certificaciones: 8,
      satisfaccion: 4.8
    },
    {
      id: 'servicios-marinos',
      name: 'Servicios Marinos',
      inmersiones: 68,
      eficiencia: 91,
      tiempoPromedio: 3.4,
      experiencia: 12,
      certificaciones: 6,
      satisfaccion: 4.6
    },
    {
      id: 'aqua-tech',
      name: 'Aqua Tech',
      inmersiones: 52,
      eficiencia: 87,
      tiempoPromedio: 3.9,
      experiencia: 8,
      certificaciones: 5,
      satisfaccion: 4.3
    }
  ], []);

  const getTopPerformers = (data: any[], metric: string) => {
    return [...data].sort((a, b) => b[metric] - a[metric]).slice(0, 3);
  };

  const getTrendIcon = (value: number, threshold: number = 0) => {
    if (value > threshold) return <TrendingUp className="w-4 h-4 text-green-600" />;
    if (value < threshold) return <TrendingDown className="w-4 h-4 text-red-600" />;
    return <Minus className="w-4 h-4 text-gray-600" />;
  };

  const radarData = useMemo(() => {
    if (comparisonType === 'centros') {
      return centerData.map(center => ({
        name: center.name,
        eficiencia: center.eficiencia,
        satisfaccion: center.satisfaccion * 20, // Escalar a 100
        costo: 100 - (center.costoOperativo / 10000), // Invertir para que menor costo = mejor
        personal: (center.personal / 15) * 100 // Escalar a 100
      }));
    }
    return contractorData.map(contractor => ({
      name: contractor.name,
      eficiencia: contractor.eficiencia,
      satisfaccion: contractor.satisfaccion * 20,
      experiencia: (contractor.experiencia / 20) * 100,
      certificaciones: (contractor.certificaciones / 10) * 100
    }));
  }, [comparisonType, centerData, contractorData]);

  return (
    <MainLayout
      title="Comparativas"
      subtitle="Análisis comparativo entre centros, contratistas y períodos"
      icon={Target}
      headerChildren={
        <div className="flex gap-3">
          <Select value={comparisonType} onValueChange={(value) => setComparisonType(value as any)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Tipo de comparación" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="centros">Centros de Cultivo</SelectItem>
              <SelectItem value="contratistas">Contratistas</SelectItem>
              <SelectItem value="periodos">Períodos de Tiempo</SelectItem>
            </SelectContent>
          </Select>
          
          <Select value={selectedPeriod} onValueChange={(value) => setSelectedPeriod(value as any)}>
            <SelectTrigger className="w-32">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="month">Mes</SelectItem>
              <SelectItem value="quarter">Trimestre</SelectItem>
              <SelectItem value="year">Año</SelectItem>
            </SelectContent>
          </Select>
        </div>
      }
    >
      <div className="space-y-6">
        {/* Ranking de Rendimiento */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Crown className="w-5 h-5 text-yellow-600" />
              Ranking de Rendimiento
            </CardTitle>
            <CardDescription>
              Los mejores {comparisonType === 'centros' ? 'centros' : 'contratistas'} por métricas clave
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Top Eficiencia */}
              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-gold-500" />
                  Eficiencia Operativa
                </h4>
                <div className="space-y-3">
                  {getTopPerformers(comparisonType === 'centros' ? centerData : contractorData, 'eficiencia')
                    .map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "outline"} className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600">{item.eficiencia}%</span>
                        {getTrendIcon(5)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Inmersiones */}
              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-silver-500" />
                  Cantidad de Inmersiones
                </h4>
                <div className="space-y-3">
                  {getTopPerformers(comparisonType === 'centros' ? centerData : contractorData, 'inmersiones')
                    .map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "outline"} className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600">{item.inmersiones}</span>
                        {getTrendIcon(3)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Satisfacción */}
              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-bronze-500" />
                  Satisfacción
                </h4>
                <div className="space-y-3">
                  {getTopPerformers(comparisonType === 'centros' ? centerData : contractorData, 'satisfaccion')
                    .map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "outline"} className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-purple-600">{item.satisfaccion}/5</span>
                        {getTrendIcon(0.1)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Análisis Comparativo */}
        <Tabs defaultValue="performance" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
            <TabsTrigger value="efficiency">Eficiencia</TabsTrigger>
            <TabsTrigger value="radar">Análisis Radar</TabsTrigger>
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Comparativa de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={comparisonType === 'centros' ? centerData : contractorData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="inmersiones" fill="#3b82f6" name="Inmersiones" />
                    <Bar dataKey="eficiencia" fill="#22c55e" name="Eficiencia %" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="efficiency" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Eficiencia vs Costo</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={comparisonType === 'centros' ? centerData : []}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="eficiencia" fill="#22c55e" name="Eficiencia %" />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Tiempo Promedio por Operación</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {(comparisonType === 'centros' ? centerData : contractorData).map((item, index) => (
                      <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                        <div className="flex items-center gap-3">
                          <div className={`w-3 h-3 rounded-full ${
                            index === 0 ? 'bg-green-500' : 
                            index === 1 ? 'bg-blue-500' : 
                            index === 2 ? 'bg-orange-500' : 'bg-purple-500'
                          }`} />
                          <span className="font-medium">{item.name}</span>
                        </div>
                        <div className="text-right">
                          <p className="font-bold">{item.tiempoPromedio}h</p>
                          <p className="text-sm text-gray-600">promedio</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="radar" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Análisis Multidimensional</CardTitle>
                <CardDescription>
                  Comparación integral de múltiples métricas de rendimiento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={500}>
                  <RadarChart data={radarData[0] ? [radarData[0], radarData[1], radarData[2]] : []}>
                    <PolarGrid />
                    <PolarAngleAxis dataKey="name" />
                    <PolarRadiusAxis domain={[0, 100]} />
                    <Radar name="Eficiencia" dataKey="eficiencia" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.1} />
                    <Radar name="Satisfacción" dataKey="satisfaccion" stroke="#22c55e" fill="#22c55e" fillOpacity={0.1} />
                    {comparisonType === 'centros' ? (
                      <>
                        <Radar name="Costo" dataKey="costo" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                        <Radar name="Personal" dataKey="personal" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
                      </>
                    ) : (
                      <>
                        <Radar name="Experiencia" dataKey="experiencia" stroke="#f59e0b" fill="#f59e0b" fillOpacity={0.1} />
                        <Radar name="Certificaciones" dataKey="certificaciones" stroke="#8b5cf6" fill="#8b5cf6" fillOpacity={0.1} />
                      </>
                    )}
                    <Tooltip />
                  </RadarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trends" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Tendencias Temporales</CardTitle>
                <CardDescription>
                  Evolución del rendimiento en los últimos meses
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={[
                    { month: 'Ene', centro1: 85, centro2: 82, centro3: 88 },
                    { month: 'Feb', centro1: 87, centro2: 85, centro3: 89 },
                    { month: 'Mar', centro1: 90, centro2: 88, centro3: 91 },
                    { month: 'Abr', centro1: 92, centro2: 89, centro3: 93 },
                    { month: 'May', centro1: 94, centro2: 91, centro3: 95 },
                    { month: 'Jun', centro1: 92, centro2: 88, centro3: 90 }
                  ]}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="month" />
                    <YAxis domain={[80, 100]} />
                    <Tooltip />
                    <Line type="monotone" dataKey="centro1" stroke="#3b82f6" strokeWidth={2} name="Centro Norte" />
                    <Line type="monotone" dataKey="centro2" stroke="#22c55e" strokeWidth={2} name="Centro Sur" />
                    <Line type="monotone" dataKey="centro3" stroke="#f59e0b" strokeWidth={2} name="Centro Este" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
