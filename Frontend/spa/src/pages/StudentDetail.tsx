import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchJson, ApiError } from "../lib/api";
import CircularProgress from "@mui/material/CircularProgress";
import Alert from "@mui/material/Alert";
import Button from "@mui/material/Button";
import { useRole } from "../context/RoleContext";
import PromotionFormDialog from "../components/PromotionFormDialog";
import { usePromotionForm } from "../hooks/usePromotionForm";

type Student = {
  id: number;
  fullName: string;
  email?: string;
};

export default function StudentDetail() {
  const { id } = useParams<{ id: string }>();
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { token } = useRole();

  const {
    promotionFormOpen,
    openPromotionForm,
    closePromotionForm,
    handlePromotionSubmit,
  } = usePromotionForm();

  useEffect(() => {
    if (!id) return;
    let mounted = true;
    (async () => {
      try {
        const headers: Record<string, string> = {};
        if (token) headers["Authorization"] = `Bearer ${token}`;
        const res = await fetchJson<Student>(`/api/Students/${id}`, {
          headers,
        });
        if (!mounted) return;
        setStudent(res as unknown as Student);
      } catch (e) {
        setError(e instanceof ApiError ? e.message : String(e));
      } finally {
        if (mounted) setLoading(false);
      }
    })();

    return () => {
      mounted = false;
    };
  }, [id, token]);

  if (loading)
    return (
      <div className="flex items-center gap-2">
        <CircularProgress size={20} /> Loading…
      </div>
    );
  if (error) return <Alert severity="error">Error: {error}</Alert>;
  if (!student) return <Alert severity="info">Student not found.</Alert>;

  return (
    <div>
      <h2 className="text-2xl font-bold mb-2">{student.fullName}</h2>
      <div className="text-sm text-gray-700 mb-4">
        Email: {student.email ?? "—"}
      </div>

      <div className="flex gap-2 mb-4">
        <Button
          variant="contained"
          color="primary"
          onClick={() => openPromotionForm()}
        >
          Add Promotion
        </Button>
      </div>

      <PromotionFormDialog
        open={promotionFormOpen}
        onClose={closePromotionForm}
        onSubmit={handlePromotionSubmit}
        preselectedStudentId={student.id}
      />

      {/* placeholder for class enrollment actions */}
    </div>
  );
}
