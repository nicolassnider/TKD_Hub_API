"use client";
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";

type Rank = {
  id: number;
  name: string;
};

type RanksSelectorProps = {
  value: string | number | null;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  disabled?: boolean;
  baseUrl?: string;
};

const defaultBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL || "https://localhost:7046/api";

export default function RanksSelector({
  value,
  onChange,
  disabled,
  baseUrl = defaultBaseUrl,
}: RanksSelectorProps) {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loading, setLoading] = useState(true);
  const { getToken } = useAuth();

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

  return (
    <select
      className="form-select"
      value={value ?? ""}
      onChange={onChange}
      disabled={disabled || loading}
      name="currentRankId"
    >
      <option value="">Select Rank</option>
      {loading ? (
        <option disabled>Loading ranks...</option>
      ) : (
        ranks.map((rank) => (
          <option key={rank.id} value={rank.id}>
            {rank.name}
          </option>
        ))
      )}
    </select>
  );
}
