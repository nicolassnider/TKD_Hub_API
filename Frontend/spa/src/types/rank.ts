import { ID, BaseEntity } from "./common";

// Belt color enum
export enum BeltColor {
  White = 0,
  Yellow = 1,
  Green = 2,
  Blue = 3,
  Red = 4,
  Black = 5,
}

// Rank interface
export interface Rank extends BaseEntity {
  name: string;
  koreanName?: string;
  beltColor: BeltColor | string;
  orderIndex: number;
  description?: string;
  isActive?: boolean;
}

// Rank creation DTO
export interface CreateRankDto {
  name: string;
  koreanName?: string;
  beltColor: BeltColor | string;
  orderIndex: number;
  description?: string;
  isActive?: boolean;
}

// Rank update DTO
export interface UpdateRankDto extends CreateRankDto {
  id: ID;
}

// Simplified Rank for dropdowns/selectors
export interface RankOption {
  id: ID;
  name: string;
  koreanName?: string;
  beltColor: string;
  orderIndex: number;
}
