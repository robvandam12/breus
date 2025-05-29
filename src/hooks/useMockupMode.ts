
import { useState, useEffect } from 'react';

// Hook para controlar si usar data mockup o real
export const useMockupMode = () => {
  const [useMockup, setUseMockup] = useState(true); // Por defecto usar mockup

  // Función para alternar entre mockup y data real
  const toggleMockup = () => {
    setUseMockup(!useMockup);
    localStorage.setItem('use-mockup', (!useMockup).toString());
  };

  // Cargar preferencia del localStorage
  useEffect(() => {
    const savedPreference = localStorage.getItem('use-mockup');
    if (savedPreference !== null) {
      setUseMockup(savedPreference === 'true');
    }
  }, []);

  return {
    useMockup,
    toggleMockup
  };
};
