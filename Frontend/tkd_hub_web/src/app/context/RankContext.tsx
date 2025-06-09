"use client";
import React, { createContext, useContext, useEffect, useState, ReactNode } from "react";
import { Rank } from "@/app/types/Rank";
import { useApiConfig } from "@/app/context/ApiConfigContext";
import { useAuth } from "@/app/context/AuthContext";
import { apiRequest } from "../utils/api";
import toast from "react-hot-toast";


type RankContextType = {
  ranks: Rank[];
  loading: boolean;
  error: string | null;
  refresh: () => void;
};

const RankContext = createContext<RankContextType>({
  ranks: [],
  loading: false,
  error: null,
  refresh: () => { },
});

export const useRankContext = () => useContext(RankContext);

export const RankProvider = ({ children }: { children: ReactNode }) => {
  const [ranks, setRanks] = useState<Rank[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { baseUrl } = useApiConfig();
  const { getToken } = useAuth();

  const fetchRanks = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<{ data: { data: Rank[] } }>(`${baseUrl}/Ranks`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      // Handles both { data: { data: Rank[] } } and Rank[] directly
      if (Array.isArray(res)) {
        setRanks(res as unknown as Rank[]);
      } else if (res?.data?.data) {
        setRanks(res.data.data);
      } else {
        setRanks([]);
      }
    } catch (err) {
      setError("Failed to load ranks");
      setRanks([]);
      // Show error toast
      toast?.error?.("Failed to load ranks" + (err instanceof Error ? `: ${err.message}` : ""));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRanks();
    // eslint-disable-next-line
  }, [baseUrl, getToken]);  

  return (
    <RankContext.Provider value={{ ranks, loading, error, refresh: fetchRanks }}>
      {children}
    </RankContext.Provider>
  );
};
