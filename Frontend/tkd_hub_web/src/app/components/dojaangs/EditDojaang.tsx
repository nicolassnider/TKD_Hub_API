"use client";
import CoachSelector from "@/app/components/coaches/CoachSelector";
import { useEffect, useState } from "react";
import { useDojaangs } from "@/app/context/DojaangContext";
import FormActionButtons from "../common/actionButtons/FormActionButtons";
import equal from "fast-deep-equal";
import ModalCloseButton from "../common/actionButtons/ModalCloseButton";
import LabeledInput from "../common/inputs/LabeledInput";
import { Dojaang } from "@/app/types/Dojaang";


type EditDojaangProps = {
  dojaangId?: number; // Optional: if undefined, create mode
  onClose: (refresh?: boolean) => void;
};


export default function EditDojaang({ dojaangId, onClose }: EditDojaangProps) {
  const [dojaang, setDojaang] = useState<Dojaang | null>(null);
  const [originalDojaang, setOriginalDojaang] = useState<Dojaang | null>(null);
  const [loading, setLoading] = useState(!!dojaangId);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const {
    dojaangs,
    fetchDojaangs,
    createDojaang,
    updateDojaang,
    getDojaang,
  } = useDojaangs();

  // Fetch dojaang for edit mode, or set empty for create mode
  useEffect(() => {
    let ignore = false;
    async function fetch() {
      setLoading(true);
      setError(null);
      if (!dojaangId) {
        const empty = {
          id: 0,
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
        setOriginalDojaang(empty);
        setLoading(false);
        return;
      }
      // Try to get from context first
      const contextDojaang = dojaangs.find(d => d.id === dojaangId);
      if (contextDojaang) {
        setDojaang(contextDojaang);
        setOriginalDojaang(contextDojaang);
        setLoading(false);
      } else {
        // fallback to context getDojaang (which fetches from API)
        try {
          const apiDojaang = await getDojaang(dojaangId);
          if (!ignore && apiDojaang) {
            setDojaang(apiDojaang);
            setOriginalDojaang(apiDojaang);
          }
        } catch (e) {
          if (!ignore) setError(e instanceof Error ? e.message : "Failed to fetch dojaang");
        } finally {
          if (!ignore) setLoading(false);
        }
      }
    }
    fetch();
    return () => {
      ignore = true;
    };
  }, [dojaangId, dojaangs, getDojaang]);

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

    try {
      if (dojaangId) {
        await updateDojaang(dojaangId, payload);
      } else {
        await createDojaang(payload);
      }
      fetchDojaangs();
      onClose(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
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
