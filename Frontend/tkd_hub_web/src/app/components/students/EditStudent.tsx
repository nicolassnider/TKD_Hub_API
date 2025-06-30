"use client";
import { useEffect, useState } from "react";
import toast from "react-hot-toast";
import equal from "fast-deep-equal";

import { useDojaangs } from "@/app/context/DojaangContext";
import { Student } from "@/app/types/Student";

import FormActionButtons from "../common/actionButtons/FormActionButtons";
import ModalCloseButton from "../common/actionButtons/ModalCloseButton";
import LabeledInput from "../common/inputs/LabeledInput";
import { useRanks } from "@/app/context/RankContext";
import { useStudents } from "@/app/context/StudentContext";
import { GenericSelector } from "../common/selectors/GenericSelector";
import { Gender } from "@/app/enums/Gender";
import GenderSelector from "../common/selectors/GenderSelector";

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
  }, [fetchRanks, ranks]); // Only run once on mount

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
                  const { ...rest } = apiResponse as Student; // Updated line
                  return rest;
                })()
              : null;
          if (data) {
            setForm({
              ...data,
              phoneNumber: data.phoneNumber ?? "", // Ensure string for mask
            });
            setOriginalForm({
              ...data,
              phoneNumber: data.phoneNumber ?? "",
            });
            // Set isBlackBelt based on the loaded student's rank
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
            phoneNumber: "", // <-- always a string
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
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setForm((prev) => ({
      ...prev!,
      [name]: name === "gender" ? Number(value) : value, // Only convert gender
    }));
  };

  const handleDojaangChange = (id: number | null) => {
    setForm((prev) => ({
      ...prev!,
      dojaangId: id ?? undefined,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    try {
      const payload = {
        ...form,
        RankId: form.currentRankId ?? undefined, // <-- Use RankId
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
        <form
          className="flex-1 overflow-y-auto pr-2 space-y-4"
          onSubmit={handleSubmit}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <LabeledInput
              label="First Name"
              name="firstName"
              value={form.firstName}
              onChange={handleChange}
              disabled={saving}
              required
            />
            {/* Last Name */}
            <LabeledInput
              label="Last Name"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              disabled={saving}
              required
            />
            {/* Email */}
            <LabeledInput
              label="Email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              disabled={saving}
              placeholder="Enter email address"
              required
            />
            {/* Phone Number */}
            <LabeledInput
              label="Phone Number"
              name="phoneNumber"
              value={
                typeof form.phoneNumber === "string" ? form.phoneNumber : ""
              }
              onChange={handleChange}
              disabled={saving}
              placeholder="e.g. 11-2345-6789"
              required
            />
            {/* Gender */}
            <GenderSelector
              value={form.gender ?? null}
              onChange={(id) =>
                setForm((prev) => ({
                  ...prev!,
                  gender: id ?? Gender.MALE,
                }))
              }
              disabled={loading}
              required
              className="w-full h-[44px] px-3 py-2 text-base rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
            {/* Date of Birth */}
            <LabeledInput
              label="Date of Birth"
              name="dateOfBirth"
              datepicker
              selectedDate={
                form.dateOfBirth ? new Date(form.dateOfBirth) : null
              }
              onDateChange={(date) =>
                setForm((prev) => ({
                  ...prev!,
                  dateOfBirth: date ? date.toISOString().slice(0, 10) : "",
                }))
              }
              required
              disabled={saving}
              maxDate={new Date()} // <-- Prevents future dates
              className="w-full h-[44px] px-3 py-2 text-base rounded border border-gray-300 focus:ring-2 focus:ring-blue-500" // <-- Add this line
            />
            {/* Rank Selector*/}
            <div className="flex-1">
              <GenericSelector
                items={ranks}
                value={form.currentRankId ?? null}
                onChange={(id) =>
                  setForm((prev) => ({
                    ...prev!,
                    currentRankId: id ?? null,
                  }))
                }
                getLabel={(r) => r.name}
                getId={(r) => r.id}
                filter={(r) =>
                  isBlackBelt ? r.danLevel !== null : r.danLevel === null
                }
                disabled={loading || ranksLoading}
                required
                label="Rank"
                placeholder="Select a rank"
                className="w-full h-[44px] px-3 py-2 text-base rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
              />
              <div className="flex items-center gap-2 mt-2">
                <input
                  id="isBlackBelt"
                  type="checkbox"
                  checked={isBlackBelt}
                  onChange={(e) => setIsBlackBelt(e.target.checked)}
                  disabled={loading || ranksLoading}
                  className="accent-black w-5 h-5 rounded border-gray-300 focus:ring-2 focus:ring-blue-500"
                />
                <label
                  htmlFor="isBlackBelt"
                  className="font-medium select-none cursor-pointer mb-0"
                >
                  Is Black Belt?
                </label>
              </div>
            </div>
            {/* Dojaang Selector*/}

            <GenericSelector
              items={dojaangs}
              value={form.dojaangId ?? null}
              onChange={handleDojaangChange}
              getLabel={(d) => d.name}
              getId={(d) => d.id}
              disabled={loading || dojaangsLoading}
              required
              label="Dojaang"
              id="dojaang-selector"
              placeholder="Select a dojaang"
              className="w-full h-[44px] px-3 py-2 text-base rounded border border-gray-300 focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <FormActionButtons
            onCancel={() => onClose(false)}
            onSubmitLabel={studentId ? "Update" : "Create"}
            loading={loading}
            disabled={equal(form, originalForm)}
          />
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
