import React from 'react';
import { useCoaches } from '@/app/context/CoachContext';

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
	// 1. Context hooks
	const { removeCoachFromDojaang } = useCoaches();

	// 2. State hooks
	// (No local state)

	// 3. Effects
	// (No effects)

	// 4. Functions

	// Filter out already managed dojaangs for the select
	const availableDojaangs = allDojaangs.filter(
		(d) => !managedDojaangIds.includes(d.id)
	);

	// Helper to get dojaang name by id
	const getDojaangName = (id: number) =>
		allDojaangs.find((d) => d.id === id)?.name || `Dojaang #${id}`;

	// Remove handler that calls the context method then updates parent state
	const handleRemove = async (dojaangId: number) => {
		if (!coachId) {
			if (onRemove) onRemove(dojaangId);
			return;
		}
		try {
			await removeCoachFromDojaang(coachId, dojaangId);
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

	// 5. Render
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
								{d.name}
							</option>
						))}
					</select>
				</div>
			)}
		</div>
	);
};

export default ManagedDojaangs;
