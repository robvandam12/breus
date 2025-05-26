
import { useState } from 'react';
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Calendar, Clock, Users, MapPin } from "lucide-react";
import { CreateInmersionFormEnhanced } from "@/components/inmersiones/CreateInmersionFormEnhanced";
import { useInmersiones } from "@/hooks/useInmersiones";
import { LoadingSpinner } from "@/components/ui/loading-spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Inmersiones() {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const { inmersiones, isLoading, createInmersion } = useInmersiones();

  const handleCreateInmersion = async (data: any) => {
    await createInmersion(data);
    setShowCreateForm(false);
  };

  const getEstadoBadge = (estado: string) => {
    const variants = {
      planificada: 'default',
      en_progreso: 'secondary', 
      completada: 'destructive',
      cancelada: 'outline'
    };
    return variants[estado as keyof typeof variants] || 'default';
  };

  if (showCreateForm) {
    return (
      <CreateInmersionFormEnhanced
        onSubmit={handleCreateInmersion}
        onCancel={() => setShowCreateForm(false)}
      />
    );
  }

  return (
    <>
      {/* Header */}
      <header className="ios-blur border-b border-border/20 sticky top-0 z-50">
        <div className="flex h-16 md:h-18 items-center px-4 md:px-8">
          <SidebarTrigger className="mr-4 touch-target ios-button p-2 rounded-xl hover:bg-gray-100 transition-colors" />
          <div className="flex items-center gap-3">
            <Calendar className="w-6 h-6 text-zinc-600" />
            <div>
              <h1 className="text-xl font-semibold text-zinc-900">Inmersiones</h1>
              <p className="text-sm text-zinc-500">Gestionar inmersiones de buceo</p>
            </div>
          </div>
          <div className="ml-auto">
            <Button onClick={() => setShowCreateForm(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Nueva Inmersión
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="flex-1 overflow-auto">
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardHeader className="space-y-2">
                    <Skeleton className="h-4 w-2/3" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Skeleton className="h-3 w-full" />
                    <Skeleton className="h-3 w-3/4" />
                    <Skeleton className="h-3 w-1/2" />
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inmersiones.map((inmersion) => (
                <Card key={inmersion.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{inmersion.codigo}</CardTitle>
                      <Badge variant={getEstadoBadge(inmersion.estado)}>
                        {inmersion.estado}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600">{inmersion.objetivo}</p>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center gap-2 text-sm">
                      <Calendar className="w-4 h-4 text-gray-500" />
                      <span>{inmersion.fecha_inmersion}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span>{inmersion.hora_inicio}</span>
                      {inmersion.hora_fin && <span>- {inmersion.hora_fin}</span>}
                    </div>
                    <div className="flex items-center gap-2 text-sm">
                      <Users className="w-4 h-4 text-gray-500" />
                      <span>{inmersion.buzo_principal}</span>
                    </div>
                    {inmersion.profundidad_maxima && (
                      <div className="flex items-center gap-2 text-sm">
                        <MapPin className="w-4 h-4 text-gray-500" />
                        <span>{inmersion.profundidad_maxima}m de profundidad</span>
                      </div>
                    )}
                    <div className="flex items-center gap-2 text-xs">
                      <Badge variant={inmersion.hpt_validado ? "default" : "secondary"}>
                        HPT {inmersion.hpt_validado ? "✓" : "⏳"}
                      </Badge>
                      <Badge variant={inmersion.anexo_bravo_validado ? "default" : "secondary"}>
                        Anexo {inmersion.anexo_bravo_validado ? "✓" : "⏳"}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}

          {!isLoading && inmersiones.length === 0 && (
            <div className="text-center py-12">
              <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No hay inmersiones registradas
              </h3>
              <p className="text-gray-500 mb-6">
                Comienza creando tu primera inmersión de buceo.
              </p>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Nueva Inmersión
              </Button>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
