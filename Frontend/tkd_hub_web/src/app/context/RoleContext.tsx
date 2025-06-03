"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { isTokenExpired } from "../utils/auth";
import { useAuth } from "./AuthContext"; // <-- Import useAuth

export type UserRole = "Guest" | "Student" | "Coach" | "Admin";

type RoleContextType = {
  role: UserRole;
  setRole: (role: UserRole) => void;
};

const RoleContext = createContext<RoleContextType>({
  role: "Guest",
  setRole: () => {},
});

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<UserRole>("Guest");
  const { getToken } = useAuth(); // <-- Use getToken

  useEffect(() => {
    // Get role and token from context/localStorage
    const storedRole = localStorage.getItem("role") as UserRole | null;
    const token = getToken();
    // If token is missing or expired, remove role and set to Guest
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("role");
      setRole("Guest");
    } else if (storedRole) {
      setRole(storedRole);
    }
  }, [getToken]);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
