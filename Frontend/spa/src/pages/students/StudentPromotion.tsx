import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Button,
  Box,
  Card,
  CardContent,
  Divider,
  Alert,
  CircularProgress,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ArrowBack, TrendingUp } from "@mui/icons-material";
import { fetchJson } from "../../lib/api";
import { Student, RankDto, PromotionDto } from "../../types/api";
import { useProfile } from "../../context/ProfileContext";
import CoachSelector from "../../components/coaches/CoachSelector";
import DojaangSelector from "../../components/dojaangs/DojaangSelector";

interface PromotionFormData {
  rankId: string;
  promotionDate: Date;
  notes: string;
  coachId: number | null;
  dojaangId: number | null;
}

export default function StudentPromotion() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { profile } = useProfile();

  const [student, setStudent] = useState<Student | null>(null);
  const [ranks, setRanks] = useState<RankDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [formData, setFormData] = useState<PromotionFormData>({
    rankId: "",
    promotionDate: new Date(),
    notes: "",
    coachId: null,
    dojaangId: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        // Load student data and ranks in parallel
        const [studentResponse, ranksResponse] = await Promise.all([
          fetchJson(`/api/Students/${id}`) as Promise<
            { data: Student } | Student
          >,
          fetchJson("/api/Ranks") as Promise<{ data: RankDto[] } | RankDto[]>,
        ]);

        console.log("Debug - Raw studentResponse:", studentResponse);
        console.log("Debug - Raw ranksResponse:", ranksResponse);

        // Handle different response structures
        const student =
          (studentResponse as any)?.data || (studentResponse as Student);
        const ranksArray =
          (ranksResponse as any)?.data || (ranksResponse as RankDto[]);

        setStudent(student);
        setRanks(Array.isArray(ranksArray) ? ranksArray : []);

        // Set default values from profile and student data
        const updates: Partial<PromotionFormData> = {};

        // Set coach ID from current profile
        if (profile?.id) {
          updates.coachId = profile.id;
        }

        // Set dojaang ID from student's dojaang
        if (student.dojaangId) {
          updates.dojaangId = student.dojaangId;
        }

        // Set default next rank if available
        if (student.currentRankId && ranksArray && ranksArray.length > 0) {
          const currentRank = ranksArray.find(
            (r: RankDto) => r.id === student.currentRankId,
          );
          if (currentRank) {
            // Find next rank by order (assuming ranks have an order property)
            const nextRank = ranksArray.find(
              (r: RankDto) => r.order > currentRank.order,
            );
            if (nextRank) {
              updates.rankId = nextRank.id.toString();
            }
          }
        }

        if (Object.keys(updates).length > 0) {
          setFormData((prev) => ({ ...prev, ...updates }));
        }
      } catch (err) {
        setError("Failed to load student or rank data");
        console.error("Error loading data:", err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      loadData();
    }
  }, [id, profile]);

  // Set default dojaang to "Sede Central" if not already set
  useEffect(() => {
    const setDefaultDojaang = async () => {
      // Only set default if dojaangId is not already set (null)
      if (formData.dojaangId === null && !loading) {
        try {
          const dojaangsResponse = await fetchJson<any>("/api/Dojaangs");
          const sedeCentral = dojaangsResponse.find(
            (d: any) =>
              d.name.toLowerCase().includes("sede central") ||
              d.name.toLowerCase().includes("central"),
          );

          if (sedeCentral) {
            setFormData((prev) => ({ ...prev, dojaangId: sedeCentral.id }));
          }
        } catch (err) {
          console.error("Error loading dojaangs for default selection:", err);
        }
      }
    };

    setDefaultDojaang();
  }, [formData.dojaangId, loading]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.rankId) {
      setError("Please select a rank for promotion");
      return;
    }

    if (!formData.coachId) {
      setError("Coach selection is required for promotion");
      return;
    }

    if (!formData.dojaangId) {
      setError("Dojaang selection is required for promotion");
      return;
    }

    try {
      setSubmitting(true);
      setError(null);

      const promotionData = {
        studentId: parseInt(id!),
        rankId: parseInt(formData.rankId),
        promotionDate: formData.promotionDate.toISOString(),
        coachId: formData.coachId!,
        dojaangId: formData.dojaangId!,
        notes: formData.notes || "",
      };

      await fetchJson("/api/Promotions", {
        method: "POST",
        body: JSON.stringify(promotionData),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Navigate back to student detail page
      navigate(`/students/${id}`, {
        replace: true,
        state: { message: "Student promoted successfully!" },
      });
    } catch (err: any) {
      setError(err.message || "Failed to promote student");
      console.error("Error promoting student:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const handleCancel = () => {
    navigate(-1);
  };

  if (loading) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Box
          display="flex"
          justifyContent="center"
          alignItems="center"
          minHeight={200}
        >
          <CircularProgress />
        </Box>
      </Container>
    );
  }

  if (!student) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Alert severity="error">Student not found</Alert>
      </Container>
    );
  }

  // Debug logging
  console.log("Debug - Student data:", student);
  console.log("Debug - Ranks data:", ranks);
  console.log("Debug - Student currentRankId:", student.currentRankId);
  console.log("Debug - Looking for rank with id:", student.currentRankId);

  const currentRank = ranks.find((r) => r.id === student.currentRankId);
  console.log("Debug - Found currentRank:", currentRank);

  const selectedRank = ranks.find((r) => r.id.toString() === formData.rankId);

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Container maxWidth="md" sx={{ py: 4 }}>
        {/* Header */}
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBack />}
            onClick={handleCancel}
            sx={{ mb: 2, color: "#ff6b35" }}
          >
            Back
          </Button>
          <Typography
            variant="h4"
            sx={{
              color: "#fff",
              mb: 1,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <TrendingUp sx={{ color: "#ff6b35" }} />
            Promote Student
          </Typography>
          <Typography variant="h6" sx={{ color: "rgba(255,255,255,0.8)" }}>
            {student.firstName} {student.lastName}
          </Typography>
        </Box>

        {/* Current Rank Card */}
        <Card
          sx={{
            mb: 3,
            backgroundColor: "#1e1e1e",
            border: "1px solid rgba(255,255,255,0.1)",
          }}
        >
          <CardContent>
            <Typography variant="h6" sx={{ color: "#ff6b35", mb: 2 }}>
              Current Rank
            </Typography>
            <Typography variant="h5" sx={{ color: "#fff" }}>
              {currentRank?.name || "No Rank Assigned"}
            </Typography>
            {currentRank?.description && (
              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.7)", mt: 1 }}
              >
                {currentRank.description}
              </Typography>
            )}
          </CardContent>
        </Card>

        {/* Promotion Form */}
        <Paper
          component="form"
          onSubmit={handleSubmit}
          sx={{
            p: 4,
            backgroundColor: "#1e1e1e",
            border: "1px solid rgba(255,255,255,0.1)",
            borderRadius: 2,
          }}
        >
          <Typography variant="h6" sx={{ color: "#fff", mb: 3 }}>
            Promotion Details
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
            {/* Rank Selection */}
            <FormControl fullWidth>
              <InputLabel sx={{ color: "rgba(255,255,255,0.7)" }}>
                Promote to Rank
              </InputLabel>
              <Select
                value={formData.rankId}
                onChange={(e) =>
                  setFormData((prev) => ({ ...prev, rankId: e.target.value }))
                }
                sx={{
                  color: "#fff",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "rgba(255,255,255,0.3)",
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ff6b35",
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#ff6b35",
                  },
                }}
              >
                {ranks
                  .filter((rank) => rank.id !== student.currentRankId) // Exclude current rank
                  .map((rank) => (
                    <MenuItem key={rank.id} value={rank.id.toString()}>
                      {rank.name}
                      {rank.description && ` - ${rank.description}`}
                    </MenuItem>
                  ))}
              </Select>
            </FormControl>

            {/* Coach and Dojaang Information */}
            <Box
              sx={{
                display: "flex",
                gap: 2,
                flexDirection: { xs: "column", sm: "row" },
              }}
            >
              <Box
                sx={{
                  flex: 1,
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                    "&:hover fieldset": { borderColor: "#ff6b35" },
                    "&.Mui-focused fieldset": { borderColor: "#ff6b35" },
                  },
                  "& .MuiAutocomplete-popupIndicator": {
                    color: "rgba(255,255,255,0.7)",
                  },
                  "& .MuiAutocomplete-clearIndicator": {
                    color: "rgba(255,255,255,0.7)",
                  },
                }}
              >
                <CoachSelector
                  value={formData.coachId}
                  onChange={(coachId) =>
                    setFormData((prev) => ({ ...prev, coachId }))
                  }
                  label="Promoting Coach"
                  required
                  size="medium"
                />
              </Box>
              <Box
                sx={{
                  flex: 1,
                  "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                  "& .MuiOutlinedInput-root": {
                    color: "#fff",
                    "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                    "&:hover fieldset": { borderColor: "#ff6b35" },
                    "&.Mui-focused fieldset": { borderColor: "#ff6b35" },
                  },
                  "& .MuiAutocomplete-popupIndicator": {
                    color: "rgba(255,255,255,0.7)",
                  },
                  "& .MuiAutocomplete-clearIndicator": {
                    color: "rgba(255,255,255,0.7)",
                  },
                }}
              >
                <DojaangSelector
                  value={formData.dojaangId}
                  onChange={(dojaangId) =>
                    setFormData((prev) => ({ ...prev, dojaangId }))
                  }
                  label="Dojaang"
                  required
                  size="medium"
                />
              </Box>
            </Box>

            {/* Promotion Date */}
            <DatePicker
              label="Promotion Date"
              value={formData.promotionDate}
              onChange={(date) =>
                date &&
                setFormData((prev) => ({ ...prev, promotionDate: date }))
              }
              sx={{
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "#ff6b35" },
                  "&.Mui-focused fieldset": { borderColor: "#ff6b35" },
                },
              }}
            />

            {/* Notes */}
            <TextField
              label="Notes (Optional)"
              multiline
              rows={4}
              value={formData.notes}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, notes: e.target.value }))
              }
              placeholder="Add any notes about this promotion..."
              sx={{
                "& .MuiInputLabel-root": { color: "rgba(255,255,255,0.7)" },
                "& .MuiOutlinedInput-root": {
                  color: "#fff",
                  "& fieldset": { borderColor: "rgba(255,255,255,0.3)" },
                  "&:hover fieldset": { borderColor: "#ff6b35" },
                  "&.Mui-focused fieldset": { borderColor: "#ff6b35" },
                },
              }}
            />

            {/* Promotion Preview */}
            {selectedRank && (
              <Card
                sx={{
                  backgroundColor: "rgba(255, 107, 53, 0.1)",
                  border: "1px solid #ff6b35",
                }}
              >
                <CardContent>
                  <Typography
                    variant="subtitle1"
                    sx={{ color: "#ff6b35", mb: 1 }}
                  >
                    Promotion Preview
                  </Typography>
                  <Typography sx={{ color: "#fff" }}>
                    {student.firstName} {student.lastName} will be promoted to{" "}
                    <strong>{selectedRank.name}</strong>
                  </Typography>
                  <Typography
                    variant="body2"
                    sx={{ color: "rgba(255,255,255,0.7)", mt: 1 }}
                  >
                    Date: {formData.promotionDate.toLocaleDateString()}
                  </Typography>
                </CardContent>
              </Card>
            )}

            <Divider sx={{ borderColor: "rgba(255,255,255,0.1)" }} />

            {/* Action Buttons */}
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button
                variant="outlined"
                onClick={handleCancel}
                disabled={submitting}
                sx={{
                  borderColor: "rgba(255,255,255,0.3)",
                  color: "rgba(255,255,255,0.8)",
                  "&:hover": {
                    borderColor: "rgba(255,255,255,0.5)",
                    backgroundColor: "rgba(255,255,255,0.05)",
                  },
                }}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={
                  submitting ||
                  !formData.rankId ||
                  !formData.coachId ||
                  !formData.dojaangId
                }
                sx={{
                  background: "linear-gradient(45deg, #ff6b35, #ff8a65)",
                  "&:hover": {
                    background: "linear-gradient(45deg, #ff5722, #ff6b35)",
                  },
                  "&:disabled": {
                    background: "rgba(255,255,255,0.1)",
                    color: "rgba(255,255,255,0.3)",
                  },
                }}
              >
                {submitting ? (
                  <>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Promoting...
                  </>
                ) : (
                  "Confirm Promotion"
                )}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </LocalizationProvider>
  );
}
