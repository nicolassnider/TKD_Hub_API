import { useState } from "react";
import { useRole } from "../../context/RoleContext";
import { useNavigate } from "react-router-dom";
import Alert from "@mui/material/Alert";
import { fetchJson } from "../../lib/api";


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
      const body = await fetchJson<any>("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });


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
    <form onSubmit={handleSubmit} className="auth-card">
      <h2 className="text-2xl font-semibold mb-4">Sign in</h2>
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
          className="mt-1 auth-input"
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
          className="mt-1 auth-input"
          placeholder="Your password"
          required
        />
      </div>
      <div className="flex justify-end">
        <button type="submit" className="auth-button" disabled={loading}>
          {loading ? "Signing..." : "Sign in"}
        </button>
      </div>
    </form>
  );
}
