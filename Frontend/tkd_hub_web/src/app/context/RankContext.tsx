'use client';

// 1. External imports
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useRef,
    useEffect, // Import useRef for creating mutable references for caches
} from 'react';
import toast from 'react-hot-toast';

// 2. App/context/component imports
import { Rank } from '@/app/types/Rank'; // Assuming Rank type is defined here
import { useApiRequest } from '../utils/api'; // Custom hook for API requests

// --- Type Definitions ---

/**
 * Defines the shape of the RankContext, outlining available data and functions.
 */
type RankContextType = {
    ranks: Rank[];
    loading: boolean;
    error: string | null;
    fetchRanks: () => Promise<void>;
    getRankById: (id: number) => Promise<Rank | null>;
};

// --- Context Creation ---

/**
 * Initializes the RankContext with default empty values.
 * These defaults are used when a component consumes the context without a provider,
 * or as initial values before actual data is loaded.
 */
const RankContext = createContext<RankContextType>({
    ranks: [],
    loading: false,
    error: null,
    fetchRanks: async () => { },
    getRankById: async () => null,
});

// --- Context Hooks ---

/**
 * Custom hook to consume the RankContext.
 * This hook allows any descendant component of `RankProvider` to easily access
 * the `ranks` data, `loading` state, `error` messages, and various rank-related functions.
 * @returns The current value of the RankContext (RankContextType).
 */
export const useRanks = () => useContext(RankContext);

// --- Rank Provider Component ---

/**
 * The `RankProvider` component is responsible for managing the state of ranks
 * (fetching, loading, errors) and providing rank-related functionalities to its children.
 * It uses memoization techniques to optimize performance by caching API responses.
 * @param children React nodes to be rendered within the provider's scope.
 */
export const RankProvider = ({ children }: { children: ReactNode }) => {
    // 1. Context hooks
    const { apiRequest } = useApiRequest();

    // 2. State Hooks
    const [ranks, setRanks] = useState<Rank[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const rankByIdCache = useRef<Map<number, Rank>>(new Map());

    // --- Automatically fetch ranks on mount ---
    useEffect(() => {
        fetchRanks();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // 4. Functions (memoized with useCallback)
    const fetchRanks = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiRequest<{ data: Rank[] }>('/Ranks');
            const ranksArray = Array.isArray(res.data) ? res.data : [];
            setRanks(ranksArray);

            // Populate rankByIdCache for quick lookup of individual ranks.
            ranksArray.forEach(rank => {
                if (rank.id != null) {
                    rankByIdCache.current.set(rank.id, rank);
                }
            });
        } catch (err) {
            setError('Failed to load ranks');
            setRanks([]);
            toast.error(
                'Failed to load ranks' +
                (err instanceof Error ? `: ${err.message}` : '')
            );
        } finally {
            setLoading(false);
        }
    }, [apiRequest]);

    /**
     * Fetches a single rank by its ID.
     * Checks the `rankByIdCache` first; if found, it returns the cached data immediately.
     * Otherwise, it makes an API request to fetch the rank and then caches the result.
     * This function is memoized using `useCallback` for performance optimization.
     * @param id The unique identifier of the rank to fetch.
     * @returns A Promise that resolves to the `Rank` object if found, or `null` if not found or an error occurs.
     */
    const getRankById = useCallback(
        async (id: number): Promise<Rank | null> => {
            // Check if the rank is already in the cache.
            if (rankByIdCache.current.has(id)) {
                return rankByIdCache.current.get(id) || null;
            }

            setLoading(true);
            setError(null);
            try {
                const res = await apiRequest<Rank>(`/Ranks/${id}`);
                // If the API call is successful, store the fetched rank in the cache.
                if (res) {
                    rankByIdCache.current.set(id, res);
                }
                return res;
            } catch (err) {
                // Handle and display error message.
                setError('Failed to load rank');
                toast.error(
                    'Failed to load rank' +
                    (err instanceof Error ? `: ${err.message}` : '')
                );
                return null;
            } finally {
                setLoading(false);
            }
        },
        [apiRequest] // Dependency: `apiRequest` to ensure the function is stable.
    );

    // 5. Render
    /**
     * Renders the `RankContext.Provider`, making the `ranks` data, `loading` state, `error` messages,
     * and rank-related functions (`fetchRanks`, `getRankById`) available to all child components
     * wrapped by this provider.
     */
    return (
        <RankContext.Provider
            value={{ ranks, loading, error, fetchRanks, getRankById }}
        >
            {children}
        </RankContext.Provider>
    );
};
