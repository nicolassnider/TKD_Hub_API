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
import { Student } from '@/app/types/Student';

// Type definition for the StudentContext, outlining available data and functions.
type StudentContextType = {
    students: Student[];
    loading: boolean;
    error: string | null;
    fetchStudents: () => Promise<void>;
    getStudentById: (id: number) => Promise<Student | null>;
    createStudent: (
        data: Omit<Student, 'id' | 'joinDate' | 'isActive'>
    ) => Promise<void>;
    updateStudent: (id: number, data: Partial<Student>) => Promise<void>;
    getStudentsByDojaang: (dojaangId: number) => Promise<Student[]>;
};

// Initializes the StudentContext with default empty values.
const StudentContext = createContext<StudentContextType>({
    students: [],
    loading: false,
    error: null,
    fetchStudents: async () => {},
    getStudentById: async () => null,
    createStudent: async () => {},
    updateStudent: async () => {},
    getStudentsByDojaang: async () => [],
});

// 1. Context Hooks
/**
 * Custom hook to consume the StudentContext, providing access to student data and functions.
 * @returns The StudentContextType value.
 */
export const useStudents = () => useContext(StudentContext);

/**
 * Provides student data and interaction functionalities to its children components.
 * Manages fetching, creating, updating students, and caching student data.
 * @param children React nodes to be rendered within the provider's scope.
 */
export const StudentProvider = ({ children }: { children: ReactNode }) => {
    // Context hooks for authentication token and API request utility.
    const { getToken } = useAuth();
    const { apiRequest } = useApiRequest();

    // 2. State Hooks
    // State to hold the list of all students.
    const [students, setStudents] = useState<Student[]>([]);
    // State to indicate if an API request is currently in progress.
    const [loading, setLoading] = useState(false);
    // State to store any error messages from API requests.
    const [error, setError] = useState<string | null>(null);

    // Caches for memoizing API responses to avoid redundant calls.
    // Cache for individual students fetched by ID.
    const studentByIdCache = useRef<Map<number, Student>>(new Map());
    // Cache for lists of students fetched by Dojaang ID.
    const studentsByDojaangCache = useRef<Map<number, Student[]>>(new Map());

    // 3. Effects
    // No specific useEffects are typically needed here for memoization itself,
    // as memoization is handled within the useCallback functions and useRef caches.

    // 4. Functions (memoized with useCallback)

    /**
     * Fetches all students from the API.
     * Updates the 'students' state and populates the `studentByIdCache` with fetched students.
     * This function is memoized using `useCallback`.
     */
    const fetchStudents = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await apiRequest<{ data: { data: Student[] } }>(
                '/Students',
                {
                    headers: { Authorization: `Bearer ${getToken()}` },
                }
            );
            const fetchedStudents = res.data?.data ?? [];
            setStudents(fetchedStudents);
            // Populate studentByIdCache with all fetched students for individual lookup optimization.
            fetchedStudents.forEach(student => {
                // --- MODIFIED LINE BELOW ---
                if (student.id != null) { // Check if id is neither null nor undefined
                    studentByIdCache.current.set(student.id, student);
                }
            });
        } catch (err) {
            setError('Failed to load students');
            setStudents([]);
            toast.error(
                'Failed to load students' +
                (err instanceof Error ? `: ${err.message}` : '')
            );
        } finally {
            setLoading(false);
        }
    }, [apiRequest, getToken]); // Dependencies: apiRequest and getToken to ensure stability.

    /**
     * Fetches a single student by their ID.
     * Checks `studentByIdCache` first; if found, returns cached data.
     * Otherwise, makes an API request and caches the result.
     * This function is memoized using `useCallback`.
     * @param id The ID of the student to fetch.
     * @returns The Student object or null if not found/error.
     */
    const getStudentById = useCallback(
        async (id: number): Promise<Student | null> => {
            // Check cache first for existing student data.
            if (studentByIdCache.current.has(id)) {
                console.log(
                    '[StudentContext] Returning student from cache:',
                    id
                );
                return studentByIdCache.current.get(id) || null;
            }

            setLoading(true);
            setError(null);
            console.log(
                '[StudentContext] getStudentById making API call for id:',
                id
            );
            try {
                const res = await apiRequest<{ data: Student }>(
                    `/Students/${id}`,
                    {
                        headers: { Authorization: `Bearer ${getToken()}` },
                    }
                );
                const fetchedStudent = res.data ?? null;
                if (fetchedStudent) {
                    studentByIdCache.current.set(id, fetchedStudent); // Store in cache if successfully fetched.
                }
                console.log(
                    '[StudentContext] getStudentById API response:',
                    fetchedStudent
                );
                return fetchedStudent;
            } catch (err) {
                setError('Failed to load student');
                toast.error(
                    'Failed to load student' +
                    (err instanceof Error ? `: ${err.message}` : '')
                );
                console.error('[StudentContext] getStudentById error:', err);
                return null;
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken] // Dependencies: apiRequest and getToken for function stability.
    );

    /**
     * Creates a new student in the database.
     * After successful creation, it triggers a refetch of all students to update the local state and caches.
     * This function is memoized using `useCallback`.
     * @param data The partial student data (excluding id, joinDate, isActive) for creation.
     */
    const createStudent = useCallback(
        async (data: Omit<Student, 'id' | 'joinDate' | 'isActive'>) => {
            setLoading(true);
            setError(null);
            try {
                // Invalidate relevant caches as data has changed.
                studentByIdCache.current.clear(); // Clear individual student cache
                studentsByDojaangCache.current.clear(); // Clear dojaang-specific student caches

                await apiRequest('/Students', {
                    method: 'POST',
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                toast.success('Student created successfully!');
                await fetchStudents(); // Re-fetch all students to ensure state and caches are fresh.
            } catch (err) {
                setError('Failed to create student');
                toast.error(
                    'Failed to create student' +
                    (err instanceof Error ? `: ${err.message}` : '')
                );
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken, fetchStudents] // Dependencies: apiRequest, getToken, and fetchStudents.
    );

    /**
     * Updates an existing student's data.
     * After successful update, it triggers a refetch of all students to update the local state and caches.
     * This function is memoized using `useCallback`.
     * @param id The ID of the student to update.
     * @param data The partial student data to apply updates.
     */
    const updateStudent = useCallback(
        async (id: number, data: Partial<Student>) => {
            setLoading(true);
            setError(null);
            try {
                // Invalidate relevant caches as data has changed.
                studentByIdCache.current.delete(id); // Remove specific student from cache
                studentsByDojaangCache.current.clear(); // Clear all dojaang-specific student caches (could be optimized)

                await apiRequest(`/Students/${id}`, {
                    method: 'PUT',
                    headers: {
                        Authorization: `Bearer ${getToken()}`,
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(data),
                });
                toast.success('Student updated successfully!');
                await fetchStudents(); // Re-fetch all students to ensure state and caches are fresh.
            } catch (err) {
                setError('Failed to update student');
                toast.error(
                    'Failed to update student' +
                    (err instanceof Error ? `: ${err.message}` : '')
                );
            } finally {
                setLoading(false);
            }
        },
        [apiRequest, getToken, fetchStudents] // Dependencies: apiRequest, getToken, and fetchStudents.
    );

    /**
     * Fetches a list of students associated with a specific Dojaang ID.
     * Checks `studentsByDojaangCache` first; if found, returns cached data.
     * Otherwise, makes an API request and caches the result.
     * This function is memoized using `useCallback`.
     * @param dojaangId The ID of the dojaang to filter students by.
     * @returns An array of Student objects or an empty array if not found/error.
     */
    const getStudentsByDojaang = useCallback(
        async (dojaangId: number): Promise<Student[]> => {
            // Check cache first for existing students by dojaang.
            if (studentsByDojaangCache.current.has(dojaangId)) {
                console.log(
                    '[StudentContext] Returning students by dojaang from cache:',
                    dojaangId
                );
                return studentsByDojaangCache.current.get(dojaangId) || [];
            }

            setLoading(true);
            setError(null);
            console.log(
                '[StudentContext] getStudentsByDojaang making API call for dojaangId:',
                dojaangId
            );
            try {
                const res = await apiRequest<{ data: { data: Student[] } }>(
                    `/Students/Dojaang/${dojaangId}`,
                    {
                        headers: { Authorization: `Bearer ${getToken()}` },
                    }
                );
                setLoading(false);
                let fetchedStudents: Student[] = [];
                // Defensive parsing for API response structure.
                if (Array.isArray(res.data)) {
                    fetchedStudents = res.data;
                } else if (res.data && Array.isArray(res.data.data)) {
                    fetchedStudents = res.data.data;
                }

                studentsByDojaangCache.current.set(dojaangId, fetchedStudents); // Store in cache.
                return fetchedStudents;
            } catch (err) {
                setError('Failed to load students by dojaang');
                setLoading(false);
                toast.error(
                    'Failed to load students by dojaang' +
                    (err instanceof Error ? `: ${err.message}` : '')
                );
                console.error(
                    '[StudentContext] getStudentsByDojaang error:',
                    err
                );
                return [];
            }
        },
        [apiRequest, getToken] // Dependencies: apiRequest and getToken for function stability.
    );

    // 5. Render
    /**
     * Renders the StudentContext.Provider, making the student data and functions available
     * to all components wrapped by this provider.
     */
    return (
        <StudentContext.Provider
            value={{
                students,
                loading,
                error,
                fetchStudents,
                getStudentById,
                createStudent,
                updateStudent,
                getStudentsByDojaang,
            }}
        >
            {children}
        </StudentContext.Provider>
    );
};