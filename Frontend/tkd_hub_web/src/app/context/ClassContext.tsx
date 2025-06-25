'use client';

// 1. External imports
import React, {
    createContext,
    useContext,
    useState,
    ReactNode,
    useCallback,
    useRef, // Import useRef for caching
    useEffect, // Import useEffect for initial data fetch
    useMemo
} from 'react';
import toast from 'react-hot-toast';

// 2. App/context/component imports
import { TrainingClass } from '../types/TrainingClass';
import { Student } from '../types/Student';
import { useApiRequest } from '../utils/api';
import { useAuth } from './AuthContext';
import { StudentAttendance } from '../types/StudentAttendance';


// Define the context type
type ClassContextType = {
    classes: TrainingClass[];
    loading: boolean;
    error: string | null;
    fetchClasses: () => Promise<void>;
    getClassById: (id: number) => Promise<TrainingClass | null>;
    addClass: (c: Omit<TrainingClass, 'id'>) => Promise<void>;
    updateClass: (id: number, c: Omit<TrainingClass, 'id'>) => Promise<void>;
    deleteClass: (id: number) => Promise<void>;
    addStudentToClass: (studentId: number, classId: number) => Promise<void>;
    getStudentsByClass: (classId: number) => Promise<Student[]>;
    getClassesByDay: (day?: number) => Promise<TrainingClass[]>;
    getClassesByCoachId: (coachId: number) => Promise<TrainingClass[]>;
    getStudentAttendance: (studentId: number) => Promise<StudentAttendance[]>;
};

// Create and export the context
const ClassContext = createContext<ClassContextType>({
    classes: [],
    loading: false,
    error: null,
    fetchClasses: async () => { },
    getClassById: async () => null,
    addClass: async () => { },
    updateClass: async () => { },
    deleteClass: async () => { },
    addStudentToClass: async () => { },
    getStudentsByClass: async () => [],
    getClassesByDay: async () => [],
    getClassesByCoachId: async () => [],
    getStudentAttendance: async () => [],

});

// Custom hook for consuming the context
export const useClasses = () => useContext(ClassContext);

export const ClassProvider: React.FC<{ children: ReactNode }> = ({
    children,
}) => {
    // 1. Context hooks
    const { getToken } = useAuth();
    const { apiRequest } = useApiRequest();

    // 2. State hooks
    const [classes, setClasses] = useState<TrainingClass[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // 3. Cache refs for memoization
    const classByIdCache = useRef<Map<number, TrainingClass>>(new Map());
    const studentsByClassCache = useRef<Map<number, Student[]>>(new Map());
    // FIX 1: Change Map key type for classesByDayCache to string | number
    const classesByDayCache = useRef<Map<string | number, TrainingClass[]>>(new Map());
    const classesByCoachIdCache = useRef<Map<number, TrainingClass[]>>(new Map());

    // 4. Functions

    // --- GET /Classes ---
    const fetchClasses = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) {
                setError('Authentication token not found. Please log in.');
                setLoading(false);
                return;
            }

            const response = await apiRequest<{ data: TrainingClass[] }>(
                '/Classes',
                {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            const fetchedClasses = Array.isArray(response.data) ? response.data : [];
            setClasses(fetchedClasses);

            // Populate classByIdCache for individual class lookups
            fetchedClasses.forEach(c => {
                // Ensure id exists before setting in Map
                if (c.id !== undefined && c.id !== null) {
                    classByIdCache.current.set(c.id, c);
                }
            });

        } catch (err: unknown) {
            setClasses([]);
            const message = err instanceof Error ? err.message : 'Failed to fetch classes.';
            setError(message);
            toast.error(message);
            console.error('Failed to fetch classes:', err);
        } finally {
            setLoading(false);
        }
    }, [apiRequest, getToken]);

    // Initial fetch of all classes on component mount
    useEffect(() => {
        // Only fetch if classes are not already loaded to prevent unnecessary calls
        if (classes.length === 0 && !loading && !error) {
            fetchClasses();
        }
    }, [fetchClasses, classes.length, loading, error]);

    // --- GET /Classes/:id ---
    const getClassById = useCallback(
        async (id: number): Promise<TrainingClass | null> => {
            // Check cache first
            if (classByIdCache.current.has(id)) {
                console.log(`Returning class ${id} from cache.`);
                return classByIdCache.current.get(id)!; // We know it exists if has() returns true
            }

            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication token not found.');
                }
                const data = await apiRequest<TrainingClass>(`/Classes/${id}`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                classByIdCache.current.set(id, data); // Cache the fetched class
                return data;
            } catch (e) {
                const message = (e instanceof Error) ? e.message : 'Failed to fetch class by ID.';
                setError(message);
                toast.error(message);
                console.error('Failed to fetch class by ID:', e);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken]
    );

    // --- POST /Classes ---
    const addClass = useCallback(async (classData: Omit<TrainingClass, 'id'>) => {
        setLoading(true);
        setError(null);
        try {
            const token = getToken();
            if (!token) {
                throw new Error('Authentication token not found.');
            }

            await apiRequest('/Classes', {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(classData),
            });
            toast.success('Class added successfully.');
            // Invalidate all caches since adding a class changes overall data
            classByIdCache.current.clear();
            studentsByClassCache.current.clear();
            classesByDayCache.current.clear();
            classesByCoachIdCache.current.clear();
            await fetchClasses(); // Re-fetch to update main state
        } catch (e: unknown) {
            let apiMessage = 'Failed to add class.';
            if (typeof e === 'object' && e !== null) {
                if ('message' in e && typeof (e as { message: unknown }).message === 'string') {
                    apiMessage = (e as { message: string }).message;
                } else if ('response' in e && typeof (e as { response: { data?: { message?: unknown } } }).response?.data?.message === 'string') {
                    apiMessage = (e as { response: { data: { message: string } } }).response.data.message;
                }
            }
            setError(apiMessage);
            toast.error(apiMessage);
            console.error('Failed to add class:', e);
        } finally {
            setLoading(false);
        }
    }, [apiRequest, getToken, fetchClasses]);

    // --- PUT /Classes/:id ---
    const updateClass = useCallback(
        async (id: number, classData: Omit<TrainingClass, 'id'>) => {
            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                await apiRequest(`/Classes/${id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(classData),
                });
                toast.success('Class updated successfully.');
                // Invalidate relevant caches: specific class, and any lists it might appear in
                classByIdCache.current.delete(id);
                classesByDayCache.current.clear(); // Could affect classes by day
                classesByCoachIdCache.current.clear(); // Could affect classes by coach
                // No need to clear studentsByClassCache unless classData affects student list
                await fetchClasses();
            } catch (e: unknown) {
                let apiMessage = 'Failed to update class.';
                if (typeof e === 'object' && e !== null) {
                    if ('message' in e && typeof (e as { message: unknown }).message === 'string') {
                        apiMessage = (e as { message: string }).message;
                    } else if ('response' in e && typeof (e as { response: { data?: { message?: unknown } } }).response?.data?.message === 'string') {
                        apiMessage = (e as { response: { data: { message: string } } }).response.data.message;
                    }
                }
                setError(apiMessage);
                toast.error(apiMessage);
                console.error('Failed to update class:', e);
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken, fetchClasses]
    );

    // --- POST /Students/:studentId/trainingclasses/:classId ---
    const addStudentToClass = useCallback(
        async (studentId: number, classId: number) => {
            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                await apiRequest(
                    `/Students/${studentId}/trainingclasses/${classId}`,
                    {
                        method: 'POST',
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'application/json',
                        },
                    }
                );
                toast.success('Student added to class.');
                // Invalidate cache for students of this specific class
                studentsByClassCache.current.delete(classId);
                // Also invalidate the main classes cache if student count is part of TrainingClass overview
                // or if fetching all classes includes student counts that would change.
                // For simplicity, we'll clear all related caches that might be affected.
                classByIdCache.current.clear(); // A class's student list is part of its detail
                classesByDayCache.current.clear(); // A class's student list might affect other class data
                classesByCoachIdCache.current.clear();
                await fetchClasses(); // Re-fetch to update main state
            } catch (e: unknown) {
                let apiMessage = 'Failed to add student to class.';
                if (typeof e === 'object' && e !== null) {
                    if ('message' in e && typeof (e as { message: unknown }).message === 'string') {
                        apiMessage = (e as { message: string }).message;
                    } else if ('response' in e && typeof (e as { response: { data?: { message?: unknown } } }).response?.data?.message === 'string') {
                        apiMessage = (e as { response: { data: { message: string } } }).response.data.message;
                    }
                }
                setError(apiMessage);
                toast.error(apiMessage);
                console.error('Failed to add student to class:', e);
            } finally {
                setLoading(false);
            }
        }, [apiRequest, getToken, fetchClasses]);

    // --- DELETE /Classes/:id ---
    const deleteClass = useCallback(
        async (id: number) => {
            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication token not found.');
                }

                await apiRequest(`/Classes/${id}`, {
                    method: 'DELETE',
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                toast.success('Class deleted successfully.');
                // Invalidate all caches as deleting a class affects overall data
                classByIdCache.current.clear();
                studentsByClassCache.current.clear();
                classesByDayCache.current.clear();
                classesByCoachIdCache.current.clear();
                await fetchClasses();
            } catch (e: unknown) {
                let apiMessage = 'Failed to delete class.';
                if (typeof e === 'object' && e !== null) {
                    if ('message' in e && typeof (e as { message: unknown }).message === 'string') {
                        apiMessage = (e as { message: string }).message;
                    } else if ('response' in e &&
                        typeof (e as { response: { data?: unknown } }).response?.data === 'object' &&
                        (e as { response: { data: { message?: unknown } } }).response?.data &&
                        'message' in (e as { response: { data: { message?: unknown } } }).response.data &&
                        typeof (e as { response: { data: { message: unknown } } }).response.data.message === 'string'
                    ) {
                        apiMessage = (e as { response: { data: { message: string } } }).response.data.message;
                    } else if ('response' in e && typeof (e as { response: { data?: unknown } }).response?.data === 'string') {
                        apiMessage = (e as { response: { data: string } }).response.data;
                    }
                }
                setError(apiMessage);
                toast.error(apiMessage);
                console.error('Failed to delete class:', e);
            } finally {
                setLoading(false);
            }
        }, [apiRequest, getToken, fetchClasses]);

    // --- GET /Classes/:classId/students ---
    const getStudentsByClass = useCallback(
        async (classId: number): Promise<Student[]> => {
            // Check cache first
            if (studentsByClassCache.current.has(classId)) {
                console.log(`Returning students for class ${classId} from cache.`);
                return studentsByClassCache.current.get(classId)!;
            }

            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication token not found.');
                }
                const res = await apiRequest<{ data: Student[] }>(
                    `/Classes/${classId}/students`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                const students = Array.isArray(res.data) ? res.data : [];
                studentsByClassCache.current.set(classId, students); // Cache the students
                setLoading(false);
                return students;
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to load students for class.';
                setError(message);
                setLoading(false);
                toast.error(message);
                console.error('Failed to load students for class:', err);
                return [];
            }
        }, [apiRequest, getToken]);

    // --- GET /Classes/by-day?day=... ---
    const getClassesByDay = useCallback(
        async (day?: number): Promise<TrainingClass[]> => {
            // FIX 2: Define cacheKey type explicitly as string or number
            const cacheKey: string | number = day === undefined ? 'undefined-day' : day; // Use a unique string for undefined

            // Check cache first
            if (classesByDayCache.current.has(cacheKey)) { // No 'as any' needed
                console.log(`Returning classes for day ${String(cacheKey)} from cache.`);
                return classesByDayCache.current.get(cacheKey)!;
            }

            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication token not found.');
                }
                const url =
                    day !== undefined
                        ? `/Classes/by-day?day=${day}`
                        : `/Classes/by-day`;
                const response = await apiRequest<{ data: TrainingClass[] }>(
                    url,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const classesForDay = Array.isArray(response.data) ? response.data : [];
                classesByDayCache.current.set(cacheKey, classesForDay); // No 'as any' needed
                return classesForDay;
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to fetch classes by day.';
                toast.error(message);
                setError(message);
                console.error('Failed to fetch classes by day:', err);
                return [];
            } finally {
                setLoading(false);
            }
        }, [apiRequest, getToken]);

    // --- GET /Classes/coach/{coachId} ---
    const getClassesByCoachId = useCallback(
        async (coachId: number): Promise<TrainingClass[]> => {
            // Check cache first
            if (classesByCoachIdCache.current.has(coachId)) {
                console.log(`Returning classes for coach ${coachId} from cache.`);
                return classesByCoachIdCache.current.get(coachId)!;
            }

            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                if (!token) {
                    throw new Error('Authentication token not found.');
                }
                const response = await apiRequest<{ data: TrainingClass[] }>(
                    `/Classes/coach/${coachId}`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                const data = Array.isArray(response.data)
                    ? response.data.map((c) => ({
                        ...c,
                        dojaangName: c.dojaangName ?? '',
                    }))
                    : [];
                classesByCoachIdCache.current.set(coachId, data); // Cache the classes for the coach
                // Consider whether you *always* want to update the main `classes` state here.
                // If this getter is just for specific queries, setting the global `classes` state
                // might lead to unexpected UI updates. If not, you might remove the line below.
                // setClasses(data);
                return data;
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to fetch classes for coach.';
                setError(message);
                // setClasses([]); // Only clear if this function's purpose is to set the main classes state
                toast.error(message);
                console.error('Failed to fetch classes for coach:', err);
                return [];
            } finally {
                setLoading(false);
            }
        }, [apiRequest, getToken]); // Removed setClasses from dependencies as it's optional

    // --- GET /Classes/student/{studentId}/attendance ---
    const getStudentAttendance = useCallback(
        async (studentId: number): Promise<StudentAttendance[]> => {
            setLoading(true);
            setError(null);
            try {
                const token = getToken();
                if (!token) throw new Error('Authentication token not found.');
                const response = await apiRequest<{ data: StudentAttendance[] }>(
                    `/Classes/student/${studentId}/attendance`,
                    {
                        method: 'GET',
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                return Array.isArray(response.data) ? response.data : [];
            } catch (err: unknown) {
                const message = err instanceof Error ? err.message : 'Failed to fetch attendance.';
                setError(message);
                toast.error(message);
                console.error('Failed to fetch attendance:', err);
                return [];
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken]
    );

    // 5. Render
    const contextValue = useMemo(() => ({
        classes,
        loading,
        error,
        fetchClasses,
        getClassById,
        addClass,
        updateClass,
        deleteClass,
        addStudentToClass,
        getStudentsByClass,
        getClassesByDay,
        getClassesByCoachId,
        getStudentAttendance,
    }), [
        classes, loading, error, fetchClasses, getClassById, addClass, updateClass,
        deleteClass, addStudentToClass, getStudentsByClass, getClassesByDay,
        getClassesByCoachId, getStudentAttendance
    ]);

    return (
        <ClassContext.Provider value={contextValue}>
            {children}
        </ClassContext.Provider>
    );
};
