"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { isTokenExpired } from "../utils/auth";
import { useAuth } from "./AuthContext";

export type UserRole = "Guest" | "Student" | "Coach" | "Admin";

type RoleContextType = {
  role: UserRole;
  setRole: (role: UserRole) => void;
  getRole: () => UserRole;
};

const RoleContext = createContext<RoleContextType>({
  role: "Guest",
  setRole: () => {},
  getRole: () => "Guest",
});

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("Guest");
  const { getToken } = useAuth();

  useEffect(() => {
    // Get role and token from context/localStorage
    const storedRole = (typeof window !== "undefined" ? localStorage.getItem("role") : null) as UserRole | null;
    const token = getToken();
    // If token is missing or expired, remove role and set to Guest
    if (!token || isTokenExpired(token)) {
      if (typeof window !== "undefined") {
        localStorage.removeItem("role");
      }
      setRole("Guest");
    } else if (storedRole) {
      setRole(storedRole);
    }
  }, [getToken]);

  const getRole = () => role;

  return (
    <RoleContext.Provider value={{ role, setRole, getRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
