import React from "react";
import { TrainingClass } from "../../types/TrainingClass";
import { daysOfWeek } from "@/app/const/daysOfWeek";

type CoachClassCardProps = {
  coachClass: TrainingClass;
};

const CoachClassCard: React.FC<CoachClassCardProps> = ({ coachClass }) => {
  return (
    <li className="flex flex-col md:flex-row bg-neutral-50 dark:bg-neutral-800 border border-neutral-200 dark:border-neutral-700 rounded-lg shadow-md p-6 gap-4 mx-auto w-full max-w-2xl transition duration-200 hover:scale-105 hover:shadow-lg cursor-pointer">
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-lg font-semibold text-neutral-900 dark:text-neutral-100 mb-1">
          {coachClass.name}
        </h3>
        <p className="text-neutral-600 dark:text-neutral-300 mb-2">
          <span className="font-medium">Location:</span>{" "}
          {coachClass.dojaangName ?? ""}
        </p>
        <div>
          <span className="font-medium text-neutral-700 dark:text-neutral-200">
            Schedule:
          </span>
          <ul className="mt-1 list-none text-neutral-500 dark:text-neutral-400 space-y-1 flex flex-col items-center md:items-start">
            {coachClass.schedules.map((s) => {
              const dayLabel =
                daysOfWeek.find((d) => d.value === Number(s.day))?.label ??
                `Day ${s.day}`;
              return (
                <li
                  key={s.id}
                  className="py-1 flex justify-center md:justify-start"
                >
                  <span className="font-medium text-neutral-700 dark:text-neutral-200">
                    {dayLabel}
                  </span>
                  <span className="mx-2 hidden md:inline">|</span>
                  <span>
                    {s.startTime} - {s.endTime}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </li>
  );
};

export default CoachClassCard;
