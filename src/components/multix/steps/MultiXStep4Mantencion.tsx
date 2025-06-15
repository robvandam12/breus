
import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Trash2 } from 'lucide-react';
import { MultiXData, FaenaMantencion } from '@/types/multix';

interface MultiXStep4MantencionProps {
  data: MultiXData;
  onUpdate: (field: keyof MultiXData, value: any) => void;
}

const estadosOptions = [
  { value: 'bueno', label: 'Bueno' },
  { value: 'regular', label: 'Regular' },
  { value: 'malo', label: 'Malo' },
  { value: 'critico', label: 'Crítico' },
  { value: 'reparado', label: 'Reparado' }
];

export const MultiXStep4Mantencion: React.FC<MultiXStep4MantencionProps> = ({ data, onUpdate }) => {
  const faenasMantencion = data.faenas_mantencion || [];

  const agregarFaena = (tipo: 'red' | 'lobera' | 'peceras') => {
    const nuevaFaena: FaenaMantencion = {
      id: crypto.randomUUID(),
      tipo,
      estado: 'bueno',
      metros_trabajados: 0,
      observaciones: ''
    };
    
    onUpdate('faenas_mantencion', [...faenasMantencion, nuevaFaena]);
  };

  const actualizarFaena = (id: string, campo: keyof FaenaMantencion, valor: any) => {
    const faenasActualizadas = faenasMantencion.map(faena =>
      faena.id === id ? { ...faena, [campo]: valor } : faena
    );
    onUpdate('faenas_mantencion', faenasActualizadas);
  };

  const eliminarFaena = (id: string) => {
    const faenasFiltradas = faenasMantencion.filter(faena => faena.id !== id);
    onUpdate('faenas_mantencion', faenasFiltradas);
  };

  const agruparFaenasPorTipo = () => {
    return {
      red: faenasMantencion.filter(f => f.tipo === 'red'),
      lobera: faenasMantencion.filter(f => f.tipo === 'lobera'),
      peceras: faenasMantencion.filter(f => f.tipo === 'peceras')
    };
  };

  const renderSeccionFaenas = (tipo: 'red' | 'lobera' | 'peceras', titulo: string, faenas: FaenaMantencion[]) => (
    <Card key={tipo} className="mb-6">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-4">
        <CardTitle className="text-lg">{titulo}</CardTitle>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => agregarFaena(tipo)}
          className="flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Agregar {titulo}
        </Button>
      </CardHeader>
      <CardContent>
        {faenas.length === 0 ? (
          <p className="text-sm text-muted-foreground">No hay faenas de {titulo.toLowerCase()} registradas</p>
        ) : (
          <div className="space-y-4">
            {faenas.map((faena, index) => (
              <div key={faena.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium">{titulo} #{index + 1}</h4>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() => eliminarFaena(faena.id)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor={`estado-${faena.id}`}>Estado</Label>
                    <Select
                      value={faena.estado}
                      onValueChange={(value) => actualizarFaena(faena.id, 'estado', value)}
                    >
                      <SelectTrigger id={`estado-${faena.id}`}>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {estadosOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`metros-${faena.id}`}>Metros Trabajados</Label>
                    <Input
                      id={`metros-${faena.id}`}
                      type="number"
                      min="0"
                      step="0.1"
                      value={faena.metros_trabajados || ''}
                      onChange={(e) => actualizarFaena(faena.id, 'metros_trabajados', parseFloat(e.target.value) || 0)}
                      placeholder="0.0"
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor={`observaciones-${faena.id}`}>Observaciones</Label>
                  <Textarea
                    id={`observaciones-${faena.id}`}
                    value={faena.observaciones}
                    onChange={(e) => actualizarFaena(faena.id, 'observaciones', e.target.value)}
                    placeholder="Detalles del trabajo realizado, problemas encontrados, etc."
                    rows={3}
                  />
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );

  const faenasAgrupadas = agruparFaenasPorTipo();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Faenas de Mantención</h2>
        <p className="text-muted-foreground mt-2">
          Registra los trabajos de mantención realizados en red, lobera y peceras
        </p>
      </div>

      {renderSeccionFaenas('red', 'Red', faenasAgrupadas.red)}
      {renderSeccionFaenas('lobera', 'Lobera', faenasAgrupadas.lobera)}
      {renderSeccionFaenas('peceras', 'Peceras', faenasAgrupadas.peceras)}

      {faenasMantencion.length === 0 && (
        <Card className="border-dashed border-2 border-muted">
          <CardContent className="flex flex-col items-center justify-center py-8">
            <p className="text-muted-foreground text-center mb-4">
              No hay faenas de mantención registradas
            </p>
            <div className="flex gap-2">
              <Button onClick={() => agregarFaena('red')} variant="outline" size="sm">
                Agregar Red
              </Button>
              <Button onClick={() => agregarFaena('lobera')} variant="outline" size="sm">
                Agregar Lobera
              </Button>
              <Button onClick={() => agregarFaena('peceras')} variant="outline" size="sm">
                Agregar Peceras
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
