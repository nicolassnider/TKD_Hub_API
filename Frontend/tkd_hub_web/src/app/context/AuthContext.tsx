"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "../utils/auth";
import toast from "react-hot-toast";
import { apiRequest } from "../utils/api"; // Adjust path if needed
import { LoginResponse } from "../types/LoginResponse";
import { User } from "../types/User";

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
  role: string | null;
  user: User | null;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => { },
  login: async () => { },
  logout: () => { },
  getToken: () => null,
  role: null,
  user: null,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();

  // Check token on mount
  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedRole = localStorage.getItem("role");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      setIsLoggedIn(false);
      setRole(null);
      setUser(null);
      router.push("/login");
    } else {
      setIsLoggedIn(true);
      setRole(storedRole);
      // Optionally, decode user info from token or fetch user profile here
    }
  }, [router]);

  // Periodically check for session timeout
  useEffect(() => {
    const interval = setInterval(() => {
      toast.loading("Checking session...", { id: "session-check" }); // Show loading toast
      const token = localStorage.getItem("token");
      if (!token || isTokenExpired(token)) {
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        setIsLoggedIn(false);
        setRole(null);
        setUser(null);
        toast.dismiss("session-check");
        toast.error("Session expired. Please log in again.");
        router.push("/login");
      } else {
        toast.dismiss("session-check");
      }
    }, 60 * 1000); // check every 60 seconds

    return () => clearInterval(interval);
  }, [router]);

  const login = async (email: string, password: string) => {
    const res = await apiRequest(`${process.env.NEXT_PUBLIC_API_BASE_URL}/Auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = res as LoginResponse;
    if (!data.token) throw new Error("Invalid credentials");

    localStorage.setItem("token", data.token);

    let roleValue = "Student";
    if (data.user && data.user.roles && Array.isArray(data.user.roles) && data.user.roles.length > 0) {
      roleValue = data.user.roles[0];
    } else if (data.user && data.user.roles) {
      roleValue = data.user.roles[0] || "Student";
    }
    localStorage.setItem("role", roleValue);
    setRole(roleValue);
    setUser(data.user);
    setIsLoggedIn(true);
    toast.success("Login successful!");
    router.push("/");
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    setIsLoggedIn(false);
    setRole(null);
    setUser(null);
    toast.success("Logout successful!");
    router.push("/login");
  };

  const getToken = () => localStorage.getItem("token");

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, login, logout, getToken, role, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
