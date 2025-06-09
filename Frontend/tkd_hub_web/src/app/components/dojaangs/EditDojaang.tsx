"use client";
import CoachSelector from "@/app/components/coaches/CoachSelector";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";
import { apiRequest } from "@/app/utils/api";
import { useApiConfig } from "@/app/context/ApiConfigContext";
import { useDojaangs } from "@/app/context/DojaangContext";
import FormActionButtons from "../common/FormActionButtons";
import equal from "fast-deep-equal";
import ModalCloseButton from "../common/ModalCloseButton";
import LabeledInput from "../common/inputs/LabeledInput";

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
  const [originalDojaang, setOriginalDojaang] = useState<Dojaang | null>(null); // <-- Add this line
  const [loading, setLoading] = useState(!!dojaangId);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { getToken } = useAuth();
  const { baseUrl } = useApiConfig();
  const { refreshDojaangs } = useDojaangs();

  // Fetch existing dojaang if editing
  useEffect(() => {
    if (!dojaangId) {
      const empty = {
        name: "",
        address: "",
        location: "",
        phoneNumber: "",
        email: "",
        koreanName: "",
        koreanNamePhonetic: "",
        coachId: null,
      };
      setDojaang(empty);
      setOriginalDojaang(empty); // <-- Set original for create mode
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
        setOriginalDojaang(response.data); // <-- Set original for edit mode
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
      refreshDojaangs();
      onClose(true);
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
        <ModalCloseButton onClick={() => onClose(false)} disabled={saving} />
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
                <LabeledInput
                  label="Dojaang Name"
                  name="name"
                  value={dojaang.name}
                  onChange={handleChange}
                  disabled={saving}
                  required
                  placeholder="Enter dojaang name"
                />
                <LabeledInput
                  label="Address"
                  name="address"
                  value={dojaang.address}
                  onChange={handleChange}
                  disabled={saving}
                />
                <LabeledInput
                  label="Location"
                  name="location"
                  value={dojaang.location}
                  onChange={handleChange}
                  disabled={saving}
                />
                <LabeledInput
                  label="Phone Number"
                  name="phoneNumber"
                  value={dojaang.phoneNumber}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Enter phone number"
                />
                <LabeledInput
                  label="Email"
                  name="email"
                  type="email"
                  value={dojaang.email}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Enter email address"
                />
                <LabeledInput
                  label="Korean Name"
                  name="koreanName"
                  value={dojaang.koreanName}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Enter Korean name"
                />
                <LabeledInput
                  label="Korean Name Phonetic"
                  name="koreanNamePhonetic"
                  value={dojaang.koreanNamePhonetic}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Enter Korean name phonetic"
                />
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
              <FormActionButtons
                onCancel={() => onClose(false)}
                onSubmitLabel={dojaangId ? (saving ? "Saving..." : "Save") : (saving ? "Creating..." : "Create")}
                loading={saving}
                disabled={equal(dojaang, originalDojaang)}
              />
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
