"use client";
import { notFound } from "next/navigation";
import { useClasses } from "@/app/context/ClassContext";
import { useEffect, useState } from "react";
import * as React from "react"; // Needed for React.use()
import { StudentClassAttendance } from "@/app/types/StudentClassAttendance";

type Props = {
  params: Promise<{ id: string }>;
};

type ClassData = {
  id: number;
  // add other relevant fields as needed
  [key: string]: unknown;
};

export default function AttendanceAdminPage({ params }: Props) {
  const { id } = React.use(params);
  const { getClassById, getStudentAttendanceHistory, loading, error } =
    useClasses();

  // Use explicit types instead of any
  const [classData, setClassData] = useState<ClassData | null>(null);
  const [attendanceHistory, setAttendanceHistory] = useState<
    StudentClassAttendance[]
  >([]);

  useEffect(() => {
    if (!id || !getClassById || !getStudentAttendanceHistory) return;

    const fetchAttendanceAndClass = async () => {
      try {
        const history = await getStudentAttendanceHistory(Number(id));
        setAttendanceHistory(Array.isArray(history) ? history : []);
        const data = await getClassById(Number(id));
        if (!data) return;
        setClassData(data);
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
    fetchAttendanceAndClass();
  }, [id, getClassById, getStudentAttendanceHistory]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!classData) return notFound();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-bold mb-4">
        Attendance Admin - Class ID: {id}
      </h1>
      <pre className="bg-gray-100 p-4 rounded mb-6">
        {JSON.stringify(classData, null, 2)}
      </pre>
      <h2 className="text-xl font-semibold mb-2">Student Attendance History</h2>
      <pre className="bg-gray-50 p-4 rounded">
        {JSON.stringify(attendanceHistory, null, 2)}
      </pre>
    </main>
  );
}
