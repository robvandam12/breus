
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Plus, Search, Users, Mail, MapPin, Award } from "lucide-react";
import { usePersonalPool } from "@/hooks/usePersonalPool";
import { CreatePersonalForm } from "@/components/personal/CreatePersonalForm";

export default function PersonalPool() {
  const [searchTerm, setSearchTerm] = useState("");
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPersonal, setEditingPersonal] = useState<any>(null);

  const { personalPool, isLoading, createPersonal, updatePersonal, deletePersonal } = usePersonalPool();

  const filteredPersonal = personalPool.filter((person) =>
    person.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.apellido.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.rol.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreatePersonal = async (data: any) => {
    try {
      await createPersonal(data);
      setShowCreateForm(false);
    } catch (error) {
      console.error('Error creating personal:', error);
    }
  };

  const handleUpdatePersonal = async (data: any) => {
    if (!editingPersonal) return;
    
    try {
      await updatePersonal({ id: editingPersonal.usuario_id, data });
      setEditingPersonal(null);
    } catch (error) {
      console.error('Error updating personal:', error);
    }
  };

  const handleDeletePersonal = async (id: string) => {
    try {
      await deletePersonal(id);
    } catch (error) {
      console.error('Error deleting personal:', error);
    }
  };

  if (showCreateForm) {
    return (
      <MainLayout
        title="Agregar Personal"
        subtitle="Crear nuevo personal para el pool"
        icon={Plus}
      >
        <CreatePersonalForm
          onSubmit={handleCreatePersonal}
          onCancel={() => setShowCreateForm(false)}
        />
      </MainLayout>
    );
  }

  if (editingPersonal) {
    return (
      <MainLayout
        title="Editar Personal"
        subtitle="Modificar información del personal"
        icon={Users}
      >
        <CreatePersonalForm
          onSubmit={handleUpdatePersonal}
          onCancel={() => setEditingPersonal(null)}
          initialData={editingPersonal}
          isEditing={true}
        />
      </MainLayout>
    );
  }

  return (
    <MainLayout
      title="Pool de Personal"
      subtitle="Gestión del personal de buceo disponible"
      icon={Users}
    >
      <div className="space-y-6">
        {/* Header with search and add button */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle>Personal Disponible</CardTitle>
                <CardDescription>
                  {personalPool.length} personas en el pool de personal
                </CardDescription>
              </div>
              <Button onClick={() => setShowCreateForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Agregar Personal
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Buscar por nombre, email o rol..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </CardContent>
        </Card>

        {/* Personal Grid */}
        {isLoading ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center">Cargando personal...</div>
            </CardContent>
          </Card>
        ) : filteredPersonal.length === 0 ? (
          <Card>
            <CardContent className="p-6">
              <div className="text-center text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No se encontró personal que coincida con la búsqueda.</p>
              </div>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPersonal.map((person) => (
              <Card key={person.usuario_id} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="text-lg">
                        {person.nombre} {person.apellido}
                      </CardTitle>
                      <div className="flex gap-2 mt-2">
                        <Badge variant={person.rol === 'supervisor' ? 'default' : 'secondary'}>
                          {person.rol}
                        </Badge>
                        <Badge variant={person.estado_buzo === 'activo' ? 'default' : 'secondary'}>
                          {person.estado_buzo}
                        </Badge>
                      </div>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Mail className="w-4 h-4" />
                    {person.email}
                  </div>

                  {person.perfil_buzo?.matricula && (
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Award className="w-4 h-4" />
                      Matrícula: {person.perfil_buzo.matricula}
                    </div>
                  )}

                  {person.perfil_buzo?.especialidades && person.perfil_buzo.especialidades.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Especialidades:</p>
                      <div className="flex flex-wrap gap-1">
                        {person.perfil_buzo.especialidades.map((esp: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {esp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  {person.perfil_buzo?.certificaciones && person.perfil_buzo.certificaciones.length > 0 && (
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Certificaciones:</p>
                      <div className="flex flex-wrap gap-1">
                        {person.perfil_buzo.certificaciones.map((cert: string, idx: number) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {cert}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div className="flex gap-2 pt-3">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => setEditingPersonal(person)}
                    >
                      Editar
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDeletePersonal(person.usuario_id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      Desactivar
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
