
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { MultiXData } from '@/types/multix';

interface MultiXStep4IconografiaProps {
  data: MultiXData;
  onUpdate: (field: keyof MultiXData, value: any) => void;
}

const iconografiaItems = {
  senales_manuales: {
    titulo: 'Señales Manuales',
    items: [
      { id: 'ok', label: 'OK / Todo bien', icon: '👌' },
      { id: 'problema', label: 'Problema / Peligro', icon: '⚠️' },
      { id: 'subir', label: 'Subir', icon: '👆' },
      { id: 'bajar', label: 'Bajar', icon: '👇' },
      { id: 'parar', label: 'Parar', icon: '✋' },
      { id: 'ayuda', label: 'Necesito ayuda', icon: '🆘' },
      { id: 'aire', label: 'Problema de aire', icon: '💨' },
      { id: 'frio', label: 'Tengo frío', icon: '🥶' }
    ]
  },
  equipos: {
    titulo: 'Equipos y Herramientas',
    items: [
      { id: 'mascara', label: 'Máscara completa', icon: '🥽' },
      { id: 'traje', label: 'Traje de buceo', icon: '🤿' },
      { id: 'cuchillo', label: 'Cuchillo de buceo', icon: '🔪' },
      { id: 'linterna', label: 'Linterna submarina', icon: '🔦' },
      { id: 'camara', label: 'Cámara submarina', icon: '📸' },
      { id: 'bolsa', label: 'Bolsa de malla', icon: '🎒' },
      { id: 'guantes', label: 'Guantes de protección', icon: '🧤' },
      { id: 'aletas', label: 'Aletas', icon: '🩴' }
    ]
  },
  estados_red: {
    titulo: 'Estados de Red y Estructuras',
    items: [
      { id: 'red_buena', label: 'Red en buen estado', icon: '✅' },
      { id: 'red_danada', label: 'Red dañada', icon: '❌' },
      { id: 'red_reparar', label: 'Red necesita reparación', icon: '🔧' },
      { id: 'ancla_ok', label: 'Ancla segura', icon: '⚓' },
      { id: 'ancla_suelta', label: 'Ancla suelta', icon: '⚠️' },
      { id: 'boya_ok', label: 'Boya en posición', icon: '🟡' },
      { id: 'estructura_danada', label: 'Estructura dañada', icon: '🔴' },
      { id: 'limpieza_necesaria', label: 'Requiere limpieza', icon: '🧽' }
    ]
  }
};

export const MultiXStep4Iconografia: React.FC<MultiXStep4IconografiaProps> = ({ data, onUpdate }) => {
  const iconografiaSeleccionada = data.iconografia_simbologia || [];

  const toggleIconografia = (categoriaId: string, itemId: string) => {
    const iconografiaId = `${categoriaId}_${itemId}`;
    const nuevaSeleccion = iconografiaSeleccionada.includes(iconografiaId)
      ? iconografiaSeleccionada.filter(id => id !== iconografiaId)
      : [...iconografiaSeleccionada, iconografiaId];
    
    onUpdate('iconografia_simbologia', nuevaSeleccion);
  };

  const isSelected = (categoriaId: string, itemId: string) => {
    const iconografiaId = `${categoriaId}_${itemId}`;
    return iconografiaSeleccionada.includes(iconografiaId);
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Iconografía y Simbología</h2>
        <p className="text-muted-foreground mt-2">
          Selecciona los símbolos y señales utilizados durante la faena
        </p>
      </div>

      {Object.entries(iconografiaItems).map(([categoriaId, categoria]) => (
        <Card key={categoriaId}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {categoria.titulo}
              <Badge variant="secondary">
                {categoria.items.filter(item => isSelected(categoriaId, item.id)).length}/{categoria.items.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categoria.items.map((item) => (
                <div
                  key={item.id}
                  className={`flex items-center space-x-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    isSelected(categoriaId, item.id)
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                  onClick={() => toggleIconografia(categoriaId, item.id)}
                >
                  <Checkbox
                    checked={isSelected(categoriaId, item.id)}
                    onChange={() => toggleIconografia(categoriaId, item.id)}
                  />
                  <span className="text-2xl">{item.icon}</span>
                  <span className="text-sm font-medium flex-1">{item.label}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      ))}

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h3 className="font-medium text-blue-900 mb-2">Resumen de Selección</h3>
        <p className="text-sm text-blue-700">
          Total seleccionado: <strong>{iconografiaSeleccionada.length}</strong> elementos
        </p>
        {iconografiaSeleccionada.length > 0 && (
          <div className="mt-2 flex flex-wrap gap-1">
            {iconografiaSeleccionada.slice(0, 10).map((item) => (
              <Badge key={item} variant="outline" className="text-xs">
                {item.replace(/_/g, ' ')}
              </Badge>
            ))}
            {iconografiaSeleccionada.length > 10 && (
              <Badge variant="outline" className="text-xs">
                +{iconografiaSeleccionada.length - 10} más
              </Badge>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
