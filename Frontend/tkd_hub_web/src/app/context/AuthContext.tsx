"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { isTokenExpired } from "../utils/auth";
import toast from "react-hot-toast";
import { useApiRequest } from "../utils/api";
import { LoginResponse } from "../types/LoginResponse";
import { User } from "../types/User";
import { useClasses } from "./ClassContext";
import { useRankContext } from "./RankContext";
import { useTulContext } from "./TulContext";
import { useCoaches } from "./CoachContext";

type AuthContextType = {
  isLoggedIn: boolean;
  setIsLoggedIn: (loggedIn: boolean) => void;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  getToken: () => string | null;
  role: string | null;
  user: User | null;
  loading: boolean;
};

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => { },
  login: async () => { },
  logout: () => { },
  getToken: () => null,
  role: null,
  user: null,
  loading: false,
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { apiRequest } = useApiRequest();

  const { fetchClasses } = useClasses();
  const { fetchCoaches } = useCoaches();
  const { fetchRanks } = useRankContext();
  const { fetchTuls } = useTulContext();  

  // Check token and restore user on mount
  useEffect(() => {
    setLoading(true);
    const token = localStorage.getItem("token");
    const storedUser = localStorage.getItem("user");
    const storedRole = localStorage.getItem("role");
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("token");
      localStorage.removeItem("role");
      localStorage.removeItem("user");
      setIsLoggedIn(false);
      setRole(null);
      setUser(null);
      setLoading(false);
      router.push("/login");
    } else {
      setIsLoggedIn(true);
      setRole(storedRole);
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
      setLoading(false);
    }
  }, [router]);

  // Fetch essential data after login
  useEffect(() => {
    if (isLoggedIn) {
      fetchClasses?.();
      fetchCoaches?.();
      fetchRanks?.();      
      fetchTuls?.();      
    }
  }, [
    isLoggedIn,
    fetchClasses,
    fetchCoaches,
    fetchRanks,
    fetchTuls,
  ]);

  // ...periodic session check can be added here if needed...
  
  // --- Auth Login Endpoint ---
  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const data = await apiRequest<LoginResponse>("/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!data.token) throw new Error("Invalid credentials");

      localStorage.setItem("token", data.token);

      let roleValue = "Student";
      if (data.user && data.user.roles && Array.isArray(data.user.roles) && data.user.roles.length > 0) {
        roleValue = data.user.roles[0];
      } else if (data.user && data.user.roles) {
        roleValue = data.user.roles[0] || "Student";
      }
      localStorage.setItem("role", roleValue);
      localStorage.setItem("user", JSON.stringify(data.user));
      setRole(roleValue);
      setUser(data.user);
      setIsLoggedIn(true);
      toast.success("Login successful!");
      router.push("/");
    } catch (err) {
      const errorMsg = err instanceof Error ? err.message : "Login failed";
      toast.error(errorMsg);
      setIsLoggedIn(false);
      setRole(null);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    localStorage.removeItem("user");
    setIsLoggedIn(false);
    setRole(null);
    setUser(null);
    toast.success("Logout successful!");
    router.push("/login");
  };

  const getToken = () => localStorage.getItem("token");

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, login, logout, getToken, role, user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
