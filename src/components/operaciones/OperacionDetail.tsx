import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, ListChecks, Users } from "lucide-react";
import { OperacionInfo } from "@/components/operaciones/OperacionInfo";
import { OperacionDocuments } from "@/components/operaciones/OperacionDocuments";
import { OperacionInmersiones } from "@/components/operaciones/OperacionInmersiones";
import { OperacionTimeline } from "@/components/operaciones/OperacionTimeline";
import { OperacionTeamManagerEnhanced } from "@/components/operaciones/OperacionTeamManagerEnhanced";
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";

interface OperacionDetailProps {
  operacion: any;
}

const OperacionDetail = ({ operacion }: OperacionDetailProps) => {
  const [activeTab, setActiveTab] = useState("general");

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <motion.main
          className="flex-1 flex flex-col bg-white"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <Header
            title={operacion.nombre}
            subtitle={`Detalles de la operación ${operacion.codigo}`}
            icon={Calendar}
          />

          <div className="space-y-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="general">General</TabsTrigger>
                <TabsTrigger value="equipo">Equipo de Buceo</TabsTrigger>
                <TabsTrigger value="documentos">Documentos</TabsTrigger>
                <TabsTrigger value="inmersiones">Inmersiones</TabsTrigger>
                <TabsTrigger value="timeline">Timeline</TabsTrigger>
              </TabsList>

              <TabsContent value="general" className="space-y-6">
                <OperacionInfo operacion={operacion} />
                <OperacionDocuments operacionId={operacion.id} />
              </TabsContent>

              <TabsContent value="equipo" className="space-y-6">
                <OperacionTeamManagerEnhanced 
                  operacionId={operacion.id} 
                  salmoneraId={operacion.salmonera_id || undefined}
                  contratistaId={operacion.contratista_id || undefined}
                />
              </TabsContent>

              <TabsContent value="documentos" className="space-y-6">
                <OperacionDocuments operacionId={operacion.id} />
              </TabsContent>

              <TabsContent value="inmersiones" className="space-y-6">
                <OperacionInmersiones operacionId={operacion.id} />
              </TabsContent>

              <TabsContent value="timeline" className="space-y-6">
                <OperacionTimeline operacionId={operacion.id} />
              </TabsContent>
            </Tabs>
          </div>
        </motion.main>
      </div>
    </SidebarProvider>
  );
};

export default OperacionDetail;
