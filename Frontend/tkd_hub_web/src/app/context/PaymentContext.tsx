"use client";
import React, { createContext, useContext, useState } from "react";
import { useApiRequest } from "../utils/api";

interface CreatePreferenceDTO {
  amount: number;
  description: string;
  payerEmail: string;
}

interface CreatePreferenceResponse {
  init_point?: string;
  sandbox_init_point?: string;
  paymentUrl?: string;
  [key: string]: unknown; // For any additional fields
}

interface PaymentContextType {
  createPreference: (dto: CreatePreferenceDTO) => Promise<CreatePreferenceResponse>;
  loading: boolean;
  error: string | null;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { apiRequest } = useApiRequest();

  const createPreference = async (dto: CreatePreferenceDTO): Promise<CreatePreferenceResponse> => {
    setLoading(true);
    setError(null);

    try {
      const data: CreatePreferenceResponse = await apiRequest("/MercadoPago/create-preference", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dto),
      });
      return data;
    } catch (err) {
      const message = (err as Error)?.message || "Unknown error";
      setError(message);
      console.error(err);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PaymentContext.Provider value={{ createPreference, loading, error }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error("usePayment must be used within a PaymentProvider");
  }
  return context;
};
