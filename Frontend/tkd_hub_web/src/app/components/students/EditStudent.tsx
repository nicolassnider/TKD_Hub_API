"use client";
import { useEffect, useState } from "react";
import DojaangSelector from "../dojaangs/DojaangSelector";
import RanksSelector from "../ranks/RanksSelector";
import { useApiConfig } from "@/app/context/ApiConfigContext";
import { useAuth } from "@/app/context/AuthContext";
import GenderSelector from "../common/GenderSelector";
import { apiRequest } from "@/app/utils/api";
import toast from "react-hot-toast";
import { useDojaangs } from "@/app/context/DojaangContext";
import { Student } from "@/app/types/Student";

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

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        if (studentId) {
          const studentData = await apiRequest<Student>(`${baseUrl}/students/${studentId}`, {}, getToken);
          setForm(studentData);
        } else {
          setForm({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            gender: 0,
            dateOfBirth: "",
            dojaangId: undefined,
            currentRankId: null,
          });
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
        getToken // <-- pass the token here!
      );

      onClose(true);
      toast.success("Student saved successfully!");
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message || "Failed to save student");
      else toast.error("Failed to save student");
    }
  };

  if (loading) return <div className="text-center">Loading student...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;
  if (!form) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] flex flex-col">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={() => onClose(false)}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4 text-center">{studentId ? "Edit Student" : "Create Student"}</h3>
        <form className="flex-1 overflow-y-auto pr-2 space-y-3" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1" htmlFor="firstName">First Name</label>
              <input
                id="firstName"
                name="firstName"
                type="text"
                className="form-input w-full rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.firstName}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="lastName">Last Name</label>
              <input
                id="lastName"
                name="lastName"
                type="text"
                className="form-input w-full rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.lastName}
                onChange={handleChange}
                required
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1" htmlFor="email">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                className="form-input w-full rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.email}
                onChange={handleChange}
                required
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="phoneNumber">Phone Number</label>
              <input
                id="phoneNumber"
                name="phoneNumber"
                type="text"
                className="form-input w-full rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.phoneNumber || ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1" htmlFor="gender">Gender</label>
              <GenderSelector
                value={form.gender}
                onChange={e => setForm(prev => ({ ...prev!, gender: Number(e.target.value) }))}
                disabled={loading}
              />
            </div>
            <div>
              <label className="block font-medium mb-1" htmlFor="dateOfBirth">Date of Birth</label>
              <input
                id="dateOfBirth"
                name="dateOfBirth"
                type="date"
                className="form-input w-full rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.dateOfBirth ? form.dateOfBirth.substring(0, 10) : ""}
                onChange={handleChange}
              />
            </div>
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="dojaang">Dojaang</label>
            <DojaangSelector
              value={form.dojaangId ?? null}
              onChange={handleDojaangChange}
              disabled={loading || dojaangsLoading}
              allDojaangs={dojaangs}
            />
          </div>
          <div>
            <RanksSelector
              value={form.currentRankId ?? ""}
              onChange={handleRankChange}
              disabled={loading}
              filter="color"
            />
          </div>
          <div className="flex justify-end gap-2 mt-4">
            <button
              type="button"
              className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
              onClick={() => onClose(false)}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              {studentId ? "Update" : "Create"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStudent;
