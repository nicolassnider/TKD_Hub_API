"use client";
import { useEffect, useState } from "react";
import DojaangSelector from "../dojaangs/DojaangSelector";
import RanksSelector from "../ranks/RanksSelector";

type Student = {
  id?: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  gender?: number;
  dateOfBirth?: string;
  dojaangId?: number;
  currentRankId?: number | null;
};

type EditStudentProps = {
  studentId?: number;
  onClose: (refresh?: boolean) => void;
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7046/api";

const EditStudent: React.FC<EditStudentProps> = ({ studentId, onClose }) => {
  const [student, setStudent] = useState<Student>({
    firstName: "",
    lastName: "",
    email: "",
    phoneNumber: "",
    gender: 0,
    dateOfBirth: "",
    dojaangId: undefined,
    currentRankId: null,
  });
  const [loading, setLoading] = useState(!!studentId);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [dojaangs, setDojaangs] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
    // ...existing student fetch...
    // Fetch dojaangs for selector
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/Dojaang`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then(res => res.json())
      .then(data => {
        let arr: { id: number; name: string }[] = [];
        if (Array.isArray(data)) arr = data;
        else if (Array.isArray(data?.data)) arr = data.data;
        else if (Array.isArray(data?.data?.data)) arr = data.data.data;
        setDojaangs(arr);
      })
      .catch(() => setDojaangs([]));
  }, [studentId]);

  useEffect(() => {
    if (!studentId) {
      setStudent({
        firstName: "",
        lastName: "",
        email: "",
        phoneNumber: "",
        gender: 0,
        dateOfBirth: "",
        dojaangId: undefined,
        currentRankId: null,
      });
      setLoading(false);
      return;
    }
    const token = localStorage.getItem("token");
    fetch(`${baseUrl}/students/${studentId}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then(res => res.json())
      .then(data => {
        let s = data;
        if (data?.data?.data) s = data.data.data[0];
        else if (data?.data) s = data.data;
        setStudent(s);
      })
      .catch(() => setError("Failed to load student"))
      .finally(() => setLoading(false));
  }, [studentId]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) {
    const { name, value } = e.target;
    setStudent(prev => ({
      ...prev,
      [name]: name === "gender"
        ? value === "" ? null : Number(value)
        : value,
    }));
  }

  function handleDojaangChange(id: number | null) {
    setStudent(prev => ({
      ...prev,
      dojaangId: id ?? undefined,
    }));
  }

  function handleRankChange(e: React.ChangeEvent<HTMLSelectElement>) {
    setStudent(prev => ({
      ...prev,
      currentRankId: e.target.value === "" ? null : Number(e.target.value),
    }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    setError(null);

    const token = localStorage.getItem("token");
    const payload = {
      firstName: student.firstName,
      lastName: student.lastName,
      email: student.email,
      phoneNumber: student.phoneNumber,
      gender: student.gender,
      dateOfBirth: student.dateOfBirth
        ? new Date(student.dateOfBirth).toISOString()
        : null,
      dojaangId: student.dojaangId,
      rankId: student.currentRankId ?? null,
    };

    try {
      let res;
      if (studentId) {
        res = await fetch(`${baseUrl}/students/${studentId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify({ id: studentId, ...payload }),
        });
      } else {
        res = await fetch(`${baseUrl}/students`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: token ? `Bearer ${token}` : "",
          },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error("Failed to save student");
      onClose(true);
    } catch (err: unknown) {
      if (err instanceof Error) setError(err.message || "An error occurred");
      else setError("An error occurred");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal fade show d-block modal-bg-blur" tabIndex={-1}>
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          <div className="modal-header border-0 pb-0">
            <h3 className="modal-title fs-5">{studentId ? "Edit Student" : "Create Student"}</h3>
            <button
              type="button"
              className="btn-close"
              aria-label="Close"
              onClick={() => onClose(false)}
            ></button>
          </div>
          <div className="modal-body">
            {loading && <div className="text-center">Loading...</div>}
            {error && <div className="text-danger text-center">{error}</div>}
            {!loading && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-3">
                <div>
                  <label htmlFor="firstName">First Name:</label>
                  <input
                    id="firstName"
                    name="firstName"
                    value={student.firstName}
                    onChange={handleChange}
                    className="form-control"
                    required
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label htmlFor="lastName">Last Name:</label>
                  <input
                    id="lastName"
                    name="lastName"
                    value={student.lastName}
                    onChange={handleChange}
                    className="form-control"
                    required
                    placeholder="Last Name"
                  />
                </div>
                <div>
                  <label htmlFor="email">Email:</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={student.email}
                    onChange={handleChange}
                    className="form-control"
                    required
                    placeholder="Email"
                  />
                </div>
                <div>
                  <label htmlFor="phoneNumber">Phone Number:</label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    value={student.phoneNumber || ""}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="Phone Number"
                  />
                </div>
                <div>
                  <label htmlFor="gender">Gender:</label>
                  <select
                    id="gender"
                    name="gender"
                    value={student.gender ?? ""}
                    onChange={handleChange}
                    className="form-control"
                  >
                    <option value="">Select Gender</option>
                    <option value={0}>Female</option>
                    <option value={1}>Male</option>
                    <option value={2}>Other</option>
                  </select>
                </div>
                <div>
                  <label htmlFor="dateOfBirth">Date of Birth:</label>
                  <input
                    id="dateOfBirth"
                    name="dateOfBirth"
                    type="date"
                    value={student.dateOfBirth ? student.dateOfBirth.substring(0, 10) : ""}
                    onChange={handleChange}
                    className="form-control"
                    placeholder="YYYY-MM-DD"
                  />
                </div>
                <div>
                  <label htmlFor="dojaang">Dojaang:</label>
                  <DojaangSelector
                    value={student.dojaangId ?? null}
                    onChange={handleDojaangChange}
                    disabled={saving}
                    allDojaangs={dojaangs}
                  />
                </div>
                <div>
                  <label htmlFor="rank">Rank:</label>
                  <RanksSelector
                    value={student.currentRankId ?? ""}
                    onChange={handleRankChange}
                    disabled={saving}
                  />
                </div>
                <button
                  type="submit"
                  className="btn btn-primary"
                  disabled={saving}
                >
                  {saving ? "Saving..." : studentId ? "Save" : "Create"}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditStudent;
