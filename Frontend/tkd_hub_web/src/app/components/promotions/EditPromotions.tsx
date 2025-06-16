'use client';
import React, { useEffect, useState } from 'react';
import { usePromotions } from '@/app/context/PromotionContext';
import { Promotion } from '@/app/types/Promotion';
import { CreatePromotionDto } from '@/app/types/CreatePromotionDto';
import LabeledInput from '../common/inputs/LabeledInput';
import StudentSelector from '../students/StudentSelector';
import { useStudents } from '@/app/context/StudentContext';
import RanksSelector from '../common/selectors/RanksSelector';
import ModalCloseButton from '../common/actionButtons/ModalCloseButton';
import FormActionButtons from '../common/actionButtons/FormActionButtons';
import toast from 'react-hot-toast';
import CoachSelector from '../coaches/CoachSelector';
import { useCoaches } from '@/app/context/CoachContext';
import { useRanks } from '@/app/context/RankContext';

type EditPromotionProps = {
	promotion?: Promotion; // If undefined, create mode
	onClose: (refresh?: boolean) => void;
	studentId?: number;
};

export default function EditPromotion({
	promotion,
	onClose,
}: EditPromotionProps) {
	// 1. Context hooks
	const {
		createPromotion,
		updatePromotion,
		fetchPromotions,
		loading: loadingPromotions,
		error: promotionsError,
	} = usePromotions();
	const { students, loading: loadingStudents } = useStudents();
	const { coaches, fetchCoaches, loading: loadingCoaches } = useCoaches();
	const { ranks } = useRanks();

	// 2. State hooks
	const [formState, setFormState] = useState<Partial<Promotion>>(
		promotion
			? { ...promotion }
			: {
					studentId: undefined,
					rankId: undefined,
					promotionDate: '',
					notes: '',
			  }
	);
	const [originalPromotion, setOriginalPromotion] =
		useState<Partial<Promotion> | null>(
			promotion ? { ...promotion } : null
		);
	const [saving, setSaving] = useState(false);

	// 3. Effects
	useEffect(() => {
		fetchCoaches();
	}, [fetchCoaches]);

	useEffect(() => {
		if (promotion) {
			setFormState({ ...promotion });
			setOriginalPromotion({ ...promotion });
		} else {
			setFormState({
				studentId: undefined,
				rankId: undefined,
				promotionDate: '',
				notes: '',
			});
			setOriginalPromotion(null);
		}
	}, [promotion]);

	// 4. Functions
	function getNextRankIdForStudent(
		studentId: number | undefined
	): number | undefined {
		if (!studentId || !ranks?.length) return undefined;
		const student = students.find((s) => s.id === studentId);
		const currentRankId = student?.currentRankId;
		if (!currentRankId) return ranks[0]?.id;
		const currentIndex = ranks.findIndex(
			(r: { id: number }) => r.id === currentRankId
		);
		if (currentIndex === -1 || currentIndex === ranks.length - 1)
			return currentRankId;
		return ranks[currentIndex + 1]?.id;
	}

	function handleChange(
		e: React.ChangeEvent<
			HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
		>
	) {
		const { name, value } = e.target;
		setFormState((prev) => ({
			...prev,
			[name]: value,
		}));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSaving(true);

		try {
			if (promotion && promotion.id) {
				await updatePromotion(promotion.id, formState);
			} else {
				const createData: CreatePromotionDto = {
					studentId: Number(formState.studentId),
					rankId: Number(formState.rankId),
					promotionDate: formState.promotionDate ?? '',
					coachId: Number(formState.coachId),
					notes: formState.notes,
					dojaangId: Number(formState.dojaangId),
				};
				await createPromotion(createData);
			}
			await fetchPromotions();
			setSaving(false);
			onClose(true);
		} catch {
			toast.error('Failed to save promotion');
			setSaving(false);
		}
	}

	// 5. Render
	return (
		<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
			<div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] flex flex-col">
				<ModalCloseButton
					onClick={() => onClose(false)}
					disabled={saving || loadingPromotions}
				/>

				{promotionsError && (
					<div className="text-red-600 text-center mb-2">
						{promotionsError}
					</div>
				)}

				{loadingPromotions || loadingStudents || loadingCoaches ? (
					<div className="flex-1 flex items-center justify-center text-lg text-blue-600">
						Loading...
					</div>
				) : (
					<form
						className="flex-1 overflow-y-auto pr-2 space-y-3"
						onSubmit={handleSubmit}
					>
						<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
							<StudentSelector
								students={students}
								value={formState.studentId ?? null}
								onChange={(id) => {
									const nextRankId = getNextRankIdForStudent(
										id ?? undefined
									);
									setFormState((prev) => ({
										...prev,
										studentId: id ?? undefined,
										rankId: nextRankId,
									}));
								}}
								disabled={saving}
								label="Student"
							/>
							<RanksSelector
								label="Rank"
								value={formState.rankId ?? 0}
								onChange={(e) =>
									setFormState((prev) => ({
										...prev,
										rankId: e.target.value
											? Number(e.target.value)
											: undefined,
									}))
								}
								disabled={saving}
							/>
							<CoachSelector
								coaches={coaches}
								value={
									formState.coachId !== undefined &&
									formState.coachId !== null
										? String(formState.coachId)
										: ''
								}
								onChange={(e) =>
									setFormState((prev) => ({
										...prev,
										coachId: e.target.value
											? Number(e.target.value)
											: undefined,
									}))
								}
								disabled={saving}
								label="Coach"
							/>
							<LabeledInput
								label="Promotion Date"
								name="promotionDate"
								type="date"
								value={formState.promotionDate ?? ''}
								onChange={handleChange}
								required
								disabled={saving}
							/>
							<div className="col-span-2">
								<label
									htmlFor="notes"
									className="block mb-1 font-medium"
								>
									Notes
								</label>
								<textarea
									id="notes"
									name="notes"
									value={formState.notes ?? ''}
									onChange={handleChange}
									placeholder="Notes"
									disabled={saving}
									className="w-full border rounded px-3 py-2"
								/>
							</div>
						</div>
						<FormActionButtons
							onCancel={() => onClose(false)}
							onSubmitLabel={
								promotion
									? saving
										? 'Saving...'
										: 'Save'
									: saving
									? 'Creating...'
									: 'Create'
							}
							loading={saving}
							disabled={
								JSON.stringify(formState) ===
								JSON.stringify(originalPromotion)
							}
						/>
					</form>
				)}
			</div>
		</div>
	);
}
