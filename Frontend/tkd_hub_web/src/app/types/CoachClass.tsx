export type CoachClass = {
    id: number;
    name: string;
    dojaangId: number;
    dojaangName: string;
    coachId: number;
    coachName: string;
    schedules: {
        id: number;
        day: number;
        startTime: string;
        endTime: string;
    }[];
};
