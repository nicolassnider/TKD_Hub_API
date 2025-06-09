"use client";
import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import toast from "react-hot-toast";

const errorAnimationStyle = `
@keyframes fadeInError {
  from { opacity: 0; transform: translateY(-10px);}
  to { opacity: 1; transform: translateY(0);}
}
.tkd-error-animate {
  animation: fadeInError 0.5s ease;
}
`;

export default function LoginPage() {
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await login(email, password);
      // Success toast and redirect handled in AuthContext
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Login failed");
        toast.error(err.message || "Login failed");
      } else {
        setError("Login failed");
        toast.error("Login failed");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <style>{errorAnimationStyle}</style>
      <div
        className="w-full max-w-md mx-auto my-16 bg-white dark:bg-neutral-900 rounded-xl shadow-lg p-8 flex flex-col gap-6 tkd-login-box"
      >
        <h2 className="text-2xl sm:text-3xl font-extrabold mb-2 text-center text-gray-900 dark:text-white tracking-tight">
          TKD_Hub Login
        </h2>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-5"
        >
          <div className="flex flex-col gap-1">
            <label htmlFor="email" className="font-medium text-gray-700 dark:text-gray-200">Email:</label>
            <input
              id="email"
              type="email"
              className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoComplete="username"
              placeholder="Enter your email"
              title="Email"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label htmlFor="password" className="font-medium text-gray-700 dark:text-gray-200">Password:</label>
            <input
              id="password"
              type="password"
              className="border border-gray-300 dark:border-gray-700 rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-400"
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
            className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
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
