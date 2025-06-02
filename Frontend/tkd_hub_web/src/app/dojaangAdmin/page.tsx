"use client";
import { useEffect, useState } from "react";
import EditDojaang from "./dojaangDetails/page";
import { useRole } from "../context/RoleContext";


type Dojaang = {
  id: number;
  name: string;
  location: string;
  // Add other fields as needed
};

const baseUrl = "https://localhost:7046/api";

export default function DojaangAdmin() {
  const [dojaangs, setDojaangs] = useState<Dojaang[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);

  const { role } = useRole();

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }

    fetch(`${baseUrl}/Dojaang`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch dojaangs");
        const data = await res.json();
        if (Array.isArray(data)) {
          setDojaangs(data);
        } else if (Array.isArray(data.data)) {
          setDojaangs(data.data);
        } else {
          setDojaangs([]);
          setError("Unexpected response format");
        }
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  async function handleDelete() {
    if (deleteId == null) return;
    setDeleting(true);
    setError(null);
    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`${baseUrl}/Dojaang/${deleteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error("Failed to delete dojaang");
      setDojaangs((prev) => prev.filter((d) => d.id !== deleteId));
      setDeleteId(null);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "Delete failed");
      } else {
        setError("Delete failed");
      }
    } finally {
      setDeleting(false);
    }
  }

  return (
    <div className="w-100 max-w-2xl mx-auto my-4 bg-white dark:bg-neutral-900 rounded shadow p-4 p-sm-5">
      <h2 className="h4 h3-sm font-bold mb-4 text-center">Dojaang Administration</h2>

      <div className="mb-3 text-sm text-secondary text-center">
        Current role: <span className="fw-semibold">{role ?? "None"}</span>
      </div>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-danger text-center">{error}</div>}
      {!loading && !error && (
        <table className="table table-bordered align-middle">
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Coach</th>
              <th>Options</th>
            </tr>
          </thead>
          <tbody>
            {dojaangs.map((d) => (
              <tr key={d.id}>
                <td>{d.id}</td>
                <td>{d.name}</td>
                <td>{d.coachName ?? <span className="text-muted">-</span>}</td>
                <td>
                  <div className="d-flex flex-row gap-2">
                    <button
                      className="btn btn-primary d-flex align-items-center justify-content-center"
                      onClick={() => setEditId(d.id)}
                      title="Details"
                    >
                      <i className="bi bi-info-circle"></i>
                    </button>
                    {role === "Admin" && (
                      <button
                        className="btn btn-danger d-flex align-items-center justify-content-center"
                        onClick={() => setDeleteId(d.id)}
                        title="Delete"
                      >
                        <i className="bi bi-trash"></i>
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
      {editId !== null && (
        <EditDojaang dojaangId={editId} onClose={() => setEditId(null)} />
      )}

      {/* Confirmation Modal */}
      {deleteId !== null && (
        <div className="modal fade show d-block" tabIndex={-1} style={{ background: "rgba(0,0,0,0.4)" }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0 pb-0">
                <h3 className="modal-title fs-5">Confirm Delete</h3>
                <button
                  type="button"
                  className="btn-close"
                  aria-label="Close"
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                ></button>
              </div>
              <div className="modal-body">
                <p>Are you sure you want to delete this dojaang?</p>
                <div className="d-flex justify-content-end gap-2">
                  <button
                    className="btn btn-secondary"
                    onClick={() => setDeleteId(null)}
                    disabled={deleting}
                  >
                    Cancel
                  </button>
                  <button
                    className="btn btn-danger"
                    onClick={handleDelete}
                    disabled={deleting}
                  >
                    {deleting ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
