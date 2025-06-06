"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

type Rank = {
  id: number;
  name: string;
  danLevel?: number | null;
};

type RanksSelectorProps = {
  value: string | number | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  baseUrl?: string;
  filter?: "all" | "black" | "color"; // <-- Add filter prop
};

const defaultBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7046/api";

export default function RanksSelector({
  value,
  onChange,
  disabled,
  baseUrl = defaultBaseUrl,
  filter: externalFilter, // <-- Accept filter prop
}: RanksSelectorProps) {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loading, setLoading] = useState(true);
  const [internalFilter, setInternalFilter] = useState<"all" | "black" | "color">("all");
  const { getToken } = useAuth();

  // Use external filter if provided, otherwise use internal state
  const filter = externalFilter ?? internalFilter;

  useEffect(() => {
    const token = getToken();
    fetch(`${baseUrl}/Ranks`, {
      headers: {
        Authorization: token ? `Bearer ${token}` : "",
      },
    })
      .then((res) => res.json())
      .then((data) => {
        const arr = Array.isArray(data) ? data : data.data || [];
        setRanks(arr);
      })
      .catch(() => setRanks([]))
      .finally(() => setLoading(false));
  }, [baseUrl, getToken]);

  let filteredRanks = ranks;
  if (filter === "black") {
    filteredRanks = ranks.filter(
      (rank) => typeof rank.danLevel === "number" && rank.danLevel > 0
    );
  } else if (filter === "color") {
    filteredRanks = ranks.filter(
      (rank) => !rank.danLevel || rank.danLevel === 0
    );
  }

  return (
    <div>
      {/* Only show filter buttons if not using external filter */}
      {!externalFilter && (
        <div className="flex gap-2 mb-2">
          <button
            type="button"
            className={`px-2 py-1 rounded text-xs font-semibold border ${filter === "all" ? "bg-blue-600 text-white" : "bg-white text-blue-600 border-blue-600"} transition`}
            onClick={() => setInternalFilter("all")}
          >
            All Belts
          </button>
          <button
            type="button"
            className={`px-2 py-1 rounded text-xs font-semibold border ${filter === "color" ? "bg-yellow-500 text-white border-yellow-500" : "bg-white text-yellow-600 border-yellow-500"} transition`}
            onClick={() => setInternalFilter("color")}
          >
            Color Belts
          </button>
          <button
            type="button"
            className={`px-2 py-1 rounded text-xs font-semibold border ${filter === "black" ? "bg-black text-white border-black" : "bg-white text-black border-black"} transition`}
            onClick={() => setInternalFilter("black")}
          >
            Black Belts
          </button>
        </div>
      )}
      <label htmlFor="currentRankId" className="font-medium">
        Rank
      </label>
      <select
        id="currentRankId"
        className="form-select"
        value={value ?? ""}
        onChange={onChange}
        disabled={disabled || loading}
        name="currentRankId"
        title="Rank"
        aria-label="Rank"
      >
        <option value="">Select Rank</option>
        {loading ? (
          <option disabled>Loading ranks...</option>
        ) : (
          filteredRanks.map((rank) => (
            <option key={rank.id} value={rank.id}>
              {rank.name}
            </option>
          ))
        )}
      </select>
    </div>
  );
}
