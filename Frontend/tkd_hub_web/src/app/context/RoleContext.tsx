"use client";
import React, { createContext, useContext, useState, useEffect } from "react";


type RoleContextType = {
  role: string | null;
  setRole: (role: string | null) => void;
};


const RoleContext = createContext<RoleContextType>({
  role: null,
  setRole: () => {},
});


export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [role, setRole] = useState<string | null>(null);


  useEffect(() => {
    const storedRole = localStorage.getItem("role");
    setRole(storedRole);
  }, []);


  return (
    <html lang="en">
      <body>
        <RoleProvider>
          {children}
        </RoleProvider>
      </body>
    </html>
  );
};


export const useRole = () => useContext(RoleContext);