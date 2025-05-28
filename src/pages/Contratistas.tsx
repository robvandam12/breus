
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Contratistas = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to correct path
    navigate('/empresas/contratistas', { replace: true });
  }, [navigate]);

  return null;
};

export default Contratistas;
