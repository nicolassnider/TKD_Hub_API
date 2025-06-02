"use client";
import React, { createContext, useContext, useState, useEffect } from "react";

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
    // Example: get role from localStorage or API
    const storedRole = localStorage.getItem("role") as UserRole | null;
    if (storedRole) setRole(storedRole);
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
