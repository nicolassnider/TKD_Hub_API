"use client";
import React, { createContext, useContext, useState, ReactNode } from "react";
import { useApiRequest } from "../utils/api";
import { useAuth } from "@/app/context/AuthContext";
import toast from "react-hot-toast";
import { Promotion } from "@/app/types/Promotion";

type PromotionContextType = {
  promotions: Promotion[];
  loading: boolean;
  error: string | null;
  fetchPromotions: () => Promise<void>;
  getPromotionById: (id: number) => Promise<Promotion | null>;
  createPromotion: (data: Omit<Promotion, "id" | "studentName" | "rankName">) => Promise<void>;
  updatePromotion: (id: number, data: Partial<Promotion>) => Promise<void>;
  deletePromotion: (id: number) => Promise<void>;
};

const PromotionContext = createContext<PromotionContextType>({
  promotions: [],
  loading: false,
  error: null,
  fetchPromotions: async () => { },
  getPromotionById: async () => null,
  createPromotion: async () => { },
  updatePromotion: async () => { },
  deletePromotion: async () => { },
});

export const usePromotions = () => useContext(PromotionContext);

export const PromotionProvider = ({ children }: { children: ReactNode }) => {
  const [promotions, setPromotions] = useState<Promotion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { getToken } = useAuth();
  const { apiRequest } = useApiRequest();

  const fetchPromotions = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<Promotion[]>("/Promotions", {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setPromotions(res);
    } catch {
      setError("Failed to load promotions");
      setPromotions([]);
      toast.error("Failed to load promotions");
    } finally {
      setLoading(false);
    }
  };

  const getPromotionById = async (id: number): Promise<Promotion | null> => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiRequest<Promotion>(`/Promotions/${id}`, {
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      setLoading(false);
      return res;
    } catch {
      setError("Failed to load promotion");
      setLoading(false);
      toast.error("Failed to load promotion");
      return null;
    }
  };

  const createPromotion = async (data: Omit<Promotion, "id" | "studentName" | "rankName">) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest("/Promotions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      toast.success("Promotion created");
      await fetchPromotions();
    } catch {
      setError("Failed to create promotion");
      toast.error("Failed to create promotion");
    } finally {
      setLoading(false);
    }
  };

  const updatePromotion = async (id: number, data: Partial<Promotion>) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest(`/Promotions/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${getToken()}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      toast.success("Promotion updated");
      await fetchPromotions();
    } catch {
      setError("Failed to update promotion");
      toast.error("Failed to update promotion");
    } finally {
      setLoading(false);
    }
  };

  const deletePromotion = async (id: number) => {
    setLoading(true);
    setError(null);
    try {
      await apiRequest(`/Promotions/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${getToken()}` },
      });
      toast.success("Promotion deleted");
      await fetchPromotions();
    } catch {
      setError("Failed to delete promotion");
      toast.error("Failed to delete promotion");
    } finally {
      setLoading(false);
    }
  };

  return (
    <PromotionContext.Provider
      value={{
        promotions,
        loading,
        error,
        fetchPromotions,
        getPromotionById,
        createPromotion,
        updatePromotion,
        deletePromotion,
      }}
    >
      {children}
    </PromotionContext.Provider>
  );
};
