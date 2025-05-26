
import React, { useRef, useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PenTool, CheckCircle, RotateCcw, Save, X } from 'lucide-react';

interface HandDrawnSignatureProps {
  title: string;
  role: string;
  signerName?: string;
  isSigned: boolean;
  onSign: (signatureData: string) => void;
  onReset: () => void;
  disabled?: boolean;
  iconColor?: string;
  compact?: boolean;
}

export const HandDrawnSignature = ({
  title,
  role,
  signerName = '',
  isSigned,
  onSign,
  onReset,
  disabled = false,
  iconColor = "text-blue-600",
  compact = false
}: HandDrawnSignatureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width * window.devicePixelRatio;
    canvas.height = rect.height * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    // Configure drawing
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1f2937';
    
    // Clear canvas with white background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();

    if ('touches' in e) {
      return {
        x: e.touches[0].clientX - rect.left,
        y: e.touches[0].clientY - rect.top
      };
    } else {
      return {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
    }
  };

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (disabled || isSigned) return;
    
    e.preventDefault();
    const pos = getEventPos(e);
    setIsDrawing(true);
    setLastPoint(pos);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!isDrawing || disabled || isSigned) return;
    
    e.preventDefault();
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    const currentPoint = getEventPos(e);
    
    ctx.beginPath();
    ctx.moveTo(lastPoint.x, lastPoint.y);
    ctx.lineTo(currentPoint.x, currentPoint.y);
    ctx.stroke();
    
    setLastPoint(currentPoint);
    setHasDrawing(true);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const clearSignature = () => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;

    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    setHasDrawing(false);
  };

  const saveSignature = () => {
    const canvas = canvasRef.current;
    if (!canvas || !hasDrawing) return;

    const signatureData = canvas.toDataURL('image/png');
    onSign(signatureData);
  };

  if (isSigned) {
    return (
      <Card className={`border-green-200 bg-green-50 ${compact ? 'p-2' : ''}`}>
        <CardHeader className={compact ? 'pb-2' : ''}>
          <CardTitle className={`flex items-center gap-2 ${compact ? 'text-sm' : ''} text-green-800`}>
            <CheckCircle className={`${compact ? 'w-4 h-4' : 'w-5 h-5'}`} />
            {title} - Firmado
            {compact && (
              <Badge className="bg-green-100 text-green-700 text-xs">
                Firmado
              </Badge>
            )}
          </CardTitle>
        </CardHeader>
        <CardContent className={compact ? 'pt-0' : ''}>
          <div className={`space-y-2 ${compact ? 'text-sm' : ''}`}>
            <p className="text-green-700">
              <strong>Firmante:</strong> {signerName}
            </p>
            <p className="text-green-700">
              <strong>Rol:</strong> {role}
            </p>
            <p className="text-green-700">
              <strong>Fecha:</strong> {new Date().toLocaleDateString()}
            </p>
            <Button
              variant="outline"
              size={compact ? "sm" : "default"}
              onClick={onReset}
              className="mt-2"
              disabled={disabled}
            >
              <X className={`${compact ? 'w-3 h-3' : 'w-4 h-4'} mr-2`} />
              Anular Firma
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={disabled ? "opacity-50" : ""}>
      <CardHeader className={compact ? 'pb-2' : ''}>
        <CardTitle className={`flex items-center gap-2 ${compact ? 'text-sm' : ''}`}>
          <PenTool className={`${compact ? 'w-4 h-4' : 'w-5 h-5'} ${iconColor}`} />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent className={compact ? 'pt-0' : ''}>
        <div className="space-y-4">
          <div className={`text-zinc-600 ${compact ? 'text-sm' : ''}`}>
            <p><strong>Firmante:</strong> {signerName}</p>
            <p><strong>Rol:</strong> {role}</p>
            <p><strong>Fecha:</strong> {new Date().toLocaleDateString()}</p>
            <p><strong>Hora:</strong> {new Date().toLocaleTimeString()}</p>
          </div>
          
          <div className="space-y-3">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white relative">
              <canvas
                ref={canvasRef}
                className={`w-full ${compact ? 'h-20' : 'h-32'} cursor-crosshair ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
                onMouseDown={startDrawing}
                onMouseMove={draw}
                onMouseUp={stopDrawing}
                onMouseLeave={stopDrawing}
                onTouchStart={startDrawing}
                onTouchMove={draw}
                onTouchEnd={stopDrawing}
                style={{ touchAction: 'none' }}
              />
              {!hasDrawing && !disabled && (
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="text-center text-gray-400">
                    <PenTool className={`${compact ? 'w-4 h-4' : 'w-6 h-6'} mx-auto mb-1`} />
                    <p className={compact ? 'text-xs' : 'text-sm'}>Firme aquí con el dedo</p>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-2">
              <Button
                variant="outline"
                size={compact ? "sm" : "default"}
                onClick={clearSignature}
                disabled={!hasDrawing || disabled}
                className="flex items-center gap-1"
              >
                <RotateCcw className={`${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                Limpiar
              </Button>
              <Button
                onClick={saveSignature}
                disabled={!hasDrawing || disabled}
                size={compact ? "sm" : "default"}
                className="flex items-center gap-1 flex-1"
              >
                <Save className={`${compact ? 'w-3 h-3' : 'w-4 h-4'}`} />
                Confirmar Firma
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
