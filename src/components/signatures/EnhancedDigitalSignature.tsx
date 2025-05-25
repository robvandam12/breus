
import { useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { PenTool, CheckCircle, RotateCcw, Trash2, User, Calendar, Clock, Signature } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface EnhancedDigitalSignatureProps {
  title: string;
  role: string;
  signerName?: string;
  isSigned: boolean;
  onSign: (signatureData: { signature: string; signerName: string; timestamp: string }) => void;
  onReset: () => void;
  disabled?: boolean;
  iconColor?: string;
  requireSignerName?: boolean;
}

export const EnhancedDigitalSignature = ({
  title,
  role,
  signerName: initialSignerName = "",
  isSigned,
  onSign,
  onReset,
  disabled = false,
  iconColor = "text-blue-600",
  requireSignerName = true
}: EnhancedDigitalSignatureProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [hasDrawing, setHasDrawing] = useState(false);
  const [lastPoint, setLastPoint] = useState({ x: 0, y: 0 });
  const [signerName, setSignerName] = useState(initialSignerName);
  const [signatureTimestamp, setSignatureTimestamp] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Configurar canvas con mejor calidad
    const dpr = window.devicePixelRatio || 1;
    const rect = canvas.getBoundingClientRect();
    
    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    
    ctx.scale(dpr, dpr);
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = 2;
    ctx.strokeStyle = '#1f2937';
    
    // Fondo blanco
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }, []);

  const getEventPos = (e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return { x: 0, y: 0 };

    const rect = canvas.getBoundingClientRect();
    const scaleX = canvas.width / rect.width;
    const scaleY = canvas.height / rect.height;

    if ('touches' in e) {
      return {
        x: (e.touches[0].clientX - rect.left) * scaleX,
        y: (e.touches[0].clientY - rect.top) * scaleY
      };
    } else {
      return {
        x: (e.clientX - rect.left) * scaleX,
        y: (e.clientY - rect.top) * scaleY
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

    if (requireSignerName && !signerName.trim()) {
      toast({
        title: "Nombre requerido",
        description: "Por favor ingrese el nombre del firmante",
        variant: "destructive",
      });
      return;
    }

    const signatureData = canvas.toDataURL('image/png');
    const timestamp = new Date().toISOString();
    
    setSignatureTimestamp(timestamp);
    onSign({
      signature: signatureData,
      signerName: signerName.trim(),
      timestamp
    });

    toast({
      title: "Firma registrada",
      description: `Firma de ${signerName} registrada exitosamente`,
    });
  };

  const handleReset = () => {
    onReset();
    setSignatureTimestamp(null);
    setSignerName(initialSignerName);
    clearSignature();
  };

  return (
    <Card className={isSigned ? "border-green-200 bg-green-50" : "border-gray-200"}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Signature className={`w-5 h-5 ${iconColor}`} />
          {title}
          {isSigned && (
            <Badge className="bg-green-100 text-green-700">
              <CheckCircle className="w-3 h-3 mr-1" />
              Firmado
            </Badge>
          )}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Información del firmante */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2 text-zinc-600">
              <User className="w-4 h-4" />
              <span><strong>Rol:</strong> {role}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <Calendar className="w-4 h-4" />
              <span><strong>Fecha:</strong> {new Date().toLocaleDateString()}</span>
            </div>
            <div className="flex items-center gap-2 text-zinc-600">
              <Clock className="w-4 h-4" />
              <span><strong>Hora:</strong> {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
          
          {isSigned ? (
            <div className="space-y-3">
              <div className="p-4 bg-green-100 rounded-lg border border-green-200">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2 text-green-700">
                    <CheckCircle className="w-5 h-5" />
                    <span className="font-medium">Documento Firmado Digitalmente</span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleReset}
                    className="text-gray-600"
                  >
                    Anular Firma
                  </Button>
                </div>
                {signerName && (
                  <div className="text-sm text-green-600">
                    <strong>Firmante:</strong> {signerName}
                  </div>
                )}
                {signatureTimestamp && (
                  <div className="text-sm text-green-600">
                    <strong>Timestamp:</strong> {new Date(signatureTimestamp).toLocaleString()}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Campo nombre del firmante */}
              {requireSignerName && (
                <div className="space-y-2">
                  <Label htmlFor={`signer-name-${role}`}>Nombre del Firmante *</Label>
                  <Input
                    id={`signer-name-${role}`}
                    value={signerName}
                    onChange={(e) => setSignerName(e.target.value)}
                    placeholder="Ingrese el nombre completo"
                    disabled={disabled}
                    className="font-medium"
                  />
                </div>
              )}

              {/* Canvas de firma */}
              <div className="space-y-3">
                <Label>Firma Digital</Label>
                <div className="relative border-2 border-dashed border-gray-300 rounded-lg p-2 bg-white">
                  <canvas
                    ref={canvasRef}
                    width={400}
                    height={120}
                    className={`w-full h-[120px] cursor-crosshair ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                        <PenTool className="w-6 h-6 mx-auto mb-1" />
                        <p className="text-xs">Firme aquí con el mouse o touch</p>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={clearSignature}
                    disabled={!hasDrawing || disabled}
                    className="flex items-center gap-1"
                  >
                    <Trash2 className="w-3 h-3" />
                    Limpiar
                  </Button>
                  <Button
                    onClick={saveSignature}
                    disabled={!hasDrawing || disabled || (requireSignerName && !signerName.trim())}
                    className="flex items-center gap-1 flex-1"
                  >
                    <PenTool className="w-3 h-3" />
                    Confirmar Firma
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};
