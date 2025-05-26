
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth';

const Profile = () => {
  const { profile } = useAuth();

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Mi Perfil</h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Información Personal</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-500">Nombre</label>
              <p className="text-lg">{profile?.nombre} {profile?.apellido}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Email</label>
              <p className="text-lg">{profile?.email}</p>
            </div>
            <div>
              <label className="text-sm font-medium text-gray-500">Rol</label>
              <p className="text-lg capitalize">{profile?.role}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Profile;
