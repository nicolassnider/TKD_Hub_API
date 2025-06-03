"use client";
import CoachSelector from "@/app/components/coaches/CoachSelector";
import { useEffect, useState } from "react";
import { useAuth } from "@/app/context/AuthContext";

type EditDojaangProps = {
  dojaangId?: number; // Optional: if undefined, create mode
  onClose: () => void;
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

const baseUrl = process.env.NEXT_PUBLIC_API_BASE_URL;

export default function EditDojaang({ dojaangId, onClose }: EditDojaangProps) {
  const [dojaang, setDojaang] = useState<Dojaang | null>(null);
  const [loading, setLoading] = useState(!!dojaangId);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const { getToken } = useAuth();

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
    const token = getToken();
    if (!token) {
      setError("Not authenticated.");
      setLoading(false);
      return;
    }
    fetch(`${baseUrl}/Dojaang/${dojaangId}`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch dojaang");
        const response = await res.json();
        setDojaang(response.data);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [dojaangId, getToken]);

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

    const token = getToken();
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

      let res;
      if (dojaangId) {
        // Edit mode (PUT)
        res = await fetch(`${baseUrl}/Dojaang/${dojaangId}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ id: dojaangId, ...payload }),
        });
      } else {
        // Create mode (POST)
        res = await fetch(`${baseUrl}/Dojaang`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(payload),
        });
      }
      if (!res.ok) throw new Error(dojaangId ? "Failed to update dojaang" : "Failed to create dojaang");
      onClose();
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message || "An error occurred");
      } else {
        setError("An error occurred");
      }
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="modal fade show d-block" tabIndex={-1} role="dialog" style={{ background: "rgba(0,0,0,0.4)" }}>
      <div className="modal-dialog modal-dialog-centered" role="document">
        <div className="modal-content">
          <button
            type="button"
            className="btn-close position-absolute end-0 m-3"
            aria-label="Close"
            onClick={onClose}
            style={{ zIndex: 2 }}
          ></button>
          <div className="modal-header border-0 pb-0">
            <h2 className="modal-title fs-5">{dojaangId ? "Edit Dojaang" : "Create Dojaang"}</h2>
          </div>
          <div className="modal-body">
            {loading && <div className="text-center">Loading...</div>}
            {error && <div className="text-red-600 text-center">{error}</div>}
            {!loading && !error && dojaang && (
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <div className="flex flex-col gap-1">
                  <label className="font-medium" htmlFor="name">Name:</label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
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
                    className="form-control"
                    value={dojaang.koreanNamePhonetic}
                    onChange={handleChange}
                    placeholder="Enter Korean name phonetic"
                    title="Korean Name Phonetic"
                  />
                </div>
                <div className="flex flex-col gap-1 w-full">
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
                <button
                  type="submit"
                  className="btn btn-primary fw-semibold"
                  disabled={saving}
                >
                  {saving ? (dojaangId ? "Saving..." : "Creating...") : (dojaangId ? "Save" : "Create")}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
