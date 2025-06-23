import { Coach } from "./Coach";
import { ManagedDojaang } from "./ManagedDojaang";

export type CoachApiResponse = {
    data: {
        coach: Coach;
        managedDojaangs: ManagedDojaang[];
    };
    // Add any other top-level properties your API response might have,
    // e.g., 'message', 'status', 'timestamp', etc.
};