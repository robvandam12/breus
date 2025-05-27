
import React from 'react';
import { SidebarProvider } from "@/components/ui/sidebar";
import { RoleBasedSidebar } from "@/components/navigation/RoleBasedSidebar";
import { Header } from "@/components/layout/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Book, Plus } from "lucide-react";

export default function BitacoraBuzo() {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-white">
        <RoleBasedSidebar />
        <main className="flex-1 flex flex-col">
          <Header 
            title="Bitácora Buzo" 
            subtitle="Registro personal de inmersiones" 
            icon={Book} 
          >
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Bitácora
            </Button>
          </Header>
          
          <div className="flex-1 overflow-auto bg-gray-50">
            <div className="p-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Book className="w-5 h-5 text-blue-600" />
                    Bitácora de Buzo
                  </CardTitle>
                </CardHeader>
                <CardContent className="text-center py-12">
                  <div className="space-y-4">
                    <Book className="w-16 h-16 text-blue-600 mx-auto" />
                    <h3 className="text-lg font-semibold">Bitácoras de Buzo</h3>
                    <p className="text-gray-600 max-w-md mx-auto">
                      Registre y gestione las bitácoras personales de inmersiones.
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
