import { useEffect } from "react";
import { useCoaches } from "@/app/context/CoachContext";
import { Coach } from "@/app/types/Coach"; // Adjust import if needed

type CoachSelectorProps = {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  label?: string;
  coaches?: Coach[]; // <-- Add this line
};

export default function CoachSelector({
  value,
  onChange,
  disabled,
  label = "Coach (optional)",
  coaches, // <-- Destructure coaches
}: CoachSelectorProps) {
  const context = useCoaches();
  const contextCoaches = context.coaches;
  const fetchCoaches = context.fetchCoaches;
  const loading = context.loading;

  // Only fetch if no coaches are provided as prop
  useEffect(() => {
    if (!coaches && (!contextCoaches || contextCoaches.length === 0)) {
      fetchCoaches();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coaches]);

  const coachList = coaches ?? contextCoaches;

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
        {loading && !coaches ? (
          <option disabled>Loading coaches...</option>
        ) : coachList.length === 0 ? (
          <option disabled>No coaches available</option>
        ) : (
          coachList.map((c) => (
            <option key={c.id} value={c.id}>
              {c.firstName && c.lastName
                ? `${c.firstName} ${c.lastName}`
                : c.firstName || "Unnamed"}
            </option>
          ))
        )}
      </select>
    </div>
  );
}
