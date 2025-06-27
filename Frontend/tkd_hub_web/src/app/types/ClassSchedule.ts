import { DayOfWeek } from "./DayOfWeek";

export type ClassSchedule = {
  id?: number | null;
  day: DayOfWeek; // Use the enum for day
  startTime: string; // Start time in "HH:mm" format
  endTime: string; // End time in "HH:mm" format
};
