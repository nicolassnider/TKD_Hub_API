import { ID, BaseEntity, AuditFields } from "./common";

// Dojaang (School/Location) interface
export interface Dojaang extends BaseEntity, Partial<AuditFields> {
  name: string;
  location: string;
  address: string;
  city?: string;
  phoneNumber: string;
  email: string;
  koreanName?: string;
  description?: string;
  isActive?: boolean;
}

// Dojaang creation DTO
export interface CreateDojaangDto {
  name: string;
  location: string;
  address: string;
  phoneNumber: string;
  email: string;
  koreanName?: string;
  description?: string;
  isActive?: boolean;
}

// Dojaang update DTO
export interface UpdateDojaangDto extends CreateDojaangDto {
  id: ID;
}

// Simplified Dojaang for dropdowns/selectors
export interface DojaangOption {
  id: ID;
  name: string;
  location?: string;
}
