"use client";
import React, { createContext, useContext, useEffect, useState } from "react";
import { isTokenExpired } from "../lib/auth";

type RoleContextType = {
  token: string | null;
  // role is an array like in tkd_hub_web: ['Guest'] | ['Student'] | ['Coach'] | ['Admin']
  role: string[];
  displayName: string | null;
  avatarUrl: string | null;
  setToken: (t: string | null) => void;
  setRole: (r: string | string[]) => void;
  getRole: () => string[];
  setDisplayName: (n: string | null) => void;
  setAvatarUrl: (u: string | null) => void;
  roleLoading: boolean;
};

const RoleContext = createContext<RoleContextType | undefined>(undefined);

export const RoleProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [token, setTokenState] = useState<string | null>(null);
  const [role, setRoleState] = useState<string[]>(["Guest"]);
  const [displayName, setDisplayNameState] = useState<string | null>(null);
  const [avatarUrl, setAvatarUrlState] = useState<string | null>(null);
  const [roleLoading, setRoleLoading] = useState<boolean>(true);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const t = localStorage.getItem("token");
    const r = localStorage.getItem("role");
    const n = localStorage.getItem("displayName");
    const a = localStorage.getItem("avatarUrl");
    if (t) setTokenState(t);
    if (n) setDisplayNameState(n);
    if (a) setAvatarUrlState(a);

    // Load role from localStorage if present
    if (r) {
      try {
        const parsed = JSON.parse(r);
        if (Array.isArray(parsed) && parsed.length > 0) setRoleState(parsed);
        else if (typeof parsed === "string" && parsed.length > 0)
          setRoleState([parsed]);
      } catch {
        // fallback to string value
        setRoleState([r]);
      }
    }

    setRoleLoading(false);
  }, []);

  const setToken = (t: string | null) => {
    if (typeof window !== "undefined") {
      if (t) localStorage.setItem("token", t);
      else localStorage.removeItem("token");
    }
    setTokenState(t);
  };

  const setRole = (r: string | string[]) => {
    const rolesArray = Array.isArray(r) ? r : [r];
    setRoleState(rolesArray);
    if (typeof window !== "undefined") {
      if (rolesArray.includes("Guest")) {
        localStorage.removeItem("role");
      } else {
        localStorage.setItem("role", JSON.stringify(rolesArray));
      }
    }
  };

  const getRole = () => role;

  const setDisplayName = (n: string | null) => {
    if (typeof window !== "undefined") {
      if (n) localStorage.setItem("displayName", n);
      else localStorage.removeItem("displayName");
    }
    setDisplayNameState(n);
  };

  const setAvatarUrl = (u: string | null) => {
    if (typeof window !== "undefined") {
      if (u) localStorage.setItem("avatarUrl", u);
      else localStorage.removeItem("avatarUrl");
    }
    setAvatarUrlState(u);
  };

  // Expose a simple effect to keep role in sync with token/user if needed
  useEffect(() => {
    // If no token or expired, keep existing role (which may have been loaded from localStorage)
    if (!token || isTokenExpired(token)) {
      setRoleLoading(false);
      return;
    }

    // Try to parse roles from JWT if present (claims: role, roles)
    try {
      const payload = JSON.parse(atob(token.split(".")[1]));
      if (payload && (payload.roles || payload.role)) {
        const rolesFromToken: string[] = Array.isArray(payload.roles)
          ? payload.roles
          : typeof payload.role === "string"
            ? [payload.role]
            : [];
        if (rolesFromToken.length > 0) setRole(rolesFromToken);
      }
    } catch {
      // ignore malformed token
    }
    setRoleLoading(false);
  }, [token]);

  return (
    <RoleContext.Provider
      value={{
        token,
        role,
        displayName,
        avatarUrl,
        setToken,
        setRole,
        getRole,
        setDisplayName,
        setAvatarUrl,
        roleLoading,
      }}
    >
      {children}
    </RoleContext.Provider>
  );
};

export function useRole() {
  const ctx = useContext(RoleContext);
  if (!ctx) throw new Error("useRole must be used within RoleProvider");
  return ctx;
}
