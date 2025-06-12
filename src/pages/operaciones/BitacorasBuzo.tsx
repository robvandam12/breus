
import { MainLayout } from '@/components/layout/MainLayout';
import { BitacoraCard } from '@/components/bitacoras/BitacoraCard';
import { CreateBitacoraBuzoFormCompleteWithInmersion } from '@/components/bitacoras/CreateBitacoraBuzoFormCompleteWithInmersion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useBitacoras } from '@/hooks/useBitacoras';
import { Book, Plus, Search } from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';

export default function BitacorasBuzo() {
  const { profile } = useAuth();
  const { bitacorasBuzo, isLoading } = useBitacoras();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Filtrar bitácoras del buzo específico
  const buzoName = `${profile?.nombre} ${profile?.apellido}`;
  const buzoBitacorasFiltered = bitacorasBuzo.filter(bitacora => {
    const matchesSearch = bitacora.codigo.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         bitacora.buzo.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || 
                         (filterStatus === 'firmado' && bitacora.firmado) ||
                         (filterStatus === 'pendiente' && !bitacora.firmado);
    const isBuzoOwner = bitacora.buzo === buzoName;
    
    return matchesSearch && matchesStatus && isBuzoOwner;
  });

  return (
    <MainLayout
      title="Mis Bitácoras"
      subtitle="Gestiona tus bitácoras de buceo"
      icon={Book}
    >
      <Tabs defaultValue="lista" className="space-y-6">
        <TabsList>
          <TabsTrigger value="lista">Lista de Bitácoras</TabsTrigger>
          <TabsTrigger value="crear">Crear Nueva</TabsTrigger>
        </TabsList>

        <TabsContent value="lista" className="space-y-6">
          {/* Filtros */}
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-64">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar por código o buzo..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos los estados</SelectItem>
                <SelectItem value="firmado">Firmadas</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Lista de Bitácoras */}
          {isLoading ? (
            <div className="text-center py-8">Cargando bitácoras...</div>
          ) : buzoBitacorasFiltered.length === 0 ? (
            <div className="text-center py-8">
              <Book className="w-12 h-12 mx-auto text-gray-400 mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No tienes bitácoras</h3>
              <p className="text-gray-500 mb-4">
                {searchTerm || filterStatus !== 'all' 
                  ? 'No se encontraron bitácoras con los filtros aplicados.'
                  : 'Aún no tienes bitácoras de buzo registradas.'
                }
              </p>
            </div>
          ) : (
            <div className="grid gap-6">
              {buzoBitacorasFiltered.map((bitacora) => (
                <BitacoraCard
                  key={bitacora.bitacora_id}
                  bitacora={bitacora}
                  type="buzo"
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="crear" className="space-y-6">
          <CreateBitacoraBuzoFormCompleteWithInmersion />
        </TabsContent>
      </Tabs>
    </MainLayout>
  );
}
