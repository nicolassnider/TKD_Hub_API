import { TrainingClass } from "@/app/types/TrainingClass";
import TableActionButton from "../common/actionButtons/TableActionButton";
import { daysOfWeek } from "@/app/const/daysOfWeek";
import TableRows, { TableColumn } from "../common/tableRows/TableRows";

type Props = {
  classes: TrainingClass[];
  onEdit: (id: number) => void;
  onRequestDelete: (id: number) => void;
  onAddStudents?: (id: number) => void;
  onManageAssistance?: (id: number) => void;
};

const getDay = (day: number) => {
  const dayObject = daysOfWeek.find((d) => d.value === day);
  return dayObject ? dayObject.label : "";
};

const columns: TableColumn<TrainingClass>[] = [
  {
    label: "Class Name",
    render: (trainingClass) => trainingClass.name,
  },
  {
    label: "Coach",
    render: (trainingClass) => trainingClass.coachName,
  },
  {
    label: "Dojaang",
    render: (trainingClass) => trainingClass.dojaangName,
  },
  {
    label: "Schedules",
    render: (trainingClass) =>
      trainingClass.schedules && trainingClass.schedules.length > 0 ? (
        <ul>
          {trainingClass.schedules.map((s) => (
            <li key={s.id}>
              {getDay(Number(s.day))}, {s.startTime}-{s.endTime}
            </li>
          ))}
        </ul>
      ) : (
        <span>No schedules</span>
      ),
  },
];

const ClassTableRows: React.FC<Props> = ({
  classes,
  onEdit,
  onRequestDelete,
  onAddStudents,
  onManageAssistance,
}) => {
  return (
    <TableRows
      data={classes}
      columns={columns}
      actions={(trainingClass) => {
        // Find the latest schedule for Manage Assistance button
        let latestSchedule = null;
        if (trainingClass.schedules && trainingClass.schedules.length > 0) {
          const sorted = [...trainingClass.schedules].sort((a, b) => {
            if (a.day !== b.day) return Number(b.day) - Number(a.day);
            return b.startTime.localeCompare(a.startTime);
          });
          latestSchedule = sorted[0];
        }

        return (
          <div className="flex gap-2">
            <TableActionButton
              onClick={() => onEdit(trainingClass.id)}
              title="Edit"
              iconClass="bi bi-pencil-square"
              variant="primary"
            />
            <TableActionButton
              onClick={() => onRequestDelete(trainingClass.id)}
              title="Delete"
              iconClass="bi bi-trash"
              variant="error"
            />
            {onAddStudents && (
              <TableActionButton
                onClick={() => onAddStudents(trainingClass.id)}
                title="Add Students"
                iconClass="bi bi-person-plus"
                variant="success"
              />
            )}
            {latestSchedule && onManageAssistance && (
              <TableActionButton
                onClick={() => onManageAssistance(trainingClass.id)}
                title={`Manage Assistance (${getDay(
                  Number(latestSchedule.day)
                )}, ${latestSchedule.startTime})`}
                iconClass="bi bi-calendar-check"
                variant="info"
              />
            )}
          </div>
        );
      }}
      notFoundMessage="No classes found."
    />
  );
};

export default ClassTableRows;
