import { useClasses } from "@/app/context/ClassContext";
import { useEffect, useState } from "react";
import { Student } from "@/app/types/Student";

type Props = {
  classId: number;
};

const StudentsInClass: React.FC<Props> = ({ classId }) => {
  // 1. Context hooks
  const { getStudentsByClass } = useClasses();

  // 2. State hooks
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);

  // 3. Effects
  useEffect(() => {
    setLoading(true);
    getStudentsByClass(classId)
      .then(setStudents)
      .finally(() => setLoading(false));
    // Only depend on classId and getStudentsInClass
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [classId]);

  // 5. Render
  if (loading) return <div className="text-gray-500">Loading students...</div>;
  if (!students.length)
    return <div className="text-gray-500">No students in this class.</div>;

  return (
    <div className="p-4 bg-white shadow rounded-lg">
      <h3 className="text-lg font-semibold mb-2">Students in Class</h3>
      <ul className="list-disc pl-5">
        {students.map((student) => (
          <li key={student.id} className="hover:text-blue-600 transition">
            {student.firstName} {student.lastName}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StudentsInClass;
