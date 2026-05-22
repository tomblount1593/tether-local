import React, { createContext, useContext, useEffect, useState } from "react";
import { localApp } from "@/api/localClient";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoadingAuth, setIsLoadingAuth] = useState(true);

  useEffect(() => {
    localApp.auth.me().then((currentUser) => {
      setUser(currentUser);
      setIsLoadingAuth(false);
    });
  }, []);

  const logout = () => {
    localApp.auth.logout();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: true,
        isLoadingAuth,
        isLoadingPublicSettings: false,
        authError: null,
        appPublicSettings: { id: "local-tether", public_settings: { auth_required: false } },
        logout,
        navigateToLogin: () => {},
        checkAppState: () => {},
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
