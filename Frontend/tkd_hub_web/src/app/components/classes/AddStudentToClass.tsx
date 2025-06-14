"use client";
import React, { useState } from "react";
import { useClasses } from "@/app/context/ClassContext";
import { useDojaangs } from "@/app/context/DojaangContext";
import ClassSelector from "./ClassSelector";
import { useStudents } from "@/app/context/StudentContext";
import StudentSelector from "../students/StudentSelector";
import DojaangSelector from "../dojaangs/DojaangSelector";
import CoachSelector from "../coaches/CoachSelector";

type Props = {
  classId: number;
  open: boolean;
  onClose: () => void;
  defaultStudentId?: number;
};

const AddStudentToClass: React.FC<Props> = ({ classId, open, onClose, defaultStudentId }) => {
  const { addStudentToClass, classes } = useClasses();
  const { students } = useStudents();
  const { dojaangs } = useDojaangs();  

  const [studentId, setStudentId] = useState<number | "">(defaultStudentId ?? "");
  const [selectedDojaangId, setSelectedDojaangId] = useState<number | "">("");
  const [selectedCoachId, setSelectedCoachId] = useState<number | "">("");
  const [selectedClassId, setSelectedClassId] = useState<number | "">(classId ?? "");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // Filter classes by selected coach
  const getFilteredClasses = () =>
    selectedCoachId
      ? classes.filter((c) => c.coachId === Number(selectedCoachId))
      : [];

  const handleAdd = async () => {
    if (!studentId || !selectedClassId) return;
    setLoading(true);
    setMessage(null);
    try {
      await addStudentToClass(Number(studentId), Number(selectedClassId));
      setMessage("Student added!");
      setStudentId(defaultStudentId ?? "");
    } catch (e) {
      setMessage((e as Error).message || "Failed to add student.");
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
      <div className="bg-white rounded-lg shadow-lg p-6 min-w-[320px] relative">
        <button
          className="absolute top-2 right-2 text-gray-400 hover:text-gray-700 text-xl"
          onClick={onClose}
          disabled={loading}
          aria-label="Close"
        >
          &times;
        </button>
        <h2 className="text-lg font-semibold mb-4">Add Student to Class</h2>
        <div className="flex flex-col gap-3 mb-4">
          {/* Student Selector */}
          <StudentSelector
            students={students}
            value={studentId === "" ? null : Number(studentId)}
            onChange={id => setStudentId(id ?? "")}
            disabled={!!defaultStudentId || loading}
            label="Student"
          />
          {/* Dojaang Selector */}
          <DojaangSelector
            allDojaangs={dojaangs}
            value={selectedDojaangId === "" ? null : Number(selectedDojaangId)}
            onChange={id => {
              setSelectedDojaangId(id ?? "");
              setSelectedCoachId("");
              setSelectedClassId("");
            }}
            disabled={loading}
            label="Dojaang"
          />
          {/* Coach Selector */}
          <CoachSelector
            value={selectedCoachId === "" || selectedCoachId === null ? "" : String(selectedCoachId)}
            onChange={e => {
              const id = e.target.value === "" ? "" : Number(e.target.value);
              setSelectedCoachId(id);
              setSelectedClassId("");
            }}
            disabled={!selectedDojaangId || loading}
          />
          {/* Class Selector */}
          <ClassSelector
            value={selectedClassId}
            onChange={setSelectedClassId}
            disabled={!selectedCoachId || loading}
            className="border rounded px-2 py-1 w-40"
            // Only show classes for selected coach
            {...(selectedCoachId && { classes: getFilteredClasses() })}
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleAdd}
            className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
            disabled={loading || !studentId || !selectedClassId}
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
