
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useWeather } from '@/hooks/useWeather';
import { WeatherWidgetSkeleton } from './skeletons/WeatherWidgetSkeleton';
import { Thermometer, Wind, Eye, Waves, Navigation, CloudSun, AlertCircle } from 'lucide-react';

const WeatherWidget = () => {
    const { weatherData, isLoading, error } = useWeather();

    if (isLoading) {
        return <WeatherWidgetSkeleton />;
    }

    if (error) {
        return (
            <Card className="h-full flex flex-col items-center justify-center">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-base">
                        <AlertCircle className="w-5 h-5 text-red-500" />
                        Error al cargar el clima
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-sm text-muted-foreground">{error.message}</p>
                </CardContent>
            </Card>
        );
    }
    
    if (!weatherData) {
         return <WeatherWidgetSkeleton />;
    }

    return (
        <Card className="h-full flex flex-col">
            <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                    <CloudSun className="w-5 h-5" />
                    Condiciones Climáticas
                </CardTitle>
                <CardDescription>{weatherData.location}</CardDescription>
            </CardHeader>
            <CardContent className="flex-grow grid grid-cols-2 gap-x-4 gap-y-5">
                <div className="flex items-start gap-3">
                    <Thermometer className="w-5 h-5 mt-1 text-blue-500 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-muted-foreground">Agua</p>
                        <p className="font-bold text-xl">{weatherData.waterTemp}°C</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Thermometer className="w-5 h-5 mt-1 text-orange-500 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-muted-foreground">Aire</p>
                        <p className="font-bold text-xl">{weatherData.airTemp}°C</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Wind className="w-5 h-5 mt-1 text-gray-500 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-muted-foreground">Viento</p>
                        <p className="font-bold text-lg">{weatherData.windSpeed} km/h</p>
                    </div>
                </div>
                <div className="flex items-start gap-3">
                    <Navigation className="w-5 h-5 mt-1 text-gray-500 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-muted-foreground">Dirección</p>
                        <p className="font-bold text-lg">{weatherData.windDirection}</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Eye className="w-5 h-5 mt-1 text-purple-500 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-muted-foreground">Visibilidad</p>
                        <p className="font-bold text-lg">{weatherData.visibility} km</p>
                    </div>
                </div>
                 <div className="flex items-start gap-3">
                    <Waves className="w-5 h-5 mt-1 text-cyan-500 flex-shrink-0" />
                    <div>
                        <p className="text-sm text-muted-foreground">Oleaje</p>
                        <p className="font-bold text-lg">{weatherData.waveHeight} m</p>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default React.memo(WeatherWidget);
