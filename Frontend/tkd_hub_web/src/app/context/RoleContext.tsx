"use client";
import React, { createContext, useContext, useState, useEffect } from "react";
import { isTokenExpired } from "../utils/auth";

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

  useEffect(() => {
    // Get role and token from localStorage
    const storedRole = localStorage.getItem("role") as UserRole | null;
    const token = localStorage.getItem("token");
    // If token is missing or expired, remove role and set to Guest
    if (!token || isTokenExpired(token)) {
      localStorage.removeItem("role");
      setRole("Guest");
    } else if (storedRole) {
      setRole(storedRole);
    }
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
