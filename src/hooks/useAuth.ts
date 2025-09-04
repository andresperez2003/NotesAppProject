import { useState, useEffect } from 'react';
import type { UserRegistered } from '../types/user';
import type { AuthState } from '../types/auth';




export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>(() => {
    const token = localStorage.getItem('token');
    const userStr = localStorage.getItem('user');
    const user = userStr ? JSON.parse(userStr) : null;
    
    return {
      isAuthenticated: !!(token && user),
      user,
      token
    };
  });

  const login = (token: string, user: UserRegistered) => {

    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
    setAuthState({
      isAuthenticated: true,
      user,
      token
    });
    // Disparar evento personalizado para notificar cambios
    window.dispatchEvent(new Event('localStorageChange'));
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setAuthState({
      isAuthenticated: false,
      user: null,
      token: null
    });
    // Disparar evento personalizado para notificar cambios
    window.dispatchEvent(new Event('localStorageChange'));
  };

  // Escuchar cambios en localStorage
  useEffect(() => {
    const handleStorageChange = () => {
      const token = localStorage.getItem('token');
      const userStr = localStorage.getItem('user');
      const user = userStr ? JSON.parse(userStr) : null;
      
      setAuthState({
        isAuthenticated: !!(token && user),
        user,
        token
      });
    };

    // Escuchar eventos de storage (para cambios desde otras pestañas)
    window.addEventListener('storage', handleStorageChange);
    
    // Escuchar eventos personalizados para cambios locales
    const handleCustomStorageChange = () => {
      handleStorageChange();
    };
    
    window.addEventListener('localStorageChange', handleCustomStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('localStorageChange', handleCustomStorageChange);
    };
  }, []);

  return {
    ...authState,
    login,
    logout
  };
};
