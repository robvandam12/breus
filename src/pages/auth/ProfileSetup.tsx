
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { CompleteProfileForm } from '@/components/profile/CompleteProfileForm';
import { useEffect } from 'react';

export const ProfileSetup = () => {
  const { profile } = useAuth();
  const navigate = useNavigate();

  // Skip profile setup for admin roles
  useEffect(() => {
    if (profile?.role === 'admin_salmonera' || profile?.role === 'admin_servicio' || profile?.role === 'superuser') {
      navigate('/dashboard');
    }
  }, [profile, navigate]);

  const handleComplete = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-5xl mx-auto px-4">
        <CompleteProfileForm onComplete={handleComplete} />
      </div>
    </div>
  );
};

export default ProfileSetup;
