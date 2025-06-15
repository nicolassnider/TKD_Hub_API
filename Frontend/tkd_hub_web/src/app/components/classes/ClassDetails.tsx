import React from "react";
import { ClassSchedule } from "@/app/types/ClassSchedule";
import { daysOfWeek } from "@/app/const/daysOfWeek";

type ClassDetailsProps = {
    name: string;
    schedules?: ClassSchedule[];
    coachName?: string;
    dojaangName?: string;
    dojaangId?: number;
};

const getDayLabel = (day: number | string) => {
    if (typeof day === "number") {
        const found = daysOfWeek.find(d => d.value === day);
        return found ? found.label : day;
    }
    return day;
};

const ClassDetails: React.FC<ClassDetailsProps> = ({
    name,
    schedules,
    coachName,
    dojaangName,
    dojaangId,
}) => (
    <form className="mb-4 grid grid-cols-1 gap-2 text-sm text-gray-700 bg-gray-50 rounded p-4 border">
        <div className="flex items-center">
            <label className="w-28 font-semibold">Class:</label>
            <span>{name}</span>
        </div>
        <div className="flex items-start">
            <label className="w-28 font-semibold">Schedule:</label>
            <span>
                {Array.isArray(schedules) && schedules.length > 0 ? (
                    <ul className="list-disc pl-5">
                        {schedules.map((s, idx) => (
                            <li key={idx}>
                                {getDayLabel(s.day)} {s.startTime} - {s.endTime}
                            </li>
                        ))}
                    </ul>
                ) : (
                    "N/A"
                )}
            </span>
        </div>
        <div className="flex items-center">
            <label className="w-28 font-semibold">Coach:</label>
            <span>{coachName ?? "N/A"}</span>
        </div>
        <div className="flex items-center">
            <label className="w-28 font-semibold">Dojaang:</label>
            <span>{dojaangName ?? dojaangId}</span>
        </div>
    </form>
);

export default ClassDetails;
