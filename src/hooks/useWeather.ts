
import { useState, useEffect } from 'react';

export interface WeatherData {
    location: string;
    waterTemp: number;
    airTemp: number;
    windSpeed: number;
    windDirection: string;
    visibility: number; // in km
    waveHeight: number; // in meters
}

const mockWeatherData: WeatherData = {
    location: 'Sitio de Buceo A',
    waterTemp: 14,
    airTemp: 18,
    windSpeed: 12, // km/h
    windDirection: 'SO',
    visibility: 8,
    waveHeight: 0.8,
};

export const useWeather = (siteId?: string) => {
    const [weatherData, setWeatherData] = useState<WeatherData | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<Error | null>(null);

    useEffect(() => {
        setIsLoading(true);
        setError(null);
        const timer = setTimeout(() => {
            // En una aplicación real, aquí se haría una llamada a una API externa de clima
            // usando el siteId si estuviera disponible.
            try {
                setWeatherData(mockWeatherData);
            } catch (e) {
                setError(e instanceof Error ? e : new Error('An unknown error occurred'));
            } finally {
                setIsLoading(false);
            }
        }, 1500); // Simular retraso de red

        return () => clearTimeout(timer);
    }, [siteId]);

    return { weatherData, isLoading, error };
};
