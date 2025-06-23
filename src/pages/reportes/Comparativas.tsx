
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
    }
  ], []);

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
                  <Trophy className="w-4 h-4 text-yellow-500" />
                  Eficiencia Operativa
                </h4>
                <div className="space-y-3">
                  {centerData.slice(0, 3).map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "outline"} className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-green-600">{item.eficiencia}%</span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Inmersiones */}
              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-gray-500" />
                  Cantidad de Inmersiones
                </h4>
                <div className="space-y-3">
                  {centerData.slice(0, 3).map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "outline"} className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-blue-600">{item.inmersiones}</span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Top Satisfacción */}
              <div>
                <h4 className="font-medium mb-4 flex items-center gap-2">
                  <Trophy className="w-4 h-4 text-orange-500" />
                  Satisfacción
                </h4>
                <div className="space-y-3">
                  {centerData.slice(0, 3).map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <Badge variant={index === 0 ? "default" : "outline"} className="w-6 h-6 p-0 flex items-center justify-center text-xs">
                          {index + 1}
                        </Badge>
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-purple-600">{item.satisfaccion}/5</span>
                        <TrendingUp className="w-4 h-4 text-green-600" />
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
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="performance">Rendimiento</TabsTrigger>
            <TabsTrigger value="efficiency">Eficiencia</TabsTrigger>
            <TabsTrigger value="trends">Tendencias</TabsTrigger>
          </TabsList>

          <TabsContent value="performance" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Comparativa de Rendimiento</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={centerData}>
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
            <Card>
              <CardHeader>
                <CardTitle>Análisis de Eficiencia</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {centerData.map((item, index) => (
                    <div key={item.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                      <div className="flex items-center gap-3">
                        <div className={`w-3 h-3 rounded-full ${
                          index === 0 ? 'bg-green-500' : 
                          index === 1 ? 'bg-blue-500' : 'bg-orange-500'
                        }`} />
                        <span className="font-medium">{item.name}</span>
                      </div>
                      <div className="text-right">
                        <p className="font-bold">{item.eficiencia}%</p>
                        <p className="text-sm text-gray-600">eficiencia</p>
                      </div>
                    </div>
                  ))}
                </div>
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
