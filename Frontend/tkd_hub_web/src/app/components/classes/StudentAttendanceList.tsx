import { StudentAttendance } from '@/app/types/StudentAttendance';
import React from 'react';

type Props = {
    attendance: StudentAttendance[];
    loading: boolean;
};

export default function StudentAttendanceList({ attendance, loading }: Props) {
    if (loading) {
        return <div>Loading attendance...</div>;
    }

    if (!attendance.length) {
        return <div>No attendance records found.</div>;
    }

    return (
        <div className="mt-6">
            <h3 className="text-xl font-semibold mb-2">Classes I Attend To</h3>
            <table className="min-w-full border text-left">
                <thead>
                    <tr>
                        <th className="border px-2 py-1">Date</th>
                        <th className="border px-2 py-1">Class ID</th>
                        <th className="border px-2 py-1">Attended</th>
                    </tr>
                </thead>
                <tbody>
                    {attendance.map((a) => (
                        <tr key={a.id}>
                            <td className="border px-2 py-1">{a.date}</td>
                            <td className="border px-2 py-1">{a.trainingClassId}</td>
                            <td className="border px-2 py-1">
                                {a.attended ? 'Yes' : 'No'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}
