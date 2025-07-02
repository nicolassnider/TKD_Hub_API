import { useState, useEffect } from "react";
import { useClasses } from "@/app/context/ClassContext";
import { useStudents } from "@/app/context/StudentContext";
import StudentsInClass from "./StudentsInClass";
import { Student } from "@/app/types/Student";
import AddStudentClassDetails from "./AddStudentClassDetails";
import AddStudentSelector from "./AddStudentSelector";
import AddStudentActionButton from "./AddStudentActionButton";
import { EditModal } from "../common/modals/EditModal";

type Props = {
  classId: number;
  open: boolean;
  onClose: () => void;
  defaultStudentId?: number;
};

const AddStudentToClass: React.FC<Props> = ({
  classId,
  open,
  onClose,
  defaultStudentId,
}) => {
  const { addStudentToClass, classes, getStudentsByClass } = useClasses();
  const { getStudentsByDojaang } = useStudents();

  const [studentId, setStudentId] = useState<number | "">(
    defaultStudentId ?? ""
  );
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [dojaangId, setDojaangId] = useState<number | null>(null);
  const [studentsInClassKey, setStudentsInClassKey] = useState(0);

  useEffect(() => {
    if (open && classId && classes.length > 0) {
      const foundClass = classes.find((c) => c.id === classId);
      setDojaangId(foundClass?.dojaangId ?? null);
    } else if (!open) {
      setDojaangId(null);
      setStudents([]);
      setStudentId(defaultStudentId ?? "");
      setMessage(null);
    }
  }, [open, classId, classes, defaultStudentId]);

  useEffect(() => {
    const fetchAndFilterStudents = async () => {
      if (open && dojaangId) {
        setLoading(true);
        try {
          const allStudents = await getStudentsByDojaang(dojaangId);
          const studentsInClassList = await getStudentsByClass(classId);
          const filtered = allStudents.filter(
            (s) =>
              !studentsInClassList.some(
                (inClass: Student) => inClass.id === s.id
              )
          );
          setStudents(filtered);
        } finally {
          setLoading(false);
        }
      } else if (!open) {
        setStudents([]);
      }
    };
    fetchAndFilterStudents();
  }, [
    open,
    dojaangId,
    classId,
    classes,
    getStudentsByClass,
    getStudentsByDojaang,
  ]);

  const handleAdd = async () => {
    if (!studentId || !classId) return;
    setLoading(true);
    setMessage(null);
    try {
      await addStudentToClass(Number(studentId), Number(classId));
      setMessage("Student added!");
      setStudents((prev) => prev.filter((s) => s.id !== Number(studentId)));
      setStudentId(defaultStudentId ?? "");
      setStudentsInClassKey((prev) => prev + 1);
    } catch (e) {
      setMessage((e as Error).message || "Failed to add student.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  const classDetails = classes.find((c) => c.id === classId);

  return (
    <EditModal
      open={open}
      title="Add Student to Class"
      saving={loading}
      onClose={onClose}
    >
      <AddStudentClassDetails classDetails={classDetails} onClose={onClose} />
      <AddStudentSelector
        students={students}
        studentId={studentId}
        setStudentId={setStudentId}
        defaultStudentId={defaultStudentId}
        loading={loading}
      />
      <AddStudentActionButton
        handleAdd={handleAdd}
        loading={loading}
        studentId={studentId}
        message={message}
      />
      <div className="mb-4">
        <StudentsInClass classId={classId} key={studentsInClassKey} />
      </div>
    </EditModal>
  );
};

export default AddStudentToClass;
