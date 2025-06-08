import React, { useState, useEffect } from "react";
import ManagedDojaangs from "./ManagedDojaangs";
import RanksSelector from "@/app/components/ranks/RanksSelector";
import { useAuth } from "@/app/context/AuthContext";
import { apiRequest } from "@/app/utils/api";
import toast from "react-hot-toast";
import { useApiConfig } from "@/app/context/ApiConfigContext";
import GenderSelector from "../common/GenderSelector";

type EditCoachProps = {
  coachId: number;
  onClose: (wasCreated?: boolean) => void;
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

type ApiCoachResponse = {
  data?: {
    coach?: Coach;
  };
};

type ApiDojaang = {
  id: number;
  name: string;
};

type ApiDojaangResponse = ApiDojaang[] | { data: ApiDojaang[] };

const EditCoach: React.FC<EditCoachProps> = ({ coachId, onClose, handleRefresh }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allDojaangs, setAllDojaangs] = useState<{ id: number; name: string }[]>([]);
  const [form, setForm] = useState<Omit<Coach, "id"> | null>(null);
  const { getToken } = useAuth();
  const { baseUrl } = useApiConfig();

  useEffect(() => {
    const fetchCoachAndDojaangs = async () => {
      try {
        if (coachId !== 0) {
          const data: ApiCoachResponse = await apiRequest<ApiCoachResponse>(`${baseUrl}/Coaches/${coachId}`, {}, getToken);
          const coachData: Coach = data.data?.coach || {} as Coach;
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
        const dojaangsData: ApiDojaangResponse = await apiRequest<ApiDojaangResponse>(`${baseUrl}/Dojaang`, {}, getToken);
        setAllDojaangs(Array.isArray(dojaangsData) ? dojaangsData : dojaangsData.data || []);
      } catch (err: unknown) {
        if (err instanceof Error) setError(err.message || "Error loading coach");
        else setError("Error loading coach");
      } finally {
        setLoading(false);
      }
    };
    fetchCoachAndDojaangs();
  }, [coachId, getToken, baseUrl]);

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
      toast.success("Dojaang added!");
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message || "Failed to update managed dojaangs");
      else toast.error("Failed to update managed dojaangs");
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
            managedDojaangIds: form.managedDojaangIds ?? [], // <-- Add this line
          }),
        },
        getToken
      );
      if (handleRefresh) handleRefresh();
      toast.success("Coach updated!");
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) toast.error(err.message || "Failed to upsert coach");
      else toast.error("Failed to upsert coach");
    }
  };

  if (loading) return <div className="text-center">Loading coach...</div>;
  if (error) return <div className="text-danger text-center">{error}</div>;
  if (!form) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
      <div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] flex flex-col">
        <button
          className="absolute top-2 right-2 text-gray-500 hover:text-gray-800"
          onClick={() => onClose(false)}
          aria-label="Close"
        >
          &times;
        </button>
        <h3 className="text-lg font-bold mb-4 text-center">Edit Coach</h3>
        <form
          className="flex-1 overflow-y-auto pr-2 space-y-3"
          onSubmit={e => { e.preventDefault(); handleUpdate(); }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
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
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <label className="block font-medium mb-1" htmlFor="gender">Gender</label>
              <GenderSelector
                value={form.gender}
                onChange={e => setForm(f => ({ ...f!, gender: Number(e.target.value) }))}
                disabled={loading}
              />
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
          </div>
          <div>
            <RanksSelector
              value={form.currentRankId ?? ""}
              onChange={e => setForm(f => ({ ...f!, currentRankId: e.target.value ? Number(e.target.value) : 0 }))}
              disabled={loading}
              filter="black"
            />
          </div>
          {coachId !== 0 && (
            <div>
              <label className="block font-medium mb-1">Managed Dojaangs</label>
              {/* Add Dojaang Selector */}
              <div className="flex gap-2 mb-2">
                <select
                  className="form-select rounded border border-gray-300 px-2 py-1"
                  value=""
                  onChange={e => {
                    const id = Number(e.target.value);
                    if (id && !(form.managedDojaangIds ?? []).includes(id)) {
                      setForm(f => ({
                        ...f!,
                        managedDojaangIds: [...(f?.managedDojaangIds ?? []), id],
                      }));
                      // Optionally, call handleAddManagedDojaang(id) here if you want to persist immediately
                    }
                  }}
                  title="Add Managed Dojaang"
                  aria-label="Add Managed Dojaang"
                >
                  <option value="">Add Dojaang...</option>
                  {allDojaangs
                    .filter(d => !(form.managedDojaangIds ?? []).includes(d.id))
                    .map(d => (
                      <option key={d.id} value={d.id}>
                        {d.name} #{d.id}
                      </option>
                    ))}
                </select>
              </div>
              {/* List of Managed Dojaangs */}
              <ul>
                {(form.managedDojaangIds ?? []).map(id => {
                  const dojaang = allDojaangs.find(d => d.id === id);
                  if (!dojaang) return null;
                  return (
                    <li key={id} className="flex items-center gap-2 mb-1">
                      <span>
                        {dojaang.name} <span className="text-xs text-gray-500">#{id}</span>
                      </span>
                      <button
                        type="button"
                        className="text-red-600 hover:underline text-xs"
                        onClick={() => {
                          setForm(f => ({
                            ...f!,
                            managedDojaangIds: (f?.managedDojaangIds ?? []).filter(did => did !== id),
                          }));
                          // Optionally, call handleRemoveManagedDojaang(id) here if you want to persist immediately
                        }}
                      >
                        Remove
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          )}
        </form>
        <div className="flex justify-end gap-2 mt-4">
          <button
            type="button"
            className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
            onClick={() => onClose(false)}
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
