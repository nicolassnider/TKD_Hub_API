import { Student } from "@/app/types/Student";
import { GenericSelector } from "../common/selectors/GenericSelector";

type Props = {
  students: Student[];
  studentId: number | "";
  setStudentId: (id: number | "") => void;
  defaultStudentId?: number;
  loading: boolean;
};

const AddStudentSelector = ({
  students,
  studentId,
  setStudentId,
  defaultStudentId,
  loading,
}: Props) => (
  <div className="flex flex-col gap-3 mb-4">
    <GenericSelector
      items={students}
      value={studentId === "" ? null : Number(studentId)}
      onChange={(id) => setStudentId(id ?? "")}
      getLabel={(s) =>
        `${s.firstName} ${s.lastName}${s.email ? ` (${s.email})` : ""}`
      }
      getId={(s) => s.id!}
      disabled={!!defaultStudentId || loading}
      label="Student"
      placeholder="Select a student"
      className="bg-neutral-50 dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 border border-neutral-300 dark:border-neutral-700 rounded"
    />
  </div>
);

export default AddStudentSelector;
