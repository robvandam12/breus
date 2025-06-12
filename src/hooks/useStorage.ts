
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from '@/hooks/use-toast';

export interface UploadOptions {
  bucket: 'signatures' | 'contracts' | 'attachments' | 'profile-photos';
  folder?: string;
  fileName?: string;
  maxSize?: number;
  allowedTypes?: string[];
}

export const useStorage = () => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, options: UploadOptions): Promise<string | null> => {
    setUploading(true);
    
    try {
      // Validar tamaño
      if (options.maxSize && file.size > options.maxSize) {
        throw new Error(`El archivo es muy grande. Máximo permitido: ${options.maxSize / 1024 / 1024}MB`);
      }

      // Validar tipo
      if (options.allowedTypes && !options.allowedTypes.includes(file.type)) {
        throw new Error(`Tipo de archivo no permitido. Tipos permitidos: ${options.allowedTypes.join(', ')}`);
      }

      // Generar nombre de archivo único
      const fileExt = file.name.split('.').pop();
      const fileName = options.fileName || `${Date.now()}.${fileExt}`;
      
      // Crear path del archivo
      let filePath = fileName;
      if (options.folder) {
        filePath = `${options.folder}/${fileName}`;
      }

      // Para signatures y profile-photos, usar el user ID como folder
      if (options.bucket === 'signatures' || options.bucket === 'profile-photos') {
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) throw new Error('Usuario no autenticado');
        filePath = `${user.id}/${fileName}`;
      }

      // Subir archivo
      const { data, error } = await supabase.storage
        .from(options.bucket)
        .upload(filePath, file, {
          cacheControl: '3600',
          upsert: true
        });

      if (error) throw error;

      // Obtener URL pública o firmada según el bucket
      let publicUrl: string;
      
      if (options.bucket === 'signatures') {
        // Para signatures, generar URL firmada (privada)
        const { data: signedData } = await supabase.storage
          .from(options.bucket)
          .createSignedUrl(data.path, 60 * 60 * 24 * 7); // 7 días
        
        publicUrl = signedData?.signedUrl || '';
      } else {
        // Para otros buckets, usar URL pública
        const { data: publicData } = supabase.storage
          .from(options.bucket)
          .getPublicUrl(data.path);
        
        publicUrl = publicData.publicUrl;
      }

      toast({
        title: "Archivo subido",
        description: "El archivo se ha subido exitosamente.",
      });

      return publicUrl;
    } catch (error: any) {
      console.error('Error uploading file:', error);
      toast({
        title: "Error",
        description: error.message || "Error al subir el archivo",
        variant: "destructive",
      });
      return null;
    } finally {
      setUploading(false);
    }
  };

  const deleteFile = async (bucket: string, path: string): Promise<boolean> => {
    try {
      const { error } = await supabase.storage
        .from(bucket)
        .remove([path]);

      if (error) throw error;

      toast({
        title: "Archivo eliminado",
        description: "El archivo se ha eliminado exitosamente.",
      });

      return true;
    } catch (error: any) {
      console.error('Error deleting file:', error);
      toast({
        title: "Error",
        description: error.message || "Error al eliminar el archivo",
        variant: "destructive",
      });
      return false;
    }
  };

  const getSignedUrl = async (bucket: string, path: string, expiresIn = 3600): Promise<string | null> => {
    try {
      const { data, error } = await supabase.storage
        .from(bucket)
        .createSignedUrl(path, expiresIn);

      if (error) throw error;

      return data?.signedUrl || null;
    } catch (error: any) {
      console.error('Error getting signed URL:', error);
      return null;
    }
  };

  return {
    uploadFile,
    deleteFile,
    getSignedUrl,
    uploading
  };
};
