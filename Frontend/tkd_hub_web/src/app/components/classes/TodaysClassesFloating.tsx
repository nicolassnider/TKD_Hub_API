"use client";
import React, { useEffect, useState } from "react";
import { useClasses } from "@/app/context/ClassContext";
import { daysOfWeek } from "@/app/const/daysOfWeek";
import { TrainingClass } from "@/app/types/TrainingClass";
import { Schedule } from "@/app/types/Schedule";
import { ClassSchedule } from "@/app/types/ClassSchedule";

const TodaysClassesFloating: React.FC = () => {
  const { getClassesByDay } = useClasses();
  const today = new Date().getDay();
  const [todaysClasses, setTodaysClasses] = useState<TrainingClass[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    getClassesByDay(today)
      .then(setTodaysClasses)
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="todays-classes-floating">
      <div className="font-bold mb-2 text-blue-700 flex items-center gap-2">
        <span role="img" aria-label="calendar">📅</span>
        Today&apos;s Classes
      </div>
      {loading ? (
        <div className="text-gray-500 text-sm">Loading...</div>
      ) : todaysClasses.length === 0 ? (
        <div className="text-gray-500 text-sm">No classes today.</div>
      ) : (
        <ul className="text-sm">
          {todaysClasses.map(cls => (
            <li key={cls.id} className="mb-1">
              <span className="font-semibold">{cls.name}</span>
              <ul className="ml-4 text-xs text-gray-600">
                {cls.schedules
                  ?.filter((s: ClassSchedule) => s.day === today)
                  .map((s: any, idx: number) => (
                    <li key={idx}>
                      {daysOfWeek.find(d => d.value === s.day)?.label}: {s.startTime} - {s.endTime}
                    </li>
                  ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TodaysClassesFloating;
