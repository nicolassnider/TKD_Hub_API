export type LoginResponse = {
    token: string;
    user: {
        id: number;
        firstName: string;
        lastName: string;
        email: string;
        phoneNumber: string;
        gender: number;
        dateOfBirth: string | null;
        dojaangId: number | null;
        currentRankId: number | null;
        joinDate: string;
        roles: string[];
        managedDojaangIds: number[];
        isActive: boolean;
        role?: string; // in case your API sometimes returns a single role
    };
};
