import { useState, useEffect, useRef } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { MapPin, Calendar, Users, Settings } from "lucide-react";
import { useOperaciones } from "@/hooks/useOperaciones";

declare global {
  interface Window {
    mapboxgl?: any;
  }
}

export const OperacionesMapView = () => {
  const { operaciones, isLoading } = useOperaciones();
  const mapContainer = useRef<HTMLDivElement>(null);
  const map = useRef<any>(null);
  const [mapboxToken, setMapboxToken] = useState('');
  const [mapboxLoaded, setMapboxLoaded] = useState(false);
  const [mapInitialized, setMapInitialized] = useState(false);

  // Cargar Mapbox GL JS
  useEffect(() => {
    if (window.mapboxgl) {
      setMapboxLoaded(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.js';
    script.onload = () => setMapboxLoaded(true);
    document.head.appendChild(script);

    const link = document.createElement('link');
    link.href = 'https://api.mapbox.com/mapbox-gl-js/v2.15.0/mapbox-gl.css';
    link.rel = 'stylesheet';
    document.head.appendChild(link);

    return () => {
      if (script.parentNode) script.parentNode.removeChild(script);
      if (link.parentNode) link.parentNode.removeChild(link);
    };
  }, []);

  // Inicializar mapa cuando Mapbox esté cargado y tengamos token
  useEffect(() => {
    if (!mapboxLoaded || !mapboxToken || !mapContainer.current || mapInitialized) return;

    const mapboxgl = window.mapboxgl;
    if (!mapboxgl) return;

    try {
      mapboxgl.accessToken = mapboxToken;
      
      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/light-v11',
        projection: 'globe',
        zoom: 6,
        center: [-71.542969, -35.675147], // Chile central
        pitch: 45,
      });

      // Agregar controles de navegación
      map.current.addControl(
        new mapboxgl.NavigationControl({
          visualizePitch: true,
        }),
        'top-right'
      );

      // Configurar efectos atmosféricos
      map.current.on('style.load', () => {
        map.current?.setFog({
          color: 'rgb(186, 210, 235)',
          'high-color': 'rgb(36, 92, 223)',
          'horizon-blend': 0.02,
          'space-color': 'rgb(11, 11, 25)',
          'star-intensity': 0.6,
        });
      });

      // Agregar marcadores para operaciones
      operaciones.forEach((operacion, index) => {
        if (!mapboxgl) return;
        
        // Coordenadas simuladas para diferentes regiones de Chile
        const coords = [
          [-71.542969, -35.675147], // Santiago
          [-73.24776, -39.81422],   // Temuco
          [-72.59842, -45.86508],   // Coyhaique
          [-70.91228, -53.15483],   // Punta Arenas
          [-70.30829, -18.47649],   // Arica
        ];
        
        const coord = coords[index % coords.length];
        
        // Crear popup con información
        const popup = new mapboxgl.Popup({ offset: 25 }).setHTML(`
          <div class="p-2">
            <h3 class="font-bold text-sm">${operacion.nombre}</h3>
            <p class="text-xs text-gray-600">Código: ${operacion.codigo}</p>
            <p class="text-xs text-gray-600">Estado: ${operacion.estado}</p>
            <p class="text-xs text-gray-600">Fecha: ${new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}</p>
          </div>
        `);

        // Crear marcador
        const marker = new mapboxgl.Marker({
          color: operacion.estado === 'activa' ? '#22c55e' : '#6b7280'
        })
          .setLngLat(coord)
          .setPopup(popup)
          .addTo(map.current!);
      });

      setMapInitialized(true);
    } catch (error) {
      console.error('Error initializing map:', error);
    }

    return () => {
      map.current?.remove();
    };
  }, [mapboxLoaded, mapboxToken, operaciones, mapInitialized]);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!mapboxToken) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            Configuración de Mapbox
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label htmlFor="mapbox-token">Token de Mapbox</Label>
            <Input
              id="mapbox-token"
              type="password"
              placeholder="Ingrese su token público de Mapbox"
              value={mapboxToken}
              onChange={(e) => setMapboxToken(e.target.value)}
            />
            <p className="text-xs text-gray-500 mt-1">
              Obtén tu token en <a href="https://mapbox.com/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">https://mapbox.com/</a>
            </p>
          </div>
          <Button 
            onClick={() => {/* Token se guarda automáticamente */}}
            disabled={!mapboxToken}
          >
            Configurar Mapa
          </Button>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="w-5 h-5" />
            Mapa de Operaciones
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            ref={mapContainer} 
            className="w-full h-96 rounded-xl border border-gray-200"
            style={{ minHeight: '400px' }}
          />
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {operaciones.map((operacion) => (
          <Card key={operacion.id} className="hover:shadow-md transition-shadow">
            <CardContent className="p-4">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-medium text-sm">{operacion.nombre}</h3>
                <Badge variant={operacion.estado === 'activa' ? 'default' : 'secondary'}>
                  {operacion.estado}
                </Badge>
              </div>
              <div className="space-y-1 text-xs text-gray-600">
                <div className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  <span>{new Date(operacion.fecha_inicio).toLocaleDateString('es-CL')}</span>
                </div>
                <div className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <span>Región de operación</span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="w-3 h-3" />
                  <span>Equipo asignado</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};
