"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "../utils/auth";
import toast from "react-hot-toast";
import { apiRequest } from "../utils/api"; // Adjust path if needed
import { LoginResponse } from "../types/LoginResponse";


type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
  role: string | null;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => { },
  login: async () => { },
  logout: () => { },
  getToken: () => null,
  role: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setIsLoggedIn(false);
      setRole(null);
      router.push("/login");
    } else {
      setIsLoggedIn(true);
      setRole(storedRole);
    }
  }, [router]);

  const login = async (email: string, password: string) => {
    const res = await apiRequest(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });    

    // If apiRequest returns JSON directly, just use it:
    const data = res as LoginResponse;    

    if (!data.token) throw new Error("Invalid credentials");

    localStorage.setItem("token", data.token);

    let roleValue = "Student";
    if (data.user && data.user.roles && Array.isArray(data.user.roles) && data.user.roles.length > 0) {
      roleValue = data.user.roles[0];
    } else if (data.user && data.user.role) {
      roleValue = data.user.role;
    }
    localStorage.setItem("role", roleValue);
    setRole(roleValue);
    setIsLoggedIn(true);
    toast.success("Login successful!");
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    toast.success("Logout successful!");
    router.push("/login");
  };

  const getToken = () => localStorage.getItem("token");

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, login, logout, getToken, role }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
