
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ForgotPasswordPage = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to forgot password page
    navigate('/auth/forgot-password', { replace: true });
  }, [navigate]);

  return null;
};

export default ForgotPasswordPage;
