
// Este archivo será reemplazado por Centros.tsx
// Redirigir a la nueva ruta
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Sitios = () => {
  const navigate = useNavigate();
  
  useEffect(() => {
    navigate('/empresas/centros', { replace: true });
  }, [navigate]);

  return null;
};

export default Sitios;
