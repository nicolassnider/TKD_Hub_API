'use client';

// 1. External imports
import React, {
	createContext,
	useContext,
	useState,
	ReactNode,
	useCallback,
} from 'react';
import toast from 'react-hot-toast';

// 2. App/context/component imports
import { useApiRequest } from '../utils/api';
import { useAuth } from '@/app/context/AuthContext';
import { Student } from '@/app/types/Student';

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

export const useStudents = () => useContext(StudentContext);

export const StudentProvider = ({ children }: { children: ReactNode }) => {
	// 1. Context hooks
	const { getToken } = useAuth();
	const { apiRequest } = useApiRequest();

	// 2. State hooks
	const [students, setStudents] = useState<Student[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 3. Effects
	// (No effects)

	// 4. Functions

	// --- GET /Students ---
	const fetchStudents = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await apiRequest<{ data: { data: Student[] } }>(
				'/Students',
				{
					headers: { Authorization: `Bearer ${getToken()}` },
				}
			);
			setStudents(res.data?.data ?? []);
		} catch {
			setError('Failed to load students');
			setStudents([]);
			toast.error('Failed to load students');
		} finally {
			setLoading(false);
		}
	};

	// --- GET /Students/:id ---
	const getStudentById = async (id: number): Promise<Student | null> => {
		setLoading(true);
		setError(null);
		console.log('[StudentContext] getStudentById called with id:', id);
		try {
			const res = await apiRequest<{ data: Student }>(`/Students/${id}`, {
				headers: { Authorization: `Bearer ${getToken()}` },
			});
			console.log('[StudentContext] getStudentById API response:', res);
			setLoading(false);
			return res.data ?? null;
		} catch (err) {
			setError('Failed to load student');
			setLoading(false);
			toast.error('Failed to load student');
			console.error('[StudentContext] getStudentById error:', err);
			return null;
		}
	};

	// --- POST /Students ---
	const createStudent = async (
		data: Omit<Student, 'id' | 'joinDate' | 'isActive'>
	) => {
		setLoading(true);
		setError(null);
		try {
			await apiRequest('/Students', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${getToken()}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			toast.success('Student created');
			await fetchStudents();
		} catch {
			setError('Failed to create student');
			toast.error('Failed to create student');
		} finally {
			setLoading(false);
		}
	};

	// --- PUT /Students/:id ---
	const updateStudent = async (id: number, data: Partial<Student>) => {
		setLoading(true);
		setError(null);
		try {
			await apiRequest(`/Students/${id}`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${getToken()}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			await fetchStudents();
		} catch {
			setError('Failed to update student');
			toast.error('Failed to update student');
		} finally {
			setLoading(false);
		}
	};

	// --- GET /Students/Dojaang/:dojaangId ---
	const getStudentsByDojaang = useCallback(
		async (dojaangId: number): Promise<Student[]> => {
			setLoading(true);
			setError(null);
			try {
				const res = await apiRequest<{ data: { data: Student[] } }>(
					`/Students/Dojaang/${dojaangId}`,
					{
						headers: { Authorization: `Bearer ${getToken()}` },
					}
				);
				setLoading(false);
				// Defensive: handle both { data: Student[] } and { data: { data: Student[] } }
				if (Array.isArray(res.data)) {
					return res.data;
				}
				if (res.data && Array.isArray(res.data.data)) {
					return res.data.data;
				}
				return [];
			} catch {
				setError('Failed to load students by dojaang');
				setLoading(false);
				toast.error('Failed to load students by dojaang');
				return [];
			}
		},
		[apiRequest, getToken]
	);

	// 5. Render
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
