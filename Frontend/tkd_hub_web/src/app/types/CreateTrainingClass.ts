import { CreateClassSchedule } from "./CreateClassSchedule";

export type CreateTrainingClass = {
    name: string;
    dojaangId: number;
    dojaangName: string;
    coachId: number;
    coachName: string;
    schedules: CreateClassSchedule[];
};
