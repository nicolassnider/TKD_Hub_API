import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  CreatePreferenceDTO,
  CreatePreferenceResponse,
} from "../lib/paymentTypes";
import { fetchJson, ApiError } from "../lib/api";

interface PaymentContextType {
  createPreference: (
    dto: CreatePreferenceDTO,
  ) => Promise<CreatePreferenceResponse>;
  loading: boolean;
  error: string | null;
}

const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

export const PaymentProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const apiRequest = useCallback(
    async <T,>(url: string, opts?: RequestInit): Promise<T> => {
      const base =
        typeof window !== "undefined" && window.location
          ? `${window.location.origin}`
          : "";
      const full = url.startsWith("http")
        ? url
        : `${base}${url.startsWith("/") ? url : `/${url}`}`;
      return fetchJson<T>(full, opts);
    },
    [],
  );

  const createPreference = useCallback(
    async (dto: CreatePreferenceDTO): Promise<CreatePreferenceResponse> => {
      setLoading(true);
      setError(null);
      try {
        const data = await apiRequest<CreatePreferenceResponse>(
          "/MercadoPago/create-preference",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(dto),
          },
        );
        return data;
      } catch (err) {
        const message =
          (err as Error)?.message ||
          "Unknown error occurred while creating preference.";
        setError(message);
        console.error("[PaymentContext] Error creating preference:", err);
        throw err instanceof ApiError ? err : new Error(message);
      } finally {
        setLoading(false);
      }
    },
    [apiRequest],
  );

  return (
    <PaymentContext.Provider value={{ createPreference, loading, error }}>
      {children}
    </PaymentContext.Provider>
  );
};

export const usePayment = () => {
  const ctx = useContext(PaymentContext);
  if (!ctx) throw new Error("usePayment must be used within a PaymentProvider");
  return ctx;
};
