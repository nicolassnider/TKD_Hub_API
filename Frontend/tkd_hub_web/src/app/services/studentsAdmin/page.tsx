"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import StudentTableRows from "../../components/students/StudentTableRows";
import EditStudent from "../../components/students/EditStudent";
import DojaangSelector from "../../components/dojaangs/DojaangSelector";
import { AdminListPage } from "@/app/components/AdminListPage";
import { useApiConfig } from "@/app/context/ApiConfigContext";
import { apiRequest } from "@/app/utils/api";
import { useDojaangs } from "@/app/context/DojaangContext";
import { Student } from "@/app/types/Student";

export default function StudentsAdmin() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const { getToken } = useAuth();
  const [filterDojaangId, setFilterDojaangId] = useState<number | null>(null);
  const { baseUrl } = useApiConfig();
  const { dojaangs, loading: dojaangsLoading } = useDojaangs();
  const [showAll, setShowAll] = useState(false);

  function extractStudents(data: unknown): Student[] {
    if (Array.isArray(data)) {
      return data as Student[];
    } else if (
      typeof data === "object" &&
      data !== null &&
      "data" in data &&
      Array.isArray((data as { data?: unknown }).data)
    ) {
      return (data as { data: Student[] }).data;
    } else if (
      typeof data === "object" &&
      data !== null &&
      "data" in data &&
      typeof (data as { data?: unknown }).data === "object" &&
      (data as { data?: unknown }).data !== null
    ) {
      const innerData = (data as { data?: { data?: unknown } }).data;
      if (
        innerData &&
        "data" in innerData &&
        Array.isArray((innerData as { data?: unknown }).data)
      ) {
        return (innerData as { data: Student[] }).data;
      }
    }
    return [];
  }

  // Fetch students (all or by dojaang)
  useEffect(() => {
    const token = getToken();
    setLoading(true);
    let url = `${baseUrl}/students`;
    if (filterDojaangId) {
      url = `${baseUrl}/students/dojaang/${filterDojaangId}`;
    }
    apiRequest(
      url,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    )
      .then(data => {
        try {
          const students = extractStudents(data);
          if (!Array.isArray(students)) {
            setError("Failed to process students");
            setStudents([]);
          } else {
            setStudents(students);
            setError(null);
          }
        } catch {
          setError("Failed to process students");
          setStudents([]);
        }
      })
      .catch((err) => {
        setError("Failed to load students");
        setStudents([]);
        console.error("[StudentsAdmin] Error fetching students:", err);
      })
      .finally(() => setLoading(false));
  }, [getToken, filterDojaangId, baseUrl]);

  function handleDetails(id: number) {
    setSelectedStudent(null);
    const token = getToken();
    apiRequest(
      `${baseUrl}/students/${id}`,
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      }
    )
      .then(res => (res as Response).json())
      .then(data => {
        let student = data;
        if (data?.data?.data) student = data.data.data[0];
        else if (data?.data) student = data.data;
        setSelectedStudent(student);
      })
      .catch(() => setSelectedStudent(null));
  }

  function handleEdit(id: number) {
    setEditId(id);
  }

  function handleReactivate(id: number) {
    setLoading(true);
    apiRequest(`${baseUrl}/students/reactivate/${id}`, { method: "POST" }, getToken)
      .then(() => {
        setStudents(prev =>
          prev.map(s =>
            s.id === id ? { ...s, isActive: true } : s
          )
        );
        setError(null);
      })
      .catch(() => setError("Failed to reactivate student"))
      .finally(() => setLoading(false));
  }

  function handleEditClose(refresh?: boolean) {
    setEditId(null);
    if (refresh) {
      setLoading(true);
      const token = getToken();
      let url = `${baseUrl}/students`;
      if (filterDojaangId) {
        url = `${baseUrl}/students/dojaang/${filterDojaangId}`;
      }
      apiRequest(
        url,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      )
        .then(res => (res as Response).json())
        .then(data => {
          const students = extractStudents(data);
          setStudents(students);
          setError(null);
        })
        .catch(() => setError("Failed to load students"))
        .finally(() => setLoading(false));
    }
  }

  function handleCreate() {
    setShowCreate(true);
  }

  function handleDelete(id: number) {
    setLoading(true);

    apiRequest(`${baseUrl}/students/${id}`, { method: "DELETE" }, getToken)
      .then(() => {
        setStudents(prev => prev.filter(s => s.id !== id));
        setError(null);
      })
      .catch(() => setError("Failed to delete student"))
      .finally(() => setLoading(false));
  }

  function handleCreateClose(refresh?: boolean) {
    setShowCreate(false);
    if (refresh) {
      setLoading(true);
      const token = getToken();
      let url = `${baseUrl}/students`;
      if (filterDojaangId) {
        url = `${baseUrl}/students/dojaang/${filterDojaangId}`;
      }
      apiRequest(
        url,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      )
        .then(res => (res as Response).json())
        .then(data => {
          const students = extractStudents(data);
          setStudents(students);
          setError(null);
        })
        .catch(() => setError("Failed to load students"))
        .finally(() => setLoading(false));
    }
  }

  return (
    <>
      <div className="flex items-center gap-4 mb-0 pl-4">
        <label
          htmlFor="showAllSwitch"
          className="font-medium text-gray-700 flex items-center gap-4 cursor-pointer"
        >
          <span className="mr-4">
            Show inactive students
          </span>
          {/* ON/OFF Switch */}
          <span className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in mr-2">
            <input
              id="showAllSwitch"
              type="checkbox"
              checked={showAll}
              onChange={() => setShowAll((v) => !v)}
              className="sr-only peer"
            />
            <span className="block w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition"></span>
            <span
              className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-6 tkd-switch-dot"
            ></span>
          </span>
          <span className="ml-2 text-sm text-gray-500">
            {showAll ? "All" : "Active"}
          </span>
        </label>
      </div>
      <AdminListPage
        title="Students Administration"
        loading={loading}
        error={error}
        filters={
          <div className="flex items-center gap-4">
            <DojaangSelector
              value={filterDojaangId}
              onChange={id => setFilterDojaangId(id)}
              allDojaangs={dojaangs}
              disabled={loading || dojaangsLoading}
            />
          </div>
        }
        onCreate={handleCreate}
        createLabel="Create"
        tableHead={
          <tr>
            <th>ID</th>
            <th>Name</th>
            <th>Email</th>
            <th>Options</th>
          </tr>
        }
        tableBody={
          <StudentTableRows
            students={students.map(s => ({
              ...s,
              dojaangId: s.dojaangId === null ? undefined : s.dojaangId,
            }))}
            onDetails={handleDetails}
            onEdit={handleEdit}
            onRequestDelete={handleDelete}
            onReactivate={handleReactivate} // <-- Add this line
            isActiveFilter={showAll ? null : true}
          />
        }
        modals={
          <>
            {showCreate && <EditStudent onClose={handleCreateClose} />}
            {editId !== null && <EditStudent studentId={editId} onClose={handleEditClose} />}
            {selectedStudent && (
              <div className="modal fade show d-block modal-bg-blur" tabIndex={-1}>
                {/* ...existing modal code... */}
              </div>
            )}
          </>
        }
      />
    </>

  );
}
