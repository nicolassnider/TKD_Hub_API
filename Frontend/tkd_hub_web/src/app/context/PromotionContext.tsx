'use client';

// 1. External imports
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useRef, // Import useRef for creating mutable references for caches
} from 'react';
import toast from 'react-hot-toast';

// 2. App/context/component imports
import { useApiRequest } from '../utils/api';
import { useAuth } from '@/app/context/AuthContext';
import { Promotion } from '@/app/types/Promotion';
import { CreatePromotionDto } from '../types/CreatePromotionDto';

// --- Type Definitions ---

/**
 * Defines the shape of the PromotionContext, outlining available data and functions.
 */
type PromotionContextType = {
    promotions: Promotion[];
    loading: boolean;
    error: string | null;
    fetchPromotions: () => Promise<void>;
    getPromotionById: (id: number) => Promise<Promotion | null>;
    createPromotion: (data: CreatePromotionDto) => Promise<void>;
    updatePromotion: (id: number, data: Partial<Promotion>) => Promise<void>;
    deletePromotion: (id: number) => Promise<void>;
    fetchPromotionsByStudentId: (studentId: number) => Promise<Promotion[]>;
};

// --- Context Creation ---

/**
 * Initializes the PromotionContext with default empty values.
 * These defaults are used when a component consumes the context without a provider,
 * or as initial values before actual data is loaded.
 */
const PromotionContext = createContext<PromotionContextType>({
    promotions: [],
    loading: false,
    error: null,
    fetchPromotions: async () => { },
    getPromotionById: async () => null,
    createPromotion: async () => { },
    updatePromotion: async () => { },
    deletePromotion: async () => { },
    fetchPromotionsByStudentId: async () => [],
});

// --- Context Hooks ---

/**
 * Custom hook to consume the PromotionContext.
 * This hook allows any descendant component of `PromotionProvider` to easily access
 * the `promotions` data, `loading` state, `error` messages, and various promotion-related functions.
 * @returns The current value of the PromotionContext (PromotionContextType).
 */
export const usePromotions = () => useContext(PromotionContext);

// --- Promotion Provider Component ---

/**
 * The `PromotionProvider` component is responsible for managing the state of promotions
 * (fetching, creating, updating, deleting) and providing promotion-related functionalities to its children.
 * It uses memoization techniques to optimize performance by caching API responses.
 * @param children React nodes to be rendered within the provider's scope.
 */
export const PromotionProvider = ({ children }: { children: ReactNode }) => {
    // 1. Context hooks
    // Custom hook to get the authentication token.
    const { getToken } = useAuth();
    // Custom hook for making API requests.
    const { apiRequest } = useApiRequest();

    // 2. State Hooks
    // State to hold the list of all promotions.
    const [promotions, setPromotions] = useState<Promotion[]>([]);
    // State to indicate if an API request is currently in progress.
    const [loading, setLoading] = useState(false);
    // State to store any error messages from API requests.
    const [error, setError] = useState<string | null>(null);

    // Caches for memoizing API responses to avoid redundant calls.
    // `promotionByIdCache`: Stores individual promotion objects fetched by their ID.
    const promotionByIdCache = useRef<Map<number, Promotion>>(new Map());
    // `promotionsByStudentIdCache`: Stores arrays of promotion objects fetched by student ID.
    const promotionsByStudentIdCache = useRef<Map<number, Promotion[]>>(
        new Map()
    );

    // 3. Effects
    // (No specific useEffects are typically needed here for memoization itself,
    // as memoization is handled within the useCallback functions and useRef caches.)

    // 4. Functions (memoized with useCallback)

    /**
     * Fetches all promotions from the API.
     * Updates the `promotions` state and populates the `promotionByIdCache` with fetched promotions.
     * This function is memoized using `useCallback` to prevent unnecessary re-creations.
     */
    const fetchPromotions = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiRequest<{ data: Promotion[] }>('/Promotions', {
                headers: { Authorization: `Bearer ${getToken()}` },
            });
            const promotionsArray = Array.isArray(res.data) ? res.data : [];
            setPromotions(promotionsArray);

            // Populate promotionByIdCache for quick lookup of individual promotions.
            promotionsArray.forEach(promotion => {
                if (promotion.id != null) {
                    promotionByIdCache.current.set(promotion.id, promotion);
                }
            });
        } catch (err) {
            // Handle and display error message using react-hot-toast.
            setError('Failed to load promotions');
            setPromotions([]);
            toast.error(
                'Failed to load promotions' +
                (err instanceof Error ? `: ${err.message}` : '')
            );
        } finally {
            setLoading(false);
        }
    }, [apiRequest, getToken]); // Dependencies: `apiRequest` and `getToken` to ensure stability.

    /**
     * Fetches a single promotion by its ID.
     * Checks the `promotionByIdCache` first; if found, it returns the cached data immediately.
     * Otherwise, it makes an API request to fetch the promotion and then caches the result.
     * This function is memoized using `useCallback` for performance optimization.
     * @param id The unique identifier of the promotion to fetch.
     * @returns A Promise that resolves to the `Promotion` object if found, or `null` if not found or an error occurs.
     */
    const getPromotionById = useCallback(
        async (id: number): Promise<Promotion | null> => {
            // Check if the promotion is already in the cache.
            if (promotionByIdCache.current.has(id)) {

                return promotionByIdCache.current.get(id) || null;
            }

            setLoading(true);
            setError(null);

            try {
                const res = await apiRequest<Promotion>(`/Promotions/${id}`, {
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                // If the API call is successful, store the fetched promotion in the cache.
                if (res) {
                    promotionByIdCache.current.set(id, res);
                }
                return res;
            } catch (err) {
                // Handle and display error message.
                setError('Failed to load promotion');
                toast.error(
                    'Failed to load promotion' +
                    (err instanceof Error ? `: ${err.message}` : '')
                );
                return null;
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken] // Dependencies: `apiRequest` and `getToken` for function stability.
    );

    /**
     * Fetches a list of promotions for a specific student ID.
     * Checks the `promotionsByStudentIdCache` first; if found, it returns the cached data immediately.
     * Otherwise, it makes an API request to fetch the promotions and then caches the result.
     * This function is memoized using `useCallback` for performance optimization.
     * @param studentId The unique identifier of the student for whom to fetch promotions.
     * @returns A Promise that resolves to an array of `Promotion` objects, or an empty array if not found or an error occurs.
     */
    const fetchPromotionsByStudentId = useCallback(
        async (studentId: number): Promise<Promotion[]> => {
            // Check if the promotions for this student are already in the cache.
            if (promotionsByStudentIdCache.current.has(studentId)) {

                return promotionsByStudentIdCache.current.get(studentId) || [];
            }

            setLoading(true);
            setError(null);

            try {
                const res = await apiRequest<{ data: Promotion[] }>(
                    `/Promotions/student/${studentId}`,
                    {
                        headers: { Authorization: `Bearer ${getToken()}` },
                    }
                );
                const data = Array.isArray(res.data) ? res.data : [];
                // It's usually best practice for this specific function to *not* set the global `promotions` state
                // unless it's intended to override the main list. For memoization, we just cache and return.
                // setPromotions(data); // Consider if this is truly desired here

                promotionsByStudentIdCache.current.set(studentId, data); // Store in cache.
                return data;
            } catch (err) {
                setError('Failed to load promotions for student');
                toast.error(
                    'Failed to load promotions for student' +
                    (err instanceof Error ? `: ${err.message}` : '')
                );
                return [];
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken] // Dependencies: `apiRequest` and `getToken` for function stability.
    );

    /**
     * Creates a new promotion in the database.
     * After successful creation, it invalidates relevant caches and triggers a refetch of all promotions
     * to update the local state and ensure data consistency.
     * This function is memoized using `useCallback`.
     * @param data The data transfer object containing details for the new promotion.
     */
    const createPromotion = useCallback(
        async (data: CreatePromotionDto) => {
            setLoading(true);
            setError(null);
            try {
                // Invalidate relevant caches as data has changed.
                promotionByIdCache.current.clear(); // Clear individual promotion cache
                promotionsByStudentIdCache.current.clear(); // Clear all student-specific promotion caches

                await apiRequest('/Promotions', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                toast.success('Promotion created successfully!');
                await fetchPromotions(); // Re-fetch all promotions to ensure state and caches are fresh.
            } catch (err) {
                setError('Failed to create promotion');
                toast.error(
                    'Failed to create promotion' +
                    (err instanceof Error ? `: ${err.message}` : '')
                );
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken, fetchPromotions] // Dependencies: `apiRequest`, `getToken`, and `fetchPromotions`.
    );

    /**
     * Updates an existing promotion's data.
     * After successful update, it invalidates relevant caches and triggers a refetch of all promotions
     * to update the local state and ensure data consistency.
     * This function is memoized using `useCallback`.
     * @param id The ID of the promotion to update.
     * @param data The partial promotion data to apply updates.
     */
    const updatePromotion = useCallback(
        async (id: number, data: Partial<Promotion>) => {
            setLoading(true);
            setError(null);
            try {
                // Invalidate relevant caches as data has changed.
                promotionByIdCache.current.delete(id); // Remove specific promotion from cache
                promotionsByStudentIdCache.current.clear(); // Clear all student-specific promotion caches (could be optimized)

                await apiRequest(`/Promotions/${id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                toast.success('Promotion updated successfully!');
                await fetchPromotions(); // Re-fetch all promotions to ensure state and caches are fresh.
            } catch (err) {
                setError('Failed to update promotion');
                toast.error(
                    'Failed to update promotion' +
                    (err instanceof Error ? `: ${err.message}` : '')
                );
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken, fetchPromotions] // Dependencies: `apiRequest`, `getToken`, and `fetchPromotions`.
    );

    /**
     * Deletes a promotion from the database.
     * After successful deletion, it invalidates relevant caches and triggers a refetch of all promotions
     * to update the local state and ensure data consistency.
     * This function is memoized using `useCallback`.
     * @param id The ID of the promotion to delete.
     */
    const deletePromotion = useCallback(
        async (id: number) => {
            setLoading(true);
            setError(null);
            try {
                // Invalidate relevant caches as data has changed.
                promotionByIdCache.current.delete(id); // Remove specific promotion from cache
                promotionsByStudentIdCache.current.clear(); // Clear all student-specific promotion caches

                await apiRequest(`/Promotions/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${getToken()}` },
                });
                toast.success('Promotion deleted successfully!');
                await fetchPromotions(); // Re-fetch all promotions to ensure state and caches are fresh.
            } catch (err) {
                setError('Failed to delete promotion');
                toast.error(
                    'Failed to delete promotion' +
                    (err instanceof Error ? `: ${err.message}` : '')
                );
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken, fetchPromotions] // Dependencies: `apiRequest`, `getToken`, and `fetchPromotions`.
    );

    // 5. Render
    /**
     * Renders the `PromotionContext.Provider`, making the `promotions` data, `loading` state, `error` messages,
     * and promotion-related functions (`fetchPromotions`, `getPromotionById`, etc.) available to all child components
     * wrapped by this provider.
     */
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
                fetchPromotionsByStudentId,
            }}
        >
            {children}
        </PromotionContext.Provider>
    );
};
