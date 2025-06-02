import React, { useState, useEffect } from "react";
import ManagedDojaangs from "./ManagedDojaangs";

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
  const [coach, setCoach] = useState<Coach | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [allDojaangs, setAllDojaangs] = useState<{ id: number; name: string }[]>([]);

  // Local state for form fields
  const [form, setForm] = useState<Omit<Coach, "id"> | null>(null);

  useEffect(() => {
    const fetchCoach = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
        const res = await fetch(`${baseUrl}/Coaches/${coachId}`, {
          headers: {
            "Content-Type": "application/json",
            ...(token ? { Authorization: `Bearer ${token}` } : {}),
          },
        });
        if (!res.ok) throw new Error("Failed to fetch coach details");
        const data = await res.json();
        // New API shape: { data: { coach: {...}, managedDojaangs: [...] } }
        const coachData: Coach = data.data?.coach || {};
        setCoach(coachData);
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
        setAllDojaangs(data.data?.managedDojaangs || []);
      } catch (err: any) {
        setError(err.message || "Error loading coach");
      } finally {
        setLoading(false);
      }
    };
    fetchCoach();
  }, [coachId]);

  useEffect(() => {
    const fetchCoachAndDojaangs = async () => {
      try {
        const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
        setCoach(coachData);
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
      } catch (err: any) {
        setError(err.message || "Error loading coach");
      } finally {
        setLoading(false);
      }
    };
    fetchCoachAndDojaangs();
  }, [coachId]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setForm((prev) =>
      prev
        ? {
          ...prev,
          [name]: value,
        }
        : prev
    );
  };

  const handleAddManagedDojaang = async (dojaangId: number) => {
  if (!form) return;
  const updatedIds = [...(form.managedDojaangIds ?? []), dojaangId];
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
    const res = await fetch(`${baseUrl}/Coaches/${coachId}/managed-dojaangs`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
      },
      body: JSON.stringify({
        coachId,
        managedDojaangIds: updatedIds, // Use managedDojaangIds as per your DTO
      }),
    });
    if (!res.ok) throw new Error("Failed to update managed dojaangs");
    setForm((f) => ({
      ...f!,
      managedDojaangIds: updatedIds,
    }));
  } catch (err: any) {
    alert(err.message || "Failed to update managed dojaangs");
  }
};

  const handleUpdate = async () => {
  if (!form) return;
  try {
    const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;
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
  } catch (err: any) {
    alert(err.message || "Failed to update coach");
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
          <div className="mb-3">
            <label className="block font-medium mb-1">First Name</label>
            <input
              type="text"
              name="firstName"
              className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white"
              value={form.firstName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium mb-1">Last Name</label>
            <input
              type="text"
              name="lastName"
              className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white"
              value={form.lastName}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium mb-1">Email</label>
            <input
              type="email"
              name="email"
              className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white"
              value={form.email}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium mb-1">Phone Number</label>
            <input
              type="text"
              name="phoneNumber"
              className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white"
              value={form.phoneNumber ?? ""}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium mb-1">Gender</label>
            <input
              type="text"
              name="gender"
              className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white"
              value={
                form.gender === 1
                  ? "Male"
                  : form.gender === 2
                    ? "Female"
                    : form.gender === 3
                      ? "Other"
                      : ""
              }
              readOnly
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium mb-1">Date of Birth</label>
            <input
              type="text"
              name="dateOfBirth"
              className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white"
              value={form.dateOfBirth ? form.dateOfBirth.substring(0, 10) : ""}
              onChange={handleChange}
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium mb-1">Join Date</label>
            <input
              type="text"
              name="joinDate"
              className="w-full border rounded px-3 py-2 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white"
              value={form.joinDate ? form.joinDate.substring(0, 10) : ""}
              readOnly
              disabled
            />
          </div>
          <div className="mb-3">
            <label className="block font-medium mb-1">Managed Dojaangs</label>
            <div className="mb-3">
              <label className="block font-medium mb-1">Managed Dojaangs</label>
              <ManagedDojaangs
                coachId={coachId}
                managedDojaangIds={form.managedDojaangIds ?? []}
                allDojaangs={allDojaangs}
                onAdd={handleAddManagedDojaang}
                onRemove={(id) => {
                  setForm((f) => ({
                    ...f!,
                    managedDojaangIds: (f?.managedDojaangIds ?? []).filter((did) => did !== id),
                  }));
                }}
                onRemoveSuccess={(id) => {
                  // Optionally re-fetch or update state if needed
                }}
              />
            </div>
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
