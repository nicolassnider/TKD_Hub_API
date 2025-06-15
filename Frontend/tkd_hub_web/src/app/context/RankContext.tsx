"use client";
import React, { createContext, useContext, useState, ReactNode, useCallback } from "react";
import { Rank } from "@/app/types/Rank";
import { useApiRequest } from "../utils/api";
import toast from "react-hot-toast";

type RankContextType = {
  ranks: Rank[];
  loading: boolean;
  error: string | null;
  fetchRanks: () => Promise<void>;
  getRankById: (id: number) => Promise<Rank | null>;
};

const RankContext = createContext<RankContextType>({
  ranks: [],
  loading: false,
  error: null,
  fetchRanks: async () => { },
  getRankById: async () => null,
});

export const useRankContext = () => useContext(RankContext);

export const RankProvider = ({ children }: { children: ReactNode }) => {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { apiRequest } = useApiRequest();

  // --- GET /Ranks ---
  const fetchRanks = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<{ data: Rank[] }>("/Ranks");
      const ranksArray = Array.isArray(res.data) ? res.data : [];
      console.log("Setting ranks in context:", ranksArray); // Add this log
      setRanks(ranksArray);
    } catch (err) {
      setError("Failed to load ranks");
      setRanks([]);
      toast.error("Failed to load ranks" + (err instanceof Error ? `: ${err.message}` : ""));
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  // --- GET /Ranks/:id ---
  const getRankById = useCallback(async (id: number): Promise<Rank | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<Rank>(`/Ranks/${id}`);
      return res;
    } catch (err) {
      setError("Failed to load rank");
      toast.error("Failed to load rank" + (err instanceof Error ? `: ${err.message}` : ""));
      return null;
    } finally {
      setLoading(false);
    }
  }, [apiRequest]);

  return (
    <RankContext.Provider value={{ ranks, loading, error, fetchRanks, getRankById }}>
      {children}
    </RankContext.Provider>
  );
};
