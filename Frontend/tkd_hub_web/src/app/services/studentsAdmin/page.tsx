"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import StudentTableRows from "../../components/students/StudentTableRows";
import EditStudent from "../../components/students/EditStudent";
import DojaangSelector from "../../components/dojaangs/DojaangSelector";
import { AdminListPage } from "@/app/components/AdminListPage";

type Student = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  gender?: number;
  dojaangId?: number | null;
  currentRankId?: number | null;
  joinDate?: string;
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7046/api";

export default function StudentsAdmin() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [showCreate, setShowCreate] = useState(false);
  const { getToken } = useAuth();
  const [filterDojaangId, setFilterDojaangId] = useState<number | null>(null);
  const [dojaangs, setDojaangs] = useState<{ id: number; name: string }[]>([]);

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

  // Fetch dojaangs for filter
  useEffect(() => {
    const token = getToken();
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
  }, [getToken]);

  // Fetch students (all or by dojaang)
  useEffect(() => {
    const token = getToken();
    setLoading(true);
    let url = `${baseUrl}/students`;
    if (filterDojaangId) {
      url = `${baseUrl}/students/dojaang/${filterDojaangId}`;
    }
    fetch(url, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then(res => res.json())
      .then(data => setStudents(extractStudents(data)))
      .catch(() => setError("Failed to load students"))
      .finally(() => setLoading(false));
  }, [getToken, filterDojaangId]);

  function handleDetails(id: number) {
    setSelectedStudent(null);
    const token = getToken();
    fetch(`${baseUrl}/students/${id}`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then(res => res.json())
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
      fetch(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
        .then(res => res.json())
        .then(data => setStudents(extractStudents(data)))
        .catch(() => setError("Failed to load students"))
        .finally(() => setLoading(false));
    }
  }

  function handleCreate() {
    setShowCreate(true);
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
      fetch(url, {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
      })
        .then(res => res.json())
        .then(data => setStudents(extractStudents(data)))
        .catch(() => setError("Failed to load students"))
        .finally(() => setLoading(false));
    }
  }

  // Use AdminListPage for rendering
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
          disabled={loading}
        />
      }
      onCreate={handleCreate}
      createLabel="+ Create Student"
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
          students={students}
          onDetails={handleDetails}
          loading={loading}
          renderOptions={(student) => (
            <button
              className="btn btn-sm btn-primary ms-2"
              onClick={() => handleEdit(student.id)}
            >
              Edit
            </button>
          )}
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
                    <div><strong>Dojaang ID:</strong> {selectedStudent.dojaangId ?? "None"}</div>
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

