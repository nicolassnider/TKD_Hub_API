import { useState } from "react";

type Coach = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
};

type CoachSelectorProps = {
  baseUrl: string;
  token: string;
  value: { id: number | null; name: string | null };
  onSelect: (coach: Coach) => void;
};

export default function CoachSelector({ baseUrl, token, value, onSelect }: CoachSelectorProps) {
  const [showCoachList, setShowCoachList] = useState(false);
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleShowCoaches() {
    setLoading(true);
    setError(null);
    setShowCoachList(true);
    try {
      const res = await fetch(`${baseUrl}/Coaches`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (!res.ok) throw new Error("Failed to fetch coaches");
      const data = await res.json();
      setCoaches(data.data || []);
    } catch (err: any) {
      setError(err.message || "Failed to fetch coaches");
    } finally {
      setLoading(false);
    }
  }

  function handleSelectCoach(coach: Coach) {
    onSelect(coach);
    setShowCoachList(false);
  }

  return (
    <div className="flex w-full relative">
      <input
        id="coachName"
        type="text"
        className="border rounded-l px-3 py-2 flex-1"
        placeholder="Enter coach name"
        title="Coach Name"
        value={value.name || ""}
        disabled
      />
      <button
        type="button"
        className="bg-neutral-800 text-white px-3 py-2 rounded-r"
        title="Assign/View Coach"
        onClick={handleShowCoaches}
      >
        <i className="bi bi-clipboard"></i>
      </button>
      {showCoachList && (
        <div className="absolute left-0 right-0 top-12 mx-auto bg-white dark:bg-neutral-800 border rounded shadow-lg z-50 max-h-60 overflow-y-auto w-full">
          <div className="flex justify-between items-center px-4 py-2 border-b">
            <span className="font-semibold">Select Coach</span>
            <button className="text-lg" onClick={() => setShowCoachList(false)} type="button">×</button>
          </div>
          {loading && <div className="p-4 text-center">Loading...</div>}
          {error && <div className="p-4 text-red-600 text-center">{error}</div>}
          {!loading && !error && (
            <ul>
              {coaches.length === 0 && (
                <li className="p-4 text-center text-gray-500">No coaches found.</li>
              )}
              {coaches.map((coach) => (
                <li
                  key={coach.id}
                  className="px-4 py-2 hover:bg-blue-100 dark:hover:bg-blue-900 cursor-pointer"
                  onClick={() => handleSelectCoach(coach)}
                >
                  {coach.firstName} {coach.lastName}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
