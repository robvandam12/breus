
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { ArrowLeft, ArrowRight, Plus, Trash2, Users, CheckCircle } from "lucide-react";
import { useSalmoneras } from "@/hooks/useSalmoneras";
import { useContratistas } from "@/hooks/useContratistas";
import { useAuth } from "@/hooks/useAuth";

interface CreateEquipoFormWizardProps {
  onSubmit: (data: any) => void;
  onCancel: () => void;
  salmoneraId?: string;
  contratistaId?: string;
  initialData?: any;
}

export const CreateEquipoFormWizard = ({ 
  onSubmit, 
  onCancel, 
  salmoneraId, 
  contratistaId,
  initialData 
}: CreateEquipoFormWizardProps) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    nombre: initialData?.nombre || '',
    descripcion: initialData?.descripcion || '',
    tipo_empresa: initialData?.tipo_empresa || '',
    empresa_id: initialData?.empresa_id || salmoneraId || contratistaId || '',
    activo: initialData?.activo ?? true,
    miembros: initialData?.miembros || []
  });
  
  const [newMember, setNewMember] = useState({
    nombre_completo: '',
    email: '',
    telefono: '',
    rol_equipo: '',
    matricula: ''
  });

  const { salmoneras } = useSalmoneras();
  const { contratistas } = useContratistas();
  const { currentUser } = useAuth();

  const totalSteps = 2;
  const progress = (currentStep / totalSteps) * 100;

  // Auto-detectar empresa basado en el usuario actual
  useEffect(() => {
    if (currentUser && !salmoneraId && !contratistaId) {
      if (currentUser.rol === 'admin_salmonera' && currentUser.salmonera_id) {
        setFormData(prev => ({
          ...prev,
          tipo_empresa: 'salmonera',
          empresa_id: currentUser.salmonera_id
        }));
      } else if (currentUser.rol === 'admin_contratista' && currentUser.servicio_id) {
        setFormData(prev => ({
          ...prev,
          tipo_empresa: 'contratista',
          empresa_id: currentUser.servicio_id
        }));
      }
    } else if (salmoneraId) {
      setFormData(prev => ({
        ...prev,
        tipo_empresa: 'salmonera',
        empresa_id: salmoneraId
      }));
    } else if (contratistaId) {
      setFormData(prev => ({
        ...prev,
        tipo_empresa: 'contratista',
        empresa_id: contratistaId
      }));
    }
  }, [currentUser, salmoneraId, contratistaId]);

  const handleAddMember = () => {
    if (newMember.nombre_completo && newMember.rol_equipo) {
      setFormData(prev => ({
        ...prev,
        miembros: [...prev.miembros, { ...newMember, id: Date.now().toString() }]
      }));
      setNewMember({
        nombre_completo: '',
        email: '',
        telefono: '',
        rol_equipo: '',
        matricula: ''
      });
    }
  };

  const handleRemoveMember = (id: string) => {
    setFormData(prev => ({
      ...prev,
      miembros: prev.miembros.filter(m => m.id !== id)
    }));
  };

  const canProceedToNext = () => {
    if (currentStep === 1) {
      return formData.nombre.trim() && formData.tipo_empresa && formData.empresa_id;
    }
    return true; // Paso 2 siempre puede continuar (miembros son opcionales)
  };

  const handleNext = () => {
    if (currentStep < totalSteps && canProceedToNext()) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = () => {
    onSubmit(formData);
  };

  const getRolLabel = (rol: string) => {
    const roles = {
      supervisor: 'Supervisor',
      buzo_principal: 'Buzo Principal',
      buzo_asistente: 'Buzo Asistente'
    };
    return roles[rol as keyof typeof roles] || rol;
  };

  const getRolColor = (rol: string) => {
    const colors = {
      supervisor: 'bg-blue-100 text-blue-700',
      buzo_principal: 'bg-green-100 text-green-700',
      buzo_asistente: 'bg-yellow-100 text-yellow-700'
    };
    return colors[rol as keyof typeof colors] || 'bg-gray-100 text-gray-700';
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Progress Header */}
      <Card className="mb-6">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">
              {initialData ? 'Editar Equipo de Buceo' : 'Crear Equipo de Buceo'}
            </CardTitle>
            <div className="text-sm text-gray-500">
              Paso {currentStep} de {totalSteps}
            </div>
          </div>
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-xs text-gray-500">
              <span>Información del Equipo</span>
              <span>Asignar Miembros</span>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Step Content */}
      <Card className="mb-6">
        <CardContent className="p-6">
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Información Básica del Equipo</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre del Equipo *</Label>
                  <Input
                    id="nombre"
                    value={formData.nombre}
                    onChange={(e) => setFormData(prev => ({ ...prev, nombre: e.target.value }))}
                    placeholder="Ej: Equipo Alpha"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="tipo_empresa">Tipo de Empresa *</Label>
                  <Select
                    value={formData.tipo_empresa}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, tipo_empresa: value, empresa_id: '' }))}
                    disabled={!!(salmoneraId || contratistaId)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar tipo..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="salmonera">Salmonera</SelectItem>
                      <SelectItem value="contratista">Contratista</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="empresa">
                    {formData.tipo_empresa === 'salmonera' ? 'Salmonera' : 'Contratista'} *
                  </Label>
                  <Select
                    value={formData.empresa_id}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, empresa_id: value }))}
                    disabled={!!(salmoneraId || contratistaId)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar empresa..." />
                    </SelectTrigger>
                    <SelectContent>
                      {formData.tipo_empresa === 'salmonera' 
                        ? salmoneras.map((s) => (
                            <SelectItem key={s.id} value={s.id}>{s.nombre}</SelectItem>
                          ))
                        : contratistas.map((c) => (
                            <SelectItem key={c.id} value={c.id}>{c.nombre}</SelectItem>
                          ))
                      }
                    </SelectContent>
                  </Select>
                </div>

                <div className="md:col-span-2">
                  <Label htmlFor="descripcion">Descripción</Label>
                  <Textarea
                    id="descripcion"
                    value={formData.descripcion}
                    onChange={(e) => setFormData(prev => ({ ...prev, descripcion: e.target.value }))}
                    placeholder="Descripción del equipo..."
                    rows={3}
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold mb-4">Asignar Miembros al Equipo</h3>
              
              {/* Add Member Form */}
              <Card className="p-4 bg-gray-50">
                <h4 className="font-medium mb-3">Agregar Nuevo Miembro</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                  <div>
                    <Label htmlFor="nombre_miembro">Nombre Completo</Label>
                    <Input
                      id="nombre_miembro"
                      value={newMember.nombre_completo}
                      onChange={(e) => setNewMember(prev => ({ ...prev, nombre_completo: e.target.value }))}
                      placeholder="Nombre del miembro"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="rol_miembro">Rol en el Equipo</Label>
                    <Select
                      value={newMember.rol_equipo}
                      onValueChange={(value) => setNewMember(prev => ({ ...prev, rol_equipo: value }))}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Seleccionar rol..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="supervisor">Supervisor</SelectItem>
                        <SelectItem value="buzo_principal">Buzo Principal</SelectItem>
                        <SelectItem value="buzo_asistente">Buzo Asistente</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  
                  <div>
                    <Label htmlFor="email_miembro">Email</Label>
                    <Input
                      id="email_miembro"
                      type="email"
                      value={newMember.email}
                      onChange={(e) => setNewMember(prev => ({ ...prev, email: e.target.value }))}
                      placeholder="email@ejemplo.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="telefono_miembro">Teléfono</Label>
                    <Input
                      id="telefono_miembro"
                      value={newMember.telefono}
                      onChange={(e) => setNewMember(prev => ({ ...prev, telefono: e.target.value }))}
                      placeholder="+56 9 1234 5678"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="matricula_miembro">Matrícula</Label>
                    <Input
                      id="matricula_miembro"
                      value={newMember.matricula}
                      onChange={(e) => setNewMember(prev => ({ ...prev, matricula: e.target.value }))}
                      placeholder="Matrícula profesional"
                    />
                  </div>
                  
                  <div className="flex items-end">
                    <Button
                      type="button"
                      onClick={handleAddMember}
                      disabled={!newMember.nombre_completo || !newMember.rol_equipo}
                      className="w-full"
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      Agregar
                    </Button>
                  </div>
                </div>
              </Card>

              {/* Members List */}
              {formData.miembros.length > 0 && (
                <Card className="p-4">
                  <h4 className="font-medium mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Miembros del Equipo ({formData.miembros.length})
                  </h4>
                  <div className="space-y-3">
                    {formData.miembros.map((miembro) => (
                      <div key={miembro.id} className="flex items-center justify-between p-3 border rounded-lg bg-white">
                        <div className="flex items-center gap-3">
                          <div>
                            <p className="font-medium">{miembro.nombre_completo}</p>
                            <div className="flex items-center gap-2 text-sm text-gray-500">
                              {miembro.email && <span>{miembro.email}</span>}
                              {miembro.telefono && <span>• {miembro.telefono}</span>}
                              {miembro.matricula && <span>• Mat: {miembro.matricula}</span>}
                            </div>
                          </div>
                        </div>
                        <div className="flex items-center gap-2">
                          <Badge className={getRolColor(miembro.rol_equipo)}>
                            {getRolLabel(miembro.rol_equipo)}
                          </Badge>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveMember(miembro.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card>
              )}

              {formData.miembros.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  <Users className="w-12 h-12 mx-auto mb-2 text-gray-300" />
                  <p>No hay miembros asignados al equipo</p>
                  <p className="text-sm">Puedes agregar miembros más tarde si lo prefieres</p>
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <Button
              variant="outline"
              onClick={handlePrevious}
              disabled={currentStep === 1}
              className="flex items-center gap-2"
            >
              <ArrowLeft className="w-4 h-4" />
              Anterior
            </Button>

            <div className="flex items-center gap-2">
              <Button variant="outline" onClick={onCancel}>
                Cancelar
              </Button>
              
              {currentStep < totalSteps ? (
                <Button
                  onClick={handleNext}
                  disabled={!canProceedToNext()}
                  className="flex items-center gap-2"
                >
                  Siguiente
                  <ArrowRight className="w-4 h-4" />
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  className="flex items-center gap-2 bg-green-600 hover:bg-green-700"
                >
                  <CheckCircle className="w-4 h-4" />
                  {initialData ? 'Actualizar Equipo' : 'Crear Equipo'}
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
