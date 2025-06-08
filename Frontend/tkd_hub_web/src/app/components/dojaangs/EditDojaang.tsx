"use client";
import CoachSelector from "@/app/components/coaches/CoachSelector";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { apiRequest } from "@/app/utils/api";
import { useApiConfig } from "@/app/context/ApiConfigContext";
import { useDojaangs } from "@/app/context/DojaangContext";

type EditDojaangProps = {
  dojaangId?: number; // Optional: if undefined, create mode
  onClose: (refresh?: boolean) => void;
};

type Dojaang = {
  id?: number;
  name: string;
  address: string;
  location: string;
  phoneNumber: string;
  email: string;
  koreanName: string;
  koreanNamePhonetic: string;
  coachId: number | null;
  coachName?: string | null;
};

type DojaangApiResponse = {
  data: Dojaang;
};


export default function EditDojaang({ dojaangId, onClose }: EditDojaangProps) {
  const [dojaang, setDojaang] = useState<Dojaang | null>(null);
  const [loading, setLoading] = useState(!!dojaangId);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { getToken } = useAuth();
  const { baseUrl } = useApiConfig();
  const { refreshDojaangs } = useDojaangs(); // <-- Add this line


  // Fetch existing dojaang if editing
  useEffect(() => {
    if (!dojaangId) {
      setDojaang({
        name: "",
        address: "",
        location: "",
        phoneNumber: "",
        email: "",
        koreanName: "",
        koreanNamePhonetic: "",
        coachId: null,
      });
      setLoading(false);
      return;
    }
    const fetchDojaang = async () => {
      const token = getToken();
      if (!token) {
        setError("Not authenticated.");
        setLoading(false);
        return;
      }
      try {
        const response: DojaangApiResponse = await apiRequest<DojaangApiResponse>(
          `${baseUrl}/Dojaang/${dojaangId}`,
          { method: "GET" },
          getToken
        );
        setDojaang(response.data);
      } catch (err) {
        if (err instanceof Error) setError(err.message || "Failed to fetch dojaang");
        else setError("Failed to fetch dojaang");
      } finally {
        setLoading(false);
      }
    };
    fetchDojaang();
  }, [dojaangId, getToken, baseUrl]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    if (!dojaang) return;
    const { name, value } = e.target;
    setDojaang({ ...dojaang, [name]: value });
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!dojaang) return;
    setSaving(true);
    setError(null);

    try {
      const payload = {
        name: dojaang.name,
        address: dojaang.address,
        location: dojaang.location,
        phoneNumber: dojaang.phoneNumber,
        email: dojaang.email,
        koreanName: dojaang.koreanName,
        koreanNamePhonetic: dojaang.koreanNamePhonetic,
        coachId: dojaang.coachId ? dojaang.coachId : null,
      };

      if (dojaangId) {
        // Edit mode (PUT)
        await apiRequest(
          `${baseUrl}/Dojaang/${dojaangId}`,
          {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: dojaangId, ...payload }),
          },
          getToken
        );
      } else {
        // Create mode (POST)
        await apiRequest(
          `${baseUrl}/Dojaang`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          },
          getToken
        );
      }
      refreshDojaangs(); // <-- Refresh context after save
      onClose(true); // pass true to trigger refresh in parent
    } catch (err) {
      if (err instanceof Error) setError(err.message || "An error occurred");
      else setError("An error occurred");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto relative max-h-[90vh] flex flex-col">
        <button
          type="button"
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
          aria-label="Close"
          onClick={() => onClose(false)}
          disabled={saving}
        >
          &times;
        </button>
        <div className="px-4 sm:px-8 pt-8 pb-2 flex-1 overflow-y-auto">
          <h2 className="text-xl font-semibold mb-6 text-center">
            {dojaangId ? "Edit Dojaang" : "Create Dojaang"}
          </h2>
          {loading && <div className="text-center text-gray-600">Loading...</div>}
          {error && <div className="text-red-600 text-center">{error}</div>}
          {!loading && !error && dojaang && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="name">Name:</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dojaang.name}
                    onChange={handleChange}
                    placeholder="Enter dojaang name"
                    title="Dojaang Name"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="address">Address:</label>
                  <input
                    id="address"
                    name="address"
                    type="text"
                    className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dojaang.address}
                    onChange={handleChange}
                    placeholder="Enter address"
                    title="Address"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="location">Location:</label>
                  <input
                    id="location"
                    name="location"
                    type="text"
                    className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dojaang.location}
                    onChange={handleChange}
                    placeholder="Enter location"
                    title="Location"
                    required
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="phoneNumber">Phone Number:</label>
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="text"
                    className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dojaang.phoneNumber}
                    onChange={handleChange}
                    placeholder="Enter phone number"
                    title="Phone Number"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="email">Email:</label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dojaang.email}
                    onChange={handleChange}
                    placeholder="Enter email"
                    title="Email"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="koreanName">Korean Name:</label>
                  <input
                    id="koreanName"
                    name="koreanName"
                    type="text"
                    className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dojaang.koreanName}
                    onChange={handleChange}
                    placeholder="Enter Korean name"
                    title="Korean Name"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="koreanNamePhonetic">Korean Name Phonetic:</label>
                  <input
                    id="koreanNamePhonetic"
                    name="koreanNamePhonetic"
                    type="text"
                    className="rounded border border-gray-300 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={dojaang.koreanNamePhonetic}
                    onChange={handleChange}
                    placeholder="Enter Korean name phonetic"
                    title="Korean Name Phonetic"
                  />
                </div>
                <div className="flex flex-col gap-1">
                  <label htmlFor="coachName" className="font-medium">Coach:</label>
                  <CoachSelector
                    baseUrl={baseUrl}
                    value={dojaang.coachId ? String(dojaang.coachId) : ""}
                    onChange={e =>
                      setDojaang({
                        ...dojaang,
                        coachId: e.target.value ? Number(e.target.value) : null,
                      })
                    }
                    disabled={saving}
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 mt-4">
                <button
                  type="button"
                  className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
                  onClick={() => onClose(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
                  disabled={saving}
                >
                  {saving
                    ? dojaangId
                      ? "Saving..."
                      : "Creating..."
                    : dojaangId
                      ? "Save"
                      : "Create"}
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
