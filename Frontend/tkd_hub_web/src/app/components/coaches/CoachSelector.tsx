import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

type Coach = { id: number; name: string };

type CoachSelectorProps = {
  baseUrl: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
};

export default function CoachSelector({ baseUrl, value, onChange, disabled }: CoachSelectorProps) {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

  useEffect(() => {
    const token = getToken();
    fetch(`${baseUrl}/Coaches`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => res.json())
      .then((data: unknown) => {
        let arr: { id: number; name: string }[] = [];
        if (Array.isArray(data)) arr = data;
        else if (
          typeof data === "object" &&
          data !== null &&
          "data" in data &&
          Array.isArray((data as { data?: unknown }).data)
        ) {
          arr = (data as { data: { id: number; name: string }[] }).data;
        }
        setCoaches(arr);
      })
      .catch(() => setCoaches([]))
      .finally(() => setLoading(false));
  }, [baseUrl, getToken]);

  return (
    <>
      <label className="form-label">Coach (optional)</label>
      <select
        className="form-select mb-2"
        name="coachId"
        value={value}
        onChange={onChange}
        disabled={disabled || loading}
      >
        <option value="">Select Coach</option>
        {loading ? (
          <option disabled>Loading coaches...</option>
        ) : (
          coaches.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))
        )}
      </select>
    </>
  );
}
