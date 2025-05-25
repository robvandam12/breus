
import { useState, useEffect } from 'react';
import { Badge } from '@/components/ui/badge';
import { CloudOff, Cloud } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

export const OfflineIndicator = () => {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [showIndicator, setShowIndicator] = useState(false);

  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      setShowIndicator(true);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <Cloud className="w-4 h-4 text-green-600" />
            <span>Conexión restaurada</span>
          </div>
        ),
        description: "Ya puedes sincronizar tus datos.",
      });
      
      // Hide indicator after 3 seconds when online
      setTimeout(() => setShowIndicator(false), 3000);
    };

    const handleOffline = () => {
      setIsOnline(false);
      setShowIndicator(true);
      toast({
        title: (
          <div className="flex items-center gap-2">
            <CloudOff className="w-4 h-4 text-red-600" />
            <span>Sin conexión</span>
          </div>
        ),
        description: "Trabajando en modo offline. Los datos se sincronizarán cuando vuelvas a conectarte.",
        variant: "destructive",
      });
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Show indicator initially if offline
    if (!navigator.onLine) {
      setShowIndicator(true);
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  if (!showIndicator) return null;

  return (
    <Badge
      variant={isOnline ? "default" : "destructive"}
      className={`fixed top-4 left-1/2 transform -translate-x-1/2 z-50 transition-all duration-300 ios-card ${
        isOnline ? 'bg-green-600' : 'bg-red-600'
      }`}
    >
      {isOnline ? (
        <>
          <Cloud className="w-3 h-3 mr-1" />
          En línea
        </>
      ) : (
        <>
          <CloudOff className="w-3 h-3 mr-1" />
          Sin conexión
        </>
      )}
    </Badge>
  );
};
