import { useRole } from "context/RoleContext";
import Unauthorized from "pages/Unauthorized";
import React from "react";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRoles?: string[];
  requireAuth?: boolean;
}

export default function ProtectedRoute({
  children,
  requiredRoles = [],
  requireAuth = true,
}: ProtectedRouteProps) {
  const { token, role, roleLoading } = useRole();

  // Show loading while authentication state is being determined
  if (roleLoading) {
    console.log("ProtectedRoute: Still loading authentication state...");
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  const isAuthenticated = !!token;
  const userRoles = Array.isArray(role) ? role : [role];

  console.log("ProtectedRoute: Authentication check", {
    isAuthenticated,
    userRoles,
    requiredRoles,
    requireAuth,
    tokenExists: !!token,
  });

  // If authentication is required but user is not authenticated
  if (requireAuth && !isAuthenticated) {
    console.log(
      "ProtectedRoute: Redirecting to login - authentication required but user not authenticated",
    );
    return <Navigate to="/login" replace />;
  }

  // If specific roles are required, check if user has any of them
  if (requiredRoles.length > 0 && isAuthenticated) {
    const hasRequiredRole = requiredRoles.some((requiredRole) =>
      userRoles.includes(requiredRole),
    );

    if (!hasRequiredRole) {
      // Show unauthorized page instead of redirecting
      return <Unauthorized />;
    }
  }

  return <>{children}</>;
}
