import React, { useState, useEffect, type ReactNode } from 'react';
import { GetLocalStorage, RemoveLocalStorage, SetLocalStorage } from '../utils/SecureStorage';
import { AuthContext } from './AuthContext';

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [isLoading, setisLoading] = useState(true);

  useEffect(() => {
    const loadToken = async () => {
      const token = await GetLocalStorage('t_s_tk');
      setisAuthenticated(!!token);
      setisLoading(false);
    };
    loadToken();
  }, []);

  const login = async (token: string) => {
    await SetLocalStorage('t_s_tk', token);
    setisAuthenticated(true);
  };

  const logout = async () => {
    await RemoveLocalStorage('t_s_tk');
    setisAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    isLoading,
    login,
    logout,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
