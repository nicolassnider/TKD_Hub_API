import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from "react";
import { isTokenExpired } from "../lib/auth";
import { fetchJson, ApiError } from "../lib/api";

type RoleContextType = {
  token: string | null;
  // role is an array like in tkd_hub_web: ['Guest'] | ['Student'] | ['Coach'] | ['Admin']
  role: string[];
  displayName: string | null;
  avatarUrl: string | null;
  setToken: (t: string | null) => void;
  setRole: (r: string | string[]) => void;
  getRole: () => string[];
  hasRole: (r: string) => boolean;
  isAdmin: () => boolean;
  isTeacher: () => boolean;
  isStudent: () => boolean;
  effectiveRole: () => string; // Admin > Teacher > Student > Guest
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

    // Validate token before setting it
    if (t) {
      if (isTokenExpired(t)) {
        // Token is expired, clear all auth data
        localStorage.removeItem("token");
        localStorage.removeItem("role");
        localStorage.removeItem("displayName");
        localStorage.removeItem("avatarUrl");
        setTokenState(null);
        setRoleState(["Guest"]);
        setDisplayNameState(null);
        setAvatarUrlState(null);
      } else {
        // Token is valid, restore auth state
        setTokenState(t);
        if (n) setDisplayNameState(n);
        if (a) setAvatarUrlState(a);

        // Load role from localStorage if present
        if (r) {
          try {
            const parsed = JSON.parse(r);
            if (Array.isArray(parsed) && parsed.length > 0)
              setRoleState(parsed);
            else if (typeof parsed === "string" && parsed.length > 0)
              setRoleState([parsed]);
          } catch {
            // fallback to string value
            setRoleState([r]);
          }
        }
      }
    } else {
      // No token found, ensure we're in guest state
      setRoleState(["Guest"]);
    }

    setRoleLoading(false);
  }, []);

  const setToken = (t: string | null) => {
    if (typeof window !== "undefined") {
      if (t) localStorage.setItem("token", t);
      else localStorage.removeItem("token");
    }
    setTokenState(t);
    // If token is cleared (logout), set role to Guest
    if (!t) setRole("Guest");
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

  const getRole = useCallback(() => role, [role]);

  const hasRole = useCallback(
    (r: string) => Array.isArray(role) && role.includes(r),
    [role],
  );

  const isAdmin = useCallback(() => hasRole("Admin"), [hasRole]);

  const isTeacher = useCallback(
    () => hasRole("Teacher") || hasRole("Coach"),
    [hasRole],
  );

  const isStudent = useCallback(() => hasRole("Student"), [hasRole]);

  const effectiveRole = useCallback(() => {
    if (isAdmin()) return "Admin";
    if (isTeacher()) return "Teacher";
    if (isStudent()) return "Student";
    return "Guest";
  }, [isAdmin, isTeacher, isStudent]);

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
    // First try to validate the token with the backend 'me' endpoint so we
    // observe server-side session state and get authoritative profile/roles.
    (async () => {
      try {
        // Try common profile endpoints. Backend may expose /api/Account/me or /api/Users/me.
        const tryPaths = [
          "/api/Account/me",
          "/api/Users/me",
          "/api/Account/profile",
        ];
        let profile: any = null;
        for (const p of tryPaths) {
          try {
            profile = await fetchJson(p);
            if (profile) break;
          } catch (err) {
            // If it's a 404 just try the next path; on 401/403 we'll handle below
            if (
              err instanceof ApiError &&
              (err.status === 404 || err.status === 400)
            ) {
              continue;
            }
            throw err;
          }
        }

        // If we received a profile, map fields to context and localStorage.
        if (profile) {
          // roles may be roles[] or role
          const roles: string[] = Array.isArray(profile.roles)
            ? profile.roles
            : profile.role
              ? Array.isArray(profile.role)
                ? profile.role
                : [profile.role]
              : [];
          if (roles.length > 0) setRole(roles);

          const name =
            profile.displayName ?? profile.name ?? profile.userName ?? null;
          if (name) setDisplayName(name);

          const avatar = profile.avatarUrl ?? profile.avatar ?? null;
          if (avatar) setAvatarUrl(avatar);
        } else {
          // If backend didn't expose a profile, fall back to parsing JWT claims.
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
            if (payload && (payload.displayName || payload.name)) {
              setDisplayName(payload.displayName ?? payload.name ?? null);
            }
          } catch {
            // ignore malformed token
          }
        }
      } catch (err) {
        // If the server rejects the token (unauthorized), clear it locally so UI updates.
        if (
          err instanceof ApiError &&
          (err.status === 401 || err.status === 403)
        ) {
          setToken(null);
        } else {
          // other errors are non-fatal for startup; keep existing token and roles
          console.warn("RoleProvider: profile validation failed:", err);
        }
      } finally {
        setRoleLoading(false);
      }
    })();
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
        hasRole,
        isAdmin,
        isTeacher,
        isStudent,
        effectiveRole,
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
