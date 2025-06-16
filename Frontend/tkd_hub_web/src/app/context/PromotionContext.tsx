'use client';

// 1. External imports
import React, { createContext, useContext, useState, ReactNode } from 'react';
import toast from 'react-hot-toast';

// 2. App/context/component imports
import { useApiRequest } from '../utils/api';
import { useAuth } from '@/app/context/AuthContext';
import { Promotion } from '@/app/types/Promotion';
import { CreatePromotionDto } from '../types/CreatePromotionDto';

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

const PromotionContext = createContext<PromotionContextType>({
	promotions: [],
	loading: false,
	error: null,
	fetchPromotions: async () => {},
	getPromotionById: async () => null,
	createPromotion: async () => {},
	updatePromotion: async () => {},
	deletePromotion: async () => {},
	fetchPromotionsByStudentId: async () => [],
});

export const usePromotions = () => useContext(PromotionContext);

export const PromotionProvider = ({ children }: { children: ReactNode }) => {
	// 1. Context hooks
	const { getToken } = useAuth();
	const { apiRequest } = useApiRequest();

	// 2. State hooks
	const [promotions, setPromotions] = useState<Promotion[]>([]);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	// 3. Effects
	// (No effects)

	// 4. Functions

	// --- GET /Promotions ---
	const fetchPromotions = async () => {
		setLoading(true);
		setError(null);
		try {
			const res = await apiRequest<{ data: Promotion[] }>('/Promotions', {
				headers: { Authorization: `Bearer ${getToken()}` },
			});
			setPromotions(Array.isArray(res.data) ? res.data : []);
		} catch {
			setError('Failed to load promotions');
			setPromotions([]);
			toast.error('Failed to load promotions');
		} finally {
			setLoading(false);
		}
	};

	// --- GET /Promotions/:id ---
	const getPromotionById = async (id: number): Promise<Promotion | null> => {
		setLoading(true);
		setError(null);
		try {
			const res = await apiRequest<Promotion>(`/Promotions/${id}`, {
				headers: { Authorization: `Bearer ${getToken()}` },
			});
			setLoading(false);
			return res;
		} catch {
			setError('Failed to load promotion');
			setLoading(false);
			toast.error('Failed to load promotion');
			return null;
		}
	};

	// --- GET /Promotions/student/{studentId} ---
	const fetchPromotionsByStudentId = async (
		studentId: number
	): Promise<Promotion[]> => {
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
			setPromotions(data);
			return data;
		} catch {
			setError('Failed to load promotions for student');
			setPromotions([]);
			toast.error('Failed to load promotions for student');
			return [];
		} finally {
			setLoading(false);
		}
	};

	// --- POST /Promotions ---
	const createPromotion = async (data: CreatePromotionDto) => {
		setLoading(true);
		setError(null);
		try {
			await apiRequest('/Promotions', {
				method: 'POST',
				headers: {
					Authorization: `Bearer ${getToken()}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			toast.success('Promotion created');
			await fetchPromotions();
		} catch {
			setError('Failed to create promotion');
			toast.error('Failed to create promotion');
		} finally {
			setLoading(false);
		}
	};

	// --- PUT /Promotions/:id ---
	const updatePromotion = async (id: number, data: Partial<Promotion>) => {
		setLoading(true);
		setError(null);
		try {
			await apiRequest(`/Promotions/${id}`, {
				method: 'PUT',
				headers: {
					Authorization: `Bearer ${getToken()}`,
					'Content-Type': 'application/json',
				},
				body: JSON.stringify(data),
			});
			toast.success('Promotion updated');
			await fetchPromotions();
		} catch {
			setError('Failed to update promotion');
			toast.error('Failed to update promotion');
		} finally {
			setLoading(false);
		}
	};

	// --- DELETE /Promotions/:id ---
	const deletePromotion = async (id: number) => {
		setLoading(true);
		setError(null);
		try {
			await apiRequest(`/Promotions/${id}`, {
				method: 'DELETE',
				headers: { Authorization: `Bearer ${getToken()}` },
			});
			toast.success('Promotion deleted');
			await fetchPromotions();
		} catch {
			setError('Failed to delete promotion');
			toast.error('Failed to delete promotion');
		} finally {
			setLoading(false);
		}
	};

	// 5. Render
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
