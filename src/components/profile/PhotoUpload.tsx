
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Camera, Upload, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (photoUrl: string) => void;
}

export const PhotoUpload = ({ currentPhoto, onPhotoChange }: PhotoUploadProps) => {
  const [preview, setPreview] = useState<string>(currentPhoto || '');
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
        variant: "destructive",
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no puede ser mayor a 5MB",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    // Crear preview
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setPreview(result);
      onPhotoChange(result);
      setIsUploading(false);
      
      toast({
        title: "Foto actualizada",
        description: "Tu foto de perfil ha sido actualizada",
      });
    };
    reader.readAsDataURL(file);
  };

  const handleRemovePhoto = () => {
    setPreview('');
    onPhotoChange('');
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label>Foto de Perfil</Label>
      
      <div className="flex items-center gap-4">
        {/* Preview de la foto */}
        <div className="relative">
          <div className="w-24 h-24 rounded-full border-2 border-gray-200 overflow-hidden bg-gray-100 flex items-center justify-center">
            {preview ? (
              <img
                src={preview}
                alt="Foto de perfil"
                className="w-full h-full object-cover"
              />
            ) : (
              <Camera className="w-8 h-8 text-gray-400" />
            )}
          </div>
          
          {preview && (
            <button
              type="button"
              onClick={handleRemovePhoto}
              className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors"
            >
              <X className="w-3 h-3" />
            </button>
          )}
        </div>

        {/* Botones de acción */}
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={triggerFileInput}
            disabled={isUploading}
            className="flex items-center gap-2"
          >
            <Upload className="w-4 h-4" />
            {isUploading ? 'Subiendo...' : preview ? 'Cambiar Foto' : 'Subir Foto'}
          </Button>
          
          <p className="text-xs text-gray-500">
            JPG, PNG o GIF. Máximo 5MB.
          </p>
        </div>
      </div>

      {/* Input oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        className="hidden"
      />
    </div>
  );
};
