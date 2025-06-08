"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "../utils/auth";
import toast from "react-hot-toast";

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  logout: () => void;
  getToken: () => string | null;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  logout: () => {},
  getToken: () => null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      setIsLoggedIn(false);
      router.push("/login");
    } else {
      setIsLoggedIn(true);
    }
  }, [router]);

  const logout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    toast.success("Logout successful!");
    router.push("/login");
  };

  const getToken = () => localStorage.getItem("token");

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, logout, getToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
