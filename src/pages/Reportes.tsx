
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BarChart3, FileText } from "lucide-react";

export default function Reportes() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Reportes" 
            subtitle="Análisis y reportes del sistema" 
            icon={BarChart3} 
          >
            <Button>
              <FileText className="w-4 h-4 mr-2" />
              Generar Reporte
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto bg-white">
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <BarChart3 className="w-5 h-5 text-blue-600" />
                    Centro de Reportes
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <div className="space-y-4">
                    <BarChart3 className="w-16 h-16 text-blue-600 mx-auto" />
                    <h3 className="text-lg font-semibold">Análisis y Reportes</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Genere reportes detallados y análisis de las operaciones de buceo.
                    </p>
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
