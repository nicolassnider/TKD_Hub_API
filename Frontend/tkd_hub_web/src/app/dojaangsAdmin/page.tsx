"use client";
import { useEffect, useState } from "react";
import EditDojaang from "../components/dojaangs/EditDojaang";
import { useRole } from "../context/RoleContext";
import DojaangTableRows from "../components/dojaangs/DojaangTableRows";
import { useAuth } from "../context/AuthContext";

type Dojaang = {
  id: number;
  name: string;
  location: string;
  // Add other fields as needed
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7046/api";

export default function DojaangAdmin() {
  const [dojaangs, setDojaangs] = useState<Dojaang[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [showCreate, setShowCreate] = useState(false);

  const { role } = useRole();
  const { getToken } = useAuth();

  function fetchDojaangs() {
    const token = getToken();

    if (!token) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }

    setLoading(true);
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
  }

  useEffect(() => {
    fetchDojaangs();
    // eslint-disable-next-line
  }, [getToken]);

  async function handleDelete() {
    if (deleteId == null) return;
    setDeleting(true);
    setError(null);
    const token = getToken();
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

  function handleCreateClose(refresh?: boolean) {
    setShowCreate(false);
    if (refresh) fetchDojaangs();
  }

  function handleEditClose(refresh?: boolean) {
    setEditId(null);
    if (refresh) fetchDojaangs();
  }

  return (
    <div className="w-100 max-w-2xl mx-auto my-4 bg-white dark:bg-neutral-900 rounded shadow p-4 p-sm-5">
      <h2 className="h4 h3-sm font-bold mb-4 text-center">Dojaang Administration</h2>

      <div className="mb-3 text-sm text-secondary text-center">
        Current role: <span className="fw-semibold">{role ?? "None"}</span>
      </div>

      {/* Only Admin can create */}
      {role === "Admin" && (
        <div className="mb-3 text-end">
          <button className="btn btn-success" onClick={() => setShowCreate(true)}>
            + Create Dojaang
          </button>
        </div>
      )}

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
            <DojaangTableRows
              dojaangs={dojaangs}
              role={role}
              setEditId={setEditId}
              setDeleteId={setDeleteId}
            />
          </tbody>
        </table>
      )}

      {/* Create Modal */}
      {showCreate && (
        <EditDojaang onClose={() => handleCreateClose(true)} />
      )}

      {/* Edit Modal */}
      {editId !== null && (
        <EditDojaang dojaangId={editId} onClose={() => handleEditClose(true)} />
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
