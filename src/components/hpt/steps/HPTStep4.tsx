
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { useEffect } from "react";
import { Package, Tool, Shield, Radio } from "lucide-react";

interface HPTStep4Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep4 = ({ data, onUpdate }: HPTStep4Props) => {
  const [selectedEquipoBuceo, setSelectedEquipoBuceo] = useState<string[]>(data.equipoBuceo || []);
  const [selectedHerramientas, setSelectedHerramientas] = useState<string[]>(data.herramientas || []);
  const [selectedEquipoSeguridad, setSelectedEquipoSeguridad] = useState<string[]>(data.equipoSeguridad || []);
  const [selectedEquipoComunicacion, setSelectedEquipoComunicacion] = useState<string[]>(data.equipoComunicacion || []);

  useEffect(() => {
    onUpdate({
      equipoBuceo: selectedEquipoBuceo,
      herramientas: selectedHerramientas,
      equipoSeguridad: selectedEquipoSeguridad,
      equipoComunicacion: selectedEquipoComunicacion
    });
  }, [selectedEquipoBuceo, selectedHerramientas, selectedEquipoSeguridad, selectedEquipoComunicacion, onUpdate]);

  const equiposBuceo = [
    "Tanques de aire",
    "Reguladores",
    "Máscaras de buceo",
    "Aletas",
    "Trajes de neopreno",
    "Chalecos compensadores (BCD)",
    "Computadoras de buceo",
    "Manómetros",
    "Lastres",
    "Cuchillos de buceo",
    "Linternas subacuáticas",
    "Señales de superficie"
  ];

  const herramientas = [
    "Llaves inglesas",
    "Destornilladores marinos",
    "Martillos submarinos",
    "Taladros subacuáticos",
    "Sierras",
    "Soldadura subacuática",
    "Grúa portátil",
    "Sistemas de corte",
    "Cables y eslingas",
    "Ganchos y poleas",
    "Bolsas de elevación",
    "Herramientas neumáticas"
  ];

  const equiposSeguridad = [
    "Líneas de vida",
    "Arneses de seguridad",
    "Sistemas de rescate",
    "Boyas de señalización",
    "Silbatos de emergencia",
    "Luces estroboscópicas",
    "Kit de primeros auxilios",
    "Oxígeno de emergencia",
    "Medicamentos básicos",
    "Camilla de rescate",
    "Chaleco salvavidas",
    "GPS de emergencia"
  ];

  const equiposComunicacion = [
    "Radio VHF",
    "Teléfono satelital",
    "Sistema de comunicación subacuática",
    "Silbatos",
    "Señales manuales",
    "Bengalas de emergencia",
    "Espejo de señales",
    "Banderines de señalización",
    "Luces de comunicación",
    "Tableros de comunicación",
    "Campanas subacuáticas",
    "Sistema de cuerda de señales"
  ];

  const handleEquipoChange = (equipo: string, checked: boolean, category: string) => {
    switch (category) {
      case 'buceo':
        if (checked) {
          setSelectedEquipoBuceo([...selectedEquipoBuceo, equipo]);
        } else {
          setSelectedEquipoBuceo(selectedEquipoBuceo.filter(e => e !== equipo));
        }
        break;
      case 'herramientas':
        if (checked) {
          setSelectedHerramientas([...selectedHerramientas, equipo]);
        } else {
          setSelectedHerramientas(selectedHerramientas.filter(e => e !== equipo));
        }
        break;
      case 'seguridad':
        if (checked) {
          setSelectedEquipoSeguridad([...selectedEquipoSeguridad, equipo]);
        } else {
          setSelectedEquipoSeguridad(selectedEquipoSeguridad.filter(e => e !== equipo));
        }
        break;
      case 'comunicacion':
        if (checked) {
          setSelectedEquipoComunicacion([...selectedEquipoComunicacion, equipo]);
        } else {
          setSelectedEquipoComunicacion(selectedEquipoComunicacion.filter(e => e !== equipo));
        }
        break;
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium mb-4">Equipos y Herramientas</h3>
        <p className="text-sm text-zinc-500 mb-6">
          Seleccione todos los equipos y herramientas necesarios para la operación.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Equipo de Buceo */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Package className="w-5 h-5 text-blue-600" />
              Equipo de Buceo
              <Badge variant="outline">
                {selectedEquipoBuceo.length} seleccionados
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {equiposBuceo.map((equipo) => (
                <div key={equipo} className="flex items-center space-x-2">
                  <Checkbox
                    id={`buceo-${equipo}`}
                    checked={selectedEquipoBuceo.includes(equipo)}
                    onCheckedChange={(checked) => handleEquipoChange(equipo, checked as boolean, 'buceo')}
                  />
                  <label
                    htmlFor={`buceo-${equipo}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {equipo}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Herramientas */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Tool className="w-5 h-5 text-orange-600" />
              Herramientas
              <Badge variant="outline">
                {selectedHerramientas.length} seleccionadas
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {herramientas.map((herramienta) => (
                <div key={herramienta} className="flex items-center space-x-2">
                  <Checkbox
                    id={`herramienta-${herramienta}`}
                    checked={selectedHerramientas.includes(herramienta)}
                    onCheckedChange={(checked) => handleEquipoChange(herramienta, checked as boolean, 'herramientas')}
                  />
                  <label
                    htmlFor={`herramienta-${herramienta}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {herramienta}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Equipo de Seguridad */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-600" />
              Equipo de Seguridad
              <Badge variant="outline">
                {selectedEquipoSeguridad.length} seleccionados
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {equiposSeguridad.map((equipo) => (
                <div key={equipo} className="flex items-center space-x-2">
                  <Checkbox
                    id={`seguridad-${equipo}`}
                    checked={selectedEquipoSeguridad.includes(equipo)}
                    onCheckedChange={(checked) => handleEquipoChange(equipo, checked as boolean, 'seguridad')}
                  />
                  <label
                    htmlFor={`seguridad-${equipo}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {equipo}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Equipo de Comunicación */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Radio className="w-5 h-5 text-purple-600" />
              Comunicación
              <Badge variant="outline">
                {selectedEquipoComunicacion.length} seleccionados
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {equiposComunicacion.map((equipo) => (
                <div key={equipo} className="flex items-center space-x-2">
                  <Checkbox
                    id={`comunicacion-${equipo}`}
                    checked={selectedEquipoComunicacion.includes(equipo)}
                    onCheckedChange={(checked) => handleEquipoChange(equipo, checked as boolean, 'comunicacion')}
                  />
                  <label
                    htmlFor={`comunicacion-${equipo}`}
                    className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                  >
                    {equipo}
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="p-4">
          <div className="flex items-center gap-2 text-blue-700">
            <Package className="w-4 h-4" />
            <span className="text-sm font-medium">
              Total de elementos seleccionados: {selectedEquipoBuceo.length + selectedHerramientas.length + selectedEquipoSeguridad.length + selectedEquipoComunicacion.length}
            </span>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
