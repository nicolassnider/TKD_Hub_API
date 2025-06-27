import { TrainingClass } from '@/app/types/TrainingClass';
import TableActionButton from '../common/actionButtons/TableActionButton';
import NotFoundTableRow from '../common/NotFoundTableRow';
import { daysOfWeek } from '@/app/const/daysOfWeek';


type Props = {
	classes: TrainingClass[];
	onEdit: (id: number) => void;
	onRequestDelete: (id: number) => void;
	onAddStudents?: (id: number) => void;
	onManageAssistance?: (id: number) => void; // <-- Add this
};

const ClassTableRows: React.FC<Props> = ({
	classes,
	onEdit,
	onRequestDelete,
	onAddStudents,
	onManageAssistance, // <-- Add this

}) => {

	const getDay = (day: number) => {
		const dayObject = daysOfWeek.find((d) => d.value === day);
		return dayObject ? dayObject.label : '';
	};

	return (
		<>
			{classes.length === 0 ? (
				<NotFoundTableRow colSpan={6} message="No classes found." />
			) : (
				classes.map((trainingClass) => (
					<tr key={trainingClass.id}>
						<td className="px-4 py-2">{trainingClass.name}</td>
						<td className="px-4 py-2">{trainingClass.coachName}</td>
						<td className="px-4 py-2">{trainingClass.dojaangName}</td>
						<td className="px-4 py-2">
							{trainingClass.schedules && trainingClass.schedules.length > 0 ? (
								<ul>
									{trainingClass.schedules.map((s) => (
										<li key={s.id}>
											{getDay(Number(s.day))}, {s.startTime}-{s.endTime}
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
									onClick={() => onRequestDelete(trainingClass.id)}
									title="Delete"
									iconClass="bi bi-trash"
									colorClass="bg-red-600 text-white hover:bg-red-700"
								/>
								{onAddStudents && (
									<TableActionButton
										onClick={() => onAddStudents(trainingClass.id)}
										title="Add Students"
										iconClass="bi bi-person-plus"
										colorClass="bg-green-600 text-white hover:bg-green-700"
									/>
								)}
								{/* Manage Assistance Button */}
								{/* Manage Assistance Button */}
								{(() => {
									// Find the latest schedule (by day and time) for this class
									let latestSchedule = null;
									if (trainingClass.schedules && trainingClass.schedules.length > 0) {
										// Sort schedules by day (assuming 0=Sunday, 6=Saturday) and time
										const sorted = [...trainingClass.schedules].sort((a, b) => {
											if (a.day !== b.day) return Number(b.day) - Number(a.day);
											return b.startTime.localeCompare(a.startTime);
										});
										latestSchedule = sorted[0];
									}
									if (latestSchedule) {
										return (
											<TableActionButton
												onClick={() => {
													if (onManageAssistance) onManageAssistance(trainingClass.id);
												}}
												title={`Manage Assistance (${getDay(Number(latestSchedule.day))}, ${latestSchedule.startTime})`}
												iconClass="bi bi-calendar-check"
												colorClass="bg-indigo-600 text-white hover:bg-indigo-700"
											/>
										);
									}
									return null;
								})()}
							</div>
						</td>
					</tr>
				))
			)}
			{/* DO NOT render the modal here */}
		</>
	);
};

export default ClassTableRows;
