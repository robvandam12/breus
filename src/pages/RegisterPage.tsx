
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const RegisterPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to register page
    navigate('/auth/register', { replace: true });
  }, [navigate]);

  return null;
};

export default RegisterPage;
