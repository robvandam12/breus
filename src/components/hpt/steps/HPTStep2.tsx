
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Shield, HardHat, Eye, Hand, AlertTriangle } from 'lucide-react';
import { HPTFormData } from '@/hooks/useHPTWizard';

interface HPTStep2Props {
  data: HPTFormData;
  onUpdate: (updates: Partial<HPTFormData>) => void;
  operacionId: string;
}

export const HPTStep2: React.FC<HPTStep2Props> = ({ data, onUpdate, operacionId }) => {
  const handleEPPChange = (item: string, checked: boolean) => {
    onUpdate({
      hpt_epp: {
        ...data.hpt_epp,
        [item]: checked
      }
    });
  };

  const handleERCChange = (item: string, checked: boolean) => {
    onUpdate({
      hpt_erc: {
        ...data.hpt_erc,
        [item]: checked
      }
    });
  };

  const eppItems = [
    { key: 'casco', label: 'Casco de Seguridad', icon: HardHat },
    { key: 'lentes', label: 'Lentes de Seguridad', icon: Eye },
    { key: 'guantes', label: 'Guantes de Protección', icon: Hand },
    { key: 'chaleco', label: 'Chaleco Salvavidas' },
    { key: 'botas', label: 'Botas de Seguridad' },
    { key: 'respirador', label: 'Respirador' },
    { key: 'arnes', label: 'Arnés de Seguridad' }
  ];

  const ercItems = [
    { key: 'izaje', label: 'Izaje y Grúas' },
    { key: 'buceo', label: 'Buceo y Trabajo Subacuático' },
    { key: 'navegacion', label: 'Navegación Marítima' },
    { key: 'trabajo_altura', label: 'Trabajo en Altura' },
    { key: 'espacios_confinados', label: 'Espacios Confinados' },
    { key: 'energia_peligrosa', label: 'Energía Peligrosa' },
    { key: 'materiales_peligrosos', label: 'Materiales Peligrosos' }
  ];

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Equipo de Protección Personal y Estándares de Riesgos Críticos</h2>
        <p className="mt-2 text-gray-600">
          Selección de EPP requerido y identificación de ERC aplicables
        </p>
      </div>

      {/* EPP */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-blue-600" />
            Equipo de Protección Personal (EPP)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {eppItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <div key={item.key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                  {IconComponent && <IconComponent className="w-5 h-5 text-gray-600" />}
                  <Checkbox
                    id={`epp_${item.key}`}
                    checked={data.hpt_epp[item.key] || false}
                    onCheckedChange={(checked) => handleEPPChange(item.key, checked as boolean)}
                  />
                  <Label htmlFor={`epp_${item.key}`} className="text-sm font-medium cursor-pointer flex-1">
                    {item.label}
                  </Label>
                </div>
              );
            })}
          </div>

          <div className="mt-4">
            <Label htmlFor="epp_otros">Otros EPP</Label>
            <Input
              id="epp_otros"
              value={data.hpt_epp.otros || ''}
              onChange={(e) => onUpdate({
                hpt_epp: { ...data.hpt_epp, otros: e.target.value }
              })}
              placeholder="Especifique otros equipos de protección..."
            />
          </div>
        </CardContent>
      </Card>

      {/* ERC */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            Estándares de Riesgos Críticos (ERC)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ercItems.map((item) => (
              <div key={item.key} className="flex items-center space-x-3 p-3 border rounded-lg hover:bg-gray-50">
                <Checkbox
                  id={`erc_${item.key}`}
                  checked={data.hpt_erc[item.key] || false}
                  onCheckedChange={(checked) => handleERCChange(item.key, checked as boolean)}
                />
                <Label htmlFor={`erc_${item.key}`} className="text-sm font-medium cursor-pointer flex-1">
                  {item.label}
                </Label>
              </div>
            ))}
          </div>

          <div className="mt-4">
            <Label htmlFor="erc_otros">Otros ERC</Label>
            <Input
              id="erc_otros"
              value={data.hpt_erc.otros || ''}
              onChange={(e) => onUpdate({
                hpt_erc: { ...data.hpt_erc, otros: e.target.value }
              })}
              placeholder="Especifique otros estándares de riesgos críticos..."
            />
          </div>
        </CardContent>
      </Card>

      <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
        <div className="flex items-start gap-3">
          <div className="w-6 h-6 bg-amber-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
            <Shield className="w-4 h-4 text-amber-600" />
          </div>
          <div className="text-sm text-amber-800">
            <strong>Importante:</strong> Seleccione todos los elementos de EPP necesarios y los ERC que aplican para esta operación específica. 
            Esta información es crítica para la evaluación de riesgos.
          </div>
        </div>
      </div>
    </div>
  );
};
