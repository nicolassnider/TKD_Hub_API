export type Dojaang = {
  id: number;
  name: string;
  email: string;
  address: string;
  phoneNumber: string;
  koreanName: string;
  koreanNamePhonetic: string;
  coachId?: number | null;
  coachName?: string;
  isActive?: boolean;
  location?: string;
};
