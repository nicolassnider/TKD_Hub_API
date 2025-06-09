import React from "react";
import { Rank } from "@/app/types/Rank";
import { useRankContext } from "@/app/context/RankContext";

type RanksSelectorProps = {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  ranks?: Rank[];
  filter?: "all" | "color" | "black";
};

const RanksSelector: React.FC<RanksSelectorProps> = ({
  value,
  onChange,
  disabled = false,
  ranks,
  filter = "all",
}) => {
  const { ranks: contextRanks, loading } = useRankContext();
  let displayRanks = ranks ?? contextRanks;

  if (filter === "black") {
    displayRanks = displayRanks.filter(r => typeof r.danLevel === "number" && r.danLevel > 0);
  } else if (filter === "color") {
    displayRanks = displayRanks.filter(r => !r.danLevel || r.danLevel === 0);
  }

  return (
    <select
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
  );
};

export default RanksSelector;
