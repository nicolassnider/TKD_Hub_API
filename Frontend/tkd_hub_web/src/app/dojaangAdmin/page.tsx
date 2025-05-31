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
    <div className="w-full max-w-2xl mx-auto my-8 bg-white dark:bg-neutral-900 rounded shadow p-6 sm:p-8">
      <h2 className="text-xl sm:text-2xl font-bold mb-6 text-center">Dojaang Administration</h2>

      <div className="mb-4 text-sm text-gray-700 dark:text-gray-300 text-center">
        Current role: <span className="font-semibold">{role ?? "None"}</span>
      </div>

      {loading && <div className="text-center">Loading...</div>}
      {error && <div className="text-red-600 text-center">{error}</div>}
      {!loading && !error && (
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border-b py-2 text-left">ID</th>
              <th className="border-b py-2 text-left">Name</th>
              <th className="border-b py-2 text-left">Location</th>
              <th className="border-b py-2 text-left">Options</th>
            </tr>
          </thead>
          <tbody>
            {dojaangs.map((d) => (
              <tr key={d.id}>
                <td className="py-2">{d.id}</td>
                <td className="py-2">{d.name}</td>
                <td className="py-2">{d.location}</td>
                <td className="py-2">
                  <button
                    className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700 transition-colors mr-2 flex items-center"
                    onClick={() => setEditId(d.id)}
                    title="Details"
                  >
                    <i className="bi bi-info-circle mr-1"></i>
                  </button>
                  {role === "Admin" && (
                    <button
                      className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 transition-colors flex items-center"
                      onClick={() => setDeleteId(d.id)}
                      title="Delete"
                    >
                      <i className="bi bi-trash mr-1"></i>
                    </button>
                  )}
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-neutral-900 rounded shadow p-6 w-full max-w-sm relative">
            <h3 className="text-lg font-bold mb-4">Confirm Delete</h3>
            <p className="mb-6">Are you sure you want to delete this dojaang?</p>
            <div className="flex justify-end gap-2">
              <button
                className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700 dark:hover:bg-gray-600"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
