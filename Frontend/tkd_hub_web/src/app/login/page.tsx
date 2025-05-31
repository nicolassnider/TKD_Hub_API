"use client";
import { useState } from "react";


type LoginPageProps = {
  onLogin?: () => void;
};


export default function LoginPage({ onLogin }: LoginPageProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);


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
      if (data.user && data.user.roles && Array.isArray(data.user.roles) && data.user.roles.length > 0) {
        localStorage.setItem("role", data.user.roles[0]);
      } else if (data.user && data.user.role) {
        localStorage.setItem("role", data.user.role);
      } else if (data.user && data.user.id) {
        // fallback if role is not present, you may adjust as needed
        localStorage.setItem("role", "Student");
      }
      if (onLogin) onLogin();
    } catch (err: any) {
      setError(err.message || "Login failed");
    } finally {
      setLoading(false);
    }
  }


  return (
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
        {error && <div className="text-red-600 text-center">{error}</div>}
      </form>
    </div>
  );
}
