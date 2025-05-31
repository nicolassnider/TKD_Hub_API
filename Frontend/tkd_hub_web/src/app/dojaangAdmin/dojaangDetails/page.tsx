"use client";
import { useEffect, useState } from "react";


type EditDojaangProps = {
  dojaangId: number;
  onClose: () => void;
};


type Dojaang = {
  id: number;
  name: string;
  address: string;
  phoneNumber: string;
  email: string;
  koreanName: string;
  koreanNamePhonetic: string;
  coachId: number | null;
  coachName: string | null;
};


const baseUrl = "https://localhost:7046/api";


export default function EditDojaang({ dojaangId, onClose }: EditDojaangProps) {
  const [dojaang, setDojaang] = useState<Dojaang | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);


  useEffect(() => {
    const token = localStorage.getItem("token");
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
  }, [dojaangId]);


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


    const token = localStorage.getItem("token");
    try {
      // Construct payload as required by API
      const payload = {
        id: dojaang.id,
        name: dojaang.name,
        address: dojaang.address,
        location: dojaang.address, // You may want to split address/location if needed
        phoneNumber: dojaang.phoneNumber,
        email: dojaang.email,
        koreanName: dojaang.koreanName,
        koreanNamePhonetic: dojaang.koreanNamePhonetic,
        coachId: dojaang.coachId,
      };


      const res = await fetch(`${baseUrl}/Dojaang/${dojaang.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error("Failed to update dojaang");
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


  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-600 text-center">{error}</div>;
  if (!dojaang) return null;


  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white dark:bg-neutral-900 rounded shadow p-6 w-full max-w-md relative">
        <button
          className="absolute top-2 right-2 text-lg font-bold"
          onClick={onClose}
        >
          ×
        </button>
        <h2 className="text-xl font-bold mb-4">Edit Dojaang</h2>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="name">Name:</label>
            <input
              id="name"
              name="name"
              type="text"
              className="border rounded px-3 py-2"
              value={dojaang.name}
              onChange={handleChange}
              placeholder="Enter dojaang name"
              title="Dojaang Name"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="address">Address:</label>
            <input
              id="address"
              name="address"
              type="text"
              className="border rounded px-3 py-2"
              value={dojaang.address}
              onChange={handleChange}
              placeholder="Enter address"
              title="Address"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="phoneNumber">Phone Number:</label>
            <input
              id="phoneNumber"
              name="phoneNumber"
              type="text"
              className="border rounded px-3 py-2"
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
              className="border rounded px-3 py-2"
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
              className="border rounded px-3 py-2"
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
              className="border rounded px-3 py-2"
              value={dojaang.koreanNamePhonetic}
              onChange={handleChange}
              placeholder="Enter Korean name phonetic"
              title="Korean Name Phonetic"
            />
          </div>
          <div className="flex flex-col gap-1">
            <label className="font-medium" htmlFor="coachName">Coach Name:</label>
            <div className="flex items-center gap-2">
              <input
                id="coachName"
                name="coachName"
                type="text"
                className="border rounded px-3 py-2"
                value={dojaang.coachName ?? ""}
                onChange={handleChange}
                placeholder="Enter coach name"
                title="Coach Name"
                disabled
              />
              <button
                type="button"
                className="p-2 rounded bg-gray-200 hover:bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600"
                title="Assign/View Coach"
                onClick={() => alert("Coach details/assign feature coming soon!")}
              >
                <i className="bi bi-file-earmark-text"></i>
              </button>
            </div>
          </div>
          <button
            type="submit"
            className="bg-blue-600 text-white rounded px-4 py-2 font-semibold hover:bg-blue-700 transition-colors"
            disabled={saving}
          >
            {saving ? "Saving..." : "Save"}
          </button>
          {error && <div className="text-red-600 text-center">{error}</div>}
        </form>
      </div>
    </div>
  );
}
