
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Users, Plus, Trash2, Anchor, Settings } from "lucide-react";
import { BitacoraSupervisorData } from "../BitacoraWizard";

interface BitacoraStep2Props {
  data: BitacoraSupervisorData;
  onUpdate: (data: Partial<BitacoraSupervisorData>) => void;
}

export const BitacoraStep2 = ({ data, onUpdate }: BitacoraStep2Props) => {
  const personal = data.bs_personal || [];
  const equipos = data.bs_equipos_usados || [];

  const addPersonal = () => {
    const newPersonal = [
      ...personal,
      {
        nombre: '',
        matricula: '',
        cargo: '',
        serie_profundimetro: '',
        color_profundimetro: ''
      }
    ];
    onUpdate({ bs_personal: newPersonal });
  };

  const removePersonal = (index: number) => {
    const newPersonal = personal.filter((_, i) => i !== index);
    onUpdate({ bs_personal: newPersonal });
  };

  const updatePersonal = (index: number, field: string, value: string) => {
    const newPersonal = [...personal];
    newPersonal[index] = { ...newPersonal[index], [field]: value };
    onUpdate({ bs_personal: newPersonal });
  };

  const addEquipo = () => {
    const newEquipos = [
      ...equipos,
      { equipo: '', numero_registro: '' }
    ];
    onUpdate({ bs_equipos_usados: newEquipos });
  };

  const removeEquipo = (index: number) => {
    const newEquipos = equipos.filter((_, i) => i !== index);
    onUpdate({ bs_equipos_usados: newEquipos });
  };

  const updateEquipo = (index: number, field: string, value: string) => {
    const newEquipos = [...equipos];
    newEquipos[index] = { ...newEquipos[index], [field]: value };
    onUpdate({ bs_equipos_usados: newEquipos });
  };

  const handleBuzoPrincipalChange = (field: string, value: string) => {
    onUpdate({
      buzo_principal_datos: {
        ...data.buzo_principal_datos,
        [field]: value
      }
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">Personal y Equipos</h2>
        <p className="mt-2 text-gray-600">
          Registro del personal participante y equipos utilizados
        </p>
      </div>

      {/* Buzos y Asistentes */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Buzos y Asistentes (Máximo 6)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {personal.length === 0 ? (
            <div className="text-center py-6">
              <Users className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No hay personal registrado</p>
              <Button onClick={addPersonal} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Agregar Personal
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {personal.map((persona, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Personal {index + 1}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removePersonal(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      <div>
                        <Label htmlFor={`nombre-${index}`}>Nombre</Label>
                        <Input
                          id={`nombre-${index}`}
                          value={persona.nombre}
                          onChange={(e) => updatePersonal(index, 'nombre', e.target.value)}
                          placeholder="Nombre completo"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`matricula-${index}`}>Matrícula y Cargo</Label>
                        <Input
                          id={`matricula-${index}`}
                          value={persona.matricula}
                          onChange={(e) => updatePersonal(index, 'matricula', e.target.value)}
                          placeholder="N° matrícula y cargo"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`cargo-${index}`}>Cargo</Label>
                        <Input
                          id={`cargo-${index}`}
                          value={persona.cargo}
                          onChange={(e) => updatePersonal(index, 'cargo', e.target.value)}
                          placeholder="Buzo, Asistente, etc."
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`serie-${index}`}>N° Serie Profundímetro</Label>
                        <Input
                          id={`serie-${index}`}
                          value={persona.serie_profundimetro}
                          onChange={(e) => updatePersonal(index, 'serie_profundimetro', e.target.value)}
                          placeholder="Número de serie"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`color-${index}`}>Color Profundímetro</Label>
                        <Input
                          id={`color-${index}`}
                          value={persona.color_profundimetro}
                          onChange={(e) => updatePersonal(index, 'color_profundimetro', e.target.value)}
                          placeholder="Color identificatorio"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {personal.length < 6 && (
                <Button 
                  onClick={addPersonal} 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Personal ({personal.length}/6)
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Equipos Usados */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5 text-green-600" />
            Equipos Usados (Máximo 3 bloques)
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {equipos.length === 0 ? (
            <div className="text-center py-6">
              <Settings className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 mb-4">No hay equipos registrados</p>
              <Button onClick={addEquipo} className="flex items-center gap-2">
                <Plus className="w-4 h-4" />
                Agregar Equipo
              </Button>
            </div>
          ) : (
            <>
              <div className="space-y-3">
                {equipos.map((equipo, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-900">Equipo {index + 1}</h4>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => removeEquipo(index)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor={`equipo-${index}`}>Equipo Usado</Label>
                        <Input
                          id={`equipo-${index}`}
                          value={equipo.equipo}
                          onChange={(e) => updateEquipo(index, 'equipo', e.target.value)}
                          placeholder="Descripción del equipo"
                        />
                      </div>
                      
                      <div>
                        <Label htmlFor={`registro-${index}`}>Número de Registro</Label>
                        <Input
                          id={`registro-${index}`}
                          value={equipo.numero_registro}
                          onChange={(e) => updateEquipo(index, 'numero_registro', e.target.value)}
                          placeholder="N° de registro o identificación"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {equipos.length < 3 && (
                <Button 
                  onClick={addEquipo} 
                  variant="outline" 
                  className="w-full flex items-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  Agregar Equipo ({equipos.length}/3)
                </Button>
              )}
            </>
          )}
        </CardContent>
      </Card>

      {/* Información Adicional */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Anchor className="w-5 h-5 text-blue-600" />
              Embarcación y Tiempos
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="embarcacion">Embarcación de Apoyo</Label>
              <Input
                id="embarcacion"
                value={data.embarcacion_nombre_matricula}
                onChange={(e) => onUpdate({ embarcacion_nombre_matricula: e.target.value })}
                placeholder="Nombre y matrícula de la embarcación"
              />
            </div>
            
            <div>
              <Label htmlFor="tiempo_buceo">Tiempo Total de Buceo</Label>
              <Input
                id="tiempo_buceo"
                value={data.tiempo_total_buceo}
                onChange={(e) => onUpdate({ tiempo_total_buceo: e.target.value })}
                placeholder="Incluir si contempla descompresión"
              />
            </div>
            
            <div>
              <Label htmlFor="contratista">Contratista de Buceo</Label>
              <Input
                id="contratista"
                value={data.contratista_nombre}
                onChange={(e) => onUpdate({ contratista_nombre: e.target.value })}
                placeholder="Nombre del contratista"
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-purple-600" />
              Datos del Buzo Principal
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label htmlFor="apellido_paterno">Apellido Paterno</Label>
                <Input
                  id="apellido_paterno"
                  value={data.buzo_principal_datos.apellido_paterno}
                  onChange={(e) => handleBuzoPrincipalChange('apellido_paterno', e.target.value)}
                  placeholder="Apellido paterno"
                />
              </div>
              
              <div>
                <Label htmlFor="apellido_materno">Apellido Materno</Label>
                <Input
                  id="apellido_materno"
                  value={data.buzo_principal_datos.apellido_materno}
                  onChange={(e) => handleBuzoPrincipalChange('apellido_materno', e.target.value)}
                  placeholder="Apellido materno"
                />
              </div>
            </div>
            
            <div>
              <Label htmlFor="nombres">Nombres</Label>
              <Input
                id="nombres"
                value={data.buzo_principal_datos.nombres}
                onChange={(e) => handleBuzoPrincipalChange('nombres', e.target.value)}
                placeholder="Nombres completos"
              />
            </div>
            
            <div>
              <Label htmlFor="run">RUN</Label>
              <Input
                id="run"
                value={data.buzo_principal_datos.run}
                onChange={(e) => handleBuzoPrincipalChange('run', e.target.value)}
                placeholder="12.345.678-9"
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};
