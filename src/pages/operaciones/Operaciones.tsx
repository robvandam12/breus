
import React, { useState } from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Button } from "@/components/ui/button";
import { Plus, Calendar, Map, CalendarDays } from "lucide-react";
import { OperacionesManager } from "@/components/operaciones/OperacionesManager";
import { CreateOperacionForm } from "@/components/operaciones/CreateOperacionForm";
import { OperacionesMapView } from "@/components/operaciones/OperacionesMapView";
import { OperacionesCalendarView } from "@/components/operaciones/OperacionesCalendarView";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function Operaciones() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [activeView, setActiveView] = useState('lista');

  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Operaciones" 
            subtitle="Gestión de operaciones de buceo y documentos asociados" 
            icon={Calendar} 
          >
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto">
            <div className="p-6">
              <Tabs value={activeView} onValueChange={setActiveView}>
                <TabsList className="grid w-full grid-cols-3 max-w-md">
                  <TabsTrigger value="lista">Lista</TabsTrigger>
                  <TabsTrigger value="mapa">Mapa</TabsTrigger>
                  <TabsTrigger value="calendario">Calendario</TabsTrigger>
                </TabsList>

                <TabsContent value="lista" className="mt-6">
                  <OperacionesManager />
                </TabsContent>

                <TabsContent value="mapa" className="mt-6">
                  <OperacionesMapView />
                </TabsContent>

                <TabsContent value="calendario" className="mt-6">
                  <OperacionesCalendarView />
                </TabsContent>
              </Tabs>

              {/* Create Form Modal */}
              {showCreateForm && (
                <CreateOperacionForm 
                  onClose={() => setShowCreateForm(false)}
                />
              )}
            </div>
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
}
