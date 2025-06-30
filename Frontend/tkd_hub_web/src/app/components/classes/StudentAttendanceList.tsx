import { StudentAttendance } from "@/app/types/StudentAttendance";
import React from "react";

type Props = {
  attendance: StudentAttendance[];
  loading: boolean;
};

export default function StudentAttendanceList({ attendance, loading }: Props) {
  if (loading) {
    return (
      <div className="text-center text-gray-500">Loading attendance...</div>
    );
  }

  if (!attendance.length) {
    return (
      <div className="text-center text-gray-500">
        No attendance records found.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4">Classes I Attend To</h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-gray-300 text-left">
          <thead className="bg-gray-100">
            <tr>
              <th className="border px-4 py-2">Date</th>
              <th className="border px-4 py-2">Class ID</th>
              <th className="border px-4 py-2">Attended</th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((a) => (
              <tr key={a.id} className="hover:bg-gray-50">
                <td className="border px-4 py-2">{a.date}</td>
                <td className="border px-4 py-2">{a.trainingClassId}</td>
                <td className="border px-4 py-2">
                  {a.attended ? "Yes" : "No"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
