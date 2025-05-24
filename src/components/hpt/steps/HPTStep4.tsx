
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Wrench, HardHat, Radio, Anchor } from "lucide-react";

interface HPTStep4Props {
  data: any;
  onUpdate: (data: any) => void;
}

export const HPTStep4 = ({ data, onUpdate }: HPTStep4Props) => {
  const equipoBuceo = [
    "Traje de buceo",
    "Máscara de buceo",
    "Aletas",
    "Regulador",
    "BCD (Chaleco)",
    "Tanque de aire",
    "Manómetro",
    "Computadora de buceo",
    "Linterna",
    "Cuchillo de buceo"
  ];

  const herramientas = [
    "Llave inglesa",
    "Destornilladores",
    "Martillo",
    "Sierra",
    "Taladro subacuático",
    "Soldadora subacuática",
    "Cepillo de alambre",
    "Bolsa de herramientas",
    "Cinta métrica",
    "Nivel"
  ];

  const equipoSeguridad = [
    "Casco de seguridad",
    "Línea de vida",
    "Arnés de seguridad",
    "Silbato de emergencia",
    "Bengalas de señalización",
    "Kit de primeros auxilios",
    "Oxígeno de emergencia",
    "Tabla espinal",
    "Camilla de emergencia",
    "Equipo de descompresión"
  ];

  const equipoComunicacion = [
    "Radio VHF",
    "Comunicador subacuático",
    "Teléfono de buceo",
    "Señales manuales",
    "Tablero de comunicación",
    "Bandera de buceo",
    "Bocina de aire",
    "Luces de señalización",
    "Códigos de cuerda",
    "GPS marino"
  ];

  const handleEquipmentChange = (category: string, item: string, checked: boolean) => {
    const currentItems = data[category] || [];
    let updatedItems;
    
    if (checked) {
      updatedItems = [...currentItems, item];
    } else {
      updatedItems = currentItems.filter((i: string) => i !== item);
    }
    
    onUpdate({ [category]: updatedItems });
  };

  const renderEquipmentSection = (title: string, icon: any, items: string[], category: string) => {
    const Icon = icon;
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Icon className="w-5 h-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {items.map((item) => (
              <div key={item} className="flex items-center space-x-2">
                <Checkbox
                  id={`${category}-${item}`}
                  checked={(data[category] || []).includes(item)}
                  onCheckedChange={(checked) => handleEquipmentChange(category, item, checked as boolean)}
                />
                <Label htmlFor={`${category}-${item}`}>{item}</Label>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Equipos y Herramientas</h2>
        <p className="mt-2 text-gray-600">
          Selecciona todos los equipos y herramientas necesarios para la operación
        </p>
      </div>

      {renderEquipmentSection("Equipo de Buceo", Anchor, equipoBuceo, "equipo_buceo")}
      {renderEquipmentSection("Herramientas", Wrench, herramientas, "herramientas")}
      {renderEquipmentSection("Equipo de Seguridad", HardHat, equipoSeguridad, "equipo_seguridad")}
      {renderEquipmentSection("Equipo de Comunicación", Radio, equipoComunicacion, "equipo_comunicacion")}
    </div>
  );
};
