
import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { Upload, X, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  onImageSelect: (file: File) => void;
  value?: string;
  onRemove?: () => void;
  className?: string;
  maxSize?: number;
  accept?: string[];
}

export const ImageUpload = ({
  onImageSelect,
  value,
  onRemove,
  className,
  maxSize = 5 * 1024 * 1024, // 5MB
  accept = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
}: ImageUploadProps) => {
  const [isDragActive, setIsDragActive] = useState(false);

  const onDrop = useCallback((acceptedFiles: File[]) => {
    if (acceptedFiles.length > 0) {
      onImageSelect(acceptedFiles[0]);
    }
    setIsDragActive(false);
  }, [onImageSelect]);

  const { getRootProps, getInputProps, isDragReject } = useDropzone({
    onDrop,
    accept: accept.reduce((acc, type) => ({ ...acc, [type]: [] }), {}),
    maxSize,
    multiple: false,
    onDragEnter: () => setIsDragActive(true),
    onDragLeave: () => setIsDragActive(false),
  });

  if (value) {
    return (
      <div className={cn("relative group", className)}>
        <img
          src={value}
          alt="Uploaded"
          className="w-full h-32 object-cover rounded-lg border border-border"
        />
        {onRemove && (
          <Button
            type="button"
            variant="destructive"
            size="sm"
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={onRemove}
          >
            <X className="w-4 h-4" />
          </Button>
        )}
      </div>
    );
  }

  return (
    <div
      {...getRootProps()}
      className={cn(
        "border-2 border-dashed border-border rounded-lg p-6 text-center cursor-pointer transition-colors",
        isDragActive && "border-primary bg-primary/5",
        isDragReject && "border-destructive bg-destructive/5",
        className
      )}
    >
      <input {...getInputProps()} />
      <div className="flex flex-col items-center gap-2">
        {isDragActive ? (
          <>
            <Upload className="w-8 h-8 text-primary" />
            <p className="text-sm text-primary font-medium">Suelta la imagen aquí...</p>
          </>
        ) : (
          <>
            <Image className="w-8 h-8 text-muted-foreground" />
            <p className="text-sm text-muted-foreground">
              Arrastra una imagen aquí o haz clic para seleccionar
            </p>
            <p className="text-xs text-muted-foreground">
              PNG, JPG, GIF, WebP hasta {Math.round(maxSize / 1024 / 1024)}MB
            </p>
          </>
        )}
      </div>
    </div>
  );
};
