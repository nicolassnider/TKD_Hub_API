import React, { useState, useEffect } from "react";
import ManagedDojaangs from "./ManagedDojaangs";
import { useAuth } from "@/app/context/AuthContext";

type EditCoachProps = {
  coachId: number;
  onClose: () => void;
};

type Coach = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  gender?: number;
  dateOfBirth?: string;
  dojaangId?: number | null;
  currentRankId?: number;
  joinDate?: string;
  roles?: string[] | null;
  managedDojaangIds?: number[];
};

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "";

const EditCoach: React.FC<EditCoachProps> = ({ coachId, onClose }) => {
  // Removed unused 'coach' state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allDojaangs, setAllDojaangs] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState<Omit<Coach, "id"> | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCoachAndDojaangs = async () => {
      try {
        const token = getToken();
        // Fetch coach
        const res = await fetch(`${baseUrl}/Coaches/${coachId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch coach details");
        const data = await res.json();
        const coachData: Coach = data.data?.coach || {};
        setForm({
          firstName: coachData.firstName,
          lastName: coachData.lastName,
          email: coachData.email,
          phoneNumber: coachData.phoneNumber ?? "",
          gender: coachData.gender,
          dateOfBirth: coachData.dateOfBirth ?? "",
          dojaangId: coachData.dojaangId ?? null,
          currentRankId: coachData.currentRankId,
          joinDate: coachData.joinDate ?? "",
          roles: coachData.roles ?? [],
          managedDojaangIds: coachData.managedDojaangIds ?? [],
        });

        // Fetch ALL dojaangs for selector
        const dojaangsRes = await fetch(`${baseUrl}/Dojaang`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!dojaangsRes.ok) throw new Error("Failed to fetch dojaangs");
        const dojaangsData = await dojaangsRes.json();
        setAllDojaangs(Array.isArray(dojaangsData) ? dojaangsData : dojaangsData.data || []);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message || "Error loading coach");
        else setError("Error loading coach");
      } finally {
        setLoading(false);
      }
    };
    fetchCoachAndDojaangs();
  }, [coachId, getToken]);

  const handleAddManagedDojaang = async (dojaangId: number) => {
    if (!form) return;
    const updatedIds = [...(form.managedDojaangIds ?? []), dojaangId];
    try {
      const token = getToken();
      const res = await fetch(`${baseUrl}/Coaches/${coachId}/managed-dojaangs`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          coachId,
          managedDojaangIds: updatedIds,
        }),
      });
      if (!res.ok) throw new Error("Failed to update managed dojaangs");
      setForm((f) => ({
        ...f!,
        managedDojaangIds: updatedIds,
      }));
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message || "Failed to update managed dojaangs");
      else alert("Failed to update managed dojaangs");
    }
  };

  const handleUpdate = async () => {
    if (!form) return;
    try {
      const token = getToken();
      const res = await fetch(`${baseUrl}/Users/${coachId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: "", // Required by DTO, leave blank if not updating
          phoneNumber: form.phoneNumber ?? "",
          gender: form.gender ?? 0,
          dateOfBirth: form.dateOfBirth
            ? new Date(form.dateOfBirth).toISOString()
            : null,
          dojaangId: form.dojaangId ?? 0,
          rankId: form.currentRankId ?? 0,
          joinDate: form.joinDate
            ? new Date(form.joinDate).toISOString()
            : null,
          roleIds: [2], // Typically the role ID for "Coach"
        }),
      });
      if (!res.ok) throw new Error("Failed to update coach");
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message || "Failed to update coach");
      else alert("Failed to update coach");
    }
  };

  if (loading) return <div className="text-center">Loading coach...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;
  if (!form) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 rounded shadow-lg p-6 w-full max-w-md relative max-h-[90vh] flex flex-col">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={onClose}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4 text-center">Edit Coach</h3>
        <form className="flex-1 overflow-y-auto pr-2">
          {/* ...form fields... */}
          <div className="mb-3">
            <label className="block font-medium mb-1">Managed Dojaangs</label>
            <ManagedDojaangs
              coachId={coachId}
              managedDojaangIds={form.managedDojaangIds ?? []}
              allDojaangs={allDojaangs}
              onAdd={handleAddManagedDojaang}
              onRemove={(removeId) => {
                setForm((f) => ({
                  ...f!,
                  managedDojaangIds: (f?.managedDojaangIds ?? []).filter((did) => did !== removeId),
                }));
              }}
              onRemoveSuccess={() => {
                // Optionally re-fetch or update state if needed
              }}
            />
          </div>
        </form>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-300 dark:bg-neutral-700 text-gray-800 dark:text-white hover:bg-gray-400 dark:hover:bg-neutral-600"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            type="button"
            className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            onClick={handleUpdate}
          >
            {coachId ? "Update" : "Create"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditCoach;
