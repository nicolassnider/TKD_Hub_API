'use client';

// 1. External imports
import { useEffect, useState } from 'react';
import { toast } from 'react-hot-toast';

// 2. App/context/component imports
import CoachesTableRows from '../../components/coaches/CoachesTableRows';
import EditCoach from '../../components/coaches/EditCoach';
import { AdminListPage } from '../../components/AdminListPage';
import { useUsers } from '@/app/context/UserContext';
import { useCoaches } from '@/app/context/CoachContext';

const ModalConfirmDelete: React.FC<{
	loading: boolean;
	onCancel: () => void;
	onConfirm: () => void;
}> = ({ loading, onCancel, onConfirm }) => (
	<div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
		<div className="bg-white rounded shadow-lg p-6 w-full max-w-xs">
			<h3 className="text-lg font-semibold mb-4 text-center">
				Confirm Delete
			</h3>
			<p className="mb-6 text-center">
				Are you sure you want to delete this coach?
			</p>
			<div className="flex justify-end gap-2">
				<button
					className="px-4 py-2 rounded bg-gray-300 text-gray-800 hover:bg-gray-400"
					onClick={onCancel}
					disabled={loading}
				>
					Cancel
				</button>
				<button
					className="px-4 py-2 rounded bg-red-600 text-white hover:bg-red-700"
					onClick={onConfirm}
					disabled={loading}
				>
					{loading ? 'Deleting...' : 'Delete'}
				</button>
			</div>
		</div>
	</div>
);

export default function CoachesAdmin() {
	// 1. Context hooks
	const { reactivateUser } = useUsers();
	const { coaches, loading, error, fetchCoaches, deleteCoach } = useCoaches();

	// 2. State hooks
	const [editId, setEditId] = useState<number | null>(null);
	const [showAdd, setShowAdd] = useState(false);
	const [confirmId, setConfirmId] = useState<number | null>(null);
	const [deleteLoading, setDeleteLoading] = useState(false);
	const [showAll, setShowAll] = useState(false);

	// 3. Effects
	useEffect(() => {
		handleRefresh();
		// eslint-disable-next-line
	}, []);

	// 4. Functions
	const handleRefresh = () => {
		fetchCoaches();
	};

	const handleReactivate = async (coachId: number) => {
		try {
			await reactivateUser(coachId);
			toast.success('Coach reactivated!');
			handleRefresh();
		} catch {
			toast.error('Failed to reactivate coach.');
		}
	};

	function handleEditClose(wasUpdated?: boolean) {
		setEditId(null);
		if (wasUpdated) handleRefresh();
	}

	function handleAddClose(wasCreated?: boolean) {
		setShowAdd(false);
		if (wasCreated) toast.success('Coach created!');
		handleRefresh();
	}

	async function handleDelete(coachId: number) {
		setDeleteLoading(true);
		try {
			await deleteCoach(coachId);
			toast.success('Coach deleted (soft delete)!');
			handleRefresh();
		} catch {
			toast.error('Failed to delete coach.');
		} finally {
			setDeleteLoading(false);
			setConfirmId(null);
		}
	}

	// Only filter here, don't pass showAll to CoachesTableRows
	const filteredCoaches = showAll
		? coaches
		: coaches.filter((coach) => coach.isActive !== false);

	// 5. Render
	return (
		<>
			<div className="flex items-center gap-4 mb-0 pl-4">
				<label
					htmlFor="showAllSwitch"
					className="font-medium text-gray-700 flex items-center gap-4 cursor-pointer"
				>
					<span className="mr-4">Show inactive coaches</span>
					{/* ON/OFF Switch */}
					<span className="relative inline-block w-12 align-middle select-none transition duration-200 ease-in mr-2">
						<input
							id="showAllSwitch"
							type="checkbox"
							checked={showAll}
							onChange={() => setShowAll((v) => !v)}
							className="sr-only peer"
						/>
						<span className="block w-12 h-6 bg-gray-300 rounded-full peer-checked:bg-blue-600 transition"></span>
						<span className="dot absolute left-1 top-1 bg-white w-4 h-4 rounded-full transition peer-checked:translate-x-6 tkd-switch-dot"></span>
					</span>
					<span className="ml-2 text-sm text-gray-500">
						{showAll ? 'All' : 'Active'}
					</span>
				</label>
			</div>
			<AdminListPage
				title="Coaches Administration"
				onCreate={() => setShowAdd(true)}
				loading={loading}
				error={error}
				modals={
					<>
						{showAdd && (
							<EditCoach
								coachId={0}
								onClose={handleAddClose}
								handleRefresh={handleRefresh}
							/>
						)}
						{editId !== null && (
							<EditCoach
								coachId={editId}
								onClose={handleEditClose}
								handleRefresh={handleRefresh}
							/>
						)}
						{confirmId !== null && (
							<ModalConfirmDelete
								loading={deleteLoading}
								onCancel={() => setConfirmId(null)}
								onConfirm={() => handleDelete(confirmId)}
							/>
						)}
					</>
				}
				tableHead={
					<tr className="bg-gray-100">
						<th className="px-4 py-2 text-left font-semibold text-gray-700">
							ID
						</th>
						<th className="px-4 py-2 text-left font-semibold text-gray-700">
							Name
						</th>
						<th className="px-4 py-2 text-left font-semibold text-gray-700">
							Email
						</th>
						<th className="px-4 py-2 text-left font-semibold text-gray-700">
							Options
						</th>
					</tr>
				}
				tableBody={
					<CoachesTableRows
						coaches={filteredCoaches}
						onEdit={setEditId}
						onRequestDelete={setConfirmId}
						onReactivate={handleReactivate}
						isActiveFilter={showAll ? null : true}
					/>
				}
			/>
		</>
	);
}
