"use client";
import React, { createContext, useContext, useState, useEffect, useCallback } from "react";

type RoleContextType = {
  role: string | null;
  setRole: (role: string | null) => void;
};

const RoleContext = createContext<RoleContextType>({
  role: null,
  setRole: () => {},
});

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRoleState] = useState<string | null>(null);

  // Keep role in sync with localStorage
  useEffect(() => {
    const storedRole = typeof window !== "undefined" ? localStorage.getItem("role") : null;
    setRoleState(storedRole);
  }, []);

  // Update both state and localStorage
  const setRole = useCallback((newRole: string | null) => {
    setRoleState(newRole);
    if (typeof window !== "undefined") {
      if (newRole) {
        localStorage.setItem("role", newRole);
      } else {
        localStorage.removeItem("role");
      }
    }
  }, []);

  return (
    <RoleContext.Provider value={{ role, setRole }}>
      {children}
    </RoleContext.Provider>
  );
};

export const useRole = () => useContext(RoleContext);
