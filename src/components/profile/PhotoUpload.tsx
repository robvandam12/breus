
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Camera, Upload, X, ImageIcon } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import { useStorage } from '@/hooks/useStorage';
import { useAuth } from '@/hooks/useAuth';

interface PhotoUploadProps {
  currentPhoto?: string;
  onPhotoChange: (photoUrl: string | null) => void;
  disabled?: boolean;
}

export const PhotoUpload = ({ currentPhoto, onPhotoChange, disabled = false }: PhotoUploadProps) => {
  const { user } = useAuth();
  const { uploadFile, deleteFile, uploading } = useStorage();
  const [preview, setPreview] = useState<string | null>(currentPhoto || null);
  const [isDragOver, setIsDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (file: File) => {
    if (!user?.id) {
      toast({
        title: "Error",
        description: "Usuario no autenticado",
        variant: "destructive",
      });
      return;
    }

    try {
      const fileName = `${user.id}/profile-${Date.now()}.${file.name.split('.').pop()}`;
      
      const uploadUrl = await uploadFile(file, {
        bucket: 'profile-photos',
        folder: user.id,
        fileName: fileName.split('/')[1],
        maxSize: 5 * 1024 * 1024, // 5MB
        allowedTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
      });

      if (uploadUrl) {
        setPreview(uploadUrl);
        onPhotoChange(uploadUrl);
        
        toast({
          title: "Foto cargada",
          description: "La foto se ha cargado correctamente.",
        });
      }
    } catch (error) {
      console.error('Error uploading photo:', error);
      toast({
        title: "Error",
        description: "Error al cargar la foto. Intenta nuevamente.",
        variant: "destructive",
      });
    }
  };

  const handleFileSelect = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

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

    await handleFileUpload(file);
  };

  const handleDrop = async (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);

    const files = Array.from(e.dataTransfer.files);
    const imageFile = files.find(file => file.type.startsWith('image/'));

    if (!imageFile) {
      toast({
        title: "Error",
        description: "Solo se permiten archivos de imagen.",
        variant: "destructive",
      });
      return;
    }

    if (imageFile.size > 5 * 1024 * 1024) {
      toast({
        title: "Error",
        description: "La imagen no puede ser mayor a 5MB.",
        variant: "destructive",
      });
      return;
    }

    await handleFileUpload(imageFile);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleRemovePhoto = () => {
    setPreview(null);
    onPhotoChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const openFileDialog = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-4">
      <Label>Foto de Perfil</Label>
      
      <div className="flex items-start gap-6">
        <Avatar className="w-24 h-24">
          <AvatarImage src={preview || undefined} alt="Foto de perfil" />
          <AvatarFallback className="bg-gray-100">
            <Camera className="w-10 h-10 text-gray-400" />
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 space-y-4">
          {/* Drag & Drop Area */}
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={openFileDialog}
            className={`
              border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all
              ${isDragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'}
              ${disabled || uploading ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <ImageIcon className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-600 mb-1">
              {uploading ? 'Cargando...' : 'Arrastra una imagen aquí o haz clic para seleccionar'}
            </p>
            <p className="text-xs text-gray-500">
              PNG, JPG, GIF, WebP hasta 5MB
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={openFileDialog}
              disabled={disabled || uploading}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {uploading ? 'Cargando...' : 'Subir Foto'}
            </Button>

            {preview && (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleRemovePhoto}
                disabled={disabled || uploading}
                className="flex items-center gap-2 text-red-600"
              >
                <X className="w-4 h-4" />
                Eliminar
              </Button>
            )}
          </div>
        </div>
      </div>

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
