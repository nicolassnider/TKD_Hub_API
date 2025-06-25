import { Tul } from "./Tul";

export type Rank = {
    id: number;
    name: string;
    order: number;
    description: string;
    color: number;
    stripeColor: number | null;
    danLevel: number | null;
    createdDate: string;
    users: unknown[]; 
    tuls: Tul[];  
};
