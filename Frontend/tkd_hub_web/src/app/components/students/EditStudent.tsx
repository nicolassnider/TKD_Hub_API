"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import equal from "fast-deep-equal";

import { useDojaangs } from "@/app/context/DojaangContext";
import { Student } from "@/app/types/Student";

import DojaangSelector from "../dojaangs/DojaangSelector";
import RanksSelector from "../common/selectors/RanksSelector";
import GenderSelector from "../common/selectors/GenderSelector";
import FormActionButtons from "../common/actionButtons/FormActionButtons";
import ModalCloseButton from "../common/actionButtons/ModalCloseButton";
import LabeledInput from "../common/inputs/LabeledInput";
import { useRankContext } from "@/app/context/RankContext";
import { useStudents } from "@/app/context/StudentContext";

type EditStudentProps = {
  studentId?: number;
  onClose: (refresh?: boolean) => void;
};

const EditStudent: React.FC<EditStudentProps> = ({ studentId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Student, "id"> | null>(null);
  const [originalForm, setOriginalForm] = useState<Omit<Student, "id"> | null>(null);
  const { ranks, loading: ranksLoading, fetchRanks } = useRankContext();

  const { dojaangs, loading: dojaangsLoading } = useDojaangs();
  const { getStudentById, createStudent, updateStudent } = useStudents();

  const [isBlackBelt, setIsBlackBelt] = useState(false);

  // ...existing code...
  useEffect(() => {
    fetchRanks();
  }, []);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (studentId) {
          const apiResponse = await getStudentById(studentId);
          // Type-safe extraction of data
          const data: Omit<Student, "id"> | null =
            apiResponse && typeof apiResponse === "object" && "id" in apiResponse
              ? (() => {
                // eslint-disable-next-line @typescript-eslint/no-unused-vars
                const { id: _id, ...rest } = apiResponse as Student;
                return rest;
              })()
              : null;
          if (data) {
            setForm(data);
            setOriginalForm(data);
          } else {
            setError("Student not found");
          }
        } else {
          const emptyForm: Omit<Student, "id"> = {
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            gender: 0,
            dateOfBirth: "",
            dojaangId: undefined,
            currentRankId: null,
          };
          setForm(emptyForm);
          setOriginalForm(emptyForm);
        }
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message || "Error loading student");
        else setError("Error loading student");
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [studentId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setForm(prev => ({
      ...prev!,
      [name]: name === "gender" ? Number(value) : value,
    }));
  };

  const handleDojaangChange = (id: number | null) => {
    setForm(prev => ({
      ...prev!,
      dojaangId: id ?? undefined,
    }));
  };

  const handleRankChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setForm(prev => ({
      ...prev!,
      currentRankId: e.target.value === "" ? null : Number(e.target.value),
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : undefined,
      };

      if (studentId) {
        await updateStudent(studentId, payload);
        toast.success("Student updated successfully!");
      } else {
        await createStudent(payload as Omit<Student, "id" | "joinDate" | "isActive">);
        toast.success("Student created successfully!");
      }

      onClose(true);
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message || "Failed to save student");
      else toast.error("Failed to save student");
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <div className="text-center">Loading student...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;
  if (!form) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] flex flex-col">
        <ModalCloseButton onClick={() => onClose(false)} disabled={saving} />

        <h3 className="text-lg font-bold mb-4 text-center">{studentId ? "Edit Student" : "Create Student"}</h3>
        <form className="flex-1 overflow-y-auto pr-2 space-y-4" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <LabeledInput
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              disabled={saving}
            />
            <LabeledInput
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              disabled={saving}
            />

            <LabeledInput
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={saving}
              placeholder="Enter email address"
            />
            <LabeledInput
              label="Phone Number"
              name="phoneNumber"
              value={form.phoneNumber || ""}
              onChange={handleChange}
              disabled={saving}
              placeholder="Enter phone number"
            />

            <div>
              <label className="block font-medium mb-1" htmlFor="gender">Gender</label>
              <GenderSelector
                value={form.gender}
                onChange={e => setForm(prev => ({ ...prev!, gender: Number(e.target.value) }))}
                disabled={loading}
                className="w-full h-[44px] px-3 py-2 text-base rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <LabeledInput
              label="Date of Birth"
              name="dateOfBirth"
              type="date"
              value={form.dateOfBirth ? form.dateOfBirth.substring(0, 10) : ""}
              onChange={handleChange}
              disabled={saving}
            />

            <div className="flex-1">
              <label className="block font-medium mb-1" htmlFor="currentRankId">Rank</label>
              <RanksSelector
                value={form.currentRankId ?? 0}
                onChange={handleRankChange}
                disabled={loading || ranksLoading}
                filter={isBlackBelt ? "black" : "color"}
                ranks={ranks}
                className="w-full h-[44px] px-3 py-2 text-base rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2 mt-2">
                <input
                  id="isBlackBelt"
                  type="checkbox"
                  checked={isBlackBelt}
                  onChange={e => setIsBlackBelt(e.target.checked)}
                  disabled={loading || ranksLoading}
                  className="accent-black w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <label htmlFor="isBlackBelt" className="font-medium select-none cursor-pointer mb-0">
                  Is Black Belt?
                </label>
              </div>
            </div>
            <div className="flex-1">
              <label className="block font-medium mb-1" htmlFor="dojaang-selector">Select Dojaang</label>
              <DojaangSelector
                value={form.dojaangId ?? null}
                onChange={handleDojaangChange}
                disabled={loading || dojaangsLoading}
                allDojaangs={dojaangs}
                label=""
                className="w-full h-[44px] px-3 py-2 text-base rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
            </div>


          </div>

          <FormActionButtons
            onCancel={() => onClose(false)}
            onSubmitLabel={studentId ? "Update" : "Create"}
            loading={loading}
            disabled={equal(form, originalForm)}
          />
        </form>
      </div >
    </div >
  );
};

export default EditStudent;
