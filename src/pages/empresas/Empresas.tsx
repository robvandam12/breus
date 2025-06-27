
import React from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Building2, Users, MapPin } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Empresas = () => {
  return (
    <MainLayout
      title="Empresas"
      subtitle="Gestión de salmoneras, contratistas y sitios"
      icon={Building2}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="w-5 h-5" />
              Salmoneras
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Gestionar empresas salmoneras del sistema
            </p>
            <Button asChild className="w-full">
              <Link to="/empresas/salmoneras">Ver Salmoneras</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Contratistas
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Gestionar empresas de servicios contratistas
            </p>
            <Button asChild className="w-full">
              <Link to="/empresas/contratistas">Ver Contratistas</Link>
            </Button>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="w-5 h-5" />
              Sitios
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Gestionar sitios y ubicaciones
            </p>
            <Button asChild className="w-full">
              <Link to="/empresas/sitios">Ver Sitios</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    </MainLayout>
  );
};

export default Empresas;
