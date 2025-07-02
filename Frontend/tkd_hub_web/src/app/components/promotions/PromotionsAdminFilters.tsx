import { Student } from "@/app/types/Student";
import { GenericSelector } from "../common/selectors/GenericSelector";
import GenericButton from "../common/actionButtons/GenericButton";

type Props = {
  students: Student[];
  studentIdFilter?: number;
  onStudentSelect: (id: number | null) => void;
  onClearStudent: () => void;
};

const PromotionsAdminFilters: React.FC<Props> = ({
  students,
  studentIdFilter,
  onStudentSelect,
  onClearStudent,
}) => (
  <div className="mb-4">
    <div className="flex flex-col sm:flex-row sm:items-center gap-2 w-full max-w-2xl">
      <div className="flex-1">
        <GenericSelector
          items={students}
          value={studentIdFilter ?? null}
          onChange={onStudentSelect}
          getLabel={(s) =>
            `${s.firstName} ${s.lastName}${s.email ? ` (${s.email})` : ""}`
          }
          getId={(s) => s.id!}
          label="Student"
          placeholder="Select a student"
        />
      </div>
      {studentIdFilter !== undefined && (
        <GenericButton
          type="button"
          variant="secondary"
          className="self-end sm:self-auto h-[42px] min-w-[120px] promotions-clear-student-btn"
          onClick={onClearStudent}
        >
          Clear Student
        </GenericButton>
      )}
    </div>
  </div>
);

export default PromotionsAdminFilters;
