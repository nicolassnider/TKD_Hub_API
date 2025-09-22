export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  dojaangId?: number;
  dojaangName?: string;
  currentRankId?: number;
  beltLevel?: string;
  joinDate?: string;
  isActive: boolean;
  roles: string[];
  managedDojaangIds?: number[];
  fullName?: string;
}

export interface CreateUserRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  dojaangId?: number;
  currentRankId?: number;
  roles: string[];
  isActive: boolean;
}

export interface UpdateUserRequest {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  dateOfBirth?: string;
  dojaangId?: number;
  currentRankId?: number;
  roles: string[];
  isActive: boolean;
}

export interface UserRole {
  id: number;
  name: string;
}

export interface Dojaang {
  id: number;
  name: string;
  location?: string;
}

export interface Rank {
  id: number;
  name: string;
  order: number;
}
