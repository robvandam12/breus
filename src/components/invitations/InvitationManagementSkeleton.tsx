
import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";
import { Card, CardContent, CardHeader } from "@/components/ui/card";

export const InvitationManagementSkeleton = () => {
  return (
    <div className="space-y-6">
      {/* Estadísticas */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        {Array.from({ length: 5 }).map((_, i) => (
          <Card key={i}>
            <CardContent className="p-4 text-center">
              <Skeleton className="h-8 w-8 mx-auto mb-2" />
              <Skeleton className="h-4 w-16 mx-auto" />
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Tabla de invitaciones */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Skeleton className="w-5 h-5" />
            <Skeleton className="h-6 w-48" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {/* Header de tabla */}
            <div className="grid grid-cols-7 gap-4 pb-2 border-b">
              {['Usuario', 'Email', 'Rol', 'Estado', 'Enviada', 'Expira', 'Acciones'].map((_, i) => (
                <Skeleton key={i} className="h-4 w-full" />
              ))}
            </div>
            
            {/* Filas de tabla */}
            {Array.from({ length: 5 }).map((_, rowIndex) => (
              <div key={rowIndex} className="grid grid-cols-7 gap-4 py-3 border-b">
                <div>
                  <Skeleton className="h-4 w-32 mb-1" />
                  <Skeleton className="h-3 w-16" />
                </div>
                <Skeleton className="h-4 w-40" />
                <Skeleton className="h-6 w-20 rounded-full" />
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-4 w-24" />
                <div className="flex items-center gap-2">
                  <Skeleton className="h-8 w-8" />
                  <Skeleton className="h-8 w-8" />
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
