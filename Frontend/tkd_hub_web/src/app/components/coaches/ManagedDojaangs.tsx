import React from 'react';
import { useAuth } from '../../context/AuthContext';
import { useApiConfig } from '@/app/context/ApiConfigContext';
import { apiRequest } from '@/app/utils/api';

type ManagedDojaangsProps = {
	managedDojaangIds: number[];
	allDojaangs?: { id: number; name: string }[];
	onAdd?: (id: number) => void;
	onRemove?: (id: number) => void;
	coachId?: number;
	onRemoveSuccess?: (id: number) => void;
};

const ManagedDojaangs: React.FC<ManagedDojaangsProps> = ({
	managedDojaangIds,
	allDojaangs = [],
	onAdd,
	onRemove,
	coachId,
	onRemoveSuccess,
}) => {
	const { getToken } = useAuth();
	const { baseUrl } = useApiConfig();

	// Filter out already managed dojaangs for the select
	const availableDojaangs = allDojaangs.filter(
		(d) => !managedDojaangIds.includes(d.id)
	);

	// Helper to get dojaang name by id
	const getDojaangName = (id: number) =>
		allDojaangs.find((d) => d.id === id)?.name || `Dojaang #${id}`;

	// Remove handler that calls the API then updates parent state
	const handleRemove = async (dojaangId: number) => {
		if (!coachId) {
			if (onRemove) onRemove(dojaangId);
			return;
		}
		try {
			const token = getToken();
			const res = await apiRequest(
				`${baseUrl}/Coaches/${coachId}/dojaang/${dojaangId}`,
				{
					method: 'DELETE',
					headers: {
						...(token ? { Authorization: `Bearer ${token}` } : {}),
					},
				}
			);
			// Cast res to Response for type safety
			const response = res as Response;
			if (!response.ok) throw new Error('Failed to remove managed dojaang');
			if (onRemove) onRemove(dojaangId);
			if (onRemoveSuccess) onRemoveSuccess(dojaangId);
		} catch (err: unknown) {
			if (err instanceof Error) {
				alert(err.message || 'Failed to remove managed dojaang.');
			} else {
				alert('Failed to remove managed dojaang.');
			}
		}
	};

	return (
		<div>
			<ul className="list-none mb-2 pl-0">
				{managedDojaangIds.length === 0 && (
					<li className="text-muted">None</li>
				)}
				{managedDojaangIds.map((id) => (
					<li key={id} className="flex items-center gap-2">
						<span>
							{getDojaangName(id)}{' '}
							<span className="text-xs text-gray-500">#{id}</span>
						</span>
						{onRemove && (
							<button
								type="button"
								className="ml-2 text-red-500 hover:text-red-700 text-xs"
								onClick={() => handleRemove(id)}
								title="Remove"
							>
								Remove
							</button>
						)}
					</li>
				))}
			</ul>
			{onAdd && availableDojaangs.length > 0 && (
				<div className="flex items-center gap-2">
					<label htmlFor="add-dojaang-select" className="sr-only">
						Add Dojaang
					</label>
					<select
						id="add-dojaang-select"
						className="border rounded px-2 py-1"
						defaultValue=""
						onChange={(e) => {
							const selectedId = Number(e.target.value);
							if (selectedId && onAdd) onAdd(selectedId);
							e.target.value = '';
						}}
					>
						<option value="" disabled>
							Add Dojaang...
						</option>
						{availableDojaangs.map((d) => (
							<option key={d.id} value={d.id}>
								{d.name} #{d.id}
							</option>
						))}
					</select>
				</div>
			)}
		</div>
	);
};

export default ManagedDojaangs;
