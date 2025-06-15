
import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Anchor, AlertTriangle } from "lucide-react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { useInmersiones } from '@/hooks/useInmersiones';
import { toast } from '@/hooks/use-toast';
import type { Inmersion } from "@/types/inmersion";

interface OperacionInfo {
  id: string;
  nombre: string;
}

interface InmersionDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  inmersion: Inmersion | null;
  operacion?: OperacionInfo;
  getEstadoBadgeColor: (estado: string) => string;
}

export const InmersionDetailModal: React.FC<InmersionDetailModalProps> = ({
  isOpen,
  onClose,
  inmersion,
  operacion,
  getEstadoBadgeColor,
}) => {
  const [currentInmersion, setCurrentInmersion] = useState(inmersion);
  const [newDepth, setNewDepth] = useState<string>('');
  const { updateInmersion, inmersiones } = useInmersiones();

  useEffect(() => {
    if (inmersion) {
      const updatedInmersion = inmersiones.find(i => i.inmersion_id === inmersion.inmersion_id);
      setCurrentInmersion(updatedInmersion || inmersion);
      setNewDepth(updatedInmersion?.current_depth?.toString() || inmersion.current_depth?.toString() || '');
    }
  }, [inmersion, inmersiones]);

  const handleUpdateDepth = async () => {
    if (!currentInmersion || newDepth === '') return;
    try {
      const updatedInmersionData = await updateInmersion({
        id: currentInmersion.inmersion_id,
        data: { current_depth: parseFloat(newDepth) },
      });
      setCurrentInmersion(updatedInmersionData as Inmersion);
      toast({
        title: "Profundidad actualizada",
        description: "La profundidad de la inmersión se ha actualizado.",
      });
    } catch (error) {
      console.error('Error updating depth:', error);
      toast({
        title: "Error",
        description: "No se pudo actualizar la profundidad.",
        variant: "destructive",
      });
    }
  };

  if (!currentInmersion) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-y-auto">
        <div className="space-y-6">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
              <Anchor className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-zinc-900">{currentInmersion.codigo}</h2>
              <p className="text-zinc-500">{operacion?.nombre || 'Sin operación'}</p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader><CardTitle>Información General</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {/* General info fields */}
              </CardContent>
            </Card>
            <Card>
              <CardHeader><CardTitle>Condiciones de Inmersión</CardTitle></CardHeader>
              <CardContent className="space-y-4">
                {/* Conditions fields */}
              </CardContent>
            </Card>
          </div>

          {currentInmersion.estado === 'en_progreso' && (
            <Card>
              <CardHeader><CardTitle>Actualización en Tiempo Real</CardTitle></CardHeader>
              <CardContent>
                {/* Real-time update fields */}
              </CardContent>
            </Card>
          )}

          {currentInmersion.security_alerts && currentInmersion.security_alerts.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Alertas de Seguridad</CardTitle></CardHeader>
              <CardContent>
                {/* Security alerts */}
              </CardContent>
            </Card>
          )}

          {currentInmersion.depth_history && currentInmersion.depth_history.length > 0 && (
            <Card>
              <CardHeader><CardTitle>Perfil de Profundidad</CardTitle></CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={currentInmersion.depth_history}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="timestamp" tickFormatter={(time) => new Date(time).toLocaleTimeString()} />
                    <YAxis reversed domain={[0, 'dataMax + 5']} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="depth" stroke="#8884d8" name="Profundidad (m)" />
                  </LineChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
