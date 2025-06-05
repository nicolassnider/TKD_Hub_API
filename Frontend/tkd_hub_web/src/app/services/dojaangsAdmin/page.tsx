"use client";
import { useEffect, useState } from "react";
import EditDojaang from "../../components/dojaangs/EditDojaang";
import { useRole } from "../../context/RoleContext";
import DojaangTableRows from "../../components/dojaangs/DojaangTableRows";
import { useAuth } from "../../context/AuthContext";
import { Toaster, toast } from "react-hot-toast";
import { apiRequest } from "../../utils/api";
import { AdminListPage } from "@/app/components/AdminListPage";

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

  async function fetchDojaangs() {
    setLoading(true);
    setError(null);
    try {
      const data = await apiRequest<any>(`${baseUrl}/Dojaang`, {}, getToken);
      if (Array.isArray(data)) {
        setDojaangs(data);
      } else if (Array.isArray(data.data)) {
        setDojaangs(data.data);
      } else {
        setDojaangs([]);
        setError("Unexpected response format");
      }
    } catch (err: any) {
      setError(err.message || "Failed to fetch dojaangs");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchDojaangs();
    // eslint-disable-next-line
  }, [getToken]);

  async function handleDelete() {
    if (deleteId == null) return;
    setDeleting(true);
    setError(null);
    try {
      await apiRequest(`${baseUrl}/Dojaang/${deleteId}`, { method: "DELETE" }, getToken);
      setDojaangs((prev) => prev.filter((d) => d.id !== deleteId));
      setDeleteId(null);
      toast.success("Dojaang deleted!");
    } catch (err: any) {
      setError(err.message || "Delete failed");
      toast.error(err.message || "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  // Refresh dojaangs after successful add or edit
  function handleCreateClose(refresh?: boolean) {
    setShowCreate(false);
    if (refresh) {
      fetchDojaangs();
      toast.success("Dojaang created!");
    }
  }

  function handleEditClose(refresh?: boolean) {
    setEditId(null);
    if (refresh) {
      fetchDojaangs();
      toast.success("Dojaang updated!");
    }
  }

  return (
    <AdminListPage
      title="Dojaang Administration"
      role={role}
      canCreate={role === "Admin"}
      onCreateClick={() => setShowCreate(true)}
      loading={loading}
      error={error}
      createModal={showCreate && <EditDojaang onClose={handleCreateClose} />}
      editModal={editId !== null && <EditDojaang dojaangId={editId} onClose={handleEditClose} />}
      deleteModal={deleteId !== null && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
            <div className="flex justify-between items-center border-b px-4 sm:px-6 py-4">
              <h3 className="text-lg font-semibold">Confirm Delete</h3>
              <button
                type="button"
                className="text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
                aria-label="Close"
                onClick={() => setDeleteId(null)}
                disabled={deleting}
              >
                &times;
              </button>
            </div>
            <div className="px-4 sm:px-6 py-4">
              <p className="mb-4">Are you sure you want to delete this dojaang?</p>
              <div className="flex flex-col sm:flex-row justify-end gap-2">
                <button
                  className="w-full sm:w-auto px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                  onClick={() => setDeleteId(null)}
                  disabled={deleting}
                >
                  Cancel
                </button>
                <button
                  className="w-full sm:w-auto px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? "Deleting..." : "Delete"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    >
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 rounded text-xs sm:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-2 sm:px-4 py-2 text-left font-semibold text-gray-700">ID</th>
                <th className="px-2 sm:px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                <th className="px-2 sm:px-4 py-2 text-left font-semibold text-gray-700">Coach</th>
                <th className="px-2 sm:px-4 py-2 text-left font-semibold text-gray-700">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <DojaangTableRows
                dojaangs={dojaangs}
                role={role}
                setEditId={setEditId}
                setDeleteId={setDeleteId}
              />
            </tbody>
          </table>
        </div>
      )}
    </AdminListPage>
  );
}
