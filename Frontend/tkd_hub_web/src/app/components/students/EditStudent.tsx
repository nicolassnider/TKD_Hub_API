"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";


import { useDojaangs } from "@/app/context/DojaangContext";
import { Student } from "@/app/types/Student";


import ModalCloseButton from "../common/actionButtons/ModalCloseButton";
import { useRanks } from "@/app/context/RankContext";
import { useStudents } from "@/app/context/StudentContext";
import EditStudentForm from "./EditStudentForm";


type EditStudentProps = {
  studentId?: number;
  onClose: (refresh?: boolean) => void;
};


const EditStudent: React.FC<EditStudentProps> = ({ studentId, onClose }) => {
  // 1. Context hooks
  const { ranks, loading: ranksLoading, fetchRanks } = useRanks();
  const { dojaangs, loading: dojaangsLoading } = useDojaangs();
  const { getStudentById, createStudent, updateStudent } = useStudents();


  // 2. State hooks
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Student, "id"> | null>(null);
  const [originalForm, setOriginalForm] = useState<Omit<Student, "id"> | null>(
    null
  );
  const [isBlackBelt, setIsBlackBelt] = useState(false);


  // 3. Effects
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


  // 4. Functions
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


  // 5. Render
  if (loading) return <div className="text-center">Loading student...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;
  if (!form) return null;


  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] flex flex-col">
        <ModalCloseButton onClick={() => onClose(false)} disabled={saving} />
        <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center">
          {studentId ? "Edit Student" : "Create Student"}
        </h3>
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
      </div>
    </div>
  );
};


export default EditStudent;