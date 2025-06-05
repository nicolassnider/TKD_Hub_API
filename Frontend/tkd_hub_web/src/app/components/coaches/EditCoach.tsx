import React, { useState, useEffect } from "react";
import ManagedDojaangs from "./ManagedDojaangs";
import RanksSelector from "@/app/components/ranks/RanksSelector";
import { useAuth } from "@/app/context/AuthContext";
import { apiRequest } from "@/app/utils/api";

type EditCoachProps = {
  coachId: number;
  onClose: (wasCreated?: boolean) => void; // <-- allow optional boolean
  handleRefresh?: () => void;
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

const EditCoach: React.FC<EditCoachProps> = ({ coachId, onClose, handleRefresh }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allDojaangs, setAllDojaangs] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState<Omit<Coach, "id"> | null>(null);
  const { getToken } = useAuth();

  useEffect(() => {
    const fetchCoachAndDojaangs = async () => {
      try {
        if (coachId !== 0) {
          const data = await apiRequest<any>(`${baseUrl}/Coaches/${coachId}`, {}, getToken);
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
        } else {
          setForm({
            firstName: "",
            lastName: "",
            email: "",
            phoneNumber: "",
            gender: 0,
            dateOfBirth: "",
            dojaangId: null,
            currentRankId: 0,
            joinDate: "",
            roles: [],
            managedDojaangIds: [],
          });
        }
        const dojaangsData = await apiRequest<any>(`${baseUrl}/Dojaang`, {}, getToken);
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
      await apiRequest(
        `${baseUrl}/Coaches/${coachId}/managed-dojaangs`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            coachId,
            managedDojaangIds: updatedIds,
          }),
        },
        getToken
      );
      setForm((f) => ({
        ...f!,
        managedDojaangIds: updatedIds,
      }));
      if (typeof handleRefresh === "function") handleRefresh();
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message || "Failed to update managed dojaangs");
      else alert("Failed to update managed dojaangs");
    }
  };

  const handleUpdate = async () => {
    if (!form) return;
    try {
      await apiRequest(
        `${baseUrl}/Coaches/upsert`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            id: coachId,
            firstName: form.firstName,
            lastName: form.lastName,
            email: form.email,
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
            roleIds: [2],
          }),
        },
        getToken
      );
      if (handleRefresh) handleRefresh();
      // Always close modal after successful upsert
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) alert(err.message || "Failed to upsert coach");
      else alert("Failed to upsert coach");
    }
  };

  if (loading) return <div className="text-center">Loading coach...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;
  if (!form) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-md relative max-h-[90vh] flex flex-col">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={() => onClose(false)}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4 text-center">Edit Coach</h3>
        <form
          className="flex-1 overflow-y-auto pr-2 space-y-4"
          onSubmit={e => { e.preventDefault(); handleUpdate(); }}
        >
          <div>
            <label className="block font-medium mb-1" htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              className="form-input w-full rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.firstName}
              onChange={e => setForm(f => ({ ...f!, firstName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              className="form-input w-full rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.lastName}
              onChange={e => setForm(f => ({ ...f!, lastName: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              className="form-input w-full rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.email}
              onChange={e => setForm(f => ({ ...f!, email: e.target.value }))}
              required
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="phoneNumber">Phone Number</label>
            <input
              id="phoneNumber"
              type="text"
              className="form-input w-full rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.phoneNumber}
              onChange={e => setForm(f => ({ ...f!, phoneNumber: e.target.value }))}
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="gender">Gender</label>
            <select
              id="gender"
              className="form-select w-full rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.gender}
              onChange={e => setForm(f => ({ ...f!, gender: Number(e.target.value) }))}
            >
              <option value={0}>Not specified</option>
              <option value={1}>Male</option>
              <option value={2}>Female</option>
            </select>
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="dateOfBirth">Date of Birth</label>
            <input
              id="dateOfBirth"
              type="date"
              className="form-input w-full rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={form.dateOfBirth ? form.dateOfBirth.substring(0, 10) : ""}
              onChange={e => setForm(f => ({ ...f!, dateOfBirth: e.target.value }))}
            />
          </div>
          <div>
            <label className="block font-medium mb-1" htmlFor="currentRankId">Rank (Black Belts Only)</label>
            <RanksSelector
              value={form.currentRankId ?? ""}
              onChange={e => setForm(f => ({ ...f!, currentRankId: e.target.value ? Number(e.target.value) : 0 }))}
              disabled={loading}
              filter="black" // <-- Only show black belts
            />
          </div>
          {coachId !== 0 && (
            <div>
              <label className="block font-medium mb-1" htmlFor="dojaangId">Dojaang</label>
              <select
                id="dojaangId"
                className="form-select w-full rounded border border-gray-300 bg-white text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={form.dojaangId ?? ""}
                onChange={e => setForm(f => ({ ...f!, dojaangId: e.target.value ? Number(e.target.value) : null }))}
              >
                <option value="">Select Dojaang</option>
                {allDojaangs.map(d => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
            </div>
          )}
          {coachId !== 0 && (
            <div>
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
          )}
        </form>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
            onClick={() => onClose(false)} // Pass false on cancel
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
