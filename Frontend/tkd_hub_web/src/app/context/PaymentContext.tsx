"use client";

// 1. External imports
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"; // Added useCallback
import toast from "react-hot-toast"; // Assuming you use toast for error messages

// 2. App/context/component imports
import { useApiRequest } from "../utils/api";

// --- Type Definitions ---

/**
 * Defines the structure of the data required to create a Mercado Pago preference.
 */
interface CreatePreferenceDTO {
    amount: number;
    description: string;
    payerEmail: string;
}

/**
 * Defines the expected response structure from the Mercado Pago create preference API.
 */
interface CreatePreferenceResponse {
    init_point?: string; // Production payment URL
    sandbox_init_point?: string; // Sandbox payment URL
    paymentUrl?: string; // A more generic payment URL, if returned by your API
    [key: string]: unknown; // Allows for any additional, unforeseen fields in the response
}

/**
 * Defines the shape of the PaymentContext, outlining the available function and states.
 */
interface PaymentContextType {
    createPreference: (dto: CreatePreferenceDTO) => Promise<CreatePreferenceResponse>;
    loading: boolean;
    error: string | null;
}

// --- Context Creation ---

/**
 * Initializes the PaymentContext.
 * It's initialized as `undefined` to allow the `usePayment` hook to check if it's used
 * outside of the `PaymentProvider`, preventing common errors.
 */
const PaymentContext = createContext<PaymentContextType | undefined>(undefined);

// --- Payment Provider Component ---

/**
 * The `PaymentProvider` component manages the state and logic for Mercado Pago preference creation.
 * It provides the `createPreference` function, `loading` state, and `error` state to its children.
 * @param children React nodes to be rendered within the provider's scope.
 */
export const PaymentProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // State to indicate if an API request is currently in progress.
    const [loading, setLoading] = useState(false);
    // State to store any error messages from API requests.
    const [error, setError] = useState<string | null>(null);

    // Custom hook for making API requests.
    const { apiRequest } = useApiRequest();

    // --- Functions (Memoized with useCallback) ---

    /**
     * Creates a Mercado Pago preference by making an API call to your backend.
     * This function is memoized using `useCallback` to ensure its referential stability,
     * which helps prevent unnecessary re-renders of components consuming this context.
     * @param dto The data transfer object containing the amount, description, and payer email.
     * @returns A Promise that resolves to the `CreatePreferenceResponse` object,
     * containing payment URLs.
     * @throws An error if the API request fails.
     */
    const createPreference = useCallback(async (dto: CreatePreferenceDTO): Promise<CreatePreferenceResponse> => {
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
            // If you use a toast notification for success, you can add it here
            // toast.success("Payment preference created!");
            return data;
        } catch (err) {
            const message = (err as Error)?.message || "Unknown error occurred while creating preference.";
            setError(message);
            console.error("[PaymentContext] Error creating preference:", err);
            toast.error(`Failed to create payment preference: ${message}`); // Display error using toast
            throw new Error(message); // Re-throw the error to be handled by the caller
        } finally {
            setLoading(false);
        }
    }, [apiRequest]); // Dependency array: apiRequest to ensure the function is stable.

    // --- Render ---

    /**
     * Renders the `PaymentContext.Provider`, making the `createPreference` function,
     * `loading` state, and `error` state available to all child components
     * wrapped by this provider.
     */
    return (
        <PaymentContext.Provider value={{ createPreference, loading, error }}>
            {children}
        </PaymentContext.Provider>
    );
};

// --- Custom Hook to Consume Context ---

/**
 * Custom hook to consume the PaymentContext.
 * Throws an error if used outside of a `PaymentProvider`, ensuring correct usage.
 * @returns The PaymentContextType value.
 * @throws Error if `usePayment` is not used within a `PaymentProvider`.
 */
export const usePayment = () => {
    const context = useContext(PaymentContext);
    if (context === undefined) {
        throw new Error("usePayment must be used within a PaymentProvider");
    }
    return context;
};