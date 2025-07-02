import { useClasses } from "@/app/context/ClassContext";
import { useEffect, useState } from "react";
import { Student } from "@/app/types/Student";

type Props = {
  classId: number;
};

const StudentsInClass: React.FC<Props> = ({ classId }) => {
  const { getStudentsByClass } = useClasses();
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    getStudentsByClass(classId)
      .then(setStudents)
      .finally(() => setLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  if (loading) return <div className="text-neutral-500">Loading...</div>;
  if (!students.length)
    return <div className="text-neutral-500">No students assigned.</div>;

  return (
    <div className="p-4 bg-neutral-900 text-neutral-100 rounded-lg border border-neutral-700">
      <h3 className="text-base font-semibold mb-2 text-neutral-200">
        Students
      </h3>
      <ul className="list-disc pl-5">
        {students.map((student) => (
          <li key={student.id} className="text-neutral-100">
            {student.firstName} {student.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentsInClass;
