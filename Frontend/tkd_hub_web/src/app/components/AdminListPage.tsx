import React from 'react';
import { useRoles } from '../context/RoleContext'; // Import the role context

type AdminListPageProps = {
	title: string;
	loading: boolean;
	error: string | null;
	filters?: React.ReactNode;
	onCreate?: () => void;
	createLabel?: string;
	tableHead: React.ReactNode;
	tableBody: React.ReactNode;
	modals?: React.ReactNode;
};

export const AdminListPage: React.FC<AdminListPageProps> = ({
	title,
	loading,
	error,
	filters,
	onCreate,
	createLabel,
	tableHead,
	tableBody,
	modals,
}) => {
	// 1. Context hooks
	const { role } = useRoles(); // Get the role from context

	// 2. State hooks
	// (No state hooks)

	// 3. Effects
	// (No effects)

	// 4. Functions
	// (No local functions)

	// 5. Render
	return (
		<div className="container py-4">
			<div className="d-flex justify-content-between align-items-center mb-3">
				<h2>{title}</h2>
				{onCreate && role === 'Admin' && (
					<button className="btn btn-success" onClick={onCreate}>
						{createLabel || 'Create'}
					</button>
				)}
			</div>
			{filters && <div className="mb-3">{filters}</div>}
			{error && <div className="alert alert-danger">{error}</div>}
			<div className="table-responsive">
				<table className="table table-striped align-middle">
					<thead>{tableHead}</thead>
					<tbody>{tableBody}</tbody>
				</table>
			</div>
			{modals}
			{loading && (
				<div className="text-center py-3">
					<span
						className="spinner-border"
						role="status"
						aria-hidden="true"
					></span>
				</div>
			)}
		</div>
	);
};
