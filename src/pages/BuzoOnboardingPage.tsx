
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import { BuzoOnboarding } from '@/components/onboarding/BuzoOnboarding';
import { useEffect } from 'react';

export default function BuzoOnboardingPage() {
  const { profile } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // Redirigir a otros roles a su dashboard
    if (profile?.role && profile.role !== 'buzo') {
      navigate('/');
    }
  }, [profile, navigate]);

  const handleComplete = () => {
    navigate('/');
  };

  return (
    <BuzoOnboarding onComplete={handleComplete} />
  );
}
