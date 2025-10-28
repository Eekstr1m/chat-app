"use client";
import { AuthUserI } from "../interfaces/AuthInterfaces";
import { createContext, useContext, useState, useEffect } from "react";

// Auth Context
interface AuthContextI {
  authUser: AuthUserI | null;
  loading: boolean;
  setAuthUser: (user: AuthUserI | null) => void;
}

// Create the context
export const AuthContext = createContext<AuthContextI>({
  authUser: null,
  setAuthUser: () => {},
  loading: true,
});

// Custom hook to use the context
export const useAuthContext = () => {
  const { authUser, setAuthUser, loading } = useContext(AuthContext);
  return { authUser, setAuthUser, loading };
};

// Provider to wrap the app in
export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [authUser, setAuthUser] = useState<AuthUserI | null>(null);
  const [loading, setLoading] = useState(true);

  // This is a helper function to load the auth user from the local storage
  useEffect(() => {
    // Check if the user is already logged in
    const savedUser = localStorage.getItem("authUser");
    if (savedUser) setAuthUser(JSON.parse(savedUser));
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider value={{ authUser, setAuthUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
