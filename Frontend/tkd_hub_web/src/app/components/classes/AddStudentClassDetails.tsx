import { TrainingClass } from "@/app/types/TrainingClass";
import ClassDetails from "./ClassDetails";
import { EditModal } from "../common/modals/EditModal";
import AddStudentSelector from "./AddStudentSelector";
import { Student } from "@/app/types/Student";
import { useState, useEffect, useMemo } from "react";
import { useStudents } from "@/app/context/StudentContext";
import AddStudentActionButton from "./AddStudentActionButton";
import { useClasses } from "@/app/context/ClassContext";
import StudentsInClass from "./StudentsInClass";

type Props = {
  classDetails?: TrainingClass;
  open?: boolean;
  onClose: (refresh?: boolean) => void;
};

const AddStudentClassDetails = ({
  classDetails,
  open = true,
  onClose,
}: Props) => {
  const [students, setStudents] = useState<Student[]>([]);
  const [studentId, setStudentId] = useState<number | "">("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const { getStudentsByDojaang } = useStudents();
  const { addStudentToClass, getStudentsByClass } = useClasses();
  const [studentsInClass, setStudentsInClass] = useState<Student[]>([]);

  useEffect(() => {
    const fetchStudents = async () => {
      if (classDetails?.dojaangId) {
        const studentsList = await getStudentsByDojaang(classDetails.dojaangId);
        setStudents(studentsList);
      }
    };
    fetchStudents();
  }, [classDetails, getStudentsByDojaang]);

  useEffect(() => {
    const fetchStudentsInClass = async () => {
      if (classDetails?.id) {
        const studentsList = await getStudentsByClass(classDetails.id);
        setStudentsInClass(studentsList);
      }
    };
    fetchStudentsInClass();
  }, [classDetails, getStudentsByClass, loading]);

  const availableStudents = useMemo(
    () => students.filter((s) => !studentsInClass.some((c) => c.id === s.id)),
    [students, studentsInClass]
  );

  const handleAdd = async () => {
    if (!studentId || !classDetails?.id) return;
    setLoading(true);
    setMessage(null);
    try {
      await addStudentToClass(Number(studentId), classDetails.id);
      setMessage("Student added!");
      setStudentId("");
    } catch (e) {
      if (e instanceof Error) {
        setMessage(e.message || "Failed to add student.");
      } else {
        setMessage("Failed to add student.");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!classDetails) return null;

  return (
    <EditModal
      open={open}
      title="Class Details / Add Students"
      saving={loading}
      onClose={onClose}
    >
      <ClassDetails
        name={classDetails.name}
        schedules={classDetails.schedules}
        coachName={classDetails.coachName}
        dojaangName={classDetails.dojaangName}
        dojaangId={classDetails.dojaangId}
      />
      <div className="mt-6">
        <AddStudentSelector
          students={availableStudents}
          studentId={studentId}
          setStudentId={setStudentId}
          loading={loading}
        />
        <AddStudentActionButton
          handleAdd={handleAdd}
          loading={loading}
          studentId={studentId}
          message={message}
        />
        <div className="mt-6">
          <StudentsInClass classId={classDetails.id} />
        </div>
      </div>
    </EditModal>
  );
};

export default AddStudentClassDetails;
