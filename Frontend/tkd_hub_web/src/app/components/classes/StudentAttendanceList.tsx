import { StudentAttendance } from "@/app/types/StudentAttendance";
import React from "react";

type Props = {
  attendance: StudentAttendance[];
  loading: boolean;
};

export default function StudentAttendanceList({ attendance, loading }: Props) {
  if (loading) {
    return (
      <div className="text-center text-neutral-500 dark:text-neutral-400">
        Loading attendance...
      </div>
    );
  }

  if (!attendance.length) {
    return (
      <div className="text-center text-neutral-500 dark:text-neutral-400">
        No attendance records found.
      </div>
    );
  }

  return (
    <div className="mt-6">
      <h3 className="text-xl font-semibold mb-4 text-neutral-900 dark:text-neutral-100">
        Classes I Attend To
      </h3>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-neutral-300 dark:border-neutral-700 text-left">
          <thead className="bg-neutral-100 dark:bg-neutral-800">
            <tr>
              <th className="border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-neutral-700 dark:text-neutral-200">
                Date
              </th>
              <th className="border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-neutral-700 dark:text-neutral-200">
                Class ID
              </th>
              <th className="border border-neutral-300 dark:border-neutral-700 px-4 py-2 text-neutral-700 dark:text-neutral-200">
                Attended
              </th>
            </tr>
          </thead>
          <tbody>
            {attendance.map((a) => (
              <tr
                key={a.id}
                className="hover:bg-neutral-50 dark:hover:bg-neutral-800 transition"
              >
                <td className="border border-neutral-300 dark:border-neutral-700 px-4 py-2">
                  {a.date}
                </td>
                <td className="border border-neutral-300 dark:border-neutral-700 px-4 py-2">
                  {a.trainingClassId}
                </td>
                <td className="border border-neutral-300 dark:border-neutral-700 px-4 py-2">
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
