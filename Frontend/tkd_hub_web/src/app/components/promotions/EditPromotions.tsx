'use client';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import StudentSelector from '../students/StudentSelector';
import { useApiConfig } from '@/app/context/ApiConfigContext';

type EditPromotionProps = {
	promotionId?: number | null;
	onClose: (refresh?: boolean) => void;
};

type Promotion = {
	id?: number;
	studentId: number | null;
	rankId: number | null;
	promotionDate: string;
	coachId: number | null;
	notes?: string;
	dojaangId: number | null;
};

const defaultPromotion: Promotion = {
	studentId: null,
	rankId: null,
	promotionDate: '',
	coachId: null,
	notes: '',
	dojaangId: null,
};

export default function EditPromotion({
	promotionId,
	onClose,
}: EditPromotionProps) {
	const [promotion, setPromotion] = useState<Promotion>(defaultPromotion);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);
	const { getToken } = useAuth();
	const {baseUrl} = useApiConfig();

	// Student list state
	const [students, setStudents] = useState<
		{ id: number; firstName: string; lastName: string }[]
	>([]);
	const [studentsLoading, setStudentsLoading] = useState(true);

	// TODO: Add selectors for rank, coach, and dojaang as needed
	// For now, use simple inputs

	// Fetch students for selector
	useEffect(() => {
		setStudentsLoading(true);
		fetch(`${baseUrl}/Students`, {
			headers: { Authorization: `Bearer ${getToken()}` },
		})
			.then((res) => res.json())
			.then((data) => {
				const arr = Array.isArray(data)
					? data
					: Array.isArray(data.data)
					? data.data
					: [];
				setStudents(arr);
			})
			.catch(() => setStudents([]))
			.finally(() => setStudentsLoading(false));
		// eslint-disable-next-line
	}, []);

	useEffect(() => {
		if (promotionId) {
			setLoading(true);
			fetch(`${baseUrl}/Promotions/${promotionId}`, {
				headers: { Authorization: `Bearer ${getToken()}` },
			})
				.then((res) => res.json())
				.then((data) => setPromotion(data.data || data))
				.catch(() => setError('Failed to load promotion'))
				.finally(() => setLoading(false));
		} else {
			setPromotion(defaultPromotion);
		}
		// eslint-disable-next-line
	}, [promotionId]);

	function handleChange(
		e: React.ChangeEvent<
			HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
		>
	) {
		const { name, value } = e.target;
		setPromotion((prev) => ({
			...prev,
			[name]: value === '' ? null : value,
		}));
	}

	function handleStudentChange(id: number | null) {
		setPromotion((prev) => ({ ...prev, studentId: id }));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setLoading(true);
		setError(null);
		try {
			const method = promotionId ? 'PUT' : 'POST';
			const url = promotionId
				? `${baseUrl}/Promotions/${promotionId}`
				: `${baseUrl}/Promotions`;
			// If promotionDate is empty, use today
			const payload = {
				...promotion,
				promotionDate:
					promotion.promotionDate || new Date().toISOString(),
			};
			const res = await fetch(url, {
				method,
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${getToken()}`,
				},
				body: JSON.stringify(payload),
			});
			if (!res.ok) throw new Error('Failed to save promotion');
			onClose(true);
		} catch {
			setError('Failed to save promotion');
		} finally {
			setLoading(false);
		}
	}

	return (
		<div className="modal fade show d-block modal-bg-blur" tabIndex={-1}>
			<div className="modal-dialog modal-dialog-centered">
				<div className="modal-content">
					<div className="modal-header border-0 pb-0">
						<h3 className="modal-title fs-5">
							{promotionId
								? 'Edit Promotion'
								: 'Create Promotion'}
						</h3>
						<button
							type="button"
							className="btn-close"
							aria-label="Close"
							onClick={() => onClose(false)}
							disabled={loading}
						></button>
					</div>
					<div className="modal-body">
						{error && (
							<div className="alert alert-danger">{error}</div>
						)}
						<form
							onSubmit={handleSubmit}
							className="flex flex-col gap-3"
						>
							<div>
								<StudentSelector
									students={students}
									value={promotion.studentId}
									onChange={handleStudentChange}
									disabled={loading || studentsLoading}
									label="Student"
									id="promotion-student"
								/>
							</div>
							<div>
								<label htmlFor="rankId" className="form-label">
									Rank ID
								</label>
								<input
									id="rankId"
									name="rankId"
									type="number"
									className="form-control"
									value={promotion.rankId ?? ''}
									onChange={handleChange}
									required
									disabled={loading}
								/>
							</div>
							<div>
								<label
									htmlFor="promotionDate"
									className="form-label"
								>
									Promotion Date
								</label>
								<input
									id="promotionDate"
									name="promotionDate"
									type="date"
									className="form-control"
									value={
										promotion.promotionDate
											? promotion.promotionDate.substring(
													0,
													10
											  )
											: ''
									}
									onChange={handleChange}
									disabled={loading}
								/>
							</div>
							<div>
								<label htmlFor="coachId" className="form-label">
									Coach ID
								</label>
								<input
									id="coachId"
									name="coachId"
									type="number"
									className="form-control"
									value={promotion.coachId ?? ''}
									onChange={handleChange}
									required
									disabled={loading}
								/>
							</div>
							<div>
								<label
									htmlFor="dojaangId"
									className="form-label"
								>
									Dojaang ID
								</label>
								<input
									id="dojaangId"
									name="dojaangId"
									type="number"
									className="form-control"
									value={promotion.dojaangId ?? ''}
									onChange={handleChange}
									required
									disabled={loading}
								/>
							</div>
							<div>
								<label htmlFor="notes" className="form-label">
									Notes
								</label>
								<textarea
									id="notes"
									name="notes"
									className="form-control"
									value={promotion.notes || ''}
									onChange={handleChange}
									placeholder="Notes"
									disabled={loading}
								/>
							</div>
							<div className="d-flex justify-content-end gap-2 mt-3">
								<button
									type="button"
									className="btn btn-secondary"
									onClick={() => onClose(false)}
									disabled={loading}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="btn btn-primary"
									disabled={loading}
								>
									{loading
										? promotionId
											? 'Saving...'
											: 'Creating...'
										: promotionId
										? 'Save'
										: 'Create'}
								</button>
							</div>
						</form>
					</div>
				</div>
			</div>
		</div>
	);
}
