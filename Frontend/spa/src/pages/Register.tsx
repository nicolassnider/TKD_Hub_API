import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRole } from "../context/RoleContext";
import { fetchJson } from "../lib/api";
import {
  Alert,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Paper,
} from "@mui/material";

export default function Register() {
  const navigate = useNavigate();
  const { setToken, setRole, setDisplayName, setAvatarUrl } = useRole();
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const validate = () => {
    if (!firstName || !lastName) return "Please provide your full name.";
    if (!email || !/\S+@\S+\.\S+/.test(email))
      return "Please provide a valid email.";
    if (password.length < 6) return "Password must be at least 6 characters.";
    if (password !== confirmPassword) return "Passwords do not match.";
    return null;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    const v = validate();
    if (v) return setError(v);
    setLoading(true);
    try {
      const body = await fetchJson<any>("/api/Auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ firstName, lastName, email, password }),
      });

      // If API returns a token we can auto-login; otherwise redirect to login
      const token = body?.token ?? body?.data?.token;
      const user = body?.user ?? body?.data?.user;
      if (token) {
        // populate RoleContext so the app reflects logged-in state immediately
        setToken(token);
        const roleVal = user?.role ?? (user?.roles && user.roles[0]) ?? null;
        const roleArray = roleVal
          ? Array.isArray(roleVal)
            ? roleVal
            : [roleVal]
          : ["Student"];
        setRole(roleArray);
        const displayName =
          user?.displayName ?? user?.name ?? `${firstName} ${lastName}`;
        const avatarUrl = user?.avatarUrl ?? user?.picture ?? null;
        setDisplayName(displayName);
        setAvatarUrl(avatarUrl);
        toast.success("Welcome to TKD Hub! Registration successful.");
        navigate("/");
      } else {
        // Show success toast and redirect to login
        toast.success(
          "Registration successful! Please log in with your credentials.",
        );
        setTimeout(() => {
          navigate("/login");
        }, 2000); // Wait 2 seconds for user to read the toast
      }
    } catch (err: any) {
      const errorMessage =
        err.message || "Registration failed. Please try again.";
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="center-vh">
      <form onSubmit={handleSubmit} className="auth-card">
        <Typography
          variant="h4"
          component="h2"
          className="gradient-text"
          sx={{ mb: 3, textAlign: "center" }}
        >
          Join TKD Hub
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
          <TextField
            label="First Name"
            placeholder="First name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
            fullWidth
            className="auth-input"
            InputProps={{
              style: {
                background: "var(--surface)",
                color: "var(--fg)",
              },
            }}
            InputLabelProps={{
              style: { color: "var(--fg-muted)" },
            }}
          />
          <TextField
            label="Last Name"
            placeholder="Last name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
            fullWidth
            className="auth-input"
            InputProps={{
              style: {
                background: "var(--surface)",
                color: "var(--fg)",
              },
            }}
            InputLabelProps={{
              style: { color: "var(--fg-muted)" },
            }}
          />
        </Box>

        <TextField
          label="Email"
          placeholder="you@example.com"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          fullWidth
          className="auth-input"
          sx={{ mb: 3 }}
          InputProps={{
            style: {
              background: "var(--surface)",
              color: "var(--fg)",
            },
          }}
          InputLabelProps={{
            style: { color: "var(--fg-muted)" },
          }}
        />

        <TextField
          label="Password"
          placeholder="At least 6 characters"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          fullWidth
          className="auth-input"
          sx={{ mb: 3 }}
          InputProps={{
            style: {
              background: "var(--surface)",
              color: "var(--fg)",
            },
          }}
          InputLabelProps={{
            style: { color: "var(--fg-muted)" },
          }}
        />

        <TextField
          label="Confirm Password"
          placeholder="Confirm password"
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          required
          fullWidth
          className="auth-input"
          sx={{ mb: 4 }}
          InputProps={{
            style: {
              background: "var(--surface)",
              color: "var(--fg)",
            },
          }}
          InputLabelProps={{
            style: { color: "var(--fg-muted)" },
          }}
        />

        <Button
          type="submit"
          className="auth-button"
          disabled={loading}
          fullWidth
          size="large"
          sx={{ mb: 2 }}
        >
          {loading ? (
            <>
              <CircularProgress size={20} sx={{ mr: 1, color: "white" }} />
              Creating Account...
            </>
          ) : (
            "Create Account"
          )}
        </Button>

        <Box sx={{ textAlign: "center" }}>
          <Typography variant="body2" sx={{ color: "var(--fg-muted)" }}>
            Already have an account?{" "}
            <Button
              variant="text"
              onClick={() => navigate("/login")}
              sx={{
                color: "var(--primary)",
                textTransform: "none",
                p: 0,
                minWidth: "auto",
                "&:hover": {
                  background: "transparent",
                  color: "var(--primary-600)",
                },
              }}
            >
              Sign in
            </Button>
          </Typography>
        </Box>
      </form>
    </div>
  );
}
