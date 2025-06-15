"use client";
import { useClasses } from "@/app/context/ClassContext";
import { useStudents } from "@/app/context/StudentContext";
import { useState, useEffect } from "react";

import StudentSelector from "../students/StudentSelector";
import { Student } from "@/app/types/Student";
import ClassDetails from "./ClassDetails";
import StudentsInClass from "./StudentsInClass";


type Props = {
  classId: number;
  open: boolean;
  onClose: () => void;
  defaultStudentId?: number;
};

const AddStudentToClass: React.FC<Props> = ({ classId, open, onClose, defaultStudentId }) => {
  const { addStudentToClass, classes } = useClasses();
  const { getStudentsByDojaang } = useStudents();

  const [studentId, setStudentId] = useState<number | "">(defaultStudentId ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [students, setStudents] = useState<Student[]>([]);
  const [dojaangId, setDojaangId] = useState<number | null>(null);

  // Find dojaangId for the class when modal opens or classes/classId change
  useEffect(() => {
    if (open && classId && classes.length > 0) {
      const foundClass = classes.find(c => c.id === classId);
      console.log("classId:", classId, "classes:", classes, "foundClass:", foundClass);
      setDojaangId(foundClass?.dojaangId ?? null);
    } else if (!open) {
      setDojaangId(null);
      setStudents([]);
      setStudentId(defaultStudentId ?? "");
      setMessage(null);
    }
  }, [open, classId, classes, defaultStudentId]);

  // Fetch students for the dojaang when dojaangId changes and modal is open
  useEffect(() => {
    if (open && dojaangId) {
      setLoading(true);
      getStudentsByDojaang(dojaangId)
        .then(students => {
          setStudents(students);
        })
        .finally(() => setLoading(false));
    } else if (!open) {
      setStudents([]);
    }
    // Only depend on open and dojaangId, NOT getStudentsByDojaang
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, dojaangId]);

  const handleAdd = async () => {
    if (!studentId || !classId) return;
    setLoading(true);
    setMessage(null);
    try {
      await addStudentToClass(Number(studentId), Number(classId));
      setMessage("Student added!");
      setStudentId(defaultStudentId ?? "");
    } catch (e) {
      setMessage((e as Error).message || "Failed to add student.");
    } finally {
      setLoading(false);
    }
  };

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
          <StudentSelector
            students={students}
            value={studentId === "" ? null : Number(studentId)}
            onChange={id => setStudentId(id ?? "")}
            disabled={!!defaultStudentId || loading}
            label="Student"
          />
        </div>
        {/* Show students already in the class */}
        <div className="mb-4">
          <StudentsInClass classId={classId} />
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
