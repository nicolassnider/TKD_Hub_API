import React from "react";
import { daysOfWeek } from "@/app/const/daysOfWeek";
import { ClassSchedule } from "@/app/types/ClassSchedule";
import LabeledInput from "../common/inputs/LabeledInput";
import { GenericSelector } from "../common/selectors/GenericSelector";

type Props = {
  schedules: ClassSchedule[];
  onAdd: () => void;
  onRemove: (idx: number) => void;
  onChange: (
    idx: number,
    field: keyof ClassSchedule,
    value: string | number
  ) => void;
};

const ClassSchedulesSection: React.FC<Props> = ({
  schedules,
  onAdd,
  onRemove,
  onChange,
}) => (
  <div className="mb-4">
    <label className="block font-medium mb-1">Schedules</label>
    <div className="mt-2 mb-4">
      <button
        type="button"
        className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 transition-colors font-semibold"
        onClick={onAdd}
      >
        Add Schedule
      </button>
    </div>
    {schedules.length > 0 && (
      <div className="mt-4 space-y-2 border-t border-gray-200 pt-4">
        {schedules.map((schedule, idx) => (
          <div
            key={schedule.id ?? idx}
            className="flex flex-col gap-2 bg-gray-50 rounded p-2 md:flex-row md:items-stretch flex-wrap"
          >
            <div className="flex flex-col min-w-[120px] w-full md:w-1/4">
              <GenericSelector
                items={daysOfWeek}
                value={Number(schedule.day)}
                onChange={(val: number | null) =>
                  onChange(idx, "day", val ?? 0)
                }
                getLabel={(d) => d.label}
                getId={(d) => d.value}
                required
                label="Day"
                placeholder="Select day"
                className="w-full"
              />
            </div>
            <div className="flex flex-row gap-2 w-full md:flex-col md:w-2/4 items-end">
              <div className="flex flex-col min-w-[80px] w-1/2 md:w-full">
                <LabeledInput
                  label="Start Time"
                  name={`startTime-${idx}`}
                  type="time"
                  value={schedule.startTime}
                  onChange={(e) => onChange(idx, "startTime", e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="flex flex-col min-w-[80px] w-1/2 md:w-full">
                <LabeledInput
                  label="End Time"
                  name={`endTime-${idx}`}
                  type="time"
                  value={schedule.endTime}
                  onChange={(e) => onChange(idx, "endTime", e.target.value)}
                  required
                  className="w-full"
                />
              </div>
              <div className="flex items-end ml-auto">
                <button
                  type="button"
                  className="px-3 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors h-full flex items-center justify-center"
                  onClick={() => onRemove(idx)}
                  title="Remove schedule"
                >
                  <i className="bi bi-x-lg text-lg" aria-hidden="true"></i>
                  <span className="sr-only">Remove</span>
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    )}
  </div>
);

export default ClassSchedulesSection;
