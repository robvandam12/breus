
import React from 'react';
import { useAuthProvider, AuthContext } from '@/hooks/useAuth';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const auth = useAuthProvider();

  return (
    <AuthContext.Provider value={auth}>
      {children}
    </AuthContext.Provider>
  );
};

export { useAuth } from '@/hooks/useAuth';
