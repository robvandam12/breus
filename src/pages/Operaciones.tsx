
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Operaciones = () => {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to correct path
    navigate('/operaciones/operaciones', { replace: true });
  }, [navigate]);

  return null;
};

export default Operaciones;
