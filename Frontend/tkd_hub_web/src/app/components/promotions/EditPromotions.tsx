"use client";
import React, { useEffect, useState } from "react";
import { usePromotions } from "@/app/context/PromotionContext";
import { Promotion } from "@/app/types/Promotion";
import LabeledInput from "../common/inputs/LabeledInput";
import StudentSelector from "../students/StudentSelector";
import { useStudents } from "@/app/context/StudentContext";
import RanksSelector from "../common/selectors/RanksSelector";

type EditPromotionProps = {
	promotionId?: number; // If undefined, create mode
	onClose: (refresh?: boolean) => void;
	studentId?: number; // <-- Add this line
};

export default function EditPromotion({ promotionId, onClose }: EditPromotionProps) {
	const {
		getPromotionById,
		createPromotion,
		updatePromotion,
		fetchPromotions,
		loading,
		error,
	} = usePromotions();

	const [promotion, setPromotion] = useState<Partial<Promotion>>({
		studentId: undefined,
		rankId: undefined,
		promotionDate: "",
		notes: "",
	});
	const [originalPromotion, setOriginalPromotion] = useState<Partial<Promotion> | null>(null);
	const [saving, setSaving] = useState(false);
	const [localError, setLocalError] = useState<string | null>(null);
	const { students, loading: studentsLoading } = useStudents(); // Get students from context/provider


	// Fetch promotion for edit mode, or set empty for create mode
	useEffect(() => {
		let ignore = false;
		async function fetchPromotion() {
			setLocalError(null);
			if (!promotionId) {
				setPromotion({
					studentId: undefined,
					rankId: undefined,
					promotionDate: "",
					notes: "",
				});
				setOriginalPromotion({
					studentId: undefined,
					rankId: undefined,
					promotionDate: "",
					notes: "",
				});
				return;
			}
			try {
				const data = await getPromotionById(promotionId);
				if (!ignore && data) {
					setPromotion(data);
					setOriginalPromotion(data);
				}
			} catch {
				if (!ignore) setLocalError("Failed to fetch promotion");
			}
		}
		fetchPromotion();
		return () => {
			ignore = true;
		};
	}, [promotionId, getPromotionById]);

	function handleChange(e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) {
		const { name, value } = e.target;
		setPromotion(prev => ({
			...prev,
			[name]: value,
		}));
	}

	async function handleSubmit(e: React.FormEvent) {
		e.preventDefault();
		setSaving(true);
		setLocalError(null);

		try {
			if (promotionId) {
				await updatePromotion(promotionId, promotion);
			} else {
				const { ...createData } = promotion as Promotion; // Removed unused variables
				await createPromotion(createData);
			}
			fetchPromotions();
			onClose(true);
		} catch {
			setLocalError("Failed to save promotion");
		} finally {
			setSaving(false);
		}
	}
	return (
		<div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
			<div className="bg-white rounded-lg shadow-lg w-full max-w-lg mx-auto relative max-h-[90vh] flex flex-col">
				<button
					type="button"
					className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 text-2xl font-bold focus:outline-none"
					aria-label="Close"
					onClick={() => onClose(false)}
					disabled={saving}
				>
					&times;
				</button>
				<div className="px-4 pt-8 pb-2 flex-1 overflow-y-auto">
					<h2 className="text-xl font-semibold mb-6 text-center">
						{promotionId ? "Edit Promotion" : "Create Promotion"}
					</h2>
					{(loading || saving || studentsLoading) && <div className="text-center text-gray-600">Loading...</div>}
					{(error || localError) && <div className="text-red-600 text-center">{error || localError}</div>}
					{!loading && !saving && !studentsLoading && (
						<form onSubmit={handleSubmit} className="flex flex-col gap-4">
							<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
								<StudentSelector
									students={students}
									value={promotion.studentId ?? null}
									onChange={id =>
										setPromotion(prev => ({
											...prev,
											studentId: id ?? undefined,
										}))
									}
									disabled={saving}
									label="Student"
								/>
								<RanksSelector
									value={promotion.rankId ?? 0}
									onChange={e =>
										setPromotion(prev => ({
											...prev,
											rankId: e.target.value ? Number(e.target.value) : undefined,
										}))
									}
									disabled={saving}
								/>
								<LabeledInput
									label="Promotion Date"
									name="promotionDate"
									type="date"
									value={promotion.promotionDate ?? ""}
									onChange={handleChange}
									required
									disabled={saving}
								/>
								<div className="col-span-2">
									<label htmlFor="notes" className="block mb-1 font-medium">
										Notes
									</label>
									<textarea
										id="notes"
										name="notes"
										value={promotion.notes ?? ""}
										onChange={handleChange}
										placeholder="Notes"
										disabled={saving}
										className="w-full border rounded px-3 py-2"
									/>
								</div>
							</div>
							<div className="flex gap-2 justify-end mt-4">
								<button
									type="button"
									onClick={() => onClose(false)}
									className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300"
									disabled={saving}
								>
									Cancel
								</button>
								<button
									type="submit"
									className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
									disabled={saving || JSON.stringify(promotion) === JSON.stringify(originalPromotion)}
								>
									{promotionId ? (saving ? "Saving..." : "Save") : (saving ? "Creating..." : "Create")}
								</button>
							</div>
						</form>
					)}
				</div>
			</div>
		</div>
	);
}
