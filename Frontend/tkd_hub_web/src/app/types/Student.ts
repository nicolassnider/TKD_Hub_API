export type Student = {
  id?: number|null;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  gender?: number;
  dojaangId?: number | null; // <-- allow null
  currentRankId?: number | null;
  joinDate?: string;
  dateOfBirth?: string;
  isActive?: boolean;
};
