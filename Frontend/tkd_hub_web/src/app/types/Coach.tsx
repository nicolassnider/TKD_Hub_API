export type Coach = {
  id: number;
  firstName?: string;
  lastName?: string;
  email: string;
  isActive: boolean; // <-- fix: use isActive for API, required
};
