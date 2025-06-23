'use client';

// 1. External imports
import React, { createContext, useContext, useState, useCallback, ReactNode } from "react"; // Added useCallback
import { useApiRequest } from "@/app/utils/api"; // Custom hook for API requests

// 2. Types
/**
 * Defines the structure for the request payload when creating a new dashboard.
 */
type DashboardRequest = {
    userRole: string;
    widgets: string[]; // Array of widget identifiers or configurations
};

/**
 * Defines the expected structure for the response when a dashboard is created.
 */
type DashboardResponse = {
    data: Record<string, unknown>; // A flexible object to hold dashboard data, e.g., dashboard ID, configurations
};

/**
 * Defines the shape of the DashboardContext, outlining the available function and states.
 */
type DashboardContextType = {
    loading: boolean;
    error: string | null;
    createDashboard: (req: DashboardRequest) => Promise<DashboardResponse | null>;
};

// 3. Create and export the context
/**
 * Initializes the DashboardContext with default values.
 * These defaults are used when a component consumes the context without a provider,
 * or as initial values before actual data is loaded.
 */
const DashboardContext = createContext<DashboardContextType>({
    loading: false,
    error: null,
    createDashboard: async () => null, // Default placeholder function
});

// 4. Custom hook for consuming the context
/**
 * Custom hook to consume the DashboardContext.
 * This hook allows any descendant component of `DashboardProvider` to easily access
 * the `loading` state, `error` messages, and the `createDashboard` function.
 * @returns The current value of the DashboardContext (DashboardContextType).
 */
export const useDashboards = () => useContext(DashboardContext);

// 5. Provider
/**
 * The `DashboardProvider` component is responsible for managing the state and logic
 * related to dashboard creation. It provides the `createDashboard` function,
 * `loading` state, and `error` state to its children.
 * @param children React nodes to be rendered within the provider's scope.
 */
export const DashboardProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    // 1. State hooks
    // State to indicate if an API request is currently in progress.
    const [loading, setLoading] = useState(false);
    // State to store any error messages from API requests.
    const [error, setError] = useState<string | null>(null);

    // 2. Context hooks
    // Custom hook for making API requests.
    const { apiRequest } = useApiRequest();

    // 3. Functions (memoized with useCallback)

    /**
     * Sends a request to the API to create a new dashboard.
     * This function is memoized using `useCallback` to ensure its referential stability,
     * which helps prevent unnecessary re-renders of components consuming this context
     * that might have `createDashboard` in their dependency arrays.
     * @param req The `DashboardRequest` object containing `userRole` and `widgets` data.
     * @returns A Promise that resolves to the `DashboardResponse` object if successful,
     * or `null` if an error occurs during the API call.
     */
    const createDashboard = useCallback(async (req: DashboardRequest): Promise<DashboardResponse | null> => {
        setLoading(true);
        setError(null);
        try {
            const data = await apiRequest<DashboardResponse>(
                "/Dashboards", // API endpoint for creating dashboards
                {
                    method: "POST", // HTTP method for creation
                    body: JSON.stringify(req), // Convert request payload to JSON string
                    headers: {
                        "Content-Type": "application/json", // Inform the server about the request body format
                        "Accept": "application/json" // Indicate expected response format
                        // If your apiRequest handles authorization globally, no need to add it here.
                        // Otherwise, you might add: "Authorization": `Bearer ${getToken()}`
                    }
                }
            );
            return data;
        } catch (err: unknown) {
            // Robust error handling to capture various error types
            if (err instanceof Error) {
                setError(err.message);
                console.error("[DashboardContext] Error creating dashboard:", err.message);
            } else if (typeof err === "string") {
                setError(err);
                console.error("[DashboardContext] Error creating dashboard:", err);
            } else {
                setError("An unknown error occurred while creating the dashboard.");
                console.error("[DashboardContext] Unknown error creating dashboard:", err);
            }
            return null;
        } finally {
            setLoading(false); // Ensure loading state is reset regardless of success or failure
        }
    }, [apiRequest]); // Dependency array: `apiRequest` to ensure the function is stable.

    // 4. Render
    /**
     * Renders the `DashboardContext.Provider`, making the `createDashboard` function,
     * `loading` state, and `error` state available to all child components
     * wrapped by this provider.
     */
    return (
        <DashboardContext.Provider value={{ createDashboard, loading, error }}>
            {children}
        </DashboardContext.Provider>
    );
};