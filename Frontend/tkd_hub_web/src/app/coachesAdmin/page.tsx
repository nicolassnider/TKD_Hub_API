"use client";
import { useEffect, useState } from "react";
import { useRole } from "../context/RoleContext";
import CoachesTableRows from "../components/coaches/CoachesTableRows";
import EditCoach from "../components/coaches/EditCoach";
import { useAuth } from "../context/AuthContext";

type Coach = {
  id: number;
  name: string;
  email: string;
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

export default function CoachesAdmin() {
  const { role } = useRole();
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editId, setEditId] = useState<number | null>(null);
  const { getToken } = useAuth();

  const fetchCoaches = async (): Promise<Coach[]> => {
    const token = getToken();
    const res = await fetch(`${baseUrl}/Coaches`, {
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
    });
    if (!res.ok) throw new Error("Failed to fetch coaches");
    const data = await res.json();
    const coachesArray =
      Array.isArray(data)
        ? data
        : Array.isArray(data.data)
          ? data.data
          : [];
    return coachesArray.map((c: { id: number; firstName?: string; lastName?: string; email: string }) => ({
      id: c.id,
      name: c.firstName && c.lastName ? `${c.firstName} ${c.lastName}` : c.firstName || c.lastName || "",
      email: c.email,
    }));
  };

  useEffect(() => {
    fetchCoaches()
      .then(setCoaches)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  return (
    <div className="w-full max-w-2xl mx-auto my-4 bg-white dark:bg-neutral-900 rounded shadow p-4 p-sm-5">
      <h2 className="h4 h3-sm font-bold mb-4 text-center">Coaches Administration</h2>
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
              <th>Email</th>
              <th>Options</th>
              <th>Managed Dojaangs</th>
            </tr>
          </thead>
          <tbody>
            <CoachesTableRows coaches={coaches} onEdit={setEditId} />
          </tbody>
        </table>
      )}
      {editId !== null && (
        <EditCoach coachId={editId} onClose={() => setEditId(null)} />
      )}
    </div>
  );
}
