import { ID, BaseEntity, ISODate, Gender } from "./common";

export interface User extends BaseEntity {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: ISODate;
  gender: number; // API returns number (0=unspecified, 1=male, 2=female)
  dojaangId: number;
  dojaangName?: string;
  currentRankId?: number;
  currentRankName?: string;
  beltLevel?: string;
  joinDate?: ISODate;
  isActive: boolean;
  roles?: string[];
  managedDojaangIds?: number[];
  fullName?: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  dateOfBirth?: ISODate;
  gender?: Gender;
  dojaangId?: ID;
  currentRankId?: ID;
  roles: string[];
  isActive: boolean;
}

export interface UpdateUserRequest {
  id: ID;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: ISODate;
  gender?: Gender;
  dojaangId?: ID;
  currentRankId?: ID;
  roles: string[];
  isActive: boolean;
}

export interface UserRole extends BaseEntity {
  name: string;
  description?: string;
}

export interface Rank {
  id: number;
  name: string;
  order: number;
}
