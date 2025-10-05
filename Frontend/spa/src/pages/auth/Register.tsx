import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useRole } from "../../context/RoleContext";
import { fetchJson } from "../../lib/api";
import {
  Alert,
  TextField,
  Button,
  Box,
  Typography,
  CircularProgress,
  Card,
  CardContent,
  Container,
  Fade,
} from "@mui/material";
import { PersonAdd as PersonAddIcon } from "@mui/icons-material";

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
      const body = await fetchJson<any>("/api/auth/register", {
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
    <Container
      maxWidth="md"
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
            maxWidth: 550,
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
                  fontSize: { xs: "1.75rem", sm: "2.25rem" },
                }}
              >
                Join TKD Hub
              </Typography>
              <Typography
                variant="body1"
                color="text.secondary"
                sx={{ fontSize: "1.1rem" }}
              >
                Start your Taekwon-Do journey today
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
              {/* Name Fields */}
              <Box sx={{ display: "flex", gap: 2, mb: 3 }}>
                <TextField
                  fullWidth
                  label="First Name"
                  placeholder="First name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  sx={{
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
                  label="Last Name"
                  placeholder="Last name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  required
                  sx={{
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
              </Box>

              {/* Email Field */}
              <TextField
                fullWidth
                label="Email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
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

              {/* Password Fields */}
              <TextField
                fullWidth
                label="Password"
                type="password"
                placeholder="At least 6 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
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
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
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

              {/* Submit Button */}
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
                    <PersonAddIcon />
                  )
                }
                sx={{
                  borderRadius: 2,
                  py: 1.5,
                  fontSize: "1.1rem",
                  fontWeight: 700,
                  textTransform: "none",
                  mb: 3,
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
                {loading ? "Creating Account..." : "Create Account"}
              </Button>

              {/* Login Link */}
              <Box sx={{ textAlign: "center" }}>
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ fontSize: "1rem" }}
                >
                  Already have an account?{" "}
                  <Button
                    variant="text"
                    onClick={() => navigate("/login")}
                    sx={{
                      color: "#ff6b35",
                      textTransform: "none",
                      fontWeight: 600,
                      p: 0,
                      minWidth: "auto",
                      "&:hover": {
                        background: "transparent",
                        color: "#ff9966",
                        textDecoration: "underline",
                      },
                    }}
                  >
                    Sign in here
                  </Button>
                </Typography>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Fade>
    </Container>
  );
}
