import { useState, useEffect } from "react";
import { useClasses } from "@/app/context/ClassContext";
import { useStudents } from "@/app/context/StudentContext";
import ClassDetails from "./ClassDetails";
import StudentsInClass from "./StudentsInClass";
import { Student } from "@/app/types/Student";
import { GenericSelector } from "../common/selectors/GenericSelector";

type Props = {
  classId: number;
  open: boolean;
  onClose: () => void;
  defaultStudentId?: number;
};

const AddStudentToClass: React.FC<Props> = ({ classId, open, onClose, defaultStudentId }) => {
  // 1. Context hooks
  const { addStudentToClass, classes, getStudentsByClass } = useClasses();
  const { getStudentsByDojaang } = useStudents();

  // 2. State hooks
  const [studentId, setStudentId] = useState<number | "">(defaultStudentId ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [dojaangId, setDojaangId] = useState<number | null>(null);
  const [studentsInClassKey, setStudentsInClassKey] = useState(0);

  // 3. Effects
  // Find dojaangId for the class when modal opens or classes/classId change
  useEffect(() => {
    if (open && classId && classes.length > 0) {
      const foundClass = classes.find(c => c.id === classId);
      setDojaangId(foundClass?.dojaangId ?? null);
    } else if (!open) {
      setDojaangId(null);
      setStudents([]);
      setStudentId(defaultStudentId ?? "");
      setMessage(null);
    }
  }, [open, classId, classes, defaultStudentId]);

  // Fetch students for the dojaang and filter out those already in class
  useEffect(() => {
    const fetchAndFilterStudents = async () => {
      if (open && dojaangId) {
        setLoading(true);
        try {
          // Fetch all students in the dojaang
          const allStudents = await getStudentsByDojaang(dojaangId);
          // Fetch students already in the class using context/API
          const studentsInClassList = await getStudentsByClass(classId);

          // Filter out students already in the class
          const filtered = allStudents.filter(
            s => !studentsInClassList.some((inClass: Student) => inClass.id === s.id)
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
    // Only depend on open, dojaangId, classId, NOT getStudentsByDojaang/getStudentsByClass
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, dojaangId, classId, classes]);

  // 4. Functions
  const handleAdd = async () => {
    if (!studentId || !classId) return;
    setLoading(true);
    setMessage(null);
    try {
      await addStudentToClass(Number(studentId), Number(classId));
      setMessage("Student added!");
      setStudents(prev => prev.filter(s => s.id !== Number(studentId)));
      setStudentId(defaultStudentId ?? "");
      setStudentsInClassKey(prev => prev + 1); // update key to force StudentsInClass refresh
    } catch (e) {
      setMessage((e as Error).message || "Failed to add student.");
    } finally {
      setLoading(false);
    }
  };

  // 5. Render
  if (!open) return null;

  const classDetails = classes.find(c => c.id === classId);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] max-h-[90vh] overflow-y-auto relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
          disabled={loading}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Add Student to Class</h2>

        {/* Class Info */}
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
          {/* Student Selector */}
          <GenericSelector
            items={students}
            value={studentId === "" ? null : Number(studentId)}
            onChange={id => setStudentId(id ?? "")}
            getLabel={s => `${s.firstName} ${s.lastName}${s.email ? ` (${s.email})` : ""}`}
            getId={s => s.id!}
            disabled={!!defaultStudentId || loading}
            label="Student"
            placeholder="Select a student"
          />
        </div>
        {/* Show students already in the class */}
        <div className="mb-4">
          <StudentsInClass classId={classId} key={studentsInClassKey} />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            disabled={loading || !studentId}
          >
            {loading ? "Adding..." : "Add Student"}
          </button>
        </div>
        {message && <div className="text-green-700 text-sm mt-2">{message}</div>}
      </div>
    </div>
  );
};

export default AddStudentToClass;
