"use client";
import { useState } from "react";
import { useRole } from "../context/RoleContext"; // <-- Import RoleContext

type LoginPageProps = {
  onLogin?: () => void;
};

const errorAnimationStyle = `
@keyframes fadeInError {
  from { opacity: 0; transform: translateY(-10px);}
  to { opacity: 1; transform: translateY(0);}
}
.tkd-error-animate {
  animation: fadeInError 0.5s ease;
}
`;

export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const { setRole } = useRole(); // <-- Use RoleContext

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("https://localhost:7046/api/Auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) {
        throw new Error("Invalid credentials");
      }

      const data = await res.json();
      localStorage.setItem("token", data.token);

      // Save user role ('Admin', 'Coach', 'Student')
      let roleValue = "Student";
      if (data.user && data.user.roles && Array.isArray(data.user.roles) && data.user.roles.length > 0) {
        roleValue = data.user.roles[0];
      } else if (data.user && data.user.role) {
        roleValue = data.user.role;
      }
      localStorage.setItem("role", roleValue);
      setRole(roleValue); // <-- Update RoleContext

      if (onLogin) onLogin();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Login failed");
      } else {
        setError("Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{errorAnimationStyle}</style>
      <div
        className="w-full max-w-md mx-auto my-8 bg-white dark:bg-neutral-900 rounded shadow p-6 sm:p-8"
        style={{ boxSizing: "border-box" }}
      >
        <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">TKD_Hub Login</h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-4"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-medium">Email:</label>
            <input
              id="email"
              type="email"
              className="border rounded px-3 py-2"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="Enter your email"
              title="Email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-medium">Password:</label>
            <input
              id="password"
              type="password"
              className="border rounded px-3 py-2"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="Enter your password"
              title="Password"
            />
          </div>
          <button
            type="submit"
            className="bg-black text-white rounded px-4 py-2 font-semibold hover:bg-neutral-800 transition-colors"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
          {error && (
            <div className="text-red-600 text-center tkd-error-animate">
              {error}
            </div>
          )}
        </form>
      </div>
    </>
  );
}
