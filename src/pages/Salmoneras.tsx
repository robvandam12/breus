
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Salmoneras = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to correct path
    navigate('/empresas/salmoneras', { replace: true });
  }, [navigate]);

  return null;
};

export default Salmoneras;
