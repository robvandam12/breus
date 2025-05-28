
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Sitios = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to correct path
    navigate('/empresas/sitios', { replace: true });
  }, [navigate]);

  return null;
};

export default Sitios;
