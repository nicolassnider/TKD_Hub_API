import React, { useEffect, useState } from "react";
import DescriptionIcon from "@mui/icons-material/Description";
import DeleteIcon from "@mui/icons-material/Delete";

import Alert from "@mui/material/Alert";
import EditDojaang from "./EditDojaang";
import { useRole } from "../../context/RoleContext";

const baseUrl = "https://localhost:7046/api";

type Dojaang = {
  id: number;
  name: string;
  address?: string;
  location?: string;
  phoneNumber?: string;
  email?: string;
};

export default function DojaangAdmin() {
  const { token, role } = useRole();
  const [dojaangs, setDojaangs] = useState<Dojaang[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  // ...existing code...

  // fetchList is used in multiple places (initial load, refresh, after modal close)
  const fetchList = React.useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${baseUrl}/Dojaang`, {
        headers: { Authorization: token ? `Bearer ${token}` : "" },
      });
      if (!res.ok) throw new Error(`Failed to load: ${res.status}`);
      const body = await res.json().catch(() => null);
      const list = Array.isArray(body) ? body : (body?.data ?? []);
      setDojaangs(list);
    } catch (err: any) {
      setError(err.message || "Unknown error");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to delete this Dojaang?")) return;
    if (!token) return alert("Not authorized");
    setDeleteId(id);
    try {
      const res = await fetch(`${baseUrl}/Dojaang/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error(`Delete failed: ${res.status}`);
      setDojaangs((s) => s.filter((d) => d.id !== id));
    } catch (err: any) {
      alert(err.message || "Delete error");
    } finally {
      setDeleteId(null);
    }
  };

  return (
    <div className="p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold">Dojaangs</h2>
        <div className="flex items-center gap-2">
          <button
            className="px-3 py-1 border rounded"
            onClick={() => fetchList()}
            disabled={loading}
          >
            REFRESH
          </button>
          <button
            className="px-3 py-1 bg-green-600 text-white rounded"
            onClick={() => setEditId(0)}
          >
            Add Dojaang
          </button>
        </div>
      </div>
      {loading && <div>Loading...</div>}
      {error && <Alert severity="error">{error}</Alert>}
      <table className="min-w-full bg-white">
        <thead>
          <tr>
            <th className="px-4 py-2">ID</th>
            <th className="px-4 py-2">Name</th>
            <th className="px-4 py-2">Location</th>
            <th className="px-4 py-2">Options</th>
          </tr>
        </thead>
        <tbody>
          {dojaangs.map((d) => (
            <tr key={d.id} className="border-t">
              <td className="px-4 py-2">{d.id}</td>
              <td className="px-4 py-2">{d.name}</td>
              <td className="px-4 py-2">{d.location ?? d.address}</td>
              <td className="px-4 py-2">
                <button
                  title="Details"
                  className="mr-2 p-1"
                  onClick={() => setEditId(d.id)}
                >
                  <DescriptionIcon />
                </button>
                {Array.isArray(role) && role.includes("Admin") && (
                  <button
                    title="Delete"
                    className="text-red-600 p-1"
                    onClick={() => handleDelete(d.id)}
                  >
                    <DeleteIcon />
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-3">
        {Array.isArray(role) && role.includes("Admin") && (
          <button
            className="px-3 py-1 bg-green-600 text-white rounded"
            onClick={() => setEditId(0)}
          >
            Add Dojaang
          </button>
        )}
      </div>

      {editId !== null && (
        <EditDojaang
          dojaangId={editId}
          onClose={() => {
            setEditId(null);
            // reuse fetchList to reload
            fetchList();
          }}
        />
      )}
    </div>
  );
}
