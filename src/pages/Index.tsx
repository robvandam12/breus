
import React from 'react';
import { MainLayout } from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Users, Waves, BarChart3 } from "lucide-react";
import { useNavigate } from 'react-router-dom';

export default function Index() {
  const navigate = useNavigate();

  return (
    <MainLayout
      title="Dashboard Principal"
      subtitle="Gestión integral de operaciones de buceo"
      icon={Waves}
    >
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/inmersiones')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Inmersiones</CardTitle>
              <Waves className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">24</div>
              <p className="text-xs text-muted-foreground">
                +20% desde el mes pasado
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/operaciones')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Operaciones Activas</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">8</div>
              <p className="text-xs text-muted-foreground">
                +2 nuevas esta semana
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/usuarios')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Personal Activo</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">42</div>
              <p className="text-xs text-muted-foreground">
                +3 nuevos buzos
              </p>
            </CardContent>
          </Card>

          <Card className="hover:shadow-md transition-shadow cursor-pointer" onClick={() => navigate('/formularios/multix')}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Formularios MultiX</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">12</div>
              <p className="text-xs text-muted-foreground">
                6 mantención, 6 faena
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Acciones Rápidas</CardTitle>
              <CardDescription>
                Accede rápidamente a las funciones más utilizadas
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                onClick={() => navigate('/formularios/multix')} 
                className="w-full justify-start"
                variant="outline"
              >
                <FileText className="mr-2 h-4 w-4" />
                Crear Formulario MultiX
              </Button>
              <Button 
                onClick={() => navigate('/inmersiones')} 
                className="w-full justify-start"
                variant="outline"
              >
                <Waves className="mr-2 h-4 w-4" />
                Nueva Inmersión
              </Button>
              <Button 
                onClick={() => navigate('/operaciones')} 
                className="w-full justify-start"
                variant="outline"
              >
                <BarChart3 className="mr-2 h-4 w-4" />
                Ver Operaciones
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Formularios Disponibles</CardTitle>
              <CardDescription>
                Gestiona diferentes tipos de documentación
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <FileText className="h-8 w-8 text-blue-500" />
                <div>
                  <p className="text-sm font-medium">MultiX - Boletas de Redes</p>
                  <p className="text-xs text-muted-foreground">Mantención y Faena de Redes</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <p className="text-sm font-medium">HPT - Hoja de Permiso de Trabajo</p>
                  <p className="text-xs text-muted-foreground">Permisos de trabajo seguro</p>
                </div>
              </div>
              <div className="flex items-center space-x-4">
                <FileText className="h-8 w-8 text-orange-500" />
                <div>
                  <p className="text-sm font-medium">Anexo Bravo</p>
                  <p className="text-xs text-muted-foreground">Documentación de seguridad</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
