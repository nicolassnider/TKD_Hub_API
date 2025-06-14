import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApiRequest } from "../../utils/api";

type Coach = { id: number; name: string; firstName?: string; lastName?: string };

type ApiCoach = {
  id: number;
  firstName?: string;
  lastName?: string;
};

type CoachSelectorProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  label?: string;
};

export default function CoachSelector({ value, onChange, disabled, label = "Coach (optional)" }: CoachSelectorProps) {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();
  const { apiRequest } = useApiRequest();

  useEffect(() => {
    setLoading(true);
    apiRequest<ApiCoach[]>("/Coaches", {
      headers: { Authorization: `Bearer ${getToken()}` },
    })
      .then((data) => {
        const arr: Coach[] = Array.isArray(data)
          ? data.map((c) => ({
              id: c.id,
              name: [c.firstName, c.lastName].filter(Boolean).join(" "),
            }))
          : [];
        setCoaches(arr);
      })
      .catch(() => setCoaches([]))
      .finally(() => setLoading(false));
  }, [getToken, apiRequest]);

  return (
    <div className="mb-4">
      <label
        className="block font-medium mb-1 text-gray-700"
        htmlFor="coachId"
      >
        {label}
      </label>
      <select
        id="coachId"
        name="coachId"
        className="w-full rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        value={value}
        onChange={onChange}
        disabled={disabled || loading}
        aria-label={label}
      >
        <option value="">Select Coach</option>
        {loading ? (
          <option disabled>Loading coaches...</option>
        ) : (
          coaches.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))
        )}
      </select>
    </div>
  );
}
