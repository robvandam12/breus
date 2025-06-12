
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useStorage } from '@/hooks/useStorage';
import { ImageUpload } from '@/components/ui/image-upload';

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (photoUrl: string | null) => void;
  disabled?: boolean;
}

export const PhotoUpload = ({ currentPhoto, onPhotoChange, disabled = false }: PhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const { uploadFile } = useStorage();

  const handleImageSelect = async (file: File) => {
    setIsUploading(true);

    try {
      const photoUrl = await uploadFile(file, {
        bucket: 'profile-photos',
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });

      if (photoUrl) {
        setPreview(photoUrl);
        onPhotoChange(photoUrl);
        
        toast({
          title: "Foto cargada",
          description: "La foto de perfil se ha cargado correctamente.",
        });
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: "Error al cargar la foto. Intenta nuevamente.",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoChange(null);
  };

  return (
    <div className="space-y-4">
      <Label>Foto de Perfil</Label>
      
      <div className="flex items-center gap-4">
        <Avatar className="w-20 h-20">
          <AvatarImage src={preview || undefined} alt="Foto de perfil" />
          <AvatarFallback className="bg-gray-100">
            <Camera className="w-8 h-8 text-gray-400" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1">
          {!preview ? (
            <ImageUpload
              onImageSelect={handleImageSelect}
              className="h-32"
              maxSize={5 * 1024 * 1024}
              accept={['image/jpeg', 'image/png', 'image/gif', 'image/webp']}
            />
          ) : (
            <div className="flex flex-col gap-2">
              <div className="text-sm text-green-600 font-medium">
                ✓ Foto cargada correctamente
              </div>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemovePhoto}
                disabled={disabled || isUploading}
                className="flex items-center gap-2 text-red-600 w-fit"
              >
                <X className="w-4 h-4" />
                Eliminar foto
              </Button>
            </div>
          )}
        </div>
      </div>

      {isUploading && (
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          Subiendo foto...
        </div>
      )}

      <p className="text-sm text-gray-500">
        Formatos permitidos: JPG, PNG, GIF, WebP. Tamaño máximo: 5MB.
      </p>
    </div>
  );
};
