"use client";
import { useEffect, useState } from "react";
import { useRole } from "../../context/RoleContext";
import CoachesTableRows from "../../components/coaches/CoachesTableRows";
import EditCoach from "../../components/coaches/EditCoach";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "../../utils/api";
import { Toaster, toast } from "react-hot-toast";
import { AdminListPage } from "../../components/AdminListPage";

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
  const [showAdd, setShowAdd] = useState(false);

  const fetchCoaches = async (): Promise<Coach[]> => {
    const data = await apiRequest<any>(`${baseUrl}/Coaches`, {}, getToken);
    const coachesArray =
      Array.isArray(data)
        ? data
        : Array.isArray(data.data)
        ? data.data
        : [];
    return coachesArray.map(
      (c: { id: number; firstName?: string; lastName?: string; email: string }) => ({
        id: c.id,
        name:
          c.firstName && c.lastName
            ? `${c.firstName} ${c.lastName}`
            : c.firstName || c.lastName || "",
        email: c.email,
      })
    );
  };

  const handleRefresh = () => {
    setLoading(true);
    fetchCoaches()
      .then(setCoaches)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    handleRefresh();
    // eslint-disable-next-line
  }, []);

  function handleEditClose(wasUpdated?: boolean) {
    setEditId(null);
    handleRefresh();
    if (wasUpdated !== false) toast.success("Coach updated!");
  }

  function handleAddClose(wasCreated?: boolean) {
    setShowAdd(false);
    handleRefresh();
    if (wasCreated !== false) toast.success("Coach created!");
  }

  return (
    <AdminListPage
      title="Coaches Administration"
      role={role}
      canCreate={role === "Admin"}
      onCreateClick={() => setShowAdd(true)}
      loading={loading}
      error={error}
      createModal={showAdd && (
        <EditCoach
          coachId={0}
          onClose={handleAddClose}
        />
      )}
      editModal={editId !== null && (
        <EditCoach
          coachId={editId}
          onClose={handleEditClose}
        />
      )}
    >
      {!loading && !error && (
        <div className="overflow-x-auto">
          <table className="min-w-full table-auto border border-gray-200 rounded text-sm sm:text-base">
            <thead>
              <tr className="bg-gray-100">
                <th className="px-4 py-2 text-left font-semibold text-gray-700">ID</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Name</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Email</th>
                <th className="px-4 py-2 text-left font-semibold text-gray-700">Options</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              <CoachesTableRows coaches={coaches} onEdit={setEditId} />
            </tbody>
          </table>
        </div>
      )}
    </AdminListPage>
  );
}
