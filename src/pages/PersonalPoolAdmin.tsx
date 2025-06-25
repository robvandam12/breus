
import React from 'react';
import { MainLayout } from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users } from "lucide-react";
import { useAuth } from "@/hooks/useAuth";

const PersonalPoolAdmin = () => {
  console.log('🚀 PersonalPoolAdmin component rendering');
  
  const { profile } = useAuth();
  console.log('👤 PersonalPoolAdmin - Profile:', profile);

  // Renderizado simple para debug
  return (
    <div className="min-h-screen bg-red-100 p-4">
      <div className="bg-white p-6 rounded-lg shadow">
        <h1 className="text-2xl font-bold text-green-600 mb-4">
          PersonalPoolAdmin - DEBUG MODE
        </h1>
        <div className="space-y-4">
          <p>✅ Component is rendering</p>
          <p>📍 Current route: /company-personnel</p>
          <p>👤 User role: {profile?.role || 'Loading...'}</p>
          <p>🏢 Salmonera ID: {profile?.salmonera_id || 'None'}</p>
          <p>🛠️ Servicio ID: {profile?.servicio_id || 'None'}</p>
          
          <Card className="mt-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="w-5 h-5" />
                Company Personnel (Debug)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p>If you can see this, the component is working!</p>
              <p>Profile loaded: {profile ? '✅ Yes' : '❌ No'}</p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PersonalPoolAdmin;
