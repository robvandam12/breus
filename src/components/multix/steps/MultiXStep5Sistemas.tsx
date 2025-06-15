
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { MultiXData, SistemaEquipo } from '@/types/multix';

interface MultiXStep5SistemasProps {
  data: MultiXData;
  onUpdate: (field: keyof MultiXData, value: any) => void;
}

const sistemasDisponibles = [
  { id: 'comunicacion', nombre: 'Sistema de Comunicación', categoria: 'comunicacion' },
  { id: 'aire_principal', nombre: 'Suministro de Aire Principal', categoria: 'aire' },
  { id: 'aire_emergencia', nombre: 'Aire de Emergencia', categoria: 'aire' },
  { id: 'winche_principal', nombre: 'Winche Principal', categoria: 'mecanico' },
  { id: 'winche_auxiliar', nombre: 'Winche Auxiliar', categoria: 'mecanico' },
  { id: 'iluminacion', nombre: 'Sistema de Iluminación', categoria: 'electrico' },
  { id: 'navegacion', nombre: 'Equipo de Navegación', categoria: 'navegacion' },
  { id: 'sonar', nombre: 'Sonar/Ecosonda', categoria: 'navegacion' },
  { id: 'bomba_agua', nombre: 'Bomba de Agua', categoria: 'hidraulico' },
  { id: 'generador', nombre: 'Generador Eléctrico', categoria: 'electrico' },
  { id: 'compresor', nombre: 'Compresor de Aire', categoria: 'aire' },
  { id: 'grua', nombre: 'Grúa/Pluma', categoria: 'mecanico' }
];

const estadosOperacionales = [
  { value: 'operativo', label: 'Operativo', color: 'text-green-600' },
  { value: 'mantenimiento', label: 'En Mantenimiento', color: 'text-yellow-600' },
  { value: 'falla', label: 'Con Falla', color: 'text-red-600' },
  { value: 'no_disponible', label: 'No Disponible', color: 'text-gray-600' }
];

export const MultiXStep5Sistemas: React.FC<MultiXStep5SistemasProps> = ({ data, onUpdate }) => {
  const sistemasEquipos = data.sistemas_equipos || [];

  const actualizarSistema = (sistemaId: string, campo: keyof SistemaEquipo, valor: any) => {
    const sistemasActualizados = sistemasEquipos.map(sistema =>
      sistema.sistema_id === sistemaId ? { ...sistema, [campo]: valor } : sistema
    );
    
    // Si el sistema no existe, crearlo
    if (!sistemasActualizados.find(s => s.sistema_id === sistemaId)) {
      const sistemaInfo = sistemasDisponibles.find(s => s.id === sistemaId);
      sistemasActualizados.push({
        sistema_id: sistemaId,
        nombre: sistemaInfo?.nombre || '',
        categoria: sistemaInfo?.categoria || '',
        estado_operacional: 'operativo',
        observaciones: '',
        [campo]: valor
      });
    }
    
    onUpdate('sistemas_equipos', sistemasActualizados);
  };

  const getSistemaData = (sistemaId: string): SistemaEquipo => {
    const sistema = sistemasEquipos.find(s => s.sistema_id === sistemaId);
    if (sistema) return sistema;
    
    const sistemaInfo = sistemasDisponibles.find(s => s.id === sistemaId);
    return {
      sistema_id: sistemaId,
      nombre: sistemaInfo?.nombre || '',
      categoria: sistemaInfo?.categoria || '',
      estado_operacional: 'operativo',
      observaciones: ''
    };
  };

  const agruparSistemasPorCategoria = () => {
    const categorias: { [key: string]: typeof sistemasDisponibles } = {};
    sistemasDisponibles.forEach(sistema => {
      if (!categorias[sistema.categoria]) {
        categorias[sistema.categoria] = [];
      }
      categorias[sistema.categoria].push(sistema);
    });
    return categorias;
  };

  const categoriasNombres = {
    comunicacion: 'Comunicación',
    aire: 'Sistemas de Aire',
    mecanico: 'Equipos Mecánicos',
    electrico: 'Sistemas Eléctricos',
    navegacion: 'Navegación',
    hidraulico: 'Sistemas Hidráulicos'
  };

  const sistemasAgrupados = agruparSistemasPorCategoria();

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold">Sistemas y Equipos</h2>
        <p className="text-muted-foreground mt-2">
          Registra el estado operacional de los sistemas y equipos utilizados
        </p>
      </div>

      {Object.entries(sistemasAgrupados).map(([categoria, sistemas]) => (
        <Card key={categoria}>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              {categoriasNombres[categoria as keyof typeof categoriasNombres]}
              <Badge variant="secondary">
                {sistemas.filter(s => sistemasEquipos.some(se => se.sistema_id === s.id)).length}/{sistemas.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {sistemas.map((sistema) => {
              const sistemaData = getSistemaData(sistema.id);
              const isActive = sistemasEquipos.some(s => s.sistema_id === sistema.id);
              
              return (
                <div key={sistema.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <Checkbox
                        checked={isActive}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            actualizarSistema(sistema.id, 'estado_operacional', 'operativo');
                          } else {
                            const sistemasFiltrados = sistemasEquipos.filter(s => s.sistema_id !== sistema.id);
                            onUpdate('sistemas_equipos', sistemasFiltrados);
                          }
                        }}
                      />
                      <span className="font-medium">{sistema.nombre}</span>
                    </div>
                    {isActive && (
                      <Badge 
                        variant="outline" 
                        className={estadosOperacionales.find(e => e.value === sistemaData.estado_operacional)?.color}
                      >
                        {estadosOperacionales.find(e => e.value === sistemaData.estado_operacional)?.label}
                      </Badge>
                    )}
                  </div>

                  {isActive && (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label>Estado Operacional</Label>
                        <Select
                          value={sistemaData.estado_operacional}
                          onValueChange={(value) => actualizarSistema(sistema.id, 'estado_operacional', value)}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {estadosOperacionales.map(estado => (
                              <SelectItem key={estado.value} value={estado.value}>
                                <span className={estado.color}>{estado.label}</span>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label>Observaciones</Label>
                        <Textarea
                          value={sistemaData.observaciones}
                          onChange={(e) => actualizarSistema(sistema.id, 'observaciones', e.target.value)}
                          placeholder="Detalles del estado, problemas, mantenimientos..."
                          rows={2}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </CardContent>
        </Card>
      ))}

      <div className="bg-green-50 border border-green-200 rounded-lg p-4">
        <h3 className="font-medium text-green-900 mb-2">Resumen de Sistemas</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
          {estadosOperacionales.map(estado => {
            const count = sistemasEquipos.filter(s => s.estado_operacional === estado.value).length;
            return (
              <div key={estado.value} className="text-center">
                <div className={`font-bold text-lg ${estado.color}`}>{count}</div>
                <div className="text-green-700">{estado.label}</div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
