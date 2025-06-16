import { TrainingClass } from '@/app/types/TrainingClass';
import TableActionButton from '../common/actionButtons/TableActionButton';
import NotFoundTableRow from '../common/NotFoundTableRow';
import { daysOfWeek } from '@/app/const/daysOfWeek';

type Props = {
	classes: TrainingClass[];
	onEdit: (id: number) => void;
	onRequestDelete: (id: number) => void;
	onAddStudents?: (id: number) => void;
};

const ClassTableRows: React.FC<Props> = ({
	classes,
	onEdit,
	onRequestDelete,
	onAddStudents,
}) => {
	// 1. Context hooks
	// (none needed)

	// 2. State hooks
	// (none needed)

	// 3. Effects
	// (none needed)

	// 4. Functions
	const getDay = (day: number) => {
		const dayObject = daysOfWeek.find((d) => d.value === day);
		return dayObject ? dayObject.label : '';
	};

	// 5. Render
	return (
		<>
			{classes.length === 0 ? (
				<NotFoundTableRow colSpan={6} message="No classes found." />
			) : (
				classes.map((trainingClass) => (
					<tr key={trainingClass.id}>
						<td className="px-4 py-2">{trainingClass.name}</td>
						<td className="px-4 py-2">{trainingClass.coachName}</td>
						<td className="px-4 py-2">
							{trainingClass.dojaangName}
						</td>
						<td className="px-4 py-2">
							{trainingClass.schedules &&
							trainingClass.schedules.length > 0 ? (
								<ul>
									{trainingClass.schedules.map((s) => (
										<li key={s.id}>
											{getDay(s.day)}, {s.startTime}-
											{s.endTime}
										</li>
									))}
								</ul>
							) : (
								<span>No schedules</span>
							)}
						</td>
						<td className="px-4 py-2">
							<div className="flex gap-2">
								<TableActionButton
									onClick={() => onEdit(trainingClass.id)}
									title="Edit"
									iconClass="bi bi-pencil-square"
									colorClass="bg-blue-600 text-white hover:bg-blue-700"
								/>
								<TableActionButton
									onClick={() =>
										onRequestDelete(trainingClass.id)
									}
									title="Delete"
									iconClass="bi bi-trash"
									colorClass="bg-red-600 text-white hover:bg-red-700"
								/>
								{onAddStudents && (
									<TableActionButton
										onClick={() =>
											onAddStudents(trainingClass.id)
										}
										title="Add Students"
										iconClass="bi bi-person-plus"
										colorClass="bg-green-600 text-white hover:bg-green-700"
									/>
								)}
							</div>
						</td>
					</tr>
				))
			)}
		</>
	);
};

export default ClassTableRows;
