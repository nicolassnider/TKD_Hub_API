export type User = {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  gender?: number;
  dateOfBirth?: string | null;
  dojaangId?: number | null;
  currentRankId?: number | null;
  joinDate?: string;
  roles?: string[];
  isActive?: boolean;
};
