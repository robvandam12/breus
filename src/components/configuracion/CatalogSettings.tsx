
import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

const initialCatalogs = {
  epp: [
    'Casco de seguridad',
    'Lentes de protección',
    'Guantes de trabajo',
    'Calzado de seguridad',
    'Chaleco salvavidas',
    'Arnés de seguridad'
  ],
  erc: [
    'Trabajo en altura',
    'Buceo profesional',
    'Navegación marítima',
    'Manejo de equipos pesados',
    'Trabajos en espacios confinados',
    'Operaciones con sustancias químicas'
  ],
  riesgos: [
    'Condiciones meteorológicas adversas',
    'Corrientes marinas fuertes',
    'Visibilidad reducida',
    'Fauna marina peligrosa',
    'Equipos defectuosos',
    'Comunicación deficiente'
  ]
};

export const CatalogSettings = () => {
  const [catalogs, setCatalogs] = useState(initialCatalogs);
  const [selectedCatalog, setSelectedCatalog] = useState<'epp' | 'erc' | 'riesgos'>('epp');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newItem, setNewItem] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const addItem = () => {
    if (newItem.trim()) {
      setCatalogs(prev => ({
        ...prev,
        [selectedCatalog]: [...prev[selectedCatalog], newItem.trim()]
      }));
      setNewItem('');
      setIsDialogOpen(false);
    }
  };

  const removeItem = (index: number) => {
    setCatalogs(prev => ({
      ...prev,
      [selectedCatalog]: prev[selectedCatalog].filter((_, i) => i !== index)
    }));
  };

  const catalogTitles = {
    epp: 'Equipos de Protección Personal',
    erc: 'Estándares de Riesgos Críticos',
    riesgos: 'Riesgos Complementarios'
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-lg font-semibold">Catálogos del Sistema</h3>
          <p className="text-sm text-gray-500">
            Gestiona las opciones disponibles en los formularios HPT y Anexo Bravo
          </p>
        </div>
      </div>

      <Tabs value={selectedCatalog} onValueChange={(value) => setSelectedCatalog(value as any)}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="epp">EPP</TabsTrigger>
          <TabsTrigger value="erc">ERC</TabsTrigger>
          <TabsTrigger value="riesgos">Riesgos</TabsTrigger>
        </TabsList>

        {Object.entries(catalogTitles).map(([key, title]) => (
          <TabsContent key={key} value={key} className="space-y-4">
            <Card>
              <CardHeader>
                <div className="flex justify-between items-center">
                  <CardTitle>{title}</CardTitle>
                  <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                      <Button size="sm">
                        <Plus className="w-4 h-4 mr-2" />
                        Agregar
                      </Button>
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Agregar nuevo ítem a {title}</DialogTitle>
                      </DialogHeader>
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor="newItem">Descripción</Label>
                          <Input
                            id="newItem"
                            value={newItem}
                            onChange={(e) => setNewItem(e.target.value)}
                            placeholder="Ingresa la descripción del nuevo ítem"
                            onKeyPress={(e) => e.key === 'Enter' && addItem()}
                          />
                        </div>
                        <div className="flex justify-end space-x-2">
                          <Button variant="outline" onClick={() => setIsDialogOpen(false)}>
                            Cancelar
                          </Button>
                          <Button onClick={addItem}>Agregar</Button>
                        </div>
                      </div>
                    </DialogContent>
                  </Dialog>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {catalogs[key as keyof typeof catalogs].map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <span>{item}</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeItem(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                  {catalogs[key as keyof typeof catalogs].length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      No hay ítems en este catálogo
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );
};
