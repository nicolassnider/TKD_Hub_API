"use client";
import React, { useEffect, useState, useMemo } from "react";
import { useClasses } from "@/app/context/ClassContext";
import { daysOfWeek } from "@/app/const/daysOfWeek";
import { TrainingClass } from "@/app/types/TrainingClass";
import { ClassSchedule } from "@/app/types/ClassSchedule";

const TodaysClassesFloating: React.FC = () => {
  // 1. Context hooks
  const { getClassesByDay } = useClasses();

  // 2. State hooks
  const today = useMemo(() => new Date().getDay(), []);
  const [todaysClasses, setTodaysClasses] = useState<TrainingClass[]>([]);
  const [loading, setLoading] = useState(true);

  // 3. Effects
  useEffect(() => {
    let isMounted = true;
    setLoading(true);
    getClassesByDay(today)
      .then((classes) => {
        if (isMounted) setTodaysClasses(classes);
      })
      .catch((error) => {
        if (isMounted) {
          console.error("Failed to fetch classes:", error);
        }
      })
      .finally(() => {
        if (isMounted) setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [getClassesByDay, today]);

  // 5. Render
  return (
    <div className="todays-classes-floating p-4 bg-neutral-900 shadow rounded-lg border border-neutral-700">
      <div className="font-bold mb-2 text-neutral-100 flex items-center gap-2">
        <span role="img" aria-label="calendar">
          📅
        </span>
        Today&apos;s Classes
      </div>
      {loading ? (
        <div className="text-neutral-400 text-sm">Loading...</div>
      ) : todaysClasses.length === 0 ? (
        <div className="text-neutral-400 text-sm">No classes today.</div>
      ) : (
        <ul className="text-sm text-neutral-100">
          {todaysClasses.map((cls) => (
            <li key={cls.id} className="mb-2">
              <span className="font-semibold">{cls.name}</span>
              <ul className="ml-4 text-xs text-neutral-400">
                {cls.schedules
                  ?.filter((s: ClassSchedule) => Number(s.day) === today)
                  .map((s: ClassSchedule, idx: number) => (
                    <li key={idx} className="hover:text-blue-400 transition">
                      {daysOfWeek.find((d) => d.value === Number(s.day))?.label}
                      : {s.startTime} - {s.endTime}
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
