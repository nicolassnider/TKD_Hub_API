"use client";
import { useEffect, useState } from "react";
import DojaangSelector from "../dojaangs/DojaangSelector";
import RanksSelector from "../common/selectors/RanksSelector";
import { useApiConfig } from "@/app/context/ApiConfigContext";
import { useAuth } from "@/app/context/AuthContext";
import GenderSelector from "../common/selectors/GenderSelector";
import { apiRequest } from "@/app/utils/api";
import toast from "react-hot-toast";
import { useDojaangs } from "@/app/context/DojaangContext";
import { Student } from "@/app/types/Student";
import equal from "fast-deep-equal";
import FormActionButtons from "../common/FormActionButtons";
import ModalCloseButton from "../common/ModalCloseButton";
import LabeledInput from "../common/inputs/LabeledInput";


type EditStudentProps = {
  studentId?: number;
  onClose: (refresh?: boolean) => void;
};

const EditStudent: React.FC<EditStudentProps> = ({ studentId, onClose }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<Omit<Student, "id"> | null>(null);
  const { baseUrl } = useApiConfig();
  const { getToken } = useAuth();
  const { dojaangs, loading: dojaangsLoading } = useDojaangs();
  const [originalForm, setOriginalForm] = useState<Omit<Student, "id"> | null>(null);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (studentId) {
          const response = await apiRequest<{ data: Student }>(
            `${baseUrl}/students/${studentId}`,
            {},
            getToken
          );
          const data = response.data;
          setForm(data);
          setOriginalForm(data); // <-- Store original
        } else {
          const emptyForm = {
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
  }, [studentId, getToken, baseUrl]);
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
    setSaving(true); // <-- Add this
    try {
      const payload = {
        ...form,
        dateOfBirth: form.dateOfBirth ? new Date(form.dateOfBirth).toISOString() : null,
      };

      const method = studentId ? "PUT" : "POST";
      const url = studentId ? `${baseUrl}/students/${studentId}` : `${baseUrl}/students`;

      await apiRequest(
        url,
        {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
        getToken
      );

      onClose(true);
      toast.success("Student saved successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message || "Failed to save student");
      else toast.error("Failed to save student");
    } finally {
      setSaving(false); // <-- Add this
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

            <div>
              <label className="block font-medium mb-1" htmlFor="currentRankId">Rank</label>
              <RanksSelector
                value={form.currentRankId ?? 0}
                onChange={handleRankChange}
                disabled={loading}
                filter="color"
              />
            </div>

            <DojaangSelector
              value={form.dojaangId ?? null}
              onChange={handleDojaangChange}
              disabled={loading || dojaangsLoading}
              allDojaangs={dojaangs}
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
