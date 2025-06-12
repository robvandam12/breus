
import { useState, useRef, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X, Loader2 } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useDropzone } from 'react-dropzone';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (photoUrl: string | null) => void;
  disabled?: boolean;
}

export const PhotoUpload = ({ currentPhoto, onPhotoChange, disabled = false }: PhotoUploadProps) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const { user } = useAuth();

  const uploadToSupabase = async (file: File): Promise<string> => {
    if (!user?.id) throw new Error('Usuario no autenticado');

    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/avatar.${fileExt}`;

    // Eliminar foto anterior si existe
    if (currentPhoto) {
      const oldPath = currentPhoto.split('/').slice(-2).join('/');
      await supabase.storage.from('profile-photos').remove([oldPath]);
    }

    const { error: uploadError, data } = await supabase.storage
      .from('profile-photos')
      .upload(fileName, file, { 
        upsert: true,
        contentType: file.type 
      });

    if (uploadError) throw uploadError;

    const { data: { publicUrl } } = supabase.storage
      .from('profile-photos')
      .getPublicUrl(fileName);

    return publicUrl;
  };

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    if (disabled || acceptedFiles.length === 0) return;

    const file = acceptedFiles[0];
    
    // Validar tipo de archivo
    if (!file.type.startsWith('image/')) {
      toast({
        title: "Error",
        description: "Solo se permiten archivos de imagen.",
        variant: "destructive",
      });
      return;
    }

    // Validar tamaño (máximo 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no puede ser mayor a 5MB.",
        variant: "destructive",
      });
      return;
    }

    setIsUploading(true);

    try {
      // Crear preview local
      const reader = new FileReader();
      reader.onload = (e) => {
        setPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);

      // Subir a Supabase
      const photoUrl = await uploadToSupabase(file);
      onPhotoChange(photoUrl);

      toast({
        title: "Foto actualizada",
        description: "La foto se ha cargado correctamente.",
      });
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: "Error al cargar la foto. Intenta nuevamente.",
        variant: "destructive",
      });
      setPreview(currentPhoto || null);
    } finally {
      setIsUploading(false);
    }
  }, [disabled, currentPhoto, onPhotoChange, user?.id]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'image/*': ['.jpeg', '.jpg', '.png', '.gif', '.webp']
    },
    multiple: false,
    disabled: disabled || isUploading
  });

  const handleRemovePhoto = async () => {
    if (!currentPhoto || isUploading) return;

    try {
      const path = currentPhoto.split('/').slice(-2).join('/');
      await supabase.storage.from('profile-photos').remove([path]);
      
      setPreview(null);
      onPhotoChange(null);
      
      toast({
        title: "Foto eliminada",
        description: "La foto ha sido eliminada correctamente.",
      });
    } catch (error) {
      console.error('Error removing photo:', error);
      toast({
        title: "Error",
        description: "Error al eliminar la foto.",
        variant: "destructive",
      });
    }
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
          <div
            {...getRootProps()}
            className={`
              border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-colors
              ${isDragActive 
                ? 'border-blue-400 bg-blue-50' 
                : 'border-gray-300 hover:border-gray-400'
              }
              ${(disabled || isUploading) && 'opacity-50 cursor-not-allowed'}
            `}
          >
            <input {...getInputProps()} />
            {isUploading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">Subiendo...</span>
              </div>
            ) : isDragActive ? (
              <p className="text-sm text-blue-600">Suelta la imagen aquí...</p>
            ) : (
              <div className="space-y-2">
                <Upload className="w-6 h-6 mx-auto text-gray-400" />
                <p className="text-sm text-gray-600">
                  Arrastra una imagen aquí o haz clic para seleccionar
                </p>
                <p className="text-xs text-gray-500">
                  PNG, JPG, GIF, WebP hasta 5MB
                </p>
              </div>
            )}
          </div>

          {preview && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={handleRemovePhoto}
              disabled={disabled || isUploading}
              className="w-full mt-2 text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4 mr-2" />
              Eliminar Foto
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};
