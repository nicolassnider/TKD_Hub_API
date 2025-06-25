import { Gender } from "../enums/Gender";

export type UpsertCoachDto = {
    id?: number | null; // If present, update; if null/undefined, create
    firstName: string;
    lastName: string;
    email: string;
    phoneNumber: string;
    gender?: Gender | null;
    dateOfBirth?: string | null; // ISO string or null
    dojaangId?: number | null;
    rankId?: number | null;
    joinDate?: string | null; // ISO string or null
    roleIds: number[];
    managedDojaangIds: number[];
};
