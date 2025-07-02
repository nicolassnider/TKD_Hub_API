import React from "react";
import { ClassSchedule } from "@/app/types/ClassSchedule";
import { daysOfWeek } from "@/app/const/daysOfWeek";
import { DayOfWeek } from "@/app/types/DayOfWeek";

const getDayLabel = (day: number | string | DayOfWeek): string => {
  const dayNumber = typeof day === "string" ? Number(day) : day;
  const found = daysOfWeek.find((d) => d.value === dayNumber);
  return found ? found.label : String(day);
};

const ScheduleRow: React.FC<{ schedules?: ClassSchedule[] }> = ({
  schedules,
}) => (
  <div className="flex items-start py-1">
    <label className="w-32 font-semibold text-neutral-700 dark:text-neutral-200">
      Schedule:
    </label>
    <span className="flex-1 text-neutral-900 dark:text-neutral-100">
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
);

export default ScheduleRow;
