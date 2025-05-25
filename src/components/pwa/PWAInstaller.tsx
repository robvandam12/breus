
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Download, Smartphone, Monitor, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

export const PWAInstaller = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isInstallable, setIsInstallable] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);

  useEffect(() => {
    // Check if app is already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setIsInstalled(true);
      return;
    }

    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
      setIsInstallable(true);
      setShowPrompt(true);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsInstallable(false);
      setShowPrompt(false);
      toast({
        title: "¡App instalada!",
        description: "Breus se ha instalado correctamente en tu dispositivo.",
      });
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      toast({
        title: "Instalando...",
        description: "La aplicación se está instalando en tu dispositivo.",
      });
    }
    
    setDeferredPrompt(null);
    setShowPrompt(false);
  };

  const detectDevice = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    if (/android/.test(userAgent)) return 'Android';
    if (/iphone|ipad|ipod/.test(userAgent)) return 'iOS';
    return 'Desktop';
  };

  const getInstallInstructions = () => {
    const device = detectDevice();
    switch (device) {
      case 'iOS':
        return {
          icon: <Smartphone className="w-5 h-5" />,
          title: 'Instalar en iOS',
          steps: [
            'Abre Breus en Safari',
            'Toca el botón de compartir',
            'Selecciona "Añadir a pantalla de inicio"',
            'Toca "Añadir" para confirmar'
          ]
        };
      case 'Android':
        return {
          icon: <Smartphone className="w-5 h-5" />,
          title: 'Instalar en Android',
          steps: [
            'Abre Breus en Chrome',
            'Toca el menú (3 puntos)',
            'Selecciona "Instalar aplicación"',
            'Toca "Instalar" para confirmar'
          ]
        };
      default:
        return {
          icon: <Monitor className="w-5 h-5" />,
          title: 'Instalar en Escritorio',
          steps: [
            'Abre Breus en Chrome o Edge',
            'Busca el ícono de instalación en la barra de direcciones',
            'Haz clic en "Instalar"',
            'Confirma la instalación'
          ]
        };
    }
  };

  if (isInstalled || !showPrompt) return null;

  const instructions = getInstallInstructions();

  return (
    <Card className="fixed bottom-4 right-4 w-80 z-50 shadow-lg border-2 border-blue-200 bg-gradient-to-br from-blue-50 to-indigo-50">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2 text-sm">
            <Download className="w-4 h-4 text-blue-600" />
            Instalar Breus
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setShowPrompt(false)}
            className="h-6 w-6 p-0"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-gray-600">
          Instala Breus para acceso offline y mejor rendimiento
        </p>
        
        {isInstallable && deferredPrompt ? (
          <Button 
            onClick={handleInstallClick}
            className="w-full bg-blue-600 hover:bg-blue-700"
          >
            <Download className="w-4 h-4 mr-2" />
            Instalar Ahora
          </Button>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center gap-2 text-sm font-medium">
              {instructions.icon}
              {instructions.title}
            </div>
            <ol className="text-xs text-gray-600 space-y-1 pl-4">
              {instructions.steps.map((step, index) => (
                <li key={index} className="list-decimal">{step}</li>
              ))}
            </ol>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
