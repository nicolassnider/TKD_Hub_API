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
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.data || [];
        setCoaches(
          arr.map((c: any) => ({
            id: c.id,
            name: `${c.firstName} ${c.lastName}`,
          }))
        );
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
