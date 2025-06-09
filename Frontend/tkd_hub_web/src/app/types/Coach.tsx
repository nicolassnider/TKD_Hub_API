export type Coach = {
	id: number;
	firstName: string;
	lastName: string;
	email: string;
	phoneNumber?: string;
	gender?: number;
	dateOfBirth?: string;
	dojaangId?: number | null;
	currentRankId?: number;
	joinDate?: string;
	roles?: string[] | null;
	managedDojaangIds?: number[];
  isActive: boolean;
};
