import { useState, useEffect } from "react";
import { useClasses } from "@/app/context/ClassContext";
import { useStudents } from "@/app/context/StudentContext";
import ClassDetails from "./ClassDetails";
import StudentsInClass from "./StudentsInClass";
import { Student } from "@/app/types/Student";
import { GenericSelector } from "../common/selectors/GenericSelector";
import ModalCloseButton from "../common/actionButtons/ModalCloseButton";

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

        {classDetails && (
          <ClassDetails
            name={classDetails.name}
            schedules={classDetails.schedules}
            coachName={classDetails.coachName}
            dojaangName={classDetails.dojaangName}
            dojaangId={classDetails.dojaangId}
          />
        )}

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
          />
        </div>

        <div className="mb-4">
          <StudentsInClass classId={classId} key={studentsInClassKey} />
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition duration-200"
            disabled={loading || !studentId}
          >
            {loading ? "Adding..." : "Add Student"}
          </button>
        </div>

        {message && (
          <div className="text-green-700 text-sm mt-2">{message}</div>
        )}
      </div>
    </div>
  );
};

export default AddStudentToClass;
