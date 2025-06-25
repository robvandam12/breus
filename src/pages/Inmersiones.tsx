
import React, { useState } from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Anchor } from "lucide-react";
import { InmersionesDataTable } from "@/components/inmersiones/InmersionesDataTable";
import { IndependentImmersionManager } from "@/components/inmersiones/IndependentImmersionManager";
import { UniversalCompanySelector } from "@/components/common/UniversalCompanySelector";
import { useCompanyContext } from "@/hooks/useCompanyContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { AlertTriangle } from "lucide-react";

const Inmersiones = () => {
  const { context, requiresCompanySelection } = useCompanyContext();
  const [activeTab, setActiveTab] = useState("all");

  return (
    <MainLayout
      title="Inmersiones"
      subtitle="Gestión de inmersiones y operaciones de buceo"
      icon={Anchor}
    >
      <div className="space-y-6">
        {/* Selector de empresa para superusers */}
        {context.isSuperuser && (
          <UniversalCompanySelector
            title="Seleccionar Empresa"
            description="Selecciona la empresa para gestionar sus inmersiones"
          />
        )}

        {/* Alert si se requiere selección de empresa */}
        {requiresCompanySelection() && (
          <Alert className="border-yellow-200 bg-yellow-50">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription className="text-yellow-800">
              <strong>Selección de empresa requerida:</strong> Selecciona una empresa para gestionar las inmersiones.
            </AlertDescription>
          </Alert>
        )}

        {/* Contenido principal solo si no se requiere selección de empresa */}
        {!requiresCompanySelection() && (
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="all">Todas las Inmersiones</TabsTrigger>
              <TabsTrigger value="independent">Inmersiones Independientes</TabsTrigger>
            </TabsList>
            
            <TabsContent value="all" className="space-y-6">
              <InmersionesDataTable />
            </TabsContent>
            
            <TabsContent value="independent" className="space-y-6">
              <IndependentImmersionManager />
            </TabsContent>
          </Tabs>
        )}
      </div>
    </MainLayout>
  );
};

export default Inmersiones;
