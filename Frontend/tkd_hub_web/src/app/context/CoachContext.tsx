'use client';

// 1. External imports
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useRef,
    useEffect // Added useEffect for initial fetch
} from 'react';
import toast from 'react-hot-toast';

// 2. App/context/component imports
import { useApiRequest } from '../utils/api';
import { useAuth } from '@/app/context/AuthContext';
import { Coach } from '@/app/types/Coach';
import { UpsertCoachDto } from '../types/UpsertCoachDto';
import { CoachApiResponse } from '../types/CoachApiResponse';

// --- Type Definitions ---

type CoachContextType = {
    coaches: Coach[];
    loading: boolean;
    error: string | null;
    fetchCoaches: () => Promise<void>;
    getCoachById: (id: number) => Promise<CoachApiResponse | null>;
    createCoach: (data: Omit<Coach, 'id' | 'joinDate'> & { password: string; roleIds: number[] }) => Promise<void>;
    updateCoach: (id: number, data: Partial<Coach>) => Promise<void>;
    deleteCoach: (id: number) => Promise<void>;
    upsertCoach: (data: UpsertCoachDto) => Promise<void>;
    removeCoachFromDojaang: (coachId: number, dojaangId: number) => Promise<void>;
    updateManagedDojaangs: (coachId: number, dojaangIds: number[]) => Promise<void>;
    getCoachesByDojaang: (dojaangId: number) => Promise<Coach[]>;
};

const CoachContext = createContext<CoachContextType>({
    coaches: [],
    loading: false,
    error: null,
    fetchCoaches: async () => {},
    getCoachById: async () => null,
    createCoach: async () => {},
    updateCoach: async () => {},
    deleteCoach: async () => {},
    upsertCoach: async () => {},
    removeCoachFromDojaang: async () => {},
    updateManagedDojaangs: async () => {},
    getCoachesByDojaang: async () => [],
});

export const useCoaches = () => useContext(CoachContext);

export const CoachProvider = ({ children }: { children: ReactNode }) => {
    const [coaches, setCoaches] = useState<Coach[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { getToken } = useAuth();
    const { apiRequest } = useApiRequest();

    // Caches for memoization
    // Stores the *full API response* for a single coach, as defined by CoachApiResponse
    const coachByIdCache = useRef<Map<number, CoachApiResponse>>(new Map());
    // Stores arrays of Coach objects for specific dojaangs
    const coachesByDojaangCache = useRef<Map<number, Coach[]>>(new Map());

    // --- GET /Coaches (fetch all) ---
    const fetchCoaches = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) {
                // If no token, we can't fetch. Set error and return.
                setError('Authentication token not found. Please log in.');
                setLoading(false);
                return;
            }

            const response = await apiRequest<{ data: Coach[] }>('/Coaches', {
                method: 'GET',
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            const fetchedCoaches = Array.isArray(response.data) ? response.data : [];
            setCoaches(fetchedCoaches);

            // When fetching ALL coaches, we populate the single coach cache.
            // Since the /Coaches endpoint likely doesn't return full ManagedDojaang[] objects
            // but rather just `managedDojaangIds: number[]` on the Coach type,
            // we will store a CoachApiResponse with an empty `managedDojaangs` array in the cache.
            // The `getCoachById` function will then be responsible for fetching the *full* details,
            // including hydrated `managedDojaangs`.
            fetchedCoaches.forEach(coach => {
                if (coach.id != null) {
                    coachByIdCache.current.set(coach.id, {
                        data: {
                            coach: coach,
                            managedDojaangs: [], // Initialize as empty array, assuming this endpoint doesn't provide full ManagedDojaang objects
                        },
                    });
                }
            });

        } catch (err: unknown) {
            setCoaches([]);
            const message = err instanceof Error ? err.message : 'Unknown error.';
            setError(`Failed to fetch coaches: ${message}`);
            toast.error(`Failed to fetch coaches: ${message}`);
            console.error('[CoachContext] Error fetching coaches:', err);
        } finally {
            setLoading(false);
        }
    }, [apiRequest, getToken]);

    // Initial fetch of all coaches on component mount
    useEffect(() => {
        // Only fetch if coaches are not already loaded to prevent unnecessary calls
        // This is a common pattern for initial data loading in context providers
        if (coaches.length === 0 && !loading && !error) { // Add !loading and !error to prevent multiple fetches on re-render if initial fetch failed
            fetchCoaches();
        }
    }, [fetchCoaches, coaches.length, loading, error]); // Add loading and error to dependencies


    // --- GET /Coaches/:id (fetch single coach by ID) ---
    const getCoachById = useCallback(
        async (id: number): Promise<CoachApiResponse | null> => {
            // Check if the coach's *full API response* is already in the cache.
            // If the cache contains the full data (including managedDojaangs), return it.
            // Otherwise, proceed to fetch from API.
            if (coachByIdCache.current.has(id)) {
                const cachedData = coachByIdCache.current.get(id);
                // You might want a more sophisticated check here,
                // e.g., if cachedData.data.managedDojaangs.length > 0
                // For now, assuming if it's in cache, it's valid enough for this call.
                console.log(`[CoachContext] Returning coach ${id} from cache.`);
                return cachedData || null;
            }

            setLoading(true);
            setError(null);
            console.log(`[CoachContext] Fetching coach ${id} from API.`);
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication token not found.');
                }
                // `apiRequest` for single coach should return CoachApiResponse directly.
                const res = await apiRequest<CoachApiResponse>(`/Coaches/${id}`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // Correctly check for the ID nested inside `data.coach`
                if (res && res.data && res.data.coach && res.data.coach.id != null) {
                    coachByIdCache.current.set(id, res); // Store the full response, including managedDojaangs
                }
                return res;
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Unknown error.';
                setError(`Failed to load coach: ${message}`);
                toast.error(`Failed to load coach: ${message}`);
                console.error('[CoachContext] Error loading coach by ID:', err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken]
    );

    // --- CUD (Create, Update, Delete) Operations ---
    // All CUD operations should clear relevant caches and then re-fetch all coaches
    // to ensure the main `coaches` state is up-to-date and caches are refreshed.

    const createCoach = useCallback(
        async (data: Omit<Coach, 'id' | 'joinDate'> & { password: string; roleIds: number[] }) => {
            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                // Clear both caches because a new coach affects the list and possibly individual lookups.
                coachByIdCache.current.clear();
                coachesByDojaangCache.current.clear();

                await apiRequest('/Coaches', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                toast.success('Coach created successfully!');
                await fetchCoaches(); // Re-fetch all coaches to update state and caches.
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Unknown error.';
                setError(`Failed to create coach: ${message}`);
                toast.error(`Failed to create coach: ${message}`);
                console.error('[CoachContext] Error creating coach:', err);
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken, fetchCoaches]
    );

    const updateCoach = useCallback(
        async (id: number, data: Partial<Coach>) => {
            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                // Invalidate specific coach from cache and all dojaang-related caches
                // as coach details or their dojaang assignments might have changed.
                coachByIdCache.current.delete(id);
                coachesByDojaangCache.current.clear();

                await apiRequest(`/Coaches/${id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                toast.success('Coach updated successfully!');
                await fetchCoaches(); // Re-fetch all coaches to update state and caches.
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Unknown error.';
                setError(`Failed to update coach: ${message}`);
                toast.error(`Failed to update coach: ${message}`);
                console.error('[CoachContext] Error updating coach:', err);
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken, fetchCoaches]
    );

    const deleteCoach = useCallback(
        async (id: number) => {
            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                // Invalidate specific coach from cache and all dojaang-related caches.
                coachByIdCache.current.delete(id);
                coachesByDojaangCache.current.clear();

                await apiRequest(`/Coaches/${id}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success('Coach deleted successfully!');
                await fetchCoaches(); // Re-fetch all coaches to update state and caches.
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Unknown error.';
                setError(`Failed to delete coach: ${message}`);
                toast.error(`Failed to delete coach: ${message}`);
                console.error('[CoachContext] Error deleting coach:', err);
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken, fetchCoaches]
    );

    const upsertCoach = useCallback(
        async (data: UpsertCoachDto) => {
            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                // Invalidate all caches as upsert could affect existing coaches or add new ones.
                coachByIdCache.current.clear();
                coachesByDojaangCache.current.clear();

                await apiRequest(`/Coaches/upsert`, {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                toast.success('Coach saved successfully!');
                await fetchCoaches();
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Unknown error.';
                setError(`Failed to save coach: ${message}`);
                toast.error(`Failed to save coach: ${message}`);
                console.error('[CoachContext] Error upserting coach:', err);
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken, fetchCoaches]
    );

    const removeCoachFromDojaang = useCallback(
        async (coachId: number, dojaangId: number) => {
            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                // Invalidate specific coach from cache (as their managed dojaangs might change)
                coachByIdCache.current.delete(coachId);
                // Invalidate the cache for this specific dojaang's coaches list
                coachesByDojaangCache.current.delete(dojaangId);

                await apiRequest(`/Coaches/${coachId}/dojaangs/${dojaangId}`, {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                });
                toast.success('Coach removed from dojaang successfully!');
                await fetchCoaches();
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Unknown error.';
                setError(`Failed to remove coach from dojaang: ${message}`);
                toast.error(`Failed to remove coach from dojaang: ${message}`);
                console.error('[CoachContext] Error removing coach from dojaang:', err);
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken, fetchCoaches]
    );

    const updateManagedDojaangs = useCallback(
        async (coachId: number, dojaangIds: number[]) => {
            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                // Invalidate specific coach from cache (their managed dojaangs will change)
                coachByIdCache.current.delete(coachId);
                // Invalidate all dojaang-related caches as coach's management affects many dojaangs.
                coachesByDojaangCache.current.clear();

                await apiRequest(`/Coaches/${coachId}/managed-dojaangs`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(dojaangIds),
                });
                toast.success('Managed dojaangs updated successfully!');
                await fetchCoaches();
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Unknown error.';
                setError(`Failed to update managed dojaangs: ${message}`);
                toast.error(`Failed to update managed dojaangs: ${message}`);
                console.error('[CoachContext] Error updating managed dojaangs:', err);
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken, fetchCoaches]
    );

    const getCoachesByDojaang = useCallback(
        async (dojaangId: number): Promise<Coach[]> => {
            // Check if the coaches for this dojaang are already in the cache.
            if (coachesByDojaangCache.current.has(dojaangId)) {
                console.log(`[CoachContext] Returning coaches for dojaang ${dojaangId} from cache.`);
                return coachesByDojaangCache.current.get(dojaangId) || [];
            }

            setLoading(true);
            setError(null);
            console.log(`[CoachContext] Fetching coaches for dojaang ${dojaangId} from API.`);
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                const response = await apiRequest<{ data: Coach[] }>(
                    `/Coaches/by-dojaang/${dojaangId}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const coachesArray = Array.isArray(response.data) ? response.data : [];
                coachesByDojaangCache.current.set(dojaangId, coachesArray); // Store in cache.
                return coachesArray;
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Unknown error.';
                setError(`Failed to fetch coaches by dojaang: ${message}`);
                toast.error(`Failed to fetch coaches by dojaang: ${message}`);
                console.error('[CoachContext] Error fetching coaches by dojaang:', err);
                return [];
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken]
    );

    return (
        <CoachContext.Provider
            value={{
                coaches,
                loading,
                error,
                fetchCoaches,
                getCoachById,
                createCoach,
                updateCoach,
                deleteCoach,
                upsertCoach,
                removeCoachFromDojaang,
                updateManagedDojaangs,
                getCoachesByDojaang,
            }}
        >
            {children}
        </CoachContext.Provider>
    );
};