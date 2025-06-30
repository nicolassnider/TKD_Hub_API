"use client";

// External imports
import { useEffect, useState } from "react";
import equal from "fast-deep-equal";

// App/context/component imports
import { useDojaangs } from "@/app/context/DojaangContext";
import { useCoaches } from "@/app/context/CoachContext";
import { Dojaang } from "@/app/types/Dojaang";
import ModalCloseButton from "../common/actionButtons/ModalCloseButton";
import FormActionButtons from "../common/actionButtons/FormActionButtons";
import LabeledInput from "../common/inputs/LabeledInput";
import { GenericSelector } from "../common/selectors/GenericSelector";

type EditDojaangProps = {
  dojaangId?: number; // Optional: if undefined, create mode
  onClose: (refresh?: boolean) => void;
};

export default function EditDojaang({ dojaangId, onClose }: EditDojaangProps) {
  // 1. Context hooks
  const { dojaangs, fetchDojaangs, createDojaang, updateDojaang, getDojaang } =
    useDojaangs();
  const { coaches = [], loading: coachesLoading } = useCoaches();

  // 2. State hooks
  const [dojaang, setDojaang] = useState<Dojaang | null>(null);
  const [originalDojaang, setOriginalDojaang] = useState<Dojaang | null>(null);
  const [loading, setLoading] = useState(!!dojaangId);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  // 3. Effects
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
      const contextDojaang = dojaangs.find((d) => d.id === dojaangId);
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
          if (!ignore)
            setError(
              e instanceof Error ? e.message : "Failed to fetch dojaang"
            );
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

  // 4. Functions
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

  // 5. Render
  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg sm:max-w-xl md:max-w-2xl mx-auto relative max-h-[90vh] flex flex-col">
        <ModalCloseButton onClick={() => onClose(false)} disabled={saving} />
        <div className="px-4 sm:px-8 pt-8 pb-2 flex-1 overflow-y-auto">
          <h3 className="text-lg sm:text-xl md:text-2xl font-bold mb-4 text-center">
            {dojaangId ? "Edit Dojaang" : "Create Dojaang"}
          </h3>
          {loading && (
            <div className="text-center text-gray-600">Loading...</div>
          )}
          {error && <div className="text-red-600 text-center">{error}</div>}
          {!loading && !error && dojaang && (
            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Dojaang name */}
                <LabeledInput
                  label="Dojaang Name"
                  name="name"
                  value={dojaang.name}
                  onChange={handleChange}
                  disabled={saving}
                  required
                  placeholder="Enter dojaang name"
                />
                {/* Dojaang address */}
                <LabeledInput
                  label="Address"
                  name="address"
                  value={dojaang.address}
                  onChange={handleChange}
                  disabled={saving}
                  required
                  placeholder="Enter address"
                />
                {/* Dojaang location */}
                <LabeledInput
                  label="Location"
                  name="location"
                  value={dojaang.location}
                  onChange={handleChange}
                  disabled={saving}
                  required
                  placeholder="Enter location"
                />
                {/* Dojaang phone */}
                <LabeledInput
                  label="Phone Number"
                  name="phoneNumber"
                  value={dojaang.phoneNumber}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Enter phone number"
                  required
                />
                {/* Dojaang email */}
                <LabeledInput
                  label="Email"
                  name="email"
                  type="email"
                  value={dojaang.email}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Enter email address"
                  required
                />
                {/* Dojaang Korean name */}
                <LabeledInput
                  label="Korean Name"
                  name="koreanName"
                  value={dojaang.koreanName}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Enter Korean name"
                />
                {/* Dojaang Korean phonetic */}
                <LabeledInput
                  label="Korean Name Phonetic"
                  name="koreanNamePhonetic"
                  value={dojaang.koreanNamePhonetic}
                  onChange={handleChange}
                  disabled={saving}
                  placeholder="Enter Korean name phonetic"
                />
                {/* Coach selector */}
                <GenericSelector
                  items={coaches}
                  value={dojaang.coachId ?? null}
                  onChange={(id) =>
                    setDojaang({
                      ...dojaang,
                      coachId: id ?? null,
                    })
                  }
                  getLabel={(c) =>
                    `${c.firstName} ${c.lastName}${
                      c.email ? ` (${c.email})` : ""
                    }`
                  }
                  getId={(c) => c.id}
                  disabled={saving || coachesLoading}
                  label="Coach"
                  placeholder="Select a coach"
                />
              </div>
              <FormActionButtons
                onCancel={() => onClose(false)}
                onSubmitLabel={
                  dojaangId
                    ? saving
                      ? "Saving..."
                      : "Save"
                    : saving
                    ? "Creating..."
                    : "Create"
                }
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
