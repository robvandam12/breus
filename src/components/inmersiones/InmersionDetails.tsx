
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Waves, Calendar, Clock, Users, Target, Thermometer, Eye, Waves as WavesIcon } from "lucide-react";
import { ValidationStatusCard } from "./ValidationStatusCard";
import { useInmersiones, type Inmersion } from "@/hooks/useInmersiones";
import { LoadingSpinner } from "@/components/ui/loading-spinner";

export const InmersionDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { inmersiones, loading, refreshInmersiones } = useInmersiones();
  const [inmersion, setInmersion] = useState<Inmersion | null>(null);

  useEffect(() => {
    if (inmersiones.length > 0 && id) {
      const foundInmersion = inmersiones.find(i => i.id === id);
      setInmersion(foundInmersion || null);
    }
  }, [inmersiones, id]);

  const handleStatusChange = async () => {
    await refreshInmersiones();
  };

  const getEstadoBadge = (estado: string) => {
    switch (estado) {
      case "planificada":
        return "bg-blue-100 text-blue-700";
      case "en_ejecucion":
        return "bg-amber-100 text-amber-700";
      case "completada":
        return "bg-emerald-100 text-emerald-700";
      case "cancelada":
        return "bg-red-100 text-red-700";
      default:
        return "bg-zinc-100 text-zinc-700";
    }
  };

  const formatEstado = (estado: string) => {
    const estados = {
      'planificada': 'Planificada',
      'en_ejecucion': 'En Ejecución',
      'completada': 'Completada',
      'cancelada': 'Cancelada'
    };
    return estados[estado as keyof typeof estados] || estado;
  };

  if (loading) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <LoadingSpinner text="Cargando detalles de inmersión..." />
      </div>
    );
  }

  if (!inmersion) {
    return (
      <div className="max-w-6xl mx-auto p-6">
        <Card>
          <CardContent className="p-8 text-center">
            <h2 className="text-xl font-semibold mb-2">Inmersión no encontrada</h2>
            <p className="text-zinc-500 mb-4">La inmersión solicitada no existe.</p>
            <Button onClick={() => navigate('/operaciones/inmersiones')}>
              Volver a Inmersiones
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="flex items-center gap-3 mb-6">
        <Button 
          variant="outline" 
          size="sm"
          onClick={() => navigate('/operaciones/inmersiones')}
          className="flex items-center gap-2"
        >
          <ArrowLeft className="w-4 h-4" />
          Volver
        </Button>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
            <Waves className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-zinc-900">{inmersion.codigo}</h1>
            <p className="text-zinc-500">{inmersion.operacion_nombre}</p>
          </div>
        </div>
        <div className="flex-1" />
        <Badge variant="secondary" className={getEstadoBadge(inmersion.estado)}>
          {formatEstado(inmersion.estado)}
        </Badge>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Información General</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3">
                  <Calendar className="w-5 h-5 text-zinc-500" />
                  <div>
                    <p className="text-sm text-zinc-500">Fecha</p>
                    <p className="font-medium">{inmersion.fecha_inmersion}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="w-5 h-5 text-zinc-500" />
                  <div>
                    <p className="text-sm text-zinc-500">Horario</p>
                    <p className="font-medium">
                      {inmersion.hora_inicio} {inmersion.hora_fin && `- ${inmersion.hora_fin}`}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-zinc-500" />
                  <div>
                    <p className="text-sm text-zinc-500">Buzo Principal</p>
                    <p className="font-medium">{inmersion.buzo_principal}</p>
                  </div>
                </div>
                {inmersion.buzo_asistente && (
                  <div className="flex items-center gap-3">
                    <Users className="w-5 h-5 text-zinc-500" />
                    <div>
                      <p className="text-sm text-zinc-500">Buzo Asistente</p>
                      <p className="font-medium">{inmersion.buzo_asistente}</p>
                    </div>
                  </div>
                )}
                <div className="flex items-center gap-3">
                  <Users className="w-5 h-5 text-zinc-500" />
                  <div>
                    <p className="text-sm text-zinc-500">Supervisor</p>
                    <p className="font-medium">{inmersion.supervisor}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Objetivo de la Inmersión
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-zinc-700">{inmersion.objetivo}</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Condiciones Ambientales</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Waves className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Profundidad</p>
                    <p className="font-medium">{inmersion.profundidad_max} m</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                    <Thermometer className="w-5 h-5 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Temperatura</p>
                    <p className="font-medium">{inmersion.temperatura_agua}°C</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                    <Eye className="w-5 h-5 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Visibilidad</p>
                    <p className="font-medium">{inmersion.visibilidad} m</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <WavesIcon className="w-5 h-5 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-zinc-500">Corriente</p>
                    <p className="font-medium">{inmersion.corriente}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {inmersion.observaciones && (
            <Card>
              <CardHeader>
                <CardTitle>Observaciones</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-zinc-700">{inmersion.observaciones}</p>
              </CardContent>
            </Card>
          )}
        </div>

        <div className="space-y-6">
          <ValidationStatusCard
            operacionId={inmersion.operacion_id}
            inmersionId={inmersion.id}
            currentStatus={inmersion.estado}
            onStatusChange={handleStatusChange}
          />

          <Card>
            <CardHeader>
              <CardTitle>Estado de Validaciones</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm">HPT Validado</span>
                <Badge variant="outline" className={inmersion.hpt_validado ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                  {inmersion.hpt_validado ? 'Sí' : 'No'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Anexo Bravo Validado</span>
                <Badge variant="outline" className={inmersion.anexo_bravo_validado ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                  {inmersion.anexo_bravo_validado ? 'Sí' : 'No'}
                </Badge>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};
