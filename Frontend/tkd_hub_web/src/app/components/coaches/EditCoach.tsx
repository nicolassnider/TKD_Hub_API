import React, { useState, useEffect } from 'react';
import RanksSelector from '@/app/components/common/selectors/RanksSelector';
import { useAuth } from '@/app/context/AuthContext';
import { apiRequest } from '@/app/utils/api';
import toast from 'react-hot-toast';
import { useApiConfig } from '@/app/context/ApiConfigContext';
import GenderSelector from '../common/selectors/GenderSelector';
import equal from 'fast-deep-equal';
import ModalCloseButton from '../common/actionButtons/ModalCloseButton';
import LabeledInput from '../common/inputs/LabeledInput';
import { Coach } from '@/app/types/Coach';

type EditCoachProps = {
	coachId: number;
	onClose: (wasCreated?: boolean) => void;
	handleRefresh?: () => void;
};

type ApiCoachResponse = {
	data?: {
		coach?: Coach;
	};
};

type ApiDojaang = {
	id: number;
	name: string;
};

type ApiDojaangResponse = ApiDojaang[] | { data: ApiDojaang[] };

const EditCoach: React.FC<EditCoachProps> = ({
	coachId,
	onClose,
	handleRefresh,
}) => {
	const [loading, setLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);
	const [allDojaangs, setAllDojaangs] = useState<
		{ id: number; name: string }[]
	>([]);
	const [form, setForm] = useState<Omit<Coach, 'id'> | null>(null);
	const [originalForm, setOriginalForm] = useState<Omit<Coach, 'id'> | null>(null); // <-- Add this line
	const { getToken } = useAuth();
	const { baseUrl } = useApiConfig();
	const [saving, setSaving] = useState(false);

	useEffect(() => {
		const fetchCoachAndDojaangs = async () => {
			try {
				if (coachId !== 0) {
					const data: ApiCoachResponse =
						await apiRequest<ApiCoachResponse>(
							`${baseUrl}/Coaches/${coachId}`,
							{},
							getToken
						);
					const coachData: Coach = data.data?.coach || ({} as Coach);
					const loadedForm = {
						firstName: coachData.firstName,
						lastName: coachData.lastName,
						email: coachData.email,
						phoneNumber: coachData.phoneNumber ?? '',
						gender: coachData.gender,
						dateOfBirth: coachData.dateOfBirth ?? '',
						dojaangId: coachData.dojaangId ?? null,
						currentRankId: coachData.currentRankId,
						joinDate: coachData.joinDate ?? '',
						roles: coachData.roles ?? [],
						managedDojaangIds: coachData.managedDojaangIds ?? [],
						isActive: coachData.isActive ?? true,
					};
					setForm(loadedForm);
					setOriginalForm(loadedForm); // <-- Set originalForm
				} else {
					const emptyForm = {
						firstName: '',
						lastName: '',
						email: '',
						phoneNumber: '',
						gender: 0,
						dateOfBirth: '',
						dojaangId: null,
						currentRankId: 0,
						joinDate: '',
						roles: [],
						managedDojaangIds: [],
						isActive: true,
					};
					setForm(emptyForm);
					setOriginalForm(emptyForm); // <-- Set originalForm
				}
				const dojaangsData: ApiDojaangResponse =
					await apiRequest<ApiDojaangResponse>(
						`${baseUrl}/Dojaang`,
						{},
						getToken
					);
				setAllDojaangs(
					Array.isArray(dojaangsData)
						? dojaangsData
						: dojaangsData.data || []
				);
			} catch (err: unknown) {
				if (err instanceof Error)
					setError(err.message || 'Error loading coach');
				else setError('Error loading coach');
			} finally {
				setLoading(false);
			}
		};
		fetchCoachAndDojaangs();
	}, [coachId, getToken, baseUrl]);

	const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
		const { name, value } = e.target;
		setForm(prev => ({
			...prev!,
			[name]: name === "gender" ? Number(value) : value,
		}));
	};


	const handleUpdate = async () => {
		if (!form) return;
		setSaving(true); // <-- Start saving
		try {
			await apiRequest(
				`${baseUrl}/Coaches/upsert`,
				{
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({
						id: coachId,
						firstName: form.firstName,
						lastName: form.lastName,
						email: form.email,
						phoneNumber: form.phoneNumber ?? '',
						gender: form.gender ?? 0,
						dateOfBirth: form.dateOfBirth
							? new Date(form.dateOfBirth).toISOString()
							: null,
						dojaangId: form.dojaangId ?? 0,
						rankId: form.currentRankId ?? 0,
						joinDate: form.joinDate
							? new Date(form.joinDate).toISOString()
							: null,
						roleIds: [2],
						managedDojaangIds: form.managedDojaangIds ?? [],
					}),
				},
				getToken
			);
			if (handleRefresh) handleRefresh();
			toast.success('Coach updated!');
			onClose();
		} catch (err: unknown) {
			if (err instanceof Error)
				toast.error(err.message || 'Failed to upsert coach');
			else toast.error('Failed to upsert coach');
		} finally {
			setSaving(false); // <-- End saving
		}
	};

	if (loading) return <div className="text-center">Loading coach...</div>;
	if (error) return <div className="text-danger text-center">{error}</div>;
	if (!form) return null;

	return (
		<div className="fixed inset-0 bg-black bg-opacity-30 flex items-center justify-center z-50">
			<div className="bg-white rounded shadow-lg p-6 w-full max-w-lg relative max-h-[90vh] flex flex-col">
				<ModalCloseButton onClick={() => onClose(false)} disabled={saving} />

				<form
					className="flex-1 overflow-y-auto pr-2 space-y-3"
					onSubmit={(e) => {
						e.preventDefault();
						handleUpdate();
					}}
				>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">


						<LabeledInput
							label="First Name"
							name="firstName"
							value={form.firstName}
							onChange={handleChange}
							disabled={saving}
						/>
						<LabeledInput
							label="Last Name"
							name="lastName"
							value={form.lastName}
							onChange={handleChange}
							disabled={saving}
						/>

					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<LabeledInput
							label="Email"
							name="email"
							type="email"
							value={form.email}
							onChange={handleChange}
							disabled={saving}
							placeholder="Enter email address"
						/>
						<LabeledInput
							label="Phone Number"
							name="phoneNumber"
							type="tel"
							value={form.phoneNumber || ''}
							onChange={handleChange}
							disabled={saving}
							placeholder="Enter phone number"
						/>

					</div>
					<div className="grid grid-cols-1 md:grid-cols-2 gap-3">
						<div>
							<label
								className="block font-medium mb-1"
								htmlFor="gender"
							>
								Gender
							</label>
							<GenderSelector
								value={form.gender}
								onChange={handleChange}
								disabled={loading}
								className="px-3 py-2"
							/>
						</div>
						<LabeledInput
							label="Date of Birth"
							name="dateOfBirth"
							type="date"
							value={form.dateOfBirth || ''}
							onChange={handleChange}
							disabled={saving}
						/>
					</div>
					<div>
						<RanksSelector
							value={form.currentRankId ?? 0}
							onChange={(e) =>
								setForm((f) => ({
									...f!,
									currentRankId: e.target.value
										? Number(e.target.value)
										: 0,
								}))
							}
							disabled={loading}
							filter="black"
						/>
					</div>
					{coachId !== 0 && (
						<div>
							<label className="block font-medium mb-1">
								Managed Dojaangs
							</label>
							{/* Add Dojaang Selector */}
							<div className="flex gap-2 mb-2">
								<select
									className="form-select rounded border border-gray-300 px-2 py-1"
									value=""
									onChange={(e) => {
										const id = Number(e.target.value);
										if (
											id &&
											!(
												form.managedDojaangIds ?? []
											).includes(id)
										) {
											setForm((f) => ({
												...f!,
												managedDojaangIds: [
													...(f?.managedDojaangIds ??
														[]),
													id,
												],
											}));
										}
									}}
									title="Add Managed Dojaang"
									aria-label="Add Managed Dojaang"
								>
									<option value="">Add Dojaang...</option>
									{allDojaangs
										.filter(
											(d) =>
												!(
													form.managedDojaangIds ?? []
												).includes(d.id)
										)
										.map((d) => (
											<option key={d.id} value={d.id}>
												{d.name} #{d.id}
											</option>
										))}
								</select>
							</div>
							{/* List of Managed Dojaangs */}
							<ul>
								{(form.managedDojaangIds ?? []).map((id) => {
									const dojaang = allDojaangs.find(
										(d) => d.id === id
									);
									if (!dojaang) return null;
									return (
										<li
											key={id}
											className="flex items-center gap-2 mb-1"
										>
											<span>
												{dojaang.name}{' '}
												<span className="text-xs text-gray-500">
													#{id}
												</span>
											</span>
											<button
												type="button"
												className="text-red-600 hover:underline text-xs"
												onClick={() => {
													setForm((f) => ({
														...f!,
														managedDojaangIds: (
															f?.managedDojaangIds ??
															[]
														).filter(
															(did) => did !== id
														),
													}));
												}}
											>
												Remove
											</button>
										</li>
									);
								})}
							</ul>
						</div>
					)}
				</form>
				<div className="flex justify-center gap-2 mt-4">
					<button
						type="button"
						className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400 flex items-center justify-center"
						onClick={() => onClose(false)}
					>
						<i className="bi bi-x-lg md:hidden text-lg"></i>
						<span className="hidden md:inline">Cancel</span>
					</button>
					<button
						type="submit"
						className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed flex items-center justify-center"
						disabled={loading || equal(form, originalForm)}
					>
						<i className="bi bi-check-lg md:hidden text-lg"></i>
						<span className="hidden md:inline">{coachId ? "Update" : "Create"}</span>
					</button>
				</div>
			</div>
		</div>
	);
};

export default EditCoach;
