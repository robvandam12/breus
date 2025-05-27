
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Users, Plus, Search, Edit, Trash2, Eye, UserCheck } from "lucide-react";

interface EquipoBuceo {
  id: string;
  nombre: string;
  descripcion?: string;
  miembros: number;
  activo: boolean;
  empresa_nombre?: string;
}

export const EquipoBuceoManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [equipos] = useState<EquipoBuceo[]>([
    {
      id: "1",
      nombre: "Equipo Alpha",
      descripcion: "Equipo principal de inmersión",
      miembros: 5,
      activo: true,
      empresa_nombre: "Contratista ABC"
    },
    {
      id: "2", 
      nombre: "Equipo Beta",
      descripcion: "Equipo de apoyo",
      miembros: 3,
      activo: true,
      empresa_nombre: "Contratista XYZ"
    }
  ]);

  const filteredEquipos = equipos.filter(equipo =>
    equipo.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (equipo.empresa_nombre?.toLowerCase().includes(searchTerm.toLowerCase()) || false)
  );

  return (
    <div className="space-y-6">
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4">
          <div className="text-2xl font-bold text-blue-600">
            {equipos.length}
          </div>
          <div className="text-sm text-zinc-500">Total Equipos</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-green-600">
            {equipos.filter(e => e.activo).length}
          </div>
          <div className="text-sm text-zinc-500">Activos</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-purple-600">
            {equipos.reduce((sum, e) => sum + e.miembros, 0)}
          </div>
          <div className="text-sm text-zinc-500">Total Miembros</div>
        </Card>
        <Card className="p-4">
          <div className="text-2xl font-bold text-orange-600">
            {Math.round(equipos.reduce((sum, e) => sum + e.miembros, 0) / equipos.length || 0)}
          </div>
          <div className="text-sm text-zinc-500">Promedio por Equipo</div>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              Equipos de Buceo
              <Badge variant="outline">{filteredEquipos.length} equipos</Badge>
            </CardTitle>
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Nuevo Equipo
            </Button>
          </div>
          <div className="flex items-center gap-4 mt-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400 w-4 h-4" />
              <Input
                placeholder="Buscar equipos..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 max-w-sm"
              />
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredEquipos.map((equipo) => (
              <Card key={equipo.id} className="border-2 hover:border-blue-200 transition-colors">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div>
                      <CardTitle className="text-lg">{equipo.nombre}</CardTitle>
                      <p className="text-sm text-gray-500">{equipo.empresa_nombre}</p>
                    </div>
                    <Badge className={equipo.activo ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}>
                      {equipo.activo ? "Activo" : "Inactivo"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">{equipo.descripcion}</p>
                    
                    <div className="flex items-center gap-2">
                      <UserCheck className="w-4 h-4 text-gray-400" />
                      <span className="text-sm">{equipo.miembros} miembros</span>
                    </div>

                    <div className="flex gap-2 pt-2">
                      <Button size="sm" variant="outline" className="flex-1">
                        <Eye className="w-3 h-3 mr-1" />
                        Ver
                      </Button>
                      <Button size="sm" variant="outline" className="flex-1">
                        <Edit className="w-3 h-3 mr-1" />
                        Editar
                      </Button>
                      <Button size="sm" variant="outline">
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredEquipos.length === 0 && (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-zinc-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-zinc-900 mb-2">No hay equipos registrados</h3>
              <p className="text-zinc-500 mb-4">Comience creando el primer equipo de buceo</p>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Nuevo Equipo
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
