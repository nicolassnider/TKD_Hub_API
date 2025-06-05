import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { apiRequest } from "@/app/utils/api";

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
    apiRequest<any>(`${baseUrl}/Coaches`, {}, getToken)
      .then((data) => {
        let arr: { id: number; name: string }[] = [];
        if (Array.isArray(data)) {
          arr = data.map((c: any) => ({
            id: c.id,
            name: [c.firstName, c.lastName].filter(Boolean).join(" "),
          }));
        } else if (
          typeof data === "object" &&
          data !== null &&
          "data" in data &&
          Array.isArray((data as { data?: unknown }).data)
        ) {
          arr = (data as { data: any[] }).data.map((c) => ({
            id: c.id,
            name: [c.firstName, c.lastName].filter(Boolean).join(" "),
          }));
        }
        setCoaches(arr);
      })
      .catch(() => setCoaches([]))
      .finally(() => setLoading(false));
  }, [baseUrl, getToken]);

  return (
    <div className="mb-4">
      <label
        className="block font-medium mb-1 text-gray-700"
        htmlFor="coachId"
      >
        Coach (optional)
      </label>
      <select
        id="coachId"
        name="coachId"
        className="w-full rounded border border-gray-300 bg-white text-gray-900 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
        value={value}
        onChange={onChange}
        disabled={disabled || loading}
        aria-label="Coach (optional)"
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
