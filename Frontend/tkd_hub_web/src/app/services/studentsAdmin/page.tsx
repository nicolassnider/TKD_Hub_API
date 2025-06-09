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

  function getDojaangName(dojaangId: number | null | undefined) {
    if (!dojaangId) return "None";
    const found = dojaangs.find(d => d.id === dojaangId);
    return found ? found.name : `ID ${dojaangId}`;
  }

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
        } catch (err) {
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
    <AdminListPage
      title="Students Administration"
      loading={loading}
      error={error}
      filters={
        <DojaangSelector
          value={filterDojaangId}
          onChange={id => setFilterDojaangId(id)}
          allDojaangs={dojaangs}
          disabled={loading || dojaangsLoading}
        />
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
        />
      }
      modals={
        <>
          {showCreate && <EditStudent onClose={handleCreateClose} />}
          {editId !== null && <EditStudent studentId={editId} onClose={handleEditClose} />}
          {selectedStudent && (
            <div className="modal fade show d-block modal-bg-blur" tabIndex={-1}>
              <div className="modal-dialog modal-dialog-centered">
                <div className="modal-content">
                  <div className="modal-header border-0 pb-0">
                    <h3 className="modal-title fs-5">Student Details</h3>
                    <button
                      type="button"
                      className="btn-close"
                      aria-label="Close"
                      onClick={() => setSelectedStudent(null)}
                    ></button>
                  </div>
                  <div className="modal-body">
                    <div><strong>ID:</strong> {selectedStudent.id}</div>
                    <div><strong>Name:</strong> {selectedStudent.firstName} {selectedStudent.lastName}</div>
                    <div><strong>Email:</strong> {selectedStudent.email}</div>
                    {selectedStudent.phoneNumber && <div><strong>Phone:</strong> {selectedStudent.phoneNumber}</div>}
                    {selectedStudent.gender !== undefined && <div><strong>Gender:</strong> {selectedStudent.gender}</div>}
                    <div>
                      <strong>Dojaang:</strong> {getDojaangName(selectedStudent.dojaangId)}
                    </div>
                    <div><strong>Current Rank ID:</strong> {selectedStudent.currentRankId ?? "None"}</div>
                    {selectedStudent.joinDate && <div><strong>Join Date:</strong> {selectedStudent.joinDate}</div>}
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      }
    />
  );
}
