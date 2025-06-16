'use client';
// 1. External imports
import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { toast } from 'react-hot-toast';

// 2. App/context/component imports
import PromotionTableRows from '@/app/components/promotions/PromotionsTableRows';
import StudentSelector from '@/app/components/students/StudentSelector';
import { AdminListPage } from '../components/AdminListPage';
import { useApiConfig } from '@/app/context/ApiConfigContext';
import { useStudents } from '../context/StudentContext';
import { usePromotions } from '../context/PromotionContext';
import { Promotion } from '../types/Promotion';
import EditPromotion from '../components/promotions/EditPromotions';

export default function PromotionsAdminContent() {
	// 2. State hooks
	const [showCreate, setShowCreate] = useState(false);
	const [deleteId, setDeleteId] = useState<number | null>(null);
	const [editingPromotion, setEditingPromotion] = useState<Promotion | null>(
		null
	);

	// 1. Context hooks
	const { baseUrl } = useApiConfig();
	const searchParams = useSearchParams();
	const router = useRouter();
	const { students, fetchStudents } = useStudents();
	const {
		promotions,
		loading,
		error,
		fetchPromotions,
		deletePromotion,
		fetchPromotionsByStudentId,
	} = usePromotions();

	// Always use the query param as the source of truth
	const studentIdParam = searchParams.get('studentId');
	const studentIdFilter =
		studentIdParam && !isNaN(Number(studentIdParam))
			? Number(studentIdParam)
			: undefined;

	// 3. Effects
	useEffect(() => {
		if (students.length === 0) {
			fetchStudents?.();
		}
		// eslint-disable-next-line
	}, []);

	// Fetch promotions whenever studentIdFilter changes
	useEffect(() => {
		if (studentIdFilter !== undefined) {
			fetchPromotionsByStudentId(studentIdFilter);
		} else {
			fetchPromotions();
		}
		// eslint-disable-next-line
	}, [studentIdFilter, baseUrl]);

	// 4. Functions
	function handleClearStudent() {
		const params = new URLSearchParams(searchParams.toString());
		params.delete('studentId');
		router.replace(`?${params.toString()}`, { scroll: false });
	}

	function handleStudentSelect(id: number | null) {
		if (id !== null) {
			router.replace(`?studentId=${id}`);
		} else {
			router.replace(`?`);
		}
	}

	function handleCreateClose(refresh?: boolean) {
		setShowCreate(false);
		if (refresh) {
			if (studentIdFilter !== undefined) {
				fetchPromotionsByStudentId(studentIdFilter);
			} else {
				fetchPromotions();
			}
			toast.success('Promotion created!');
		}
	}

	async function handleDelete() {
		if (!deleteId) return;
		try {
			await deletePromotion(deleteId);
			setDeleteId(null);
			if (studentIdFilter !== undefined) {
				await fetchPromotionsByStudentId(studentIdFilter);
			} else {
				await fetchPromotions();
			}
			toast.success('Promotion deleted!');
		} catch {
			toast.error('Failed to delete promotion');
		}
	}

	// 5. Render
	return (
		<AdminListPage
			title="Promotions Administration"
			loading={loading}
			error={error}
			onCreate={() => setShowCreate(true)}
			createLabel="Add Promotion"
			tableHead={
				<tr className="bg-gray-100">
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Name
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Promoted To
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Date
					</th>
					<th className="px-4 py-2 text-left font-semibold text-gray-700">
						Options
					</th>
				</tr>
			}
			tableBody={
				<PromotionTableRows
					promotions={promotions}
					onEdit={(promotion) => setEditingPromotion(promotion)}
					onDelete={handleDelete}
				/>
			}
			filters={
				<div className="mb-4">
					<div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full max-w-2xl">
						<div className="flex-1">
							<StudentSelector
								students={students}
								value={studentIdFilter ?? null}
								onChange={handleStudentSelect}
							/>
						</div>
						{studentIdFilter !== undefined && (
							<button
								type="button"
								className="self-end sm:self-auto h-[42px] px-4 py-1 rounded bg-gray-200 hover:bg-gray-300 text-gray-700 min-w-[120px] promotions-clear-student-btn"
								onClick={handleClearStudent}
							>
								Clear Student
							</button>
						)}
					</div>
				</div>
			}
			modals={
				<>
					{showCreate && (
						<EditPromotion
							onClose={handleCreateClose}
							studentId={
								typeof studentIdFilter === 'number'
									? studentIdFilter
									: undefined
							}
						/>
					)}
					{editingPromotion && (
						<EditPromotion
							promotion={editingPromotion}
							onClose={() => setEditingPromotion(null)}
						/>
					)}
					{deleteId !== null && (
						<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
							<div className="bg-white rounded-lg shadow-lg w-full max-w-md mx-auto">
								<div className="flex justify-between items-center border-b px-4 sm:px-6 py-4">
									<h3 className="text-lg font-semibold">
										Confirm Delete
									</h3>
									<button
										type="button"
										className="text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
										aria-label="Close"
										onClick={() => setDeleteId(null)}
										disabled={loading}
									>
										&times;
									</button>
								</div>
								<div className="px-4 sm:px-6 py-4">
									<p className="mb-4">
										Are you sure you want to delete this
										promotion?
									</p>
									<div className="flex flex-col sm:flex-row justify-end gap-2">
										<button
											type="button"
											className="w-full sm:w-auto px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
											onClick={() => setDeleteId(null)}
											disabled={loading}
										>
											Cancel
										</button>
										<button
											type="button"
											className="w-full sm:w-auto px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
											onClick={handleDelete}
											disabled={loading}
										>
											{loading ? 'Deleting...' : 'Delete'}
										</button>
									</div>
								</div>
							</div>
						</div>
					)}
				</>
			}
		/>
	);
}
