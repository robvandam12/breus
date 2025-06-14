
import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { UploadCloud, FileText, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';

interface DiveComputerImportProps {
    onImport: (file: File) => Promise<void>;
    isImporting: boolean;
    onCancel: () => void;
}

export const DiveComputerImport: React.FC<DiveComputerImportProps> = ({ onImport, isImporting, onCancel }) => {
    const [file, setFile] = useState<File | null>(null);
    const [error, setError] = useState<string | null>(null);

    const onDrop = useCallback((acceptedFiles: File[], rejectedFiles: any[]) => {
        setError(null);
        if (rejectedFiles.length > 0) {
            setError('Archivo no válido. Solo se permiten archivos .csv (máx 5MB).');
            setFile(null);
            return;
        }
        if (acceptedFiles.length > 0) {
            setFile(acceptedFiles[0]);
        }
    }, []);

    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop,
        accept: { 
            'text/csv': ['.csv'],
            'application/vnd.ms-excel': ['.csv'],
        },
        maxSize: 5 * 1024 * 1024, // 5MB
        multiple: false,
    });

    const handleImport = async () => {
        if (file) {
            await onImport(file);
        }
    };

    const removeFile = () => {
        setFile(null);
    }

    return (
        <div className="space-y-4">
             <DialogHeader>
                <DialogTitle>Importar Log de Computador de Buceo</DialogTitle>
                <DialogDescription>
                    Sube el archivo CSV de tu computador de buceo. La inmersión se actualizará con los datos de perfil de profundidad y profundidad máxima.
                </DialogDescription>
            </DialogHeader>
            <div
                {...getRootProps()}
                className={`p-8 border-2 border-dashed rounded-lg text-center cursor-pointer transition-colors
                ${isDragActive ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-zinc-300 dark:border-zinc-700 hover:border-zinc-400 dark:hover:border-zinc-600'}`}
            >
                <input {...getInputProps()} />
                <UploadCloud className="w-12 h-12 mx-auto text-zinc-400" />
                {isDragActive ? (
                    <p className="mt-2 text-blue-600">Suelta el archivo aquí...</p>
                ) : (
                    <p className="mt-2 text-zinc-500">Arrastra y suelta el archivo aquí, o haz clic para seleccionarlo.</p>
                )}
                <p className="text-xs text-zinc-400 mt-1">CSV (máx 5MB). Columnas requeridas: timestamp,profundidad</p>
            </div>

            {error && <p className="text-sm text-red-500">{error}</p>}
            
            {file && (
                <div className="p-3 border rounded-lg flex items-center justify-between bg-zinc-50 dark:bg-zinc-800">
                    <div className="flex items-center gap-3 overflow-hidden">
                        <FileText className="w-6 h-6 text-zinc-500 flex-shrink-0" />
                        <div className="truncate">
                            <p className="font-medium text-sm truncate">{file.name}</p>
                            <p className="text-xs text-zinc-500">{(file.size / 1024).toFixed(2)} KB</p>
                        </div>
                    </div>
                    <Button variant="ghost" size="icon" onClick={removeFile} disabled={isImporting}>
                        <X className="w-4 h-4" />
                    </Button>
                </div>
            )}
            
            <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={onCancel} disabled={isImporting}>
                    Cancelar
                </Button>
                <Button onClick={handleImport} disabled={!file || isImporting} className="w-full sm:w-auto">
                    {isImporting ? 'Importando...' : 'Importar y Actualizar'}
                </Button>
            </div>
        </div>
    );
};

