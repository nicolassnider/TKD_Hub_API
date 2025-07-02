import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import { useDojaangs } from "@/app/context/DojaangContext";
import { Student } from "@/app/types/Student";
import { useRanks } from "@/app/context/RankContext";
import { useStudents } from "@/app/context/StudentContext";
import EditStudentForm from "./EditStudentForm";
import { EditModal } from "../common/modals/EditModal";

type EditStudentProps = {
  studentId?: number;
  onClose: (refresh?: boolean) => void;
};

const EditStudent: React.FC<EditStudentProps> = ({ studentId, onClose }) => {
  const { ranks, loading: ranksLoading, fetchRanks } = useRanks();
  const { dojaangs, loading: dojaangsLoading } = useDojaangs();
  const { getStudentById, createStudent, updateStudent } = useStudents();

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Student, "id"> | null>(null);
  const [originalForm, setOriginalForm] = useState<Omit<Student, "id"> | null>(
    null
  );
  const [isBlackBelt, setIsBlackBelt] = useState(false);

  useEffect(() => {
    if (!ranks || ranks.length === 0) {
      fetchRanks();
    }
  }, [fetchRanks, ranks]);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (studentId) {
          const apiResponse = await getStudentById(studentId);
          const data: Omit<Student, "id"> | null =
            apiResponse &&
            typeof apiResponse === "object" &&
            "id" in apiResponse
              ? (() => {
                  const { ...rest } = apiResponse as Student;
                  return rest;
                })()
              : null;
          if (data) {
            setForm({
              ...data,
              phoneNumber: data.phoneNumber ?? "",
            });
            setOriginalForm({
              ...data,
              phoneNumber: data.phoneNumber ?? "",
            });
            const studentRank = ranks.find((r) => r.id === data.currentRankId);
            setIsBlackBelt(studentRank ? studentRank.danLevel !== null : false);
          } else {
            setError("Student not found");
          }
        } else {
          const emptyForm: Omit<Student, "id"> = {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            gender: undefined,
            dateOfBirth: "",
            dojaangId: undefined,
            currentRankId: null,
          };
          setForm(emptyForm);
          setOriginalForm(emptyForm);
          setIsBlackBelt(false);
        }
      } catch (err: unknown) {
        if (err instanceof Error)
          setError(err.message || "Error loading student");
        else setError("Error loading student");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId, ranks]);

  const handleSubmit = async (form: Omit<Student, "id">) => {
    setSaving(true);
    try {
      const payload = {
        ...form,
        RankId: form.currentRankId ?? undefined,
        dateOfBirth: form.dateOfBirth
          ? new Date(form.dateOfBirth).toISOString()
          : undefined,
      };

      if (studentId) {
        await updateStudent(studentId, payload);
        toast.success("Student updated successfully!");
      } else {
        await createStudent(
          payload as Omit<Student, "id" | "joinDate" | "isActive">
        );
        toast.success("Student created successfully!");
      }

      onClose(true);
    } catch (err: unknown) {
      if (err instanceof Error)
        toast.error(err.message || "Failed to save student");
      else toast.error("Failed to save student");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center">Loading student...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;
  if (!form) return null;

  return (
    <EditModal
      open={true}
      title={studentId ? "Edit Student" : "Create Student"}
      saving={saving}
      onClose={onClose}
    >
      <EditStudentForm
        form={form}
        setForm={setForm}
        originalForm={originalForm}
        isBlackBelt={isBlackBelt}
        setIsBlackBelt={setIsBlackBelt}
        ranks={ranks}
        ranksLoading={ranksLoading}
        dojaangs={dojaangs}
        dojaangsLoading={dojaangsLoading}
        saving={saving}
        onSubmit={handleSubmit}
        onCancel={() => onClose(false)}
      />
    </EditModal>
  );
};

export default EditStudent;
