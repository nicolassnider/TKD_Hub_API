import React, { useState } from "react";
import { useRole } from "../context/RoleContext";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";

const baseUrl = "https://localhost:7046/api";

export default function LoginForm() {
  const { setToken, setRole, setDisplayName, setAvatarUrl } = useRole();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch(`${baseUrl}/Auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => null);
        throw new Error(
          (body && (body as any).message) || `Login failed: ${res.status}`,
        );
      }
      const body = await res.json();
      const token = body.token ?? body.data?.token;
      const user = body.user ?? body.data?.user;
      const role = user?.role ?? (user?.roles && user.roles[0]) ?? null;
      const displayName = user?.displayName ?? user?.name ?? null;
      const avatarUrl = user?.avatarUrl ?? user?.picture ?? null;
      if (!token) throw new Error("No token in response");
      setToken(token);
      // Normalize role into an array for the RoleContext
      const roleArray = role
        ? Array.isArray(role)
          ? role
          : [role]
        : ["Student"];
      setRole(roleArray);
      // redirect to home after successful login
      navigate("/");
      setDisplayName(displayName);
      setAvatarUrl(avatarUrl);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-md w-full p-4 bg-white rounded shadow"
    >
      <h2 className="text-xl font-semibold mb-4">Sign in</h2>
      {error && (
        <Alert severity="error" className="mb-2">
          {error}
        </Alert>
      )}
      <div className="mb-3">
        <label
          htmlFor="email"
          className="block text-sm font-medium text-gray-700"
        >
          Email
        </label>
        <input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          placeholder="you@example.com"
          required
        />
      </div>
      <div className="mb-3">
        <label
          htmlFor="password"
          className="block text-sm font-medium text-gray-700"
        >
          Password
        </label>
        <input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mt-1 block w-full border rounded p-2"
          placeholder="Your password"
          required
        />
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="px-4 py-2 bg-blue-600 text-white rounded"
          disabled={loading}
        >
          {loading ? "Signing..." : "Sign in"}
        </button>
      </div>
    </form>
  );
}
