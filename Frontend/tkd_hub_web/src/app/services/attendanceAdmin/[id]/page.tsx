"use client";
import { useClasses } from "@/app/context/ClassContext";
import { useEffect, useState } from "react";
import * as React from "react";
import { StudentAttendance } from "@/app/types/StudentAttendance";
import { AdminListPage } from "@/app/components/AdminListPage";
import AttendanceTableRows from "@/app/components/attendance/AttendanceTableRows";

type Props = {
  params: Promise<{ id: string }>;
};

type ClassData = {
  id: number;
  name?: string;
  [key: string]: unknown;
};

export default function AttendanceAdminPage({ params }: Props) {
  const { id } = React.use(params);
  const {
    getClassById,
    getStudentAttendance,
    addStudentAttendance,
    loading,
    error,
  } = useClasses();

  const [attendanceHistory, setAttendanceHistory] = useState<
    StudentAttendance[]
  >([]);
  const [classMap, setClassMap] = useState<Record<number, ClassData>>({});
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({
    studentClassId: 0,
    attendedAt: "",
    status: 1,
    notes: "",
  });

  // Fetch attendance for student
  useEffect(() => {
    if (!id || !getStudentAttendance) return;
    const fetchAttendance = async () => {
      try {
        const data = await getStudentAttendance(Number(id));
        setAttendanceHistory(Array.isArray(data) ? data : []);
      } catch {
        setAttendanceHistory([]);
      }
    };
    fetchAttendance();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  // Fetch class data for all unique class IDs in attendanceHistory
  useEffect(() => {
    if (!getClassById || attendanceHistory.length === 0) return;
    const uniqueClassIds = Array.from(
      new Set(attendanceHistory.map((a) => a.trainingClassId))
    );
    const fetchClasses = async () => {
      const map: Record<number, ClassData> = {};
      await Promise.all(
        uniqueClassIds.map(async (classId) => {
          try {
            const classData = await getClassById(classId);
            if (classData) map[classId] = classData;
          } catch {}
        })
      );
      setClassMap(map);
    };
    fetchClasses();
  }, [attendanceHistory, getClassById]);

  // Add Attendance Handler
  const handleAddAttendance = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await addStudentAttendance(form.studentClassId, {
        attendedAt: form.attendedAt,
        status: form.status,
        notes: form.notes,
      });
      setShowModal(false);
      setForm({ studentClassId: 0, attendedAt: "", status: 1, notes: "" });
      // Refresh attendance
      if (getStudentAttendance) {
        const data = await getStudentAttendance(Number(id));
        setAttendanceHistory(Array.isArray(data) ? data : []);
      }
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <button
        className="mb-4 px-4 py-2 rounded bg-blue-600 text-white"
        onClick={() => setShowModal(true)}
      >
        Add Attendance
      </button>
      <AdminListPage
        title={`Attendance Admin - Student ID: ${id}`}
        loading={loading}
        error={error}
        tableHead={
          <tr>
            <th>Class ID</th>
            <th>Class Name</th>
            <th>Date</th>
            <th>Status</th>
            <th>Options</th>
          </tr>
        }
        tableBody={
          <AttendanceTableRows
            attendanceHistory={attendanceHistory}
            classMap={classMap}
          />
        }
      />

      {/* Modal for adding attendance */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <form
            className="bg-neutral-900 p-6 rounded shadow-lg min-w-[300px] flex flex-col gap-4"
            onSubmit={handleAddAttendance}
          >
            <h2 className="text-xl font-bold mb-2">Add Attendance</h2>
            <label>
              Student Class ID:
              <input
                type="number"
                className="w-full mt-1 p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100"
                value={form.studentClassId}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    studentClassId: Number(e.target.value),
                  }))
                }
                required
              />
            </label>
            <label>
              Date:
              <input
                type="datetime-local"
                className="w-full mt-1 p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100"
                value={form.attendedAt}
                onChange={(e) =>
                  setForm((f) => ({ ...f, attendedAt: e.target.value }))
                }
                required
              />
            </label>
            <label>
              Status:
              <select
                className="w-full mt-1 p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100"
                value={form.status}
                onChange={(e) =>
                  setForm((f) => ({ ...f, status: Number(e.target.value) }))
                }
              >
                <option value={1}>Present</option>
                <option value={0}>Absent</option>
              </select>
            </label>
            <label>
              Notes:
              <input
                type="text"
                className="w-full mt-1 p-2 rounded bg-neutral-800 border border-neutral-700 text-neutral-100"
                value={form.notes}
                onChange={(e) =>
                  setForm((f) => ({ ...f, notes: e.target.value }))
                }
              />
            </label>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                className="px-4 py-2 rounded bg-neutral-700 text-neutral-100"
                onClick={() => setShowModal(false)}
                disabled={submitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded bg-blue-600 text-white"
                disabled={submitting}
              >
                {submitting ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
