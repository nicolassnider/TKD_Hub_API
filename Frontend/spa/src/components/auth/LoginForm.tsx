import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Alert,
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
  CircularProgress,
  Container,
  Fade,
} from "@mui/material";
import { Login as LoginIcon } from "@mui/icons-material";
import { useRole } from "context/RoleContext";
import { fetchJson } from "lib/api";

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
      const body = await fetchJson<any>("/api/auth/login", {
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
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        py: 4,
      }}
    >
      <Fade in timeout={600}>
        <Card
          sx={{
            width: "100%",
            maxWidth: 450,
            borderRadius: 4,
            background: "linear-gradient(135deg, #1e1e1e 0%, #2d2d2d 100%)",
            border: "2px solid #ff6b35",
            boxShadow: "0 20px 40px rgba(255, 107, 53, 0.2)",
            backdropFilter: "blur(10px)",
          }}
        >
          <CardContent sx={{ p: { xs: 3, sm: 4, md: 5 } }}>
            {/* Header */}
            <Box sx={{ textAlign: "center", mb: 4 }}>
              <Typography
                variant="h3"
                component="h1"
                sx={{
                  fontWeight: 800,
                  background:
                    "linear-gradient(45deg, #ff6b35 30%, #2196f3 70%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  mb: 1,
                  fontSize: { xs: "2rem", sm: "2.5rem" },
                }}
              >
                Sign in
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: "1.1rem" }}
              >
                Welcome back to TKD Hub
              </Typography>
            </Box>

            {/* Error Alert */}
            {error && (
              <Fade in>
                <Alert
                  severity="error"
                  sx={{
                    mb: 3,
                    borderRadius: 2,
                    backgroundColor: "rgba(211, 47, 47, 0.1)",
                    border: "1px solid rgba(211, 47, 47, 0.3)",
                  }}
                >
                  {error}
                </Alert>
              </Fade>
            )}

            {/* Form */}
            <Box
              component="form"
              onSubmit={handleSubmit}
              sx={{ width: "100%" }}
            >
              <TextField
                fullWidth
                id="email"
                label="Email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                sx={{
                  mb: 3,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff6b35",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff6b35",
                      boxShadow: "0 0 0 2px rgba(255, 107, 53, 0.2)",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#ff6b35",
                  },
                }}
              />

              <TextField
                fullWidth
                id="password"
                label="Password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Your password"
                required
                sx={{
                  mb: 4,
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 2,
                    backgroundColor: "rgba(255, 255, 255, 0.05)",
                    "&:hover .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff6b35",
                    },
                    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                      borderColor: "#ff6b35",
                      boxShadow: "0 0 0 2px rgba(255, 107, 53, 0.2)",
                    },
                  },
                  "& .MuiInputLabel-root.Mui-focused": {
                    color: "#ff6b35",
                  },
                }}
              />

              <Button
                type="submit"
                fullWidth
                variant="contained"
                size="large"
                disabled={loading}
                startIcon={
                  loading ? (
                    <CircularProgress size={20} color="inherit" />
                  ) : (
                    <LoginIcon />
                  )
                }
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  textTransform: "none",
                  background: loading
                    ? "linear-gradient(45deg, #666 30%, #888 90%)"
                    : "linear-gradient(45deg, #ff6b35 30%, #ff9966 90%)",
                  boxShadow: "0 4px 16px rgba(255, 107, 53, 0.3)",
                  "&:hover": {
                    background:
                      "linear-gradient(45deg, #cc4400 30%, #ff6b35 90%)",
                    boxShadow: "0 6px 20px rgba(255, 107, 53, 0.4)",
                    transform: "translateY(-1px)",
                  },
                  "&:disabled": {
                    background: "linear-gradient(45deg, #666 30%, #888 90%)",
                    color: "rgba(255, 255, 255, 0.6)",
                  },
                  transition: "all 0.3s ease-in-out",
                }}
              >
                {loading ? "Signing in..." : "Sign in"}
              </Button>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
}
