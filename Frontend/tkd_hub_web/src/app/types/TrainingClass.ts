import { ClassSchedule } from "./ClassSchedule";

export type TrainingClass = {
  id: number;
  name: string;
  dojaangId: number;
  dojaangName?: string;
  coachId: number;
  coachName?: string;
  schedules: ClassSchedule[];
};
