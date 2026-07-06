import React, { useState, useEffect, type ReactNode } from "react";
import {
  GetLocalStorage,
  RemoveLocalStorage,
  SetLocalStorage,
} from "../utils/SecureStorage";
import { AuthContext } from "./AuthContext";
import { decodeJWT } from "../utils/jwt";

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setisAuthenticated] = useState(false);
  const [isLoading, setisLoading] = useState(true);
  const [studentUuid, setStudentUuid] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      const token = await GetLocalStorage("t_s_tk");
      if (token) {
        const decoded = decodeJWT(token);
        setStudentUuid(decoded?.profile_id || null);
        setisAuthenticated(true);
      } else {
        setStudentUuid(null);
        setisAuthenticated(false);
      }
      setisLoading(false);
    };
    loadToken();
  }, []);

  const login = async (token: string) => {
    await SetLocalStorage("t_s_tk", token);
    const decoded = decodeJWT(token);
    setStudentUuid(decoded?.profile_id || null);
    setisAuthenticated(true);
  };

  const logout = async () => {
    await RemoveLocalStorage("t_s_tk");
    setStudentUuid(null);
    setisAuthenticated(false);
  };

  const value = {
    isAuthenticated,
    isLoading,
    studentUuid,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
