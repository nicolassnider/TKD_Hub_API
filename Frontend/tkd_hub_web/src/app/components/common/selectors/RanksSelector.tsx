import React, { useEffect } from "react";
import { Rank } from "@/app/types/Rank";
import { useRankContext } from "@/app/context/RankContext";

type RanksSelectorProps = {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  ranks?: Rank[];
  filter?: "all" | "color" | "black";
  className?: string; // Allow custom className
  label?: string;
};

const RanksSelector: React.FC<RanksSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  ranks,
  filter = "all",
  className,
  label, // <-- Destructure label
}) => {
  const { ranks: contextRanks, loading, fetchRanks } = useRankContext();

  useEffect(() => {
    if ((!ranks || ranks.length === 0) && contextRanks.length === 0) {
      fetchRanks();
    }
    // Only run on mount!
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    console.log("contextRanks in selector:", contextRanks);
  }, [contextRanks]);

  let displayRanks = ranks ?? contextRanks;

  if (filter === "black") {
    displayRanks = displayRanks.filter(r => typeof r.danLevel === "number" && r.danLevel > 0);
  } else if (filter === "color") {
    displayRanks = displayRanks.filter(r => !r.danLevel || r.danLevel === 0);
  }

  return (
    <div>
      {label && (
        <label className="block mb-1 font-medium" htmlFor="ranks-selector">
          {label}
        </label>
      )}
      <select
        id="ranks-selector"
        className={
          className
            ? className
            : "form-input px-3 py-2 border border-gray-300 rounded w-full"
        }
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
        ) : displayRanks.length === 0 ? (
          <option disabled>No ranks available</option>
        ) : (
          displayRanks.map((rank) => (
            <option key={rank.id} value={rank.id}>
              {rank.name}
            </option>
          ))
        )}
      </select>
    </div>
  );
};
export default RanksSelector;
