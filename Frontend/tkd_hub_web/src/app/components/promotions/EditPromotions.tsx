import React, { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useApiConfig } from "@/app/context/ApiConfigContext";
import StudentSelector from "../students/StudentSelector";
import { apiRequest } from "@/app/utils/api";
import { Student } from "@/app/types/Student";
import RanksSelector from "../common/selectors/RanksSelector";
import { Promotion } from "@/app/types/Promotion";
import CoachSelector from "../coaches/CoachSelector";
import { useRankContext } from "@/app/context/RankContext";
import ModalCloseButton from "../common/ModalCloseButton";
import FormActionButtons from "../common/FormActionButtons";
import equal from "fast-deep-equal";
import LabeledInput from "../common/inputs/LabeledInput";
import DojaangSelector from "../dojaangs/DojaangSelector";



type PromotionRequest = {
	studentId: number;
	rankId: number;
	promotionDate: string;
	coachId: number;
	notes?: string;
	dojaangId: number;
};

interface Props {
	promotionId?: number;
	onClose: (refresh?: boolean) => void;
}

const EditPromotion: React.FC<Props> = ({ promotionId, onClose }) => {
	const [students, setStudents] = useState<Student[]>([]);
	const { ranks } = useRankContext();
	const [saving, setSaving] = useState(false);
	const [loading, setLoading] = useState(false);
	const [error, setError] = useState<string | null>(null);

	const [form, setForm] = useState<PromotionRequest>({
		studentId: 0,
		rankId: 0,
		promotionDate: "",
		coachId: 0,
		notes: "",
		dojaangId: 0,
	});
	const [originalForm, setOriginalForm] = useState<PromotionRequest>(form);

	const { getToken } = useAuth();
	const { baseUrl } = useApiConfig();

	// Load students
	useEffect(() => {
		apiRequest<{ data: { data: Student[] } }>(`${baseUrl}/Students`, {
			headers: { Authorization: `Bearer ${getToken()}` },
		})
			.then(res => setStudents(res.data.data))
			.catch(() => setStudents([]));
	}, [baseUrl, getToken]);

	useEffect(() => {
		console.log("Form changed:", form);
	}, [form]);

	// Load promotion for edit
	useEffect(() => {
		if (promotionId) {
			setLoading(true);
			apiRequest<{ data: Promotion }>(`${baseUrl}/Promotions/${promotionId}`, {
				headers: { Authorization: `Bearer ${getToken()}` },
			})
				.then((res) => {
					const data = res.data; // <-- extract the data property
					const loadedForm: PromotionRequest = {
						studentId: data.studentId,
						rankId: data.rankId,
						promotionDate: data.promotionDate ? data.promotionDate.slice(0, 10) : "",
						coachId: data.coachId,
						notes: data.notes || "",
						dojaangId: data.dojaangId,
					};
					setForm(loadedForm);
					setOriginalForm(loadedForm);
				})
				.catch(() => setError("Failed to load promotion"))
				.finally(() => setLoading(false));
		} else {
			const emptyForm = {
				studentId: 0,
				rankId: 0,
				promotionDate: "",
				coachId: 0,
				notes: "",
				dojaangId: 0,
			};
			setForm(emptyForm);
			setOriginalForm(emptyForm);
		}
	}, [promotionId, baseUrl, getToken]);

	// Compute next rank for selected student (only on create)
	useEffect(() => {
		if (
			!form.studentId ||
			students.length === 0 ||
			ranks.length === 0 ||
			promotionId // <-- Only run on create, not edit
		)
			return;
		const selectedStudent = students.find(s => s.id === form.studentId);
		const currentRankId = selectedStudent?.currentRankId;
		const currentRankIndex = ranks.findIndex(r => r.id === currentRankId);
		const nextRank = currentRankIndex >= 0 ? ranks[currentRankIndex + 1] : undefined;
		const newAvailableRanks = nextRank ? [nextRank] : [];
		if (newAvailableRanks.length > 0) {
			setForm(f => ({ ...f, rankId: newAvailableRanks[0].id }));
		}
	}, [form.studentId, students, ranks, promotionId]);

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault();
		setSaving(true);
		setLoading(true);
		setError(null);

		// Require coachId
		if (!form.coachId) {
			setError("Coach is required.");
			setSaving(false);
			setLoading(false);
			return;
		}

		try {
			const method = promotionId ? "PUT" : "POST";
			const url = promotionId
				? `${baseUrl}/Promotions/${promotionId}`
				: `${baseUrl}/Promotions`;

			const payload: PromotionRequest = { ...form };

			await apiRequest(url, {
				method,
				headers: {
					"Content-Type": "application/json",
					Authorization: `Bearer ${getToken()}`,
				},
				body: JSON.stringify(payload),
			});
			onClose(true);
		} catch {
			setError("Failed to save promotion");
		} finally {
			setSaving(false);
			setLoading(false);
		}
	};

	return (
		<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
			<div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] flex flex-col">
				<ModalCloseButton onClick={() => onClose(false)} disabled={saving} />
				<h3 className="text-lg font-semibold">
					{promotionId ? "Edit Promotion" : "Add Promotion"}
				</h3>

				<form className="flex-1 overflow-y-auto pr-2 space-y-4" onSubmit={handleSubmit}>
					<div className="flex justify-between items-center border-b px-4 sm:px-6 py-4">


					</div>
					<div className="px-4 sm:px-6 py-4 space-y-4">
						{error && <div className="text-red-600">{error}</div>}

						<StudentSelector
							value={form.studentId}
							onChange={val => setForm(f => ({ ...f, studentId: val ?? 0 }))}
							disabled={loading}
							students={students}
						/>

						<RanksSelector
							value={form.rankId}
							onChange={e => setForm(f => ({ ...f, rankId: Number(e.target.value) }))}
							disabled={loading}
							ranks={
								promotionId
									? ranks // <-- show all ranks on edit
									: (() => {
										const selectedStudent = students.find(s => s.id === form.studentId);
										const currentRankId = selectedStudent?.currentRankId;
										const currentRankIndex = ranks.findIndex(r => r.id === currentRankId);
										const nextRank = currentRankIndex >= 0 ? ranks[currentRankIndex + 1] : undefined;
										return nextRank ? [nextRank] : [];
									})()
							}
						/>

						<LabeledInput
							label="Promotion Date"
							name="promotionDate"
							type="date"
							value={form.promotionDate}
							onChange={e => setForm(f => ({ ...f, promotionDate: e.target.value }))}
							required
							disabled={loading}
							placeholder="Select promotion date"
							title="Promotion Date"
						/>

						<CoachSelector
							value={form.coachId ? String(form.coachId) : ""}
							onChange={e => setForm(f => ({
								...f,
								coachId: e.target.value && !isNaN(Number(e.target.value)) ? Number(e.target.value) : 0
							}))}
							disabled={loading}
							baseUrl={baseUrl}
						/>

						<LabeledInput
							label="Notes"
							name="notes"
							type="textarea"
							value={form.notes}
							onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
							disabled={loading}
							placeholder="Enter notes"
							title="Notes"
						/>
						<DojaangSelector
							value={form.dojaangId}
							onChange={val => setForm(f => ({ ...f, dojaangId: val ?? 0 }))}
							disabled={loading}
						// If you have a dojaangs list, pass it as a prop, e.g. allDojaangs={dojaangs}
						// allDojaangs={dojaangs}
						/>
						<FormActionButtons
							onCancel={() => onClose(false)}
							onSubmitLabel={promotionId ? "Update" : "Create"}
							loading={saving}
							disabled={promotionId ? equal(form, originalForm) : saving || loading}
						/>
					</div>
				</form>
			</div>
		</div>
	);
};

export default EditPromotion;
