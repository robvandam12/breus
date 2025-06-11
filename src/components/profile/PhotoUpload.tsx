
import { useState, useRef } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  currentPhotoUrl?: string;
  onPhotoChange: (photoUrl: string | null) => void;
  userName?: string;
}

export const PhotoUpload = ({ currentPhotoUrl, onPhotoChange, userName = "Usuario" }: PhotoUploadProps) => {
  const [preview, setPreview] = useState<string | null>(currentPhotoUrl || null);
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Por favor selecciona un archivo de imagen válido",
        variant: "destructive"
      });
      return;
    }

    // Validar tamaño (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no puede ser mayor a 5MB",
        variant: "destructive"
      });
      return;
    }

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onPhotoChange(result);
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex flex-col items-center space-y-4">
          <div className="relative">
            <Avatar className="w-24 h-24">
              <AvatarImage src={preview || undefined} alt="Foto de perfil" />
              <AvatarFallback className="text-lg">
                {getInitials(userName)}
              </AvatarFallback>
            </Avatar>
            {preview && (
              <Button
                variant="destructive"
                size="sm"
                className="absolute -top-2 -right-2 rounded-full w-6 h-6 p-0"
                onClick={handleRemovePhoto}
              >
                <X className="w-3 h-3" />
              </Button>
            )}
          </div>

          <div className="text-center">
            <h3 className="font-semibold">Foto de Perfil</h3>
            <p className="text-sm text-gray-600">
              Sube una foto para tu perfil profesional
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={triggerFileInput}
              disabled={isUploading}
              className="flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              {preview ? 'Cambiar Foto' : 'Subir Foto'}
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleFileSelect}
            className="hidden"
          />

          <p className="text-xs text-gray-500 text-center">
            Formatos soportados: JPG, PNG, GIF<br />
            Tamaño máximo: 5MB
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
