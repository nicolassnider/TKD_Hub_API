import { useState, useEffect } from "react";
import { useClasses } from "@/app/context/ClassContext";
import { useStudents } from "@/app/context/StudentContext";
import StudentsInClass from "./StudentsInClass";
import { Student } from "@/app/types/Student";
import ModalCloseButton from "../common/actionButtons/ModalCloseButton";
import AddStudentClassDetails from "./AddStudentClassDetails";
import AddStudentSelector from "./AddStudentSelector";
import AddStudentActionButton from "./AddStudentActionButton";

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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-w-md max-h-[90vh] overflow-y-auto relative">
        <ModalCloseButton onClick={onClose} />
        <h3 className="text-lg font-semibold mb-4">Add Student to Class</h3>
        <AddStudentClassDetails classDetails={classDetails} />
        <AddStudentSelector
          students={students}
          studentId={studentId}
          setStudentId={setStudentId}
          defaultStudentId={defaultStudentId}
          loading={loading}
        />
        <div className="mb-4">
          <StudentsInClass classId={classId} key={studentsInClassKey} />
        </div>
        <AddStudentActionButton
          handleAdd={handleAdd}
          loading={loading}
          studentId={studentId}
          message={message}
        />
      </div>
    </div>
  );
};

export default AddStudentToClass;
