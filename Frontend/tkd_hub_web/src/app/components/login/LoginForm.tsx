"use client";
import { useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import LabeledInput from "../common/inputs/LabeledInput";
import GenericButton from "../common/actionButtons/GenericButton";

const errorAnimationStyle = `
@keyframes fadeInError {
  from { opacity: 0; transform: translateY(-10px);}
  to { opacity: 1; transform: translateY(0);}
}
.tkd-error-animate {
  animation: fadeInError 0.5s ease;
}
`;

const LoginForm: React.FC = () => {
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
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <LabeledInput
          label="Email"
          name="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          autoComplete="username"
          placeholder="Enter your email"
        />
        <LabeledInput
          label="Password"
          name="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          autoComplete="current-password"
          placeholder="Enter your password"
        />
        <GenericButton type="submit" variant="success" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </GenericButton>
        {error && (
          <div className="text-red-400 text-center tkd-error-animate">
            {error}
          </div>
        )}
      </form>
    </>
  );
};

export default LoginForm;
